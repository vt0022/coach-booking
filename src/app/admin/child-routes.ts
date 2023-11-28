export const childRoutes = [
  {
    path: 'dashboard',
    loadChildren: () =>
      import('./dashboard/dashboard.module').then((m) => m.DashboardModule),
    data: { icon: 'dashboard', text: 'Dashboard' },
  },
  {
    path: 'tables',
    loadChildren: () =>
      import('./tables/tables.module').then((m) => m.TablesModule),
    data: { icon: 'table_chart', text: 'Tables' },
  },
  {
    path: 'export-line',
    loadChildren: () =>
      import('./export-line/export-line.module').then(
        (m) => m.ExportLineModule
      ),
    data: { icon: 'cloud upload icon', text: 'Xuất chuyến xe' },
  },
];
