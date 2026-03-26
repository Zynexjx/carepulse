import { Drawer, List, ListItemButton, ListItemText, ListItemIcon, Box, Typography, Divider } from "@mui/material";
import DashboardIcon from "@mui/icons-material/Dashboard";
import LocalHospitalIcon from "@mui/icons-material/LocalHospital";
import AssignmentIcon from "@mui/icons-material/Assignment";
import ImageSearchIcon from "@mui/icons-material/ImageSearch";
import LocalFloristIcon from "@mui/icons-material/LocalFlorist";
import AssessmentIcon from "@mui/icons-material/Assessment";

export default function Sidebar({ onSelectSection = () => {}, activeSection, title = "CarePulse" }) {
  const sections = [
    { name: "Dashboard", icon: DashboardIcon },
    { name: "Reports", icon: AssessmentIcon },
    { name: "OPD", icon: LocalHospitalIcon },
    { name: "Theater", icon: AssignmentIcon },
    { name: "Radiology", icon: ImageSearchIcon },
    { name: "Maternity", icon: LocalFloristIcon }
  ];

  return (
    <Drawer 
      variant="permanent" 
      sx={{
        width: 250,
        flexShrink: 0,
        "& .MuiDrawer-paper": {
          width: 250,
          boxSizing: "border-box",
          bgcolor: "background.default",
          borderRight: "1px solid #e0e0e0"
        }
      }}
    >
      <Box sx={{ p: 2 }}>
        <Typography variant="h6" sx={{ fontWeight: "bold", color: "#3f51b5" }}>
          {title}
        </Typography>
      </Box>
      <Divider />

      <List sx={{ pt: 0 }}>
        {sections.map((section) => {
          const Icon = section.icon;
          const isActive = activeSection === section.name;

          return (
            <ListItemButton
              key={section.name}
              onClick={() => onSelectSection(section.name)}
              sx={{
                backgroundColor: isActive ? "rgba(63, 81, 181, 0.1)" : "transparent",
                "&:hover": { bgcolor: "action.hover" },
                transition: "all 0.2s"
              }}
            >
              <ListItemIcon sx={{ minWidth: 40, color: "#3f51b5" }}>
                <Icon />
              </ListItemIcon>
              <ListItemText primary={section.name} />
            </ListItemButton>
          );
        })}
      </List>
    </Drawer>
  );
}
