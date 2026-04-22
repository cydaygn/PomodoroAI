import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { useApp, sessionMinutes } from '../context/AppContext';

export default function HistoryScreen() {
  const { sessionHistory, colors } = useApp();

  const grouped: Record<string, typeof sessionHistory> = {};

  sessionHistory.forEach((session) => {
    if (!grouped[session.date]) {
      grouped[session.date] = [];
    }
    grouped[session.date].push(session);
  });

  const groupedEntries = Object.entries(grouped).sort((a, b) => {
    const parseDate = (value: string) => {
      const parts = value.split('.');
      if (parts.length !== 3) return new Date(0);
      const [day, month, year] = parts.map(Number);
      return new Date(year, month - 1, day);
    };

    return parseDate(b[0]).getTime() - parseDate(a[0]).getTime();
  });

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: colors.background }]}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
    >
      <Text style={[styles.title, { color: colors.text }]}>Geçmiş</Text>
      <Text style={[styles.subtitle, { color: colors.textMuted }]}>
        Önceki çalışma oturumların
      </Text>

      {groupedEntries.length === 0 ? (
        <View
          style={[
            styles.emptyCard,
            { backgroundColor: colors.card, borderColor: colors.border },
          ]}
        >
          <Text style={[styles.emptyText, { color: colors.textMuted }]}>
            Henüz kayıtlı oturum yok.
          </Text>
        </View>
      ) : (
        groupedEntries.map(([date, sessions]) => {
          const workCount = sessions.filter((s) => s.type === 'work').length;
          const breakCount = sessions.filter((s) => s.type === 'break').length;
          const totalMinutes = sessions.reduce(
            (sum, s) => sum + sessionMinutes(s),
            0
          );

          return (
            <View
              key={date}
              style={[
                styles.dayCard,
                { backgroundColor: colors.cardAlt, borderColor: colors.border },
              ]}
            >
              <Text style={[styles.dayTitle, { color: colors.text }]}>{date}</Text>
              <Text style={[styles.daySummary, { color: colors.textMuted }]}>
                Odak: {workCount} | Mola: {breakCount} | Toplam: {totalMinutes} dk
              </Text>

              {sessions.map((session) => (
                <View
                  key={session.id}
                  style={[
                    styles.sessionRow,
                    { borderBottomColor: colors.border },
                  ]}
                >
                  <View>
                    <Text style={[styles.sessionType, { color: colors.text }]}>
                      {session.type === 'work' ? 'Odak Oturumu' : 'Mola'}
                    </Text>
                    <Text style={[styles.sessionHour, { color: colors.textMuted }]}>
                      {session.hour != null
                        ? `${String(session.hour).padStart(2, '0')}:00`
                        : 'Saat yok'}
                    </Text>
                  </View>

                  <Text style={[styles.sessionDuration, { color: colors.accent }]}>
                    {sessionMinutes(session)} dk
                  </Text>
                </View>
              ))}
            </View>
          );
        })
      )}
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
  emptyCard: {
    borderRadius: 20,
    padding: 18,
    borderWidth: 1,
  },
  emptyText: {
    fontSize: 14,
    lineHeight: 22,
  },
  dayCard: {
    borderRadius: 20,
    padding: 18,
    borderWidth: 1,
    marginBottom: 14,
  },
  dayTitle: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 6,
  },
  daySummary: {
    fontSize: 14,
    marginBottom: 12,
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
  sessionHour: {
    fontSize: 13,
  },
  sessionDuration: {
    fontSize: 15,
    fontWeight: '700',
  },
});