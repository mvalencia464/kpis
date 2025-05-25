import { Dashboard, DashboardDetails } from '../types/dashboard';

const API_ENDPOINT = import.meta.env.DEV
  ? '/api/pave'
  : 'https://api.jobtread.com/pave';
const API_TIMEOUT = 30000; // 30 seconds timeout

/**
 * Makes a request to the JobTread Pave API with CORS fallback
 */
async function makeApiRequest(grantKey: string, query: any, retries: number = 2) {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), API_TIMEOUT);

  try {
    // Log the query for debugging in development
    if (import.meta.env.DEV) {
      console.log('API Query:', JSON.stringify(query, null, 2));
    }

    const response = await fetch(API_ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${grantKey}`
      },
      body: JSON.stringify({ query }),
      signal: controller.signal
    });

    // Log response details for debugging
    if (import.meta.env.DEV) {
      console.log('API Response Status:', response.status);
      console.log('API Response Headers:', Object.fromEntries(response.headers.entries()));
    }

    if (!response.ok) {
      let errorMessage = `API request failed (${response.status})`;

      try {
        const errorText = await response.text();
        if (errorText) {
          errorMessage += `: ${errorText}`;
        }
      } catch (e) {
        // If we can't read the error text, use the status code
      }

      if (response.status === 401 || response.status === 403) {
        throw new Error('Access denied. Please check your grant key and try again.');
      }
      if (response.status === 404) {
        throw new Error('API endpoint not found. Please check the API URL.');
      }
      if (response.status >= 500 && retries > 0) {
        // Retry on server errors
        console.log(`Server error (${response.status}), retrying... (${retries} retries left)`);
        await new Promise(resolve => setTimeout(resolve, 1000)); // Wait 1 second
        return makeApiRequest(grantKey, query, retries - 1);
      }

      throw new Error(errorMessage);
    }

    const data = await response.json();

    // Log response data for debugging
    if (import.meta.env.DEV) {
      console.log('API Response Data:', data);
    }

    if (data.errors) {
      const errorMessage = Array.isArray(data.errors)
        ? data.errors.map((e: any) => e.message || JSON.stringify(e)).join(', ')
        : JSON.stringify(data.errors);
      throw new Error(`API returned errors: ${errorMessage}`);
    }

    // Handle different response structures
    if (data.data) {
      return data.data;
    } else if (data.organization || data.dashboard || data.createDashboard || data.currentGrant) {
      // Direct response without data wrapper
      return data;
    } else {
      throw new Error('API response missing expected data structure');
    }
  } catch (error) {
    if (error instanceof Error) {
      if (error.name === 'AbortError') {
        throw new Error('Request timed out. Please try again.');
      }

      // Handle CORS and network errors
      if (error.message.includes('Failed to fetch') ||
          error.message.includes('NetworkError') ||
          error.message.includes('CORS') ||
          error.message.includes('blocked by CORS policy')) {

        if (retries > 0) {
          console.log(`Network/CORS error, retrying... (${retries} retries left)`);
          await new Promise(resolve => setTimeout(resolve, 1000)); // Wait 1 second
          return makeApiRequest(grantKey, query, retries - 1);
        }

        // Provide specific CORS guidance
        const corsMessage = import.meta.env.DEV
          ? 'CORS Error: The API server is not allowing requests from this origin. This is a common issue in development. Try using a browser extension to disable CORS, or contact the API provider to whitelist your domain.'
          : 'Unable to connect to the API. Please check your network connection and try again.';

        throw new Error(corsMessage);
      }
      throw error;
    }
    throw new Error('An unexpected error occurred');
  } finally {
    clearTimeout(timeoutId);
  }
}

/**
 * Fetches the list of dashboards for an organization
 */
export async function fetchOrganizationDashboards(grantKey: string, organizationId: string): Promise<Dashboard[]> {
  const query = {
    $: { grantKey },
    organization: {
      $: { id: organizationId },
      id: {},
      name: {},
      dashboards: {
        nodes: {
          id: {},
          name: {},
          type: {}
        }
      }
    }
  };

  try {
    const data = await makeApiRequest(grantKey, query);
    return data.organization.dashboards.nodes;
  } catch (error) {
    console.error('Error fetching dashboards:', error);
    throw error;
  }
}

/**
 * Fetches detailed information about a specific dashboard
 */
export async function fetchDashboardDetails(grantKey: string, dashboardId: string): Promise<DashboardDetails> {
  const query = {
    $: { grantKey },
    dashboard: {
      $: { id: dashboardId },
      id: {},
      name: {},
      type: {},
      roles: {
        nodes: {
          id: {}
        }
      },
      tiles: {
        nodes: {
          height: {},
          width: {},
          x: {},
          y: {},
          options: {}
        }
      }
    }
  };

  try {
    const data = await makeApiRequest(grantKey, query);
    return data.dashboard;
  } catch (error) {
    console.error('Error fetching dashboard details:', error);
    throw error;
  }
}

/**
 * Validates dashboard data before import
 */
function validateDashboardData(dashboardData: any): void {
  if (!dashboardData) {
    throw new Error('Dashboard data is required');
  }

  if (!dashboardData.name || typeof dashboardData.name !== 'string') {
    throw new Error('Dashboard name is required and must be a string');
  }

  if (!dashboardData.type || typeof dashboardData.type !== 'string') {
    throw new Error('Dashboard type is required and must be a string');
  }

  if (!Array.isArray(dashboardData.tiles)) {
    throw new Error('Dashboard tiles must be an array');
  }

  // Validate each tile
  dashboardData.tiles.forEach((tile: any, index: number) => {
    if (typeof tile.height !== 'number' || tile.height <= 0) {
      throw new Error(`Tile ${index + 1}: height must be a positive number`);
    }
    if (typeof tile.width !== 'number' || tile.width <= 0) {
      throw new Error(`Tile ${index + 1}: width must be a positive number`);
    }
    if (typeof tile.x !== 'number' || tile.x < 0) {
      throw new Error(`Tile ${index + 1}: x position must be a non-negative number`);
    }
    if (typeof tile.y !== 'number' || tile.y < 0) {
      throw new Error(`Tile ${index + 1}: y position must be a non-negative number`);
    }
    if (!tile.options || typeof tile.options !== 'object') {
      throw new Error(`Tile ${index + 1}: options must be an object`);
    }
    if (!tile.options.type || typeof tile.options.type !== 'string') {
      throw new Error(`Tile ${index + 1}: options must include a 'type' field`);
    }
  });
}

/**
 * Imports a dashboard into the specified organization
 */
export async function importDashboard(grantKey: string, organizationId: string, dashboardData: any) {
  // Validate the dashboard data first
  validateDashboardData(dashboardData);

  const tiles = dashboardData.tiles.map((tile: any) => ({
    height: tile.height,
    width: tile.width,
    x: tile.x,
    y: tile.y,
    options: tile.options
  }));

  // Extract role IDs from the dashboard data, or use empty array as default
  const visibleToRoleIds = dashboardData.roles && Array.isArray(dashboardData.roles)
    ? dashboardData.roles.map((role: any) => role.id).filter(Boolean)
    : [];

  const query = {
    $: { grantKey },
    createDashboard: {
      $: {
        organizationId,
        name: dashboardData.name,
        type: dashboardData.type,
        tiles,
        visibleToRoleIds
      },
      createdDashboard: {
        id: {},
        name: {},
        type: {},
        organization: {
          id: {}
        },
        tiles: {
          nodes: {
            id: {}
          }
        }
      }
    }
  };

  try {
    const data = await makeApiRequest(grantKey, query);

    if (!data.createDashboard || !data.createDashboard.createdDashboard) {
      throw new Error('Invalid response from API: missing created dashboard data');
    }

    return data.createDashboard.createdDashboard;
  } catch (error) {
    console.error('Error importing dashboard:', error);
    throw error;
  }
}

/**
 * Fetches the memberships to find organization IDs
 */
export async function fetchOrganizationIds(grantKey: string) {
  const query = {
    $: { grantKey },
    currentGrant: {
      user: {
        memberships: {
          nodes: {
            organization: {
              id: {},
              name: {}
            }
          }
        }
      }
    }
  };

  try {
    const data = await makeApiRequest(grantKey, query);
    return data.currentGrant.user.memberships.nodes.map((node: any) => ({
      id: node.organization.id,
      name: node.organization.name
    }));
  } catch (error) {
    console.error('Error fetching organization IDs:', error);
    throw error;
  }
}

/**
 * Deletes a dashboard by ID
 */
export async function deleteDashboard(grantKey: string, dashboardId: string) {
  const query = {
    $: { grantKey },
    deleteDashboard: {
      $: {
        id: dashboardId
      }
    }
  };

  try {
    // For delete operations, we'll use the direct API call approach
    const response = await fetch('/api/pave', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${grantKey}`
      },
      body: JSON.stringify({ query })
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(`Delete failed: ${response.status} ${response.statusText}`);
    }

    if (data.errors && data.errors.length > 0) {
      const errorMessage = data.errors.map((e: any) => e.message || JSON.stringify(e)).join(', ');
      throw new Error(`Delete failed: ${errorMessage}`);
    }

    return data;
  } catch (error) {
    console.error('Error deleting dashboard:', error);
    throw error;
  }
}

/**
 * Exports a dashboard by ID
 */
export async function exportDashboard(grantKey: string, organizationId: string, dashboardId: string) {
  const query = {
    $: { grantKey },
    organization: {
      $: { id: organizationId },
      dashboard: {
        $: { id: dashboardId },
        id: {},
        name: {},
        type: {},
        tiles: {
          nodes: {
            id: {},
            name: {},
            type: {},
            position: {
              x: {},
              y: {},
              width: {},
              height: {}
            },
            config: {}
          }
        }
      }
    }
  };

  try {
    const data = await makeApiRequest(grantKey, query);
    return data.organization.dashboard;
  } catch (error) {
    console.error('Error exporting dashboard:', error);
    throw error;
  }
}