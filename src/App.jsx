import { BrowserRouter as Router, Routes, Route,Navigate } from "react-router-dom";
import { AuthProvider } from "./auth/AuthContext";
import PrivateRoute from "./auth/PrivateRoute";
import Layout from "./components/Layout";
import Login from "./components/Login";

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

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Public Routes */}
          <Route path="/login" element={<Login />} />
          <Route path="*" element={<h1> page not Fount  </h1>} />
          
          {/* Private Routes */}
          <Route element={<PrivateRoute />}>
            <Route element={<Layout />}> {/* Layout wraps all protected routes */}
              <Route index element={<Dashboard />} /> {/* Default route when path is / */}
              <Route path="dashboard" element={<Dashboard />} />
              <Route path="add-spa-job" element={<AddSpaJobForm />} />
              <Route path="/spas/addSpa" element={<AddSpaForm />} />
              <Route path="addSpa" element={<AddSpaForm />} />
              <Route path="users" element={<GetAllUser />} />
              <Route path="spas" element={<Spas />} />
              <Route path="jobs" element={<Jobs />} />
               <Route path="jobs" element={<EditSpaJobForm />} />
              <Route path="applications" element={<Applications />} />
              <Route path="messages" element={<Messages />} />
              <Route path="job/:id" element={<EditSpaJobForm />} />
              <Route path="/edit-spa/:id" element={<EditSpaForm />} />
              <Route path="/view-job/:id" element={<JobView />} />
              <Route path="*" element={<Dashboard/>} />
              
              {/* Nested routes for Spas */}
            </Route>
          </Route>

          {/* Fallback route for 404 */}
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
          
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;