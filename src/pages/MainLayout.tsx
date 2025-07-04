import React from 'react';
import { useSidebarToggle } from '../hooks/useSidebarToggle';
import { Navbar } from '../components/common/Navbar';
import { SidebarData } from '../types/sidebar';

interface MainLayoutProps {
  children: React.ReactElement;
}

const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  const { sidebarActive, toggleSidebar } = useSidebarToggle();

  const sidebarData: SidebarData = {
    sidebarActive,
    toggleSidebar
  };

  return (
    <div className="bg">
      <Navbar />
      {React.cloneElement(children, sidebarData)}
    </div>
  );
};

export default MainLayout;
