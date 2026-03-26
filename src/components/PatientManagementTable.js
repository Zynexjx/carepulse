import { useEffect, useState } from "react";
import axios from "axios";
import { DataGrid } from "@mui/x-data-grid";
import {
  Alert,
  Box,
  Card,
  CardContent,
  CardHeader,
  CircularProgress
} from "@mui/material";
import PeopleAltIcon from "@mui/icons-material/PeopleAlt";

export default function PatientManagementTable({ refreshTrigger = 0 }) {
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchPatients = async () => {
      setLoading(true);

      try {
        const res = await axios.get("http://localhost:5000/api/reception/patients");

        const allPatients = res.data.map((patient, index) => ({
          id: patient._id || `patient-${index}`,
          ...patient,
          patientRef:
            patient.patientId ||
            patient.appointment_id ||
            patient.rehab_id ||
            patient.codeid ||
            "N/A",
          type: patient.type || "General",
          section: patient.section || patient.type || "General"
        }));

        setPatients(allPatients);
        setError("");
      } catch (err) {
        setError("Failed to fetch patient data");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchPatients();
  }, [refreshTrigger]);

  const columns = [
    { field: "patientRef", headerName: "Patient ID", width: 140 },
    { field: "name", headerName: "Name", width: 130 },
    { field: "surname", headerName: "Surname", width: 130 },
    { field: "sex", headerName: "Sex", width: 90 },
    { field: "age", headerName: "Age", width: 90 },
    { field: "diagnosis", headerName: "Diagnosis", width: 220 },
    { field: "section", headerName: "Section", width: 140 },
    { field: "type", headerName: "Category", width: 140 },
    {
      field: "createdAt",
      headerName: "Created",
      width: 150,
      valueGetter: value =>
        value ? new Date(value).toLocaleDateString() : "N/A"
    }
  ];

  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", height: 500 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Card
      sx={{
        borderRadius: "12px",
        boxShadow: "0 4px 16px rgba(0,0,0,0.08)",
        overflow: "hidden"
      }}
    >
      <CardHeader
        avatar={<PeopleAltIcon sx={{ color: "#26a69a" }} />}
        title="Patient Records"
        subheader={`Total patients: ${patients.length}`}
        sx={{
          background: "linear-gradient(135deg, #26a69a15 0%, #4db6ac10 100%)",
          borderBottom: "1px solid rgba(38, 166, 154, 0.2)"
        }}
      />
      <CardContent sx={{ p: 0 }}>
        {error && (
          <Box sx={{ p: 2 }}>
            <Alert severity="error">{error}</Alert>
          </Box>
        )}

        <Box sx={{ height: 500, width: "100%" }}>
          <DataGrid
            rows={patients}
            columns={columns}
            initialState={{
              pagination: {
                paginationModel: {
                  pageSize: 7,
                  page: 0
                }
              }
            }}
            pageSizeOptions={[7, 14, 21]}
            disableRowSelectionOnClick
            sx={{
              border: "none",
              "& .MuiDataGrid-columnHeaders": {
                background: "#f5f5f5",
                borderBottom: "2px solid #e0e0e0"
              },
              "& .MuiDataGrid-cell": {
                borderBottom: "1px solid #f0f0f0"
              },
              "& .MuiDataGrid-row:hover": {
                background: "#f5f5f5"
              }
            }}
          />
        </Box>
      </CardContent>
    </Card>
  );
}
