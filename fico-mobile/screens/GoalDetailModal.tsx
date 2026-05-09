import {
    View, Text, StyleSheet, TouchableOpacity,
    Modal, SafeAreaView, Alert
  } from 'react-native';
  
  const C = {
    primary: '#0EA5B0', primaryLight: '#E0F7F8',
    navy: '#1E3A5F', border: '#D9E2E8',
    textSecondary: '#4E6478', textMuted: '#94A3B4',
    danger: '#EF4444', success: '#10B981', warning: '#F59E0B',
    white: '#FFFFFF', neutral: '#EFF3F5',
  };
  
  type Goal = {
    id: string; name: string; type: string;
    target: number; current: number; period: string; color: string;
  };
  
  type Props = { visible: boolean; goal: Goal | null; onClose: () => void };
  
  function getStatusColor(pct: number) {
    if (pct < 70) return C.primary;
    if (pct < 90) return C.warning;
    return C.danger;
  }
  
  export function GoalDetailModal({ visible, goal, onClose }: Props) {
    if (!goal) return null;
    const pct = Math.round((goal.current / goal.target) * 100);
    const statusColor = getStatusColor(pct);
  
    return (
      <Modal visible={visible} animationType="slide" presentationStyle="pageSheet" onRequestClose={onClose}>
        <SafeAreaView style={[s.safe, { backgroundColor: C.white }]}>
          <View style={s.header}>
            <TouchableOpacity onPress={onClose}>
              <Text style={s.cancel}>← Geri</Text>
            </TouchableOpacity>
            <Text style={s.title}>Hedef Detayı</Text>
            <View style={{ width: 60 }} />
          </View>
  
          <View style={s.body}>
            <View style={s.topSection}>
              <Text style={s.goalName}>{goal.name}</Text>
              <Text style={s.goalType}>{goal.type} · {goal.period}</Text>
  
              <View style={s.circleWrap}>
                <View style={[s.circle, { borderColor: statusColor }]}>
                  <Text style={[s.circlePct, { color: statusColor }]}>%{pct}</Text>
                  <Text style={s.circleLabel}>kullanıldı</Text>
                </View>
              </View>
  
              <View style={s.amountRow}>
                <View style={s.amountItem}>
                  <Text style={s.amountValue}>₺{goal.current.toLocaleString('tr-TR')}</Text>
                  <Text style={s.amountLabel}>Harcanan</Text>
                </View>
                <View style={s.amountDivider} />
                <View style={s.amountItem}>
                  <Text style={s.amountValue}>₺{goal.target.toLocaleString('tr-TR')}</Text>
                  <Text style={s.amountLabel}>Hedef</Text>
                </View>
                <View style={s.amountDivider} />
                <View style={s.amountItem}>
                  <Text style={[s.amountValue, { color: statusColor }]}>
                    ₺{(goal.target - goal.current).toLocaleString('tr-TR')}
                  </Text>
                  <Text style={s.amountLabel}>Kalan</Text>
                </View>
              </View>
            </View>
  
            <View style={s.progressTrack}>
              <View style={[s.progressFill, { width: `${Math.min(pct, 100)}%` as any, backgroundColor: statusColor }]} />
            </View>
  
            <TouchableOpacity
              style={s.deleteBtn}
              onPress={() => {
                Alert.alert('Hedefi Sil', 'Bu hedefi silmek istediğinden emin misin?', [
                  { text: 'İptal', style: 'cancel' },
                  { text: 'Sil', style: 'destructive', onPress: onClose },
                ]);
              }}
            >
              <Text style={s.deleteBtnText}>🗑️  Hedefi Sil</Text>
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
    topSection: { alignItems: 'center', marginBottom: 24 },
    goalName: { fontSize: 22, fontWeight: '600', color: C.navy, marginBottom: 4 },
    goalType: { fontSize: 13, color: C.textMuted, marginBottom: 24 },
    circleWrap: { marginBottom: 24 },
    circle: {
      width: 120, height: 120, borderRadius: 60,
      borderWidth: 8, alignItems: 'center', justifyContent: 'center',
    },
    circlePct: { fontSize: 28, fontWeight: '700' },
    circleLabel: { fontSize: 12, color: C.textMuted },
    amountRow: { flexDirection: 'row', alignItems: 'center', width: '100%' },
    amountItem: { flex: 1, alignItems: 'center' },
    amountValue: { fontSize: 18, fontWeight: '600', color: C.navy },
    amountLabel: { fontSize: 12, color: C.textMuted, marginTop: 2 },
    amountDivider: { width: 1, height: 36, backgroundColor: C.border },
    progressTrack: {
      height: 12, backgroundColor: C.neutral,
      borderRadius: 99, overflow: 'hidden', marginBottom: 32,
    },
    progressFill: { height: '100%', borderRadius: 99 },
    deleteBtn: {
      height: 52, borderRadius: 12, borderWidth: 1.5, borderColor: '#FEE2E2',
      backgroundColor: '#FFF5F5', alignItems: 'center', justifyContent: 'center',
    },
    deleteBtnText: { fontSize: 15, color: C.danger, fontWeight: '500' },
  });