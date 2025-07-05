import React from 'react';

interface SidebarTabProps {
  tab: {
    id: string;
    icon: React.ComponentType<{ size: number }>;
    activeIcon: React.ComponentType<{ size: number }>;
    label: string;
  };
  isActive: boolean;
  onSelect: (tabId: string) => void;
}

const SidebarTab: React.FC<SidebarTabProps> = ({ tab, isActive, onSelect }) => {
  const Icon = isActive ? tab.activeIcon : tab.icon;
  
  return (
    <button
      onClick={() => onSelect(tab.id)}
      className={`p-3.5 transition-colors duration-200 hover:bg-gray-50 rounded-e-xl ${
        isActive ? 'border-l-4 border-blue-500 text-blue-500' : 'text-gray-600'
      }`}
      aria-label={tab.label}
      aria-pressed={isActive}
    >
      <Icon size={17} />
    </button>
  );
};

export default SidebarTab;