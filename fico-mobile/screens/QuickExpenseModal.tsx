import { useState, useEffect } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity, Modal,
  TextInput, SafeAreaView, ScrollView, ActivityIndicator
} from 'react-native';
import { apiRequest } from '../services/api';

const C = {
  primary: '#0EA5B0', primaryLight: '#E0F7F8',
  navy: '#1E3A5F', border: '#D9E2E8',
  textSecondary: '#4E6478', textMuted: '#94A3B4',
  white: '#FFFFFF', neutral: '#EFF3F5', danger: '#EF4444',
};

type Props = {
  visible: boolean;
  onClose: () => void;
  onSaved: () => void;
};

export function QuickExpenseModal({ visible, onClose, onSaved }: Props) {
  const [amount, setAmount] = useState('');
  const [note, setNote] = useState('');
  const [categories, setCategories] = useState<any[]>([]);
  const [selectedCat, setSelectedCat] = useState<any>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (visible) fetchCategories();
  }, [visible]);

  const fetchCategories = async () => {
    try {
      const data = await apiRequest('/categories');
      setCategories(data || []);
      if (data?.length > 0) setSelectedCat(data[0]);
    } catch (e) {
      console.log('Categories error:', e);
    }
  };

  const handleSave = async () => {
    if (!amount || !selectedCat) return;
    setSaving(true);
    try {
      await apiRequest('/transactions', {
        method: 'POST',
        body: JSON.stringify({
          type: 'expense',
          amount: parseFloat(amount),
          category_id: selectedCat.id,
          note: note || selectedCat.name,
          transaction_at: new Date().toISOString(),
        }),
      });
      setAmount('');
      setNote('');
      onSaved();
    } catch (e) {
      console.log('Save error:', e);
    } finally {
      setSaving(false);
    }
  };

  return (
    <Modal visible={visible} animationType="slide" presentationStyle="pageSheet">
      <SafeAreaView style={[s.safe, { backgroundColor: C.white }]}>
        <View style={s.header}>
          <TouchableOpacity onPress={onClose}>
            <Text style={s.cancel}>İptal</Text>
          </TouchableOpacity>
          <Text style={s.title}>Hızlı Gider</Text>
          <TouchableOpacity onPress={handleSave} disabled={saving || !amount}>
            <Text style={[s.save, (!amount || saving) && { opacity: 0.4 }]}>
              {saving ? '...' : 'Kaydet'}
            </Text>
          </TouchableOpacity>
        </View>

        <ScrollView contentContainerStyle={s.body}>
          <Text style={s.label}>Tutar (₺)</Text>
          <TextInput
            style={s.amountInput}
            placeholder="0"
            placeholderTextColor={C.textMuted}
            value={amount}
            onChangeText={setAmount}
            keyboardType="numeric"
            autoFocus
          />

          <Text style={s.label}>Kategori</Text>
          <View style={s.catGrid}>
            {categories.map(cat => (
              <TouchableOpacity
                key={cat.id}
                style={[s.catBtn, selectedCat?.id === cat.id && s.catBtnActive]}
                onPress={() => setSelectedCat(cat)}
              >
                <Text style={{ fontSize: 20 }}>{cat.icon || '📦'}</Text>
                <Text style={[s.catLabel, selectedCat?.id === cat.id && { color: C.primary }]}>
                  {cat.name}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          <Text style={s.label}>Not (opsiyonel)</Text>
          <TextInput
            style={s.input}
            placeholder="Örn: Akşam yemeği"
            placeholderTextColor={C.textMuted}
            value={note}
            onChangeText={setNote}
          />
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
  save: { fontSize: 15, color: C.primary, fontWeight: '500' },
  body: { padding: 16 },
  label: { fontSize: 13, fontWeight: '500', color: C.textSecondary, marginBottom: 8, marginTop: 8 },
  amountInput: {
    fontSize: 36, fontWeight: '600', color: C.navy,
    borderBottomWidth: 2, borderBottomColor: C.primary,
    paddingBottom: 8, marginBottom: 16, textAlign: 'center',
  },
  catGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 8 },
  catBtn: {
    alignItems: 'center', padding: 12, borderRadius: 12,
    borderWidth: 1.5, borderColor: C.border, width: '22%',
  },
  catBtnActive: { borderColor: C.primary, backgroundColor: C.primaryLight },
  catLabel: { fontSize: 10, color: C.textSecondary, marginTop: 4, textAlign: 'center' },
  input: {
    height: 48, borderWidth: 1.5, borderColor: C.border,
    borderRadius: 8, paddingHorizontal: 14, fontSize: 14, color: C.navy,
  },
});
