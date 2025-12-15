import React from 'react';
import { useApp } from '../context/AppContext';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { Percent, Save } from 'lucide-react';

export const Tracks: React.FC = () => {
  const { tracks, updateTrackScore } = useApp();

  const handleScoreChange = (id: string, val: string) => {
    const num = val === '' ? 0 : Number(val);
    updateTrackScore(id, num);
  };

  // Prepare data for stacked bar chart or simple bar chart
  // We will use a bar chart showing (Score * Weight) contribution
  const chartData = tracks.map(t => ({
    name: t.name,
    contribution: (t.score * t.weight_percentage) / 100,
    maxContribution: t.weight_percentage,
    fullMark: 100
  }));

  const totalScore = chartData.reduce((sum, item) => sum + item.contribution, 0);

  return (
    <div className="p-4 pt-8 pb-20 dark:bg-darkbg min-h-screen">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-800 dark:text-white">Track Performance</h2>
        <p className="text-sm text-gray-500 dark:text-gray-400">Fixed weights, total 100%</p>
      </div>

      {/* Chart Section */}
      <div className="bg-white dark:bg-darkcard p-4 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 mb-6">
        <div className="flex justify-between items-center mb-4">
            <h3 className="font-bold text-gray-700 dark:text-gray-200">Total Score Breakdown</h3>
            <span className="text-2xl font-bold text-primary">{totalScore.toFixed(1)} <span className="text-sm text-gray-400">/ 100</span></span>
        </div>
        <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData} layout="vertical" margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                    <XAxis type="number" domain={[0, 100]} hide />
                    <YAxis dataKey="name" type="category" width={100} tick={{fontSize: 10, fill: '#94a3b8'}} />
                    <Tooltip 
                        contentStyle={{borderRadius: '8px', border: 'none', backgroundColor: '#1e293b', color: '#fff'}}
                        formatter={(value: number) => [value.toFixed(1), 'Points Contribution']}
                    />
                    <Bar dataKey="contribution" fill="#4f46e5" radius={[0, 4, 4, 0]} background={{ fill: '#f1f5f9' }} barSize={15} />
                </BarChart>
            </ResponsiveContainer>
        </div>
      </div>

      {/* Input List */}
      <div className="space-y-3">
        {tracks.map(track => (
            <div key={track.id} className="bg-white dark:bg-darkcard p-4 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 flex flex-col">
                <div className="flex justify-between items-center mb-2">
                    <span className="font-semibold text-gray-800 dark:text-white text-sm">{track.name}</span>
                    <span className="text-xs font-bold px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 rounded-lg">
                        Weight: {track.weight_percentage}%
                    </span>
                </div>
                <div className="flex items-center space-x-3">
                    <div className="flex-1 relative">
                        <input 
                            type="number" 
                            min="0" 
                            max="100" 
                            className="w-full p-2 pl-3 pr-8 rounded-lg border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary/50 text-sm font-medium"
                            value={track.score || ''}
                            onChange={(e) => handleScoreChange(track.id, e.target.value)}
                            placeholder="0"
                        />
                        <span className="absolute right-3 top-2 text-gray-400 text-xs font-bold">/100</span>
                    </div>
                    <div className="w-24 text-right">
                        <span className="text-xs text-gray-400 block">Contribution</span>
                        <span className="font-bold text-primary">
                            {((track.score || 0) * track.weight_percentage / 100).toFixed(1)}
                        </span>
                    </div>
                </div>
            </div>
        ))}
      </div>
    </div>
  );
};
