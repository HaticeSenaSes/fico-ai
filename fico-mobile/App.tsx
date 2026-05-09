import { StatusBar } from 'expo-status-bar';
import { useState } from 'react';
import {
  StyleSheet, Text, View, TextInput, TouchableOpacity,
  ScrollView, KeyboardAvoidingView, Platform, SafeAreaView
} from 'react-native';
import { DashboardScreen } from './screens/DashboardScreen';

type Route = 'register' | 'login' | 'dashboard';

const C = {
  primary: '#0EA5B0',
  primaryDark: '#0B8A94',
  primaryLight: '#E0F7F8',
  navy: '#1E3A5F',
  bg: '#F0FBFC',
  border: '#D9E2E8',
  textSecondary: '#4E6478',
  textMuted: '#94A3B4',
  danger: '#EF4444',
  success: '#10B981',
  white: '#FFFFFF',
};

export default function App() {
  const [route, setRoute] = useState<Route>('dashboard');
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
            <Text style={s.logo}>FiCo AI</Text>
            <Text style={s.subtitle}>Tekrar hos geldin</Text>
            <View style={s.card}>
              <Text style={s.cardTitle}>Giris Yap</Text>
              <TextInput
                style={s.input}
                placeholder="Email"
                placeholderTextColor={C.textMuted}
                value={loginEmail}
                onChangeText={t => { setLoginEmail(t); setError(''); }}
                keyboardType="email-address"
                autoCapitalize="none"
              />
              <TextInput
                style={s.input}
                placeholder="Sifre"
                placeholderTextColor={C.textMuted}
                value={loginPassword}
                onChangeText={t => { setLoginPassword(t); setError(''); }}
                secureTextEntry
              />
              <TouchableOpacity style={{ alignSelf: 'flex-end', marginBottom: 16 }}>
                <Text style={s.link}>Sifremi unuttum</Text>
              </TouchableOpacity>
              {error ? <Text style={s.error}>{error}</Text> : null}
              <TouchableOpacity
                style={s.btn}
                onPress={() => {
                  if (!loginEmail || !loginPassword) {
                    setError('Email ve sifre zorunludur.');
                    return;
                  }
                  setRoute('dashboard');
                }}
              >
                <Text style={s.btnText}>Giris Yap</Text>
              </TouchableOpacity>
            </View>
            <View style={s.switchRow}>
              <Text style={s.switchText}>Hesabin yok mu? </Text>
              <TouchableOpacity onPress={() => setRoute('register')}>
                <Text style={s.link}>Kayit Ol</Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
        <StatusBar style="auto" />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={[s.safe, { backgroundColor: C.bg }]}>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={{ flex: 1 }}>
        <ScrollView contentContainerStyle={s.scroll} keyboardShouldPersistTaps="handled">
          <Text style={s.logo}>FiCo AI</Text>
          <Text style={s.subtitle}>Finansal ozgurluğune hos geldin</Text>
          <View style={s.card}>
            <Text style={s.cardTitle}>Hesap Olustur</Text>
            <TextInput
              style={s.input}
              placeholder="Ad Soyad"
              placeholderTextColor={C.textMuted}
              value={fullName}
              onChangeText={setFullName}
            />
            <TextInput
              style={s.input}
              placeholder="Email"
              placeholderTextColor={C.textMuted}
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
            />
            <TextInput
              style={s.input}
              placeholder="Sifre (min 8 karakter)"
              placeholderTextColor={C.textMuted}
              value={password}
              onChangeText={setPassword}
              secureTextEntry
            />
            <TouchableOpacity style={s.checkRow} onPress={() => setKvkk(!kvkk)}>
              <View style={[s.checkbox, kvkk && s.checkboxOn]}>
                {kvkk && <Text style={{ color: C.white, fontSize: 11 }}>✓</Text>}
              </View>
              <Text style={s.checkLabel}>KVKK onayini kabul ediyorum</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[s.btn, !canRegister && s.btnDisabled]}
              disabled={!canRegister}
              onPress={() => setRoute('dashboard')}
            >
              <Text style={s.btnText}>Kayit Ol</Text>
            </TouchableOpacity>
          </View>
          <View style={s.switchRow}>
            <Text style={s.switchText}>Zaten hesabin var mi? </Text>
            <TouchableOpacity onPress={() => setRoute('login')}>
              <Text style={s.link}>Giris Yap</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
      <StatusBar style="auto" />
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  safe: { flex: 1 },
  scroll: { padding: 24, paddingTop: 48 },
  logo: { fontSize: 28, fontWeight: '600', color: C.primary, marginBottom: 4 },
  subtitle: { fontSize: 14, color: C.textSecondary, marginBottom: 24 },
  card: {
    backgroundColor: C.white, borderRadius: 16,
    padding: 24, marginBottom: 16,
    borderWidth: 1, borderColor: C.border,
  },
  cardTitle: { fontSize: 18, fontWeight: '600', color: C.navy, marginBottom: 16 },
  input: {
    height: 48, borderWidth: 1.5, borderColor: C.border,
    borderRadius: 8, paddingHorizontal: 14, fontSize: 14,
    color: C.navy, marginBottom: 12, backgroundColor: C.white,
  },
  checkRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 16 },
  checkbox: {
    width: 20, height: 20, borderRadius: 4,
    borderWidth: 1.5, borderColor: C.border,
    marginRight: 8, alignItems: 'center', justifyContent: 'center',
  },
  checkboxOn: { backgroundColor: C.primary, borderColor: C.primary },
  checkLabel: { fontSize: 13, color: C.textSecondary, flex: 1 },
  btn: { height: 48, backgroundColor: C.primary, borderRadius: 8, alignItems: 'center', justifyContent: 'center' },
  btnDisabled: { opacity: 0.45 },
  btnText: { color: C.white, fontSize: 15, fontWeight: '600' },
  switchRow: { flexDirection: 'row', justifyContent: 'center', marginTop: 8 },
  switchText: { fontSize: 13, color: C.textSecondary },
  link: { fontSize: 13, color: C.primary, fontWeight: '500' },
  error: { fontSize: 12, color: C.danger, marginBottom: 12 },
});