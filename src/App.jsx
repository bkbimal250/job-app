import { Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./auth/AuthContext";
import PrivateRoute from "./auth/PrivateRoute";
import Layout from "./components/Layout";
import Login from "./components/Login";
import { useEffect } from "react";
import axios from "axios";

// Import all your components
import AddSpaJobForm from "./components/AddSpaJobForm";
import Dashboard from "./components/Dashboard";
import GetAllUser from "./components/GetAllUser";
import Spas from "./components/Spas";
import Jobs from "./components/Jobs";
import Applications from "./components/Applications";
import Messages from "./components/Messages";
import AddSpaForm from "./components/AddSpaForm";
import EditSpaForm from "./components/EditSpaForm";
import EditSpaJobForm from "./components/EditSpaJobForm";
import SpaView from "./components/SpaView";
import JobView from "./components/JobView";
import Viewprofile from "./components/Viewprofile";
import Editprofile from "./components/Editprofile";

function App() {
  useEffect(() => {
    axios.get(`${import.meta.env.VITE_API_BASE_URL}/site/visit`).catch(() => {});
  }, []);
  return (
    <AuthProvider>
      <Routes>
        {/* Public Routes */}
        <Route path="/login" element={<Login />} />
        <Route path="login" element={<Login />} />

        {/* Private Routes */}
        <Route element={<PrivateRoute />}>
          <Route element={<Layout />}>
            <Route index element={<Dashboard />} />
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="add-spa-job" element={<AddSpaJobForm />} />
            <Route path="/spas/addSpa" element={<AddSpaForm />} />
            <Route path="addSpa" element={<AddSpaForm />} />
            <Route path="users" element={<GetAllUser />} />
            <Route path="spas" element={<Spas />} />
            <Route path="jobs" element={<Jobs />} />
            <Route path="applications" element={<Applications />} />
            <Route path="messages" element={<Messages />} />
            <Route path="job/:id" element={<EditSpaJobForm />} />
            <Route path="/edit-spa/:id" element={<EditSpaForm />} />
            <Route path="/view-job/:id" element={<JobView />} />
            <Route path="/view-spa/:id" element={<SpaView />} />
            <Route path="/view-profile" element={<Viewprofile />} />
            <Route path="/edit-profile" element={<Editprofile />} />
            <Route path="*" element={<Dashboard />} />
          </Route>
        </Route>

        {/* Fallback route for 404 */}
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </AuthProvider>
  );
}

export default App;
