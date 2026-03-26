import { useEffect, useMemo, useState } from "react";
import axios from "axios";
import { Alert, Box, Card, CardContent, CircularProgress, Grid, Typography } from "@mui/material";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis
} from "recharts";

const SECTION_COLORS = ["#1976d2", "#8e24aa", "#d81b60", "#00897b"];

const processLastSevenDays = (records) => {
  const bucket = {};

  for (let i = 6; i >= 0; i -= 1) {
    const date = new Date();
    date.setDate(date.getDate() - i);
    const key = date.toISOString().split("T")[0];
    bucket[key] = 0;
  }

  records.forEach((item) => {
    const sourceDate = item.date || item.dateOfDelivery || item.createdAt;

    if (!sourceDate) {
      return;
    }

    const key = new Date(sourceDate).toISOString().split("T")[0];
    if (bucket[key] !== undefined) {
      bucket[key] += 1;
    }
  });

  return Object.entries(bucket).map(([date, count]) => ({
    date: new Date(date).toLocaleDateString("en-US", { month: "short", day: "numeric" }),
    count
  }));
};

export default function NurseDashboardCharts() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [opdRes, theaterRes, maternityRes, radiologyRes] = await Promise.all([
          axios.get("http://localhost:5000/api/nurse/opd"),
          axios.get("http://localhost:5000/api/nurse/theater"),
          axios.get("http://localhost:5000/api/nurse/maternity"),
          axios.get("http://localhost:5000/api/nurse/radiology")
        ]);

        const opd = opdRes.data;
        const theater = theaterRes.data;
        const maternity = maternityRes.data;
        const radiology = radiologyRes.data;

        setData({
          sectionStats: [
            { name: "OPD", value: opd.length },
            { name: "Theater", value: theater.length },
            { name: "Maternity", value: maternity.length },
            { name: "Radiology", value: radiology.length }
          ],
          malariaStats: [
            {
              name: "Positive",
              value: opd.filter((item) => item.malariaTest === "Positive").length
            },
            {
              name: "Negative",
              value: opd.filter((item) => item.malariaTest === "Negative").length
            }
          ],
          activityTrend: processLastSevenDays([
            ...opd,
            ...theater,
            ...maternity,
            ...radiology
          ]),
          opdDoctors: Object.entries(
            opd.reduce((acc, item) => {
              const doctor = item.doctor || "Unassigned";
              acc[doctor] = (acc[doctor] || 0) + 1;
              return acc;
            }, {})
          ).map(([doctor, count]) => ({ doctor, count }))
        });
      } catch (err) {
        setError("Failed to load nurse charts");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const hasDoctorData = useMemo(() => data?.opdDoctors?.length > 0, [data]);

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
              Section Distribution
            </Typography>
            <ResponsiveContainer width="100%" height={280}>
              <PieChart>
                <Pie
                  data={data.sectionStats}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={90}
                  label={({ name, value }) => `${name}: ${value}`}
                >
                  {data.sectionStats.map((entry, index) => (
                    <Cell key={entry.name} fill={SECTION_COLORS[index % SECTION_COLORS.length]} />
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
              Malaria Test Results
            </Typography>
            <ResponsiveContainer width="100%" height={280}>
              <BarChart data={data.malariaStats}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis allowDecimals={false} />
                <Tooltip />
                <Legend />
                <Bar dataKey="value" name="Cases" radius={[8, 8, 0, 0]}>
                  <Cell fill="#d32f2f" />
                  <Cell fill="#2e7d32" />
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </Grid>

      <Grid size={{ xs: 12, lg: 7 }}>
        <Card sx={{ borderRadius: 3, boxShadow: "0 16px 36px rgba(15, 76, 129, 0.10)" }}>
          <CardContent sx={{ p: 3 }}>
            <Typography variant="h6" sx={{ fontWeight: 700, color: "#16324f", mb: 2 }}>
              Weekly Activity Trend
            </Typography>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={data.activityTrend}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis allowDecimals={false} />
                <Tooltip />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="count"
                  name="Registered Patients"
                  stroke="#1976d2"
                  strokeWidth={3}
                  dot={{ r: 4, fill: "#1976d2" }}
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </Grid>

      <Grid size={{ xs: 12, lg: 5 }}>
        <Card sx={{ borderRadius: 3, boxShadow: "0 16px 36px rgba(15, 76, 129, 0.10)" }}>
          <CardContent sx={{ p: 3 }}>
            <Typography variant="h6" sx={{ fontWeight: 700, color: "#16324f", mb: 2 }}>
              OPD Load by Doctor
            </Typography>
            {hasDoctorData ? (
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={data.opdDoctors}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="doctor" />
                  <YAxis allowDecimals={false} />
                  <Tooltip />
                  <Bar dataKey="count" fill="#8e24aa" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <Box sx={{ display: "flex", alignItems: "center", justifyContent: "center", height: 260 }}>
                <Typography color="text.secondary">No OPD doctor data available yet.</Typography>
              </Box>
            )}
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  );
}
