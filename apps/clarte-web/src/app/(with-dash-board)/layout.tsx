import Sidebar from '@/components/layouts/sidebar/Sidebar';
import NavBar from '@/components/layouts/navbar/NavBar';
import { ReactNode } from 'react';

interface DashboardLayoutProps {
  children?: ReactNode;
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  return (
    <div className="flex">
      <NavBar />
      <Sidebar />
      {children}
    </div>
  );
}
