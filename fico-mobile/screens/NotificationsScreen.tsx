import {
    View, Text, StyleSheet, ScrollView, TouchableOpacity, SafeAreaView
  } from 'react-native';
  import { useTheme } from '../ThemeContext';
  
  type Props = { onBack: () => void };
  
  const NOTIFICATIONS = [
    { id: '1', type: 'warning', icon: '⚠️', title: 'Bütçe Uyarısı', body: 'Eğlence kategorisi %90 doldu.', time: '2 saat önce', read: false },
    { id: '2', type: 'insight', icon: '✨', title: 'Yeni AI İçgörü', body: 'Haftalık harcama özeti hazır.', time: '5 saat önce', read: false },
    { id: '3', type: 'goal', icon: '🎯', title: 'Hedef Uyarısı', body: 'Yemek limitine %80 ulaştın.', time: 'Dün', read: true },
    { id: '4', type: 'success', icon: '✅', title: 'Hedef Tamamlandı', body: 'Mart Tasarrufu hedefini tamamladın!', time: 'Dün', read: true },
    { id: '5', type: 'anomaly', icon: '🚨', title: 'Anomali Tespiti', body: 'Giyim kategorisinde olağandışı harcama.', time: '2 gün önce', read: true },
    { id: '6', type: 'reminder', icon: '🔔', title: 'Günlük Hatırlatma', body: 'Bugünkü harcamalarını girmeyi unutma!', time: '2 gün önce', read: true },
  ];
  
  export function NotificationsScreen({ onBack }: Props) {
    const { theme: C } = useTheme();
  
    const unread = NOTIFICATIONS.filter(n => !n.read);
    const read = NOTIFICATIONS.filter(n => n.read);
  
    const getBadgeColor = (type: string) => {
      if (type === 'warning' || type === 'anomaly') return '#FEF3C7';
      if (type === 'goal') return '#E0F7F8';
      if (type === 'success') return '#D1FAE5';
      if (type === 'insight') return '#EDE9FE';
      return C.neutral;
    };
  
    return (
      <SafeAreaView style={[s.safe, { backgroundColor: C.bg }]}>
        <View style={[s.header, { backgroundColor: C.surface, borderBottomColor: C.border }]}>
          <TouchableOpacity onPress={onBack} style={s.backBtn}>
            <Text style={[s.backText, { color: C.primary }]}>← Geri</Text>
          </TouchableOpacity>
          <Text style={[s.title, { color: C.textPrimary }]}>Bildirimler</Text>
          <TouchableOpacity>
            <Text style={[s.markAll, { color: C.primary }]}>Tümünü Oku</Text>
          </TouchableOpacity>
        </View>
  
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={s.scroll}>
  
          {unread.length > 0 && (
            <>
              <Text style={[s.sectionTitle, { color: C.textSecondary }]}>Okunmamış</Text>
              <View style={[s.card, { backgroundColor: C.surface, borderColor: C.border }]}>
                {unread.map((n, i) => (
                  <View
                    key={n.id}
                    style={[
                      s.notifRow,
                      i < unread.length - 1 && { borderBottomWidth: 1, borderBottomColor: C.border },
                      { backgroundColor: C.primaryLight + '40' }
                    ]}
                  >
                    <View style={[s.notifIcon, { backgroundColor: getBadgeColor(n.type) }]}>
                      <Text style={{ fontSize: 18 }}>{n.icon}</Text>
                    </View>
                    <View style={{ flex: 1 }}>
                      <Text style={[s.notifTitle, { color: C.textPrimary }]}>{n.title}</Text>
                      <Text style={[s.notifBody, { color: C.textSecondary }]}>{n.body}</Text>
                      <Text style={[s.notifTime, { color: C.textMuted }]}>{n.time}</Text>
                    </View>
                    <View style={[s.unreadDot, { backgroundColor: C.primary }]} />
                  </View>
                ))}
              </View>
            </>
          )}
  
          {read.length > 0 && (
            <>
              <Text style={[s.sectionTitle, { color: C.textSecondary }]}>Geçmiş</Text>
              <View style={[s.card, { backgroundColor: C.surface, borderColor: C.border }]}>
                {read.map((n, i) => (
                  <View
                    key={n.id}
                    style={[
                      s.notifRow,
                      i < read.length - 1 && { borderBottomWidth: 1, borderBottomColor: C.border },
                    ]}
                  >
                    <View style={[s.notifIcon, { backgroundColor: getBadgeColor(n.type), opacity: 0.6 }]}>
                      <Text style={{ fontSize: 18 }}>{n.icon}</Text>
                    </View>
                    <View style={{ flex: 1 }}>
                      <Text style={[s.notifTitle, { color: C.textSecondary }]}>{n.title}</Text>
                      <Text style={[s.notifBody, { color: C.textMuted }]}>{n.body}</Text>
                      <Text style={[s.notifTime, { color: C.textMuted }]}>{n.time}</Text>
                    </View>
                  </View>
                ))}
              </View>
            </>
          )}
  
          {NOTIFICATIONS.length === 0 && (
            <View style={s.empty}>
              <Text style={{ fontSize: 40, marginBottom: 12 }}>🔔</Text>
              <Text style={[s.emptyText, { color: C.textMuted }]}>Henüz bildirim yok</Text>
            </View>
          )}
  
        </ScrollView>
      </SafeAreaView>
    );
  }
  
  const s = StyleSheet.create({
    safe: { flex: 1 },
    header: {
      flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
      paddingHorizontal: 16, paddingVertical: 12,
      borderBottomWidth: 1,
    },
    backBtn: { width: 60 },
    backText: { fontSize: 14, fontWeight: '500' },
    title: { fontSize: 16, fontWeight: '600' },
    markAll: { fontSize: 13, fontWeight: '500', width: 80, textAlign: 'right' },
    scroll: { padding: 16, paddingBottom: 40 },
    sectionTitle: { fontSize: 12, fontWeight: '600', marginBottom: 8, marginLeft: 4 },
    card: { borderRadius: 16, borderWidth: 1, marginBottom: 16, overflow: 'hidden' },
    notifRow: { flexDirection: 'row', alignItems: 'flex-start', padding: 14, gap: 12 },
    notifIcon: { width: 44, height: 44, borderRadius: 12, alignItems: 'center', justifyContent: 'center', flexShrink: 0 },
    notifTitle: { fontSize: 14, fontWeight: '600', marginBottom: 2 },
    notifBody: { fontSize: 13, lineHeight: 18, marginBottom: 4 },
    notifTime: { fontSize: 11 },
    unreadDot: { width: 8, height: 8, borderRadius: 4, marginTop: 4, flexShrink: 0 },
    empty: { alignItems: 'center', paddingVertical: 60 },
    emptyText: { fontSize: 15 },
  });
  