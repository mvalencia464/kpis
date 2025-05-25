export interface Dashboard {
  id: string;
  name: string;
  type: string;
}

export interface DashboardTile {
  height: number;
  width: number;
  x: number;
  y: number;
  options: any; // JSON object for tile configuration
}

export interface DashboardRole {
  id: string;
}

export interface DashboardDetails {
  id: string;
  name: string;
  type: string;
  tiles: {
    nodes: DashboardTile[];
  };
  roles: {
    nodes: DashboardRole[];
  };
}

export interface DashboardExport {
  name: string;
  type: string;
  tiles: DashboardTile[];
  roles: DashboardRole[];
  exportedAt: string;
  sourceOrganizationId: string;
  exportVersion?: string;
}