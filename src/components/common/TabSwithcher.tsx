import React, { useState } from "react";
import { motion } from "framer-motion";

interface Tab {
  id: string;
  label: string;
}

interface TabSwitcherProps {
  tabs: Tab[];
  defaultTabId?: string;
  onTabChange?: (tabId: string) => void;
}

const TabSwitcher: React.FC<TabSwitcherProps> = ({
  tabs,
  defaultTabId,
  onTabChange,
}) => {
  const [activeTab, setActiveTab] = useState(defaultTabId || tabs[0]?.id);

  const handleTabClick = (tabId: string) => {
    setActiveTab(tabId);
    onTabChange?.(tabId);
  };

  return (
    <div className="relative flex gap-1 bg-white rounded-lg border border-gray-100 shadow w-[200px] lg:w-[300px]">
      <motion.div
        layout
        transition={{ type: "spring", stiffness: 500, damping: 30 }}
        className="absolute top-0 bottom-0 rounded-lg z-0  bg-gray-50 shadow-[inset_0_0_5px_0_#3B82F6] text-blue-500"
        style={{ width: `${100 / tabs.length}%`, left: `${tabs.findIndex(t => t.id === activeTab) * (100 / tabs.length)}%` }}
      />

      {tabs.map((tab) => (
        <button
          key={tab.id}
          onClick={() => handleTabClick(tab.id)}
          className={`relative z-10 py-2 text-xs transition duration-200 ${
            activeTab === tab.id
              ? "text-blue-500 font-semibold"
              : "text-gray-500 hover:text-black"
          }`}
          style={{ width: `${100 / tabs.length}%` }}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
};

export default TabSwitcher;
