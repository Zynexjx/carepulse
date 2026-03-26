import { useCallback, useEffect, useMemo, useState } from "react";
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
  Tooltip,
  Typography
} from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";

const createEmptyForm = (fields, idField) =>
  fields.reduce(
    (acc, field) => ({
      ...acc,
      [field.name]: field.name === idField ? "" : field.defaultValue ?? ""
    }),
    {}
  );

const generateDepartmentId = (prefix) =>
  `${prefix}-${Math.floor(1000 + Math.random() * 9000)}`;

export default function DepartmentCrudPanel({
  title,
  endpoint,
  idField,
  idPrefix,
  icon,
  color,
  fields,
  columns
}) {
  const [rows, setRows] = useState([]);
  const [formData, setFormData] = useState(() => createEmptyForm(fields, idField));
  const [editForm, setEditForm] = useState(() => createEmptyForm(fields, idField));
  const [selectedRow, setSelectedRow] = useState(null);
  const [deleteRow, setDeleteRow] = useState(null);
  const [editOpen, setEditOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [tableLoading, setTableLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const normalizedColumns = useMemo(
    () => [
      ...columns,
      {
        field: "actions",
        headerName: "Actions",
        width: 120,
        sortable: false,
        renderCell: (params) => (
          <Box sx={{ display: "flex", gap: 1 }}>
            <Tooltip title="Edit">
              <IconButton size="small" onClick={() => handleEdit(params.row)} sx={{ color }}>
                <EditIcon fontSize="small" />
              </IconButton>
            </Tooltip>
            <Tooltip title="Delete">
              <IconButton
                size="small"
                onClick={() => setDeleteRow(params.row)}
                sx={{ color: "#d32f2f" }}
              >
                <DeleteIcon fontSize="small" />
              </IconButton>
            </Tooltip>
          </Box>
        )
      }
    ],
    [columns, color]
  );

  const fetchRows = useCallback(async () => {
    setTableLoading(true);

    try {
      const response = await axios.get(endpoint);
      setRows(
        response.data.map((item, index) => ({
          id: item._id || `${idPrefix}-${index}`,
          ...item
        }))
      );
      setError("");
    } catch (err) {
      setError(`Failed to fetch ${title.toLowerCase()} records`);
    } finally {
      setTableLoading(false);
    }
  }, [endpoint, idPrefix, title]);

  useEffect(() => {
    fetchRows();
  }, [fetchRows]);

  const resetForm = () => {
    setFormData(createEmptyForm(fields, idField));
  };

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
      await axios.post(endpoint, {
        ...formData,
        [idField]: generateDepartmentId(idPrefix)
      });
      setSuccess(`${title} record created successfully`);
      resetForm();
      fetchRows();
    } catch (err) {
      setError(err.response?.data?.message || `Failed to create ${title.toLowerCase()} record`);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (row) => {
    setSelectedRow(row);
    setEditForm({ ...row });
    setEditOpen(true);
  };

  const handleSaveEdit = async () => {
    if (!selectedRow?._id) {
      setError(`Unable to update ${title.toLowerCase()} record`);
      return;
    }

    setLoading(true);
    setError("");

    try {
      await axios.put(`${endpoint}/${selectedRow._id}`, editForm);
      setSuccess(`${title} record updated successfully`);
      setEditOpen(false);
      setSelectedRow(null);
      fetchRows();
    } catch (err) {
      setError(err.response?.data?.message || `Failed to update ${title.toLowerCase()} record`);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteRow?._id) {
      setError(`Unable to delete ${title.toLowerCase()} record`);
      return;
    }

    setLoading(true);
    setError("");

    try {
      await axios.delete(`${endpoint}/${deleteRow._id}`);
      setSuccess(`${title} record deleted successfully`);
      setDeleteRow(null);
      fetchRows();
    } catch (err) {
      setError(err.response?.data?.message || `Failed to delete ${title.toLowerCase()} record`);
    } finally {
      setLoading(false);
    }
  };

  const renderField = (field, values, setter, disabled = false) => (
    <TextField
      key={field.name}
      label={field.label}
      name={field.name}
      type={field.type || "text"}
      value={values[field.name] ?? ""}
      onChange={handleChange(setter)}
      fullWidth
      required={field.required !== false}
      select={field.type === "select"}
      multiline={field.multiline}
      rows={field.rows}
      disabled={disabled || field.name === idField}
      size="small"
      InputLabelProps={field.type === "date" ? { shrink: true } : undefined}
    >
      {field.type === "select" &&
        field.options.map((option) => (
          <MenuItem key={option} value={option}>
            {option}
          </MenuItem>
        ))}
    </TextField>
  );

  return (
    <Box>
      <Grid container spacing={3}>
        <Grid size={{ xs: 12, lg: 4 }}>
          <Card sx={{ borderRadius: 3, boxShadow: "0 16px 36px rgba(15, 76, 129, 0.10)" }}>
            <CardHeader
              avatar={icon}
              title={`${title} Registration`}
              subheader={`Register and manage ${title.toLowerCase()} patients`}
              sx={{
                color: "white",
                background: `linear-gradient(135deg, ${color} 0%, ${color}cc 100%)`
              }}
            />
            <CardContent sx={{ p: 3 }}>
              {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
              {success && <Alert severity="success" sx={{ mb: 2 }}>{success}</Alert>}

              <Box component="form" onSubmit={handleSubmit}>
                <Grid container spacing={2}>
                  {fields.map((field) => (
                    <Grid key={field.name} size={{ xs: 12, sm: field.grid || 6 }}>
                      {renderField(field, formData, setFormData)}
                    </Grid>
                  ))}
                  <Grid size={{ xs: 12 }}>
                    <Button type="submit" variant="contained" fullWidth disabled={loading}>
                      {loading ? <CircularProgress size={20} color="inherit" /> : `Save ${title} Record`}
                    </Button>
                  </Grid>
                </Grid>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid size={{ xs: 12, lg: 8 }}>
          <Card sx={{ borderRadius: 3, boxShadow: "0 16px 36px rgba(15, 76, 129, 0.10)" }}>
            <CardHeader
              title={`${title} Table`}
              subheader={`Total records: ${rows.length}`}
            />
            <CardContent sx={{ p: 0 }}>
              {tableLoading ? (
                <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", height: 480 }}>
                  <CircularProgress />
                </Box>
              ) : (
                <Box sx={{ height: 520, width: "100%" }}>
                  <DataGrid
                    rows={rows}
                    columns={normalizedColumns}
                    disableRowSelectionOnClick
                    pageSizeOptions={[5, 10, 20]}
                    initialState={{
                      pagination: {
                        paginationModel: {
                          page: 0,
                          pageSize: 5
                        }
                      }
                    }}
                    sx={{
                      border: "none",
                      "& .MuiDataGrid-columnHeaders": {
                        background: "#f7f9fc"
                      }
                    }}
                  />
                </Box>
              )}
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Dialog open={editOpen} onClose={() => setEditOpen(false)} fullWidth maxWidth="md">
        <DialogTitle>Edit {title} Record</DialogTitle>
        <DialogContent dividers>
          <Grid container spacing={2} sx={{ mt: 0 }}>
            {fields.map((field) => (
              <Grid key={field.name} size={{ xs: 12, sm: field.grid || 6 }}>
                {renderField(field, editForm, setEditForm, field.name === idField)}
              </Grid>
            ))}
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setEditOpen(false)}>Cancel</Button>
          <Button onClick={handleSaveEdit} variant="contained" disabled={loading}>
            Save Changes
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog open={Boolean(deleteRow)} onClose={() => setDeleteRow(null)}>
        <DialogTitle>Delete {title} Record</DialogTitle>
        <DialogContent>
          <Typography>
            This action will permanently remove the selected {title.toLowerCase()} record.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteRow(null)}>Cancel</Button>
          <Button color="error" variant="contained" onClick={handleDelete} disabled={loading}>
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
