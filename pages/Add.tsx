import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { ExamType, AssignmentStatus, AttendanceStatus } from '../types';
import { useNavigate } from 'react-router-dom';

type TabType = 'Exam' | 'Assignment' | 'Attendance';

export const Add: React.FC = () => {
  const { addExam, addAssignment, addAttendance } = useApp();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<TabType>('Exam');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Exam Form State
  const [examTitle, setExamTitle] = useState('');
  const [examDate, setExamDate] = useState('');
  const [examGrade, setExamGrade] = useState('');
  const [examType, setExamType] = useState<ExamType>('Quiz');

  // Assignment Form State
  const [assignTitle, setAssignTitle] = useState('');
  const [assignDesc, setAssignDesc] = useState('');
  const [assignDate, setAssignDate] = useState('');

  // Attendance Form State
  const [attDate, setAttDate] = useState('');
  const [attHours, setAttHours] = useState('');
  const [attStatus, setAttStatus] = useState<AttendanceStatus>('Absent');

  const resetForms = () => {
    setExamTitle(''); setExamDate(''); setExamGrade('');
    setAssignTitle(''); setAssignDesc(''); setAssignDate('');
    setAttDate(''); setAttHours('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      if (activeTab === 'Exam') {
        await addExam({
            exam_title: examTitle,
            exam_date: examDate,
            grade: Number(examGrade),
            exam_type: examType
        });
        navigate('/exams');
      } else if (activeTab === 'Assignment') {
        await addAssignment({
            title: assignTitle,
            description: assignDesc,
            due_date: assignDate,
            status: 'Pending'
        });
        navigate('/');
      } else if (activeTab === 'Attendance') {
        await addAttendance({
            date: attDate,
            hours: Number(attHours),
            status: attStatus
        });
        navigate('/');
      }
      resetForms();
    } catch (error) {
      alert("Error adding data");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="p-4 pt-8 dark:bg-darkbg min-h-screen">
      <h2 className="text-2xl font-bold mb-6 text-gray-800 dark:text-white">Add New Entry</h2>

      {/* Tabs */}
      <div className="flex space-x-2 overflow-x-auto no-scrollbar mb-6 pb-2">
        {['Exam', 'Assignment', 'Attendance'].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab as TabType)}
            className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
              activeTab === tab 
                ? 'bg-primary text-white shadow-md' 
                : 'bg-white dark:bg-darkcard text-gray-600 dark:text-gray-300 border border-gray-200 dark:border-gray-700'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Forms */}
      <form onSubmit={handleSubmit} className="bg-white dark:bg-darkcard p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 space-y-4">
        
        {activeTab === 'Exam' && (
          <>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Exam Title</label>
              <input required type="text" className="w-full p-3 rounded-xl border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary/20" value={examTitle} onChange={e => setExamTitle(e.target.value)} placeholder="e.g., Unit 1 Quiz" />
            </div>
            <div className="grid grid-cols-2 gap-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Date</label>
                    <input required type="date" className="w-full p-3 rounded-xl border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary/20" value={examDate} onChange={e => setExamDate(e.target.value)} />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Grade (0-100)</label>
                    <input required type="number" min="0" max="100" className="w-full p-3 rounded-xl border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary/20" value={examGrade} onChange={e => setExamGrade(e.target.value)} />
                </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Type</label>
              <select className="w-full p-3 rounded-xl border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white" value={examType} onChange={e => setExamType(e.target.value as ExamType)}>
                <option value="Quiz">Quiz</option>
                <option value="Midterm">Midterm</option>
                <option value="Final">Final</option>
                <option value="Speaking">Speaking</option>
              </select>
            </div>
          </>
        )}

        {activeTab === 'Assignment' && (
          <>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Title</label>
              <input required type="text" className="w-full p-3 rounded-xl border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary/20" value={assignTitle} onChange={e => setAssignTitle(e.target.value)} placeholder="e.g., Essay" />
            </div>
             <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Description</label>
              <textarea className="w-full p-3 rounded-xl border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary/20" value={assignDesc} onChange={e => setAssignDesc(e.target.value)} placeholder="Optional details..." />
            </div>
            <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Due Date</label>
                <input required type="date" className="w-full p-3 rounded-xl border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary/20" value={assignDate} onChange={e => setAssignDate(e.target.value)} />
            </div>
          </>
        )}

        {activeTab === 'Attendance' && (
          <>
            <div className="grid grid-cols-2 gap-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Date</label>
                    <input required type="date" className="w-full p-3 rounded-xl border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary/20" value={attDate} onChange={e => setAttDate(e.target.value)} />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Hours</label>
                    <input required type="number" min="1" max="10" className="w-full p-3 rounded-xl border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary/20" value={attHours} onChange={e => setAttHours(e.target.value)} />
                </div>
            </div>
            <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Status</label>
                 <div className="flex space-x-4 mt-2">
                    <label className="flex items-center space-x-2 text-gray-700 dark:text-gray-300">
                        <input type="radio" checked={attStatus === 'Present'} onChange={() => setAttStatus('Present')} className="text-primary focus:ring-primary" />
                        <span>Present</span>
                    </label>
                    <label className="flex items-center space-x-2 text-gray-700 dark:text-gray-300">
                        <input type="radio" checked={attStatus === 'Absent'} onChange={() => setAttStatus('Absent')} className="text-primary focus:ring-primary" />
                        <span>Absent</span>
                    </label>
                 </div>
            </div>
          </>
        )}

        <button 
            type="submit" 
            disabled={isSubmitting}
            className="w-full bg-primary text-white py-4 rounded-xl font-bold text-lg shadow-lg active:scale-95 transition-transform mt-4 disabled:opacity-70"
        >
            {isSubmitting ? 'Saving...' : `Add ${activeTab}`}
        </button>
      </form>
    </div>
  );
};
