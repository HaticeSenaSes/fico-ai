from sqlalchemy.orm import Session
from sqlalchemy import func, extract
from app.models.models import Transaction, AIInsight
from datetime import datetime, timezone, timedelta
from typing import Optional
import json
import uuid
import os

def generate_insight(db: Session, user_id: str) -> Optional[AIInsight]:
    now = datetime.now(timezone.utc)
    
    # Son 30 günün işlemlerini al
    thirty_days_ago = now - timedelta(days=30)
    txs = db.query(Transaction).filter(
        Transaction.user_id == user_id,
        Transaction.type == "expense",
        Transaction.is_deleted == False,
        Transaction.transaction_at >= thirty_days_ago,
    ).all()

    if len(txs) < 5:
        return None

    # Kural motoru: kategori bazlı analiz
    category_totals: dict = {}
    for tx in txs:
        cat_id = tx.category_id
        if cat_id not in category_totals:
            category_totals[cat_id] = 0
        category_totals[cat_id] += float(tx.amount)

    total_expense = sum(category_totals.values())
    top_category = max(category_totals, key=lambda k: category_totals[k])
    top_pct = round((category_totals[top_category] / total_expense) * 100, 1)

    # Haftalık analiz
    weekly: dict = {i: 0 for i in range(7)}
    for tx in txs:
        day = tx.transaction_at.weekday()
        weekly[day] += float(tx.amount)

    max_day = max(weekly, key=lambda k: weekly[k])
    day_names = ["Pazartesi", "Salı", "Çarşamba", "Perşembe", "Cuma", "Cumartesi", "Pazar"]

    rule_data = {
        "total_expense": total_expense,
        "top_category_pct": top_pct,
        "max_spending_day": day_names[max_day],
        "transaction_count": len(txs),
    }

    # Claude API ile metin üret
    body = _generate_text_with_claude(rule_data)

    insight = AIInsight(
        id=str(uuid.uuid4()),
        user_id=user_id,
        insight_type="pattern",
        title="Harcama Analizi",
        body=body,
        rule_data=json.dumps(rule_data),
    )
    db.add(insight)
    db.commit()
    db.refresh(insight)
    return insight

def _generate_text_with_claude(rule_data: dict) -> str:
    try:
        import anthropic
        api_key = os.getenv("ANTHROPIC_API_KEY")
        if not api_key or api_key == "your-anthropic-api-key-here":
            return _fallback_text(rule_data)
        
        client = anthropic.Anthropic(api_key=api_key)
        message = client.messages.create(
            model="claude-sonnet-4-20250514",
            max_tokens=150,
            system="Sen bir kişisel finans koçusun. Kullanıcının harcama verilerini analiz edip 1-2 cümleyle Türkçe, samimi bir içgörü yaz. Asla finansal tavsiye verme.",
            messages=[{
                "role": "user",
                "content": f"Veri: {json.dumps(rule_data, ensure_ascii=False)}. Kısa bir içgörü yaz."
            }]
        )
        return message.content[0].text
    except Exception:
        return _fallback_text(rule_data)

def _fallback_text(rule_data: dict) -> str:
    day = rule_data.get("max_spending_day", "")
    pct = rule_data.get("top_category_pct", 0)
    return f"{day} günleri en yüksek harcama günün. En çok harcadığın kategori toplam harcamanın %{pct}'ini oluşturuyor."