import { useState, useEffect } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity,
  SafeAreaView, TextInput, ActivityIndicator
} from 'react-native';
import { TransactionDetailModal } from './TransactionDetailModal';
import { apiRequest } from '../services/api';

const C = {
  primary: '#0EA5B0', navy: '#1E3A5F', bg: '#F0FBFC',
  border: '#D9E2E8', textSecondary: '#4E6478', textMuted: '#94A3B4',
  danger: '#EF4444', success: '#10B981', white: '#FFFFFF', neutral: '#EFF3F5',
};

type Props = { onBack: () => void };
type Filter = 'all' | 'expense' | 'income';

export function TransactionScreen({ onBack }: Props) {
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState<Filter>('all');
  const [transactions, setTransactions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedTx, setSelectedTx] = useState<any | null>(null);

  useEffect(() => { fetchTransactions(); }, [filter]);

  const fetchTransactions = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (filter !== 'all') params.append('type', filter);
      const data = await apiRequest(`/transactions?${params.toString()}`);
      setTransactions(data.data || []);
    } catch (e) {
      console.log('Transaction fetch error:', e);
    } finally {
      setLoading(false);
    }
  };

  const filtered = transactions.filter(t => {
    if (!search) return true;
    return t.note?.toLowerCase().includes(search.toLowerCase());
  });

  const groups: Record<string, any[]> = {};
  for (const t of filtered) {
    const date = new Date(t.transaction_at).toLocaleDateString('tr-TR', { day: 'numeric', month: 'long' });
    if (!groups[date]) groups[date] = [];
    groups[date].push(t);
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

      {loading ? (
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
          <ActivityIndicator color={C.primary} />
        </View>
      ) : (
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ padding: 16, paddingBottom: 40 }}>
          {Object.keys(groups).length === 0 ? (
            <View style={s.empty}>
              <Text style={{ fontSize: 32, marginBottom: 8 }}>📭</Text>
              <Text style={s.emptyText}>İşlem bulunamadı</Text>
            </View>
          ) : (
            Object.entries(groups).map(([date, txs]) => (
              <View key={date} style={{ marginBottom: 16 }}>
                <View style={s.groupHeader}>
                  <Text style={s.groupDate}>{date}</Text>
                  <Text style={[s.groupTotal, {
                    color: txs.reduce((sum, t) => sum + (t.type === 'income' ? Number(t.amount) : -Number(t.amount)), 0) >= 0 ? C.success : C.danger
                  }]}>
                    {txs.reduce((sum, t) => sum + (t.type === 'income' ? Number(t.amount) : -Number(t.amount)), 0) >= 0 ? '+' : ''}
                    ₺{Math.abs(txs.reduce((sum, t) => sum + (t.type === 'income' ? Number(t.amount) : -Number(t.amount)), 0)).toLocaleString('tr-TR')}
                  </Text>
                </View>
                <View style={s.card}>
                  {txs.map((tx, i) => (
                    <TouchableOpacity
                      key={tx.id}
                      style={[s.txRow, i < txs.length - 1 && s.txBorder]}
                      onPress={() => setSelectedTx(tx)}
                    >
                      <View style={[s.txIcon, { backgroundColor: tx.type === 'income' ? '#D1FAE5' : '#E0F7F8' }]}>
                        <Text style={{ fontSize: 18 }}>{tx.type === 'income' ? '💰' : '💸'}</Text>
                      </View>
                      <View style={s.txInfo}>
                        <Text style={s.txName}>{tx.note || (tx.type === 'income' ? 'Gelir' : 'Gider')}</Text>
                        <Text style={s.txMeta}>{new Date(tx.transaction_at).toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' })}</Text>
                      </View>
                      <Text style={[s.txAmount, { color: tx.type === 'expense' ? C.danger : C.success }]}>
                        {tx.type === 'expense' ? '-' : '+'}₺{Number(tx.amount).toLocaleString('tr-TR')}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>
            ))
          )}
        </ScrollView>
      )}

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
  searchWrap: { height: 40, borderWidth: 1.5, borderColor: C.border, borderRadius: 8, paddingHorizontal: 12, justifyContent: 'center' },
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
  txMeta: { fontSize: 12, color: C.textMuted, marginTop: 2 },
  txAmount: { fontSize: 14, fontWeight: '500' },
  empty: { alignItems: 'center', paddingVertical: 48 },
  emptyText: { fontSize: 14, color: C.textMuted },
});
