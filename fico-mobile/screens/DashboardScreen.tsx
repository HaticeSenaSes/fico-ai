import { useState } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity, SafeAreaView
} from 'react-native';
import { TransactionScreen } from './TransactionScreen';
import { GoalsScreen } from './GoalsScreen';
import { ProfileScreen } from './ProfileScreen';
import { IncomeScreen } from './IncomeScreen';
import { QuickExpenseModal } from './QuickExpenseModal';
import { NotificationsScreen } from './NotificationsScreen';
import { useTheme } from '../ThemeContext';

type Props = { onLogout: () => void };

const RECENT = [
  { id: '1', icon: '🍔', name: 'Starbucks',   cat: 'Yiyecek',  amount: -85,   color: '#FEF3C7' },
  { id: '2', icon: '💰', name: 'Nisan Bursu', cat: 'Gelir',    amount: 3500,  color: '#D1FAE5' },
  { id: '3', icon: '🛒', name: 'Migros',      cat: 'Market',   amount: -320,  color: '#E0F7F8' },
  { id: '4', icon: '📱', name: 'Netflix',     cat: 'Abonelik', amount: -180,  color: '#EDE9FE' },
  { id: '5', icon: '🚌', name: 'Metro',       cat: 'Ulaşım',   amount: -45,   color: '#E0F7F8' },
];

const CATS = [
  { name: 'Yiyecek', value: 850, pct: 34, color: '#0EA5B0' },
  { name: 'Giyim',   value: 650, pct: 26, color: '#10B981' },
  { name: 'Market',  value: 420, pct: 17, color: '#6366F1' },
  { name: 'Ulaşım',  value: 320, pct: 13, color: '#F59E0B' },
  { name: 'Diğer',   value: 260, pct: 10, color: '#94A3B4' },
];

const WEEKLY = [
  { gun: 'Pzt', tutar: 120 },
  { gun: 'Sal', tutar: 85  },
  { gun: 'Çar', tutar: 320 },
  { gun: 'Per', tutar: 45  },
  { gun: 'Cum', tutar: 650 },
  { gun: 'Cmt', tutar: 180 },
  { gun: 'Paz', tutar: 95  },
];

const MAX = 650;

export function DashboardScreen({ onLogout }: Props) {
  const { theme: C } = useTheme();
  const [activeTab, setActiveTab] = useState('home');
  const [showTransactions, setShowTransactions] = useState(false);
  const [showGoals, setShowGoals] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [showIncome, setShowIncome] = useState(false);
  const [showQuickExpense, setShowQuickExpense] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);

  if (showTransactions) return <TransactionScreen onBack={() => setShowTransactions(false)} />;
  if (showGoals) return <GoalsScreen onBack={() => setShowGoals(false)} />;
  if (showProfile) return <ProfileScreen onLogout={onLogout} onBack={() => setShowProfile(false)} />;
  if (showIncome) return <IncomeScreen onBack={() => setShowIncome(false)} />;
  if (showNotifications) return <NotificationsScreen onBack={() => setShowNotifications(false)} />;

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
          <TouchableOpacity onPress={() => setShowProfile(true)}>
            <View style={[s.avatar, { backgroundColor: C.primaryLight }]}>
              <Text style={[s.avatarText, { color: C.primaryDark }]}>HS</Text>
            </View>
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 100 }}>

        <View style={[s.summaryCard, { backgroundColor: C.primary }]}>
          <Text style={s.summaryLabel}>Net Bakiye</Text>
          <Text style={s.summaryAmount}>₺2.220</Text>
          <View style={s.summaryRow}>
            <View style={s.summaryItem}>
              <Text style={s.summaryItemLabel}>Gelir</Text>
              <Text style={[s.summaryItemValue, { color: '#6FECB0' }]}>₺3.500</Text>
            </View>
            <View style={s.summaryDivider} />
            <View style={s.summaryItem}>
              <Text style={s.summaryItemLabel}>Gider</Text>
              <Text style={[s.summaryItemValue, { color: '#FCA5A5' }]}>₺1.280</Text>
            </View>
            <View style={s.summaryDivider} />
            <View style={s.summaryItem}>
              <Text style={s.summaryItemLabel}>Kalan</Text>
              <Text style={s.summaryItemValue}>₺2.220</Text>
            </View>
          </View>
        </View>

        <View style={[s.card, { backgroundColor: C.surface, borderColor: C.border }]}>
          <View style={s.cardHeader}>
            <Text style={[s.cardTitle, { color: C.textPrimary }]}>Bütçe Durumu</Text>
            <View style={s.badge}>
              <Text style={s.badgeText}>İyi</Text>
            </View>
          </View>
          <View style={[s.progressTrack, { backgroundColor: C.neutral }]}>
            <View style={[s.progressFill, { width: '37%', backgroundColor: C.primary }]} />
          </View>
          <Text style={[s.progressHint, { color: C.textMuted }]}>%37 kullanıldı · ₺1.280 / ₺3.500 · 6 gün kaldı</Text>
        </View>

        <View style={[s.card, { backgroundColor: C.surface, borderColor: C.border }]}>
          <View style={s.cardHeader}>
            <Text style={[s.cardTitle, { color: C.textPrimary }]}>Haftalık Harcama</Text>
            <Text style={[s.cardLink, { color: C.primary }]}>Son 7 gün</Text>
          </View>
          <View style={s.barChart}>
            {WEEKLY.map((d) => (
              <View key={d.gun} style={s.barItem}>
                <View style={[s.barTrack, { backgroundColor: C.neutral }]}>
                  <View style={[s.barFill, { height: `${Math.round((d.tutar / MAX) * 100)}%` as any, backgroundColor: C.primary }]} />
                </View>
                <Text style={[s.barLabel, { color: C.textMuted }]}>{d.gun}</Text>
              </View>
            ))}
          </View>
        </View>

        <View style={[s.card, { backgroundColor: C.surface, borderColor: C.border }]}>
          <View style={s.cardHeader}>
            <Text style={[s.cardTitle, { color: C.textPrimary }]}>Kategoriler</Text>
            <Text style={[s.cardLink, { color: C.primary }]}>Bu ay</Text>
          </View>
          {CATS.map((cat) => (
            <View key={cat.name} style={s.catRow}>
              <View style={[s.catDot, { backgroundColor: cat.color }]} />
              <Text style={[s.catName, { color: C.textSecondary }]}>{cat.name}</Text>
              <View style={[s.catBarTrack, { backgroundColor: C.neutral }]}>
                <View style={[s.catBarFill, { width: `${cat.pct}%` as any, backgroundColor: cat.color }]} />
              </View>
              <Text style={[s.catValue, { color: C.textPrimary }]}>₺{cat.value}</Text>
            </View>
          ))}
        </View>

        <View style={[s.card, { backgroundColor: C.surface, borderColor: C.border }]}>
          <View style={s.cardHeader}>
            <Text style={[s.cardTitle, { color: C.textPrimary }]}>Son İşlemler</Text>
            <TouchableOpacity onPress={() => setShowTransactions(true)}>
              <Text style={[s.cardLink, { color: C.primary }]}>Tümünü Gör</Text>
            </TouchableOpacity>
          </View>
          {RECENT.map((tx, i) => (
            <View key={tx.id} style={[s.txRow, i < RECENT.length - 1 && { borderBottomWidth: 1, borderBottomColor: C.neutral }]}>
              <View style={[s.txIcon, { backgroundColor: tx.color }]}>
                <Text style={{ fontSize: 18 }}>{tx.icon}</Text>
              </View>
              <View style={s.txInfo}>
                <Text style={[s.txName, { color: C.textPrimary }]}>{tx.name}</Text>
                <Text style={[s.txCat, { color: C.textMuted }]}>{tx.cat}</Text>
              </View>
              <Text style={[s.txAmount, { color: tx.amount < 0 ? '#EF4444' : '#10B981' }]}>
                {tx.amount < 0 ? '-' : '+'}₺{Math.abs(tx.amount).toLocaleString('tr-TR')}
              </Text>
            </View>
          ))}
        </View>

        <View style={[s.card, s.insightCard, { backgroundColor: C.surface, borderColor: C.border }]}>
          <View style={s.cardHeader}>
            <Text style={[s.cardTitle, { color: C.textPrimary }]}>✨ AI İçgörü</Text>
          </View>
          <Text style={[s.insightText, { color: C.textPrimary }]}>
            <Text style={{ fontWeight: '600' }}>Cuma akşamları</Text> harcaman hafta ortasına göre{' '}
            <Text style={{ color: '#EF4444', fontWeight: '600' }}>2.4x</Text> daha yüksek.
          </Text>
          <View style={s.feedbackRow}>
            <TouchableOpacity style={[s.feedbackBtn, { backgroundColor: C.primaryLight }]}>
              <Text>👍</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[s.feedbackBtn, { backgroundColor: C.neutral }]}>
              <Text>👎</Text>
            </TouchableOpacity>
          </View>
          <View style={s.insightProgress}>
            <View style={[s.insightTrack, { backgroundColor: C.neutral }]}>
              <View style={[s.insightFill, { width: '17%', backgroundColor: C.primary }]} />
            </View>
            <Text style={[s.insightCount, { color: C.textMuted }]}>5 / 30 işlem</Text>
          </View>
        </View>

      </ScrollView>

      <View style={[s.bottomNav, { backgroundColor: C.surface, borderTopColor: C.border }]}>
        {[
          { key: 'home',    icon: '🏠', label: 'Ana Sayfa' },
          { key: 'expense', icon: '💸', label: 'Giderler'  },
          { key: 'income',  icon: '💰', label: 'Gelir'     },
          { key: 'goals',   icon: '🎯', label: 'Hedefler'  },
          { key: 'profile', icon: '👤', label: 'Profil'    },
        ].map((tab) => (
          <TouchableOpacity
            key={tab.key}
            style={s.tabItem}
            onPress={() => {
              if (tab.key === 'expense') setShowTransactions(true);
              else if (tab.key === 'goals') setShowGoals(true);
              else if (tab.key === 'profile') setShowProfile(true);
              else if (tab.key === 'income') setShowIncome(true);
              else setActiveTab(tab.key);
            }}
          >
            <Text style={{ fontSize: 20 }}>{tab.icon}</Text>
            <Text style={[s.tabLabel, { color: activeTab === tab.key ? C.primary : C.textMuted }]}>
              {tab.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <TouchableOpacity style={s.fab} onPress={() => setShowQuickExpense(true)}>
        <Text style={s.fabText}>+</Text>
      </TouchableOpacity>

      <QuickExpenseModal
        visible={showQuickExpense}
        onClose={() => setShowQuickExpense(false)}
        onSaved={() => setShowQuickExpense(false)}
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
  badge: { backgroundColor: '#D1FAE5', paddingHorizontal: 8, paddingVertical: 2, borderRadius: 99 },
  badgeText: { fontSize: 11, fontWeight: '500', color: '#065f46' },
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
  feedbackRow: { flexDirection: 'row', gap: 8, marginBottom: 12 },
  feedbackBtn: { paddingHorizontal: 16, paddingVertical: 6, borderRadius: 6 },
  insightProgress: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  insightTrack: { flex: 1, height: 6, borderRadius: 99, overflow: 'hidden' },
  insightFill: { height: '100%', borderRadius: 99 },
  insightCount: { fontSize: 11 },
  bottomNav: {
    position: 'absolute', bottom: 0, left: 0, right: 0,
    flexDirection: 'row', borderTopWidth: 1, paddingBottom: 20, paddingTop: 8,
  },
  tabItem: { flex: 1, alignItems: 'center', gap: 2 },
  tabLabel: { fontSize: 10 },
  fab: {
    position: 'absolute', bottom: 80, right: 20,
    width: 52, height: 52, borderRadius: 26,
    backgroundColor: '#0EA5B0', alignItems: 'center', justifyContent: 'center',
    shadowColor: '#0EA5B0', shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3, shadowRadius: 8, elevation: 8,
  },
  fabText: { fontSize: 24, color: '#FFFFFF', lineHeight: 28 },
});