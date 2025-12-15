import React from 'react';
import { useApp } from '../context/AppContext';
import { Calendar, AlertCircle, TrendingUp, CheckCircle2 } from 'lucide-react';
import { format } from 'date-fns';
import { Link } from 'react-router-dom';

export const Home: React.FC = () => {
  const { user, exams, assignments, attendance, tracks } = useApp();

  const upcomingExams = exams
    .filter(e => new Date(e.exam_date) >= new Date())
    .sort((a, b) => new Date(a.exam_date).getTime() - new Date(b.exam_date).getTime())
    .slice(0, 3);

  const pendingAssignments = assignments
    .filter(a => a.status !== 'Completed')
    .sort((a, b) => new Date(a.due_date).getTime() - new Date(b.due_date).getTime())
    .slice(0, 3);

  const totalAbsenceHours = attendance
    .filter(a => a.status === 'Absent')
    .reduce((sum, record) => sum + record.hours, 0);

  // Calculate Weighted Score
  const weightedScore = tracks.reduce((sum, track) => {
    return sum + (track.score * (track.weight_percentage / 100));
  }, 0);

  return (
    <div className="p-4 space-y-6 dark:bg-darkbg min-h-screen">
      {/* Header */}
      <div className="flex items-center space-x-4 pt-4">
        <img 
          src={user?.profile_photo_url} 
          alt="Profile" 
          className="w-20 h-20 rounded-full border-2 border-white dark:border-gray-700 shadow-md object-cover"
        />
        <div>
          <h1 className="text-2xl font-bold text-gray-800 dark:text-white">Hello, {user?.first_name}!</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">Let's keep up the great work.</p>
        </div>
      </div>

      {/* Progress Card */}
      <div className="bg-primary rounded-2xl p-6 text-white shadow-lg relative overflow-hidden">
        <div className="absolute top-0 right-0 -mt-4 -mr-4 w-24 h-24 bg-white opacity-10 rounded-full blur-xl"></div>
        <div className="relative z-10">
          <div className="flex justify-between items-center mb-2">
            <h2 className="text-lg font-semibold">Track Performance</h2>
            <span className="text-2xl font-bold">{weightedScore.toFixed(1)}</span>
          </div>
          <div className="w-full bg-indigo-800 rounded-full h-2.5 mb-1">
            <div 
              className="bg-white h-2.5 rounded-full transition-all duration-1000 ease-out" 
              style={{ width: `${weightedScore}%` }}
            ></div>
          </div>
          <p className="text-xs text-indigo-200 mt-2">Weighted average of all tracks</p>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-white dark:bg-darkcard p-4 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 flex flex-col items-center justify-center space-y-2">
            <div className="bg-red-50 dark:bg-red-900/20 p-2 rounded-full">
                <AlertCircle className="text-red-500 dark:text-red-400" size={24} />
            </div>
            <span className="text-2xl font-bold text-gray-800 dark:text-white">{totalAbsenceHours}h</span>
            <span className="text-xs text-gray-500 dark:text-gray-400 font-medium">Total Absences</span>
        </div>
        <div className="bg-white dark:bg-darkcard p-4 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 flex flex-col items-center justify-center space-y-2">
            <div className="bg-green-50 dark:bg-green-900/20 p-2 rounded-full">
                <CheckCircle2 className="text-green-500 dark:text-green-400" size={24} />
            </div>
            <span className="text-2xl font-bold text-gray-800 dark:text-white">{assignments.filter(a => a.status === 'Completed').length}</span>
            <span className="text-xs text-gray-500 dark:text-gray-400 font-medium">Tasks Done</span>
        </div>
      </div>

      {/* Upcoming Exams */}
      <div>
        <div className="flex justify-between items-center mb-3">
          <h3 className="font-bold text-gray-800 dark:text-white text-lg">Upcoming Exams</h3>
          <Link to="/exams" className="text-primary dark:text-indigo-400 text-sm font-medium">See all</Link>
        </div>
        <div className="space-y-3">
          {upcomingExams.length === 0 ? (
             <div className="p-4 bg-gray-50 dark:bg-darkcard rounded-xl text-center text-gray-500 dark:text-gray-400 text-sm">No upcoming exams.</div>
          ) : (
            upcomingExams.map(exam => (
                <div key={exam.id} className="bg-white dark:bg-darkcard p-4 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 flex items-center justify-between">
                <div className="flex items-center space-x-3">
                    <div className="bg-indigo-50 dark:bg-indigo-900/20 p-2.5 rounded-lg">
                        <Calendar className="text-primary dark:text-indigo-400" size={20} />
                    </div>
                    <div>
                    <h4 className="font-semibold text-gray-800 dark:text-white text-sm">{exam.exam_title}</h4>
                    <p className="text-xs text-gray-500 dark:text-gray-400">{format(new Date(exam.exam_date), 'MMM d, yyyy')} • {exam.exam_type}</p>
                    </div>
                </div>
                </div>
            ))
          )}
        </div>
      </div>

      {/* Pending Assignments */}
      <div>
        <div className="flex justify-between items-center mb-3">
          <h3 className="font-bold text-gray-800 dark:text-white text-lg">Assignments</h3>
          <span className="text-gray-400 text-xs">{pendingAssignments.length} pending</span>
        </div>
        <div className="space-y-3">
        {pendingAssignments.length === 0 ? (
             <div className="p-4 bg-gray-50 dark:bg-darkcard rounded-xl text-center text-gray-500 dark:text-gray-400 text-sm">All caught up!</div>
          ) : (
            pendingAssignments.map(assignment => (
                <div key={assignment.id} className="bg-white dark:bg-darkcard p-4 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700">
                    <div className="flex justify-between items-start mb-1">
                        <h4 className="font-semibold text-gray-800 dark:text-white text-sm">{assignment.title}</h4>
                        <span className="text-[10px] px-2 py-0.5 bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200 rounded-full font-medium">
                            {assignment.status}
                        </span>
                    </div>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">Due {format(new Date(assignment.due_date), 'MMM d')}</p>
                </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};