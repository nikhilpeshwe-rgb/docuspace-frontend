import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import ProtectedRoute from "../auth/ProtectedRoute";
import LoginPage from "../features/auth/LoginPage";
import RegisterPage from "../features/auth/RegisterPage";
import DocumentPage from "../features/documents/DocumentPage";
import WorkspaceDetailsPage from "../features/workspace/WorkspaceDetailsPage";
import DashboardPage from "../pages/DashboardPage";
import SearchPage from "../features/search/SearchPage";

const AppRouter = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />

        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <DashboardPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/workspaces/:id"
          element={
            <ProtectedRoute>
              <WorkspaceDetailsPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/documents/:id"
          element={
            <ProtectedRoute>
              <DocumentPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/search"
          element={
            <ProtectedRoute>
              <SearchPage />
            </ProtectedRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
};

export default AppRouter;