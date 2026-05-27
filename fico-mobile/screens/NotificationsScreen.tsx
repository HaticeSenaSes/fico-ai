import { useState, useEffect } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity, SafeAreaView, ActivityIndicator
} from 'react-native';
import { useTheme } from '../ThemeContext';
import { apiRequest } from '../services/api';

type Props = { onBack: () => void };

export function NotificationsScreen({ onBack }: Props) {
  const { theme: C } = useTheme();
  const [notifications, setNotifications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    apiRequest('/notifications').then(data => {
      setNotifications(data.notifications || []);
    }).catch(console.log).finally(() => setLoading(false));
  }, []);

  const unread = notifications.filter(n => !n.read);
  const read = notifications.filter(n => n.read);

  const getBadgeColor = (type: string) => {
    if (type === 'warning') return '#FEF3C7';
    if (type === 'goal') return '#E0F7F8';
    if (type === 'success') return '#D1FAE5';
    if (type === 'insight') return '#EDE9FE';
    return '#F3F4F6';
  };

  const renderItem = (n: any) => (
    <View key={n.id} style={[s.item, { backgroundColor: n.read ? C.surface : C.primaryLight, borderColor: C.border }]}>
      <View style={[s.iconWrap, { backgroundColor: getBadgeColor(n.type) }]}>
        <Text style={{ fontSize: 20 }}>{n.icon}</Text>
      </View>
      <View style={{ flex: 1 }}>
        <Text style={[s.itemTitle, { color: C.textPrimary }]}>{n.title}</Text>
        <Text style={[s.itemBody, { color: C.textSecondary }]}>{n.body}</Text>
        <Text style={[s.itemTime, { color: C.textMuted }]}>{n.time}</Text>
      </View>
      {!n.read && <View style={[s.dot, { backgroundColor: C.primary }]} />}
    </View>
  );

  return (
    <SafeAreaView style={[s.safe, { backgroundColor: C.bg }]}>
      <View style={[s.header, { backgroundColor: C.surface, borderBottomColor: C.border }]}>
        <TouchableOpacity onPress={onBack} style={s.backBtn}>
          <Text style={[s.backText, { color: C.primary }]}>← Geri</Text>
        </TouchableOpacity>
        <Text style={[s.title, { color: C.textPrimary }]}>Bildirimler</Text>
        <View style={{ width: 60 }} />
      </View>

      {loading ? (
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
          <ActivityIndicator color={C.primary} />
        </View>
      ) : notifications.length === 0 ? (
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
          <Text style={{ fontSize: 48, marginBottom: 12 }}>🔔</Text>
          <Text style={[s.title, { color: C.textSecondary }]}>Bildirim yok</Text>
        </View>
      ) : (
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={s.scroll}>
          {unread.length > 0 && (
            <>
              <Text style={[s.section, { color: C.textMuted }]}>Yeni ({unread.length})</Text>
              {unread.map(renderItem)}
            </>
          )}
          {read.length > 0 && (
            <>
              <Text style={[s.section, { color: C.textMuted }]}>Önceki</Text>
              {read.map(renderItem)}
            </>
          )}
        </ScrollView>
      )}
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  safe: { flex: 1 },
  header: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: 16, paddingVertical: 12, borderBottomWidth: 1,
  },
  backBtn: { width: 60 },
  backText: { fontSize: 14, fontWeight: '500' },
  title: { fontSize: 16, fontWeight: '600' },
  scroll: { padding: 16, paddingBottom: 40 },
  section: { fontSize: 12, fontWeight: '600', marginBottom: 8, marginLeft: 4 },
  item: {
    flexDirection: 'row', alignItems: 'flex-start', gap: 12,
    padding: 14, borderRadius: 16, borderWidth: 1, marginBottom: 10,
  },
  iconWrap: { width: 44, height: 44, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
  itemTitle: { fontSize: 14, fontWeight: '600', marginBottom: 2 },
  itemBody: { fontSize: 13, lineHeight: 18, marginBottom: 4 },
  itemTime: { fontSize: 11 },
  dot: { width: 8, height: 8, borderRadius: 4, marginTop: 4 },
});
