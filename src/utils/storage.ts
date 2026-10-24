import { ConversationSession, UserPreferences, LearningMode, LearnerLevel, LanguageCode } from '../types';

const SESSIONS_KEY = 'gaja_sessions_v1';
const PREFS_KEY = 'gaja_user_prefs_v1';
const STREAK_KEY = 'gaja_learning_streak_v1';

export const DEFAULT_PREFS: UserPreferences = {
  name: 'Curious Learner',
  defaultMode: 'easy',
  defaultLevel: 'middle',
  defaultLanguage: 'en',
  autoSpeak: false,
  theme: 'light',
};

export function loadSessions(): ConversationSession[] {
  try {
    const raw = localStorage.getItem(SESSIONS_KEY);
    if (!raw) return [];
    return JSON.parse(raw);
  } catch (err) {
    console.error('Failed to load sessions from storage:', err);
    return [];
  }
}

export function saveSessions(sessions: ConversationSession[]): void {
  try {
    localStorage.setItem(SESSIONS_KEY, JSON.stringify(sessions));
  } catch (err) {
    console.error('Failed to save sessions:', err);
  }
}

export function loadPreferences(): UserPreferences {
  try {
    const raw = localStorage.getItem(PREFS_KEY);
    if (!raw) return DEFAULT_PREFS;
    return { ...DEFAULT_PREFS, ...JSON.parse(raw) };
  } catch (err) {
    return DEFAULT_PREFS;
  }
}

export function savePreferences(prefs: UserPreferences): void {
  try {
    localStorage.setItem(PREFS_KEY, JSON.stringify(prefs));
  } catch (err) {
    console.error('Failed to save preferences:', err);
  }
}

export function updateLearningStreak(): number {
  try {
    const today = new Date().toISOString().split('T')[0];
    const raw = localStorage.getItem(STREAK_KEY);
    let streakData = raw ? JSON.parse(raw) : { count: 1, lastDate: today };

    if (streakData.lastDate === today) {
      return streakData.count;
    }

    const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];
    if (streakData.lastDate === yesterday) {
      streakData.count += 1;
    } else {
      streakData.count = 1;
    }
    streakData.lastDate = today;
    localStorage.setItem(STREAK_KEY, JSON.stringify(streakData));
    return streakData.count;
  } catch {
    return 1;
  }
}

export function clearAllLocalData(): void {
  try {
    localStorage.removeItem(SESSIONS_KEY);
    localStorage.removeItem(PREFS_KEY);
    localStorage.removeItem(STREAK_KEY);
  } catch (err) {
    console.error('Failed to clear storage:', err);
  }
}
