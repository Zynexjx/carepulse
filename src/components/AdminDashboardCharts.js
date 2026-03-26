import { useEffect, useState } from "react";
import axios from "axios";
import { Alert, Box, Card, CardContent, CircularProgress, Grid, Typography } from "@mui/material";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis
} from "recharts";

const ROLE_COLORS = ["#1976d2", "#8e24aa", "#2e7d32", "#ef6c00", "#d81b60"];

export default function AdminDashboardCharts() {
  const [chartData, setChartData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/admin/dashboard-data");
        const { roleStats, stats } = response.data;

        setChartData({
          roleStats: roleStats.map((item) => ({
            role: item._id,
            total: item.total
          })),
          serviceStats: [
            { name: "Patients", total: stats.patients },
            { name: "Appointments", total: stats.appointments },
            { name: "Rehab", total: stats.rehab },
            { name: "Emergency", total: stats.emergency }
          ]
        });
      } catch (err) {
        setError("Failed to load admin charts");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
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
      <Grid size={{ xs: 12, md: 6 }}>
        <Card sx={{ borderRadius: 3, boxShadow: "0 16px 36px rgba(15, 76, 129, 0.10)" }}>
          <CardContent sx={{ p: 3 }}>
            <Typography variant="h6" sx={{ fontWeight: 700, color: "#16324f", mb: 2 }}>
              Users by Role
            </Typography>
            <ResponsiveContainer width="100%" height={280}>
              <PieChart>
                <Pie
                  data={chartData.roleStats}
                  dataKey="total"
                  nameKey="role"
                  outerRadius={90}
                  label={({ role, total }) => `${role}: ${total}`}
                >
                  {chartData.roleStats.map((item, index) => (
                    <Cell key={item.role} fill={ROLE_COLORS[index % ROLE_COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </Grid>

      <Grid size={{ xs: 12, md: 6 }}>
        <Card sx={{ borderRadius: 3, boxShadow: "0 16px 36px rgba(15, 76, 129, 0.10)" }}>
          <CardContent sx={{ p: 3 }}>
            <Typography variant="h6" sx={{ fontWeight: 700, color: "#16324f", mb: 2 }}>
              Service Records
            </Typography>
            <ResponsiveContainer width="100%" height={280}>
              <BarChart data={chartData.serviceStats}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis allowDecimals={false} />
                <Tooltip />
                <Bar dataKey="total" fill="#1976d2" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  );
}
