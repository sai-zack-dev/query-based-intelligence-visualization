import { BrowserRouter, Routes, Route } from "react-router-dom";
import DataConnectionPage from "@/screen/DataConnectionPage";
import QueryBuilderPage from "@/screen/QueryBuilderPage";
import ChartGenerationPage from "@/screen/ChartGenerationPage";
import DashboardPage from "@/screen/DashboardsPage";
import MainLayout from "@/screen/MainLayout";

const App = () => (
  <BrowserRouter>
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
      <Route path="/chart" element={<ChartGenerationPage />} />
      <Route path="/dashboard" element={<DashboardPage />} />
    </Routes>
  </BrowserRouter>
);

export default App;
