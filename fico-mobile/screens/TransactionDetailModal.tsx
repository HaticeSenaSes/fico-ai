import {
  View, Text, StyleSheet, TouchableOpacity,
  Modal, SafeAreaView, Alert
} from 'react-native';
import { apiRequest } from '../services/api';

const C = {
  primary: '#0EA5B0', navy: '#1E3A5F', border: '#D9E2E8',
  textSecondary: '#4E6478', textMuted: '#94A3B4',
  danger: '#EF4444', success: '#10B981',
  white: '#FFFFFF', neutral: '#EFF3F5',
};

type Props = {
  visible: boolean;
  transaction: any | null;
  onClose: () => void;
  onDeleted?: () => void;
};

export function TransactionDetailModal({ visible, transaction, onClose, onDeleted }: Props) {
  if (!transaction) return null;

  const isExpense = transaction.type === 'expense';
  const amount = parseFloat(transaction.amount);
  const date = new Date(transaction.transaction_at).toLocaleDateString('tr-TR', {
    day: 'numeric', month: 'long', year: 'numeric',
  });
  const time = new Date(transaction.transaction_at).toLocaleTimeString('tr-TR', {
    hour: '2-digit', minute: '2-digit',
  });

  const handleDelete = () => {
    Alert.alert('İşlemi Sil', 'Bu işlemi silmek istediğinden emin misin?', [
      { text: 'İptal', style: 'cancel' },
      {
        text: 'Sil', style: 'destructive', onPress: async () => {
          try {
            await apiRequest(`/transactions/${transaction.id}`, { method: 'DELETE' });
            onDeleted?.();
          } catch (e) {
            console.log('Delete error:', e);
          }
          onClose();
        }
      },
    ]);
  };

  return (
    <Modal visible={visible} animationType="slide" presentationStyle="pageSheet" onRequestClose={onClose}>
      <SafeAreaView style={[s.safe, { backgroundColor: C.white }]}>
        <View style={s.header}>
          <TouchableOpacity onPress={onClose}>
            <Text style={s.cancel}>← Geri</Text>
          </TouchableOpacity>
          <Text style={s.title}>İşlem Detayı</Text>
          <View style={{ width: 60 }} />
        </View>

        <View style={s.body}>
          <View style={s.amountWrap}>
            <View style={[s.iconBig, { backgroundColor: isExpense ? '#FEE2E2' : '#D1FAE5' }]}>
              <Text style={{ fontSize: 36 }}>{isExpense ? '💸' : '💰'}</Text>
            </View>
            <Text style={[s.amount, { color: isExpense ? C.danger : C.success }]}>
              {isExpense ? '-' : '+'}₺{amount.toLocaleString('tr-TR')}
            </Text>
            <Text style={s.name}>{transaction.note || (isExpense ? 'Gider' : 'Gelir')}</Text>
          </View>

          <View style={s.detailCard}>
            <View style={s.detailRow}>
              <Text style={s.detailLabel}>Tür</Text>
              <Text style={[s.detailValue, { color: isExpense ? C.danger : C.success }]}>
                {isExpense ? 'Gider' : 'Gelir'}
              </Text>
            </View>
            <View style={[s.detailRow, s.rowBorder]}>
              <Text style={s.detailLabel}>Tarih</Text>
              <Text style={s.detailValue}>{date}</Text>
            </View>
            <View style={[s.detailRow, s.rowBorder]}>
              <Text style={s.detailLabel}>Saat</Text>
              <Text style={s.detailValue}>{time}</Text>
            </View>
          </View>

          <TouchableOpacity style={s.deleteBtn} onPress={handleDelete}>
            <Text style={s.deleteBtnText}>🗑️  İşlemi Sil</Text>
          </TouchableOpacity>
        </View>
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
  cancel: { fontSize: 14, color: C.primary, fontWeight: '500' },
  title: { fontSize: 16, fontWeight: '600', color: C.navy },
  body: { padding: 24 },
  amountWrap: { alignItetom: 24 },
  iconBig: {
    width: 80, height: 80, borderRadius: 20,
    alignItems: 'center', justifyContent: 'center', marginBottom: 12,
  },
  amount: { fontSize: 40, fontWeight: '600', marginBottom: 4 },
  name: { fontSize: 16, color: C.textSecondary },
  detailCard: { backgroundColor: C.neutral, borderRadius: 16, padding: 4, marginBottom: 24 },
  detailRow: { flexDirection: 'row', justifyContent: 'space-between', padding: 14 },
  rowBorder: { borderTopWidth: 1, borderColor: C.border },
  detailLabel: { fontSize: 14, color: C.textSecondary },
  detailValue: { fontSize: 14, fontWeight: '500', color: C.navy },
  deleteBtn: {
    height: 52, borderRadius: 12, borderWidth: 1.5, borderColor: '#FEE2E2',
    backgroundColor: '#FFF5F5', alignItems: 'center', justifyContent: 'center',
  },
  deleteBtnText: { fontSize: 15, color: '#EF4444', fontWeight: '500' },
});
