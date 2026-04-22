import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { useApp, sessionMinutes } from '../context/AppContext';

export default function StatsScreen() {
  const {
    sessionHistory,
    totalSessions,
    totalFocusMinutes,
    completedSessionsToday,
    tasks,
    colors,
  } = useApp();

  const completedTasks = tasks.filter((task) => task.completed).length;
  const workSessions = sessionHistory.filter((s) => s.type === 'work');

  const averageSession =
    workSessions.length > 0
      ? Math.round(
          workSessions.reduce((sum, s) => sum + sessionMinutes(s), 0) /
            workSessions.length
        )
      : 0;

  const recentSessions = sessionHistory.slice(0, 6);

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: colors.background }]}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
    >
      <Text style={[styles.title, { color: colors.text }]}>İstatistik</Text>
      <Text style={[styles.subtitle, { color: colors.textMuted }]}>
        Çalışma verilerinin genel özeti
      </Text>

      <View style={styles.grid}>
        <View
          style={[
            styles.card,
            { backgroundColor: colors.card, borderColor: colors.border },
          ]}
        >
          <Text style={[styles.value, { color: colors.accent }]}>
            {completedSessionsToday}
          </Text>
          <Text style={[styles.label, { color: colors.textMuted }]}>
            Bugünkü Oturum
          </Text>
        </View>

        <View
          style={[
            styles.card,
            { backgroundColor: colors.card, borderColor: colors.border },
          ]}
        >
          <Text style={[styles.value, { color: colors.accent }]}>
            {totalSessions}
          </Text>
          <Text style={[styles.label, { color: colors.textMuted }]}>
            Toplam Oturum
          </Text>
        </View>

        <View
          style={[
            styles.card,
            { backgroundColor: colors.card, borderColor: colors.border },
          ]}
        >
          <Text style={[styles.value, { color: colors.accent }]}>
            {totalFocusMinutes} dk
          </Text>
          <Text style={[styles.label, { color: colors.textMuted }]}>
            Toplam Odak Süresi
          </Text>
        </View>

        <View
          style={[
            styles.card,
            { backgroundColor: colors.card, borderColor: colors.border },
          ]}
        >
          <Text style={[styles.value, { color: colors.accent }]}>
            {averageSession} dk
          </Text>
          <Text style={[styles.label, { color: colors.textMuted }]}>
            Ortalama Oturum
          </Text>
        </View>
      </View>

      <View
        style={[
          styles.infoCard,
          { backgroundColor: colors.cardAlt, borderColor: colors.border },
        ]}
      >
        <Text style={[styles.infoTitle, { color: colors.text }]}>
          Görev Özeti
        </Text>
        <Text style={[styles.infoText, { color: colors.textMuted }]}>
          Toplam görev: {tasks.length}
        </Text>
        <Text style={[styles.infoText, { color: colors.textMuted }]}>
          Tamamlanan görev: {completedTasks}
        </Text>
        <Text style={[styles.infoText, { color: colors.textMuted }]}>
          Devam eden görev: {tasks.length - completedTasks}
        </Text>
      </View>

      <View
        style={[
          styles.infoCard,
          { backgroundColor: colors.cardAlt, borderColor: colors.border },
        ]}
      >
        <Text style={[styles.infoTitle, { color: colors.text }]}>
          Son Oturumlar
        </Text>

        {recentSessions.length === 0 ? (
          <Text style={[styles.emptyText, { color: colors.textMuted }]}>
            Henüz kayıtlı oturum yok.
          </Text>
        ) : (
          recentSessions.map((session) => (
            <View
              key={session.id}
              style={[styles.sessionRow, { borderBottomColor: colors.border }]}
            >
              <View>
                <Text style={[styles.sessionType, { color: colors.text }]}>
                  {session.type === 'work' ? 'Odak Oturumu' : 'Mola'}
                </Text>
                <Text style={[styles.sessionDate, { color: colors.textMuted }]}>
                  {session.date}
                </Text>
              </View>

              <Text style={[styles.sessionDuration, { color: colors.accent }]}>
                {sessionMinutes(session)} dk
              </Text>
            </View>
          ))
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    paddingHorizontal: 20,
    paddingTop: 28,
    paddingBottom: 28,
  },
  title: {
    fontSize: 30,
    fontWeight: '800',
    marginBottom: 6,
  },
  subtitle: {
    fontSize: 15,
    marginBottom: 22,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 18,
  },
  card: {
    width: '48%',
    borderRadius: 20,
    paddingVertical: 22,
    paddingHorizontal: 16,
    marginBottom: 12,
    borderWidth: 1,
  },
  value: {
    fontSize: 24,
    fontWeight: '800',
    marginBottom: 8,
  },
  label: {
    fontSize: 13,
    lineHeight: 18,
  },
  infoCard: {
    borderRadius: 20,
    padding: 18,
    borderWidth: 1,
    marginBottom: 14,
  },
  infoTitle: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 14,
  },
  infoText: {
    fontSize: 14,
    lineHeight: 22,
    marginBottom: 4,
  },
  emptyText: {
    fontSize: 14,
    lineHeight: 22,
  },
  sessionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
  },
  sessionType: {
    fontSize: 15,
    fontWeight: '600',
    marginBottom: 4,
  },
  sessionDate: {
    fontSize: 13,
  },
  sessionDuration: {
    fontSize: 15,
    fontWeight: '700',
  },
});