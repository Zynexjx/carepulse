import { useState } from "react";
import axios from "axios";
import {
  Box,
  Button,
  Card,
  CardContent,
  CardHeader,
  Typography,
  Alert,
  FormControlLabel,
  Checkbox,
  CircularProgress,
  Divider
} from "@mui/material";
import DownloadIcon from "@mui/icons-material/Download";

export default function ReportsGenerator() {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");
  const [selectedReports, setSelectedReports] = useState({
    appointments: true,
    rehab: true,
    emergency: true,
    patients: true
  });

  const handleCheckboxChange = (e) => {
    setSelectedReports(prev => ({
      ...prev,
      [e.target.name]: e.target.checked
    }));
  };

  const generateExcelReport = async () => {
    setLoading(true);
    setError("");
    setSuccess("");

    try {
      // Fetch data for selected reports
      const data = {};

      if (selectedReports.appointments) {
        const res = await axios.get("http://localhost:5000/api/reception/appointments");
        data.appointments = res.data;
      }
      if (selectedReports.rehab) {
        const res = await axios.get("http://localhost:5000/api/reception/rehabs");
        data.rehab = res.data;
      }
      if (selectedReports.emergency) {
        const res = await axios.get("http://localhost:5000/api/reception/emergencies");
        data.emergency = res.data;
      }
      if (selectedReports.patients) {
        const res = await axios.get("http://localhost:5000/api/reception/stats");
        data.stats = res.data;
      }

      // Create and download CSV
      const csv = convertToCSV(data);
      downloadCSV(csv, `care-pulse-report-${new Date().toISOString().split('T')[0]}.csv`);

      setSuccess("Excel report generated and downloaded successfully!");
      setTimeout(() => setSuccess(""), 3000);
    } catch (err) {
      setError("Failed to generate report");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const convertToCSV = (data) => {
    let csv = "CarePulse Hospital Management System - Report\n";
    csv += `Generated: ${new Date().toLocaleString()}\n\n`;

    if (data.appointments && data.appointments.length > 0) {
      csv += "APPOINTMENTS REPORT\n";
      csv += "ID,Name,Surname,Age,Sex,Diagnosis,Section,Counselor,Time Period,Fees\n";
      data.appointments.forEach(apt => {
        csv += `${apt.appointment_id || ""},${apt.name || ""},${apt.surname || ""},${apt.age || ""},${apt.sex || ""},${apt.diagnosis || ""},${apt.section_booking || ""},${apt.counselor || ""},${apt.time_period || ""},${apt.fees || ""}\n`;
      });
      csv += "\n";
    }

    if (data.rehab && data.rehab.length > 0) {
      csv += "REHAB SESSIONS REPORT\n";
      csv += "ID,Patient Name,Age,Type,Session Count,Progress,Status\n";
      data.rehab.forEach(rehab => {
        csv += `${rehab._id || ""},${rehab.name || ""},${rehab.age || ""},${rehab.type || ""},${rehab.session_count || ""},${rehab.progress || ""},${rehab.status || ""}\n`;
      });
      csv += "\n";
    }

    if (data.emergency && data.emergency.length > 0) {
      csv += "EMERGENCY CASES REPORT\n";
      csv += "ID,Patient Name,Age,Condition,Priority,Doctor Assigned,Treatment Status\n";
      data.emergency.forEach(emg => {
        csv += `${emg._id || ""},${emg.name || ""},${emg.age || ""},${emg.condition || ""},${emg.priority || ""},${emg.doctor_assigned || ""},${emg.treatment_status || ""}\n`;
      });
      csv += "\n";
    }

    if (data.stats) {
      csv += "STATISTICS SUMMARY\n";
      csv += `Total Patients,${data.stats.patients || 0}\n`;
      csv += `Total Appointments,${data.stats.appointments || 0}\n`;
      csv += `Total Rehab Sessions,${data.stats.rehab || 0}\n`;
      csv += `Total Emergency Cases,${data.stats.emergency || 0}\n`;
    }

    return csv;
  };

  const downloadCSV = (csv, filename) => {
    const element = document.createElement("a");
    element.setAttribute("href", "data:text/csv;charset=utf-8," + encodeURIComponent(csv));
    element.setAttribute("download", filename);
    element.style.display = "none";
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  return (
    <Box>
      <Card
        sx={{
          background: "linear-gradient(135deg, #667eea15 0%, #764ba215 100%)",
          border: "1px solid rgba(102, 126, 234, 0.2)",
          boxShadow: "0 4px 16px rgba(0,0,0,0.08)",
          borderRadius: "12px"
        }}
      >
        <CardHeader
          title="Generate Reports"
          subheader="Select the reports you want to include in your download"
          sx={{
            background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
            color: "white",
            "& .MuiCardHeader-subheader": {
              color: "rgba(255,255,255,0.85)"
            }
          }}
        />
        <Divider />
        <CardContent sx={{ p: 4 }}>
          <Typography 
            variant="subtitle2" 
            gutterBottom 
            sx={{ 
              mb: 3,
              fontWeight: 600,
              fontSize: "14px",
              textTransform: "uppercase",
              letterSpacing: 0.5,
              color: "#333"
            }}
          >
            📋 Report Options:
          </Typography>

          <Box sx={{ mb: 4, pl: 2, display: "flex", flexDirection: "column", gap: 2 }}>
            <FormControlLabel
              control={
                <Checkbox
                  name="appointments"
                  checked={selectedReports.appointments}
                  onChange={handleCheckboxChange}
                  sx={{
                    color: "#667eea",
                    "&.Mui-checked": {
                      color: "#667eea"
                    }
                  }}
                />
              }
              label={<Typography sx={{ fontWeight: 500 }}>Appointments Report</Typography>}
            />
            <FormControlLabel
              control={
                <Checkbox
                  name="rehab"
                  checked={selectedReports.rehab}
                  onChange={handleCheckboxChange}
                  sx={{
                    color: "#667eea",
                    "&.Mui-checked": {
                      color: "#667eea"
                    }
                  }}
                />
              }
              label={<Typography sx={{ fontWeight: 500 }}>Rehab Sessions Report</Typography>}
            />
            <FormControlLabel
              control={
                <Checkbox
                  name="emergency"
                  checked={selectedReports.emergency}
                  onChange={handleCheckboxChange}
                  sx={{
                    color: "#667eea",
                    "&.Mui-checked": {
                      color: "#667eea"
                    }
                  }}
                />
              }
              label={<Typography sx={{ fontWeight: 500 }}>Emergency Cases Report</Typography>}
            />
            <FormControlLabel
              control={
                <Checkbox
                  name="patients"
                  checked={selectedReports.patients}
                  onChange={handleCheckboxChange}
                  sx={{
                    color: "#667eea",
                    "&.Mui-checked": {
                      color: "#667eea"
                    }
                  }}
                />
              }
              label={<Typography sx={{ fontWeight: 500 }}>Statistics Summary</Typography>}
            />
          </Box>

          {error && <Alert severity="error" sx={{ mb: 2, borderRadius: "8px" }}>{error}</Alert>}
          {success && <Alert severity="success" sx={{ mb: 2, borderRadius: "8px" }}>{success}</Alert>}

          <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap" }}>
            <Button
              variant="contained"
              startIcon={loading ? <CircularProgress size={20} color="inherit" /> : <DownloadIcon />}
              onClick={generateExcelReport}
              disabled={loading || !Object.values(selectedReports).some(v => v)}
              sx={{ 
                mt: 2,
                background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                borderRadius: "8px",
                textTransform: "none",
                fontWeight: 600,
                fontSize: "15px",
                py: 1.5,
                px: 3,
                transition: "all 0.3s ease",
                "&:hover": {
                  transform: "translateY(-2px)",
                  boxShadow: "0 8px 20px rgba(102, 126, 234, 0.4)"
                },
                "&:disabled": {
                  background: "#ccc"
                }
              }}
            >
              {loading ? "Generating..." : "Download CSV Report"}
            </Button>
          </Box>

          <Box 
            sx={{ 
              mt: 4, 
              p: 3, 
              borderRadius: "8px",
              background: "#f9f9f9",
              border: "1px solid #e0e0e0"
            }}
          >
            <Typography variant="body2" sx={{ color: "#666" }}>
              📊 <strong>Pro Tip:</strong> Reports include all selected data and can be imported into Excel, Google Sheets, or other spreadsheet applications.
            </Typography>
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
}
