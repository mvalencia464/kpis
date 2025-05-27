import React, { useState, useCallback } from 'react';
import { Navigation } from './Navigation';
import { DashboardGallery } from './DashboardGallery';
import { MyDashboards } from './MyDashboards';
import { TrainingPage } from './TrainingPage';
import { SettingsPage } from './SettingsPage';

export const DashboardSharingTool: React.FC = () => {
  const [activeTab, setActiveTab] = useState<string>('gallery');
  const [connectionState, setConnectionState] = useState<{
    isConnected: boolean;
    grantKey?: string;
    organization?: { id: string; name: string };
  }>({ isConnected: false });

  const handleConnectionChange = useCallback((isConnected: boolean, grantKey?: string, organization?: { id: string; name: string }) => {
    setConnectionState({ isConnected, grantKey, organization });
  }, []);

  const renderContent = () => {
    switch (activeTab) {
      case 'gallery':
        return <DashboardGallery connectionState={connectionState} />;
      case 'dashboards':
        return <MyDashboards connectionState={connectionState} />;
      case 'training':
        return <TrainingPage />;
      case 'settings':
        return <SettingsPage connectionState={connectionState} onConnectionChange={handleConnectionChange} />;
      default:
        return <DashboardGallery connectionState={connectionState} />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      {/* Header */}
      <header className="bg-gradient-to-r from-gray-800 via-gray-700 to-gray-800 text-white shadow-2xl">
        <div className="container mx-auto px-4 py-4 sm:py-8">
          <div className="flex flex-col items-center space-y-2 sm:space-y-3">
            <img
              src="https://storage.googleapis.com/msgsndr/TN3oWfBb9e5GQ7LIUkkd/media/6835de0a3f613c1c1aa418f8.webp"
              alt="Freedom Brothers Logo"
              className="w-48 h-auto sm:w-64 object-contain"
            />
            <div className="text-center">
              <p className="text-lg sm:text-xl font-bold text-gray-300">DASHBOARDS</p>
              <p className="text-gray-400 mt-1 text-xs sm:text-sm">
                Master your construction business with data-driven insights
              </p>
            </div>
          </div>
        </div>
      </header>

      {/* Navigation */}
      <Navigation activeTab={activeTab} onTabChange={setActiveTab} />

      {/* Main Content */}
      <main className="container mx-auto px-2 sm:px-4 py-4 sm:py-8">
        <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl sm:rounded-2xl shadow-2xl border border-gray-700/50 p-4 sm:p-8">
          {renderContent()}
        </div>
      </main>
    </div>
  );
};