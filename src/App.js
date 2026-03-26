import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/login";
import AdminDashboard from "./pages/AdminDashboard";
import ReceptionDashboard from "./pages/ReceptionDashboard";
import NurseDashboard from "./pages/NurseDashboard";
import DoctorDashboard from "./pages/DoctorDashboard";

// ===============================
// PROTECTED ROUTE COMPONENT
// ===============================
const PrivateRoute = ({ children, role }) => {
  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user"));

  if (!token) return <Navigate to="/" />;

  // role protection
  if (role && user?.role !== role)
    return <Navigate to="/" />;

  return children;
};

// ===============================
// MAIN APP
// ===============================
function App() {
  return (
    <BrowserRouter>
      <Routes>

        {/* LOGIN PAGE */}
        <Route path="/" element={<Login />} />

        {/* ADMIN DASHBOARD */}
        <Route
          path="/admin"
          element={
            <PrivateRoute role="admin">
              <AdminDashboard />
            </PrivateRoute>
          }
        />

        {/* RECEPTION DASHBOARD */}
        <Route
          path="/reception"
          element={
            <PrivateRoute role="reception">
              <ReceptionDashboard />
            </PrivateRoute>
          }
        />

        {/* NURSE DASHBOARD */}
        <Route
          path="/nurse"
          element={
            <PrivateRoute role="nurse">
              <NurseDashboard />
            </PrivateRoute>
          }
        />

        <Route
          path="/doctor"
          element={
            <PrivateRoute role="doctor">
              <DoctorDashboard />
            </PrivateRoute>
          }
        />

      </Routes>
    </BrowserRouter>
  );
}

export default App;
