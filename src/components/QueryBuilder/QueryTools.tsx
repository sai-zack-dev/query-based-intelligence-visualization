import { useState } from "react";
import TabSwitcher from "../common/TabSwithcher";
import { AiPanel } from "./main/AiPanel";

export const QueryTools = () => {
  const [activeTab, setActiveTab] = useState<"ai" | "manual">("manual");

  return (
    <div className="mr-6 p-4 pt-3 rounded-xl bg-white shadow flex-grow transition-all duration-300">
      {/* Header with tab switcher */}
      <div className="flex items-center justify-between border-b border-gray-200 pb-3 ">
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
        <AiPanel />
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
