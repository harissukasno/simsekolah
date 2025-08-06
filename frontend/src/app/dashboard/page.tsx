// app/dashboard/page.tsx
import dynamic from 'next/dynamic';

const DynamicDashboardClient = dynamic(() => import('./DashboardClient').then(mod => mod.DashboardClient), {
  ssr: false,
});

export default DynamicDashboardClient;
