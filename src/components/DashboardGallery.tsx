import React, { useState } from 'react';
import { Download, Eye, Grid, List, Tag, Users, Upload } from 'lucide-react';
import { Button } from './Button';
import { ImagePreviewModal } from './ImagePreviewModal';
import { useToast } from '../hooks/useToast';
import { importDashboard } from '../services/api';
import { dashboardTemplates, DashboardTemplate } from '../data/dashboardTemplates';

interface DashboardGalleryProps {
  connectionState?: {
    isConnected: boolean;
    grantKey?: string;
    organization?: { id: string; name: string };
  };
}

export const DashboardGallery: React.FC<DashboardGalleryProps> = ({ connectionState }) => {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [previewModal, setPreviewModal] = useState<{
    isOpen: boolean;
    template: DashboardTemplate | null;
  }>({ isOpen: false, template: null });
  const [importingTemplate, setImportingTemplate] = useState<string | null>(null);
  const { showToast } = useToast();

  const categories = ['all', ...Array.from(new Set(dashboardTemplates.map(d => d.category)))];

  const filteredDashboards = selectedCategory === 'all'
    ? dashboardTemplates
    : dashboardTemplates.filter(d => d.category === selectedCategory);

  const downloadDashboard = async (template: DashboardTemplate) => {
    try {
      showToast('Downloading dashboard...', 'info');

      // Fetch the JSON file from the public directory
      const response = await fetch(template.jsonFile);
      if (!response.ok) {
        throw new Error('Failed to fetch dashboard file');
      }

      const dashboardData = await response.json();

      // Create download
      const dataStr = JSON.stringify(dashboardData, null, 2);
      const dataBlob = new Blob([dataStr], { type: 'application/json' });
      const url = URL.createObjectURL(dataBlob);

      const link = document.createElement('a');
      link.href = url;
      link.download = `${template.name.replace(/\s+/g, '_')}_dashboard_export.json`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      showToast(`${template.name} downloaded successfully!`, 'success');
    } catch (error: any) {
      console.error('Error downloading dashboard:', error);
      showToast(`Failed to download dashboard: ${error.message}`, 'error');
    }
  };

  const previewDashboard = (template: DashboardTemplate) => {
    setPreviewModal({ isOpen: true, template });
  };

  const closePreviewModal = () => {
    setPreviewModal({ isOpen: false, template: null });
  };

  const importTemplate = async (template: DashboardTemplate) => {
    if (!connectionState?.isConnected || !connectionState.grantKey || !connectionState.organization) {
      showToast('Please connect to JobTread first to import dashboards', 'error');
      return;
    }

    setImportingTemplate(template.id);
    try {
      showToast('Fetching dashboard template...', 'info');

      // Fetch the JSON file from the public directory
      const response = await fetch(template.jsonFile);
      if (!response.ok) {
        throw new Error('Failed to fetch dashboard template');
      }

      const dashboardData = await response.json();

      // Import the dashboard
      const result = await importDashboard(
        connectionState.grantKey,
        connectionState.organization.id,
        dashboardData
      );

      showToast(`Dashboard "${result.name}" imported successfully into ${connectionState.organization.name}!`, 'success');
    } catch (error: any) {
      console.error('Error importing dashboard:', error);
      showToast(`Failed to import dashboard: ${error.message}`, 'error');
    } finally {
      setImportingTemplate(null);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-white">Dashboard Templates</h2>
          <p className="text-gray-300 mt-1">
            {connectionState?.isConnected
              ? `Import dashboards directly into ${connectionState.organization?.name || 'your organization'} or download for later use`
              : 'Download pre-built dashboard templates to get started quickly'
            }
          </p>
          {connectionState?.isConnected && (
            <div className="flex items-center mt-2 text-sm text-green-400">
              <Upload className="h-4 w-4 mr-1" />
              <span>Connected - Import available</span>
            </div>
          )}
        </div>

        <div className="flex items-center gap-2">
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="px-3 py-2 bg-gray-700 border border-gray-600 text-white rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-gray-400"
          >
            {categories.map(category => (
              <option key={category} value={category} className="bg-gray-700">
                {category === 'all' ? 'All Categories' : category}
              </option>
            ))}
          </select>

          <div className="flex border border-gray-600 rounded-md">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-2 ${viewMode === 'grid' ? 'bg-gray-300 text-gray-800' : 'bg-gray-700 text-gray-300 hover:text-white'}`}
            >
              <Grid className="h-4 w-4" />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-2 ${viewMode === 'list' ? 'bg-gray-300 text-gray-800' : 'bg-gray-700 text-gray-300 hover:text-white'}`}
            >
              <List className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>

      <div className={viewMode === 'grid'
        ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6'
        : 'space-y-4'
      }>
        {filteredDashboards.map((template) => (
          <div
            key={template.id}
            className={`bg-gray-700 rounded-lg border border-gray-600 shadow-lg hover:shadow-xl transition-all duration-200 hover:border-gray-500 ${
              viewMode === 'list' ? 'flex gap-4 p-4' : 'overflow-hidden'
            }`}
          >
            <div className={viewMode === 'list' ? 'flex-shrink-0' : ''}>
              <img
                src={template.imageUrl}
                alt={template.name}
                className={`object-cover transition-transform hover:scale-105 ${
                  viewMode === 'list'
                    ? 'w-32 h-24 rounded-md'
                    : 'w-full h-48'
                }`}
                loading="lazy"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzIwIiBoZWlnaHQ9IjI0MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZjNmNGY2Ii8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIxNCIgZmlsbD0iIzk5YTNhZiIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPkRhc2hib2FyZCBQcmV2aWV3PC90ZXh0Pjwvc3ZnPg==';
                }}
              />
            </div>

            <div className={`${viewMode === 'list' ? 'flex-1' : 'p-3 sm:p-4'}`}>
              <div className="flex items-start justify-between mb-2">
                <h3 className="text-base sm:text-lg font-semibold text-white pr-2">{template.name}</h3>
                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-600 text-gray-200 flex-shrink-0">
                  <Tag className="h-3 w-3 mr-1" />
                  {template.category}
                </span>
              </div>

              <p className="text-gray-300 text-sm mb-3 line-clamp-2">
                {template.description}
              </p>

              <div className="flex items-center gap-4 text-sm text-gray-400 mb-3">
                <span className="flex items-center">
                  <Grid className="h-4 w-4 mr-1" />
                  {template.tiles} tiles
                </span>
              </div>

              <div className="flex flex-wrap gap-1 mb-4">
                {template.features.slice(0, 3).map((feature, index) => (
                  <span
                    key={index}
                    className="inline-block px-2 py-1 bg-gray-600 text-gray-200 text-xs rounded"
                  >
                    {feature}
                  </span>
                ))}
                {template.features.length > 3 && (
                  <span className="inline-block px-2 py-1 bg-gray-600 text-gray-200 text-xs rounded">
                    +{template.features.length - 3} more
                  </span>
                )}
              </div>

              <div className="flex flex-wrap gap-1 sm:gap-2">
                <Button
                  onClick={() => previewDashboard(template)}
                  variant="secondary"
                  size="sm"
                  icon={<Eye className="h-4 w-4" />}
                >
                  Preview
                </Button>
                {connectionState?.isConnected ? (
                  <Button
                    onClick={() => importTemplate(template)}
                    disabled={importingTemplate === template.id}
                    isLoading={importingTemplate === template.id}
                    variant="primary"
                    size="sm"
                    icon={<Upload className="h-4 w-4" />}
                  >
                    Import
                  </Button>
                ) : (
                  <Button
                    onClick={() => downloadDashboard(template)}
                    variant="primary"
                    size="sm"
                    icon={<Download className="h-4 w-4" />}
                  >
                    Download
                  </Button>
                )}
                {connectionState?.isConnected && (
                  <Button
                    onClick={() => downloadDashboard(template)}
                    variant="outline"
                    size="sm"
                    icon={<Download className="h-4 w-4" />}
                  >
                    Download
                  </Button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredDashboards.length === 0 && (
        <div className="text-center py-12">
          <Grid className="h-12 w-12 text-gray-500 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-white mb-2">No dashboards found</h3>
          <p className="text-gray-400">Try selecting a different category</p>
        </div>
      )}

      {/* Image Preview Modal */}
      <ImagePreviewModal
        isOpen={previewModal.isOpen}
        onClose={closePreviewModal}
        imageUrl={previewModal.template?.highResImageUrl || ''}
        title={previewModal.template?.name || ''}
        downloadName={previewModal.template?.name ? `${previewModal.template.name.replace(/\s+/g, '_')}_preview.webp` : undefined}
      />
    </div>
  );
};
