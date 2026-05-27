import { useState, useEffect } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity,
  SafeAreaView, Switch, Alert, Modal
} from 'react-native';
import { EditProfileModal } from './EditProfileModal';
import { apiRequest } from '../services/api';
import { useTheme } from '../ThemeContext';

type Props = { onLogout: () => void; onBack: () => void };

export function ProfileScreen({ onLogout, onBack }: Props) {
  const { theme: C, isDark, toggleTheme } = useTheme();
  const [biometric, setBiometric] = useState(false);
  const [dailyReminder, setDailyReminder] = useState(true);
  const [weeklyReport, setWeeklyReport] = useState(true);
  const [goalAlerts, setGoalAlerts] = useState(true);
  const [recurringAlert, setRecurringAlert] = useState(true);
  const [showEditProfile, setShowEditProfile] = useState(false);
  const [user, setUser] = useState<{full_name: string; email: string} | null>(null);

  useEffect(() => {
    apiRequest("/auth/me").then(setUser).catch(console.log);
  }, []);
  const [infoModal, setInfoModal] = useState<{ title: string; content: string } | null>(null);

  const handleLogout = () => {
    Alert.alert(
      'Çıkış Yap',
      'Hesabından çıkmak istediğinden emin misin?',
      [
        { text: 'İptal', style: 'cancel' },
        { text: 'Çıkış Yap', style: 'destructive', onPress: onLogout },
      ]
    );
  };

  const handleDeleteAccount = () => {
    Alert.alert(
      'Hesabı Sil',
      'Hesabın 30 gün içinde kalıcı olarak silinecek. Bu işlem geri alınamaz. Emin misin?',
      [
        { text: 'İptal', style: 'cancel' },
        { text: 'Hesabı Sil', style: 'destructive', onPress: onLogout },
      ]
    );
  };

  const handleCurrency = () => {
    Alert.alert(
      'Para Birimi',
      'Para birimini seç',
      [
        { text: '₺ Türk Lirası (TRY)', onPress: () => {} },
        { text: '$ Amerikan Doları (USD)', onPress: () => {} },
        { text: '€ Euro (EUR)', onPress: () => {} },
        { text: 'İptal', style: 'cancel' },
      ]
    );
  };

  return (
    <SafeAreaView style={[s.safe, { backgroundColor: C.bg }]}>

      <View style={[s.header, { backgroundColor: C.surface, borderBottomColor: C.border }]}>
        <TouchableOpacity onPress={onBack} style={s.backBtn}>
          <Text style={[s.backText, { color: C.primary }]}>← Geri</Text>
        </TouchableOpacity>
        <Text style={[s.title, { color: C.textPrimary }]}>Profil</Text>
        <View style={{ width: 60 }} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={s.scroll}>

        <View style={[s.profileCard, { backgroundColor: C.surface, borderColor: C.border }]}>
          <View style={[s.profileAvatar, { backgroundColor: C.primaryLight }]}>
            <Text style={[s.profileAvatarText, { color: C.primaryDark }]}>{user?.full_name?.split(" ").map((n: string) => n[0]).join("").slice(0,2).toUpperCase() || "?"}</Text>
          </View>
          <View style={{ flex: 1 }}>
            <Text style={[s.profileName, { color: C.textPrimary }]}>{user?.full_name || "Yükleniyor..."}</Text>
            <Text style={[s.profileEmail, { color: C.textMuted }]}>{user?.email || ""}</Text>
            
          </View>
          <TouchableOpacity
            style={[s.editBtn, { backgroundColor: C.primaryLight }]}
            onPress={() => setShowEditProfile(true)}
          >
            <Text style={[s.editBtnText, { color: C.primary }]}>Düzenle</Text>
          </TouchableOpacity>
        </View>

        <View style={[s.statsRow, { backgroundColor: C.surface, borderColor: C.border }]}>
          <View style={s.statItem}>
            <Text style={[s.statValue, { color: C.textPrimary }]}>127</Text>
            <Text style={[s.statLabel, { color: C.textMuted }]}>İşlem</Text>
          </View>
          <View style={[s.statDivider, { backgroundColor: C.border }]} />
          <View style={s.statItem}>
            <Text style={[s.statValue, { color: C.textPrimary }]}>3</Text>
            <Text style={[s.statLabel, { color: C.textMuted }]}>Hedef</Text>
          </View>
          <View style={[s.statDivider, { backgroundColor: C.border }]} />
          <View style={s.statItem}>
            <Text style={[s.statValue, { color: C.textPrimary }]}>12</Text>
            <Text style={[s.statLabel, { color: C.textMuted }]}>İçgörü</Text>
          </View>
        </View>

        <Text style={[s.sectionTitle, { color: C.textMuted }]}>Hesap</Text>
        <View style={[s.menuCard, { backgroundColor: C.surface, borderColor: C.border }]}>
          <View style={[s.menuRow, { borderBottomWidth: 1, borderBottomColor: C.neutral }]}>
            <Text style={s.menuIcon}>{isDark ? '🌙' : '☀️'}</Text>
            <Text style={[s.menuLabel, { color: C.textPrimary }]}>Koyu Tema</Text>
            <Switch
              value={isDark}
              onValueChange={toggleTheme}
              trackColor={{ false: C.neutral, true: C.primaryLight }}
              thumbColor={isDark ? C.primary : '#fff'}
            />
          </View>
          <View style={[s.menuRow, { borderBottomWidth: 1, borderBottomColor: C.neutral }]}>
            <Text style={s.menuIcon}>🔒</Text>
            <Text style={[s.menuLabel, { color: C.textPrimary }]}>Biyometrik Kilit</Text>
            <Switch
              value={biometric}
              onValueChange={setBiometric}
              trackColor={{ false: C.neutral, true: C.primaryLight }}
              thumbColor={biometric ? C.primary : '#fff'}
            />
          </View>
          <TouchableOpacity style={s.menuRow} onPress={handleCurrency}>
            <Text style={s.menuIcon}>💱</Text>
            <Text style={[s.menuLabel, { color: C.textPrimary }]}>Para Birimi</Text>
            <Text style={[s.menuValue, { color: C.textMuted }]}>TRY (₺)</Text>
            <Text style={[s.menuArrow, { color: C.textMuted }]}>›</Text>
          </TouchableOpacity>
        </View>

        <Text style={[s.sectionTitle, { color: C.textMuted }]}>Bildirimler</Text>
        <View style={[s.menuCard, { backgroundColor: C.surface, borderColor: C.border }]}>
          <View style={[s.menuRow, { borderBottomWidth: 1, borderBottomColor: C.neutral }]}>
            <Text style={s.menuIcon}>🔔</Text>
            <Text style={[s.menuLabel, { color: C.textPrimary }]}>Günlük Hatırlatma</Text>
            <Switch value={dailyReminder} onValueChange={setDailyReminder}
              trackColor={{ false: C.neutral, true: C.primaryLight }}
              thumbColor={dailyReminder ? C.primary : '#fff'} />
          </View>
          <View style={[s.menuRow, { borderBottomWidth: 1, borderBottomColor: C.neutral }]}>
            <Text style={s.menuIcon}>📊</Text>
            <Text style={[s.menuLabel, { color: C.textPrimary }]}>Haftalık Rapor</Text>
            <Switch value={weeklyReport} onValueChange={setWeeklyReport}
              trackColor={{ false: C.neutral, true: C.primaryLight }}
              thumbColor={weeklyReport ? C.primary : '#fff'} />
          </View>
          <View style={[s.menuRow, { borderBottomWidth: 1, borderBottomColor: C.neutral }]}>
            <Text style={s.menuIcon}>🎯</Text>
            <Text style={[s.menuLabel, { color: C.textPrimary }]}>Hedef Uyarıları</Text>
            <Switch value={goalAlerts} onValueChange={setGoalAlerts}
              trackColor={{ false: C.neutral, true: C.primaryLight }}
              thumbColor={goalAlerts ? C.primary : '#fff'} />
          </View>
          <View style={s.menuRow}>
            <Text style={s.menuIcon}>🔁</Text>
            <Text style={[s.menuLabel, { color: C.textPrimary }]}>Tekrarlayan Hatırlatma</Text>
            <Switch value={recurringAlert} onValueChange={setRecurringAlert}
              trackColor={{ false: C.neutral, true: C.primaryLight }}
              thumbColor={recurringAlert ? C.primary : '#fff'} />
          </View>
        </View>

        <Text style={[s.sectionTitle, { color: C.textMuted }]}>Uygulama</Text>
        <View style={[s.menuCard, { backgroundColor: C.surface, borderColor: C.border }]}>
          <TouchableOpacity
            style={[s.menuRow, { borderBottomWidth: 1, borderBottomColor: C.neutral }]}
            onPress={() => setInfoModal({ title: 'Gizlilik Politikası', content: 'FiCo AI olarak kişisel verilerinizi KVKK kapsamında koruyoruz. Verileriniz yalnızca uygulama işlevleri için kullanılır, üçüncü taraflarla paylaşılmaz.' })}
          >
            <Text style={s.menuIcon}>📄</Text>
            <Text style={[s.menuLabel, { color: C.textPrimary }]}>Gizlilik Politikası</Text>
            <Text style={[s.menuArrow, { color: C.textMuted }]}>›</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[s.menuRow, { borderBottomWidth: 1, borderBottomColor: C.neutral }]}
            onPress={() => setInfoModal({ title: 'Kullanım Koşulları', content: 'FiCo AI\'yi kullanarak hizmet şartlarımızı kabul etmiş olursunuz. Uygulama yalnızca kişisel finansal takip amacıyla kullanılabilir.' })}
          >
            <Text style={s.menuIcon}>📋</Text>
            <Text style={[s.menuLabel, { color: C.textPrimary }]}>Kullanım Koşulları</Text>
            <Text style={[s.menuArrow, { color: C.textMuted }]}>›</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[s.menuRow, { borderBottomWidth: 1, borderBottomColor: C.neutral }]}
            onPress={() => setInfoModal({ title: 'Yardım & SSS', content: 'Sıkça sorulan sorular:\n\n• Gider nasıl eklenir? Ana ekrandaki + butonuna basın.\n• Hedef nasıl oluşturulur? Hedefler sekmesinden + Ekle butonuna basın.\n• Verilerimi nasıl silerim? Profil > Hesabı Sil bölümünden yapabilirsiniz.' })}
          >
            <Text style={s.menuIcon}>❓</Text>
            <Text style={[s.menuLabel, { color: C.textPrimary }]}>Yardım & SSS</Text>
            <Text style={[s.menuArrow, { color: C.textMuted }]}>›</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={s.menuRow}
            onPress={() => Alert.alert('Geri Bildirim', 'Geri bildiriminiz için teşekkürler! feedback@ficoai.com adresine e-posta gönderebilirsiniz.')}
          >
            <Text style={s.menuIcon}>💬</Text>
            <Text style={[s.menuLabel, { color: C.textPrimary }]}>Geri Bildirim Gönder</Text>
            <Text style={[s.menuArrow, { color: C.textMuted }]}>›</Text>
          </TouchableOpacity>
        </View>

        <View style={[s.menuCard, { backgroundColor: C.surface, borderColor: C.border }]}>
          <TouchableOpacity style={s.menuRow} onPress={handleLogout}>
            <Text style={s.menuIcon}>🚪</Text>
            <Text style={[s.menuLabel, { color: C.primary }]}>Çıkış Yap</Text>
          </TouchableOpacity>
        </View>

        <View style={[s.menuCard, { backgroundColor: C.surface, borderColor: C.border, marginTop: 8 }]}>
          <TouchableOpacity style={s.menuRow} onPress={handleDeleteAccount}>
            <Text style={s.menuIcon}>🗑️</Text>
            <Text style={[s.menuLabel, { color: '#EF4444' }]}>Hesabı Sil</Text>
          </TouchableOpacity>
        </View>

        <Text style={[s.version, { color: C.textMuted }]}>FiCo AI v1.0.0</Text>

      </ScrollView>

      <EditProfileModal visible={showEditProfile} onClose={() => setShowEditProfile(false)} />

      <Modal
        visible={!!infoModal}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={() => setInfoModal(null)}
      >
        <SafeAreaView style={[s.safe, { backgroundColor: C.surface }]}>
          <View style={[s.header, { backgroundColor: C.surface, borderBottomColor: C.border }]}>
            <View style={{ width: 60 }} />
            <Text style={[s.title, { color: C.textPrimary }]}>{infoModal?.title}</Text>
            <TouchableOpacity onPress={() => setInfoModal(null)}>
              <Text style={[s.backText, { color: C.primary, textAlign: 'right' }]}>Kapat</Text>
            </TouchableOpacity>
          </View>
          <ScrollView contentContainerStyle={{ padding: 24 }}>
            <Text style={{ fontSize: 15, color: C.textPrimary, lineHeight: 24 }}>
              {infoModal?.content}
            </Text>
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
    paddingHorizontal: 16, paddingVertical: 12, borderBottomWidth: 1,
  },
  backBtn: { width: 60 },
  backText: { fontSize: 14, fontWeight: '500' },
  title: { fontSize: 16, fontWeight: '600' },
  scroll: { padding: 16, paddingBottom: 40 },
  profileCard: {
    borderRadius: 16, padding: 16, marginBottom: 12,
    flexDirection: 'row', alignItems: 'center', gap: 12, borderWidth: 1,
  },
  profileAvatar: { width: 56, height: 56, borderRadius: 28, alignItems: 'center', justifyContent: 'center' },
  profileAvatarText: { fontSize: 20, fontWeight: '600' },
  profileName: { fontSize: 16, fontWeight: '600' },
  profileEmail: { fontSize: 12, marginTop: 2 },
  profileMeta: { fontSize: 12, marginTop: 2 },
  editBtn: { paddingHorizontal: 12, paddingVertical: 6, borderRadius: 8 },
  editBtnText: { fontSize: 13, fontWeight: '500' },
  statsRow: {
    borderRadius: 16, padding: 16, marginBottom: 12,
    flexDirection: 'row', alignItems: 'center', borderWidth: 1,
  },
  statItem: { flex: 1, alignItems: 'center' },
  statValue: { fontSize: 22, fontWeight: '600' },
  statLabel: { fontSize: 12, marginTop: 2 },
  statDivider: { width: 1, height: 36 },
  sectionTitle: { fontSize: 12, fontWeight: '600', marginBottom: 6, marginLeft: 4 },
  menuCard: { borderRadius: 16, borderWidth: 1, marginBottom: 8 },
  menuRow: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, paddingVertical: 14, gap: 12 },
  menuIcon: { fontSize: 18, width: 28 },
  menuLabel: { flex: 1, fontSize: 14 },
  menuValue: { fontSize: 13 },
  menuArrow: { fontSize: 18 },
  version: { fontSize: 12, textAlign: 'center', marginTop: 16 },
});