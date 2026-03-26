import { useEffect, useState } from "react";
import axios from "axios";
import { DataGrid } from "@mui/x-data-grid";
import { Box, Card, CardContent, CardHeader, CircularProgress } from "@mui/material";
import FitnessCenterIcon from "@mui/icons-material/FitnessCenter";

export default function RehabTable() {

  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios
      .get("http://localhost:5000/api/reception/rehabs")
      .then(res => {
        const data = res.data.map((item, index) => ({
          id: index + 1,
          ...item
        }));
        setRows(data);
      })
      .finally(() => setLoading(false));
  }, []);

  const columns = [
    { field: "rehab_id", headerName: "Rehab ID", width: 120 },
    { field: "name", headerName: "Name", width: 120 },
    { field: "surname", headerName: "Surname", width: 120 },
    { field: "sex", headerName: "Sex", width: 90 },
    { field: "age", headerName: "Age", width: 90 },
    { field: "diagnosis", headerName: "Diagnosis", width: 180 },
    { field: "supervisor", headerName: "Supervisor", width: 150 },
    { field: "period", headerName: "Period", width: 120 },
    { field: "type", headerName: "Type", width: 120 },
    {
      field: "dateOfAdmission",
      headerName: "Admission Date",
      width: 160,
      valueGetter: params =>
        new Date(params.value).toLocaleDateString()
    },
    { field: "fees", headerName: "Fees", width: 100 }
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
        avatar={<FitnessCenterIcon sx={{ color: "#f9a825" }} />}
        title="Rehab Sessions"
        subheader={`Total sessions: ${rows.length}`}
        sx={{
          background: "linear-gradient(135deg, #f9a82515 0%, #f9a82510 100%)",
          borderBottom: "1px solid rgba(249, 168, 37, 0.2)"
        }}
      />
      <CardContent sx={{ p: 0 }}>
        <Box sx={{ height: 500, width: "100%" }}>
          <DataGrid 
            rows={rows} 
            columns={columns} 
            pageSize={7}
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