import { StatusBar } from 'expo-status-bar';
import { useState, useEffect } from 'react';
import {
  StyleSheet, Text, View, TextInput, TouchableOpacity,
  ScrollView, KeyboardAvoidingView, Platform, SafeAreaView, ActivityIndicator
} from 'react-native';
import { DashboardScreen } from './screens/DashboardScreen';
import { TransactionScreen } from './screens/TransactionScreen';
import { IncomeScreen } from './screens/IncomeScreen';
import { GoalsScreen } from './screens/GoalsScreen';
import { ProfileScreen } from './screens/ProfileScreen';
import { ThemeProvider, useTheme } from './ThemeContext';
import { apiRequest, setToken, getToken, removeToken } from './services/api';

type Tab = 'dashboard' | 'transactions' | 'income' | 'goals' | 'profile';
type Route = 'register' | 'login' | 'app' | 'loading';

const TABS: { id: Tab; label: string; icon: string }[] = [
  { id: 'dashboard', label: 'Ana Sayfa', icon: '🏠' },
  { id: 'transactions', label: 'Giderler', icon: '💸' },
  { id: 'income', label: 'Gelir', icon: '💰' },
  { id: 'goals', label: 'Hedefler', icon: '🎯' },
  { id: 'profile', label: 'Profil', icon: '👤' },
];

function BottomBar({ active, onPress }: { active: Tab; onPress: (t: Tab) => void }) {
  const { theme: C } = useTheme();
  return (
    <View style={[b.bar, { backgroundColor: C.surface, borderTopColor: C.border }]}>
      {TABS.map(tab => (
        <TouchableOpacity
          key={tab.id}
          style={b.item}
          onPress={() => onPress(tab.id)}
        >
          <Text style={{ fontSize: 22 }}>{tab.icon}</Text>
              <View style={[b.activeIndicator, { backgroundColor: active === tab.id ? C.primary : 'transparent' }]} />
          <Text style={[b.label, { color: active === tab.id ? C.primary : C.textMuted }]}>
            {tab.label}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );
}

const b = StyleSheet.create({
  bar: {
    flexDirection: 'row', borderTopWidth: 1,
    paddingBottom: 24, paddingTop: 10,
  },
  item: { flex: 1, alignItems: 'center', gap: 3 },
  label: { fontSize: 10, fontWeight: '600' },
  activeIndicator: {
    width: 4, height: 4, borderRadius: 2, marginBottom: 2,
  },
});

function AppContent() {
  const { theme: C, isDark } = useTheme();
  const [route, setRoute] = useState<Route>('loading');
  const [tab, setTab] = useState<Tab>('dashboard');
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [kvkk, setKvkk] = useState(false);
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const canRegister = !!(fullName.trim() && email.includes('@') && password.length >= 8 && kvkk);

  useEffect(() => {
    getToken().then(token => {
      setRoute(token ? 'app' : 'register');
    });
  }, []);

  const handleLogout = async () => {
    await removeToken();
    setTab('dashboard');
    setRoute('login');
  };

  if (route === 'loading') {
    return (
      <SafeAreaView style={[s.safe, { backgroundColor: C.bg, alignItems: 'center', justifyContent: 'center' }]}>
        <Text style={[s.logo, { color: C.primary }]}>FiCo AI</Text>
        <ActivityIndicator color={C.primary} style={{ marginTop: 16 }} />
      </SafeAreaView>
    );
  }

  if (route === 'app') {
    return (
      <SafeAreaView style={[s.safe, { backgroundColor: C.bg }]}>
        <View style={{ flex: 1 }}>
          {tab === 'dashboard' && <DashboardScreen key={tab === 'dashboard' ? 'active' : 'inactive'} onLogout={handleLogout} onNavigate={setTab} />}
          {tab === 'transactions' && <TransactionScreen onBack={() => setTab('dashboard')} />}
          {tab === 'income' && <IncomeScreen onBack={() => setTab('dashboard')} />}
          {tab === 'goals' && <GoalsScreen onBack={() => setTab('dashboard')} />}
          {tab === 'profile' && <ProfileScreen onLogout={handleLogout} onBack={() => setTab('dashboard')} />}
        </View>
        <BottomBar active={tab} onPress={setTab} />
        <StatusBar style={isDark ? 'light' : 'dark'} />
      </SafeAreaView>
    );
  }

  if (route === 'login') {
    return (
      <SafeAreaView style={[s.safe, { backgroundColor: C.bg }]}>
        <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={{ flex: 1 }}>
          <ScrollView contentContainerStyle={s.scroll} keyboardShouldPersistTaps="handled">
            <Text style={[s.logo, { color: C.primary }]}>FiCo AI</Text>
            <Text style={[s.subtitle, { color: C.textSecondary }]}>Tekrar hoş geldin</Text>
            <View style={[s.card, { backgroundColor: C.surface, borderColor: C.border }]}>
              <Text style={[s.cardTitle, { color: C.textPrimary }]}>Giriş Yap</Text>
              <TextInput
                style={[s.input, { backgroundColor: C.surface, borderColor: C.border, color: C.textPrimary }]}
                placeholder="Email"
                placeholderTextColor={C.textMuted}
                value={loginEmail}
                onChangeText={t => { setLoginEmail(t); setError(''); }}
                keyboardType="email-address"
                autoCapitalize="none"
              />
              <TextInput
                style={[s.input, { backgroundColor: C.surface, borderColor: C.border, color: C.textPrimary }]}
                placeholder="Şifre"
                placeholderTextColor={C.textMuted}
                value={loginPassword}
                onChangeText={t => { setLoginPassword(t); setError(''); }}
                secureTextEntry
              />
              {error ? <Text style={s.error}>{error}</Text> : null}
              <TouchableOpacity
                style={[s.btn, { backgroundColor: C.primary }, loading && s.btnDisabled]}
                disabled={loading}
                onPress={async () => {
                  if (!loginEmail || !loginPassword) { setError('Email ve şifre zorunludur.'); return; }
                  setLoading(true);
                  try {
                    const data = await apiRequest('/auth/login', {
                      method: 'POST',
                      body: JSON.stringify({ email: loginEmail, password: loginPassword }),
                    });
                    await setToken(data.access_token);
                    setRoute('app');
                  } catch (e: any) {
                    setError(e?.detail?.message || 'Email veya şifre hatalı.');
                  } finally {
                    setLoading(false);
                  }
                }}
              >
                {loading ? <ActivityIndicator color="#fff" /> : <Text style={s.btnText}>Giriş Yap</Text>}
              </TouchableOpacity>
            </View>
            <View style={s.switchRow}>
              <Text style={[s.switchText, { color: C.textSecondary }]}>Hesabın yok mu? </Text>
              <TouchableOpacity onPress={() => setRoute('register')}>
                <Text style={[s.link, { color: C.primary }]}>Kayıt Ol</Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
        <StatusBar style={isDark ? 'light' : 'dark'} />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={[s.safe, { backgroundColor: C.bg }]}>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={{ flex: 1 }}>
        <ScrollView contentContainerStyle={s.scroll} keyboardShouldPersistTaps="handled">
          <Text style={[s.logo, { color: C.primary }]}>FiCo AI</Text>
          <Text style={[s.subtitle, { color: C.textSecondary }]}>Finansal özgürlüğüne hoş geldin</Text>
          <View style={[s.card, { backgroundColor: C.surface, borderColor: C.border }]}>
            <Text style={[s.cardTitle, { color: C.textPrimary }]}>Hesap Oluştur</Text>
            <TextInput
              style={[s.input, { backgroundColor: C.surface, borderColor: C.border, color: C.textPrimary }]}
              placeholder="Ad Soyad"
              placeholderTextColor={C.textMuted}
              value={fullName}
              onChangeText={setFullName}
            />
            <TextInput
              style={[s.input, { backgroundColor: C.surface, borderColor: C.border, color: C.textPrimary }]}
              placeholder="Email"
              placeholderTextColor={C.textMuted}
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
            />
            <TextInput
              style={[s.input, { backgroundColor: C.surface, borderColor: C.border, color: C.textPrimary }]}
              placeholder="Şifre (min 8 karakter)"
              placeholderTextColor={C.textMuted}
              value={password}
              onChangeText={setPassword}
              secureTextEntry
            />
            <TouchableOpacity style={s.checkRow} onPress={() => setKvkk(!kvkk)}>
              <View style={[s.checkbox, { borderColor: C.border }, kvkk && { backgroundColor: C.primary, borderColor: C.primary }]}>
                {kvkk && <Text style={{ color: '#fff', fontSize: 11 }}>✓</Text>}
              </View>
              <Text style={[s.checkLabel, { color: C.textSecondary }]}>KVKK onayını kabul ediyorum</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[s.btn, { backgroundColor: C.primary }, (!canRegister || loading) && s.btnDisabled]}
              disabled={!canRegister || loading}
              onPress={async () => {
                setLoading(true);
                try {
                  const data = await apiRequest('/auth/register', {
                    method: 'POST',
                    body: JSON.stringify({ email, password, full_name: fullName, kvkk_accepted: kvkk }),
                  });
                  await setToken(data.access_token);
                  setRoute('app');
                } catch (e: any) {
                  setError(e?.detail?.message || 'Kayıt başarısız.');
                } finally {
                  setLoading(false);
                }
              }}
            >
              {loading ? <ActivityIndicator color="#fff" /> : <Text style={s.btnText}>Kayıt Ol</Text>}
            </TouchableOpacity>
            {error ? <Text style={[s.error, { marginTop: 8 }]}>{error}</Text> : null}
          </View>
          <View style={s.switchRow}>
            <Text style={[s.switchText, { color: C.textSecondary }]}>Zaten hesabın var mı? </Text>
            <TouchableOpacity onPress={() => setRoute('login')}>
              <Text style={[s.link, { color: C.primary }]}>Giriş Yap</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
      <StatusBar style={isDark ? 'light' : 'dark'} />
    </SafeAreaView>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <AppContent />
    </ThemeProvider>
  );
}

const s = StyleSheet.create({
  safe: { flex: 1 },
  scroll: { padding: 24, paddingTop: 48 },
  logo: { fontSize: 28, fontWeight: '600', marginBottom: 4 },
  subtitle: { fontSize: 14, marginBottom: 24 },
  card: { borderRadius: 16, padding: 24, marginBottom: 16, borderWidth: 1 },
  cardTitle: { fontSize: 18, fontWeight: '600', marginBottom: 16 },
  input: { height: 48, borderWidth: 1.5, borderRadius: 8, paddingHorizontal: 14, fontSize: 14, marginBottom: 12 },
  checkRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 16 },
  checkbox: { width: 20, height: 20, borderRadius: 4, borderWidth: 1.5, marginRight: 8, alignItems: 'center', justifyContent: 'center' },
  checkLabel: { fontSize: 13, flex: 1 },
  btn: { height: 48, borderRadius: 8, alignItems: 'center', justifyContent: 'center' },
  btnDisabled: { opacity: 0.45 },
  btnText: { color: '#FFFFFF', fontSize: 15, fontWeight: '600' },
  switchRow: { flexDirection: 'row', justifyContent: 'center', marginTop: 8 },
  switchText: { fontSize: 13 },
  link: { fontSize: 13, fontWeight: '500' },
  error: { fontSize: 12, color: '#EF4444', marginBottom: 12 },
});
