import { useState } from "react";

/**
 * Hook to toggle sidebar open/close state.
 */
export const useSidebarToggle = () => {
  const [sidebarActive, setSidebarActive] = useState(true);

  const toggleSidebar = () => {
    setSidebarActive((prev) => !prev);
  };

  return { sidebarActive, toggleSidebar };
};
