import { Routes, Route } from "react-router-dom";
import DataConnectionPage from "@/screen/DataConnectionPage";
import QueryBuilderPage from "@/screen/QueryBuilderPage";
import ChartGenerationPage from "@/screen/ChartGenerationPage";
import DashboardPage from "@/screen/DashboardsPage";
import MainLayout from "@/screen/MainLayout";

const App = () => (
  <Routes>
    <Route
      path="/"
      element={
        <MainLayout>
          <DataConnectionPage sidebarActive={false} toggleSidebar={() => {}} />
        </MainLayout>
      }
    />
    <Route
      path="/query"
      element={
        <MainLayout>
          <QueryBuilderPage sidebarActive={false} toggleSidebar={() => {}} />
        </MainLayout>
      }
    />
    <Route
      path="/chart"
      element={
        <MainLayout>
          <ChartGenerationPage sidebarActive={false} toggleSidebar={() => {}} />
        </MainLayout>
      }
    />
    <Route path="/dashboard" element={<DashboardPage />} />
    <Route path="/dashboard/:dashboardId" element={<DashboardPage />} />
  </Routes>
);

export default App;
