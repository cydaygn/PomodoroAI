import React, {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect,
} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const STORAGE_KEY = '@PomodoroAI_data';

type ThemeName = 'dark' | 'light';

const themePalettes: Record<
  ThemeName,
  {
    background: string;
    card: string;
    cardAlt: string;
    text: string;
    textMuted: string;
    accent: string;
    accentSoft: string;
    border: string;
    tabBar: string;
    tabBarBorder: string;
    tabText: string;
    tabTextActive: string;
    tabActiveBg: string;
  }
> = {
  dark: {
    background: '#081120',
    card: '#132034',
    cardAlt: '#0F1A2B',
    text: '#F8FAFC',
    textMuted: '#A5B4CC',
    accent: '#14B8A6',
    accentSoft: '#1E293B',
    border: '#1C2A40',
    tabBar: '#0D172A',
    tabBarBorder: '#162033',
    tabText: '#94A3B8',
    tabTextActive: '#062C2C',
    tabActiveBg: '#14B8A6',
  },
  light: {
    background: '#F9FAFB',
    card: '#FFFFFF',
    cardAlt: '#EEF2FF',
    text: '#0F172A',
    textMuted: '#6B7280',
    accent: '#0EA5E9',
    accentSoft: '#E5E7EB',
    border: '#E5E7EB',
    tabBar: '#FFFFFF',
    tabBarBorder: '#E5E7EB',
    tabText: '#6B7280',
    tabTextActive: '#FFFFFF',
    tabActiveBg: '#0EA5E9',
  },
};

export type Task = {
  id: string;
  title: string;
  completed: boolean;
  priority: 'yüksek' | 'orta' | 'düşük';
  pomodoroEstimate?: number;
};

export type SessionRecord = {
  id: string;
  duration: number;
  date: string;
  type: 'work' | 'break';
  hour?: number;
};

export function sessionMinutes(s: SessionRecord): number {
  if (s.duration <= 0) {
    return s.type === 'work' ? 25 : 5;
  }

  if (s.duration % 60 === 0) {
    return Math.floor(s.duration / 60);
  }

  return s.duration;
}

type StoredData = {
  tasks: Task[];
  sessionHistory: SessionRecord[];
  workDuration: number;
  breakDuration: number;
  dailyGoal: number;
  notificationsEnabled: boolean;
  autoStartBreak: boolean;
  theme: ThemeName;
};

type AppContextType = {
  workDuration: number;
  breakDuration: number;
  setWorkDuration: (v: number) => void;
  setBreakDuration: (v: number) => void;

  completedSessionsToday: number;
  totalSessions: number;
  totalFocusMinutes: number;
  sessionHistory: SessionRecord[];
  addSession: (duration: number, type: 'work' | 'break') => void;

  tasks: Task[];
  addTask: (task: Omit<Task, 'id'>) => void;
  toggleTask: (id: string) => void;
  deleteTask: (id: string) => void;

  dailyGoal: number;
  setDailyGoal: (v: number) => void;
  notificationsEnabled: boolean;
  setNotificationsEnabled: (v: boolean) => void;
  autoStartBreak: boolean;
  setAutoStartBreak: (v: boolean) => void;

  theme: ThemeName;
  setTheme: (v: ThemeName) => void;
  colors: (typeof themePalettes)[ThemeName];

  isLoaded: boolean;
  resetAllData: () => Promise<void>;
};

const AppContext = createContext<AppContextType | null>(null);

const defaultTasks: Task[] = [
  {
    id: '1',
    title: 'Bitirme projesi arayüzünü tasarla',
    completed: false,
    priority: 'yüksek',
  },
  {
    id: '2',
    title: 'Pomodoro mantığını test et',
    completed: false,
    priority: 'orta',
  },
];

async function loadData(): Promise<Partial<StoredData> | null> {
  try {
    const json = await AsyncStorage.getItem(STORAGE_KEY);
    if (json) return JSON.parse(json);
  } catch (_) {}
  return null;
}

async function saveData(data: StoredData) {
  try {
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch (_) {}
}

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [workDuration, setWorkDurationState] = useState(25 * 60);
  const [breakDuration, setBreakDurationState] = useState(5 * 60);
  const [sessionHistory, setSessionHistory] = useState<SessionRecord[]>([]);
  const [tasks, setTasks] = useState<Task[]>(defaultTasks);
  const [dailyGoal, setDailyGoalState] = useState(6);
  const [notificationsEnabled, setNotificationsEnabledState] = useState(true);
  const [autoStartBreak, setAutoStartBreakState] = useState(false);
  const [theme, setThemeState] = useState<ThemeName>('dark');

  useEffect(() => {
    loadData().then((data) => {
      if (data) {
        if (data.tasks) setTasks(data.tasks);
        if (data.sessionHistory) setSessionHistory(data.sessionHistory);
        if (data.workDuration) setWorkDurationState(data.workDuration);
        if (data.breakDuration) setBreakDurationState(data.breakDuration);
        if (data.dailyGoal != null) setDailyGoalState(data.dailyGoal);
        if (data.notificationsEnabled != null) {
          setNotificationsEnabledState(data.notificationsEnabled);
        }
        if (data.autoStartBreak != null) {
          setAutoStartBreakState(data.autoStartBreak);
        }
        if (data.theme) setThemeState(data.theme);
      }
      setIsLoaded(true);
    });
  }, []);

  useEffect(() => {
    if (!isLoaded) return;

    saveData({
      tasks,
      sessionHistory,
      workDuration,
      breakDuration,
      dailyGoal,
      notificationsEnabled,
      autoStartBreak,
      theme,
    });
  }, [
    isLoaded,
    tasks,
    sessionHistory,
    workDuration,
    breakDuration,
    dailyGoal,
    notificationsEnabled,
    autoStartBreak,
    theme,
  ]);

  const setWorkDuration = useCallback((v: number) => {
    setWorkDurationState(v);
  }, []);

  const setBreakDuration = useCallback((v: number) => {
    setBreakDurationState(v);
  }, []);

  const setDailyGoal = useCallback((v: number) => {
    setDailyGoalState(v);
  }, []);

  const setNotificationsEnabled = useCallback((v: boolean) => {
    setNotificationsEnabledState(v);
  }, []);

  const setAutoStartBreak = useCallback((v: boolean) => {
    setAutoStartBreakState(v);
  }, []);

  const setTheme = useCallback((v: ThemeName) => {
    setThemeState(v);
  }, []);

  const addSession = useCallback((duration: number, type: 'work' | 'break') => {
    const now = new Date();
    const dateStr = now.toLocaleDateString('tr-TR');
    const hour = now.getHours();

    setSessionHistory((prev) => [
      {
        id: Date.now().toString(),
        duration,
        date: dateStr,
        type,
        hour,
      },
      ...prev,
    ]);
  }, []);

  const addTask = useCallback((task: Omit<Task, 'id'>) => {
    setTasks((prev) => [
      {
        ...task,
        id: Date.now().toString(),
      },
      ...prev,
    ]);
  }, []);

  const toggleTask = useCallback((id: string) => {
    setTasks((prev) =>
      prev.map((t) => (t.id === id ? { ...t, completed: !t.completed } : t))
    );
  }, []);

  const deleteTask = useCallback((id: string) => {
    setTasks((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const resetAllData = useCallback(async () => {
    const defaultWork = 25 * 60;
    const defaultBreak = 5 * 60;
    const defaultGoal = 6;
    const defaultTheme: ThemeName = 'dark';

    setTasks(defaultTasks);
    setSessionHistory([]);
    setWorkDurationState(defaultWork);
    setBreakDurationState(defaultBreak);
    setDailyGoalState(defaultGoal);
    setNotificationsEnabledState(true);
    setAutoStartBreakState(false);
    setThemeState(defaultTheme);

    try {
      await AsyncStorage.removeItem(STORAGE_KEY);
    } catch (_) {}
  }, []);

  const todayStr = new Date().toLocaleDateString('tr-TR');

  const completedSessionsToday = sessionHistory.filter(
    (s) => s.date === todayStr && s.type === 'work'
  ).length;

  const totalSessions = sessionHistory.filter((s) => s.type === 'work').length;

  const totalFocusMinutes = sessionHistory
    .filter((s) => s.type === 'work')
    .reduce((sum, s) => sum + sessionMinutes(s), 0);

  const colors = themePalettes[theme];

  const value: AppContextType = {
    workDuration,
    breakDuration,
    setWorkDuration,
    setBreakDuration,

    completedSessionsToday,
    totalSessions,
    totalFocusMinutes,
    sessionHistory,
    addSession,

    tasks,
    addTask,
    toggleTask,
    deleteTask,

    dailyGoal,
    setDailyGoal,
    notificationsEnabled,
    setNotificationsEnabled,
    autoStartBreak,
    setAutoStartBreak,

    theme,
    setTheme,
    colors,

    isLoaded,
    resetAllData,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) {
    throw new Error('useApp must be used within AppProvider');
  }
  return ctx;
}