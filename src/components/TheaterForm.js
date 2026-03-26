import AssignmentIcon from "@mui/icons-material/Assignment";
import DepartmentCrudPanel from "./DepartmentCrudPanel";

const fields = [
  { name: "theater_id", label: "Theater ID", grid: 6 },
  { name: "name", label: "Name", grid: 6 },
  { name: "surname", label: "Surname", grid: 6 },
  { name: "doctor", label: "Doctor", grid: 6 },
  { name: "sex", label: "Sex", type: "select", options: ["Male", "Female", "Other"], grid: 6 },
  { name: "age", label: "Age", type: "number", grid: 6 },
  { name: "operation_type", label: "Operation Type", grid: 6 },
  { name: "nextOfKin", label: "Next of Kin", grid: 6 },
  { name: "bp", label: "BP", grid: 6 },
  { name: "complications", label: "Complications", multiline: true, rows: 2, grid: 6, required: false },
  { name: "otherOperationDone", label: "Other Operation Done", multiline: true, rows: 2, grid: 12, required: false },
  { name: "date", label: "Date", type: "date", grid: 6 },
  { name: "time", label: "Time", type: "time", grid: 6 },
  { name: "fees", label: "Fees", type: "number", grid: 6 }
];

const columns = [
  { field: "theater_id", headerName: "Theater ID", width: 120 },
  { field: "name", headerName: "Name", width: 120 },
  { field: "surname", headerName: "Surname", width: 120 },
  { field: "doctor", headerName: "Doctor", width: 120 },
  { field: "sex", headerName: "Sex", width: 90 },
  { field: "age", headerName: "Age", width: 90 },
  { field: "operation_type", headerName: "Operation", width: 150 },
  { field: "nextOfKin", headerName: "Next of Kin", width: 150 },
  { field: "bp", headerName: "BP", width: 100 },
  { field: "complications", headerName: "Complications", width: 150 },
  { field: "otherOperationDone", headerName: "Other Operation", width: 170 },
  {
    field: "date",
    headerName: "Date",
    width: 120,
    valueGetter: (value) => (value ? new Date(value).toLocaleDateString() : "")
  },
  { field: "time", headerName: "Time", width: 100 },
  { field: "fees", headerName: "Fees", width: 100 }
];

export default function TheaterForm() {
  return (
    <DepartmentCrudPanel
      title="Theater"
      endpoint="http://localhost:5000/api/nurse/theater"
      idField="theater_id"
      idPrefix="THR"
      icon={<AssignmentIcon />}
      color="#8e24aa"
      fields={fields}
      columns={columns}
    />
  );
}
