import { Toaster } from 'react-hot-toast'; // 
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Departments from './pages/Department';
import RoleDashboard from './pages/Role';
import HeroSection from './pages/Hero';
import SigninSection from './pages/SignIn';
import PrivateRoute from "./components/PrivateRoute";
import UserLocation from './pages/UserLocation';
import ManagerDashboard from './pages/ManagerDashboard';

function App() {
  return (
    <Router>
      <Toaster position="top-right" reverseOrder={false} />
      <Routes>
        <Route path="/Login" element={< SigninSection />} />
        <Route path="/" element={<HeroSection />} />
        <Route path="/agents" element={
          <PrivateRoute requiredPermission="view_tasks">
            <UserLocation />
          </PrivateRoute>
        } />
        <Route path="/manager" element={
          <PrivateRoute requiredPermission="view_roles">
            <ManagerDashboard />
          </PrivateRoute>
        } />

        <Route
          path="/users"
          element={
            <PrivateRoute requiredPermission="view_users">
              <Home />
            </PrivateRoute>
          }
        />
        <Route
          path="/departments"
          element={
            <PrivateRoute requiredPermission="view_departments">
              <Departments />
            </PrivateRoute>
          }
        />
        <Route
          path="/roles"
          element={
            <PrivateRoute requiredPermission="view_roles">
              <RoleDashboard />
            </PrivateRoute>
          }
        />

        <Route path="*" element={<HeroSection />} />
      </Routes>
    </Router>
  );
}

export default App;

