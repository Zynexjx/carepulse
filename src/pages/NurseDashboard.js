import { useState } from "react";
import Sidebar from "../components/Sidebar";
import OpdForm from "../components/OpdForm";
import TheaterForm from "../components/TheaterForm";
import RadiologyForm from "../components/RadiologyForm";
import MaternityForm from "../components/MaternityForm";
import NurseStatsCards from "../components/NurseStatsCards";
import NurseDashboardCharts from "../components/NurseDashboardCharts";
import NurseReportsGenerator from "../components/NurseReportsGenerator";
import { Alert, AppBar, Box, Card, CardContent, Container, IconButton, Toolbar, Typography } from "@mui/material";
import LogoutIcon from "@mui/icons-material/Logout";

export default function NurseDashboard() {
  const [activeSection, setActiveSection] = useState("Dashboard");

  const renderForm = () => {
    switch (activeSection) {
      case "Dashboard":
        return (
          <Box>
            <Typography variant="h4" sx={{ fontWeight: 700, color: "#16324f", mb: 1 }}>
              Nurse Dashboard
            </Typography>
            <Typography sx={{ color: "#5f7387", mb: 4 }}>
              Manage patient registration for OPD, Theater, Maternity, and Radiology from one workspace.
            </Typography>
            <NurseStatsCards />
            <Box sx={{ mt: 4 }}>
              <NurseDashboardCharts />
            </Box>
            <Box sx={{ mt: 4 }}>
              <NurseReportsGenerator />
            </Box>
            <Card sx={{ mt: 4, borderRadius: 3, boxShadow: "0 16px 36px rgba(15, 76, 129, 0.10)" }}>
              <CardContent>
                <Alert severity="info" sx={{ mb: 0 }}>
                  Use the left sidebar to open a department and register patients or manage department records.
                </Alert>
              </CardContent>
            </Card>
          </Box>
        );
      case "Reports":
        return <NurseReportsGenerator />;
      case "OPD":
        return <OpdForm />;
      case "Theater":
        return <TheaterForm />;
      case "Radiology":
        return <RadiologyForm />;
      case "Maternity":
        return <MaternityForm />;
      default:
        return <Box>Select a section</Box>;
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    window.location = "/";
  };

  return (
    <Box sx={{ display: "flex", minHeight: "100vh", background: "linear-gradient(180deg, #f7f9fc 0%, #eef3f8 100%)" }}>
      <Sidebar onSelectSection={setActiveSection} activeSection={activeSection} title="Nurse Portal" />

      <Box sx={{ flex: 1, display: "flex", flexDirection: "column" }}>
        <AppBar
          position="sticky"
          elevation={0}
          sx={{
            background: "linear-gradient(135deg, #0f4c81 0%, #1b6ca8 100%)"
          }}
        >
          <Toolbar sx={{ justifyContent: "space-between", minHeight: 74 }}>
            <Typography variant="h6" sx={{ fontWeight: 700 }}>
              {activeSection === "Dashboard" ? "CarePulse Nurse Dashboard" : `${activeSection} Department`}
            </Typography>
            <IconButton color="inherit" onClick={handleLogout} title="Logout">
              <LogoutIcon />
            </IconButton>
          </Toolbar>
        </AppBar>

        <Container maxWidth="xl" sx={{ flex: 1, py: 4 }}>
          {renderForm()}
        </Container>
      </Box>
    </Box>
  );
}
