import { DataGrid } from "@mui/x-data-grid";
import { Box, Chip } from "@mui/material";

export default function AccountTable({rows}){

 const columns=[
   {
     field:"username",
     headerName:"Username",
     width:150,
     headerAlign:"left",
     align:"left"
   },
   {
     field:"role",
     headerName:"Role",
     width:120,
     headerAlign:"left",
     align:"left",
     renderCell:(params)=>{
       const roleColors = {
         admin: "error",
         doctor: "info",
         nurse: "success",
         reception: "warning",
         supervisor: "primary"
       };
       return <Chip label={params.value} color={roleColors[params.value]} size="small"/>;
     }
   },
   {
     field:"active",
     headerName:"Status",
     width:120,
     headerAlign:"left",
     align:"left",
     renderCell:(params)=>{
       return <Chip 
         label={params.value ? "Active" : "Inactive"} 
         color={params.value ? "success" : "default"} 
         size="small"
       />;
     }
   }
 ];

 return(
   <Box sx={{height:400, width:"100%"}}>
     <DataGrid 
       rows={rows} 
       columns={columns}
       pageSizeOptions={[5, 10]}
       initialState={{
         pagination: {
           paginationModel: { pageSize: 5 }
         }
       }}
       sx={{
         boxShadow: 0,
         border: "1px solid #e0e0e0",
         borderRadius: 1
       }}
     />
   </Box>
 );
}