import LocalFloristIcon from "@mui/icons-material/LocalFlorist";
import DepartmentCrudPanel from "./DepartmentCrudPanel";

const fields = [
  { name: "maternity_id", label: "Maternity ID", grid: 6 },
  { name: "name", label: "Name", grid: 6 },
  { name: "age", label: "Age", type: "number", grid: 6 },
  { name: "doctor", label: "Doctor", grid: 6 },
  { name: "dateOfDelivery", label: "Date of Delivery", type: "date", grid: 6 },
  {
    name: "deliveryType",
    label: "Delivery Type",
    type: "select",
    options: ["Normal", "Cesarian Section"],
    grid: 6
  },
  { name: "deliveryTime", label: "Delivery Time", type: "time", grid: 6 },
  { name: "numberOfBabies", label: "Number of Babies", type: "number", grid: 6 },
  { name: "babiesSex", label: "Babies Sex", grid: 6 },
  { name: "fees", label: "Fees", type: "number", grid: 6 }
];

const columns = [
  { field: "maternity_id", headerName: "Maternity ID", width: 130 },
  { field: "name", headerName: "Name", width: 130 },
  { field: "age", headerName: "Age", width: 90 },
  { field: "doctor", headerName: "Doctor", width: 120 },
  {
    field: "dateOfDelivery",
    headerName: "Delivery Date",
    width: 130,
    valueGetter: (value) => (value ? new Date(value).toLocaleDateString() : "")
  },
  { field: "deliveryType", headerName: "Delivery Type", width: 150 },
  { field: "deliveryTime", headerName: "Delivery Time", width: 120 },
  { field: "numberOfBabies", headerName: "Babies", width: 100 },
  { field: "babiesSex", headerName: "Babies Sex", width: 120 },
  { field: "fees", headerName: "Fees", width: 100 }
];

export default function MaternityForm() {
  return (
    <DepartmentCrudPanel
      title="Maternity"
      endpoint="http://localhost:5000/api/nurse/maternity"
      idField="maternity_id"
      idPrefix="MAT"
      icon={<LocalFloristIcon />}
      color="#d81b60"
      fields={fields}
      columns={columns}
    />
  );
}
