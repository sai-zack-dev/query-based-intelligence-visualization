import React from 'react'
import ReactDOM from 'react-dom/client'
import './index.css'
import { BrowserRouter, Routes, Route } from "react-router-dom";
import DataConnectionPage from "./pages/DataConnectionPage";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<DataConnectionPage />} />
        {/* Future: <Route path="/query" element={<QueryBuilderPage />} /> */}
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
);

// Use contextBridge
// window.ipcRenderer.on('main-process-message', (_event, message) => {
//   console.log(message)
// })