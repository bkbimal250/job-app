// Main App Routes Component
import { Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "../auth/AuthContext";
import PrivateRoute from "../auth/PrivateRoute";
import Layout from "../components/Layout";
import Login from "../components/Login";

// Dashboard Pages
import { DashboardPage } from "../pages/dashboard";

// Job Pages
import { JobsListPage, AddJobPage, EditJobPage, JobViewPage } from "../pages/jobs";

// Spa Pages
import { SpasListPage, AddSpaPage, EditSpaPage, SpaViewPage } from "../pages/spas";

// User Pages
import { UsersListPage, UserViewPage, UserEditPage } from "../pages/users";

// Application Pages
import { ApplicationsListPage } from "../pages/applications";

// Message Pages
import { MessagesListPage } from "../pages/messages";

// Subscriber Pages
import { SubscribersListPage } from "../pages/subscribers";

function AppRoutes() {
  return (
    <AuthProvider>
      <Routes>
        {/* Public Routes */}
        <Route path="/login" element={<Login />} />
        <Route path="login" element={<Login />} />

        {/* Private Routes */}
        <Route element={<PrivateRoute />}>
          <Route element={<Layout />}>
            {/* Dashboard */}
            <Route index element={<DashboardPage />} />
            <Route path="dashboard" element={<DashboardPage />} />

            {/* Jobs */}
            <Route path="jobs" element={<JobsListPage />} />
            <Route path="add-spa-job" element={<AddJobPage />} />
            <Route path="job/:id" element={<EditJobPage />} />
            <Route path="/view-job/:id" element={<JobViewPage />} />

            {/* Spas */}
            <Route path="spas" element={<SpasListPage />} />
            <Route path="/spas/addSpa" element={<AddSpaPage />} />
            <Route path="addSpa" element={<AddSpaPage />} />
            <Route path="/edit-spa/:id" element={<EditSpaPage />} />
            <Route path="/view-spa/:id" element={<SpaViewPage />} />

            {/* Users */}
            <Route path="users" element={<UsersListPage />} />
            <Route path="/view-profile" element={<UserViewPage />} />
            <Route path="/edit-profile" element={<UserEditPage />} />

            {/* Applications */}
            <Route path="applications" element={<ApplicationsListPage />} />

            {/* Messages */}
            <Route path="messages" element={<MessagesListPage />} />

            {/* Subscribers */}
            <Route path="/suscribers" element={<SubscribersListPage />} />
            <Route path="subscribers" element={<SubscribersListPage />} />

            {/* Fallback */}
            <Route path="*" element={<DashboardPage />} />
          </Route>
        </Route>

        {/* Fallback route for 404 */}
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </AuthProvider>
  );
}

export default AppRoutes;

