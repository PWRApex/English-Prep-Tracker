import { User, Exam, Assignment, Attendance, AssessmentTrack, ExamType, AssignmentStatus, AttendanceStatus } from '../types';
import { supabase } from '../lib/supabase';

// Fixed Tracks definition (Weights are frontend constants)
const INITIAL_TRACKS: Omit<AssessmentTrack, 'score' | 'id' | 'user_id'>[] = [
  { name: 'Project-1', weight_percentage: 10 },
  { name: 'Readers-1', weight_percentage: 5 },
  { name: 'ELAT-1', weight_percentage: 25 },
  { name: 'Writing-1', weight_percentage: 10 },
  { name: 'Mid Term-1', weight_percentage: 15 },
  { name: 'M.E.C.-1', weight_percentage: 10 },
  { name: 'Assignment-1', weight_percentage: 5 },
  { name: 'Online Learning Platforms-1', weight_percentage: 10 },
  { name: 'Weekly Test-1', weight_percentage: 10 },
];

class SupabaseService {
  
  // --- Auth & User Profile ---
  
  async login(email: string, password: string): Promise<User> {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) throw error;
    if (!data.user) throw new Error("No user data returned");

    // After login, fetch the public profile data from 'users' table
    return this.getUserProfile(data.user.id, data.user.email!);
  }

  async resetPassword(email: string): Promise<void> {
    const { error } = await supabase.auth.resetPasswordForEmail(email);
    if (error) throw error;
  }

  async getUser(): Promise<User | null> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return null;
    return this.getUserProfile(user.id, user.email!);
  }

  private async getUserProfile(userId: string, email: string): Promise<User> {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('id', userId)
      .single();

    if (error) {
      // If user profile doesn't exist yet (e.g. fresh signup), return a basic object
      // In a real app, a database trigger usually creates this on signup.
      console.warn("Could not fetch user profile:", error.message);
      return {
        id: userId,
        email: email,
        first_name: '',
        last_name: '',
        gender: 'Other',
        english_level: 'A1',
        faculty: 'ANADOLU BIL VOCATIONAL SCHOOL',
        department: 'COMPUTER PROGRAMMING (ENGLISH)',
        registration_type: 'OSYM',
        status: 'ACTIVE',
        class_level: 'PREPARATORY',
        education_type: 'FIRST EDUCATION',
        registration_date: '03.09.2025'
      };
    }

    return { ...data, email };
  }

  async updateUser(user: User): Promise<User> {
    // We don't update email here, handled by auth
    const { email, id, ...updates } = user;
    
    // Check if row exists, if not insert, else update
    const { error } = await supabase
      .from('users')
      .upsert({ id: user.id, ...updates })
      .select()
      .single();

    if (error) throw error;
    return user;
  }

  // --- Exams ---

  async getExams(): Promise<Exam[]> {
    const { data, error } = await supabase
      .from('exams')
      .select('*')
      .order('exam_date', { ascending: false });

    if (error) {
      console.error(error);
      return [];
    }
    return data || [];
  }

  async addExam(exam: Omit<Exam, 'id' | 'user_id'>): Promise<Exam> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error("Not authenticated");

    const { data, error } = await supabase
      .from('exams')
      .insert([{ ...exam, user_id: user.id }])
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  // --- Assignments ---

  async getAssignments(): Promise<Assignment[]> {
    const { data, error } = await supabase
      .from('assignments')
      .select('*')
      .order('due_date', { ascending: true });

    if (error) {
        console.error(error);
        return [];
    }
    return data || [];
  }

  async addAssignment(assignment: Omit<Assignment, 'id' | 'user_id'>): Promise<Assignment> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error("Not authenticated");

    const { data, error } = await supabase
      .from('assignments')
      .insert([{ ...assignment, user_id: user.id }])
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  // --- Attendance ---

  async getAttendance(): Promise<Attendance[]> {
    const { data, error } = await supabase
      .from('attendance')
      .select('*')
      .order('date', { ascending: false });

    if (error) {
        console.error(error);
        return [];
    }
    return data || [];
  }

  async addAttendance(attendance: Omit<Attendance, 'id' | 'user_id'>): Promise<Attendance> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error("Not authenticated");

    const { data, error } = await supabase
      .from('attendance')
      .insert([{ ...attendance, user_id: user.id }])
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  // --- Tracks (Assessment) ---

  async getTracks(): Promise<AssessmentTrack[]> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return [];

    // Fetch scores from DB
    const { data, error } = await supabase
      .from('tracks')
      .select('*'); // Assuming 'tracks' has: user_id, unit_name (as name), completion_percentage (as score)

    if (error) console.error(error);

    const dbTracks = data || [];

    // Merge DB data with Initial Fixed Tracks
    // We map 'unit_name' from DB to 'name' in our app, and 'completion_percentage' to 'score'
    const mergedTracks: AssessmentTrack[] = INITIAL_TRACKS.map(trackDef => {
        const found = dbTracks.find((t: any) => t.unit_name === trackDef.name);
        return {
            id: found ? found.id : `temp-${trackDef.name}`,
            user_id: user.id,
            name: trackDef.name,
            weight_percentage: trackDef.weight_percentage,
            score: found ? Number(found.completion_percentage) : 0
        };
    });

    return mergedTracks;
  }

  async updateTrackScore(trackId: string, score: number): Promise<AssessmentTrack[]> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error("Not authenticated");

    // We need to know the track NAME to update/upsert correctly. 
    // Since trackId might be temporary, we find the track in our current local state logic or pass name.
    // Ideally, we should update by Name + UserID because Tracks are fixed.
    
    // However, the `updateTrackScore` signature receives an ID. 
    // Let's first fetch current tracks to find the name corresponding to this ID (or if it is a temp ID).
    const currentTracks = await this.getTracks();
    const targetTrack = currentTracks.find(t => t.id === trackId);
    
    if (!targetTrack) throw new Error("Track not found");

    // Upsert into DB
    const { error } = await supabase
        .from('tracks')
        .upsert({ 
            user_id: user.id, 
            unit_name: targetTrack.name, 
            completion_percentage: score 
        }, { onConflict: 'user_id, unit_name' }); // Ensure DB has unique constraint on (user_id, unit_name)

    if (error) throw error;

    // Return updated list
    return this.getTracks();
  }
}

export const api = new SupabaseService();
