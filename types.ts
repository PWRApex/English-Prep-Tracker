export interface User {
  id: string;
  email: string;
  first_name: string;
  last_name: string;
  gender: 'Male' | 'Female' | 'Other';
  english_level: string;
  profile_photo_url?: string;
  
  // Fixed Academic Info
  faculty: string;
  department: string;
  registration_type: string;
  status: string;
  class_level: string;
  education_type: string;
  registration_date: string;
}

export type ExamType = 'Quiz' | 'Midterm' | 'Final' | 'Speaking';

export interface Exam {
  id: string;
  user_id: string;
  exam_title: string;
  exam_type: ExamType;
  exam_date: string; // ISO Date string
  grade: number;
  notes?: string;
}

export type AssignmentStatus = 'Pending' | 'In Progress' | 'Completed';

export interface Assignment {
  id: string;
  user_id: string;
  title: string;
  description?: string;
  due_date: string; // ISO Date string
  status: AssignmentStatus;
}

export type AttendanceStatus = 'Present' | 'Absent';

export interface Attendance {
  id: string;
  user_id: string;
  date: string; // ISO Date string
  hours: number;
  status: AttendanceStatus;
}

// Redefined Track for Assessment System
export interface AssessmentTrack {
  id: string;
  user_id: string;
  name: string;
  weight_percentage: number; // Fixed weight (e.g., 10, 25)
  score: number; // User input score (0-100)
}
