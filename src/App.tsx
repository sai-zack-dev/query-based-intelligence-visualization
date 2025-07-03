import { BrowserRouter, Routes, Route } from "react-router-dom";
import DataConnectionPage from "./pages/DataConnectionPage";
import QueryBuilderPage from "./pages/QueryBuilderPage";
import ChartGenerationPage from "./pages/ChartGenerationPage";
import DashboardPage from "./pages/DashboardsPage";

const App = () => (
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<DataConnectionPage />} />
      <Route path="/query" element={<QueryBuilderPage />} />
      <Route path="/chart" element={<ChartGenerationPage />} />
      <Route path="/dashboard" element={<DashboardPage />} />
    </Routes>
  </BrowserRouter>
);

export default App;
