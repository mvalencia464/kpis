import React, { useState, useEffect } from 'react';
import { RefreshCw, Plus, Trash2, Download, Upload, AlertCircle } from 'lucide-react';
import { Button } from './Button';
import { useToast } from '../hooks/useToast';
import { fetchOrganizationDashboards, deleteDashboard, exportDashboard } from '../services/api';

interface Dashboard {
  id: string;
  name: string;
  type: string;
}

interface MyDashboardsProps {
  connectionState: {
    isConnected: boolean;
    grantKey?: string;
    organization?: { id: string; name: string };
  };
}

export const MyDashboards: React.FC<MyDashboardsProps> = ({ connectionState }) => {
  const [dashboards, setDashboards] = useState<Dashboard[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isDeletingDashboard, setIsDeletingDashboard] = useState<string | null>(null);
  const [isExportingDashboard, setIsExportingDashboard] = useState<string | null>(null);
  const { showToast } = useToast();

  useEffect(() => {
    if (connectionState.isConnected && connectionState.grantKey && connectionState.organization) {
      loadDashboards();
    }
  }, [connectionState]);

  const loadDashboards = async () => {
    if (!connectionState.grantKey || !connectionState.organization) return;

    setIsLoading(true);
    try {
      const dashboardList = await fetchOrganizationDashboards(
        connectionState.grantKey,
        connectionState.organization.id
      );
      setDashboards(dashboardList || []);
    } catch (error: any) {
      showToast(`Failed to load dashboards: ${error.message}`, 'error');
      setDashboards([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteDashboard = async (dashboardId: string, dashboardName: string) => {
    if (!connectionState.grantKey) return;

    const confirmed = window.confirm(
      `⚠️ WARNING: This will permanently delete the dashboard "${dashboardName}"\n\n` +
      `This action cannot be undone. Are you sure you want to proceed?`
    );

    if (!confirmed) return;

    setIsDeletingDashboard(dashboardId);
    try {
      await deleteDashboard(connectionState.grantKey, dashboardId);
      showToast(`Dashboard "${dashboardName}" deleted successfully!`, 'success');
      loadDashboards(); // Reload the list
    } catch (error: any) {
      showToast(`Delete error: ${error.message}`, 'error');
    } finally {
      setIsDeletingDashboard(null);
    }
  };

  const handleExportDashboard = async (dashboardId: string, dashboardName: string) => {
    if (!connectionState.grantKey || !connectionState.organization) return;

    setIsExportingDashboard(dashboardId);
    try {
      const dashboardData = await exportDashboard(
        connectionState.grantKey,
        connectionState.organization.id,
        dashboardId
      );

      // Create and download the file
      const blob = new Blob([JSON.stringify(dashboardData, null, 2)], {
        type: 'application/json'
      });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `${dashboardName.replace(/[^a-z0-9]/gi, '_').toLowerCase()}_dashboard.json`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      showToast(`Dashboard "${dashboardName}" exported successfully!`, 'success');
    } catch (error: any) {
      showToast(`Export error: ${error.message}`, 'error');
    } finally {
      setIsExportingDashboard(null);
    }
  };

  if (!connectionState.isConnected) {
    return (
      <div className="text-center py-12">
        <AlertCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">Not Connected</h3>
        <p className="text-gray-500 mb-4">
          Please connect to JobTread in Settings to view your dashboards
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white">My Dashboards</h1>
          <p className="text-gray-300 mt-1">
            Manage dashboards in {connectionState.organization?.name}
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            onClick={loadDashboards}
            disabled={isLoading}
            isLoading={isLoading}
            variant="outline"
            icon={<RefreshCw className="h-4 w-4" />}
          >
            Refresh
          </Button>
        </div>
      </div>

      {dashboards.length > 0 ? (
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">
              Dashboards ({dashboards.length})
            </h2>
          </div>
          <div className="divide-y divide-gray-200">
            {dashboards.map((dashboard) => (
              <div key={dashboard.id} className="px-6 py-4 flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-medium text-gray-900">{dashboard.name}</h3>
                  <p className="text-sm text-gray-500">
                    Type: {dashboard.type} • ID: {dashboard.id}
                  </p>
                </div>
                <div className="flex gap-2">
                  <Button
                    onClick={() => handleExportDashboard(dashboard.id, dashboard.name)}
                    disabled={isExportingDashboard === dashboard.id}
                    isLoading={isExportingDashboard === dashboard.id}
                    variant="outline"
                    size="sm"
                    icon={<Download className="h-4 w-4" />}
                  >
                    Export
                  </Button>
                  <Button
                    onClick={() => handleDeleteDashboard(dashboard.id, dashboard.name)}
                    disabled={isDeletingDashboard === dashboard.id}
                    isLoading={isDeletingDashboard === dashboard.id}
                    variant="danger"
                    size="sm"
                    icon={<Trash2 className="h-4 w-4" />}
                  >
                    Delete
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="text-center py-12 bg-white rounded-lg shadow-md">
          <Plus className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No Dashboards Found</h3>
          <p className="text-gray-500 mb-4">
            You don't have any dashboards in this organization yet.
          </p>
          <p className="text-sm text-gray-400">
            Import dashboards from the Gallery to get started!
          </p>
        </div>
      )}
    </div>
  );
};
