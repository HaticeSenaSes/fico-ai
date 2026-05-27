import { useState, useEffect } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity, Modal,
  TextInput, SafeAreaView, ScrollView, ActivityIndicator
} from 'react-native';
import { apiRequest } from '../services/api';

const C = {
  primary: '#0EA5B0', primaryLight: '#E0F7F8', primaryDark: '#0B8A94',
  navy: '#1E3A5F', border: '#D9E2E8', textSecondary: '#4E6478',
  textMuted: '#94A3B4', danger: '#EF4444', white: '#FFFFFF', neutral: '#EFF3F5',
};

const DEFAULT_CATS = [
  { id: 'yiyecek', icon: '🍔', name: 'Yiyecek' },
  { id: 'ulasim', icon: '🚌', name: 'Ulaşım' },
  { id: 'market', icon: '🛒', name: 'Market' },
  { id: 'eglence', icon: '🎮', name: 'Eğlence' },
  { id: 'saglik', icon: '💊', name: 'Sağlık' },
  { id: 'giyim', icon: '👕', name: 'Giyim' },
  { id: 'kira', icon: '🏠', name: 'Kira' },
  { id: 'egitim', icon: '📚', name: 'Eğitim' },
  { id: 'abonelik', icon: '📱', name: 'Abonelik' },
  { id: 'diger', icon: '📦', name: 'Diğer' },
];

const CAT_ICONS: Record<string, string> = {
  'Yiyecek': '🍔', 'Ulaşım': '🚌', 'Market': '🛒',
  'Eğlence': '🎮', 'Sağlık': '💊', 'Giyim': '👕',
  'Kira': '🏠', 'Eğitim': '📚', 'Abonelik': '📱', 'Diğer': '📦',
};

type Props = { visible: boolean; onClose: () => void; onSaved: () => void };

export function QuickExpenseModal({ visible, onClose, onSaved }: Props) {
  const [amount, setAmount] = useState('');
  const [note, setNote] = useState('');
  const [selectedCat, setSelectedCat] = useState('');
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);
  const [showNewCat, setShowNewCat] = useState(false);
  const [newCatName, setNewCatName] = useState('');
  const [cats, setCats] = useState<any[]>(DEFAULT_CATS);

  useEffect(() => {
    if (visible) {
      apiRequest('/categories').then((data: any) => {
        if (Array.isArray(data) && data.length > 0) {
          const names = data.map((c: any) => c.name);
          const extra = DEFAULT_CATS.filter(d => !names.includes(d.name));
          setCats([...data, ...extra]);
        }
      }).catch(() => {});
    }
  }, [visible]);

  const reset = () => {
    setAmount(''); setNote(''); setSelectedCat('');
    setError(''); setShowNewCat(''); setNewCatName('');
  };

  const handleSave = async () => {
    if (!amount || parseFloat(amount) <= 0) { setError('Tutar giriniz.'); return; }
    if (!selectedCat) { setError('Kategori seçiniz.'); return; }
    setSaving(true);
    try {
      await apiRequest('/transactions', {
        method: 'POST',
        body: JSON.stringify({
          type: 'expense',
          amount: parseFloat(amount),
          category_id: selectedCat,
          note: note || null,
          transaction_at: new Date().toISOString(),
        }),
      });
      reset();
      onSaved();
    } catch (e: any) {
      setError('Kaydedilemedi.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <Modal visible={visible} animationType="slide" presentationStyle="pageSheet" onRequestClose={() => { reset(); onClose(); }}>
      <SafeAreaView style={[s.safe, { backgroundColor: C.white }]}>
        <View style={s.header}>
          <TouchableOpacity onPress={() => { reset(); onClose(); }}>
            <Text style={s.cancel}>İptal</Text>
          </TouchableOpacity>
          <Text style={s.title}>Hızlı Gider</Text>
          <TouchableOpacity onPress={handleSave} disabled={saving || !amount}>
            <Text style={[s.save, (!amount || saving) && { opacity: 0.4 }]}>
              {saving ? '...' : 'Kaydet'}
            </Text>
          </TouchableOpacity>
        </View>

        <ScrollView contentContainerStyle={s.body} keyboardShouldPersistTaps="handled">
          <Text style={s.label}>Tutar (₺)</Text>
          <TextInput
            style={s.amountInput}
            placeholder="0"
            placeholderTextColor={C.textMuted}
            value={amount}
            onChangeText={t => { setAmount(t); setError(''); }}
            keyboardType="numeric"
            autoFocus
          />

          <Text style={s.label}>Kategori</Text>
          <View style={s.catGrid}>
            {cats.map(cat => (
              <TouchableOpacity
                key={cat.id}
                style={[s.catBtn, selectedCat === cat.id && s.catBtnActive]}
                onPress={() => { setSelectedCat(cat.id); setError(''); }}
              >
                <Text style={{ fontSize: 22 }}>{CAT_ICONS[cat.name] || cat.icon || '📦'}</Text>
                <Text style={[s.catLabel, selectedCat === cat.id && { color: C.primary }]}>{cat.name}</Text>
              </TouchableOpacity>
            ))}
            <TouchableOpacity
              style={[s.catBtn, { borderStyle: 'dashed' }]}
              onPress={() => setShowNewCat(!showNewCat)}
            >
              <Text style={{ fontSize: 22 }}>➕</Text>
              <Text style={s.catLabel}>Yeni</Text>
            </TouchableOpacity>
          </View>

          {showNewCat && (
            <View style={{ marginBottom: 12, gap: 8 }}>
              <TextInput
                style={s.input}
                placeholder="Kategori adı"
                placeholderTextColor={C.textMuted}
                value={newCatName}
                onChangeText={setNewCatName}
              />
              <TouchableOpacity
                style={[s.saveNewBtn]}
                onPress={async () => {
                  if (!newCatName) return;
                  try {
                    const cat = await apiRequest('/categories', {
                      method: 'POST',
                      body: JSON.stringify({ name: newCatName, icon: '📦' }),
                    });
                    setCats((prev: any[]) => [...prev, cat]);
                    setSelectedCat(cat.id);
                    setShowNewCat(false);
                    setNewCatName('');
                  } catch(e) { console.log(e); }
                }}
              >
                <Text style={s.saveNewBtnText}>Kategori Ekle</Text>
              </TouchableOpacity>
            </View>
          )}

          {error ? <Text style={s.error}>{error}</Text> : null}

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
    padding: 16, borderBottomWidth: 1, borderBottomColor: '#D9E2E8',
  },
  cancel: { fontSize: 15, color: '#4E6478' },
  title: { fontSize: 16, fontWeight: '600', color: '#1E3A5F' },
  save: { fontSize: 15, color: '#0EA5B0', fontWeight: '500' },
  body: { padding: 16 },
  label: { fontSize: 13, fontWeight: '500', color: '#4E6478', marginBottom: 8, marginTop: 8 },
  amountInput: {
    fontSize: 36, fontWeight: '600', color: '#1E3A5F',
    borderBottomWidth: 2, borderBottomColor: '#0EA5B0',
    paddingBottom: 8, marginBottom: 16, textAlign: 'center',
  },
  catGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 8 },
  catBtn: {
    alignItems: 'center', padding: 12, borderRadius: 12,
    borderWidth: 1.5, borderColor: '#D9E2E8', width: '22%',
  },
  catBtnActive: { borderColor: '#0EA5B0', backgroundColor: '#E0F7F8' },
  catLabel: { fontSize: 10, color: '#4E6478', marginTop: 4, textAlign: 'center' },
  input: {
    height: 48, borderWidth: 1.5, borderColor: '#D9E2E8',
    borderRadius: 8, paddingHorizontal: 14, fontSize: 14, color: '#1E3A5F',
  },
  error: { fontSize: 12, color: '#EF4444', marginBottom: 8 },
  saveNewBtn: {
    height: 44, backgroundColor: '#0EA5B0',
    borderRadius: 8, alignItems: 'center', justifyContent: 'center',
  },
  saveNewBtnText: { color: '#FFFFFF', fontSize: 14, fontWeight: '600' },
});
