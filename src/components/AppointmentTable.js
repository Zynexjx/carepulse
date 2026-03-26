import { useEffect, useState } from "react";
import axios from "axios";
import { DataGrid } from "@mui/x-data-grid";
import { Box, Card, CardContent, CardHeader, CircularProgress } from "@mui/material";
import EventIcon from "@mui/icons-material/Event";

export default function AppointmentTable() {

  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios
      .get("http://localhost:5000/api/reception/appointments")
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
    { field: "appointment_id", headerName: "ID", width: 120 },
    { field: "name", headerName: "Name", width: 120 },
    { field: "surname", headerName: "Surname", width: 120 },
    { field: "sex", headerName: "Sex", width: 90 },
    { field: "age", headerName: "Age", width: 90 },
    { field: "diagnosis", headerName: "Diagnosis", width: 180 },
    { field: "counselor", headerName: "Counselor", width: 140 },
    { field: "section_booking", headerName: "Section", width: 140 },
    { field: "time_period", headerName: "Time", width: 130 },
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
        avatar={<EventIcon sx={{ color: "#667eea" }} />}
        title="Appointments"
        subheader={`Total appointments: ${rows.length}`}
        sx={{
          background: "linear-gradient(135deg, #667eea15 0%, #764ba215 100%)",
          borderBottom: "1px solid rgba(102, 126, 234, 0.2)"
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