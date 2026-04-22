import React, { useState } from 'react';
import { SafeAreaView, View, StyleSheet, StatusBar } from 'react-native';

import { AppProvider, useApp } from './src/context/AppContext';
import HomeScreen from './src/screens/HomeScreen';
import TasksScreen from './src/screens/TasksScreen';
import StatsScreen from './src/screens/StatsScreen';
import AnalysisScreen from './src/screens/AnalysisScreen';
import HistoryScreen from './src/screens/HistoryScreen';
import SettingsScreen from './src/screens/SettingsScreen';
import TabButton from './src/components/TabButton';

type TabType = 'Odak' | 'Tasks' | 'Stats' | 'Analysis' | 'History' | 'Settings';

function AppContent() {
  const [activeTab, setActiveTab] = useState<TabType>('Odak');
  const { colors } = useApp();

  return (
    <>
      <View style={styles.content}>
        <View style={[styles.screen, activeTab !== 'Odak' && styles.screenHidden]}>
          <HomeScreen />
        </View>

        <View style={[styles.screen, activeTab !== 'Tasks' && styles.screenHidden]}>
          <TasksScreen />
        </View>

        <View style={[styles.screen, activeTab !== 'Stats' && styles.screenHidden]}>
          <StatsScreen />
        </View>

        <View style={[styles.screen, activeTab !== 'Analysis' && styles.screenHidden]}>
          <AnalysisScreen />
        </View>

        <View style={[styles.screen, activeTab !== 'History' && styles.screenHidden]}>
          <HistoryScreen />
        </View>

        <View style={[styles.screen, activeTab !== 'Settings' && styles.screenHidden]}>
          <SettingsScreen />
        </View>
      </View>

      <View
        style={[
          styles.tabBar,
          {
            backgroundColor: colors.tabBar,
            borderTopColor: colors.tabBarBorder,
          },
        ]}
      >
        <TabButton
          label="Odak"
          isActive={activeTab === 'Odak'}
          onPress={() => setActiveTab('Odak')}
        />
        <TabButton
          label="Görev"
          isActive={activeTab === 'Tasks'}
          onPress={() => setActiveTab('Tasks')}
        />
        <TabButton
          label="İstatistik"
          isActive={activeTab === 'Stats'}
          onPress={() => setActiveTab('Stats')}
        />
        <TabButton
          label="Analiz"
          isActive={activeTab === 'Analysis'}
          onPress={() => setActiveTab('Analysis')}
        />
        <TabButton
          label="Geçmiş"
          isActive={activeTab === 'History'}
          onPress={() => setActiveTab('History')}
        />
        <TabButton
          label="Ayarlar"
          isActive={activeTab === 'Settings'}
          onPress={() => setActiveTab('Settings')}
        />
      </View>
    </>
  );
}

function AppInner() {
  const { colors, theme } = useApp();

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <StatusBar barStyle={theme === 'dark' ? 'light-content' : 'dark-content'} />
      <AppContent />
    </SafeAreaView>
  );
}

export default function App() {
  return (
    <AppProvider>
      <AppInner />
    </AppProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    position: 'relative',
  },
  screen: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  screenHidden: {
    display: 'none',
  },
  tabBar: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    borderTopWidth: 1,
    paddingVertical: 10,
  },
});