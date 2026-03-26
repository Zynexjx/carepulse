import { useEffect, useState } from "react";
import axios from "axios";
import { Box, Card, CardContent, Typography, Grid, CircularProgress } from "@mui/material";
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from "recharts";

export default function DashboardCharts() {
  const [chartData, setChartData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch all data
        const [appointments, rehabs, emergencies, patientStats] = await Promise.all([
          axios.get("http://localhost:5000/api/reception/appointments"),
          axios.get("http://localhost:5000/api/reception/rehabs"),
          axios.get("http://localhost:5000/api/reception/emergencies"),
          axios.get("http://localhost:5000/api/reception/stats")
        ]);

        // Process data for charts
        const pieData = [
          { name: "Appointments", value: patientStats.data.appointments },
          { name: "Rehab", value: patientStats.data.rehab },
          { name: "Emergency", value: patientStats.data.emergency }
        ];

        // Get last 7 days data (mock data based on available records)
        const appointmentsByDay = processDataByDate(appointments.data, 7);
        const activitiesByType = [
          { type: "Appointments", count: appointments.data.length },
          { type: "Rehab Sessions", count: rehabs.data.length },
          { type: "Emergency Cases", count: emergencies.data.length }
        ];

        setChartData({
          pieData,
          appointmentsByDay,
          activitiesByType
        });
      } catch (error) {
        console.error("Error fetching chart data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const processDataByDate = (data, days) => {
    const result = {};

    for (let i = days - 1; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      const dateStr = date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
      result[dateStr] = 0;
    }

    data.forEach(item => {
      if (item.createdAt) {
        const date = new Date(item.createdAt);
        const dateStr = date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
        if (result[dateStr] !== undefined) {
          result[dateStr]++;
        }
      }
    });

    return Object.entries(result).map(([date, count]) => ({ date, count }));
  };

  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", p: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  const COLORS = ["#1976d2", "#388e3c", "#d32f2f"];

  return (
    <Grid container spacing={3}>
      {/* Service Distribution Pie Chart */}
      <Grid item xs={12} md={6}>
        <Card
          sx={{
            borderRadius: "12px",
            boxShadow: "0 4px 16px rgba(0,0,0,0.08)",
            transition: "all 0.3s ease",
            "&:hover": {
              boxShadow: "0 8px 24px rgba(0,0,0,0.12)"
            }
          }}
        >
          <CardContent sx={{ p: 3 }}>
            <Typography 
              variant="h6" 
              gutterBottom
              sx={{
                fontWeight: 700,
                color: "#2c3e50"
              }}
            >
              📊 Service Distribution
            </Typography>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={chartData?.pieData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, value }) => `${name}: ${value}`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {chartData?.pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{
                    borderRadius: "8px",
                    border: "1px solid #ddd",
                    boxShadow: "0 4px 12px rgba(0,0,0,0.1)"
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </Grid>

      {/* Activity by Type Bar Chart */}
      <Grid item xs={12} md={6}>
        <Card
          sx={{
            borderRadius: "12px",
            boxShadow: "0 4px 16px rgba(0,0,0,0.08)",
            transition: "all 0.3s ease",
            "&:hover": {
              boxShadow: "0 8px 24px rgba(0,0,0,0.12)"
            }
          }}
        >
          <CardContent sx={{ p: 3 }}>
            <Typography 
              variant="h6" 
              gutterBottom
              sx={{
                fontWeight: 700,
                color: "#2c3e50"
              }}
            >
              📈 Activity by Type
            </Typography>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={chartData?.activitiesByType}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
                <XAxis dataKey="type" />
                <YAxis />
                <Tooltip 
                  contentStyle={{
                    borderRadius: "8px",
                    border: "1px solid #ddd",
                    boxShadow: "0 4px 12px rgba(0,0,0,0.1)"
                  }}
                />
                <Bar dataKey="count" fill="#667eea" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </Grid>

      {/* Activity Trend Line Chart */}
      <Grid item xs={12}>
        <Card
          sx={{
            borderRadius: "12px",
            boxShadow: "0 4px 16px rgba(0,0,0,0.08)",
            transition: "all 0.3s ease",
            "&:hover": {
              boxShadow: "0 8px 24px rgba(0,0,0,0.12)"
            }
          }}
        >
          <CardContent sx={{ p: 3 }}>
            <Typography 
              variant="h6" 
              gutterBottom
              sx={{
                fontWeight: 700,
                color: "#2c3e50"
              }}
            >
              📉 Activity Trend (Last 7 Days)
            </Typography>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={chartData?.appointmentsByDay}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip 
                  contentStyle={{
                    borderRadius: "8px",
                    border: "1px solid #ddd",
                    boxShadow: "0 4px 12px rgba(0,0,0,0.1)"
                  }}
                />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="count"
                  stroke="#667eea"
                  name="Total Activities"
                  strokeWidth={3}
                  dot={{ fill: "#667eea", r: 5 }}
                  activeDot={{ r: 7 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  );
}
