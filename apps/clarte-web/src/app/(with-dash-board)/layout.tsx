import Sidebar from '@/components/layouts/sidebar/Sidebar';
import NavBar from '@/components/layouts/navbar/NavBar';
import { ReactNode } from 'react';

interface DashboardLayoutProps {
  children?: ReactNode;
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  return (
    /* this contianer, should be flex-row, and it's childer should take all cross-axis space, unless got an explicite height  */
    <div className="flex-1 flex items-stretch">
      <div>
        <Sidebar /> {/* This should have a fix width, with flex-1 height  */}
      </div>
      <div className="flex-1">{children}</div>
    </div>
  );
}
