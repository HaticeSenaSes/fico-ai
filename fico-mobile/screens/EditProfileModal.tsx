import { useState } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity, TextInput,
  Modal, SafeAreaView, ScrollView
} from 'react-native';

const C = {
  primary: '#0EA5B0', primaryLight: '#E0F7F8',
  navy: '#1E3A5F', border: '#D9E2E8',
  textSecondary: '#4E6478', textMuted: '#94A3B4',
  white: '#FFFFFF', neutral: '#EFF3F5',
};

type Props = { visible: boolean; onClose: () => void };

export function EditProfileModal({ visible, onClose }: Props) {
  const [fullName, setFullName] = useState('Hatice Sena Ses');
  const [university, setUniversity] = useState('Yeditepe Üniversitesi');
  const [city, setCity] = useState('İstanbul');
  const [year, setYear] = useState('4');

  return (
    <Modal visible={visible} animationType="slide" presentationStyle="pageSheet" onRequestClose={onClose}>
      <SafeAreaView style={[s.safe, { backgroundColor: C.white }]}>
        <View style={s.header}>
          <TouchableOpacity onPress={onClose}>
            <Text style={s.cancel}>İptal</Text>
          </TouchableOpacity>
          <Text style={s.title}>Profili Düzenle</Text>
          <TouchableOpacity onPress={onClose}>
            <Text style={[s.cancel, { color: C.primary }]}>Kaydet</Text>
          </TouchableOpacity>
        </View>
        <ScrollView contentContainerStyle={s.body}>
          <View style={s.avatarWrap}>
            <View style={s.avatar}>
              <Text style={s.avatarText}>HS</Text>
            </View>
            <TouchableOpacity style={s.avatarEditBtn}>
              <Text style={s.avatarEditText}>Fotoğraf Değiştir</Text>
            </TouchableOpacity>
          </View>

          <Text style={s.label}>Ad Soyad</Text>
          <TextInput style={s.input} value={fullName} onChangeText={setFullName} placeholderTextColor={C.textMuted} />

          <Text style={s.label}>Üniversite</Text>
          <TextInput style={s.input} value={university} onChangeText={setUniversity} placeholderTextColor={C.textMuted} />

          <Text style={s.label}>Şehir</Text>
          <TextInput style={s.input} value={city} onChangeText={setCity} placeholderTextColor={C.textMuted} />

          <Text style={s.label}>Sınıf</Text>
          <View style={s.yearRow}>
            {['1', '2', '3', '4', '5', 'Yüksek Lisans'].map(y => (
              <TouchableOpacity
                key={y}
                style={[s.yearChip, year === y && s.yearChipActive]}
                onPress={() => setYear(y)}
              >
                <Text style={[s.yearChipText, year === y && s.yearChipTextActive]}>{y}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </ScrollView>
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
  cancel: { fontSize: 15, color: C.textSecondary },
  title: { fontSize: 16, fontWeight: '600', color: C.navy },
  body: { padding: 24 },
  avatarWrap: { alignItems: 'center', marginBottom: 28 },
  avatar: {
    width: 80, height: 80, borderRadius: 40,
    backgroundColor: C.primaryLight, alignItems: 'center', justifyContent: 'center',
    marginBottom: 12,
  },
  avatarText: { fontSize: 28, fontWeight: '600', color: C.primary },
  avatarEditBtn: { paddingHorizontal: 16, paddingVertical: 8, backgroundColor: C.primaryLight, borderRadius: 8 },
  avatarEditText: { fontSize: 13, color: C.primary, fontWeight: '500' },
  label: { fontSize: 13, fontWeight: '500', color: C.textSecondary, marginBottom: 8 },
  input: {
    height: 48, borderWidth: 1.5, borderColor: C.border,
    borderRadius: 8, paddingHorizontal: 14, fontSize: 14,
    color: C.navy, marginBottom: 16, backgroundColor: C.white,
  },
  yearRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 16 },
  yearChip: {
    paddingHorizontal: 14, paddingVertical: 8,
    borderRadius: 99, borderWidth: 1.5, borderColor: C.border,
  },
  yearChipActive: { backgroundColor: C.primaryLight, borderColor: C.primary },
  yearChipText: { fontSize: 13, color: C.textSecondary },
  yearChipTextActive: { color: C.primary, fontWeight: '500' },
});