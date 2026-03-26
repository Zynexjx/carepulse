import { useState } from "react";
import axios from "axios";
import {
  Box,
  TextField,
  Button,
  Typography,
  MenuItem,
  Alert,
  CircularProgress,
  Card,
  CardContent
} from "@mui/material";
import PersonAddIcon from "@mui/icons-material/PersonAdd";

export default function PatientForm({ onSuccess }) {

  const [formData, setFormData] = useState({
    name: "",
    surname: "",
    sex: "",
    age: "",
    diagnosis: "",
    section: ""
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // ✅ AUTO ID GENERATOR
  const generatePatientId = (section) => {
    const random = Math.floor(100 + Math.random() * 900);

    switch (section) {
      case "appointment":
        return `APT-${random}`;
      case "emergency":
        return `EMG-${random}`;
      case "rehab":
        return `REH-${random}`;
      default:
        return `PAT-${random}`;
    }
  };

  const handleChange = (e) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setLoading(true);
    setError("");
    setSuccess("");

    try {
      const payload = {
        ...formData,
        patientId: generatePatientId(formData.section)
      };

      await axios.post(
        "http://localhost:5000/api/reception/patient",
        payload
      );

      setSuccess("Patient registered successfully!");

      setFormData({
        name: "",
        surname: "",
        sex: "",
        age: "",
        diagnosis: "",
        section: ""
      });

      onSuccess?.();

    } catch (err) {
      setError(err.response?.data?.message || "Registration failed");
    } finally {
      setLoading(false);
      setTimeout(() => setSuccess(""), 3000);
    }
  };

  return (
    <Card sx={{ maxWidth: 600, mx: "auto" }}>
      <Box sx={{
        background: "linear-gradient(135deg,#667eea,#764ba2)",
        p: 3,
        color: "white"
      }}>
        <Box sx={{ display: "flex", gap: 2 }}>
          <PersonAddIcon />
          <Typography variant="h5">
            Patient Registration
          </Typography>
        </Box>
      </Box>

      <CardContent>
        {error && <Alert severity="error">{error}</Alert>}
        {success && <Alert severity="success">{success}</Alert>}

        <Box component="form" onSubmit={handleSubmit}
          sx={{ display: "flex", flexDirection: "column", gap: 2 }}>

          <TextField label="First Name" name="name" required value={formData.name} onChange={handleChange}/>
          <TextField label="Last Name" name="surname" required value={formData.surname} onChange={handleChange}/>

          <TextField select label="Sex" name="sex" required value={formData.sex} onChange={handleChange}>
            <MenuItem value="Male">Male</MenuItem>
            <MenuItem value="Female">Female</MenuItem>
          </TextField>

          <TextField type="number" label="Age" name="age" required value={formData.age} onChange={handleChange}/>

          <TextField multiline rows={3}
            label="Diagnosis"
            name="diagnosis"
            required
            value={formData.diagnosis}
            onChange={handleChange}
          />

          <TextField select label="Section" name="section"
            required value={formData.section} onChange={handleChange}>
            <MenuItem value="appointment">Appointment</MenuItem>
            <MenuItem value="rehab">Rehab</MenuItem>
            <MenuItem value="emergency">Emergency</MenuItem>
          </TextField>

          <Button type="submit" variant="contained" disabled={loading}>
            {loading ? <CircularProgress size={20}/> : "Register Patient"}
          </Button>

        </Box>
      </CardContent>
    </Card>
  );
}