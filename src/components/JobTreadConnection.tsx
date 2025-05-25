import React, { useState, useEffect } from 'react';
import { CheckCircle, Lock, Unlock, Eye, EyeOff, AlertCircle, Trash2 } from 'lucide-react';
import { Button } from './Button';
import { FormField } from './FormField';
import { useToast } from '../hooks/useToast';
import { fetchOrganizationIds, fetchOrganizationDashboards, deleteDashboard as apiDeleteDashboard } from '../services/api';

interface Organization {
  id: string;
  name: string;
}

interface Dashboard {
  id: string;
  name: string;
  type: string;
}

interface JobTreadConnectionProps {
  onConnectionChange?: (isConnected: boolean, grantKey?: string, organization?: Organization) => void;
}

export const JobTreadConnection: React.FC<JobTreadConnectionProps> = ({ onConnectionChange }) => {
  const [grantKey, setGrantKey] = useState('');
  const [isConnected, setIsConnected] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [showGrantKey, setShowGrantKey] = useState(false);
  const [organizations, setOrganizations] = useState<Organization[]>([]);
  const [selectedOrganization, setSelectedOrganization] = useState<Organization | null>(null);
  const [dashboards, setDashboards] = useState<Dashboard[]>([]);
  const [isLoadingDashboards, setIsLoadingDashboards] = useState(false);
  const [isDeletingDashboard, setIsDeletingDashboard] = useState<string | null>(null);
  const { showToast } = useToast();

  // Load saved connection from localStorage
  useEffect(() => {
    const savedGrantKey = localStorage.getItem('jobtread_grant_key');
    const savedOrganization = localStorage.getItem('jobtread_organization');

    if (savedGrantKey && savedOrganization) {
      setGrantKey(savedGrantKey);
      setSelectedOrganization(JSON.parse(savedOrganization));
      setIsConnected(true);
      loadDashboards(savedGrantKey, JSON.parse(savedOrganization));
    }
  }, []);

  // Notify parent of connection changes
  useEffect(() => {
    onConnectionChange?.(isConnected, grantKey, selectedOrganization || undefined);
  }, [isConnected, grantKey, selectedOrganization]);

  const testConnection = async () => {
    if (!grantKey.trim()) {
      showToast('Grant key is required', 'error');
      return;
    }

    setIsConnecting(true);
    try {
      const orgs = await fetchOrganizationIds(grantKey);

      if (orgs && orgs.length > 0) {
        setOrganizations(orgs);
        setIsConnected(true);

        // Auto-select first organization if only one
        if (orgs.length === 1) {
          setSelectedOrganization(orgs[0]);
          localStorage.setItem('jobtread_organization', JSON.stringify(orgs[0]));
          loadDashboards(grantKey, orgs[0]);
        }

        // Save grant key
        localStorage.setItem('jobtread_grant_key', grantKey);
        showToast('Successfully connected to JobTread!', 'success');
      } else {
        throw new Error('No organizations found for this grant key');
      }
    } catch (error: any) {
      showToast(`Connection failed: ${error.message}`, 'error');
      setIsConnected(false);
    } finally {
      setIsConnecting(false);
    }
  };

  const loadDashboards = async (key: string, org: Organization) => {
    setIsLoadingDashboards(true);
    try {
      const dashboardList = await fetchOrganizationDashboards(key, org.id);
      setDashboards(dashboardList || []);
    } catch (error: any) {
      showToast(`Failed to load dashboards: ${error.message}`, 'error');
      setDashboards([]);
    } finally {
      setIsLoadingDashboards(false);
    }
  };

  const handleOrganizationChange = (orgId: string) => {
    const org = organizations.find(o => o.id === orgId);
    if (org) {
      setSelectedOrganization(org);
      localStorage.setItem('jobtread_organization', JSON.stringify(org));
      loadDashboards(grantKey, org);
    }
  };

  const disconnect = () => {
    setIsConnected(false);
    setGrantKey('');
    setOrganizations([]);
    setSelectedOrganization(null);
    setDashboards([]);
    localStorage.removeItem('jobtread_grant_key');
    localStorage.removeItem('jobtread_organization');
    showToast('Disconnected from JobTread', 'info');
  };

  const deleteDashboard = async (dashboardId: string, dashboardName: string) => {
    if (!selectedOrganization) return;

    const confirmed = window.confirm(
      `⚠️ WARNING: This will permanently delete the dashboard "${dashboardName}"\n\n` +
      `This action cannot be undone. Are you sure you want to proceed?`
    );

    if (!confirmed) return;

    setIsDeletingDashboard(dashboardId);
    try {
      await apiDeleteDashboard(grantKey, dashboardId);
      showToast(`Dashboard "${dashboardName}" deleted successfully!`, 'success');
      // Reload dashboards
      loadDashboards(grantKey, selectedOrganization);
    } catch (error: any) {
      showToast(`Delete error: ${error.message}`, 'error');
    } finally {
      setIsDeletingDashboard(null);
    }
  };

  if (!isConnected) {
    return (
      <div className="bg-gray-800 border border-gray-600 rounded-lg p-6 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-white">Enter Your Grant Key</h3>
          </div>
          <div className="flex items-center text-gray-400">
            <Lock className="h-5 w-5 mr-2" />
            <span className="text-sm">Not Connected</span>
          </div>
        </div>

        <div className="space-y-4">
          <div className="relative">
            <FormField
              label="Grant Key"
              type={showGrantKey ? "text" : "password"}
              value={grantKey}
              onChange={setGrantKey}
              placeholder="Enter your Grant Key"
              required
            />
            <button
              type="button"
              onClick={() => setShowGrantKey(!showGrantKey)}
              className="absolute right-3 top-8 text-gray-400 hover:text-gray-300"
            >
              {showGrantKey ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>

          <Button
            onClick={testConnection}
            disabled={!grantKey.trim() || isConnecting}
            isLoading={isConnecting}
            variant="primary"
          >
            Connect
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-green-900/30 border border-green-600 rounded-lg p-6 space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <CheckCircle className="h-5 w-5 text-green-400 mr-2" />
          <div>
            <h3 className="text-lg font-semibold text-green-300">Connected to JobTread</h3>
            <p className="text-sm text-green-200">Your connection is active and ready to use</p>
          </div>
        </div>
        <Button onClick={disconnect} variant="outline" size="sm">
          <Unlock className="h-4 w-4 mr-2" />
          Disconnect
        </Button>
      </div>

      {/* Organization Selection */}
      {organizations.length > 1 && (
        <div className="space-y-2">
          <label className="block text-sm font-medium text-green-300">Organization</label>
          <select
            value={selectedOrganization?.id || ''}
            onChange={(e) => handleOrganizationChange(e.target.value)}
            className="w-full px-3 py-2 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 bg-gray-700 text-white"
          >
            <option value="">Select an organization</option>
            {organizations.map(org => (
              <option key={org.id} value={org.id}>{org.name}</option>
            ))}
          </select>
        </div>
      )}

      {/* Connected Organization Display */}
      {selectedOrganization && (
        <div className="bg-gray-800 border border-green-600 rounded-lg p-4">
          <h4 className="font-medium text-green-300 mb-2">Connected Organization</h4>
          <p className="text-lg font-semibold text-white">{selectedOrganization.name}</p>

          {/* Dashboard List */}
          <div className="mt-4">
            <div className="flex items-center justify-between mb-3">
              <h5 className="font-medium text-green-300">Dashboards ({dashboards.length})</h5>
              {isLoadingDashboards && (
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-green-400"></div>
              )}
            </div>

            {dashboards.length > 0 ? (
              <div className="space-y-2 max-h-60 overflow-y-auto">
                {dashboards.map(dashboard => (
                  <div key={dashboard.id} className="flex items-center justify-between p-3 bg-gray-700 rounded border border-gray-600">
                    <div>
                      <p className="font-medium text-white">{dashboard.name}</p>
                      <p className="text-sm text-gray-300">Type: {dashboard.type} | ID: {dashboard.id}</p>
                    </div>
                    <Button
                      onClick={() => deleteDashboard(dashboard.id, dashboard.name)}
                      disabled={isDeletingDashboard === dashboard.id}
                      isLoading={isDeletingDashboard === dashboard.id}
                      variant="danger"
                      size="sm"
                      icon={<Trash2 className="h-4 w-4" />}
                    >
                      Delete
                    </Button>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-400 text-sm">No dashboards found in this organization</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
