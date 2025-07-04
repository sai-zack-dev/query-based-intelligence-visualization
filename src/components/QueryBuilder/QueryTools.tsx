import TabSwitcher from "../common/TabSwithcher";

export const QueryTools = () => {
  return (
    <div className="p-6 pt-3 mx-0 sm:mx-6 rounded-xl bg-white shadow transition-all duration-300 w-full">
      <div className="flex items-center justify-between mb-4 border-b pb-3 border-gray-200">
        <h2 className="font-semibold text-gray-800">Query Tools</h2>
        <TabSwitcher
          tabs={[
            { id: "ai", label: "AI Assistant" },
            { id: "manual", label: "Manual Builder" },
          ]}
          defaultTabId="manual"
          onTabChange={(tabId) => console.log("Selected:", tabId)}
        />
      </div>
    </div>
  );
};
