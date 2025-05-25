import React, { useState } from 'react';
import { Upload, ArrowUpFromLine } from 'lucide-react';
import { FormField } from './FormField';
import { importDashboard } from '../services/api';
import { Button } from './Button';
import { useToast } from '../hooks/useToast';

export const ImportDashboard: React.FC = () => {
  const [grantKey, setGrantKey] = useState('');
  const [organizationId, setOrganizationId] = useState('');
  const [dashboardFile, setDashboardFile] = useState<File | null>(null);
  const [newDashboardName, setNewDashboardName] = useState('');
  const [loading, setLoading] = useState(false);
  const [fileData, setFileData] = useState<any>(null);
  const { showToast } = useToast();

  const validateDashboardFile = (data: any): string | null => {
    if (!data) return 'File is empty or invalid';

    if (!data.name || typeof data.name !== 'string') {
      return 'Dashboard must have a valid name';
    }

    if (!data.type || typeof data.type !== 'string') {
      return 'Dashboard must have a valid type';
    }

    if (!Array.isArray(data.tiles)) {
      return 'Dashboard must have a tiles array';
    }

    if (!data.exportedAt) {
      return 'File does not appear to be a valid dashboard export (missing exportedAt field)';
    }

    // Validate tiles structure
    for (let i = 0; i < data.tiles.length; i++) {
      const tile = data.tiles[i];
      if (typeof tile.height !== 'number' || tile.height <= 0) {
        return `Tile ${i + 1} has invalid height`;
      }
      if (typeof tile.width !== 'number' || tile.width <= 0) {
        return `Tile ${i + 1} has invalid width`;
      }
      if (typeof tile.x !== 'number' || tile.x < 0) {
        return `Tile ${i + 1} has invalid x position`;
      }
      if (typeof tile.y !== 'number' || tile.y < 0) {
        return `Tile ${i + 1} has invalid y position`;
      }
      if (!tile.options || typeof tile.options !== 'object') {
        return `Tile ${i + 1} has invalid options`;
      }
      if (!tile.options.type || typeof tile.options.type !== 'string') {
        return `Tile ${i + 1} options must include a 'type' field`;
      }
    }

    return null; // Valid
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setDashboardFile(file);
    setFileData(null);
    setNewDashboardName('');

    if (file) {
      // Check file type
      if (!file.name.toLowerCase().endsWith('.json')) {
        showToast('Please select a JSON file.', 'error');
        setDashboardFile(null);
        return;
      }

      // Check file size (limit to 10MB)
      if (file.size > 10 * 1024 * 1024) {
        showToast('File is too large. Please select a file smaller than 10MB.', 'error');
        setDashboardFile(null);
        return;
      }

      const reader = new FileReader();
      reader.onload = (event) => {
        try {
          const jsonData = JSON.parse(event.target?.result as string);

          // Validate the dashboard data
          const validationError = validateDashboardFile(jsonData);
          if (validationError) {
            showToast(`Invalid dashboard file: ${validationError}`, 'error');
            setDashboardFile(null);
            return;
          }

          setFileData(jsonData);
          setNewDashboardName(jsonData.name || '');
          showToast(`Dashboard file loaded successfully. Found ${jsonData.tiles.length} tiles.`, 'success');
        } catch (error) {
          console.error('Error parsing JSON:', error);
          showToast('Invalid JSON file. Please select a valid dashboard export.', 'error');
          setDashboardFile(null);
        }
      };

      reader.onerror = () => {
        showToast('Error reading file. Please try again.', 'error');
        setDashboardFile(null);
      };

      reader.readAsText(file);
    }
  };

  const handleImportDashboard = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!grantKey || !organizationId || !dashboardFile || !fileData) {
      showToast('Please provide all required information', 'error');
      return;
    }

    setLoading(true);
    try {
      // Prepare the import data
      const importData = {
        ...fileData,
        name: newDashboardName || fileData.name
      };

      const result = await importDashboard(grantKey, organizationId, importData);

      showToast(`Dashboard "${result.name}" imported successfully!`, 'success');

      // Reset form after successful import
      setDashboardFile(null);
      setFileData(null);
      setNewDashboardName('');

    } catch (error: any) {
      console.error('Error importing dashboard:', error);
      let errorMessage = 'Unknown error occurred';

      if (error.message) {
        errorMessage = error.message;
      } else if (typeof error === 'string') {
        errorMessage = error;
      }

      // Provide more specific error guidance
      if (errorMessage.includes('Access denied') || errorMessage.includes('403')) {
        errorMessage += ' - Please verify your grant key has the necessary permissions.';
      } else if (errorMessage.includes('404')) {
        errorMessage += ' - Please check the organization ID and API endpoint.';
      } else if (errorMessage.includes('Network') || errorMessage.includes('fetch')) {
        errorMessage += ' - Please check your internet connection and try again.';
      }

      showToast(`Failed to import dashboard: ${errorMessage}`, 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold mb-4">Import Dashboard</h2>
        <p className="text-gray-600 mb-4">
          Import a previously exported dashboard into your JobTread organization.
        </p>
      </div>

      <form onSubmit={handleImportDashboard} className="space-y-4">
        <FormField
          label="Grant Key"
          type="password"
          value={grantKey}
          onChange={setGrantKey}
          placeholder="Enter your JobTread API Grant Key"
          required
          helpText="The API Grant Key for the target organization"
        />

        <FormField
          label="Organization ID"
          type="text"
          value={organizationId}
          onChange={setOrganizationId}
          placeholder="Enter your Organization ID"
          required
          helpText="The ID of the organization where the dashboard will be imported"
        />

        <div className="space-y-1">
          <label className="block text-sm font-medium text-gray-700">
            Dashboard File
          </label>
          <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
            <div className="space-y-1 text-center">
              <Upload className="mx-auto h-12 w-12 text-gray-400" />
              <div className="flex text-sm text-gray-600">
                <label htmlFor="file-upload" className="relative cursor-pointer bg-white rounded-md font-medium text-blue-600 hover:text-blue-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-blue-500">
                  <span>Upload a dashboard JSON file</span>
                  <input
                    id="file-upload"
                    name="file-upload"
                    type="file"
                    className="sr-only"
                    accept=".json"
                    onChange={handleFileChange}
                  />
                </label>
                <p className="pl-1">or drag and drop</p>
              </div>
              <p className="text-xs text-gray-500">
                JSON files only
              </p>
            </div>
          </div>
          {dashboardFile && (
            <p className="text-sm text-green-600">
              Selected file: {dashboardFile.name}
            </p>
          )}
        </div>

        {fileData && (
          <FormField
            label="Dashboard Name"
            type="text"
            value={newDashboardName}
            onChange={setNewDashboardName}
            placeholder="Enter new dashboard name (optional)"
            helpText="Leave blank to use the original name"
          />
        )}

        <Button
          type="submit"
          disabled={!grantKey || !organizationId || !dashboardFile || loading}
          isLoading={loading}
          variant="primary"
          icon={<ArrowUpFromLine className="h-4 w-4" />}
        >
          Import Dashboard
        </Button>
      </form>
    </div>
  );
};