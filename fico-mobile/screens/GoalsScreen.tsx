import { useState, useEffect } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity,
  SafeAreaView, Modal, TextInput, ActivityIndicator
} from 'react-native';
import { GoalDetailModal } from './GoalDetailModal';
import { apiRequest } from '../services/api';

const C = {
  primary: '#0EA5B0', primaryLight: '#E0F7F8',
  navy: '#1E3A5F', bg: '#F0FBFC', border: '#D9E2E8',
  textSecondary: '#4E6478', textMuted: '#94A3B4',
  danger: '#EF4444', success: '#10B981', warning: '#F59E0B',
  white: '#FFFFFF', neutral: '#EFF3F5',
};

const GOAL_TYPES = [
  { id: 'spending_limit', label: '💸 Harcama Limiti', desc: 'Belirli bir limite kadar harca' },
  { id: 'saving', label: '💰 Tasarruf', desc: 'Belirli bir miktar biriktir' },
  { id: 'category', label: '📂 Kategori Limiti', desc: 'Kategori bazlı limit koy' },
  { id: 'budget', label: '📊 Genel Bütçe', desc: 'Aylık toplam bütçe belirle' },
];

function getStatusColor(pct: number) {
  if (pct < 70) return C.primary;
  if (pct < 90) return C.warning;
  return C.danger;
}

function getStatusLabel(pct: number) {
  if (pct < 70) return 'İyi';
  if (pct < 90) return 'Dikkat';
  return 'Kritik';
}

type Props = { onBack: () => void };

export function GoalsScreen({ onBack }: Props) {
  const [goals, setGoals] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAdd, setShowAdd] = useState(false);
  const [goalType, setGoalType] = useState('');
  const [goalName, setGoalName] = useState('');
  const [goalTarget, setGoalTarget] = useState('');
  const [saving, setSaving] = useState(false);
  const [selectedGoal, setSelectedGoal] = useState<any | null>(null);

  useEffect(() => { fetchGoals(); }, []);

  const fetchGoals = async () => {
    setLoading(true);
    try {
      const data = await apiRequest('/goals');
      setGoals(data.goals || []);
    } catch (e) {
      console.log('Goals fetch error:', e);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!goalName || !goalTarget || !goalType) return;
    setSaving(true);
    try {
      const now = new Date();
      const start = new Date(now.getFullYear(), now.getMonth(), 1);
      const end = new Date(now.getFullYear(), now.getMonth() + 1, 0);
      await apiRequest('/goals', {
        method: 'POST',
        body: JSON.stringify({
          name: goalName,
          goal_type: goalType,
          target_amount: parseFloat(goalTarget),
          period_type: 'monthly',
          period_start: start.toISOString(),
          period_end: end.toISOString(),
        }),
      });
      setShowAdd(false);
      setGoalName('');
      setGoalTarget('');
      setGoalType('');
      fetchGoals();
    } catch (e) {
      console.log('Goal save error:', e);
    } finally {
      setSaving(false);
    }
  };

  const activeGoals = goals.filter(g => g.is_active);
  const completedGoals = goals.filter(g => !g.is_active);

  return (
    <SafeAreaView style={[s.safe, { backgroundColor: C.bg }]}>
      <View style={s.header}>
        <TouchableOpacity onPress={onBack} style={s.backBtn}>
          <Text style={s.backText}>← Geri</Text>
        </TouchableOpacity>
        <Text style={s.title}>Hedefler</Text>
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
          {activeGoals.length === 0 && completedGoals.length === 0 ? (
            <View style={s.empty}>
              <Text style={{ fontSize: 48, marginBottom: 12 }}>🎯</Text>
              <Text style={s.emptyTitle}>Henüz hedef yok</Text>
              <Text style={s.emptySub}>+ Ekle butonuyla ilk hedefini oluştur</Text>
            </View>
          ) : (
            <>
              {activeGoals.length > 0 && (
                <>
                  <Text style={s.sectionTitle}>Aktif Hedefler</Text>
                  {activeGoals.map(goal => {
                    const pct = goal.current_amount
                      ? Math.round((goal.current_amount / goal.target_amount) * 100)
                      : 0;
                    const statusColor = getStatusColor(pct);
                    return (
                      <TouchableOpacity key={goal.id} style={s.goalCard} onPress={() => setSelectedGoal(goal)}>
                        <View style={s.goalHeader}>
                          <View style={{ flex: 1 }}>
                            <Text style={s.goalName}>{goal.name}</Text>
                            <Text style={s.goalType}>{goal.goal_type}</Text>
                          </View>
                          <View style={[s.statusBadge, { backgroundColor: statusColor + '20' }]}>
                            <Text style={[s.statusText, { color: statusColor }]}>{getStatusLabel(pct)}</Text>
                          </View>
                        </View>
                        <View style={s.progressRow}>
                          <View style={s.progressTrack}>
                            <View style={[s.progressFill, { width: `${Math.min(pct, 100)}%` as any, backgroundColor: statusColor }]} />
                          </View>
                          <Text style={s.progressPct}>%{pct}</Text>
                        </View>
                        <View style={s.goalFooter}>
                          <Text style={s.goalTarget}>Hedef: ₺{Number(goal.target_amount).toLocaleString('tr-TR')}</Text>
                        </View>
                      </TouchableOpacity>
                    );
                  })}
                </>
              )}
              {completedGoals.length > 0 && (
                <>
                  <Text style={[s.sectionTitle, { marginTop: 8 }]}>Tamamlananlar</Text>
                  {completedGoals.map(goal => (
                    <View key={goal.id} style={[s.goalCard, { opacity: 0.7 }]}>
                      <View style={s.goalHeader}>
                        <Text style={s.goalName}>{goal.name}</Text>
                        <View style={[s.statusBadge, { backgroundColor: C.success + '20' }]}>
                          <Text style={[s.statusText, { color: C.success }]}>✓ Tamam</Text>
                        </View>
                      </View>
                    </View>
                  ))}
                </>
              )}
            </>
          )}
        </ScrollView>
      )}

      <GoalDetailModal
        visible={!!selectedGoal}
        goal={selectedGoal}
        onClose={() => setSelectedGoal(null)}
      />

      <Modal visible={showAdd} animationType="slide" presentationStyle="pageSheet">
        <SafeAreaView style={[s.safe, { backgroundColor: C.white }]}>
          <View style={s.modalHeader}>
            <TouchableOpacity onPress={() => setShowAdd(false)}>
              <Text style={s.modalCancel}>İptal</Text>
            </TouchableOpacity>
            <Text style={s.modalTitle}>Yeni Hedef</Text>
            <TouchableOpacity onPress={handleSave} disabled={saving}>
              <Text style={[s.modalCancel, { color: C.primary }]}>{saving ? '...' : 'Kaydet'}</Text>
            </TouchableOpacity>
          </View>
          <ScrollView contentContainerStyle={s.modalScroll}>
            <Text style={s.inputLabel}>Hedef Türü</Text>
            {GOAL_TYPES.map(t => (
              <TouchableOpacity
                key={t.id}
                style={[s.typeCard, goalType === t.id && s.typeCardActive]}
                onPress={() => setGoalType(t.id)}
              >
                <Text style={s.typeLabel}>{t.label}</Text>
                <Text style={s.typeDesc}>{t.desc}</Text>
              </TouchableOpacity>
            ))}
            <Text style={[s.inputLabel, { marginTop: 16 }]}>Hedef Adı</Text>
            <TextInput
              style={s.input}
              placeholder="Örn: Yemek limiti"
              placeholderTextColor={C.textMuted}
              value={goalName}
              onChangeText={setGoalName}
            />
            <Text style={s.inputLabel}>Hedef Tutarı (₺)</Text>
            <TextInput
              style={s.input}
              placeholder="0"
              placeholderTextColor={C.textMuted}
              value={goalTarget}
              onChangeText={setGoalTarget}
              keyboardType="numeric"
            />
          </ScrollView>
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
  sectionTitle: { fontSize: 13, fontWeight: '600', color: C.textSecondary, marginBottom: 10, marginLeft: 2 },
  goalCard: {
    backgroundColor: C.white, borderRadius: 16,
    padding: 16, marginBottom: 12,
    borderWidth: 1, borderColor: C.border,
  },
  goalHeader: { flexDirection: 'row', alignItems: 'flex-start', marginBottom: 12 },
  goalName: { fontSize: 15, fontWeight: '600', color: C.navy },
  goalType: { fontSize: 12, color: C.textMuted, marginTop: 2 },
  statusBadge: { paddingHorizontal: 8, paddingVertical: 3, borderRadius: 99 },
  statusText: { fontSize: 11, fontWeight: '600' },
  progressRow: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 10 },
  progressTrack: { flex: 1, height: 8, backgroundColor: C.neutral, borderRadius: 99, overflow: 'hidden' },
  progressFill: { height: '100%', borderRadius: 99 },
  progressPct: { fontSize: 12, fontWeight: '600', color: C.textSecondary, width: 36, textAlign: 'right' },
  goalFooter: { flexDirection: 'row', alignItems: 'center' },
  goalTarget: { fontSize: 13, color: C.textMuted },
  empty: { alignItems: 'center', paddingVertical: 60 },
  emptyTitle: { fontSize: 16, fontWeight: '600', color: C.navy, marginBottom: 8 },
  emptySub: { fontSize: 13, color: C.textMuted },
  modalHeader: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    padding: 16, borderBottomWidth: 1, borderBottomColor: C.border,
  },
  modalCancel: { fontSize: 15, color: C.textSecondary },
  modalTitle: { fontSize: 16, fontWeight: '600', color: C.navy },
  modalScroll: { padding: 16 },
  inputLabel: { fontSize: 13, fontWeight: '500', color: C.textSecondary, marginBottom: 8 },
  input: {
    height: 48, borderWidth: 1.5, borderColor: C.border,
    borderRadius: 8, paddingHorizontal: 14, fontSize: 14,
    color: C.navy, marginBottom: 16, backgroundColor: C.white,
  },
  typeCard: { padding: 14, borderRadius: 12, borderWidth: 1.5, borderColor: C.border, marginBottom: 8 },
  typeCardActive: { borderColor: C.primary, backgroundColor: C.primaryLight },
  typeLabel: { fontSize: 14, fontWeight: '500', color: C.navy },
  typeDesc: { fontSize: 12, color: C.textMuted, marginTop: 2 },
});
