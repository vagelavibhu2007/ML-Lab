import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { MLProvider } from './context/MLContext';
import { MainLayout } from './components/layout/MainLayout';
import { Dashboard } from './pages/Dashboard';
import { Datasets } from './pages/Datasets';
import { ModelTraining } from './pages/ModelTraining';
import { Regression } from './pages/Regression';
import { Classification } from './pages/Classification';
import { ModelComparison } from './pages/ModelComparison';
import { ModelHistory } from './pages/ModelHistory';
import { SettingsPage } from './pages/Settings';

export function App() {
  return (
    <MLProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<MainLayout />}>
            <Route index element={<Dashboard />} />
            <Route path="datasets" element={<Datasets />} />
            <Route path="train" element={<ModelTraining />} />
            <Route path="regression" element={<Regression />} />
            <Route path="classification" element={<Classification />} />
            <Route path="comparison" element={<ModelComparison />} />
            <Route path="history" element={<ModelHistory />} />
            <Route path="settings" element={<SettingsPage />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </MLProvider>
  );
}

export default App;
