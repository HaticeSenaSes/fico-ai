import { useState, useEffect } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity,
  SafeAreaView, Modal, TextInput, ActivityIndicator
} from 'react-native';
import { apiRequest } from '../services/api';

const C = {
  primary: '#0EA5B0', navy: '#1E3A5F', bg: '#F0FBFC', border: '#D9E2E8',
  textSecondary: '#4E6478', textMuted: '#94A3B4',
  success: '#10B981', white: '#FFFFFF', neutral: '#EFF3F5',
};

type Props = { onBack: () => void };

export function IncomeScreen({ onBack }: Props) {
  const [transactions, setTransactions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAdd, setShowAdd] = useState(false);
  const [newAmount, setNewAmount] = useState('');
  const [newNote, setNewNote] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => { fetchIncome(); }, []);

  const fetchIncome = async () => {
    setLoading(true);
    try {
      const data = await apiRequest('/transactions?type=income');
      setTransactions(data.data || []);
    } catch (e) {
      console.log('Income fetch error:', e);
    } finally {
      setLoading(false);
    }
  };

  const totalIncome = transactions.reduce((sum, t) => sum + Number(t.amount), 0);

  const handleSave = async () => {
    if (!newAmount) return;
    setSaving(true);
    try {
      const cats = await apiRequest('/categories');
      const digerCat = cats.find((c: any) => c.name === 'Diğer') || cats[cats.length - 1];
      await apiRequest('/transactions', {
        method: 'POST',
        body: JSON.stringify({
          type: 'income',
          amount: parseFloat(newAmount),
          category_id: digerCat.id,
          note: newNote || 'Gelir',
          transaction_at: new Date().toISOString(),
        }),
      });
      setShowAdd(false);
      setNewAmount('');
      setNewNote('');
      fetchIncome();
    } catch (e) {
      console.log('Income save error:', e);
    } finally {
      setSaving(false);
    }
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

      {loading ? (
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
          <ActivityIndicator color={C.primary} />
        </View>
      ) : (
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={s.scroll}>
          <View style={s.summaryCard}>
            <Text style={s.summaryLabel}>Toplam Gelir</Text>
            <Text style={s.summaryAmount}>₺{totalIncome.toLocaleString('tr-TR')}</Text>
            <Text style={s.summaryMeta}>{transactions.length} kayıt</Text>
          </View>
          <Text style={s.sectionTitle}>Gelir Geçmişi</Text>
          {transactions.length === 0 ? (
            <View style={s.empty}>
              <Text style={{ fontSize: 48, marginBottom: 12 }}>💰</Text>
              <Text style={s.emptyTitle}>Henüz gelir yok</Text>
              <Text style={s.emptySub}>+ Ekle butonuyla gelir ekle</Text>
            </View>
          ) : (
            <View style={s.card}>
              {transactions.map((tx, i) => (
                <View key={tx.id} style={[s.txRow, i < transactions.length - 1 && s.rowBorder]}>
                  <View style={s.txIcon}>
                    <Text style={{ fontSize: 18 }}>💰</Text>
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={s.txName}>{tx.note || 'Gelir'}</Text>
                    <Text style={s.txMeta}>{new Date(tx.transaction_at).toLocaleDateString('tr-TR')}</Text>
                  </View>
                  <Text style={[s.txAmount, { color: C.success }]}>
                    +₺{Number(tx.amount).toLocaleString('tr-TR')}
                  </Text>
                </View>
              ))}
            </View>
          )}
        </ScrollView>
      )}

      <Modal visible={showAdd} animationType="slide" presentationStyle="pageSheet">
        <SafeAreaView style={[s.safe, { backgroundColor: C.white }]}>
          <View style={s.modalHeader}>
            <TouchableOpacity onPress={() => setShowAdd(false)}>
              <Text style={s.modalCancel}>İptal</Text>
            </TouchableOpacity>
            <Text style={s.modalTitle}>Gelir Ekle</Text>
            <TouchableOpacity onPress={handleSave} disabled={saving}>
              <Text style={[s.modalCancel, { color: C.primary }]}>{saving ? '...' : 'Kaydet'}</Text>
            </TouchableOpacity>
          </View>
          <View style={s.modalBody}>
            <Text style={s.inputLabel}>Tutar (₺)</Text>
            <TextInput
              style={s.input}
              placeholder="0"
              placeholderTextColor={C.textMuted}
              value={newAmount}
              onChangeText={setNewAmount}
              keyboardType="numeric"
              autoFocus
            />
            <Text style={s.inputLabel}>Not (opsiyonel)</Text>
            <TextInput
              style={s.input}
              placeholder="Örn: Mayıs bursu"
              placeholderTextColor={C.textMuted}
              value={newNote}
              onChangeText={setNewNote}
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
  card: { backgroundColor: C.white, borderRadius: 16, borderWidth: 1, borderColor: C.border },
  txRow: { flexDirection: 'row', alignItems: 'center', padding: 14, gap: 12 },
  rowBorder: { borderBottomWidth: 1, borderBottomColor: C.neutral },
  txIcon: { width: 40, height: 40, borderRadius: 10, backgroundColor: '#D1FAE5', alignItems: 'center', justifyContent: 'center' },
  txName: { fontSize: 14, fontWeight: '500', color: C.navy },
  txMeta: { fontSize: 12, color: C.textMuted, marginTop: 2 },
  txAmount: { fontSize: 14, fontWeight: '500' },
  empty: { alignItems: 'center', paddingVertical: 60 },
  emptyTitle: { fontSize: 16, fontWeight: '600', color: C.navy, marginBottom: 8 },
  emptySub: { fontSize: 13, color: C.textMuted },
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
});
