import LocalHospitalIcon from "@mui/icons-material/LocalHospital";
import DepartmentCrudPanel from "./DepartmentCrudPanel";

const fields = [
  { name: "opd_id", label: "OPD ID", grid: 6 },
  { name: "name", label: "Name", grid: 6 },
  { name: "surname", label: "Surname", grid: 6 },
  { name: "sex", label: "Sex", type: "select", options: ["Male", "Female", "Other"], grid: 6 },
  { name: "age", label: "Age", type: "number", grid: 6 },
  { name: "date", label: "Date", type: "date", grid: 6 },
  { name: "diagnosis", label: "Diagnosis", multiline: true, rows: 2, grid: 12 },
  { name: "temperature", label: "Temperature", grid: 6 },
  { name: "doctor", label: "Doctor", grid: 6 },
  { name: "bp", label: "BP", grid: 6 },
  { name: "malariaTest", label: "Malaria Test", type: "select", options: ["Positive", "Negative"], grid: 6 },
  { name: "fees", label: "Fees", type: "number", grid: 6 }
];

const columns = [
  { field: "opd_id", headerName: "OPD ID", width: 120 },
  { field: "name", headerName: "Name", width: 120 },
  { field: "surname", headerName: "Surname", width: 120 },
  { field: "sex", headerName: "Sex", width: 90 },
  { field: "age", headerName: "Age", width: 90 },
  {
    field: "date",
    headerName: "Date",
    width: 120,
    valueGetter: (value) => (value ? new Date(value).toLocaleDateString() : "")
  },
  { field: "diagnosis", headerName: "Diagnosis", width: 180 },
  { field: "temperature", headerName: "Temperature", width: 120 },
  { field: "doctor", headerName: "Doctor", width: 130 },
  { field: "bp", headerName: "BP", width: 110 },
  { field: "malariaTest", headerName: "Malaria Test", width: 130 },
  { field: "fees", headerName: "Fees", width: 100 }
];

export default function OpdForm() {
  return (
    <DepartmentCrudPanel
      title="OPD"
      endpoint="http://localhost:5000/api/nurse/opd"
      idField="opd_id"
      idPrefix="OPD"
      icon={<LocalHospitalIcon />}
      color="#1976d2"
      fields={fields}
      columns={columns}
    />
  );
}
