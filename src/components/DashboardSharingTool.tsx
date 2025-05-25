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
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center space-x-4">
            <div className="flex-shrink-0">
              <div className="w-16 h-16 bg-gradient-to-br from-gray-300 via-gray-200 to-white rounded-lg flex items-center justify-center shadow-lg">
                <span className="text-gray-800 font-black text-xl">FB</span>
              </div>
            </div>
            <div>
              <h1 className="text-4xl font-black bg-gradient-to-r from-gray-100 via-white to-gray-200 bg-clip-text text-transparent">
                FREEDOM BROTHERS
              </h1>
              <p className="text-xl font-bold text-gray-300 -mt-1">DASHBOARDS</p>
              <p className="text-gray-400 mt-2 text-sm">
                Master your construction business with data-driven insights
              </p>
            </div>
          </div>
        </div>
      </header>

      {/* Navigation */}
      <Navigation activeTab={activeTab} onTabChange={setActiveTab} />

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl shadow-2xl border border-gray-700/50 p-8">
          {renderContent()}
        </div>
      </main>
    </div>
  );
};