export interface DashboardTemplate {
  id: string;
  name: string;
  description: string;
  imageUrl: string;
  highResImageUrl: string; // Full resolution image for preview modal
  jsonFile: string;
  category: string;
  tiles: number;
  features: string[];
}

export const dashboardTemplates: DashboardTemplate[] = [
  {
    id: 'main-dashboard',
    name: 'Main Dashboard',
    description: 'A comprehensive overview dashboard with customer metrics, proposals, and contract tracking. Perfect for getting a high-level view of your business performance.',
    imageUrl: 'https://images.leadconnectorhq.com/image/f_webp/q_95/r_1200/u_https://storage.googleapis.com/msgsndr/tV8qFLdWkBLBfjh64cFV/media/683277fbcc104c7e28e92d14.webp',
    highResImageUrl: 'https://storage.googleapis.com/msgsndr/tV8qFLdWkBLBfjh64cFV/media/683277fbcc104c7e28e92d14.webp',
    jsonFile: '/dashboards/Main_Dashboard_dashboard_export.json',
    category: 'Business Overview',
    tiles: 7,
    features: [
      'Customer tracking',
      'Proposal metrics',
      'Contract analytics',
      'Activity feed',
      'Action items'
    ]
  },
  {
    id: 'financial-dashboard',
    name: 'Financial Dashboard',
    description: 'Track your financial performance with revenue metrics, profit analysis, and financial KPIs. Essential for monitoring business financial health.',
    imageUrl: 'https://images.leadconnectorhq.com/image/f_webp/q_95/r_1200/u_https://storage.googleapis.com/msgsndr/tV8qFLdWkBLBfjh64cFV/media/683277fb0eaa6e20364f2699.webp',
    highResImageUrl: 'https://storage.googleapis.com/msgsndr/tV8qFLdWkBLBfjh64cFV/media/683277fb0eaa6e20364f2699.webp',
    jsonFile: '/dashboards/Financial_Dashboard_dashboard_export.json',
    category: 'Finance',
    tiles: 8,
    features: [
      'Revenue tracking',
      'Profit analysis',
      'Financial KPIs',
      'Budget monitoring',
      'Cost analysis'
    ]
  },
  {
    id: 'performance-dashboard',
    name: 'Performance Dashboard',
    description: 'Monitor team and business performance with key metrics, productivity indicators, and performance trends. Great for management oversight.',
    imageUrl: 'https://images.leadconnectorhq.com/image/f_webp/q_95/r_1200/u_https://storage.googleapis.com/msgsndr/tV8qFLdWkBLBfjh64cFV/media/683277fbcc104cd60ce92d13.webp',
    highResImageUrl: 'https://storage.googleapis.com/msgsndr/tV8qFLdWkBLBfjh64cFV/media/683277fbcc104cd60ce92d13.webp',
    jsonFile: '/dashboards/Performance_Dashboard_dashboard_export.json',
    category: 'Performance',
    tiles: 6,
    features: [
      'Performance metrics',
      'Team productivity',
      'Trend analysis',
      'Goal tracking',
      'Efficiency indicators'
    ]
  },
  {
    id: 'project-management-dashboard',
    name: 'Project Management Dashboard',
    description: 'Comprehensive project tracking with task management, timeline monitoring, and resource allocation. Perfect for project managers and teams.',
    imageUrl: 'https://images.leadconnectorhq.com/image/f_webp/q_95/r_1200/u_https://storage.googleapis.com/msgsndr/tV8qFLdWkBLBfjh64cFV/media/683277fb67aaab6a72f2254c.webp',
    highResImageUrl: 'https://storage.googleapis.com/msgsndr/tV8qFLdWkBLBfjh64cFV/media/683277fb67aaab6a72f2254c.webp',
    jsonFile: '/dashboards/Project_Management_Dashboard_dashboard_export.json',
    category: 'Project Management',
    tiles: 9,
    features: [
      'Project tracking',
      'Task management',
      'Timeline monitoring',
      'Resource allocation',
      'Progress indicators'
    ]
  }
];
