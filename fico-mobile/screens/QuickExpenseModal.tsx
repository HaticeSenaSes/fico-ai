import { useState } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity, TextInput,
  Modal, SafeAreaView, ScrollView
} from 'react-native';

const C = {
  primary: '#0EA5B0', primaryLight: '#E0F7F8', primaryDark: '#0B8A94',
  navy: '#1E3A5F', border: '#D9E2E8', textSecondary: '#4E6478',
  textMuted: '#94A3B4', danger: '#EF4444', white: '#FFFFFF', neutral: '#EFF3F5',
};

const CATS = [
  { id: 'yiyecek',  icon: '🍔', name: 'Yiyecek'  },
  { id: 'ulasim',   icon: '🚌', name: 'Ulaşım'   },
  { id: 'market',   icon: '🛒', name: 'Market'   },
  { id: 'eglence',  icon: '🎮', name: 'Eğlence'  },
  { id: 'saglik',   icon: '💊', name: 'Sağlık'   },
  { id: 'giyim',    icon: '👕', name: 'Giyim'    },
  { id: 'kira',     icon: '🏠', name: 'Kira'     },
  { id: 'egitim',   icon: '📚', name: 'Eğitim'   },
  { id: 'abonelik', icon: '📱', name: 'Abonelik' },
  { id: 'diger',    icon: '📦', name: 'Diğer'    },
];

type Props = { visible: boolean; onClose: () => void; onSaved: () => void };

export function QuickExpenseModal({ visible, onClose, onSaved }: Props) {
  const [step, setStep] = useState<'amount' | 'category'>('amount');
  const [amount, setAmount] = useState('');
  const [note, setNote] = useState('');
  const [selectedCat, setSelectedCat] = useState('');
  const [error, setError] = useState('');

  const reset = () => {
    setStep('amount');
    setAmount('');
    setNote('');
    setSelectedCat('');
    setError('');
  };

  const handleClose = () => { reset(); onClose(); };

  const handleNext = () => {
    if (!amount || parseFloat(amount) <= 0) {
      setError("Tutar 0'dan büyük olmalı.");
      return;
    }
    setError('');
    setStep('category');
  };

  const handleSave = () => {
    if (!selectedCat) { setError('Kategori seçmelisin.'); return; }
    reset();
    onSaved();
  };

  return (
    <Modal visible={visible} animationType="slide" presentationStyle="pageSheet" onRequestClose={handleClose}>
      <SafeAreaView style={[s.safe, { backgroundColor: C.white }]}>
        <View style={s.header}>
          <TouchableOpacity onPress={handleClose}>
            <Text style={s.cancel}>İptal</Text>
          </TouchableOpacity>
          <Text style={s.title}>Hızlı Gider</Text>
          <View style={{ width: 50 }} />
        </View>

        <View style={s.stepIndicator}>
          <View style={[s.stepDot, step === 'amount' && s.stepDotActive]} />
          <View style={s.stepLine} />
          <View style={[s.stepDot, step === 'category' && s.stepDotActive]} />
        </View>

        <ScrollView contentContainerStyle={s.body} keyboardShouldPersistTaps="handled">

          {step === 'amount' && (
            <>
              <Text style={s.stepLabel}>Ne kadar harcadın?</Text>
              <View style={s.amountRow}>
                <Text style={s.currency}>₺</Text>
                <TextInput
                  style={s.amountInput}
                  placeholder="0"
                  placeholderTextColor={C.textMuted}
                  value={amount}
                  onChangeText={t => { setAmount(t); setError(''); }}
                  keyboardType="numeric"
                  autoFocus
                />
              </View>
              <TextInput
                style={s.noteInput}
                placeholder="Not ekle (opsiyonel)"
                placeholderTextColor={C.textMuted}
                value={note}
                onChangeText={setNote}
                maxLength={100}
              />
              {error ? <Text style={s.error}>{error}</Text> : null}
              <TouchableOpacity style={s.nextBtn} onPress={handleNext}>
                <Text style={s.nextBtnText}>İleri →</Text>
              </TouchableOpacity>
            </>
          )}

          {step === 'category' && (
            <>
              <Text style={s.stepLabel}>Kategori seç</Text>
              <Text style={s.amountConfirm}>₺{parseFloat(amount).toLocaleString('tr-TR')}</Text>
              <View style={s.catGrid}>
                {CATS.map(cat => (
                  <TouchableOpacity
                    key={cat.id}
                    style={[s.catItem, selectedCat === cat.id && s.catItemActive]}
                    onPress={() => { setSelectedCat(cat.id); setError(''); }}
                  >
                    <Text style={{ fontSize: 24 }}>{cat.icon}</Text>
                    <Text style={[s.catName, selectedCat === cat.id && s.catNameActive]}>
                      {cat.name}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
              {error ? <Text style={s.error}>{error}</Text> : null}
              <View style={s.actionRow}>
                <TouchableOpacity
                  style={s.backBtn}
                  onPress={() => { setStep('amount'); setSelectedCat(''); }}
                >
                  <Text style={s.backBtnText}>← Geri</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[s.saveBtn, !selectedCat && s.saveBtnDisabled]}
                  disabled={!selectedCat}
                  onPress={handleSave}
                >
                  <Text style={s.saveBtnText}>Kaydet ✓</Text>
                </TouchableOpacity>
              </View>
            </>
          )}

        </ScrollView>
      </SafeAreaView>
    </Modal>
  );
}

const s = StyleSheet.create({
  safe: { flex: 1 },
  header: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    padding: 16, borderBottomWidth: 1, borderBottomColor: C.border,
  },
  cancel: { fontSize: 15, color: C.textSecondary },
  title: { fontSize: 16, fontWeight: '600', color: C.navy },
  stepIndicator: {
    flexDirection: 'row', alignItems: 'center',
    paddingHorizontal: 40, paddingVertical: 16,
  },
  stepDot: { width: 10, height: 10, borderRadius: 5, backgroundColor: C.border },
  stepDotActive: { backgroundColor: C.primary, width: 12, height: 12 },
  stepLine: { flex: 1, height: 2, backgroundColor: C.border, marginHorizontal: 8 },
  body: { padding: 24 },
  stepLabel: { fontSize: 16, fontWeight: '600', color: C.navy, marginBottom: 24, textAlign: 'center' },
  amountRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', marginBottom: 20 },
  currency: { fontSize: 40, fontWeight: '500', color: C.primary, marginRight: 4 },
  amountInput: {
    fontSize: 56, fontWeight: '500', color: C.navy,
    borderBottomWidth: 2, borderBottomColor: C.primary,
    minWidth: 120, textAlign: 'center', paddingBottom: 4,
  },
  noteInput: {
    height: 48, borderWidth: 1.5, borderColor: C.border,
    borderRadius: 8, paddingHorizontal: 14, fontSize: 14,
    color: C.navy, marginBottom: 16,
  },
  error: { fontSize: 12, color: C.danger, textAlign: 'center', marginBottom: 12 },
  nextBtn: {
    height: 52, backgroundColor: C.primary,
    borderRadius: 12, alignItems: 'center', justifyContent: 'center',
  },
  nextBtnText: { color: C.white, fontSize: 16, fontWeight: '600' },
  amountConfirm: {
    fontSize: 36, fontWeight: '600', color: C.primary,
    textAlign: 'center', marginBottom: 20,
  },
  catGrid: {
    flexDirection: 'row', flexWrap: 'wrap', gap: 10, marginBottom: 20,
  },
  catItem: {
    width: '18%', aspectRatio: 1, borderRadius: 12,
    borderWidth: 1.5, borderColor: C.border,
    alignItems: 'center', justifyContent: 'center', gap: 4,
  },
  catItemActive: { borderColor: C.primary, backgroundColor: C.primaryLight },
  catName: { fontSize: 9, color: C.textSecondary, textAlign: 'center' },
  catNameActive: { color: C.primaryDark, fontWeight: '500' },
  actionRow: { flexDirection: 'row', gap: 12 },
  backBtn: {
    height: 52, paddingHorizontal: 20,
    borderRadius: 12, borderWidth: 1.5, borderColor: C.border,
    alignItems: 'center', justifyContent: 'center',
  },
  backBtnText: { fontSize: 15, color: C.textSecondary },
  saveBtn: {
    flex: 1, height: 52, backgroundColor: C.primary,
    borderRadius: 12, alignItems: 'center', justifyContent: 'center',
  },
  saveBtnDisabled: { opacity: 0.45 },
  saveBtnText: { color: C.white, fontSize: 16, fontWeight: '600' },
});