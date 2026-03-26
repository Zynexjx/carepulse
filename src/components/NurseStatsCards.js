import { useEffect, useState } from "react";
import axios from "axios";
import { Alert, Box, Card, CardContent, CircularProgress, Grid, Typography } from "@mui/material";
import LocalHospitalIcon from "@mui/icons-material/LocalHospital";
import AssignmentIcon from "@mui/icons-material/Assignment";
import LocalFloristIcon from "@mui/icons-material/LocalFlorist";
import ImageSearchIcon from "@mui/icons-material/ImageSearch";

const cards = [
  { key: "opd", title: "OPD Patients", color: "#1976d2", icon: <LocalHospitalIcon sx={{ fontSize: 34 }} /> },
  { key: "theater", title: "Theater Cases", color: "#8e24aa", icon: <AssignmentIcon sx={{ fontSize: 34 }} /> },
  { key: "maternity", title: "Maternity Records", color: "#d81b60", icon: <LocalFloristIcon sx={{ fontSize: 34 }} /> },
  { key: "radiology", title: "Radiology Requests", color: "#00897b", icon: <ImageSearchIcon sx={{ fontSize: 34 }} /> }
];

export default function NurseStatsCards() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/nurse/stats");
        setStats(response.data);
      } catch (err) {
        setError("Failed to fetch nurse dashboard statistics");
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", p: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return <Alert severity="error">{error}</Alert>;
  }

  return (
    <Grid container spacing={3}>
      {cards.map((card) => (
        <Grid key={card.key} size={{ xs: 12, sm: 6, xl: 3 }}>
          <Card
            sx={{
              borderRadius: 3,
              color: "white",
              background: `linear-gradient(135deg, ${card.color} 0%, ${card.color}cc 100%)`,
              boxShadow: `0 16px 28px ${card.color}26`
            }}
          >
            <CardContent sx={{ p: 3 }}>
              <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <Box>
                  <Typography sx={{ fontSize: 13, opacity: 0.85 }}>{card.title}</Typography>
                  <Typography variant="h4" sx={{ fontWeight: 700, mt: 1 }}>
                    {stats?.[card.key] || 0}
                  </Typography>
                </Box>
                <Box sx={{ opacity: 0.9 }}>{card.icon}</Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      ))}
    </Grid>
  );
}
