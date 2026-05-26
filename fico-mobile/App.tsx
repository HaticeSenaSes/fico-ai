import { StatusBar } from 'expo-status-bar';
import { useState } from 'react';
import {
  StyleSheet, Text, View, TextInput, TouchableOpacity,
  ScrollView, KeyboardAvoidingView, Platform, SafeAreaView
} from 'react-native';
import { DashboardScreen } from './screens/DashboardScreen';
import { ThemeProvider, useTheme } from './ThemeContext';

const API_URL = 'http://127.0.0.1:8001/api/v1';

type Route = 'register' | 'login' | 'dashboard';

function AppContent() {
  const { theme: C, isDark } = useTheme();
  const [route, setRoute] = useState<Route>('register');
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [kvkk, setKvkk] = useState(false);
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [error, setError] = useState('');

  const canRegister = !!(fullName.trim() && email.includes('@') && password.length >= 8 && kvkk);

  if (route === 'dashboard') {
    return <DashboardScreen onLogout={() => setRoute('login')} />;
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
              <TouchableOpacity style={{ alignSelf: 'flex-end', marginBottom: 16 }}>
                <Text style={[s.link, { color: C.primary }]}>Şifremi unuttum</Text>
              </TouchableOpacity>
              {error ? <Text style={s.error}>{error}</Text> : null}
              <TouchableOpacity
                style={[s.btn, { backgroundColor: C.primary }]}
                onPress={async () => {
                  if (!loginEmail || !loginPassword) { setError('Email ve şifre zorunludur.'); return; }
                  try {
                    const res = await fetch(`${API_URL}/auth/login`, {
                      method: 'POST',
                      headers: { 'Content-Type': 'application/json' },
                      body: JSON.stringify({ email: loginEmail, password: loginPassword }),
                    });
                    const data = await res.json();
                    if (res.ok) {
                      setRoute('dashboard');
                    } else {
                      setError(data.detail?.message || 'Email veya şifre hatalı.');
                    }
                  } catch {
                    setError('Sunucuya bağlanılamadı.');
                  }
                }}
              >
                <Text style={s.btnText}>Giriş Yap</Text>
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
              style={[s.btn, { backgroundColor: C.primary }, !canRegister && s.btnDisabled]}
              disabled={!canRegister}
              onPress={async () => {
                try {
                  const res = await fetch(`${API_URL}/auth/register`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                      email,
                      password,
                      full_name: fullName,
                      kvkk_accepted: kvkk,
                    }),
                  });
                  const data = await res.json();
                  if (res.ok) {
                    setRoute('dashboard');
                  } else {
                    setError(data.detail?.message || 'Kayıt başarısız.');
                  }
                } catch {
                  setError('Sunucuya bağlanılamadı.');
                }
              }}
            >
              <Text style={s.btnText}>Kayıt Ol</Text>
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
  input: {
    height: 48, borderWidth: 1.5, borderRadius: 8,
    paddingHorizontal: 14, fontSize: 14, marginBottom: 12,
  },
  checkRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 16 },
  checkbox: {
    width: 20, height: 20, borderRadius: 4, borderWidth: 1.5,
    marginRight: 8, alignItems: 'center', justifyContent: 'center',
  },
  checkLabel: { fontSize: 13, flex: 1 },
  btn: { height: 48, borderRadius: 8, alignItems: 'center', justifyContent: 'center' },
  btnDisabled: { opacity: 0.45 },
  btnText: { color: '#FFFFFF', fontSize: 15, fontWeight: '600' },
  switchRow: { flexDirection: 'row', justifyContent: 'center', marginTop: 8 },
  switchText: { fontSize: 13 },
  link: { fontSize: 13, fontWeight: '500' },
  error: { fontSize: 12, color: '#EF4444', marginBottom: 12 },
});