import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./auth/AuthContext";
// import PrivateRoute from "./auth/PrivateRoute";

import Layout from "./components/Layout";
import Dashboard from "./components/Dashboard";
import GetAllUSer from "./components/GetAllUser";
import Spas from "./components/Spas";
import Jobs from "./components/Jobs";
import Applications from "./components/Applications";
import Messages from "./components/Messages";
import Login from "./components/Login";

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/" element={<Layout />}>
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="users" element={<GetAllUSer />} />
            <Route path="spas" element={<Spas />} />
            <Route path="jobs" element={<Jobs />} />
            <Route path="applications" element={<Applications />} />
            <Route path="messages" element={<Messages />} />
          </Route>
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
