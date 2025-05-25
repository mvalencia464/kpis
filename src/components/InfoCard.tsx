import React from 'react';
import { Info, AlertTriangle, CheckCircle } from 'lucide-react';

interface InfoCardProps {
  title: string;
  content: string;
  type?: 'info' | 'warning' | 'success';
}

export const InfoCard: React.FC<InfoCardProps> = ({
  title,
  content,
  type = 'info'
}) => {
  const icons = {
    info: <Info className="h-5 w-5 text-blue-500" />,
    warning: <AlertTriangle className="h-5 w-5 text-amber-500" />,
    success: <CheckCircle className="h-5 w-5 text-green-500" />
  };

  const bgColors = {
    info: 'bg-gray-700 border-gray-600',
    warning: 'bg-amber-900/30 border-amber-600',
    success: 'bg-green-900/30 border-green-600'
  };

  const titleColors = {
    info: 'text-blue-300',
    warning: 'text-amber-300',
    success: 'text-green-300'
  };

  return (
    <div className={`p-4 rounded-lg border ${bgColors[type]}`}>
      <div className="flex items-start">
        <div className="flex-shrink-0 mt-0.5">
          {icons[type]}
        </div>
        <div className="ml-3">
          <h3 className={`text-sm font-medium ${titleColors[type]}`}>{title}</h3>
          <div className="mt-2 text-sm text-gray-300">
            {content}
          </div>
        </div>
      </div>
    </div>
  );
};