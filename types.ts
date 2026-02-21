
export enum AppView {
  HOME = 'home',
  ACADEMY = 'academy',
  LAB = 'lab',
  CASES = 'cases',
  RESEARCH = 'research',
  PROFILE = 'profile',
  NOTES = 'notes'
}

export type ForensicLevel = 100 | 200 | 300 | 400 | 500;
export type UserRole = 'Student' | 'Faculty' | 'Expert';

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  level: ForensicLevel;
  department: string;
  institution: string;
  certifications: string[];
  // Added fields to match Supabase database schema and enable synchronization
  unlocked_articles?: string[];
  completed_articles?: string[];
  owned_notes?: string[];
}

export interface Article {
  id: string;
  title: string;
  category: 'Biological' | 'Physical' | 'Chemical' | 'Legal' | 'Digital' | 'General' | 'Ballistics' | 'Toxicology';
  description: string;
  isPremium: boolean;
  content?: string;
  author: string;
  readTime: string;
  image: string;
  level: ForensicLevel;
  semester: 1 | 2;
  aiSummary?: string;
  isSummarizing?: boolean;
}

export interface Note {
  id: string;
  title: string;
  lecturer: string;
  level: ForensicLevel;
  description: string;
  content?: string;
  price: 0 | 1000;
  timestamp: number;
  isVerified: boolean;
  courseCode: string;
  externalUrl?: string;
}

export interface Case {
  id: string;
  title: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Expert';
  summary: string;
  content?: string;
  evidence: string[];
  location: string;
  date: string;
}

export interface ChatMessage {
  role: 'user' | 'model';
  text: string;
  image?: {
    data: string;
    mimeType: string;
  };
}

export interface GroundingSource {
  title: string;
  uri: string;
}

export interface StudyReminder {
  id: string;
  targetId: string;
  targetTitle: string;
  targetType: 'article' | 'note';
  reminderTime: string;
  isCompleted: boolean;
}
