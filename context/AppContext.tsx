import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { User, Exam, Assignment, Attendance, AssessmentTrack } from '../types';
import { api } from '../services/storage';

interface AppContextType {
  user: User | null;
  exams: Exam[];
  assignments: Assignment[];
  attendance: Attendance[];
  tracks: AssessmentTrack[];
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  logout: () => void;
  refreshData: () => Promise<void>;
  addExam: (exam: Omit<Exam, 'id' | 'user_id'>) => Promise<void>;
  addAssignment: (assignment: Omit<Assignment, 'id' | 'user_id'>) => Promise<void>;
  addAttendance: (attendance: Omit<Attendance, 'id' | 'user_id'>) => Promise<void>;
  updateTrackScore: (trackId: string, score: number) => Promise<void>;
  updateUser: (user: User) => Promise<void>;
  isDarkMode: boolean;
  toggleDarkMode: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [exams, setExams] = useState<Exam[]>([]);
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [attendance, setAttendance] = useState<Attendance[]>([]);
  const [tracks, setTracks] = useState<AssessmentTrack[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isDarkMode, setIsDarkMode] = useState<boolean>(false);

  // Initialize Dark Mode
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    if (savedTheme === 'dark' || (!savedTheme && prefersDark)) {
      setIsDarkMode(true);
      document.documentElement.classList.add('dark');
    } else {
      setIsDarkMode(false);
      document.documentElement.classList.remove('dark');
    }
  }, []);

  const toggleDarkMode = () => {
    const newMode = !isDarkMode;
    setIsDarkMode(newMode);
    if (newMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  };

  const refreshData = useCallback(async () => {
    if (!user) return;
    setIsLoading(true);
    try {
      const [examsData, assignmentsData, attendanceData, tracksData] = await Promise.all([
        api.getExams(),
        api.getAssignments(),
        api.getAttendance(),
        api.getTracks(),
      ]);
      setExams(examsData);
      setAssignments(assignmentsData);
      setAttendance(attendanceData);
      setTracks(tracksData);
    } catch (error) {
      console.error("Failed to fetch data", error);
    } finally {
      setIsLoading(false);
    }
  }, [user]);

  useEffect(() => {
    const initAuth = async () => {
      const storedUser = localStorage.getItem('isLoggedIn');
      if (storedUser === 'true') {
        const u = await api.getUser();
        setUser(u);
      } else {
        setIsLoading(false);
      }
    };
    initAuth();
  }, []);

  useEffect(() => {
    if (user) {
      refreshData();
    }
  }, [user, refreshData]);

  const login = async (email: string, psw: string) => {
    setIsLoading(true);
    try {
      const u = await api.login(email, psw);
      setUser(u);
      localStorage.setItem('isLoggedIn', 'true');
    } catch (e) {
      console.error(e);
      throw e;
    } finally {
      setIsLoading(false);
    }
  };

  const resetPassword = async (email: string) => {
    setIsLoading(true);
    try {
        await api.resetPassword(email);
    } catch (e) {
        console.error(e);
        throw e;
    } finally {
        setIsLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('isLoggedIn');
    setIsLoading(false);
  };

  const addExam = async (data: Omit<Exam, 'id' | 'user_id'>) => {
    await api.addExam(data);
    await refreshData();
  };

  const addAssignment = async (data: Omit<Assignment, 'id' | 'user_id'>) => {
    await api.addAssignment(data);
    await refreshData();
  };

  const addAttendance = async (data: Omit<Attendance, 'id' | 'user_id'>) => {
    await api.addAttendance(data);
    await refreshData();
  };

  const updateTrackScore = async (trackId: string, score: number) => {
    const updatedTracks = await api.updateTrackScore(trackId, score);
    setTracks(updatedTracks);
  };
  
  const updateUser = async (data: User) => {
      const updated = await api.updateUser(data);
      setUser(updated);
  };

  return (
    <AppContext.Provider
      value={{
        user,
        exams,
        assignments,
        attendance,
        tracks,
        isLoading,
        login,
        resetPassword,
        logout,
        refreshData,
        addExam,
        addAssignment,
        addAttendance,
        updateTrackScore,
        updateUser,
        isDarkMode,
        toggleDarkMode
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
