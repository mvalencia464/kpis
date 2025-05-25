import React, { useState } from 'react';
import { ArrowDownToLine, RefreshCw } from 'lucide-react';
import { FormField } from './FormField';
import { fetchOrganizationDashboards, fetchDashboardDetails } from '../services/api';
import { Button } from './Button';
import { Dashboard } from '../types/dashboard';
import { useToast } from '../hooks/useToast';

export const ExportDashboard: React.FC = () => {
  const [grantKey, setGrantKey] = useState('');
  const [organizationId, setOrganizationId] = useState('');
  const [dashboards, setDashboards] = useState<Dashboard[]>([]);
  const [selectedDashboardId, setSelectedDashboardId] = useState('');
  const [loading, setLoading] = useState<'idle' | 'fetchingDashboards' | 'exportingDashboard'>('idle');
  const { showToast } = useToast();

  const handleFetchDashboards = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!grantKey?.trim() || !organizationId?.trim()) {
      showToast('Please provide both Grant Key and Organization ID', 'error');
      return;
    }

    setLoading('fetchingDashboards');
    try {
      showToast('Fetching dashboards...', 'info');
      const fetchedDashboards = await fetchOrganizationDashboards(grantKey, organizationId);

      if (!Array.isArray(fetchedDashboards)) {
        throw new Error('Invalid response: expected array of dashboards');
      }

      setDashboards(fetchedDashboards);
      setSelectedDashboardId(fetchedDashboards.length > 0 ? fetchedDashboards[0].id : '');

      if (fetchedDashboards.length === 0) {
        showToast('No dashboards found in this organization', 'info');
      } else {
        showToast(`Found ${fetchedDashboards.length} dashboard${fetchedDashboards.length === 1 ? '' : 's'}`, 'success');
      }
    } catch (error: any) {
      console.error('Error fetching dashboards:', error);
      let errorMessage = error.message || 'Unknown error';

      // Provide more specific error guidance
      if (errorMessage.includes('Access denied') || errorMessage.includes('403')) {
        errorMessage += ' - Please verify your grant key has the necessary permissions.';
      } else if (errorMessage.includes('404')) {
        errorMessage += ' - Please check the organization ID.';
      } else if (errorMessage.includes('Network') || errorMessage.includes('fetch')) {
        errorMessage += ' - Please check your internet connection and try again.';
      }

      showToast(`Failed to fetch dashboards: ${errorMessage}`, 'error');
      setDashboards([]);
      setSelectedDashboardId('');
    } finally {
      setLoading('idle');
    }
  };

  const handleExportDashboard = async () => {
    if (!selectedDashboardId) {
      showToast('Please select a dashboard to export', 'error');
      return;
    }

    if (!grantKey?.trim()) {
      showToast('Grant key is required for export', 'error');
      return;
    }

    setLoading('exportingDashboard');
    try {
      showToast('Fetching dashboard details...', 'info');
      const dashboardDetails = await fetchDashboardDetails(grantKey, selectedDashboardId);

      if (!dashboardDetails) {
        throw new Error('No dashboard details received from API');
      }

      if (!dashboardDetails.tiles || !dashboardDetails.tiles.nodes) {
        throw new Error('Dashboard has invalid tile structure');
      }

      const exportData = {
        name: dashboardDetails.name,
        type: dashboardDetails.type,
        tiles: dashboardDetails.tiles.nodes,
        roles: dashboardDetails.roles?.nodes || [],
        exportedAt: new Date().toISOString(),
        sourceOrganizationId: organizationId,
        exportVersion: '1.0'
      };

      // Validate export data
      if (!exportData.name || !exportData.type || !Array.isArray(exportData.tiles)) {
        throw new Error('Invalid dashboard data structure');
      }

      const dataStr = JSON.stringify(exportData, null, 2);
      const dataBlob = new Blob([dataStr], { type: 'application/json' });
      const url = URL.createObjectURL(dataBlob);

      // Create a safe filename
      const safeFileName = dashboardDetails.name
        .replace(/[^a-zA-Z0-9\s-_]/g, '') // Remove special characters
        .replace(/\s+/g, '_') // Replace spaces with underscores
        .substring(0, 50); // Limit length

      const link = document.createElement('a');
      link.href = url;
      link.download = `${safeFileName}_dashboard_export.json`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      showToast(`Dashboard "${dashboardDetails.name}" exported successfully! (${exportData.tiles.length} tiles)`, 'success');
    } catch (error: any) {
      console.error('Error exporting dashboard:', error);
      let errorMessage = error.message || 'Unknown error';

      // Provide more specific error guidance
      if (errorMessage.includes('Access denied') || errorMessage.includes('403')) {
        errorMessage += ' - Please verify your grant key has the necessary permissions.';
      } else if (errorMessage.includes('404')) {
        errorMessage += ' - The dashboard may have been deleted or moved.';
      } else if (errorMessage.includes('Network') || errorMessage.includes('fetch')) {
        errorMessage += ' - Please check your internet connection and try again.';
      }

      showToast(`Failed to export dashboard: ${errorMessage}`, 'error');
    } finally {
      setLoading('idle');
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold mb-4">Export Dashboard</h2>
        <p className="text-gray-600 mb-4">
          Export a dashboard from your JobTread organization to share or backup.
        </p>
      </div>

      <form onSubmit={handleFetchDashboards} className="space-y-4">
        <FormField
          label="Grant Key"
          type="password"
          value={grantKey}
          onChange={setGrantKey}
          placeholder="Enter your JobTread API Grant Key"
          required
          helpText="The API Grant Key for the source organization"
        />

        <FormField
          label="Organization ID"
          type="text"
          value={organizationId}
          onChange={setOrganizationId}
          placeholder="Enter your Organization ID"
          required
          helpText="The ID of the organization containing the dashboards"
        />

        <Button
          type="submit"
          disabled={loading !== 'idle'}
          isLoading={loading === 'fetchingDashboards'}
          icon={<RefreshCw className="h-4 w-4" />}
        >
          Fetch Dashboards
        </Button>
      </form>

      {dashboards.length > 0 && (
        <div className="mt-8 space-y-4">
          <div className="form-group">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Select Dashboard
            </label>
            <select
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              value={selectedDashboardId}
              onChange={(e) => setSelectedDashboardId(e.target.value)}
            >
              {dashboards.map(dashboard => (
                <option key={dashboard.id} value={dashboard.id}>
                  {dashboard.name} ({dashboard.type})
                </option>
              ))}
            </select>
          </div>

          <Button
            onClick={handleExportDashboard}
            disabled={!selectedDashboardId || loading !== 'idle'}
            isLoading={loading === 'exportingDashboard'}
            variant="primary"
            icon={<ArrowDownToLine className="h-4 w-4" />}
          >
            Export Selected Dashboard
          </Button>
        </div>
      )}
    </div>
  );
};