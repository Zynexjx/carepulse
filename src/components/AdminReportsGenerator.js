import { useState } from "react";
import axios from "axios";
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  CardHeader,
  Checkbox,
  CircularProgress,
  Divider,
  FormControlLabel,
  Typography
} from "@mui/material";
import DownloadIcon from "@mui/icons-material/Download";

const csvLine = (values) => `${values.map((value) => `"${String(value ?? "").replaceAll('"', '""')}"`).join(",")}\n`;

export default function AdminReportsGenerator() {
  const [selected, setSelected] = useState({
    users: true,
    stats: true,
    recentLogins: true
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleChange = (event) => {
    const { name, checked } = event.target;
    setSelected((prev) => ({
      ...prev,
      [name]: checked
    }));
  };

  const handleDownload = async () => {
    setLoading(true);
    setError("");
    setSuccess("");

    try {
      const [usersRes, dashboardRes] = await Promise.all([
        axios.get("http://localhost:5000/api/admin/users"),
        axios.get("http://localhost:5000/api/admin/dashboard-data")
      ]);

      const users = usersRes.data;
      const { stats, recentLogins } = dashboardRes.data;
      let csv = csvLine(["CarePulse Admin Dashboard Report"]);
      csv += csvLine(["Generated", new Date().toLocaleString()]);
      csv += "\n";

      if (selected.stats) {
        csv += csvLine(["SYSTEM STATS"]);
        csv += csvLine(["Total Users", stats.users]);
        csv += csvLine(["Active Users", stats.activeUsers]);
        csv += csvLine(["Patients", stats.patients]);
        csv += csvLine(["Appointments", stats.appointments]);
        csv += csvLine(["Rehab", stats.rehab]);
        csv += csvLine(["Emergency", stats.emergency]);
        csv += "\n";
      }

      if (selected.users) {
        csv += csvLine(["USER ACCOUNTS"]);
        csv += csvLine(["Username", "Role", "Status", "Created At", "Last Login"]);
        users.forEach((user) => {
          csv += csvLine([
            user.username,
            user.role,
            user.active ? "Active" : "Inactive",
            user.createdAt ? new Date(user.createdAt).toLocaleDateString() : "",
            user.lastLogin ? new Date(user.lastLogin).toLocaleString() : "Never"
          ]);
        });
        csv += "\n";
      }

      if (selected.recentLogins) {
        csv += csvLine(["RECENT LOGINS"]);
        csv += csvLine(["Username", "Role", "Last Login"]);
        recentLogins.forEach((item) => {
          csv += csvLine([
            item.username,
            item.role,
            item.lastLogin ? new Date(item.lastLogin).toLocaleString() : "Never"
          ]);
        });
      }

      const link = document.createElement("a");
      link.setAttribute("href", `data:text/csv;charset=utf-8,${encodeURIComponent(csv)}`);
      link.setAttribute("download", `admin-dashboard-report-${new Date().toISOString().split("T")[0]}.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      setSuccess("Admin report downloaded successfully.");
    } catch (err) {
      setError("Failed to generate admin report");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card sx={{ borderRadius: 3, boxShadow: "0 16px 36px rgba(15, 76, 129, 0.10)" }}>
      <CardHeader
        title="Admin Reports"
        subheader="Download user data, stats, and recent login activity"
        sx={{
          color: "white",
          background: "linear-gradient(135deg, #0f4c81 0%, #1b6ca8 100%)"
        }}
      />
      <Divider />
      <CardContent sx={{ p: 3 }}>
        <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
          <FormControlLabel control={<Checkbox name="users" checked={selected.users} onChange={handleChange} />} label="User Accounts" />
          <FormControlLabel control={<Checkbox name="stats" checked={selected.stats} onChange={handleChange} />} label="System Statistics" />
          <FormControlLabel control={<Checkbox name="recentLogins" checked={selected.recentLogins} onChange={handleChange} />} label="Recent Logins" />
        </Box>

        {error && <Alert severity="error" sx={{ mt: 2 }}>{error}</Alert>}
        {success && <Alert severity="success" sx={{ mt: 2 }}>{success}</Alert>}

        <Button
          sx={{ mt: 3 }}
          variant="contained"
          startIcon={loading ? <CircularProgress size={18} color="inherit" /> : <DownloadIcon />}
          onClick={handleDownload}
          disabled={loading || !Object.values(selected).some(Boolean)}
        >
          {loading ? "Generating Report..." : "Download Admin CSV"}
        </Button>

        <Typography sx={{ mt: 2, color: "text.secondary", fontSize: 13 }}>
          Includes user status, role counts, and system activity totals.
        </Typography>
      </CardContent>
    </Card>
  );
}
