import React from 'react';
import { BookOpen, AlertTriangle } from 'lucide-react';
import { JobTreadConnection } from './JobTreadConnection';
import { TestHelper } from './TestHelper';
import { CorsHelper } from './CorsHelper';
import { ApiDebugger } from './ApiDebugger';

interface SettingsPageProps {
  connectionState: {
    isConnected: boolean;
    grantKey?: string;
    organization?: { id: string; name: string };
  };
  onConnectionChange: (isConnected: boolean, grantKey?: string, organization?: { id: string; name: string }) => void;
}

export const SettingsPage: React.FC<SettingsPageProps> = ({ connectionState, onConnectionChange }) => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-white mb-2">Settings</h1>
        <p className="text-gray-300">
          Connect to JobTread to get started
        </p>
      </div>

      {/* JobTread Connection Section - Primary CTA */}
      <div className="bg-gray-800 rounded-lg shadow-lg border-2 border-blue-500/50 p-6">
        <h2 className="text-xl font-semibold text-white mb-4">Connect to JobTread</h2>
        <JobTreadConnection onConnectionChange={onConnectionChange} />
      </div>

      {/* Information Cards - Subdued */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-gray-800/50 rounded-lg p-4 border border-gray-700/50">
          <div className="flex items-start">
            <div className="flex-shrink-0 mt-0.5">
              <BookOpen className="h-4 w-4 text-gray-500" />
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-gray-400">About Dashboard Sharing</h3>
              <div className="mt-2 text-sm text-gray-500">
                This tool allows you to export dashboards from one JobTread organization
                and import them into another. It's useful for transferring dashboard designs
                between environments or creating backups.
              </div>
            </div>
          </div>
        </div>
        <div className="bg-amber-900/10 rounded-lg p-4 border border-amber-800/30">
          <div className="flex items-start">
            <div className="flex-shrink-0 mt-0.5">
              <AlertTriangle className="h-4 w-4 text-amber-600/70" />
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-amber-400/80">Limitations</h3>
              <div className="mt-2 text-sm text-gray-500">
                Dashboards with tiles that reference specific reports, custom fields, or
                data views may not function correctly after import if those entities don't
                exist in the target organization. Role visibility settings are simplified
                in this version.
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Developer Tools - Subdued */}
      <div className="space-y-4">
        <div className="border-t border-gray-700/50 pt-6">
          <h2 className="text-lg font-medium text-gray-400 mb-2">Developer Tools</h2>
          <p className="text-gray-500 text-sm mb-4">
            Advanced tools for testing and debugging API connections
          </p>
        </div>

        <div className="space-y-3">
          <TestHelper />
          <CorsHelper />
          <ApiDebugger />
        </div>
      </div>
    </div>
  );
};
