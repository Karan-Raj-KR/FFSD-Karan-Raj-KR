export interface Session {
  id: string;
  subject: string;
  duration: number; // in seconds
  timestamp: string; // ISO date string
}

export type TimerMode = 'focus' | 'shortBreak' | 'longBreak';
