import React from 'react';
import { BottomNav } from './BottomNav';

interface LayoutProps {
  children: React.ReactNode;
}

export const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div className="min-h-screen bg-gray-100 flex justify-center">
      {/* Mobile Container Limit */}
      <div className="w-full max-w-md bg-gray-50 h-screen flex flex-col relative shadow-xl overflow-hidden">
        {/* Content Area */}
        <main className="flex-1 overflow-y-auto overflow-x-hidden no-scrollbar pb-24">
            {children}
        </main>
        
        {/* Bottom Navigation - Fixed at bottom of container */}
        <div className="absolute bottom-0 left-0 right-0 z-50">
            <BottomNav />
        </div>
      </div>
    </div>
  );
};
