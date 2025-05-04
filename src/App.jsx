// App.jsx
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';;
import Dashboard from './components/Dashboard';
import Users from './components/Users';
import Spas from './components/Spas';
import Jobs from './components/Jobs';
import Applications from './components/Applications';
import Messages from './components/Messages';
import Login from './components/Login';

function App() {
  return (

    <>
    <Router>
      <Routes>
        <Route path="/" element={<Layout />}>
          {/* <Route index element={<Navigate replace to="/dashboard" />} /> */}
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/users" element={<Users />} />
          <Route path="/spas" element={<Spas />} />
          <Route path="/jobs" element={<Jobs />} />
          <Route path="/applications" element={<Applications />} />
          <Route path="/messages" element={<Messages />} />
          <Route path="/login" element={ <Login /> } />
        </Route>
      </Routes>
    </Router>

    </>
  );
}

export default App;