import { useState, useEffect } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity,
  SafeAreaView, ActivityIndicator, RefreshControl
} from 'react-native';
import { QuickExpenseModal } from './QuickExpenseModal';
import { NotificationsScreen } from './NotificationsScreen';
import { useTheme } from '../ThemeContext';
import { apiRequest } from '../services/api';

type Props = { onLogout: () => void; onNavigate?: (tab: string) => void };

export function DashboardScreen({ onLogout, onNavigate }: Props) {
  const { theme: C } = useTheme();
  const [showQuickExpense, setShowQuickExpense] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [summary, setSummary] = useState<any>(null);
  const [weekly, setWeekly] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [recent, setRecent] = useState<any[]>([]);
  const [insight, setInsight] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    try {
      const [s, w, c, r, i] = await Promise.all([
        apiRequest('/dashboard/summary'),
        apiRequest('/dashboard/chart/weekly'),
        apiRequest('/dashboard/chart/category'),
        apiRequest('/dashboard/recent'),
        apiRequest('/insights/latest'),
      ]);
      setSummary(s);
      setWeekly(w.days || []);
      setCategories(c.categories || []);
      setRecent(r.transactions || []);
      setInsight(i);
    } catch (e) {
      console.log('Dashboard fetch error:', e);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => { fetchData(); }, []);

  const onRefresh = () => { setRefreshing(true); fetchData(); };

  if (showNotifications) return <NotificationsScreen onBack={() => setShowNotifications(false)} />;

  const MAX = weekly.length > 0 ? Math.max(...weekly.map((d: any) => d.tutar || 0), 1) : 1;
  const budgetPct = summary?.budget_pct || 0;
  const progressColor = budgetPct < 70 ? C.primary : budgetPct < 90 ? '#F59E0B' : '#EF4444';

  return (
    <SafeAreaView style={[s.safe, { backgroundColor: C.bg }]}>
      <View style={[s.header, { backgroundColor: C.surface, borderBottomColor: C.border }]}>
        <View>
          <Text style={[s.logo, { color: C.primary }]}>FiCo AI</Text>
          <Text style={[s.headerSub, { color: C.textSecondary }]}>Merhaba 👋</Text>
        </View>
        <View style={s.headerRight}>
          <TouchableOpacity style={s.bellBtn} onPress={() => setShowNotifications(true)}>
            <Text style={{ fontSize: 22 }}>🔔</Text>
            <View style={s.bellBadge}>
              <Text style={{ fontSize: 9, color: '#fff', fontWeight: '700' }}>2</Text>
            </View>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => onNavigate?.('profile')}>
            <View style={[s.avatar, { backgroundColor: C.primaryLight }]}>
              <Text style={[s.avatarText, { color: C.primaryDark }]}>👤</Text>
            </View>
          </TouchableOpacity>
        </View>
      </View>

      {loading ? (
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
          <ActivityIndicator size="large" color={C.primary} />
        </View>
      ) : (
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 40 }}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={C.primary} />}
        >
          <View style={[s.summaryCard, { backgroundColor: C.primary }]}>
            <Text style={s.summaryLabel}>Net Bakiye</Text>
            <Text style={s.summaryAmount}>₺{(summary?.net_balance || 0).toLocaleString('tr-TR')}</Text>
            <View style={s.summaryRow}>
              <View style={s.summaryItem}>
                <Text style={s.summaryItemLabel}>Gelir</Text>
                <Text style={[s.summaryItemValue, { color: '#6FECB0' }]}>₺{(summary?.total_income || 0).toLocaleString('tr-TR')}</Text>
              </View>
              <View style={s.summaryDivider} />
              <View style={s.summaryItem}>
                <Text style={s.summaryItemLabel}>Gider</Text>
                <Text style={[s.summaryItemValue, { color: '#FCA5A5' }]}>₺{(summary?.total_expense || 0).toLocaleString('tr-TR')}</Text>
              </View>
              <View style={s.summaryDivider} />
              <View style={s.summaryItem}>
                <Text style={s.summaryItemLabel}>Kalan</Text>
                <Text style={s.summaryItemValue}>₺{(summary?.remaining_budget || 0).toLocaleString('tr-TR')}</Text>
              </View>
            </View>
          </View>

          <View style={[s.card, { backgroundColor: C.surface, borderColor: C.border }]}>
            <View style={s.cardHeader}>
              <Text style={[s.cardTitle, { color: C.textPrimary }]}>Bütçe Durumu</Text>
              <View style={[s.badge, { backgroundColor: budgetPct < 70 ? '#D1FAE5' : budgetPct < 90 ? '#FEF3C7' : '#FEE2E2' }]}>
                <Text style={[s.badgeText, { color: budgetPct < 70 ? '#065f46' : budgetPct < 90 ? '#92400e' : '#991b1b' }]}>
                  {budgetPct < 70 ? 'İyi' : budgetPct < 90 ? 'Dikkat' : 'Kritik'}
                </Text>
              </View>
            </View>
            <View style={[s.progressTrack, { backgroundColor: C.neutral }]}>
              <View style={[s.progressFill, { width: `${Math.min(budgetPct, 100)}%` as any, backgroundColor: progressColor }]} />
            </View>
            <Text style={[s.progressHint, { color: C.textMuted }]}>
              %{budgetPct} kullanıldı · ₺{(summary?.total_expense || 0).toLocaleString('tr-TR')} / ₺{(summary?.total_income || 0).toLocaleString('tr-TR')}
            </Text>
          </View>

          {weekly.length > 0 && (
            <View style={[s.card, { backgroundColor: C.surface, borderColor: C.border }]}>
              <View style={s.cardHeader}>
                <Text style={[s.cardTitle, { color: C.textPrimary }]}>Haftalık Harcama</Text>
                <Text style={[s.cardLink, { color: C.primary }]}>Son 7 gün</Text>
              </View>
              <View style={s.barChart}>
                {weekly.map((d: any) => (
                  <View key={d.gun} style={s.barItem}>
                    <View style={[s.barTrack, { backgroundColor: C.neutral }]}>
                      <View style={[s.barFill, {
                        height: `${Math.round(((d.tutar || 0) / MAX) * 100)}%` as any,
                        backgroundColor: C.primary
                      }]} />
                    </View>
                    <Text style={[s.barLabel, { color: C.textMuted }]}>{d.gun}</Text>
                  </View>
                ))}
              </View>
            </View>
          )}

          {categories.length > 0 && (
            <View style={[s.card, { backgroundColor: C.surface, borderColor: C.border }]}>
              <View style={s.cardHeader}>
                <Text style={[s.cardTitle, { color: C.textPrimary }]}>Kategoriler</Text>
                <Text style={[s.cardLink, { color: C.primary }]}>Bu ay</Text>
              </View>
              {categories.slice(0, 5).map((cat: any) => {
                const total = categories.reduce((sum: number, c: any) => sum + c.value, 0);
                const pct = total > 0 ? Math.round((cat.value / total) * 100) : 0;
                return (
                  <View key={cat.name} style={s.catRow}>
                    <View style={[s.catDot, { backgroundColor: cat.color || C.primary }]} />
                    <Text style={[s.catName, { color: C.textSecondary }]}>{cat.name}</Text>
                    <View style={[s.catBarTrack, { backgroundColor: C.neutral }]}>
                      <View style={[s.catBarFill, { width: `${pct}%` as any, backgroundColor: cat.color || C.primary }]} />
                    </View>
                    <Text style={[s.catValue, { color: C.textPrimary }]}>₺{cat.value.toLocaleString('tr-TR')}</Text>
                  </View>
                );
              })}
            </View>
          )}

          <View style={[s.card, { backgroundColor: C.surface, borderColor: C.border }]}>
            <View style={s.cardHeader}>
              <Text style={[s.cardTitle, { color: C.textPrimary }]}>Son İşlemler</Text>
              <TouchableOpacity onPress={() => onNavigate?.('transactions')}>
                <Text style={[s.cardLink, { color: C.primary }]}>Tümünü Gör</Text>
              </TouchableOpacity>
            </View>
            {recent.length === 0 ? (
              <View style={s.empty}>
                <Text style={{ fontSize: 32 }}>📭</Text>
                <Text style={[s.emptyText, { color: C.textPrimary }]}>Henüz işlem yok</Text>
                <Text style={[s.emptySub, { color: C.textMuted }]}>FAB ile ilk işlemini ekle</Text>
              </View>
            ) : (
              recent.map((tx: any, i: number) => (
                <View key={tx.id} style={[s.txRow, i < recent.length - 1 && { borderBottomWidth: 1, borderBottomColor: C.neutral }]}>
                  <View style={[s.txIcon, { backgroundColor: '#E0F7F8' }]}>
                    <Text style={{ fontSize: 18 }}>{tx.type === 'income' ? '💰' : '💸'}</Text>
                  </View>
                  <View style={s.txInfo}>
                    <Text style={[s.txName, { color: C.textPrimary }]}>{tx.note || 'İşlem'}</Text>
                    <Text style={[s.txCat, { color: C.textMuted }]}>{tx.type === 'expense' ? 'Gider' : 'Gelir'}</Text>
                  </View>
                  <Text style={[s.txAmount, { color: tx.type === 'expense' ? '#EF4444' : '#10B981' }]}>
                    {tx.type === 'expense' ? '-' : '+'}₺{parseFloat(tx.amount).toLocaleString('tr-TR')}
                  </Text>
                </View>
              ))
            )}
          </View>

          <View style={[s.card, s.insightCard, { backgroundColor: C.surface, borderColor: C.border }]}>
            <View style={s.cardHeader}>
              <Text style={[s.cardTitle, { color: C.textPrimary }]}>✨ AI İçgörü</Text>
            </View>
            {insight && insight.body ? (
              <>
                <Text style={[s.insightText, { color: C.textPrimary }]}>{insight.body}</Text>
                <View style={s.feedbackRow}>
                  <TouchableOpacity style={[s.feedbackBtn, { backgroundColor: C.primaryLight }]}>
                    <Text>👍</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={[s.feedbackBtn, { backgroundColor: C.neutral }]}>
                    <Text>👎</Text>
                  </TouchableOpacity>
                </View>
              </>
            ) : (
              <View style={s.empty}>
                <Text style={{ fontSize: 32 }}>🤖</Text>
                <Text style={[s.emptyText, { color: C.textPrimary }]}>İçgörüler hazırlanıyor</Text>
                <Text style={[s.emptySub, { color: C.textMuted }]}>Daha fazla işlem ekle</Text>
              </View>
            )}
          </View>
        </ScrollView>
      )}

      <TouchableOpacity style={s.fab} onPress={() => setShowQuickExpense(true)}>
        <Text style={s.fabText}>+</Text>
      </TouchableOpacity>

      <QuickExpenseModal
        visible={showQuickExpense}
        onClose={() => setShowQuickExpense(false)}
        onSaved={() => { setShowQuickExpense(false); fetchData(); }}
      />
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  safe: { flex: 1 },
  header: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: 20, paddingVertical: 12, borderBottomWidth: 1,
  },
  logo: { fontSize: 18, fontWeight: '700' },
  headerSub: { fontSize: 13, marginTop: 2 },
  headerRight: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  bellBtn: { position: 'relative' },
  bellBadge: {
    position: 'absolute', top: -4, right: -4,
    width: 16, height: 16, borderRadius: 8,
    backgroundColor: '#EF4444', alignItems: 'center', justifyContent: 'center',
  },
  avatar: { width: 36, height: 36, borderRadius: 18, alignItems: 'center', justifyContent: 'center' },
  avatarText: { fontSize: 13, fontWeight: '600' },
  summaryCard: { margin: 16, borderRadius: 16, padding: 20 },
  summaryLabel: { fontSize: 12, color: 'rgba(255,255,255,0.7)', marginBottom: 4 },
  summaryAmount: { fontSize: 36, fontWeight: '600', color: '#fff', marginBottom: 16 },
  summaryRow: { flexDirection: 'row', alignItems: 'center' },
  summaryItem: { flex: 1, alignItems: 'center' },
  summaryItemLabel: { fontSize: 11, color: 'rgba(255,255,255,0.7)' },
  summaryItemValue: { fontSize: 16, fontWeight: '600', color: '#fff', marginTop: 2 },
  summaryDivider: { width: 1, height: 32, backgroundColor: 'rgba(255,255,255,0.2)' },
  card: { marginHorizontal: 16, marginBottom: 12, borderRadius: 16, padding: 16, borderWidth: 1 },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
  cardTitle: { fontSize: 14, fontWeight: '600' },
  cardLink: { fontSize: 12 },
  badge: { paddingHorizontal: 8, paddingVertical: 2, borderRadius: 99 },
  badgeText: { fontSize: 11, fontWeight: '500' },
  progressTrack: { height: 8, borderRadius: 99, overflow: 'hidden' },
  progressFill: { height: '100%', borderRadius: 99 },
  progressHint: { fontSize: 11, marginTop: 6 },
  barChart: { flexDirection: 'row', alignItems: 'flex-end', height: 120, gap: 6 },
  barItem: { flex: 1, alignItems: 'center', height: '100%', justifyContent: 'flex-end' },
  barTrack: { flex: 1, width: '100%', justifyContent: 'flex-end', marginBottom: 4, borderRadius: 4 },
  barFill: { borderRadius: 4, width: '100%' },
  barLabel: { fontSize: 10 },
  catRow: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 10 },
  catDot: { width: 10, height: 10, borderRadius: 5 },
  catName: { fontSize: 12, width: 60 },
  catBarTrack: { flex: 1, height: 6, borderRadius: 99, overflow: 'hidden' },
  catBarFill: { height: '100%', borderRadius: 99 },
  catValue: { fontSize: 12, fontWeight: '500', width: 50, textAlign: 'right' },
  txRow: { flexDirection: 'row', alignItems: 'center', gap: 12, paddingVertical: 10 },
  txIcon: { width: 40, height: 40, borderRadius: 10, alignItems: 'center', justifyContent: 'center' },
  txInfo: { flex: 1 },
  txName: { fontSize: 14, fontWeight: '500' },
  txCat: { fontSize: 12, marginTop: 2 },
  txAmount: { fontSize: 14, fontWeight: '500' },
  insightCard: { borderLeftWidth: 3, borderLeftColor: '#0EA5B0' },
  insightText: { fontSize: 14, lineHeight: 22, marginBottom: 12 },
  feedbackRow: { flexDirection: 'row', gap: 8 },
  feedbackBtn: { paddingHorizontal: 16, paddingVertical: 6, borderRadius: 6 },
  empty: { alignItems: 'center', paddingVertical: 20 },
  emptyText: { fontSize: 14, fontWeight: '500', marginTop: 8 },
  emptySub: { fontSize: 12, marginTop: 4 },
  fab: {
    position: 'absolute', bottom: 20, right: 20,
    width: 52, height: 52, borderRadius: 26,
    backgroundColor: '#0EA5B0', alignItems: 'center', justifyContent: 'center',
    shadowColor: '#0EA5B0', shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3, shadowRadius: 8, elevation: 8,
  },
  fabText: { fontSize: 24, color: '#FFFFFF', lineHeight: 28 },
});
