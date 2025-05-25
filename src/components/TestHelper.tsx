import React from 'react';
import { Download } from 'lucide-react';
import { Button } from './Button';
import { useToast } from '../hooks/useToast';

export const TestHelper: React.FC = () => {
  const { showToast } = useToast();

  const generateSampleDashboard = () => {
    const sampleDashboard = {
      name: "Sample Test Dashboard",
      type: "standard",
      tiles: [
        {
          height: 4,
          width: 6,
          x: 0,
          y: 0,
          options: {
            type: "chart",
            title: "Sample Chart",
            chartType: "bar",
            dataSource: "sample_data"
          }
        },
        {
          height: 3,
          width: 4,
          x: 6,
          y: 0,
          options: {
            type: "metric",
            title: "Sample Metric",
            metricType: "count",
            displayFormat: "number"
          }
        },
        {
          height: 5,
          width: 8,
          x: 0,
          y: 4,
          options: {
            type: "table",
            title: "Sample Table",
            tableType: "data",
            columns: ["Name", "Value", "Status"]
          }
        }
      ],
      roles: [],
      exportedAt: new Date().toISOString(),
      sourceOrganizationId: "sample_org_123",
      exportVersion: "1.0"
    };

    const dataStr = JSON.stringify(sampleDashboard, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);

    const link = document.createElement('a');
    link.href = url;
    link.download = 'sample_dashboard_export.json';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    showToast('Sample dashboard file generated for testing!', 'success');
  };

  return (
    <div className="bg-gray-800/30 border border-gray-700/50 rounded-lg p-4">
      <h3 className="text-sm font-medium text-gray-400 mb-2">Testing Helper</h3>
      <p className="text-gray-500 text-sm mb-3">
        Generate a sample dashboard export file to test the import functionality.
      </p>
      <Button
        onClick={generateSampleDashboard}
        variant="outline"
        size="sm"
        icon={<Download className="h-4 w-4" />}
      >
        Generate Sample Dashboard
      </Button>
    </div>
  );
};
