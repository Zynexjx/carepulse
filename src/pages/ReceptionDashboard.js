import { useState } from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Box,
  Container,
  Avatar
} from "@mui/material";
import LogoutIcon from "@mui/icons-material/Logout";
import ReceptionSidebar from "../components/ReceptionSidebar";
import PatientForm from "../components/PatientForm";
import PatientManagementTable from "../components/PatientManagementTable";
import AppointmentFormTable from "../components/AppointmentFormTable";
import RehabFormTable from "../components/RehabFormTable";
import EmergencyFormTable from "../components/EmergencyFormTable";
import StatisticsCards from "../components/StatisticsCards";
import DashboardCharts from "../components/DashboardCharts";
import ReportsGenerator from "../components/ReportsGenerator";

export default function ReceptionDashboard() {
  const [view, setView] = useState("dashboard");
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const handleRefresh = () => {
    setRefreshTrigger((prev) => prev + 1);
  };

  const logout = () => {
    localStorage.clear();
    window.location = "/";
  };

  const renderView = () => {
    switch (view) {
      case "dashboard":
        return (
          <>
            <Typography variant="h4" sx={{ mb: 3 }}>
              Reception Dashboard Overview
            </Typography>
            <StatisticsCards />
            <Box sx={{ mt: 4 }}>
              <DashboardCharts />
            </Box>
          </>
        );
      case "registerPatient":
        return (
          <>
            <Typography variant="h4" sx={{ mb: 3 }}>
              Register Patient
            </Typography>
            <PatientForm onSuccess={handleRefresh} />
          </>
        );
      case "patientTable":
        return (
          <>
            <Typography variant="h4" sx={{ mb: 3 }}>
              Patient Records
            </Typography>
            <PatientManagementTable refreshTrigger={refreshTrigger} />
          </>
        );
      case "appointments":
        return <AppointmentFormTable refreshTrigger={refreshTrigger} />;
      case "rehab":
        return <RehabFormTable refreshTrigger={refreshTrigger} />;
      case "emergency":
        return <EmergencyFormTable refreshTrigger={refreshTrigger} />;
      case "statistics":
        return (
          <>
            <Typography variant="h4" sx={{ mb: 3 }}>
              Statistics & Analytics Dashboard
            </Typography>
            <StatisticsCards />
            <DashboardCharts />
          </>
        );
      case "reports":
        return (
          <>
            <Typography variant="h4" sx={{ mb: 3 }}>
              Reports & Data Export
            </Typography>
            <ReportsGenerator />
          </>
        );
      default:
        return <Typography>Page not found</Typography>;
    }
  };

  return (
    <Box sx={{ display: "flex", minHeight: "100vh", background: "#f5f5f5" }}>
      <AppBar
        position="fixed"
        sx={{
          background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
          zIndex: 1200
        }}
      >
        <Toolbar sx={{ height: "70px", px: 3 }}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 2, flex: 1 }}>
            <Box
              sx={{
                width: 45,
                height: 45,
                borderRadius: "50%",
                background: "rgba(255,255,255,0.2)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center"
              }}
            >
              <Typography sx={{ fontWeight: "bold", color: "white" }}>
                C
              </Typography>
            </Box>

            <Box>
              <Typography sx={{ fontWeight: 700, color: "white" }}>
                CarePulse
              </Typography>
              <Typography sx={{ fontSize: 11, color: "rgba(255,255,255,0.8)" }}>
                Reception Portal
              </Typography>
            </Box>
          </Box>

          <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
            <Avatar sx={{ background: "rgba(255,255,255,0.2)" }}>
              R
            </Avatar>
            <IconButton color="inherit" onClick={logout}>
              <LogoutIcon />
            </IconButton>
          </Box>
        </Toolbar>
      </AppBar>

      <ReceptionSidebar setView={setView} activeView={view} />

      <Box component="main" sx={{ flexGrow: 1, ml: "220px", pt: "80px" }}>
        <Container maxWidth="xl" sx={{ py: 4 }}>
          {renderView()}
        </Container>

        <Box
          sx={{
            background: "white",
            borderTop: "1px solid #e0e0e0",
            py: 2,
            textAlign: "center"
          }}
        >
          <Typography variant="body2">
            Copyright 2026 CarePulse Hospital Management System
          </Typography>
        </Box>
      </Box>
    </Box>
  );
}
