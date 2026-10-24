export type LearningMode = 
  | 'quick' 
  | 'easy' 
  | 'detailed' 
  | 'visual' 
  | 'step-by-step' 
  | 'student' 
  | 'expert';

export type LearnerLevel = 
  | 'elementary' 
  | 'middle' 
  | 'high_school' 
  | 'college' 
  | 'general';

export type LanguageCode = 'en' | 'te' | 'hi' | 'ta' | 'es';

export interface GroundingSource {
  title: string;
  url: string;
}

export interface QuizQuestion {
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
  sources?: GroundingSource[];
  diagramSvg?: string;
  quiz?: QuizQuestion[];
  imageAttachment?: {
    base64: string;
    mimeType: string;
    fileName?: string;
  };
  modeUsed?: LearningMode;
  levelUsed?: LearnerLevel;
  languageUsed?: LanguageCode;
}

export interface ConversationSession {
  id: string;
  title: string;
  createdAt: string;
  updatedAt: string;
  messages: ChatMessage[];
  currentImage?: {
    base64: string;
    mimeType: string;
    fileName?: string;
  };
  mode: LearningMode;
  level: LearnerLevel;
  language: LanguageCode;
  isBookmarked?: boolean;
}

export interface TopicItem {
  id: string;
  title: string;
  subject: string;
  icon: string;
  prompt: string;
  badge?: string;
  imagePrompt?: string;
}

export interface UserPreferences {
  name: string;
  defaultMode: LearningMode;
  defaultLevel: LearnerLevel;
  defaultLanguage: LanguageCode;
  speechVoice?: string;
  autoSpeak: boolean;
  theme: 'light' | 'dark' | 'system';
}
