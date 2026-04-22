import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { useApp, sessionMinutes } from '../context/AppContext';

export default function AnalysisScreen() {
  const { sessionHistory, totalSessions, totalFocusMinutes, colors } = useApp();

  const workSessions = sessionHistory.filter((s) => s.type === 'work');
  const breakSessions = sessionHistory.filter((s) => s.type === 'break');

  const averageSession =
    workSessions.length > 0
      ? Math.round(
          workSessions.reduce((sum, s) => sum + sessionMinutes(s), 0) /
            workSessions.length
        )
      : 0;

  const productivityRate =
    sessionHistory.length > 0
      ? Math.round((workSessions.length / sessionHistory.length) * 100)
      : 0;

  const todayStr = new Date().toLocaleDateString('tr-TR');

  const todayFocusMinutes = workSessions
    .filter((s) => s.date === todayStr)
    .reduce((sum, s) => sum + sessionMinutes(s), 0);

  const groupedByDay: Record<string, number> = {};

  workSessions.forEach((session) => {
    const minutes = sessionMinutes(session);
    groupedByDay[session.date] = (groupedByDay[session.date] || 0) + minutes;
  });

  const sortedDays = Object.entries(groupedByDay).sort((a, b) => b[1] - a[1]);
  const bestDay = sortedDays.length > 0 ? sortedDays[0][0] : '-';

  const hourMap: Record<number, number> = {};
  workSessions.forEach((session) => {
    const hour = session.hour ?? 0;
    hourMap[hour] = (hourMap[hour] || 0) + sessionMinutes(session);
  });

  const bestHourEntry = Object.entries(hourMap).sort((a, b) => b[1] - a[1])[0];
  const bestHour = bestHourEntry ? `${bestHourEntry[0]}:00` : '-';

  const weekLabels = ['Pzt', 'Sal', 'Çar', 'Per', 'Cum', 'Cmt', 'Paz'];
  const weekData = [0, 0, 0, 0, 0, 0, 0];

  const now = new Date();
  const monday = new Date(now);
  const currentDay = monday.getDay();
  const diff = currentDay === 0 ? -6 : 1 - currentDay;
  monday.setDate(now.getDate() + diff);
  monday.setHours(0, 0, 0, 0);

  workSessions.forEach((session) => {
    const parts = session.date.split('.');
    if (parts.length !== 3) return;

    const [day, month, year] = parts.map(Number);
    const dateObj = new Date(year, month - 1, day);

    const dayDiff = Math.floor(
      (dateObj.getTime() - monday.getTime()) / (1000 * 60 * 60 * 24)
    );

    if (dayDiff >= 0 && dayDiff < 7) {
      weekData[dayDiff] += sessionMinutes(session);
    }
  });

  const maxMinutes = Math.max(...weekData, 1);

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: colors.background }]}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
    >
      <Text style={[styles.title, { color: colors.text }]}>Analiz</Text>
      <Text style={[styles.subtitle, { color: colors.textMuted }]}>
        Gerçek çalışma verilerinin özeti
      </Text>

      <View style={styles.summaryGrid}>
        <View style={[styles.summaryCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <Text style={[styles.summaryValue, { color: colors.accent }]}>{totalSessions}</Text>
          <Text style={[styles.summaryLabel, { color: colors.textMuted }]}>Toplam Odak Oturumu</Text>
        </View>

        <View style={[styles.summaryCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <Text style={[styles.summaryValue, { color: colors.accent }]}>{totalFocusMinutes} dk</Text>
          <Text style={[styles.summaryLabel, { color: colors.textMuted }]}>Toplam Odak Süresi</Text>
        </View>

        <View style={[styles.summaryCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <Text style={[styles.summaryValue, { color: colors.accent }]}>{averageSession} dk</Text>
          <Text style={[styles.summaryLabel, { color: colors.textMuted }]}>Ortalama Oturum</Text>
        </View>

        <View style={[styles.summaryCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <Text style={[styles.summaryValue, { color: colors.accent }]}>%{productivityRate}</Text>
          <Text style={[styles.summaryLabel, { color: colors.textMuted }]}>Odak Oranı</Text>
        </View>
      </View>

      <View style={[styles.card, { backgroundColor: colors.cardAlt, borderColor: colors.border }]}>
        <Text style={[styles.cardTitle, { color: colors.text }]}>Bu Hafta</Text>

        <View style={styles.chartBox}>
          {weekData.map((minutes, index) => {
            const barHeight = maxMinutes > 0 ? (minutes / maxMinutes) * 120 : 0;

            return (
              <View key={weekLabels[index]} style={styles.barItem}>
                <View style={[styles.barBackground, { backgroundColor: colors.accentSoft }]}>
                  <View
                    style={[
                      styles.barFill,
                      {
                        height: barHeight,
                        backgroundColor: colors.accent,
                      },
                    ]}
                  />
                </View>
                <Text style={[styles.barValue, { color: colors.text }]}>{minutes}</Text>
                <Text style={[styles.barLabel, { color: colors.textMuted }]}>{weekLabels[index]}</Text>
              </View>
            );
          })}
        </View>
      </View>

      <View style={[styles.card, { backgroundColor: colors.cardAlt, borderColor: colors.border }]}>
        <Text style={[styles.cardTitle, { color: colors.text }]}>Performans Özeti</Text>
        <Text style={[styles.infoText, { color: colors.textMuted }]}>
          Bugünkü odak süresi: {todayFocusMinutes} dk
        </Text>
        <Text style={[styles.infoText, { color: colors.textMuted }]}>
          En verimli gün: {bestDay}
        </Text>
        <Text style={[styles.infoText, { color: colors.textMuted }]}>
          En verimli saat: {bestHour}
        </Text>
        <Text style={[styles.infoText, { color: colors.textMuted }]}>
          Toplam mola oturumu: {breakSessions.length}
        </Text>
      </View>

      <View style={[styles.card, { backgroundColor: colors.cardAlt, borderColor: colors.border }]}>
        <Text style={[styles.cardTitle, { color: colors.text }]}>Yorum</Text>
        <Text style={[styles.infoText, { color: colors.textMuted }]}>
          {totalSessions === 0
            ? 'Henüz kayıtlı çalışma verin yok. İlk odak oturumunu tamamladığında analizler burada görünecek.'
            : todayFocusMinutes >= 100
            ? 'Bugün oldukça iyi bir odak performansı gösterdin.'
            : 'Daha düzenli kısa oturumlarla günlük performansını artırabilirsin.'}
        </Text>
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
  summaryGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 18,
  },
  summaryCard: {
    width: '48%',
    borderRadius: 20,
    paddingVertical: 22,
    paddingHorizontal: 16,
    marginBottom: 12,
    borderWidth: 1,
  },
  summaryValue: {
    fontSize: 24,
    fontWeight: '800',
    marginBottom: 8,
  },
  summaryLabel: {
    fontSize: 13,
    lineHeight: 18,
  },
  card: {
    borderRadius: 20,
    padding: 18,
    borderWidth: 1,
    marginBottom: 14,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 16,
  },
  infoText: {
    fontSize: 14,
    lineHeight: 22,
    marginBottom: 6,
  },
  chartBox: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    height: 170,
    marginTop: 6,
  },
  barItem: {
    alignItems: 'center',
    width: 36,
  },
  barBackground: {
    width: 24,
    height: 120,
    borderRadius: 12,
    justifyContent: 'flex-end',
    overflow: 'hidden',
    marginBottom: 8,
  },
  barFill: {
    width: '100%',
    borderRadius: 12,
  },
  barValue: {
    fontSize: 11,
    marginBottom: 4,
  },
  barLabel: {
    fontSize: 12,
  },
});