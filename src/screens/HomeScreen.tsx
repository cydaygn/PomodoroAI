import React, { useEffect, useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  AppState,
  AppStateStatus,
} from 'react-native';
import { useApp } from '../context/AppContext';

export default function HomeScreen() {
  const {
    workDuration,
    breakDuration,
    setWorkDuration,
    setBreakDuration,
    completedSessionsToday,
    dailyGoal,
    autoStartBreak,
    addSession,
    colors,
  } = useApp();

  const [mode, setMode] = useState<'work' | 'break'>('work');
  const [timeLeft, setTimeLeft] = useState(workDuration);
  const [isRunning, setIsRunning] = useState(false);
  const appState = useRef<AppStateStatus>(AppState.currentState);

  useEffect(() => {
    setTimeLeft(mode === 'work' ? workDuration : breakDuration);
  }, [mode, workDuration, breakDuration]);

  useEffect(() => {
    let intervalId: ReturnType<typeof setInterval> | undefined;

    if (isRunning) {
      intervalId = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
  const finishedMode = mode;
  const duration = finishedMode === 'work' ? workDuration : breakDuration;

  setTimeout(() => addSession(duration, finishedMode), 0);

  if (finishedMode === 'work') {
    setMode('break');

    if (autoStartBreak) {
      setIsRunning(true);
    } else {
      setIsRunning(false);
    }

    return breakDuration;
  } else {
    setMode('work');
    setIsRunning(false);
    return workDuration;
  }
}
          return prev - 1;
        });
      }, 1000);
    }

    return () => {
      if (intervalId) clearInterval(intervalId);
    };
  }, [isRunning, mode, workDuration, breakDuration, autoStartBreak, addSession]);

  // Uygulama arka plana gidince sayacı durdur
  useEffect(() => {
    const sub = AppState.addEventListener('change', (next) => {
      if (appState.current === 'active' && next.match(/inactive|background/)) {
        setIsRunning(false);
      }
      appState.current = next;
    });
    return () => sub.remove();
  }, []);

  const formatTime = (totalSeconds: number) => {
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    const mm = minutes < 10 ? `0${minutes}` : `${minutes}`;
    const ss = seconds < 10 ? `0${seconds}` : `${seconds}`;
    return `${mm}:${ss}`;
  };

  const handleStartPause = () => setIsRunning((prev) => !prev);

  const handleReset = () => {
    setIsRunning(false);
    setTimeLeft(mode === 'work' ? workDuration : breakDuration);
  };

  const handleSkip = () => {
    setIsRunning(false);
    const nextMode = mode === 'work' ? 'break' : 'work';
    setMode(nextMode);
    setTimeLeft(nextMode === 'work' ? workDuration : breakDuration);
  };

  const progress = mode === 'work'
    ? 1 - timeLeft / workDuration
    : 1 - timeLeft / breakDuration;

  const goalProgress = Math.min(completedSessionsToday / dailyGoal, 1);

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: colors.background }]}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
    >
      <Text style={[styles.title, { color: colors.text }]}>Pomodoro</Text>
      <Text style={[styles.subtitle, { color: colors.textMuted }]}>Odaklan ve zamanını yönet</Text>

      {/* Bugünkü ilerleme */}
      <View style={[styles.goalCard, { backgroundColor: colors.card }]}>
        <View style={styles.goalHeader}>
          <Text style={[styles.goalLabel, { color: colors.textMuted }]}>Bugünkü hedef</Text>
          <Text style={[styles.goalValue, { color: colors.accent }]}>{completedSessionsToday} / {dailyGoal} oturum</Text>
        </View>
        <View style={[styles.progressBar, { backgroundColor: colors.accentSoft }]}>
          <View style={[styles.progressFill, { width: `${goalProgress * 100}%`, backgroundColor: colors.accent }]} />
        </View>
      </View>

      {/* Ana kart */}
      <View style={[styles.card, { backgroundColor: colors.card }, mode === 'break' && styles.cardBreak]}>
        <Text style={[styles.mode, { color: colors.accent }, mode === 'break' && styles.modeBreak]}>
          {mode === 'work' ? 'Focus Time' : 'Mola'}
        </Text>
        <Text style={[styles.timer, { color: colors.text }]}>{formatTime(timeLeft)}</Text>

        {/* Süre ilerleme çubuğu */}
        <View style={[styles.timerProgressBar, { backgroundColor: colors.accentSoft }]}>
          <View style={[styles.timerProgressFill, { width: `${progress * 100}%`, backgroundColor: colors.accent }]} />
        </View>

        <View style={styles.buttons}>
          <TouchableOpacity style={[styles.primaryButton, { backgroundColor: colors.accent }]} onPress={handleStartPause}>
            <Text style={[styles.primaryButtonText, { color: colors.tabTextActive }]}>
              {isRunning ? 'Duraklat' : 'Başlat'}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.secondaryButton, { backgroundColor: colors.accentSoft }]} onPress={handleReset}>
            <Text style={[styles.secondaryButtonText, { color: colors.text } ]}>Sıfırla</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.smallButton, { backgroundColor: colors.cardAlt }]} onPress={handleSkip}>
            <Text style={[styles.smallButtonText, { color: colors.textMuted }]}>Molaya Geç</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Hızlı süre ayarları */}
      <View style={[styles.settingsCard, { backgroundColor: colors.cardAlt, borderColor: colors.border }]}>
        <Text style={[styles.settingsTitle, { color: colors.text }]}>Hızlı ayarlar</Text>
        <View style={styles.durationRow}>
          <View style={styles.durationBlock}>
            <Text style={[styles.durationLabel, { color: colors.textMuted }]}>Çalışma (dk)</Text>
            <View style={styles.durationControls}>
              <TouchableOpacity
                style={[styles.durBtn, { backgroundColor: colors.accentSoft }]}
                onPress={() => setWorkDuration(Math.max(5, workDuration / 60 - 5) * 60)}
              >
                <Text style={[styles.durBtnText, { color: colors.accent }]}>−</Text>
              </TouchableOpacity>
              <Text style={[styles.durValue, { color: colors.text }]}>{Math.floor(workDuration / 60)}</Text>
              <TouchableOpacity
                style={[styles.durBtn, { backgroundColor: colors.accentSoft }]}
                onPress={() => setWorkDuration((workDuration / 60 + 5) * 60)}
              >
                <Text style={[styles.durBtnText, { color: colors.accent }]}>+</Text>
              </TouchableOpacity>
            </View>
          </View>
          <View style={styles.durationBlock}>
            <Text style={[styles.durationLabel, { color: colors.textMuted }]}>Mola (dk)</Text>
            <View style={styles.durationControls}>
              <TouchableOpacity
                style={[styles.durBtn, { backgroundColor: colors.accentSoft }]}
                onPress={() => setBreakDuration(Math.max(1, breakDuration / 60 - 1) * 60)}
              >
                <Text style={[styles.durBtnText, { color: colors.accent }]}>−</Text>
              </TouchableOpacity>
              <Text style={[styles.durValue, { color: colors.text }]}>{Math.floor(breakDuration / 60)}</Text>
              <TouchableOpacity
                style={[styles.durBtn, { backgroundColor: colors.accentSoft }]}
                onPress={() => setBreakDuration((breakDuration / 60 + 1) * 60)}
              >
                <Text style={[styles.durBtnText, { color: colors.accent }]}>+</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </View>

      <View style={[styles.infoBox, { backgroundColor: colors.card, borderColor: colors.border }]}>
        <Text style={[styles.infoTitle, { color: colors.text }]}>Durum</Text>
        <Text style={[styles.infoText, { color: colors.textMuted }]}>
          {isRunning
            ? mode === 'work'
              ? 'Odaklanma modunda.'
              : 'Moladasın, dinlen.'
            : 'Sayaç hazır. Başlat için tıkla.'}
        </Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { paddingHorizontal: 20, paddingTop: 24, paddingBottom: 100 },
  title: { fontSize: 30, fontWeight: '800', color: '#F8FAFC', marginBottom: 6 },
  subtitle: { fontSize: 15, color: '#A5B4CC', marginBottom: 20 },
  goalCard: {
    backgroundColor: '#132034',
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
  },
  goalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  goalLabel: { fontSize: 14, color: '#94A3B8' },
  goalValue: { fontSize: 14, fontWeight: '700', color: '#14B8A6' },
  progressBar: {
    height: 8,
    backgroundColor: '#1E293B',
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#14B8A6',
    borderRadius: 4,
  },
  card: {
    backgroundColor: '#132034',
    borderRadius: 24,
    padding: 24,
    alignItems: 'center',
    marginBottom: 16,
  },
  cardBreak: { borderWidth: 2, borderColor: '#22D3EE' },
  mode: { color: '#14B8A6', fontSize: 16, fontWeight: '700', marginBottom: 10 },
  modeBreak: { color: '#22D3EE' },
  timer: { color: '#F8FAFC', fontSize: 56, fontWeight: '800', marginBottom: 16 },
  timerProgressBar: {
    width: '100%',
    height: 6,
    backgroundColor: '#1E293B',
    borderRadius: 3,
    overflow: 'hidden',
    marginBottom: 20,
  },
  timerProgressFill: {
    height: '100%',
    backgroundColor: '#14B8A6',
  },
  buttons: { flexDirection: 'row', gap: 10 },
  primaryButton: {
    backgroundColor: '#14B8A6',
    paddingVertical: 14,
    paddingHorizontal: 22,
    borderRadius: 14,
  },
  primaryButtonText: { color: '#062C2C', fontWeight: '800', fontSize: 15 },
  secondaryButton: {
    backgroundColor: '#1F2C42',
    paddingVertical: 14,
    paddingHorizontal: 22,
    borderRadius: 14,
  },
  secondaryButtonText: { color: '#E2E8F0', fontWeight: '700', fontSize: 15 },
  smallButton: {
    backgroundColor: '#334155',
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderRadius: 14,
  },
  smallButtonText: { color: '#94A3B8', fontWeight: '600', fontSize: 14 },
  settingsCard: {
    backgroundColor: '#0F1A2B',
    borderRadius: 18,
    padding: 18,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#1C2A40',
  },
  settingsTitle: { color: '#F8FAFC', fontSize: 16, fontWeight: '700', marginBottom: 14 },
  durationRow: { flexDirection: 'row', gap: 20 },
  durationBlock: { flex: 1 },
  durationLabel: { color: '#94A3B8', fontSize: 13, marginBottom: 8 },
  durationControls: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  durBtn: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: '#1E293B',
    alignItems: 'center',
    justifyContent: 'center',
  },
  durBtnText: { color: '#14B8A6', fontSize: 18, fontWeight: '700' },
  durValue: { color: '#F8FAFC', fontSize: 18, fontWeight: '700', minWidth: 28, textAlign: 'center' },
  infoBox: {
    backgroundColor: '#132034',
    borderRadius: 18,
    padding: 18,
    borderWidth: 1,
    borderColor: '#1C2A40',
  },
  infoTitle: { color: '#F8FAFC', fontSize: 17, fontWeight: '700', marginBottom: 8 },
  infoText: { color: '#9FB0C7', fontSize: 14, lineHeight: 22 },
});
