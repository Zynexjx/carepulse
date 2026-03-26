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
import LocalHospitalIcon from "@mui/icons-material/LocalHospital";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";

const initialForm = {
  name: "",
  surname: "",
  doctor: "",
  date: "",
  sex: "",
  diagnosis: "",
  operation: "",
  assistantNurse: "",
  age: "",
  fees: ""
};

export default function EmergencyFormTable({ refreshTrigger }) {
  const [rows, setRows] = useState([]);
  const [formData, setFormData] = useState(initialForm);
  const [editForm, setEditForm] = useState(initialForm);
  const [selectedRow, setSelectedRow] = useState(null);
  const [deleteRow, setDeleteRow] = useState(null);
  const [editOpen, setEditOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [tableLoading, setTableLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const fetchRows = async () => {
    setTableLoading(true);
    try {
      const response = await axios.get("http://localhost:5000/api/reception/emergencies");
      setRows(response.data.map((item) => ({ id: item._id, ...item })));
      setError("");
    } catch (err) {
      setError("Failed to fetch emergency records");
    } finally {
      setTableLoading(false);
    }
  };

  useEffect(() => {
    fetchRows();
  }, [refreshTrigger]);

  const handleChange = (setter) => (event) => {
    const { name, value } = event.target;
    setter((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");
    try {
      await axios.post("http://localhost:5000/api/reception/emergency", { ...formData, section: "emergency" });
      setSuccess("Emergency record created successfully.");
      setFormData(initialForm);
      fetchRows();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to create emergency record");
    } finally {
      setLoading(false);
    }
  };

  const handleSaveEdit = async () => {
    setLoading(true);
    setError("");
    try {
      await axios.put(`http://localhost:5000/api/reception/emergency/${selectedRow._id}`, editForm);
      setSuccess("Emergency record updated successfully.");
      setEditOpen(false);
      fetchRows();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to update emergency record");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    setLoading(true);
    setError("");
    try {
      await axios.delete(`http://localhost:5000/api/reception/emergency/${deleteRow._id}`);
      setSuccess("Emergency record deleted successfully.");
      setDeleteRow(null);
      fetchRows();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to delete emergency record");
    } finally {
      setLoading(false);
    }
  };

  const columns = [
    { field: "codeid", headerName: "Code ID", width: 120 },
    { field: "name", headerName: "Name", width: 120 },
    { field: "surname", headerName: "Surname", width: 120 },
    { field: "doctor", headerName: "Doctor", width: 120 },
    {
      field: "date",
      headerName: "Date",
      width: 120,
      valueGetter: (value) => (value ? new Date(value).toLocaleDateString() : "")
    },
    { field: "sex", headerName: "Sex", width: 90 },
    { field: "diagnosis", headerName: "Diagnosis", width: 160 },
    { field: "operation", headerName: "Operation", width: 130 },
    { field: "assistantNurse", headerName: "Assistant Nurse", width: 150 },
    { field: "age", headerName: "Age", width: 80 },
    { field: "fees", headerName: "Fees", width: 90 },
    {
      field: "actions",
      headerName: "Actions",
      width: 120,
      sortable: false,
      renderCell: (params) => (
        <Box sx={{ display: "flex", gap: 1 }}>
          <Tooltip title="Edit">
            <IconButton size="small" onClick={() => { setSelectedRow(params.row); setEditForm(params.row); setEditOpen(true); }}>
              <EditIcon fontSize="small" />
            </IconButton>
          </Tooltip>
          <Tooltip title="Delete">
            <IconButton size="small" color="error" onClick={() => setDeleteRow(params.row)}>
              <DeleteIcon fontSize="small" />
            </IconButton>
          </Tooltip>
        </Box>
      )
    }
  ];

  const renderFields = (values, setter) => (
    <Grid container spacing={2}>
      <Grid size={{ xs: 12, sm: 6 }}><TextField fullWidth label="Name" name="name" value={values.name} onChange={handleChange(setter)} size="small" required /></Grid>
      <Grid size={{ xs: 12, sm: 6 }}><TextField fullWidth label="Surname" name="surname" value={values.surname} onChange={handleChange(setter)} size="small" required /></Grid>
      <Grid size={{ xs: 12, sm: 6 }}><TextField fullWidth label="Doctor" name="doctor" value={values.doctor} onChange={handleChange(setter)} size="small" required /></Grid>
      <Grid size={{ xs: 12, sm: 6 }}><TextField fullWidth type="date" label="Date" name="date" value={values.date ? String(values.date).split("T")[0] : ""} onChange={handleChange(setter)} size="small" required InputLabelProps={{ shrink: true }} /></Grid>
      <Grid size={{ xs: 12, sm: 6 }}><TextField fullWidth select label="Sex" name="sex" value={values.sex} onChange={handleChange(setter)} size="small" required><MenuItem value="Male">Male</MenuItem><MenuItem value="Female">Female</MenuItem><MenuItem value="Other">Other</MenuItem></TextField></Grid>
      <Grid size={{ xs: 12, sm: 6 }}><TextField fullWidth type="number" label="Age" name="age" value={values.age} onChange={handleChange(setter)} size="small" required /></Grid>
      <Grid size={{ xs: 12 }}><TextField fullWidth multiline rows={2} label="Diagnosis" name="diagnosis" value={values.diagnosis} onChange={handleChange(setter)} size="small" required /></Grid>
      <Grid size={{ xs: 12, sm: 6 }}><TextField fullWidth label="Operation" name="operation" value={values.operation} onChange={handleChange(setter)} size="small" required /></Grid>
      <Grid size={{ xs: 12, sm: 6 }}><TextField fullWidth label="Assistant Nurse" name="assistantNurse" value={values.assistantNurse} onChange={handleChange(setter)} size="small" required /></Grid>
      <Grid size={{ xs: 12, sm: 6 }}><TextField fullWidth type="number" label="Fees" name="fees" value={values.fees} onChange={handleChange(setter)} size="small" required /></Grid>
    </Grid>
  );

  return (
    <Box>
      <Grid container spacing={3}>
        <Grid size={{ xs: 12, lg: 4 }}>
          <Card sx={{ borderRadius: 3 }}>
            <CardHeader avatar={<LocalHospitalIcon sx={{ color: "white" }} />} title="Emergency Registration" sx={{ color: "white", background: "linear-gradient(135deg, #ff6b6b 0%, #d32f2f 100%)" }} />
            <CardContent sx={{ p: 3 }}>
              {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
              {success && <Alert severity="success" sx={{ mb: 2 }}>{success}</Alert>}
              <Box component="form" onSubmit={handleSubmit}>
                {renderFields(formData, setFormData)}
                <Button type="submit" variant="contained" sx={{ mt: 3 }} fullWidth disabled={loading}>
                  {loading ? <CircularProgress size={20} color="inherit" /> : "Save Emergency Record"}
                </Button>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid size={{ xs: 12, lg: 8 }}>
          <Card sx={{ borderRadius: 3 }}>
            <CardHeader title="Emergency Table" subheader={`Total emergency records: ${rows.length}`} />
            <CardContent sx={{ p: 0 }}>
              {tableLoading ? <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", height: 460 }}><CircularProgress /></Box> : <Box sx={{ height: 520, width: "100%" }}><DataGrid rows={rows} columns={columns} disableRowSelectionOnClick pageSizeOptions={[5,10,20]} initialState={{ pagination: { paginationModel: { page: 0, pageSize: 5 } } }} /></Box>}
            </CardContent>
          </Card>
        </Grid>
      </Grid>
      <Dialog open={editOpen} onClose={() => setEditOpen(false)} fullWidth maxWidth="md">
        <DialogTitle>Edit Emergency Record</DialogTitle>
        <DialogContent dividers>{renderFields(editForm, setEditForm)}</DialogContent>
        <DialogActions><Button onClick={() => setEditOpen(false)}>Cancel</Button><Button variant="contained" onClick={handleSaveEdit} disabled={loading}>Save</Button></DialogActions>
      </Dialog>
      <Dialog open={Boolean(deleteRow)} onClose={() => setDeleteRow(null)}>
        <DialogTitle>Delete Emergency Record</DialogTitle>
        <DialogContent>Delete the selected emergency record?</DialogContent>
        <DialogActions><Button onClick={() => setDeleteRow(null)}>Cancel</Button><Button color="error" variant="contained" onClick={handleDelete} disabled={loading}>Delete</Button></DialogActions>
      </Dialog>
    </Box>
  );
}
