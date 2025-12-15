import { User, Exam, Assignment, Attendance, AssessmentTrack, ExamType, AssignmentStatus, AttendanceStatus } from '../types';

// Initial Mock Data matching requirements
const MOCK_USER: User = {
  id: 'user-1',
  email: 'student@anadolubil.edu.tr',
  first_name: 'Alex',
  last_name: 'Johnson',
  gender: 'Male',
  english_level: 'B1',
  profile_photo_url: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
  faculty: 'ANADOLU BIL VOCATIONAL SCHOOL',
  department: 'COMPUTER PROGRAMMING (ENGLISH)',
  registration_type: 'OSYM',
  status: 'ACTIVE',
  class_level: 'PREPARATORY',
  education_type: 'FIRST EDUCATION',
  registration_date: '03.09.2025'
};

const MOCK_EXAMS: Exam[] = [
  { id: '1', user_id: 'user-1', exam_title: 'Unit 1 Quiz', exam_type: 'Quiz', exam_date: '2023-10-15', grade: 85 },
  { id: '2', user_id: 'user-1', exam_title: 'Midterm 1', exam_type: 'Midterm', exam_date: '2023-11-10', grade: 78 },
  { id: '3', user_id: 'user-1', exam_title: 'Speaking Task', exam_type: 'Speaking', exam_date: '2023-11-12', grade: 90 },
  { id: '4', user_id: 'user-1', exam_title: 'Final Exam', exam_type: 'Final', exam_date: '2024-01-15', grade: 82 },
];

const MOCK_ASSIGNMENTS: Assignment[] = [
  { id: '1', user_id: 'user-1', title: 'Essay on Technology', description: 'Write 300 words about AI.', due_date: '2023-12-01', status: 'Pending' },
  { id: '2', user_id: 'user-1', title: 'Workbook Unit 5', description: 'Complete pages 45-50.', due_date: '2023-11-20', status: 'Completed' },
  { id: '3', user_id: 'user-1', title: 'Moodle Quiz 3', description: 'Online platform task', due_date: '2023-11-25', status: 'In Progress' },
];

const MOCK_ATTENDANCE: Attendance[] = [
  { id: '1', user_id: 'user-1', date: '2023-11-01', hours: 4, status: 'Present' },
  { id: '2', user_id: 'user-1', date: '2023-11-02', hours: 4, status: 'Absent' },
  { id: '3', user_id: 'user-1', date: '2023-11-03', hours: 4, status: 'Present' },
  { id: '4', user_id: 'user-1', date: '2023-11-04', hours: 4, status: 'Present' },
  { id: '5', user_id: 'user-1', date: '2023-11-05', hours: 4, status: 'Present' },
];

// Fixed Tracks with required weights
const INITIAL_TRACKS: AssessmentTrack[] = [
  { id: 't1', user_id: 'user-1', name: 'Project-1', weight_percentage: 10, score: 0 },
  { id: 't2', user_id: 'user-1', name: 'Readers-1', weight_percentage: 5, score: 0 },
  { id: 't3', user_id: 'user-1', name: 'ELAT-1', weight_percentage: 25, score: 0 },
  { id: 't4', user_id: 'user-1', name: 'Writing-1', weight_percentage: 10, score: 0 },
  { id: 't5', user_id: 'user-1', name: 'Mid Term-1', weight_percentage: 15, score: 0 },
  { id: 't6', user_id: 'user-1', name: 'M.E.C.-1', weight_percentage: 10, score: 0 },
  { id: 't7', user_id: 'user-1', name: 'Assignment-1', weight_percentage: 5, score: 0 },
  { id: 't8', user_id: 'user-1', name: 'Online Learning Platforms-1', weight_percentage: 10, score: 0 },
  { id: 't9', user_id: 'user-1', name: 'Weekly Test-1', weight_percentage: 10, score: 0 },
];

// Helper to simulate network delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

class MockSupabaseService {
  private loadData<T>(key: string, defaultData: T): T {
    const stored = localStorage.getItem(key);
    return stored ? JSON.parse(stored) : defaultData;
  }

  private saveData<T>(key: string, data: T): void {
    localStorage.setItem(key, JSON.stringify(data));
  }

  // --- Auth ---
  async login(email: string, password: string): Promise<User> {
    await delay(500);
    // In a real app, validate with Supabase Auth
    if (email && password) {
      const user = this.loadData('user', MOCK_USER);
      return { ...user, email };
    }
    throw new Error("Invalid credentials");
  }

  async resetPassword(email: string): Promise<void> {
    await delay(1000);
    if (!email || !email.includes('@')) {
        throw new Error("Invalid email address");
    }
    return;
  }

  async updateUser(user: User): Promise<User> {
    await delay(500);
    this.saveData('user', user);
    return user;
  }

  async getUser(): Promise<User | null> {
    return this.loadData('user', MOCK_USER);
  }

  // --- Exams ---
  async getExams(): Promise<Exam[]> {
    await delay(300);
    return this.loadData('exams', MOCK_EXAMS);
  }

  async addExam(exam: Omit<Exam, 'id' | 'user_id'>): Promise<Exam> {
    await delay(300);
    const exams = await this.getExams();
    const newExam: Exam = {
      ...exam,
      id: Math.random().toString(36).substring(7),
      user_id: 'user-1'
    };
    this.saveData('exams', [newExam, ...exams]);
    return newExam;
  }

  // --- Assignments ---
  async getAssignments(): Promise<Assignment[]> {
    await delay(300);
    return this.loadData('assignments', MOCK_ASSIGNMENTS);
  }

  async addAssignment(assignment: Omit<Assignment, 'id' | 'user_id'>): Promise<Assignment> {
    await delay(300);
    const assignments = await this.getAssignments();
    const newAssignment: Assignment = {
      ...assignment,
      id: Math.random().toString(36).substring(7),
      user_id: 'user-1'
    };
    this.saveData('assignments', [newAssignment, ...assignments]);
    return newAssignment;
  }

  // --- Attendance ---
  async getAttendance(): Promise<Attendance[]> {
    await delay(300);
    return this.loadData('attendance', MOCK_ATTENDANCE);
  }

  async addAttendance(attendance: Omit<Attendance, 'id' | 'user_id'>): Promise<Attendance> {
    await delay(300);
    const list = await this.getAttendance();
    const newItem: Attendance = {
      ...attendance,
      id: Math.random().toString(36).substring(7),
      user_id: 'user-1'
    };
    this.saveData('attendance', [newItem, ...list]);
    return newItem;
  }

  // --- Tracks (Assessment) ---
  async getTracks(): Promise<AssessmentTrack[]> {
    await delay(300);
    // Ensure we always have the specific tracks loaded
    const tracks = this.loadData('tracks', INITIAL_TRACKS);
    if (tracks.length === 0) return INITIAL_TRACKS;
    return tracks;
  }

  async updateTrackScore(trackId: string, score: number): Promise<AssessmentTrack[]> {
    await delay(200);
    const tracks = await this.getTracks();
    const updatedTracks = tracks.map(t => 
      t.id === trackId ? { ...t, score: Math.min(100, Math.max(0, score)) } : t
    );
    this.saveData('tracks', updatedTracks);
    return updatedTracks;
  }
}

export const api = new MockSupabaseService();
