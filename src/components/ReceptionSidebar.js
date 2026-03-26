import { useState } from "react";
import {
  Drawer,
  List,
  ListItemButton,
  ListItemText,
  Collapse,
  Box
} from "@mui/material";

import HomeIcon from "@mui/icons-material/Home";
import PeopleIcon from "@mui/icons-material/People";
import EventIcon from "@mui/icons-material/Event";
import FitnessCenterIcon from "@mui/icons-material/FitnessCenter";
import LocalHospitalIcon from "@mui/icons-material/LocalHospital";
import BarChartIcon from "@mui/icons-material/BarChart";
import DescriptionIcon from "@mui/icons-material/Description";
import ExpandLess from "@mui/icons-material/ExpandLess";
import ExpandMore from "@mui/icons-material/ExpandMore";

export default function ReceptionSidebar({ setView }) {
  const [openPatients, setOpenPatients] = useState(false);

  const togglePatients = () => {
    setOpenPatients(!openPatients);
  };

  const menuItems = [
    { name: "Dashboard", key: "dashboard", icon: <HomeIcon /> },
    { name: "Appointments", key: "appointments", icon: <EventIcon /> },
    { name: "Rehab", key: "rehab", icon: <FitnessCenterIcon /> },
    { name: "Emergency", key: "emergency", icon: <LocalHospitalIcon /> },
    { name: "Statistics", key: "statistics", icon: <BarChartIcon /> },
    { name: "Reports", key: "reports", icon: <DescriptionIcon /> }
  ];

  return (
    <Drawer
      variant="permanent"
      sx={{
        width: 220,
        "& .MuiDrawer-paper": {
          width: 220,
          boxSizing: "border-box",
          mt: "70px",
          pt: 2,
          background: "linear-gradient(180deg, #2c3e50 0%, #34495e 100%)",
          height: "calc(100vh - 70px)",
          overflowY: "auto"
        }
      }}
    >
      <List>

        {/* DASHBOARD */}
        <ListItemButton onClick={() => setView("dashboard")}>
          <HomeIcon sx={{ mr: 2 }} />
          <ListItemText primary="Dashboard" />
        </ListItemButton>

        {/* PATIENT DROPDOWN */}
        <ListItemButton onClick={togglePatients}>
          <PeopleIcon sx={{ mr: 2 }} />
          <ListItemText primary="Patients" />
          {openPatients ? <ExpandLess /> : <ExpandMore />}
        </ListItemButton>

        <Collapse in={openPatients} timeout="auto" unmountOnExit>
          <List component="div" disablePadding>

            <ListItemButton
              sx={{ pl: 6 }}
              onClick={() => setView("registerPatient")}
            >
              <ListItemText primary="Register Patient" />
            </ListItemButton>

            <ListItemButton
              sx={{ pl: 6 }}
              onClick={() => setView("patientTable")}
            >
              <ListItemText primary="View Patients" />
            </ListItemButton>

          </List>
        </Collapse>

        {/* OTHER MENU ITEMS */}
        {menuItems.map((item) => (
          <ListItemButton
            key={item.key}
            onClick={() => setView(item.key)}
          >
            <Box sx={{ mr: 2 }}>{item.icon}</Box>
            <ListItemText primary={item.name} />
          </ListItemButton>
        ))}
      </List>
    </Drawer>
  );
}