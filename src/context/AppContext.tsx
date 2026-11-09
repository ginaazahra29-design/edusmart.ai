import React, { createContext, useContext, useEffect, useState } from 'react';
import {
  checkApiStatus,
  clearAllHistory,
  deleteHistoryItem,
  fetchHistory,
  fetchProfile,
  saveHistoryItem,
  updateProfile,
} from '../api/client';
import { EducationLevel, HistoryItem, QuizResult, UserProfile } from '../types';

export type AppView =
  | 'home'
  | 'dashboard'
  | 'tutor'
  | 'summarize'
  | 'quiz'
  | 'evaluation'
  | 'history'
  | 'profile'
  | 'report';

interface AppContextType {
  currentView: AppView;
  setCurrentView: (view: AppView) => void;
  profile: UserProfile;
  setProfile: React.Dispatch<React.SetStateAction<UserProfile>>;
  updateUserProfile: (updates: Partial<UserProfile>) => Promise<void>;
  history: HistoryItem[];
  addHistory: (item: Partial<HistoryItem>) => Promise<void>;
  removeHistoryItem: (id: string) => Promise<void>;
  clearHistory: () => Promise<void>;
  currentQuizResult: QuizResult | null;
  setCurrentQuizResult: (result: QuizResult | null) => void;
  hasApiKey: boolean;
  refreshApiStatus: () => Promise<void>;
  // Seamless inter-tool navigation
  targetTutorQuery: { question: string; subject?: string } | null;
  setTargetTutorQuery: (query: { question: string; subject?: string } | null) => void;
  targetSummaryText: string | null;
  setTargetSummaryText: (text: string | null) => void;
  stats: {
    totalQuizzes: number;
    totalSummaries: number;
    totalTutorChats: number;
    averageQuizScore: number;
    completedToday: number;
  };
}

const defaultProfile: UserProfile = {
  name: 'Gina Azzahra',
  educationLevel: 'SMA/SMK',
  institution: 'SMA Negeri 1 Edukasi',
  majorOrGrade: 'Kelas 11 MIPA',
  targetDailyQuestions: 10,
  targetDailyMinutes: 45,
  streakDays: 5,
  avatarSeed: 'Gina',
};

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentView, setCurrentView] = useState<AppView>('home');
  const [profile, setProfile] = useState<UserProfile>(defaultProfile);
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [currentQuizResult, setCurrentQuizResult] = useState<QuizResult | null>(null);
  const [hasApiKey, setHasApiKey] = useState<boolean>(true);
  const [targetTutorQuery, setTargetTutorQuery] = useState<{ question: string; subject?: string } | null>(null);
  const [targetSummaryText, setTargetSummaryText] = useState<string | null>(null);

  // Load initial data
  const refreshApiStatus = async () => {
    try {
      const status = await checkApiStatus();
      setHasApiKey(status.hasApiKey);
    } catch {
      setHasApiKey(false);
    }
  };

  const loadData = async () => {
    try {
      await refreshApiStatus();
      const [fetchedProfile, fetchedHistory] = await Promise.all([
        fetchProfile().catch(() => defaultProfile),
        fetchHistory().catch(() => []),
      ]);
      if (fetchedProfile && fetchedProfile.name) {
        setProfile(fetchedProfile);
      }
      if (Array.isArray(fetchedHistory)) {
        setHistory(fetchedHistory);
      }
    } catch (err) {
      console.warn('Initialization error:', err);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleUpdateProfile = async (updates: Partial<UserProfile>) => {
    try {
      const updated = await updateProfile(updates);
      setProfile(updated);
    } catch (err) {
      console.error(err);
      setProfile((prev) => ({ ...prev, ...updates }));
    }
  };

  const handleAddHistory = async (item: Partial<HistoryItem>) => {
    try {
      const saved = await saveHistoryItem(item);
      setHistory((prev) => [saved, ...prev]);
    } catch (err) {
      console.error(err);
      // Fallback local update
      const fallbackItem: HistoryItem = {
        id: 'local_' + Date.now(),
        type: item.type || 'quiz',
        title: item.title || 'Aktivitas Belajar',
        timestamp: new Date().toISOString(),
        educationLevel: item.educationLevel || profile.educationLevel,
        score: item.score,
        badge: item.badge,
        data: item.data as any,
      };
      setHistory((prev) => [fallbackItem, ...prev]);
    }
  };

  const handleRemoveHistoryItem = async (id: string) => {
    try {
      await deleteHistoryItem(id);
      setHistory((prev) => prev.filter((item) => item.id !== id));
    } catch (err) {
      console.error(err);
      setHistory((prev) => prev.filter((item) => item.id !== id));
    }
  };

  const handleClearHistory = async () => {
    try {
      await clearAllHistory();
      setHistory([]);
    } catch (err) {
      console.error(err);
      setHistory([]);
    }
  };

  // Compute stats
  const quizItems = history.filter((item) => item.type === 'quiz');
  const summaryItems = history.filter((item) => item.type === 'summary');
  const tutorItems = history.filter((item) => item.type === 'tutor');

  const scores = quizItems.map((item) => item.score).filter((s): s is number => typeof s === 'number');
  const averageQuizScore =
    scores.length > 0 ? Math.round(scores.reduce((a, b) => a + b, 0) / scores.length) : 0;

  const todayStr = new Date().toISOString().split('T')[0];
  const completedToday = history.filter((item) => item.timestamp.startsWith(todayStr)).length;

  const stats = {
    totalQuizzes: quizItems.length,
    totalSummaries: summaryItems.length,
    totalTutorChats: tutorItems.length,
    averageQuizScore,
    completedToday,
  };

  return (
    <AppContext.Provider
      value={{
        currentView,
        setCurrentView,
        profile,
        setProfile,
        updateUserProfile: handleUpdateProfile,
        history,
        addHistory: handleAddHistory,
        removeHistoryItem: handleRemoveHistoryItem,
        clearHistory: handleClearHistory,
        currentQuizResult,
        setCurrentQuizResult,
        hasApiKey,
        refreshApiStatus,
        targetTutorQuery,
        setTargetTutorQuery,
        targetSummaryText,
        setTargetSummaryText,
        stats,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
