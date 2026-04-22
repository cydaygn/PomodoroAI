import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Switch,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { useApp } from '../context/AppContext';

export default function SettingsScreen() {
  const {
    dailyGoal,
    setDailyGoal,
    workDuration,
    setWorkDuration,
    breakDuration,
    setBreakDuration,
    notificationsEnabled,
    setNotificationsEnabled,
    autoStartBreak,
    setAutoStartBreak,
    theme,
    setTheme,
    colors,
  } = useApp();

  const [soundEnabled, setSoundEnabled] = React.useState(true);

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: colors.background }]}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
    >
      <Text style={[styles.title, { color: colors.text }]}>Ayarlar</Text>
      <Text style={[styles.subtitle, { color: colors.textMuted }]}>Kişiselleştirme ve tercihler</Text>

      {/* Pomodoro süreleri */}
      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: colors.accent }]}>Pomodoro süreleri</Text>
        <View style={[styles.row, { backgroundColor: colors.card }]}>
          <Text style={[styles.rowLabel, { color: colors.text }]}>Çalışma süresi (dk)</Text>
          <View style={styles.stepper}>
            <TouchableOpacity
              style={styles.stepperBtn}
              onPress={() => setWorkDuration(Math.max(5, workDuration / 60 - 5) * 60)}
            >
            <Text style={[styles.stepperText, { color: colors.accent }]}>−</Text>
            </TouchableOpacity>
            <Text style={[styles.stepperValue, { color: colors.text }]}>{Math.floor(workDuration / 60)}</Text>
            <TouchableOpacity
              style={styles.stepperBtn}
              onPress={() => setWorkDuration((workDuration / 60 + 5) * 60)}
            >
            <Text style={[styles.stepperText, { color: colors.accent }]}>+</Text>
            </TouchableOpacity>
          </View>
        </View>
        <View style={[styles.row, { backgroundColor: colors.card }]}>
          <Text style={[styles.rowLabel, { color: colors.text }]}>Mola süresi (dk)</Text>
          <View style={styles.stepper}>
            <TouchableOpacity
              style={styles.stepperBtn}
              onPress={() => setBreakDuration(Math.max(1, breakDuration / 60 - 1) * 60)}
            >
              <Text style={[styles.stepperText, { color: colors.accent }]}>−</Text>
            </TouchableOpacity>
            <Text style={[styles.stepperValue, { color: colors.text }]}>{Math.floor(breakDuration / 60)}</Text>
            <TouchableOpacity
              style={styles.stepperBtn}
              onPress={() => setBreakDuration((breakDuration / 60 + 1) * 60)}
            >
              <Text style={[styles.stepperText, { color: colors.accent }]}>+</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>

      {/* Bildirimler */}
      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: colors.accent }]}>Bildirimler</Text>
        <View style={[styles.row, { backgroundColor: colors.card }]}>
          <Text style={[styles.rowLabel, { color: colors.text }]}>Odak hatırlatmaları</Text>
          <Switch
            value={notificationsEnabled}
            onValueChange={setNotificationsEnabled}
            trackColor={{ false: '#334155', true: '#14B8A6' }}
            thumbColor="#F8FAFC"
          />
        </View>
      </View>

      {/* Pomodoro davranışı */}
      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: colors.accent }]}>Pomodoro davranışı</Text>
        <View style={[styles.row, { backgroundColor: colors.card }]}>
          <Text style={[styles.rowLabel, { color: colors.text }]}>Molayı otomatik başlat</Text>
          <Switch
            value={autoStartBreak}
            onValueChange={setAutoStartBreak}
            trackColor={{ false: '#334155', true: '#14B8A6' }}
            thumbColor="#F8FAFC"
          />
        </View>
        <Text style={styles.rowHint}>
          Odak oturumu bitince mola otomatik başlar
        </Text>
      </View>

      {/* Ses */}
      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: colors.accent }]}>Ses</Text>
        <View style={[styles.row, { backgroundColor: colors.card }]}>
          <Text style={[styles.rowLabel, { color: colors.text }]}>Bildirim sesi</Text>
          <Switch
            value={soundEnabled}
            onValueChange={setSoundEnabled}
            trackColor={{ false: '#334155', true: '#14B8A6' }}
            thumbColor="#F8FAFC"
          />
        </View>
      </View>

      {/* Kişiselleştirme */}
      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: colors.accent }]}>Kişiselleştirme</Text>
        <View style={[styles.goalRow, { backgroundColor: colors.card }]}>
          <Text style={[styles.rowLabel, { color: colors.text }]}>Günlük hedef (oturum sayısı)</Text>
          <View style={styles.stepper}>
            <TouchableOpacity
              style={styles.stepperBtn}
              onPress={() => setDailyGoal(Math.max(1, dailyGoal - 1))}
            >
              <Text style={[styles.stepperText, { color: colors.accent }]}>−</Text>
            </TouchableOpacity>
            <Text style={[styles.stepperValue, { color: colors.text }]}>{dailyGoal}</Text>
            <TouchableOpacity
              style={styles.stepperBtn}
              onPress={() => setDailyGoal(dailyGoal + 1)}
            >
              <Text style={[styles.stepperText, { color: colors.accent }]}>+</Text>
            </TouchableOpacity>
          </View>
        </View>
        <Text style={[styles.rowHint, { color: colors.textMuted }]}>
          Tamamlamak istediğin günlük Pomodoro oturum sayısı
        </Text>
      </View>

      {/* Veri */}
      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: colors.accent }]}>Veri</Text>
        <TouchableOpacity
          style={[styles.infoButton, { backgroundColor: colors.card }]}
          onPress={() =>
            Alert.alert(
              'Veri dışa aktarma',
              'SQLite entegrasyonu tamamlandığında buradan verilerinizi dışa aktarabileceksiniz.'
            )
          }
        >
          <Text style={[styles.infoButtonText, { color: colors.accent }]}>Verileri dışa aktar</Text>
        </TouchableOpacity>
      </View>

      {/* Tema seçimi */}
      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: colors.accent }]}>Tema</Text>
        <View style={[styles.row, { backgroundColor: colors.card }]}>
          <Text style={[styles.rowLabel, { color: colors.text }]}>Görünüm</Text>
          <View style={{ flexDirection: 'row', gap: 8 }}>
            <TouchableOpacity
              onPress={() => setTheme('light')}
              style={{
                paddingHorizontal: 14,
                paddingVertical: 8,
                borderRadius: 999,
                backgroundColor: theme === 'light' ? colors.accent : colors.accentSoft,
              }}
            >
              <Text

              
                style={{
                  color: theme === 'light' ? '#FFFFFF' : colors.text,
                  fontSize: 13,
                  fontWeight: '600',
                }}
              >
                Açık
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => setTheme('dark')}
              style={{
                paddingHorizontal: 14,
                paddingVertical: 8,
                borderRadius: 999,
                backgroundColor: theme === 'dark' ? colors.accent : colors.accentSoft,
              }}
            >
              <Text
                style={{
                  color: theme === 'dark' ? '#FFFFFF' : colors.text,
                  fontSize: 13,
                  fontWeight: '600',
                }}
              >
                Koyu
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>

      <Text style={[styles.footer, { color: colors.textMuted }]}>PomodoroAI v1.0</Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#081120' },
  content: { paddingHorizontal: 20, paddingTop: 24, paddingBottom: 100 },
  title: { fontSize: 28, fontWeight: '800', color: '#F8FAFC', marginBottom: 6 },
  subtitle: { fontSize: 14, color: '#A5B4CC', marginBottom: 24 },
  section: { marginBottom: 28 },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#14B8A6',
    marginBottom: 14,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#132034',
    borderRadius: 14,
    padding: 18,
    marginBottom: 10,
  },
  rowLabel: { fontSize: 15, color: '#F8FAFC', flex: 1 },
  rowHint: { fontSize: 12, color: '#64748B', marginTop: -4, marginBottom: 10 },
  stepper: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  stepperBtn: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: '#1E293B',
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepperText: { color: '#14B8A6', fontSize: 18, fontWeight: '700' },
  stepperValue: {
    fontSize: 16,
    fontWeight: '700',
    color: '#F8FAFC',
    minWidth: 28,
    textAlign: 'center',
  },
  goalRow: {
    backgroundColor: '#132034',
    borderRadius: 14,
    padding: 18,
    marginBottom: 10,
  },
  infoButton: {
    backgroundColor: '#132034',
    borderRadius: 14,
    padding: 18,
    alignItems: 'center',
  },
  infoButtonText: { color: '#14B8A6', fontSize: 15, fontWeight: '600' },
  footer: { fontSize: 12, color: '#475569', textAlign: 'center', marginTop: 20 },
});
