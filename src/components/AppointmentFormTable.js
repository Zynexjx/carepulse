import { useEffect, useState } from "react";
import axios from "axios";
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  CardHeader,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
  IconButton,
  MenuItem,
  TextField,
  Tooltip
} from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import EventIcon from "@mui/icons-material/Event";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";

const initialForm = {
  name: "",
  surname: "",
  sex: "",
  age: "",
  diagnosis: "",
  counselor: "",
  section_booking: "",
  time_period: "",
  fees: ""
};

export default function AppointmentFormTable({ refreshTrigger }) {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [tableLoading, setTableLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [formData, setFormData] = useState(initialForm);
  const [editForm, setEditForm] = useState(initialForm);
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [editOpen, setEditOpen] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState(null);

  const fetchAppointments = async () => {
    setTableLoading(true);
    try {
      const response = await axios.get("http://localhost:5000/api/reception/appointments");
      setAppointments(response.data.map((item) => ({ id: item._id, ...item })));
      setError("");
    } catch (err) {
      setError("Failed to fetch appointments");
    } finally {
      setTableLoading(false);
    }
  };

  useEffect(() => {
    fetchAppointments();
  }, [refreshTrigger]);

  const handleChange = (setter) => (event) => {
    const { name, value } = event.target;
    setter((prev) => ({
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
      await axios.post("http://localhost:5000/api/reception/appointment", {
        ...formData,
        section: "appointment"
      });
      setSuccess("Appointment booked successfully.");
      setFormData(initialForm);
      fetchAppointments();
    } catch (err) {
      setError(err.response?.data?.message || "Error booking appointment");
    } finally {
      setLoading(false);
    }
  };

  const handleSaveEdit = async () => {
    setLoading(true);
    setError("");

    try {
      await axios.put(`http://localhost:5000/api/reception/appointment/${selectedAppointment._id}`, editForm);
      setSuccess("Appointment updated successfully.");
      setEditOpen(false);
      fetchAppointments();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to update appointment");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    setLoading(true);
    setError("");

    try {
      await axios.delete(`http://localhost:5000/api/reception/appointment/${deleteConfirm._id}`);
      setSuccess("Appointment deleted successfully.");
      setDeleteConfirm(null);
      fetchAppointments();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to delete appointment");
    } finally {
      setLoading(false);
    }
  };

  const columns = [
    { field: "appointment_id", headerName: "Appointment ID", width: 130 },
    { field: "name", headerName: "Name", width: 120 },
    { field: "surname", headerName: "Surname", width: 120 },
    { field: "sex", headerName: "Sex", width: 90 },
    { field: "age", headerName: "Age", width: 90 },
    { field: "diagnosis", headerName: "Diagnosis / Condition", width: 180 },
    { field: "counselor", headerName: "Counselor", width: 130 },
    { field: "section_booking", headerName: "Section Booking", width: 150 },
    { field: "time_period", headerName: "Time / Period", width: 130 },
    { field: "fees", headerName: "Fees", width: 90 },
    {
      field: "actions",
      headerName: "Actions",
      width: 120,
      sortable: false,
      renderCell: (params) => (
        <Box sx={{ display: "flex", gap: 1 }}>
          <Tooltip title="Edit">
            <IconButton
              size="small"
              onClick={() => {
                setSelectedAppointment(params.row);
                setEditForm(params.row);
                setEditOpen(true);
              }}
            >
              <EditIcon fontSize="small" />
            </IconButton>
          </Tooltip>
          <Tooltip title="Delete">
            <IconButton size="small" color="error" onClick={() => setDeleteConfirm(params.row)}>
              <DeleteIcon fontSize="small" />
            </IconButton>
          </Tooltip>
        </Box>
      )
    }
  ];

  const renderFields = (values, setter) => (
    <Grid container spacing={2}>
      <Grid size={{ xs: 12, sm: 6 }}>
        <TextField fullWidth label="Name" name="name" value={values.name} onChange={handleChange(setter)} size="small" required />
      </Grid>
      <Grid size={{ xs: 12, sm: 6 }}>
        <TextField fullWidth label="Surname" name="surname" value={values.surname} onChange={handleChange(setter)} size="small" required />
      </Grid>
      <Grid size={{ xs: 12, sm: 6 }}>
        <TextField fullWidth select label="Sex" name="sex" value={values.sex} onChange={handleChange(setter)} size="small" required>
          <MenuItem value="Male">Male</MenuItem>
          <MenuItem value="Female">Female</MenuItem>
          <MenuItem value="Other">Other</MenuItem>
        </TextField>
      </Grid>
      <Grid size={{ xs: 12, sm: 6 }}>
        <TextField fullWidth type="number" label="Age" name="age" value={values.age} onChange={handleChange(setter)} size="small" required />
      </Grid>
      <Grid size={{ xs: 12 }}>
        <TextField fullWidth multiline rows={2} label="Diagnosis / Condition" name="diagnosis" value={values.diagnosis} onChange={handleChange(setter)} size="small" required />
      </Grid>
      <Grid size={{ xs: 12, sm: 6 }}>
        <TextField fullWidth label="Counselor" name="counselor" value={values.counselor} onChange={handleChange(setter)} size="small" required />
      </Grid>
      <Grid size={{ xs: 12, sm: 6 }}>
        <TextField fullWidth label="Section Booking" name="section_booking" value={values.section_booking} onChange={handleChange(setter)} size="small" required />
      </Grid>
      <Grid size={{ xs: 12, sm: 6 }}>
        <TextField fullWidth label="Time / Period" name="time_period" value={values.time_period} onChange={handleChange(setter)} size="small" required />
      </Grid>
      <Grid size={{ xs: 12, sm: 6 }}>
        <TextField fullWidth type="number" label="Fees" name="fees" value={values.fees} onChange={handleChange(setter)} size="small" required />
      </Grid>
    </Grid>
  );

  return (
    <Box>
      <Grid container spacing={3}>
        <Grid size={{ xs: 12, lg: 4 }}>
          <Card sx={{ borderRadius: 3 }}>
            <CardHeader
              avatar={<EventIcon sx={{ color: "white" }} />}
              title="Book Appointment"
              subheader="Counseling and rehabilitation section visits"
              sx={{
                color: "white",
                background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)"
              }}
            />
            <CardContent sx={{ p: 3 }}>
              {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
              {success && <Alert severity="success" sx={{ mb: 2 }}>{success}</Alert>}
              <Box component="form" onSubmit={handleSubmit}>
                {renderFields(formData, setFormData)}
                <Button type="submit" variant="contained" sx={{ mt: 3 }} fullWidth disabled={loading}>
                  {loading ? <CircularProgress size={20} color="inherit" /> : "Save Appointment"}
                </Button>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid size={{ xs: 12, lg: 8 }}>
          <Card sx={{ borderRadius: 3 }}>
            <CardHeader title="Appointment Table" subheader={`Total appointments: ${appointments.length}`} />
            <CardContent sx={{ p: 0 }}>
              {tableLoading ? (
                <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", height: 460 }}>
                  <CircularProgress />
                </Box>
              ) : (
                <Box sx={{ height: 520, width: "100%" }}>
                  <DataGrid
                    rows={appointments}
                    columns={columns}
                    disableRowSelectionOnClick
                    pageSizeOptions={[5, 10, 20]}
                    initialState={{ pagination: { paginationModel: { page: 0, pageSize: 5 } } }}
                  />
                </Box>
              )}
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Dialog open={editOpen} onClose={() => setEditOpen(false)} fullWidth maxWidth="md">
        <DialogTitle>Edit Appointment</DialogTitle>
        <DialogContent dividers>{renderFields(editForm, setEditForm)}</DialogContent>
        <DialogActions>
          <Button onClick={() => setEditOpen(false)}>Cancel</Button>
          <Button variant="contained" onClick={handleSaveEdit} disabled={loading}>Save</Button>
        </DialogActions>
      </Dialog>

      <Dialog open={Boolean(deleteConfirm)} onClose={() => setDeleteConfirm(null)}>
        <DialogTitle>Delete Appointment</DialogTitle>
        <DialogContent>Delete the selected appointment record?</DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteConfirm(null)}>Cancel</Button>
          <Button color="error" variant="contained" onClick={handleDelete} disabled={loading}>Delete</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
