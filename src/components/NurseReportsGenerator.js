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

const initialSelection = {
  opd: true,
  theater: true,
  maternity: true,
  radiology: true,
  summary: true
};

const downloadCSV = (csv, filename) => {
  const element = document.createElement("a");
  element.setAttribute("href", `data:text/csv;charset=utf-8,${encodeURIComponent(csv)}`);
  element.setAttribute("download", filename);
  element.style.display = "none";
  document.body.appendChild(element);
  element.click();
  document.body.removeChild(element);
};

const line = (values) => `${values.map((value) => `"${String(value ?? "").replaceAll('"', '""')}"`).join(",")}\n`;

export default function NurseReportsGenerator() {
  const [selected, setSelected] = useState(initialSelection);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleCheckboxChange = (event) => {
    const { name, checked } = event.target;
    setSelected((prev) => ({
      ...prev,
      [name]: checked
    }));
  };

  const generateReport = async () => {
    setLoading(true);
    setError("");
    setSuccess("");

    try {
      const [opdRes, theaterRes, maternityRes, radiologyRes, statsRes] = await Promise.all([
        axios.get("http://localhost:5000/api/nurse/opd"),
        axios.get("http://localhost:5000/api/nurse/theater"),
        axios.get("http://localhost:5000/api/nurse/maternity"),
        axios.get("http://localhost:5000/api/nurse/radiology"),
        axios.get("http://localhost:5000/api/nurse/stats")
      ]);

      const sections = {
        opd: opdRes.data,
        theater: theaterRes.data,
        maternity: maternityRes.data,
        radiology: radiologyRes.data
      };

      let csv = line(["CarePulse Nurse Dashboard Report"]);
      csv += line([`Generated`, new Date().toLocaleString()]);
      csv += "\n";

      if (selected.summary) {
        csv += line(["SUMMARY"]);
        csv += line(["OPD Patients", statsRes.data.opd]);
        csv += line(["Theater Cases", statsRes.data.theater]);
        csv += line(["Maternity Records", statsRes.data.maternity]);
        csv += line(["Radiology Requests", statsRes.data.radiology]);
        csv += line([
          "Malaria Positive",
          sections.opd.filter((item) => item.malariaTest === "Positive").length
        ]);
        csv += line([
          "Malaria Negative",
          sections.opd.filter((item) => item.malariaTest === "Negative").length
        ]);
        csv += "\n";
      }

      if (selected.opd) {
        csv += line(["OPD RECORDS"]);
        csv += line(["OPD ID", "Name", "Surname", "Sex", "Age", "Date", "Diagnosis", "Temperature", "Doctor", "BP", "Malaria Test", "Fees"]);
        sections.opd.forEach((item) => {
          csv += line([
            item.opd_id,
            item.name,
            item.surname,
            item.sex,
            item.age,
            item.date ? new Date(item.date).toLocaleDateString() : "",
            item.diagnosis,
            item.temperature,
            item.doctor,
            item.bp,
            item.malariaTest,
            item.fees
          ]);
        });
        csv += "\n";
      }

      if (selected.theater) {
        csv += line(["THEATER RECORDS"]);
        csv += line(["Theater ID", "Name", "Surname", "Doctor", "Sex", "Age", "Operation Type", "Next of Kin", "BP", "Complications", "Other Operation", "Date", "Time", "Fees"]);
        sections.theater.forEach((item) => {
          csv += line([
            item.theater_id,
            item.name,
            item.surname,
            item.doctor,
            item.sex,
            item.age,
            item.operation_type,
            item.nextOfKin,
            item.bp,
            item.complications,
            item.otherOperationDone,
            item.date ? new Date(item.date).toLocaleDateString() : "",
            item.time,
            item.fees
          ]);
        });
        csv += "\n";
      }

      if (selected.maternity) {
        csv += line(["MATERNITY RECORDS"]);
        csv += line(["Maternity ID", "Name", "Age", "Doctor", "Date of Delivery", "Delivery Type", "Delivery Time", "Number of Babies", "Babies Sex", "Fees"]);
        sections.maternity.forEach((item) => {
          csv += line([
            item.maternity_id,
            item.name,
            item.age,
            item.doctor,
            item.dateOfDelivery ? new Date(item.dateOfDelivery).toLocaleDateString() : "",
            item.deliveryType,
            item.deliveryTime,
            item.numberOfBabies,
            item.babiesSex,
            item.fees
          ]);
        });
        csv += "\n";
      }

      if (selected.radiology) {
        csv += line(["RADIOLOGY RECORDS"]);
        csv += line(["Radiology ID", "Name", "Surname", "Sex", "Age", "Doctor", "Scan Type", "Date", "Notes", "Fees"]);
        sections.radiology.forEach((item) => {
          csv += line([
            item.radiology_id,
            item.name,
            item.surname,
            item.sex,
            item.age,
            item.doctor,
            item.scanType,
            item.date ? new Date(item.date).toLocaleDateString() : "",
            item.notes,
            item.fees
          ]);
        });
        csv += "\n";
      }

      downloadCSV(csv, `nurse-dashboard-report-${new Date().toISOString().split("T")[0]}.csv`);
      setSuccess("Nurse report downloaded successfully.");
    } catch (err) {
      setError("Failed to generate nurse report");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card sx={{ borderRadius: 3, boxShadow: "0 16px 36px rgba(15, 76, 129, 0.10)" }}>
      <CardHeader
        title="Nurse Reports"
        subheader="Download department reports and a malaria summary"
        sx={{
          color: "white",
          background: "linear-gradient(135deg, #0f4c81 0%, #1b6ca8 100%)"
        }}
      />
      <Divider />
      <CardContent sx={{ p: 3 }}>
        <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
          <FormControlLabel control={<Checkbox name="summary" checked={selected.summary} onChange={handleCheckboxChange} />} label="Summary Stats & Malaria Overview" />
          <FormControlLabel control={<Checkbox name="opd" checked={selected.opd} onChange={handleCheckboxChange} />} label="OPD Records" />
          <FormControlLabel control={<Checkbox name="theater" checked={selected.theater} onChange={handleCheckboxChange} />} label="Theater Records" />
          <FormControlLabel control={<Checkbox name="maternity" checked={selected.maternity} onChange={handleCheckboxChange} />} label="Maternity Records" />
          <FormControlLabel control={<Checkbox name="radiology" checked={selected.radiology} onChange={handleCheckboxChange} />} label="Radiology Records" />
        </Box>

        {error && <Alert severity="error" sx={{ mt: 2 }}>{error}</Alert>}
        {success && <Alert severity="success" sx={{ mt: 2 }}>{success}</Alert>}

        <Button
          sx={{ mt: 3 }}
          variant="contained"
          startIcon={loading ? <CircularProgress size={18} color="inherit" /> : <DownloadIcon />}
          onClick={generateReport}
          disabled={loading || !Object.values(selected).some(Boolean)}
        >
          {loading ? "Generating Report..." : "Download Nurse CSV"}
        </Button>

        <Typography sx={{ mt: 2, color: "text.secondary", fontSize: 13 }}>
          The report includes selected sections, malaria-positive versus negative counts from OPD, and dashboard summary totals.
        </Typography>
      </CardContent>
    </Card>
  );
}
