import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { ExamType } from '../types';
import { format } from 'date-fns';
import { Filter } from 'lucide-react';

export const Exams: React.FC = () => {
  const { exams } = useApp();
  const [filter, setFilter] = useState<ExamType | 'All'>('All');

  const filteredExams = filter === 'All' ? exams : exams.filter(e => e.exam_type === filter);
  
  // Calculate average
  const averageScore = exams.length > 0
    ? Math.round(exams.reduce((sum, e) => sum + e.grade, 0) / exams.length)
    : 0;

  const getGradeColor = (grade: number) => {
    if (grade >= 90) return 'text-green-600 bg-green-50';
    if (grade >= 75) return 'text-indigo-600 bg-indigo-50';
    if (grade >= 60) return 'text-yellow-600 bg-yellow-50';
    return 'text-red-600 bg-red-50';
  };

  return (
    <div className="p-4 pt-8">
       <div className="flex justify-between items-end mb-6">
        <div>
            <h2 className="text-2xl font-bold text-gray-800">Exams</h2>
            <p className="text-sm text-gray-500">Average Score: <span className="font-bold text-primary">{averageScore}</span></p>
        </div>
       </div>

      {/* Filter Chips */}
      <div className="flex space-x-2 overflow-x-auto no-scrollbar mb-6 pb-1">
        {['All', 'Quiz', 'Midterm', 'Final', 'Speaking'].map((type) => (
          <button
            key={type}
            onClick={() => setFilter(type as any)}
            className={`px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-colors border ${
              filter === type 
                ? 'bg-gray-800 text-white border-gray-800' 
                : 'bg-white text-gray-500 border-gray-200'
            }`}
          >
            {type}
          </button>
        ))}
      </div>

      {/* List */}
      <div className="space-y-3">
        {filteredExams.length === 0 ? (
            <div className="text-center py-10 text-gray-400">No exams found for this category.</div>
        ) : (
            filteredExams.map(exam => (
                <div key={exam.id} className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex justify-between items-center">
                    <div>
                        <div className="flex items-center gap-2 mb-1">
                            <span className="text-[10px] uppercase font-bold text-gray-400 tracking-wide">{exam.exam_type}</span>
                        </div>
                        <h3 className="font-bold text-gray-800">{exam.exam_title}</h3>
                        <p className="text-xs text-gray-500">{format(new Date(exam.exam_date), 'MMMM d, yyyy')}</p>
                    </div>
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center font-bold text-sm ${getGradeColor(exam.grade)}`}>
                        {exam.grade}
                    </div>
                </div>
            ))
        )}
      </div>
    </div>
  );
};
