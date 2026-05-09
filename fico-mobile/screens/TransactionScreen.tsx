import { useState } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity,
  SafeAreaView, TextInput
} from 'react-native';
import { TransactionDetailModal } from './TransactionDetailModal';

const C = {
  primary: '#0EA5B0', navy: '#1E3A5F', bg: '#F0FBFC',
  border: '#D9E2E8', textSecondary: '#4E6478', textMuted: '#94A3B4',
  danger: '#EF4444', success: '#10B981', white: '#FFFFFF', neutral: '#EFF3F5',
};

type Props = { onBack: () => void };

const TRANSACTIONS = [
  { id: '1', icon: '🍔', name: 'Starbucks',    cat: 'Yiyecek',  amount: -85,   color: '#FEF3C7', date: '24 Nis' },
  { id: '2', icon: '💰', name: 'Nisan Bursu',  cat: 'Gelir',    amount: 3500,  color: '#D1FAE5', date: '24 Nis' },
  { id: '3', icon: '🛒', name: 'Migros',       cat: 'Market',   amount: -320,  color: '#E0F7F8', date: '23 Nis' },
  { id: '4', icon: '📱', name: 'Netflix',      cat: 'Abonelik', amount: -180,  color: '#EDE9FE', date: '23 Nis' },
  { id: '5', icon: '🚌', name: 'Metro',        cat: 'Ulaşım',   amount: -45,   color: '#E0F7F8', date: '22 Nis' },
  { id: '6', icon: '👕', name: 'Zara',         cat: 'Giyim',    amount: -650,  color: '#FEE2E2', date: '22 Nis' },
  { id: '7', icon: '💰', name: 'Harçlık',      cat: 'Gelir',    amount: 2000,  color: '#D1FAE5', date: '20 Nis' },
  { id: '8', icon: '🍔', name: 'Burger King',  cat: 'Yiyecek',  amount: -120,  color: '#FEF3C7', date: '20 Nis' },
];

type Filter = 'all' | 'expense' | 'income';
type Transaction = typeof TRANSACTIONS[0];

export function TransactionScreen({ onBack }: Props) {
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState<Filter>('all');
  const [selectedTx, setSelectedTx] = useState<Transaction | null>(null);

  const filtered = TRANSACTIONS.filter(t => {
    if (filter === 'expense' && t.amount > 0) return false;
    if (filter === 'income' && t.amount < 0) return false;
    if (search && !t.name.toLowerCase().includes(search.toLowerCase()) &&
        !t.cat.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  const groups: Record<string, typeof TRANSACTIONS> = {};
  for (const t of filtered) {
    if (!groups[t.date]) groups[t.date] = [];
    groups[t.date].push(t);
  }

  return (
    <SafeAreaView style={[s.safe, { backgroundColor: C.bg }]}>
      <View style={s.header}>
        <TouchableOpacity onPress={onBack} style={s.backBtn}>
          <Text style={s.backText}>← Geri</Text>
        </TouchableOpacity>
        <Text style={s.title}>İşlemler</Text>
        <View style={{ width: 60 }} />
      </View>

      <View style={s.filterBar}>
        <View style={s.searchWrap}>
          <TextInput
            style={s.search}
            placeholder="Ara..."
            placeholderTextColor={C.textMuted}
            value={search}
            onChangeText={setSearch}
          />
        </View>
        <View style={s.toggle}>
          {(['all', 'expense', 'income'] as Filter[]).map(f => (
            <TouchableOpacity
              key={f}
              style={[s.toggleBtn, filter === f && s.toggleActive]}
              onPress={() => setFilter(f)}
            >
              <Text style={[s.toggleText, filter === f && s.toggleTextActive]}>
                {f === 'all' ? 'Tümü' : f === 'expense' ? 'Gider' : 'Gelir'}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ padding: 16, paddingBottom: 40 }}>
        {Object.entries(groups).map(([date, txs]) => (
          <View key={date} style={{ marginBottom: 16 }}>
            <View style={s.groupHeader}>
              <Text style={s.groupDate}>{date}</Text>
              <Text style={[s.groupTotal, {
                color: txs.reduce((s, t) => s + t.amount, 0) >= 0 ? C.success : C.danger
              }]}>
                {txs.reduce((s, t) => s + t.amount, 0) >= 0 ? '+' : ''}
                ₺{Math.abs(txs.reduce((s, t) => s + t.amount, 0)).toLocaleString('tr-TR')}
              </Text>
            </View>
            <View style={s.card}>
              {txs.map((tx, i) => (
                <TouchableOpacity
                  key={tx.id}
                  style={[s.txRow, i < txs.length - 1 && s.txBorder]}
                  onPress={() => setSelectedTx(tx)}
                >
                  <View style={[s.txIcon, { backgroundColor: tx.color }]}>
                    <Text style={{ fontSize: 18 }}>{tx.icon}</Text>
                  </View>
                  <View style={s.txInfo}>
                    <Text style={s.txName}>{tx.name}</Text>
                    <Text style={s.txCat}>{tx.cat}</Text>
                  </View>
                  <Text style={[s.txAmount, { color: tx.amount < 0 ? C.danger : C.success }]}>
                    {tx.amount < 0 ? '-' : '+'}₺{Math.abs(tx.amount).toLocaleString('tr-TR')}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        ))}
        {filtered.length === 0 && (
          <View style={s.empty}>
            <Text style={{ fontSize: 32, marginBottom: 8 }}>🔍</Text>
            <Text style={s.emptyText}>Sonuç bulunamadı</Text>
          </View>
        )}
      </ScrollView>

      <TransactionDetailModal
        visible={!!selectedTx}
        transaction={selectedTx}
        onClose={() => setSelectedTx(null)}
      />
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  safe: { flex: 1 },
  header: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: 16, paddingVertical: 12,
    backgroundColor: C.white, borderBottomWidth: 1, borderBottomColor: C.border,
  },
  backBtn: { width: 60 },
  backText: { fontSize: 14, color: C.primary, fontWeight: '500' },
  title: { fontSize: 16, fontWeight: '600', color: C.navy },
  filterBar: { padding: 12, backgroundColor: C.white, borderBottomWidth: 1, borderBottomColor: C.border, gap: 8 },
  searchWrap: {
    height: 40, borderWidth: 1.5, borderColor: C.border,
    borderRadius: 8, paddingHorizontal: 12, justifyContent: 'center',
  },
  search: { fontSize: 14, color: C.navy },
  toggle: { flexDirection: 'row', backgroundColor: '#EFF3F5', borderRadius: 8, padding: 3, gap: 2 },
  toggleBtn: { flex: 1, alignItems: 'center', paddingVertical: 6, borderRadius: 6 },
  toggleActive: { backgroundColor: C.white },
  toggleText: { fontSize: 13, color: C.textSecondary },
  toggleTextActive: { color: C.primary, fontWeight: '500' },
  groupHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 6, paddingHorizontal: 4 },
  groupDate: { fontSize: 12, fontWeight: '500', color: C.textSecondary },
  groupTotal: { fontSize: 12, fontWeight: '500' },
  card: { backgroundColor: C.white, borderRadius: 16, borderWidth: 1, borderColor: C.border },
  txRow: { flexDirection: 'row', alignItems: 'center', gap: 12, padding: 14 },
  txBorder: { borderBottomWidth: 1, borderBottomColor: '#EFF3F5' },
  txIcon: { width: 40, height: 40, borderRadius: 10, alignItems: 'center', justifyContent: 'center' },
  txInfo: { flex: 1 },
  txName: { fontSize: 14, fontWeight: '500', color: C.navy },
  txCat: { fontSize: 12, color: C.textMuted, marginTop: 2 },
  txAmount: { fontSize: 14, fontWeight: '500' },
  empty: { alignItems: 'center', paddingVertical: 48 },
  emptyText: { fontSize: 14, color: C.textMuted },
});