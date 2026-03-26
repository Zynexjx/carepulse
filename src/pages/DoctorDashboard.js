import { useEffect, useMemo, useState } from "react";
import axios from "axios";
import {
  Alert,
  AppBar,
  Avatar,
  Box,
  Button,
  Card,
  CardContent,
  CardHeader,
  CircularProgress,
  Container,
  Grid,
  IconButton,
  MenuItem,
  Stack,
  TextField,
  Toolbar,
  Typography
} from "@mui/material";
import LogoutIcon from "@mui/icons-material/Logout";
import DownloadIcon from "@mui/icons-material/Download";
import EventAvailableIcon from "@mui/icons-material/EventAvailable";
import MedicalServicesIcon from "@mui/icons-material/MedicalServices";
import ChildCareIcon from "@mui/icons-material/ChildCare";
import VaccinesIcon from "@mui/icons-material/Vaccines";
import HotelIcon from "@mui/icons-material/Hotel";

const STATUS_STYLES = {
  Pending: { bg: "#fff4e5", color: "#ed6c02" },
  "Referred To": { bg: "#e3f2fd", color: "#1565c0" },
  Died: { bg: "#ffebee", color: "#c62828" },
  Completed: { bg: "#e8f5e9", color: "#2e7d32" }
};

const STATUS_SEQUENCE = ["Pending", "Referred To", "Completed", "Pending", "Died"];

const sectionIcons = {
  Appointment: EventAvailableIcon,
  Theater: MedicalServicesIcon,
  Maternity: ChildCareIcon,
  OPD: VaccinesIcon,
  "Ward Round": HotelIcon
};

const sectionAccent = {
  Appointment: "#1976d2",
  Theater: "#8e24aa",
  Maternity: "#d81b60",
  OPD: "#2e7d32",
  "Ward Round": "#ef6c00"
};

const weeklyDays = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];

const fallbackWardRounds = [
  {
    section: "Ward Round",
    day: "Monday",
    time: "07:00 - 08:00",
    title: "Medical Ward Round",
    detail: "Review high-dependency admissions and follow-up notes",
    status: "Pending"
  },
  {
    section: "Ward Round",
    day: "Wednesday",
    time: "07:00 - 08:30",
    title: "Surgical Ward Round",
    detail: "Check postoperative recovery and referral updates",
    status: "Completed"
  },
  {
    section: "Ward Round",
    day: "Friday",
    time: "07:30 - 08:30",
    title: "Maternity Ward Round",
    detail: "Assess postnatal recovery and newborn observations",
    status: "Referred To"
  }
];

const formatPatientName = (record) =>
  [record.name, record.surname].filter(Boolean).join(" ").trim() || "Patient Review";

const downloadCSV = (csv, filename) => {
  const element = document.createElement("a");
  element.setAttribute("href", `data:text/csv;charset=utf-8,${encodeURIComponent(csv)}`);
  element.setAttribute("download", filename);
  document.body.appendChild(element);
  element.click();
  document.body.removeChild(element);
};

function StatCard({ title, value, subtitle, color }) {
  return (
    <Card
      sx={{
        height: "100%",
        borderRadius: 3,
        color: "white",
        background: `linear-gradient(135deg, ${color} 0%, ${color}cc 100%)`,
        boxShadow: `0 16px 32px ${color}33`
      }}
    >
      <CardContent sx={{ p: 3 }}>
        <Typography sx={{ fontSize: 13, letterSpacing: 0.4, opacity: 0.85 }}>
          {title}
        </Typography>
        <Typography sx={{ fontSize: 34, fontWeight: 700, mt: 1 }}>
          {value}
        </Typography>
        <Typography sx={{ fontSize: 13, opacity: 0.9, mt: 1 }}>
          {subtitle}
        </Typography>
      </CardContent>
    </Card>
  );
}

export default function DoctorDashboard() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [weeklySchedule, setWeeklySchedule] = useState([]);
  const [selectedDoctor, setSelectedDoctor] = useState("All Doctors");
  const user = JSON.parse(localStorage.getItem("user") || "{}");

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const [appointmentsRes, opdRes, maternityRes, theaterRes] = await Promise.all([
          axios.get("http://localhost:5000/api/reception/appointments"),
          axios.get("http://localhost:5000/api/nurse/opd"),
          axios.get("http://localhost:5000/api/nurse/maternity"),
          axios.get("http://localhost:5000/api/nurse/theater")
        ]);

        const mappedAppointments = appointmentsRes.data.slice(0, 3).map((item, index) => ({
          section: "Appointment",
          doctor: item.counselor || "Unassigned",
          day: weeklyDays[index % weeklyDays.length],
          time: item.time_period || "08:00 - 09:00",
          title: `${formatPatientName(item)} Consultation`,
          detail: item.diagnosis || item.section_booking || "Consultation review",
          status: STATUS_SEQUENCE[index % STATUS_SEQUENCE.length]
        }));

        const mappedOpd = opdRes.data.slice(0, 2).map((item, index) => ({
          section: "OPD",
          doctor: item.doctor || "Unassigned",
          day: weeklyDays[(index + 1) % weeklyDays.length],
          time: "10:00 - 12:00",
          title: `${formatPatientName(item)} OPD Review`,
          detail: `${item.diagnosis || "General review"} | BP ${item.bp || "N/A"}`,
          status: STATUS_SEQUENCE[(index + 1) % STATUS_SEQUENCE.length]
        }));

        const mappedMaternity = maternityRes.data.slice(0, 2).map((item, index) => ({
          section: "Maternity",
          doctor: item.doctor || "Unassigned",
          day: weeklyDays[(index + 2) % weeklyDays.length],
          time: item.deliveryTime || "13:00 - 14:00",
          title: `${item.name || "Patient"} Maternity Follow-up`,
          detail: `${item.deliveryType || "Delivery"} | Babies: ${item.numberOfBabies || 0}`,
          status: STATUS_SEQUENCE[(index + 2) % STATUS_SEQUENCE.length]
        }));

        const mappedTheater = theaterRes.data.slice(0, 2).map((item, index) => ({
          section: "Theater",
          doctor: item.doctor || "Unassigned",
          day: weeklyDays[(index + 3) % weeklyDays.length],
          time: item.time || "14:00 - 16:00",
          title: `${formatPatientName(item)} Theater Case`,
          detail: item.operation_type || "Procedure support",
          status: STATUS_SEQUENCE[(index + 3) % STATUS_SEQUENCE.length]
        }));

        setWeeklySchedule([
          ...mappedAppointments,
          ...mappedOpd,
          ...mappedMaternity,
          ...mappedTheater,
          ...fallbackWardRounds
        ]);
      } catch (err) {
        setError("Failed to load doctor dashboard data");
        setWeeklySchedule(fallbackWardRounds);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const doctorOptions = useMemo(() => {
    const doctors = Array.from(
      new Set(
        weeklySchedule
          .map((item) => item.doctor)
          .filter(Boolean)
      )
    );

    return ["All Doctors", ...doctors];
  }, [weeklySchedule]);

  const visibleSchedule = useMemo(() => {
    if (selectedDoctor === "All Doctors") {
      return weeklySchedule;
    }

    return weeklySchedule.filter((item) => item.doctor === selectedDoctor);
  }, [selectedDoctor, weeklySchedule]);

  const stats = useMemo(() => {
    const pending = visibleSchedule.filter((item) => item.status === "Pending").length;
    const referred = visibleSchedule.filter((item) => item.status === "Referred To").length;
    const completed = visibleSchedule.filter((item) => item.status === "Completed").length;
    const died = visibleSchedule.filter((item) => item.status === "Died").length;

    return [
      {
        title: "Weekly Schedule",
        value: visibleSchedule.length,
        subtitle: "Appointment, maternity, OPD, theater, and ward rounds",
        color: "#1565c0"
      },
      {
        title: "Pending Cases",
        value: pending,
        subtitle: "Waiting for doctor action this week",
        color: "#ef6c00"
      },
      {
        title: "Completed Cases",
        value: completed,
        subtitle: "Reviewed and closed this week",
        color: "#2e7d32"
      },
      {
        title: "Referred / Died",
        value: referred + died,
        subtitle: `${referred} referred, ${died} died`,
        color: "#8e24aa"
      }
    ];
  }, [visibleSchedule]);

  const sectionSummary = useMemo(
    () =>
      ["Appointment", "Maternity", "OPD", "Theater", "Ward Round"].map((section) => ({
        section,
        total: visibleSchedule.filter((item) => item.section === section).length
      })),
    [visibleSchedule]
  );

  const downloadReport = () => {
    let csv = `"CarePulse Doctor Weekly Report"\n`;
    csv += `"Generated","${new Date().toLocaleString()}"\n\n`;
    csv += `"Section","Total"\n`;
    sectionSummary.forEach((item) => {
      csv += `"${item.section}","${item.total}"\n`;
    });
    csv += `\n"Day","Section","Time","Title","Detail","Status"\n`;
    visibleSchedule.forEach((item) => {
      csv += `"${item.day}","${item.section}","${item.doctor || ""}","${item.time}","${item.title}","${item.detail}","${item.status}"\n`;
    });

    downloadCSV(csv, `doctor-weekly-report-${new Date().toISOString().split("T")[0]}.csv`);
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    window.location = "/";
  };

  return (
    <Box sx={{ minHeight: "100vh", background: "linear-gradient(180deg, #f7f9fc 0%, #eef3f8 100%)" }}>
      <AppBar
        position="sticky"
        elevation={0}
        sx={{
          background: "linear-gradient(135deg, #0f4c81 0%, #1b6ca8 100%)"
        }}
      >
        <Toolbar sx={{ minHeight: 76 }}>
          <Box sx={{ flexGrow: 1 }}>
            <Typography variant="h5" sx={{ fontWeight: 700 }}>
              Doctor Dashboard
            </Typography>
            <Typography sx={{ opacity: 0.85, fontSize: 13 }}>
              Welcome back, {user.username || "Doctor"}
            </Typography>
          </Box>

          <Stack direction="row" spacing={2} alignItems="center">
            <Button
              variant="contained"
              color="inherit"
              startIcon={<DownloadIcon />}
              onClick={downloadReport}
              sx={{ color: "#0f4c81", fontWeight: 700 }}
            >
              Download Report
            </Button>
            <Avatar sx={{ bgcolor: "rgba(255,255,255,0.18)" }}>
              {(user.username || "D").slice(0, 1).toUpperCase()}
            </Avatar>
            <IconButton color="inherit" onClick={logout} title="Logout">
              <LogoutIcon />
            </IconButton>
          </Stack>
        </Toolbar>
      </AppBar>

      <Container maxWidth="xl" sx={{ py: 4 }}>
        <Box sx={{ mb: 4 }}>
          <Typography variant="h4" sx={{ fontWeight: 700, color: "#16324f" }}>
            Weekly Clinical Overview
          </Typography>
          <Typography sx={{ color: "#58708a", mt: 1 }}>
            Track doctor schedules across appointments, maternity, OPD, theater, and ward rounds with weekly status updates.
          </Typography>
        </Box>

        <Card sx={{ mb: 4, borderRadius: 3, boxShadow: "0 16px 36px rgba(15, 76, 129, 0.08)" }}>
          <CardContent sx={{ p: 3 }}>
            <Grid container spacing={2} alignItems="center">
              <Grid size={{ xs: 12, md: 7 }}>
                <Typography variant="h6" sx={{ fontWeight: 700, color: "#16324f" }}>
                  Schedule By Doctor
                </Typography>
                <Typography sx={{ color: "#62788f", mt: 0.5 }}>
                  Filter weekly schedule items using the doctor names already entered in the system tables.
                </Typography>
              </Grid>
              <Grid size={{ xs: 12, md: 5 }}>
                <TextField
                  select
                  fullWidth
                  size="small"
                  label="Doctor"
                  value={selectedDoctor}
                  onChange={(event) => setSelectedDoctor(event.target.value)}
                >
                  {doctorOptions.map((doctor) => (
                    <MenuItem key={doctor} value={doctor}>
                      {doctor}
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>
            </Grid>
          </CardContent>
        </Card>

        {error && <Alert severity="warning" sx={{ mb: 3 }}>{error}</Alert>}

        {loading ? (
          <Box sx={{ display: "flex", justifyContent: "center", p: 6 }}>
            <CircularProgress />
          </Box>
        ) : (
          <>
            <Grid container spacing={3} sx={{ mb: 4 }}>
              {stats.map((stat) => (
                <Grid key={stat.title} size={{ xs: 12, sm: 6, lg: 3 }}>
                  <StatCard {...stat} />
                </Grid>
              ))}
            </Grid>

            <Grid container spacing={3} sx={{ mb: 4 }}>
              {sectionSummary.map((item) => (
                <Grid key={item.section} size={{ xs: 12, sm: 6, xl: 2.4 }}>
                  <Card sx={{ borderRadius: 3, boxShadow: "0 16px 36px rgba(15, 76, 129, 0.08)" }}>
                    <CardContent sx={{ p: 3 }}>
                      <Typography sx={{ fontSize: 13, color: "#5f7387" }}>{item.section}</Typography>
                      <Typography variant="h4" sx={{ fontWeight: 700, mt: 1, color: sectionAccent[item.section] }}>
                        {item.total}
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>

            <Card sx={{ borderRadius: 4, boxShadow: "0 20px 40px rgba(15, 76, 129, 0.08)" }}>
              <CardHeader
                title="Weekly Doctor Schedule"
                subheader="Status board for appointment, maternity, OPD, theater, and ward round activities"
              />
              <CardContent>
                <Grid container spacing={3}>
                  {visibleSchedule.map((item, index) => {
                    const Icon = sectionIcons[item.section];
                    const statusStyle = STATUS_STYLES[item.status] || STATUS_STYLES.Pending;

                    return (
                      <Grid key={`${item.section}-${item.day}-${index}`} size={{ xs: 12, md: 6, xl: 4 }}>
                        <Card
                          variant="outlined"
                          sx={{
                            borderRadius: 3,
                            borderColor: `${sectionAccent[item.section]}33`,
                            height: "100%"
                          }}
                        >
                          <CardContent sx={{ p: 3 }}>
                            <Stack direction="row" spacing={2} alignItems="flex-start">
                              <Box
                                sx={{
                                  width: 52,
                                  height: 52,
                                  borderRadius: 2,
                                  background: `${sectionAccent[item.section]}16`,
                                  color: sectionAccent[item.section],
                                  display: "flex",
                                  alignItems: "center",
                                  justifyContent: "center",
                                  flexShrink: 0
                                }}
                              >
                                <Icon />
                              </Box>

                              <Box sx={{ flex: 1 }}>
                                <Stack direction="row" spacing={1} sx={{ mb: 1.5, flexWrap: "wrap" }}>
                                  <Box
                                    sx={{
                                      px: 1.2,
                                      py: 0.5,
                                      borderRadius: 4,
                                      fontSize: 12,
                                      fontWeight: 700,
                                      backgroundColor: `${sectionAccent[item.section]}16`,
                                      color: sectionAccent[item.section]
                                    }}
                                  >
                                    {item.section}
                                  </Box>
                                  <Box
                                    sx={{
                                      px: 1.2,
                                      py: 0.5,
                                      borderRadius: 4,
                                      fontSize: 12,
                                      fontWeight: 700,
                                      backgroundColor: statusStyle.bg,
                                      color: statusStyle.color
                                    }}
                                  >
                                    {item.status}
                                  </Box>
                                </Stack>

                                <Typography variant="subtitle2" sx={{ color: "#5f7387" }}>
                                  {item.day} | {item.time}
                                </Typography>
                                <Typography sx={{ color: sectionAccent[item.section], fontWeight: 700, mt: 1 }}>
                                  Doctor: {item.doctor || "Ward Team"}
                                </Typography>
                                <Typography variant="h6" sx={{ fontWeight: 700, color: "#16324f", mt: 1 }}>
                                  {item.title}
                                </Typography>
                                <Typography sx={{ color: "#62788f", mt: 1 }}>
                                  {item.detail}
                                </Typography>
                              </Box>
                            </Stack>
                          </CardContent>
                        </Card>
                      </Grid>
                    );
                  })}
                </Grid>
              </CardContent>
            </Card>
          </>
        )}
      </Container>
    </Box>
  );
}
