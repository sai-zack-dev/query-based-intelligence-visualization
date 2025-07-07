import React, { useState } from "react";
import TabSwitcher from "../common/TabSwithcher";

export const QueryTools = () => {
  const [activeTab, setActiveTab] = useState<"ai" | "manual">("manual");

  return (
    <div className="p-6 pt-3 mr-6 rounded-xl bg-white shadow flex-grow transition-all duration-300">
      <div className="flex items-center justify-between mb-4 border-b pb-3 border-gray-200">
        <h2 className="font-semibold text-gray-800">Query Tools</h2>
        <TabSwitcher
          tabs={[
            { id: "ai", label: "AI Assistant" },
            { id: "manual", label: "Manual Builder" },
          ]}
          defaultTabId="manual"
          onTabChange={(tabId) => setActiveTab(tabId as "ai" | "manual")}
        />
      </div>

      {/* Render based on selected tab */}
      {activeTab === "ai" && (
        <div className="text-sm">
          {/* Replace with real AI Chat UI */}
          🤖 AI Assistant Chat UI Goes Here...
        </div>
      )}

      {activeTab === "manual" && (
        <div className="text-sm">
          {/* Replace with real manual query builder UI */}
          📝 Manual Query Builder UI Goes Here...
        </div>
      )}
    </div>
  );
};
