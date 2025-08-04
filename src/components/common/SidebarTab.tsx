import React from 'react';

interface SidebarTabProps {
  tab: {
    id: string;
    icon: React.ComponentType<{ size: number }>;
    activeIcon: React.ComponentType<{ size: number }>;
  };
  isActive: boolean;
  onSelect: (tabId: string) => void;
  isDisabled: boolean;
}

const SidebarTab: React.FC<SidebarTabProps> = ({ tab, isActive, onSelect, isDisabled }) => {
  const Icon = isActive ? tab.activeIcon : tab.icon;
  
  return (
    <button
      onClick={() => onSelect(tab.id)}
      className={`p-3.5 transition-colors duration-200 hover:bg-gray-50 rounded-e-xl ${isDisabled && 'opacity-50'} ${
        isActive ? 'border-l-4 border-blue-500 text-blue-500' : 'text-gray-600'
      }`}
      aria-pressed={isActive}
      disabled={isDisabled}
    >
      <Icon size={17} />
    </button>
  );
};

export default SidebarTab;