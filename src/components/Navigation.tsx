import React from 'react';
import { Settings, Database, Play, BookOpen, Home } from 'lucide-react';

interface NavigationProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

export const Navigation: React.FC<NavigationProps> = ({ activeTab, onTabChange }) => {
  const navItems = [
    { id: 'gallery', label: 'Dashboard Gallery', icon: Home },
    { id: 'dashboards', label: 'My Dashboards', icon: Database },
    { id: 'training', label: 'Training', icon: Play },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  return (
    <nav className="bg-gray-800 border-b border-gray-600">
      <div className="container mx-auto px-2 sm:px-4">
        <div className="flex justify-center sm:justify-start sm:space-x-8">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                onClick={() => onTabChange(item.id)}
                className={`flex items-center justify-center flex-1 sm:flex-initial px-2 sm:px-3 py-4 text-sm font-medium border-b-2 transition-all duration-200 ${
                  activeTab === item.id
                    ? 'border-gray-300 text-white bg-gradient-to-t from-gray-700 to-transparent'
                    : 'border-transparent text-gray-400 hover:text-gray-200 hover:border-gray-500'
                }`}
              >
                <Icon className="h-4 w-4 sm:mr-2" />
                <span className="hidden sm:inline ml-2">{item.label}</span>
              </button>
            );
          })}
        </div>
      </div>
    </nav>
  );
};
