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
import FitnessCenterIcon from "@mui/icons-material/FitnessCenter";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";

const initialForm = {
  name: "",
  surname: "",
  sex: "",
  age: "",
  diagnosis: "",
  supervisor: "",
  period: "",
  type: "",
  dateOfAdmission: "",
  fees: ""
};

export default function RehabFormTable({ refreshTrigger }) {
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
      const response = await axios.get("http://localhost:5000/api/reception/rehabs");
      setRows(response.data.map((item) => ({ id: item._id, ...item })));
      setError("");
    } catch (err) {
      setError("Failed to fetch rehab records");
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
      await axios.post("http://localhost:5000/api/reception/rehab", { ...formData, section: "rehab" });
      setSuccess("Rehab record created successfully.");
      setFormData(initialForm);
      fetchRows();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to create rehab record");
    } finally {
      setLoading(false);
    }
  };

  const handleSaveEdit = async () => {
    setLoading(true);
    setError("");
    try {
      await axios.put(`http://localhost:5000/api/reception/rehab/${selectedRow._id}`, editForm);
      setSuccess("Rehab record updated successfully.");
      setEditOpen(false);
      fetchRows();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to update rehab record");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    setLoading(true);
    setError("");
    try {
      await axios.delete(`http://localhost:5000/api/reception/rehab/${deleteRow._id}`);
      setSuccess("Rehab record deleted successfully.");
      setDeleteRow(null);
      fetchRows();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to delete rehab record");
    } finally {
      setLoading(false);
    }
  };

  const columns = [
    { field: "rehab_id", headerName: "Rehab ID", width: 120 },
    { field: "name", headerName: "Name", width: 120 },
    { field: "surname", headerName: "Surname", width: 120 },
    { field: "sex", headerName: "Sex", width: 90 },
    { field: "age", headerName: "Age", width: 90 },
    { field: "diagnosis", headerName: "Diagnosis / Condition", width: 180 },
    { field: "supervisor", headerName: "Supervisor", width: 130 },
    { field: "period", headerName: "Period", width: 120 },
    { field: "type", headerName: "Type", width: 120 },
    {
      field: "dateOfAdmission",
      headerName: "Date of Admission",
      width: 150,
      valueGetter: (value) => (value ? new Date(value).toLocaleDateString() : "")
    },
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
      <Grid size={{ xs: 12, sm: 6 }}><TextField fullWidth select label="Sex" name="sex" value={values.sex} onChange={handleChange(setter)} size="small" required><MenuItem value="Male">Male</MenuItem><MenuItem value="Female">Female</MenuItem><MenuItem value="Other">Other</MenuItem></TextField></Grid>
      <Grid size={{ xs: 12, sm: 6 }}><TextField fullWidth type="number" label="Age" name="age" value={values.age} onChange={handleChange(setter)} size="small" required /></Grid>
      <Grid size={{ xs: 12 }}><TextField fullWidth multiline rows={2} label="Diagnosis / Condition" name="diagnosis" value={values.diagnosis} onChange={handleChange(setter)} size="small" required /></Grid>
      <Grid size={{ xs: 12, sm: 6 }}><TextField fullWidth label="Supervisor" name="supervisor" value={values.supervisor} onChange={handleChange(setter)} size="small" required /></Grid>
      <Grid size={{ xs: 12, sm: 6 }}><TextField fullWidth label="Period" name="period" value={values.period} onChange={handleChange(setter)} size="small" required /></Grid>
      <Grid size={{ xs: 12, sm: 6 }}><TextField fullWidth select label="Type" name="type" value={values.type} onChange={handleChange(setter)} size="small" required><MenuItem value="threat">Threat</MenuItem><MenuItem value="hostal">Hostal</MenuItem><MenuItem value="suicidal">Suicidal</MenuItem></TextField></Grid>
      <Grid size={{ xs: 12, sm: 6 }}><TextField fullWidth type="date" label="Date of Admission" name="dateOfAdmission" value={values.dateOfAdmission ? String(values.dateOfAdmission).split("T")[0] : ""} onChange={handleChange(setter)} size="small" required InputLabelProps={{ shrink: true }} /></Grid>
      <Grid size={{ xs: 12, sm: 6 }}><TextField fullWidth type="number" label="Fees" name="fees" value={values.fees} onChange={handleChange(setter)} size="small" required /></Grid>
    </Grid>
  );

  return (
    <Box>
      <Grid container spacing={3}>
        <Grid size={{ xs: 12, lg: 4 }}>
          <Card sx={{ borderRadius: 3 }}>
            <CardHeader avatar={<FitnessCenterIcon sx={{ color: "white" }} />} title="Rehab Registration" sx={{ color: "white", background: "linear-gradient(135deg, #f9a825 0%, #f57c00 100%)" }} />
            <CardContent sx={{ p: 3 }}>
              {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
              {success && <Alert severity="success" sx={{ mb: 2 }}>{success}</Alert>}
              <Box component="form" onSubmit={handleSubmit}>
                {renderFields(formData, setFormData)}
                <Button type="submit" variant="contained" sx={{ mt: 3 }} fullWidth disabled={loading}>
                  {loading ? <CircularProgress size={20} color="inherit" /> : "Save Rehab Record"}
                </Button>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid size={{ xs: 12, lg: 8 }}>
          <Card sx={{ borderRadius: 3 }}>
            <CardHeader title="Rehab Table" subheader={`Total rehab records: ${rows.length}`} />
            <CardContent sx={{ p: 0 }}>
              {tableLoading ? <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", height: 460 }}><CircularProgress /></Box> : <Box sx={{ height: 520, width: "100%" }}><DataGrid rows={rows} columns={columns} disableRowSelectionOnClick pageSizeOptions={[5,10,20]} initialState={{ pagination: { paginationModel: { page: 0, pageSize: 5 } } }} /></Box>}
            </CardContent>
          </Card>
        </Grid>
      </Grid>
      <Dialog open={editOpen} onClose={() => setEditOpen(false)} fullWidth maxWidth="md">
        <DialogTitle>Edit Rehab Record</DialogTitle>
        <DialogContent dividers>{renderFields(editForm, setEditForm)}</DialogContent>
        <DialogActions><Button onClick={() => setEditOpen(false)}>Cancel</Button><Button variant="contained" onClick={handleSaveEdit} disabled={loading}>Save</Button></DialogActions>
      </Dialog>
      <Dialog open={Boolean(deleteRow)} onClose={() => setDeleteRow(null)}>
        <DialogTitle>Delete Rehab Record</DialogTitle>
        <DialogContent>Delete the selected rehab record?</DialogContent>
        <DialogActions><Button onClick={() => setDeleteRow(null)}>Cancel</Button><Button color="error" variant="contained" onClick={handleDelete} disabled={loading}>Delete</Button></DialogActions>
      </Dialog>
    </Box>
  );
}
