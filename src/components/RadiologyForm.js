import { useState } from "react";
import axios from "axios";
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  CardHeader,
  CircularProgress,
  Grid,
  MenuItem,
  TextField
} from "@mui/material";
import ImageSearchIcon from "@mui/icons-material/ImageSearch";

const initialForm = {
  name: "",
  surname: "",
  sex: "",
  age: "",
  doctor: "",
  scanType: "",
  date: "",
  notes: "",
  fees: ""
};

const generateId = () => `RAD-${Math.floor(1000 + Math.random() * 9000)}`;

export default function RadiologyForm() {
  const [formData, setFormData] = useState(initialForm);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    try {
      await axios.post("http://localhost:5000/api/nurse/radiology", {
        ...formData,
        radiology_id: generateId()
      });
      setSuccess("Radiology patient registered successfully");
      setFormData(initialForm);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to register radiology patient");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card sx={{ maxWidth: 980, borderRadius: 3, boxShadow: "0 16px 36px rgba(15, 76, 129, 0.10)" }}>
      <CardHeader
        avatar={<ImageSearchIcon sx={{ color: "white" }} />}
        title="Radiology Registration"
        subheader="Register patients for radiology and imaging requests"
        sx={{
          color: "white",
          background: "linear-gradient(135deg, #00897b 0%, #00897bcc 100%)"
        }}
      />
      <CardContent sx={{ p: 3 }}>
        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
        {success && <Alert severity="success" sx={{ mb: 2 }}>{success}</Alert>}

        <Box component="form" onSubmit={handleSubmit}>
          <Grid container spacing={2}>
            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField fullWidth label="Name" name="name" value={formData.name} onChange={handleChange} required size="small" />
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField fullWidth label="Surname" name="surname" value={formData.surname} onChange={handleChange} required size="small" />
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField fullWidth label="Sex" name="sex" value={formData.sex} onChange={handleChange} required select size="small">
                <MenuItem value="Male">Male</MenuItem>
                <MenuItem value="Female">Female</MenuItem>
                <MenuItem value="Other">Other</MenuItem>
              </TextField>
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField fullWidth label="Age" name="age" type="number" value={formData.age} onChange={handleChange} required size="small" />
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField fullWidth label="Doctor" name="doctor" value={formData.doctor} onChange={handleChange} required size="small" />
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField fullWidth label="Scan Type" name="scanType" value={formData.scanType} onChange={handleChange} required size="small" />
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField
                fullWidth
                label="Date"
                name="date"
                type="date"
                value={formData.date}
                onChange={handleChange}
                required
                size="small"
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField fullWidth label="Fees" name="fees" type="number" value={formData.fees} onChange={handleChange} required size="small" />
            </Grid>
            <Grid size={{ xs: 12 }}>
              <TextField
                fullWidth
                label="Notes"
                name="notes"
                value={formData.notes}
                onChange={handleChange}
                multiline
                rows={3}
                size="small"
              />
            </Grid>
            <Grid size={{ xs: 12 }}>
              <Button type="submit" variant="contained" disabled={loading}>
                {loading ? <CircularProgress size={20} color="inherit" /> : "Register Radiology Patient"}
              </Button>
            </Grid>
          </Grid>
        </Box>
      </CardContent>
    </Card>
  );
}
