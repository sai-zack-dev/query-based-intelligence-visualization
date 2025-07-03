import { useState } from "react";

export const useSidebarToggle = () => {
  const [sidebarActive, setSidebarActive] = useState(true);

  const toggleSidebar = () => {
    setSidebarActive((prev) => !prev);
  };

  return { sidebarActive, toggleSidebar };
};
