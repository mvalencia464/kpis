import React, { ReactNode } from 'react';
import { Database } from 'lucide-react';

interface LayoutProps {
  children: ReactNode;
}

export const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div className="min-h-screen bg-slate-100">
      <header className="bg-blue-700 text-white shadow-md">
        <div className="container mx-auto px-4 py-4 flex items-center">
          <Database className="h-6 w-6 mr-2" />
          <h1 className="text-xl font-bold">JobTread Dashboard Sharing Tool</h1>
        </div>
      </header>
      
      <main className="container mx-auto px-4 py-8">
        {children}
      </main>
      
      <footer className="bg-slate-800 text-slate-300 py-6">
        <div className="container mx-auto px-4 text-center text-sm">
          <p>© 2025 JobTread Dashboard Sharing Tool</p>
          <p className="mt-2">This tool allows you to export and import dashboards between JobTread organizations.</p>
        </div>
      </footer>
    </div>
  );
};