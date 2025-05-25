import React, { useState } from 'react';
import { Code, Play, AlertCircle } from 'lucide-react';
import { Button } from './Button';
import { FormField } from './FormField';
import { useToast } from '../hooks/useToast';

export const ApiDebugger: React.FC = () => {
  const [grantKey, setGrantKey] = useState('');
  const [organizationId, setOrganizationId] = useState('');
  const [dashboardId, setDashboardId] = useState('');
  const [isExpanded, setIsExpanded] = useState(false);
  const [loading, setLoading] = useState(false);
  const [lastRequest, setLastRequest] = useState<any>(null);
  const [lastResponse, setLastResponse] = useState<any>(null);
  const { showToast } = useToast();

  const testSimpleQuery = async () => {
    if (!grantKey.trim()) {
      showToast('Grant key is required', 'error');
      return;
    }

    setLoading(true);
    try {
      const query = {
        $: { grantKey },
        currentGrant: {
          user: {
            id: {},
            email: {}
          }
        }
      };

      setLastRequest(query);

      const response = await fetch('/api/pave', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${grantKey}`
        },
        body: JSON.stringify({ query })
      });

      const data = await response.json();
      setLastResponse(data);

      if (response.ok) {
        showToast('API test successful!', 'success');
      } else {
        showToast(`API test failed: ${response.status}`, 'error');
      }
    } catch (error: any) {
      showToast(`API test error: ${error.message}`, 'error');
      setLastResponse({ error: error.message });
    } finally {
      setLoading(false);
    }
  };

  const testOrganizationQuery = async () => {
    if (!grantKey.trim() || !organizationId.trim()) {
      showToast('Both Grant Key and Organization ID are required', 'error');
      return;
    }

    setLoading(true);
    try {
      const query = {
        $: { grantKey },
        organization: {
          $: { id: organizationId },
          id: {},
          name: {}
        }
      };

      setLastRequest(query);

      const response = await fetch('/api/pave', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${grantKey}`
        },
        body: JSON.stringify({ query })
      });

      const data = await response.json();
      setLastResponse(data);

      if (response.ok) {
        showToast('Organization query successful!', 'success');
      } else {
        showToast(`Organization query failed: ${response.status}`, 'error');
      }
    } catch (error: any) {
      showToast(`Organization query error: ${error.message}`, 'error');
      setLastResponse({ error: error.message });
    } finally {
      setLoading(false);
    }
  };

  const deleteDashboard = async () => {
    if (!grantKey.trim() || !dashboardId.trim()) {
      showToast('Both Grant Key and Dashboard ID are required', 'error');
      return;
    }

    // Show confirmation dialog
    const confirmed = window.confirm(
      `⚠️ WARNING: This will permanently delete the dashboard with ID: ${dashboardId}\n\n` +
      `This action cannot be undone. Are you sure you want to proceed?`
    );

    if (!confirmed) {
      return;
    }

    setLoading(true);
    try {
      const query = {
        $: { grantKey },
        deleteDashboard: {
          $: {
            id: dashboardId
          }
        }
      };

      setLastRequest(query);

      const response = await fetch('https://api.jobtread.com/pave', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${grantKey}`
        },
        body: JSON.stringify({ query })
      });

      const data = await response.json();
      setLastResponse(data);

      if (response.ok && !data.errors) {
        showToast(`Dashboard ${dashboardId} deleted successfully!`, 'success');
      } else {
        const errorMessage = data.errors
          ? data.errors.map((e: any) => e.message || JSON.stringify(e)).join(', ')
          : `Delete failed: ${response.status}`;
        showToast(`Delete failed: ${errorMessage}`, 'error');
      }
    } catch (error: any) {
      showToast(`Delete error: ${error.message}`, 'error');
      setLastResponse({ error: error.message });
    } finally {
      setLoading(false);
    }
  };

  if (!isExpanded) {
    return (
      <div className="bg-gray-800/30 border border-gray-700/50 rounded-lg p-4">
        <button
          onClick={() => setIsExpanded(true)}
          className="flex items-center text-gray-500 hover:text-gray-400"
        >
          <Code className="h-4 w-4 mr-2" />
          <span className="text-sm font-medium">API Debugger</span>
          <span className="text-xs text-gray-600 ml-2">(Click to expand)</span>
        </button>
      </div>
    );
  }

  return (
    <div className="bg-gray-800/30 border border-gray-700/50 rounded-lg p-4 space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <Code className="h-4 w-4 mr-2 text-gray-500" />
          <h3 className="text-sm font-medium text-gray-400">API Debugger</h3>
        </div>
        <button
          onClick={() => setIsExpanded(false)}
          className="text-gray-500 hover:text-gray-400"
        >
          ×
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <FormField
          label="Grant Key"
          type="password"
          value={grantKey}
          onChange={setGrantKey}
          placeholder="Enter your Grant Key"
        />
        <FormField
          label="Organization ID"
          type="text"
          value={organizationId}
          onChange={setOrganizationId}
          placeholder="Enter Organization ID"
        />
        <FormField
          label="Dashboard ID"
          type="text"
          value={dashboardId}
          onChange={setDashboardId}
          placeholder="Enter Dashboard ID to delete"
        />
      </div>

      <div className="flex flex-wrap gap-2">
        <Button
          onClick={testSimpleQuery}
          disabled={loading}
          isLoading={loading}
          variant="outline"
          size="sm"
          icon={<Play className="h-4 w-4" />}
        >
          Test Simple Query
        </Button>
        <Button
          onClick={testOrganizationQuery}
          disabled={loading}
          isLoading={loading}
          variant="outline"
          size="sm"
          icon={<Play className="h-4 w-4" />}
        >
          Test Organization Query
        </Button>
        <Button
          onClick={deleteDashboard}
          disabled={loading}
          isLoading={loading}
          variant="danger"
          size="sm"
          icon={<AlertCircle className="h-4 w-4" />}
        >
          Delete Dashboard
        </Button>
      </div>

      {lastRequest && (
        <div className="space-y-2">
          <h4 className="font-medium text-white">Last Request:</h4>
          <pre className="bg-gray-700 p-3 rounded border border-gray-600 text-xs overflow-auto max-h-40 text-gray-300">
            {JSON.stringify(lastRequest, null, 2)}
          </pre>
        </div>
      )}

      {lastResponse && (
        <div className="space-y-2">
          <h4 className="font-medium text-white">Last Response:</h4>
          <pre className="bg-gray-700 p-3 rounded border border-gray-600 text-xs overflow-auto max-h-40 text-gray-300">
            {JSON.stringify(lastResponse, null, 2)}
          </pre>
        </div>
      )}
    </div>
  );
};
