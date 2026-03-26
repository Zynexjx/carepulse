const router = require("express").Router();
const reception = require("../controllers/receptionController");

// CREATE RECORDS
router.post("/patient", reception.registerPatient);
router.post("/appointment", reception.registerPatient);
router.post("/rehab", reception.registerPatient);
router.post("/emergency", reception.registerPatient);

// DASHBOARD STATS
router.get("/stats", reception.getReceptionStats);

// TABLE DATA
router.get("/appointments", reception.getAppointments);
router.get("/rehabs", reception.getRehabs);
router.get("/emergencies", reception.getEmergencies);

// ALL PATIENTS
router.get("/patients", reception.getAllPatients);

// DYNAMIC UPDATE / DELETE
router.put("/:section/:id", reception.updateRecord);
router.delete("/:section/:id", reception.deleteRecord);

module.exports = router;