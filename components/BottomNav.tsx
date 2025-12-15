import React from 'react';
import { NavLink } from 'react-router-dom';
import { Home, BookOpen, PlusCircle, GraduationCap, User } from 'lucide-react';

export const BottomNav: React.FC = () => {
  const navItems = [
    { to: '/', icon: Home, label: 'Home' },
    { to: '/tracks', icon: BookOpen, label: 'Tracks' },
    { to: '/add', icon: PlusCircle, label: 'Add', isSpecial: true },
    { to: '/exams', icon: GraduationCap, label: 'Exams' },
    { to: '/profile', icon: User, label: 'Profile' },
  ];

  return (
    <nav className="bg-white border-t border-gray-200 px-4 py-2 flex justify-between items-end shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)]">
      {navItems.map((item) => (
        <NavLink
          key={item.label}
          to={item.to}
          className={({ isActive }) =>
            `flex flex-col items-center justify-center w-full transition-colors duration-200 ${
              item.isSpecial ? '-mt-6' : ''
            } ${isActive && !item.isSpecial ? 'text-primary' : 'text-gray-400'}`
          }
        >
          {item.isSpecial ? (
            <div className="bg-primary text-white p-3 rounded-full shadow-lg transform active:scale-95 transition-transform">
              <item.icon size={28} />
            </div>
          ) : (
            <>
              <item.icon size={24} strokeWidth={2} />
              <span className="text-[10px] mt-1 font-medium">{item.label}</span>
            </>
          )}
        </NavLink>
      ))}
    </nav>
  );
};
