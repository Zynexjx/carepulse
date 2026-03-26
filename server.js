const express = require("express");
const cors = require("cors");
require("dotenv").config();

const connectDB = require("./config/db");

const app = express();
connectDB();

app.use(cors());
app.use(express.json());

app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/admin", require("./routes/adminRoutes"));
app.use('/api/reports', require("./routes/reportRoutes"));
app.use('/api/reception', require("./routes/receptionRoutes"));
app.use('/api/nurse', require("./routes/nurseRoutes"));


app.listen(5000, () =>
  console.log("Server running on port 5000")
);
