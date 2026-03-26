import { useEffect, useState } from "react";
import axios from "axios";
import { Grid, Card, CardContent, Typography, Box, CircularProgress } from "@mui/material";
import PeopleIcon from "@mui/icons-material/People";
import EventIcon from "@mui/icons-material/Event";
import FitnessCenterIcon from "@mui/icons-material/FitnessCenter";
import LocalHospitalIcon from "@mui/icons-material/LocalHospital";

export default function StatisticsCards() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/reception/stats");
      setStats(response.data);
    } catch (err) {
      setError("Failed to fetch statistics");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", p: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return <Typography color="error">{error}</Typography>;
  }

  const statCards = [
    {
      title: "Total Patients",
      value: stats?.patients || 0,
      icon: <PeopleIcon sx={{ fontSize: 40 }} />,
      color: "#667eea",
      bgColor: "#f0f4ff",
      light: "#e8f0ff"
    },
    {
      title: "Appointments",
      value: stats?.appointments || 0,
      icon: <EventIcon sx={{ fontSize: 40 }} />,
      color: "#11998e",
      bgColor: "#f0fffe",
      light: "#e8fffd"
    },
    {
      title: "Rehab Sessions",
      value: stats?.rehab || 0,
      icon: <FitnessCenterIcon sx={{ fontSize: 40 }} />,
      color: "#f9a825",
      bgColor: "#fffbf0",
      light: "#fffdf8"
    },
    {
      title: "Emergency Cases",
      value: stats?.emergency || 0,
      icon: <LocalHospitalIcon sx={{ fontSize: 40 }} />,
      color: "#ff6b6b",
      bgColor: "#fff5f5",
      light: "#fffbfb"
    }
  ];

  return (
    <Grid container spacing={3} mb={4}>
      {statCards.map((card, index) => (
        <Grid item xs={12} sm={6} md={3} key={index}>
          <Card
            sx={{
              background: card.light,
              border: `2px solid ${card.bgColor}`,
              borderLeft: `6px solid ${card.color}`,
              transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
              cursor: "pointer",
              "&:hover": {
                transform: "translateY(-8px)",
                boxShadow: `0 12px 32px ${card.color}20`,
                border: `2px solid ${card.color}`,
                borderLeft: `6px solid ${card.color}`
              }
            }}
          >
            <CardContent sx={{ p: 3 }}>
              <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                <Box>
                  <Typography 
                    color="textSecondary" 
                    gutterBottom 
                    variant="body2"
                    sx={{
                      fontWeight: 600,
                      fontSize: "13px",
                      textTransform: "uppercase",
                      letterSpacing: 0.5,
                      color: "#666"
                    }}
                  >
                    {card.title}
                  </Typography>
                  <Typography 
                    variant="h4" 
                    sx={{ 
                      color: card.color, 
                      fontWeight: 700, 
                      mt: 1.5,
                      fontSize: "32px"
                    }}
                  >
                    {card.value}
                  </Typography>
                </Box>
                <Box 
                  sx={{ 
                    color: card.color, 
                    opacity: 0.15,
                    p: 1,
                    background: card.color,
                    borderRadius: "12px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    width: 60,
                    height: 60
                  }}
                >
                  {card.icon}
                </Box>
              </Box>
              <Box sx={{ mt: 2, pt: 2, borderTop: `1px solid ${card.bgColor}` }}>
                <Typography variant="caption" sx={{ color: card.color, fontWeight: 600 }}>
                  ↑ Updated just now
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      ))}
    </Grid>
  );
}
