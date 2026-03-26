const ExcelJS = require("exceljs");

exports.generateExcel = async(users)=>{
 const workbook = new ExcelJS.Workbook();
 const sheet = workbook.addWorksheet("Report");

 sheet.columns=[
  {header:"Username",key:"username"},
  {header:"Role",key:"role"},
 ];

 users.forEach(u=>sheet.addRow(u));

 await workbook.xlsx.writeFile("report.xlsx");
};