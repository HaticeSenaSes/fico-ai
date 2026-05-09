import { useState } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity,
  SafeAreaView, Modal, TextInput, Switch
} from 'react-native';

const C = {
  primary: '#0EA5B0', primaryLight: '#E0F7F8', primaryDark: '#0B8A94',
  navy: '#1E3A5F', bg: '#F0FBFC', border: '#D9E2E8',
  textSecondary: '#4E6478', textMuted: '#94A3B4',
  danger: '#EF4444', success: '#10B981', white: '#FFFFFF', neutral: '#EFF3F5',
};

type Props = { onBack: () => void };

const SOURCES = [
  { id: '1', name: 'Burs', type: 'Burs', amount: 3500, frequency: 'Aylık', active: true },
  { id: '2', name: 'Harçlık', type: 'Harçlık', amount: 2000, frequency: 'Aylık', active: true },
  { id: '3', name: 'Part-time', type: 'Part-time', amount: 1500, frequency: 'Aylık', active: false },
];

const HISTORY = [
  { id: '1', source: 'Burs', amount: 3500, date: '1 Nis 2026', note: 'Nisan bursu' },
  { id: '2', source: 'Harçlık', amount: 2000, date: '5 Nis 2026', note: 'Nisan harçlığı' },
  { id: '3', source: 'Burs', amount: 3500, date: '1 Mar 2026', note: 'Mart bursu' },
  { id: '4', source: 'Harçlık', amount: 2000, date: '5 Mar 2026', note: 'Mart harçlığı' },
];

const MONTHS: Record<string, typeof HISTORY> = {
  'Nisan 2026': HISTORY.filter(h => h.date.includes('Nis')),
  'Mart 2026': HISTORY.filter(h => h.date.includes('Mar')),
};

export function IncomeScreen({ onBack }: Props) {
  const [sources, setSources] = useState(SOURCES);
  const [confirmed, setConfirmed] = useState<string[]>([]);
  const [showAdd, setShowAdd] = useState(false);
  const [newName, setNewName] = useState('');
  const [newAmount, setNewAmount] = useState('');
  const [newType, setNewType] = useState('Burs');

  const totalThisMonth = HISTORY
    .filter(h => h.date.includes('Nis'))
    .reduce((s, h) => s + h.amount, 0);

  const toggleActive = (id: string) => {
    setSources(prev => prev.map(s => s.id === id ? { ...s, active: !s.active } : s));
  };

  const toggleConfirm = (id: string) => {
    setConfirmed(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);
  };

  return (
    <SafeAreaView style={[s.safe, { backgroundColor: C.bg }]}>

      <View style={s.header}>
        <TouchableOpacity onPress={onBack} style={s.backBtn}>
          <Text style={s.backText}>← Geri</Text>
        </TouchableOpacity>
        <Text style={s.title}>Gelir Yönetimi</Text>
        <TouchableOpacity onPress={() => setShowAdd(true)}>
          <Text style={s.addBtn}>+ Ekle</Text>
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={s.scroll}>

        {/* Özet Kart */}
        <View style={s.summaryCard}>
          <Text style={s.summaryLabel}>Bu Ay Toplam Gelir</Text>
          <Text style={s.summaryAmount}>₺{totalThisMonth.toLocaleString('tr-TR')}</Text>
          <Text style={s.summaryMeta}>Nisan 2026 · {HISTORY.filter(h => h.date.includes('Nis')).length} kaynaktan</Text>
        </View>

        {/* Bu Ay Aldım Mı? */}
        <Text style={s.sectionTitle}>Bu Ay Aldım Mı?</Text>
        <View style={s.card}>
          {sources.filter(s => s.active).map((src, i) => (
            <View key={src.id} style={[s.confirmRow, i < sources.filter(s => s.active).length - 1 && s.rowBorder]}>
              <View style={{ flex: 1 }}>
                <Text style={s.srcName}>{src.name}</Text>
                <Text style={s.srcMeta}>₺{src.amount.toLocaleString('tr-TR')} · {src.frequency}</Text>
              </View>
              <TouchableOpacity
                style={[s.confirmBtn, confirmed.includes(src.id) && s.confirmedBtn]}
                onPress={() => toggleConfirm(src.id)}
              >
                <Text style={[s.confirmBtnText, confirmed.includes(src.id) && s.confirmedBtnText]}>
                  {confirmed.includes(src.id) ? '✓ Alındı' : 'Aldım'}
                </Text>
              </TouchableOpacity>
            </View>
          ))}
        </View>

        {/* Gelir Kaynakları */}
        <Text style={s.sectionTitle}>Gelir Kaynakları</Text>
        <View style={s.card}>
          {sources.map((src, i) => (
            <View key={src.id} style={[s.sourceRow, i < sources.length - 1 && s.rowBorder]}>
              <View style={s.sourceIcon}>
                <Text style={{ fontSize: 18 }}>💰</Text>
              </View>
              <View style={{ flex: 1 }}>
                <Text style={s.srcName}>{src.name}</Text>
                <Text style={s.srcMeta}>{src.type} · {src.frequency} · ₺{src.amount.toLocaleString('tr-TR')}</Text>
              </View>
              <Switch
                value={src.active}
                onValueChange={() => toggleActive(src.id)}
                trackColor={{ false: C.neutral, true: C.primaryLight }}
                thumbColor={src.active ? C.primary : '#fff'}
              />
            </View>
          ))}
        </View>

        {/* Geçmiş */}
        <Text style={s.sectionTitle}>Gelir Geçmişi</Text>
        {Object.entries(MONTHS).map(([month, entries]) => (
          <View key={month} style={{ marginBottom: 12 }}>
            <View style={s.groupHeader}>
              <Text style={s.groupMonth}>{month}</Text>
              <Text style={[s.groupTotal, { color: C.success }]}>
                +₺{entries.reduce((s, e) => s + e.amount, 0).toLocaleString('tr-TR')}
              </Text>
            </View>
            <View style={s.card}>
              {entries.map((e, i) => (
                <View key={e.id} style={[s.sourceRow, i < entries.length - 1 && s.rowBorder]}>
                  <View style={[s.sourceIcon, { backgroundColor: '#D1FAE5' }]}>
                    <Text style={{ fontSize: 18 }}>💰</Text>
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={s.srcName}>{e.note}</Text>
                    <Text style={s.srcMeta}>{e.source} · {e.date}</Text>
                  </View>
                  <Text style={[s.srcName, { color: C.success }]}>
                    +₺{e.amount.toLocaleString('tr-TR')}
                  </Text>
                </View>
              ))}
            </View>
          </View>
        ))}

      </ScrollView>

      {/* Kaynak Ekleme Modal */}
      <Modal visible={showAdd} animationType="slide" presentationStyle="pageSheet">
        <SafeAreaView style={[s.safe, { backgroundColor: C.white }]}>
          <View style={s.modalHeader}>
            <TouchableOpacity onPress={() => setShowAdd(false)}>
              <Text style={s.modalCancel}>İptal</Text>
            </TouchableOpacity>
            <Text style={s.modalTitle}>Gelir Kaynağı Ekle</Text>
            <TouchableOpacity onPress={() => {
              if (newName && newAmount) {
                setSources(prev => [...prev, {
                  id: Date.now().toString(),
                  name: newName,
                  type: newType,
                  amount: parseFloat(newAmount),
                  frequency: 'Aylık',
                  active: true,
                }]);
                setShowAdd(false);
                setNewName('');
                setNewAmount('');
              }
            }}>
              <Text style={[s.modalCancel, { color: C.primary }]}>Kaydet</Text>
            </TouchableOpacity>
          </View>
          <View style={s.modalBody}>
            <Text style={s.inputLabel}>Kaynak Türü</Text>
            <View style={s.typeRow}>
              {['Burs', 'Harçlık', 'Part-time', 'Serbest', 'Diğer'].map(t => (
                <TouchableOpacity
                  key={t}
                  style={[s.typeChip, newType === t && s.typeChipActive]}
                  onPress={() => setNewType(t)}
                >
                  <Text style={[s.typeChipText, newType === t && s.typeChipTextActive]}>{t}</Text>
                </TouchableOpacity>
              ))}
            </View>
            <Text style={s.inputLabel}>Kaynak Adı</Text>
            <TextInput
              style={s.input}
              placeholder="Örn: Ocak bursu"
              placeholderTextColor={C.textMuted}
              value={newName}
              onChangeText={setNewName}
            />
            <Text style={s.inputLabel}>Aylık Tutar (₺)</Text>
            <TextInput
              style={s.input}
              placeholder="0"
              placeholderTextColor={C.textMuted}
              value={newAmount}
              onChangeText={setNewAmount}
              keyboardType="numeric"
            />
          </View>
        </SafeAreaView>
      </Modal>

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
  addBtn: { fontSize: 14, color: C.primary, fontWeight: '500', width: 60, textAlign: 'right' },
  scroll: { padding: 16, paddingBottom: 40 },
  summaryCard: {
    backgroundColor: C.primary, borderRadius: 16, padding: 20,
    marginBottom: 16, alignItems: 'center',
  },
  summaryLabel: { fontSize: 12, color: 'rgba(255,255,255,0.8)', marginBottom: 4 },
  summaryAmount: { fontSize: 36, fontWeight: '600', color: C.white },
  summaryMeta: { fontSize: 12, color: 'rgba(255,255,255,0.7)', marginTop: 4 },
  sectionTitle: { fontSize: 12, fontWeight: '600', color: C.textMuted, marginBottom: 8, marginLeft: 4 },
  card: {
    backgroundColor: C.white, borderRadius: 16,
    borderWidth: 1, borderColor: C.border, marginBottom: 16,
  },
  confirmRow: { flexDirection: 'row', alignItems: 'center', padding: 14, gap: 12 },
  rowBorder: { borderBottomWidth: 1, borderBottomColor: C.neutral },
  srcName: { fontSize: 14, fontWeight: '500', color: C.navy },
  srcMeta: { fontSize: 12, color: C.textMuted, marginTop: 2 },
  confirmBtn: {
    paddingHorizontal: 14, paddingVertical: 7,
    backgroundColor: C.primaryLight, borderRadius: 8,
  },
  confirmedBtn: { backgroundColor: '#D1FAE5' },
  confirmBtnText: { fontSize: 13, fontWeight: '500', color: C.primary },
  confirmedBtnText: { color: '#065f46' },
  sourceRow: { flexDirection: 'row', alignItems: 'center', padding: 14, gap: 12 },
  sourceIcon: {
    width: 40, height: 40, borderRadius: 10,
    backgroundColor: '#D1FAE5', alignItems: 'center', justifyContent: 'center',
  },
  groupHeader: {
    flexDirection: 'row', justifyContent: 'space-between',
    marginBottom: 8, paddingHorizontal: 4,
  },
  groupMonth: { fontSize: 12, fontWeight: '600', color: C.textSecondary },
  groupTotal: { fontSize: 12, fontWeight: '600' },
  modalHeader: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    padding: 16, borderBottomWidth: 1, borderBottomColor: C.border,
  },
  modalCancel: { fontSize: 15, color: C.textSecondary },
  modalTitle: { fontSize: 16, fontWeight: '600', color: C.navy },
  modalBody: { padding: 16 },
  inputLabel: { fontSize: 13, fontWeight: '500', color: C.textSecondary, marginBottom: 8 },
  input: {
    height: 48, borderWidth: 1.5, borderColor: C.border,
    borderRadius: 8, paddingHorizontal: 14, fontSize: 14,
    color: C.navy, marginBottom: 16, backgroundColor: C.white,
  },
  typeRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 16 },
  typeChip: {
    paddingHorizontal: 14, paddingVertical: 8,
    borderRadius: 99, borderWidth: 1.5, borderColor: C.border,
  },
  typeChipActive: { backgroundColor: C.primaryLight, borderColor: C.primary },
  typeChipText: { fontSize: 13, color: C.textSecondary },
  typeChipTextActive: { color: C.primaryDark, fontWeight: '500' },
});