import { BrowserRouter, Routes, Route } from "react-router-dom";
import DataConnectionPage from "./pages/DataConnectionPage";
import QueryBuilderPage from "./pages/QueryBuilderPage";
import ChartGenerationPage from "./pages/ChartGenerationPage";
import DashboardPage from "./pages/DashboardsPage";
import MainLayout from "./pages/MainLayout";

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
