import { useEffect, useState } from "react";
import axios from "axios";
import AccountTable from "../components/AccountTable";
import AdminDashboardCharts from "../components/AdminDashboardCharts";
import AdminReportsGenerator from "../components/AdminReportsGenerator";
import {
  Alert,
  AppBar,
  Box,
  Card,
  CardContent,
  CircularProgress,
  Container,
  Grid,
  IconButton,
  Toolbar,
  Typography
} from "@mui/material";
import LogoutIcon from "@mui/icons-material/Logout";
import PeopleIcon from "@mui/icons-material/People";
import EventIcon from "@mui/icons-material/Event";
import AssignmentIcon from "@mui/icons-material/Assignment";
import LocalHospitalIcon from "@mui/icons-material/LocalHospital";

const StatCard = ({ icon: Icon, title, value, color }) => (
  <Card sx={{ height: "100%", background: `linear-gradient(135deg, ${color} 0%, ${color}dd 100%)`, borderRadius: 3 }}>
    <CardContent>
      <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
        <Icon sx={{ fontSize: 40, color: "white" }} />
        <Box>
          <Typography sx={{ color: "white", fontSize: 12 }}>
            {title}
          </Typography>
          <Typography sx={{ color: "white", fontSize: 28, fontWeight: "bold" }}>
            {value}
          </Typography>
        </Box>
      </Box>
    </CardContent>
  </Card>
);

export default function AdminDashboard() {
  const [accounts, setAccounts] = useState([]);
  const [stats, setStats] = useState({
    users: 0,
    activeUsers: 0,
    appointments: 0,
    emergency: 0
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const [usersRes, dashboardRes] = await Promise.all([
          axios.get("http://localhost:5000/api/admin/users"),
          axios.get("http://localhost:5000/api/admin/dashboard-data")
        ]);

        setAccounts(usersRes.data.map((user) => ({ id: user._id, ...user })));
        setStats(dashboardRes.data.stats);
      } catch (err) {
        setError("Failed to load admin dashboard data");
      } finally {
        setLoading(false);
      }
    };

    fetchDashboard();
  }, []);

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    window.location = "/";
  };

  return (
    <Box sx={{ minHeight: "100vh", background: "linear-gradient(180deg, #f7f9fc 0%, #eef3f8 100%)" }}>
      <AppBar position="sticky" sx={{ background: "linear-gradient(135deg, #0f4c81 0%, #1b6ca8 100%)" }}>
        <Toolbar>
          <Typography variant="h6" sx={{ flexGrow: 1, fontWeight: "bold" }}>
            CarePulse Admin Dashboard
          </Typography>
          <IconButton color="inherit" onClick={logout} title="Logout">
            <LogoutIcon />
          </IconButton>
        </Toolbar>
      </AppBar>

      <Container maxWidth="xl" sx={{ py: 4 }}>
        {error && <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>}

        {loading ? (
          <Box sx={{ display: "flex", justifyContent: "center", p: 6 }}>
            <CircularProgress />
          </Box>
        ) : (
          <>
            <Grid container spacing={3} sx={{ mb: 4 }}>
              <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                <StatCard icon={PeopleIcon} title="Total Users" value={stats.users} color="#3f51b5" />
              </Grid>
              <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                <StatCard icon={AssignmentIcon} title="Active Users" value={stats.activeUsers} color="#00897b" />
              </Grid>
              <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                <StatCard icon={EventIcon} title="Appointments" value={stats.appointments} color="#f57c00" />
              </Grid>
              <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                <StatCard icon={LocalHospitalIcon} title="Emergency Cases" value={stats.emergency} color="#d32f2f" />
              </Grid>
            </Grid>

            <Box sx={{ mb: 4 }}>
              <AdminDashboardCharts />
            </Box>

            <Box sx={{ mb: 4 }}>
              <AdminReportsGenerator />
            </Box>

            <Card sx={{ borderRadius: 3 }}>
              <CardContent sx={{ p: 3 }}>
                <Typography variant="h6" sx={{ mb: 2, fontWeight: "bold" }}>
                  User Accounts
                </Typography>
                <AccountTable rows={accounts} />
              </CardContent>
            </Card>
          </>
        )}
      </Container>
    </Box>
  );
}
