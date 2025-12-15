import React, { useState, useRef, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import { LogOut, Edit2, Save, X, Moon, Sun, Camera, School, User as UserIcon, Calendar, Upload } from 'lucide-react';
import { format } from 'date-fns';

export const Profile: React.FC = () => {
  const { user, exams, attendance, assignments, logout, updateUser, isDarkMode, toggleDarkMode } = useApp();
  const [isEditing, setIsEditing] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  // Local state for editable fields
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [gender, setGender] = useState<'Male' | 'Female' | 'Other'>('Male');
  const [profilePhoto, setProfilePhoto] = useState('');
  
  // Academic & Registration State
  const [faculty, setFaculty] = useState('');
  const [department, setDepartment] = useState('');
  const [classLevel, setClassLevel] = useState('');
  const [status, setStatus] = useState('');
  const [registrationType, setRegistrationType] = useState('');
  const [educationType, setEducationType] = useState('');
  const [registrationDate, setRegistrationDate] = useState('');

  // Sync state with user data
  useEffect(() => {
    if (user) {
      setFirstName(user.first_name || '');
      setLastName(user.last_name || '');
      setGender(user.gender || 'Male');
      setProfilePhoto(user.profile_photo_url || '');
      setFaculty(user.faculty || '');
      setDepartment(user.department || '');
      setClassLevel(user.class_level || '');
      setStatus(user.status || '');
      setRegistrationType(user.registration_type || '');
      setEducationType(user.education_type || '');
      setRegistrationDate(user.registration_date || '');
    }
  }, [user]);

  // 1. Exam Performance Line Chart Data
  const examLineData = exams
    .sort((a, b) => new Date(a.exam_date).getTime() - new Date(b.exam_date).getTime())
    .map(e => ({
        date: format(new Date(e.exam_date), 'MMM d'),
        grade: e.grade,
        title: e.exam_title
    }));

  // 2. Attendance Pie Chart Data
  const totalHours = attendance.reduce((acc, curr) => acc + curr.hours, 0);
  const absentHours = attendance.filter(a => a.status === 'Absent').reduce((acc, curr) => acc + curr.hours, 0);
  const presentHours = totalHours - absentHours;
  const attendanceData = [
      { name: 'Present', value: presentHours, color: '#22c55e' },
      { name: 'Absent', value: absentHours, color: '#ef4444' }
  ];

  // 3. Assignment Bar Chart Data
  const completedAssign = assignments.filter(a => a.status === 'Completed').length;
  const pendingAssign = assignments.length - completedAssign;
  const assignmentData = [
      { name: 'Completed', value: completedAssign },
      { name: 'Pending', value: pendingAssign }
  ];

  const handleSave = async () => {
    if(user) {
        await updateUser({
            ...user, 
            first_name: firstName,
            last_name: lastName,
            gender: gender,
            profile_photo_url: profilePhoto,
            faculty: faculty,
            department: department,
            class_level: classLevel,
            status: status,
            registration_type: registrationType,
            education_type: educationType,
            registration_date: registrationDate
        });
        setIsEditing(false);
    }
  };

  const handleCancel = () => {
    if (user) {
        setFirstName(user.first_name || '');
        setLastName(user.last_name || '');
        setGender(user.gender || 'Male');
        setProfilePhoto(user.profile_photo_url || '');
        setFaculty(user.faculty || '');
        setDepartment(user.department || '');
        setClassLevel(user.class_level || '');
        setStatus(user.status || '');
        setRegistrationType(user.registration_type || '');
        setEducationType(user.education_type || '');
        setRegistrationDate(user.registration_date || '');
    }
    setIsEditing(false);
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfilePhoto(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="p-4 pt-8 space-y-6 pb-24 dark:bg-darkbg min-h-screen">
      
      {/* Top Bar */}
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-800 dark:text-white">Profile</h2>
        <div className="flex gap-3">
            <button onClick={toggleDarkMode} className="p-2 rounded-full bg-gray-100 dark:bg-darkcard text-gray-600 dark:text-gray-300">
                {isDarkMode ? <Sun size={20}/> : <Moon size={20}/>}
            </button>
            <button onClick={logout} className="text-red-500 bg-red-50 dark:bg-red-900/20 p-2 rounded-full">
                <LogOut size={20} />
            </button>
        </div>
      </div>

      {/* 1. Identity Card */}
      <div className="bg-white dark:bg-darkcard rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden relative">
         <div className="h-24 bg-gradient-to-r from-primary to-indigo-400"></div>
         <div className="px-6 pb-6">
            <div className="relative -mt-12 mb-4 flex justify-between items-end">
                <div className="relative group">
                    <img 
                        src={profilePhoto || "https://via.placeholder.com/150"} 
                        alt="Profile" 
                        className="w-24 h-24 rounded-full border-4 border-white dark:border-darkcard object-cover bg-gray-200" 
                    />
                    {isEditing && (
                        <>
                            <input 
                                type="file" 
                                ref={fileInputRef} 
                                className="hidden" 
                                accept="image/*"
                                onChange={handleImageChange}
                            />
                            <button 
                                onClick={triggerFileInput} 
                                className="absolute bottom-0 right-0 bg-primary text-white p-2 rounded-full shadow-md hover:bg-indigo-700 transition-colors"
                            >
                                <Camera size={16} />
                            </button>
                        </>
                    )}
                </div>
                <div>
                     {!isEditing ? (
                        <button onClick={() => setIsEditing(true)} className="text-gray-400 hover:text-primary"><Edit2 size={18} /></button>
                    ) : (
                        <div className="flex space-x-2">
                            <button onClick={handleSave} className="text-green-500 bg-green-50 dark:bg-green-900/20 p-2 rounded-full"><Save size={18}/></button>
                            <button onClick={handleCancel} className="text-red-500 bg-red-50 dark:bg-red-900/20 p-2 rounded-full"><X size={18}/></button>
                        </div>
                    )}
                </div>
            </div>

            <div className="space-y-3">
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="text-xs text-gray-400 uppercase font-bold">First Name</label>
                        {isEditing ? (
                            <input className="w-full border-b border-gray-300 dark:border-gray-600 bg-transparent py-1 text-gray-800 dark:text-white focus:border-primary focus:outline-none" value={firstName} onChange={e => setFirstName(e.target.value)} />
                        ) : (
                            <p className="font-semibold text-gray-800 dark:text-white">{user?.first_name}</p>
                        )}
                    </div>
                     <div>
                        <label className="text-xs text-gray-400 uppercase font-bold">Last Name</label>
                         {isEditing ? (
                            <input className="w-full border-b border-gray-300 dark:border-gray-600 bg-transparent py-1 text-gray-800 dark:text-white focus:border-primary focus:outline-none" value={lastName} onChange={e => setLastName(e.target.value)} />
                        ) : (
                            <p className="font-semibold text-gray-800 dark:text-white">{user?.last_name}</p>
                        )}
                    </div>
                </div>
                <div>
                    <label className="text-xs text-gray-400 uppercase font-bold">Gender</label>
                     {isEditing ? (
                         <select className="w-full border-b border-gray-300 dark:border-gray-600 bg-transparent py-1 text-gray-800 dark:text-white focus:border-primary focus:outline-none" value={gender} onChange={e => setGender(e.target.value as any)}>
                            <option value="Male">Male</option>
                            <option value="Female">Female</option>
                            <option value="Other">Other</option>
                         </select>
                    ) : (
                        <p className="font-semibold text-gray-800 dark:text-white">{user?.gender}</p>
                    )}
                </div>
            </div>
         </div>
      </div>

      {/* 2. Faculty & Department Card */}
      <div className="bg-white dark:bg-darkcard rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 p-6">
          <div className="flex items-center gap-2 mb-4 text-primary dark:text-indigo-400">
             <School size={20} />
             <h3 className="font-bold">Academic Unit</h3>
          </div>
          <div className="space-y-4">
               <div>
                    <label className="text-xs text-gray-400 uppercase font-bold">Faculty</label>
                    {isEditing ? (
                        <input className="w-full border-b border-gray-300 dark:border-gray-600 bg-transparent py-1 text-gray-800 dark:text-white focus:border-primary focus:outline-none" value={faculty} onChange={e => setFaculty(e.target.value)} />
                    ) : (
                        <p className="font-medium text-gray-800 dark:text-white">{user?.faculty}</p>
                    )}
               </div>
               <div>
                    <label className="text-xs text-gray-400 uppercase font-bold">Department</label>
                    {isEditing ? (
                        <input className="w-full border-b border-gray-300 dark:border-gray-600 bg-transparent py-1 text-gray-800 dark:text-white focus:border-primary focus:outline-none" value={department} onChange={e => setDepartment(e.target.value)} />
                    ) : (
                        <p className="font-medium text-gray-800 dark:text-white">{user?.department}</p>
                    )}
               </div>
          </div>
      </div>

       {/* 3. Education Info Card */}
       <div className="bg-white dark:bg-darkcard rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 p-6">
          <div className="flex items-center gap-2 mb-4 text-primary dark:text-indigo-400">
             <UserIcon size={20} />
             <h3 className="font-bold">Student Registration</h3>
          </div>
          <div className="grid grid-cols-2 gap-4">
               <div>
                    <label className="text-xs text-gray-400 uppercase font-bold">Class</label>
                    {isEditing ? (
                        <input className="w-full border-b border-gray-300 dark:border-gray-600 bg-transparent py-1 text-gray-800 dark:text-white focus:border-primary focus:outline-none" value={classLevel} onChange={e => setClassLevel(e.target.value)} />
                    ) : (
                        <p className="font-medium text-gray-800 dark:text-white">{user?.class_level}</p>
                    )}
               </div>
               <div>
                    <label className="text-xs text-gray-400 uppercase font-bold">Status</label>
                    {isEditing ? (
                        <input className="w-full border-b border-gray-300 dark:border-gray-600 bg-transparent py-1 text-gray-800 dark:text-white focus:border-primary focus:outline-none" value={status} onChange={e => setStatus(e.target.value)} />
                    ) : (
                        <span className="inline-block px-2 py-0.5 rounded text-xs font-bold bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300">
                            {user?.status}
                        </span>
                    )}
               </div>
               <div className="col-span-2">
                    <label className="text-xs text-gray-400 uppercase font-bold">Registration Type</label>
                    {isEditing ? (
                        <input className="w-full border-b border-gray-300 dark:border-gray-600 bg-transparent py-1 text-gray-800 dark:text-white focus:border-primary focus:outline-none" value={registrationType} onChange={e => setRegistrationType(e.target.value)} />
                    ) : (
                        <p className="font-medium text-gray-800 dark:text-white">{user?.registration_type}</p>
                    )}
               </div>
               <div className="col-span-2">
                    <label className="text-xs text-gray-400 uppercase font-bold">Education Type</label>
                    {isEditing ? (
                        <input className="w-full border-b border-gray-300 dark:border-gray-600 bg-transparent py-1 text-gray-800 dark:text-white focus:border-primary focus:outline-none" value={educationType} onChange={e => setEducationType(e.target.value)} />
                    ) : (
                        <p className="font-medium text-gray-800 dark:text-white">{user?.education_type}</p>
                    )}
               </div>
                <div className="col-span-2">
                    <label className="text-xs text-gray-400 uppercase font-bold">Registration Date</label>
                    {isEditing ? (
                        <input className="w-full border-b border-gray-300 dark:border-gray-600 bg-transparent py-1 text-gray-800 dark:text-white focus:border-primary focus:outline-none" value={registrationDate} onChange={e => setRegistrationDate(e.target.value)} placeholder="DD.MM.YYYY" />
                    ) : (
                        <div className="flex items-center gap-2 text-gray-800 dark:text-white font-medium">
                            <Calendar size={14} className="text-gray-400" />
                            {user?.registration_date}
                        </div>
                    )}
               </div>
          </div>
      </div>

      <h3 className="text-lg font-bold text-gray-800 dark:text-white pt-4">Analytics</h3>

      {/* Chart 1: Exam Line Chart */}
      <div className="bg-white dark:bg-darkcard p-4 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700">
        <h4 className="text-sm font-semibold text-gray-600 dark:text-gray-300 mb-4">Exam Performance History</h4>
        <div className="h-48">
            <ResponsiveContainer width="100%" height="100%">
                <LineChart data={examLineData}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                    <XAxis dataKey="date" tick={{fontSize: 10, fill: '#94a3b8'}} axisLine={false} tickLine={false} />
                    <YAxis domain={[0, 100]} tick={{fontSize: 10, fill: '#94a3b8'}} axisLine={false} tickLine={false} />
                    <Tooltip contentStyle={{borderRadius: '8px', border: 'none', backgroundColor: '#1e293b', color: '#fff'}} />
                    <Line type="monotone" dataKey="grade" stroke="#4f46e5" strokeWidth={2} dot={{r: 4, fill:'#4f46e5'}} />
                </LineChart>
            </ResponsiveContainer>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Chart 2: Attendance Pie Chart */}
        <div className="bg-white dark:bg-darkcard p-4 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700">
             <h4 className="text-sm font-semibold text-gray-600 dark:text-gray-300 mb-2">Attendance Ratio</h4>
             <div className="h-40">
                <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                        <Pie 
                            data={attendanceData} 
                            cx="50%" cy="50%" 
                            innerRadius={40} outerRadius={60} 
                            paddingAngle={5} 
                            dataKey="value"
                        >
                            {attendanceData.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={entry.color} />
                            ))}
                        </Pie>
                        <Tooltip />
                    </PieChart>
                </ResponsiveContainer>
             </div>
             <div className="flex justify-center gap-4 text-xs text-gray-500 dark:text-gray-400">
                <div className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-green-500"></div>Present</div>
                <div className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-red-500"></div>Absent</div>
             </div>
        </div>

        {/* Chart 3: Assignment Bar Chart */}
        <div className="bg-white dark:bg-darkcard p-4 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700">
             <h4 className="text-sm font-semibold text-gray-600 dark:text-gray-300 mb-2">Assignments</h4>
             <div className="h-40">
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={assignmentData}>
                        <XAxis dataKey="name" tick={{fontSize: 10, fill: '#94a3b8'}} axisLine={false} tickLine={false} />
                        <Tooltip cursor={{fill: 'transparent'}} contentStyle={{borderRadius: '8px', border: 'none', backgroundColor: '#1e293b', color: '#fff'}} />
                        <Bar dataKey="value" fill="#6366f1" radius={[4, 4, 0, 0]} barSize={30} />
                    </BarChart>
                </ResponsiveContainer>
             </div>
        </div>
      </div>

    </div>
  );
};
