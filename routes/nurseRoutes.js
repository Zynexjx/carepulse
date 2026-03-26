const router = require("express").Router();
const nurse = require("../controllers/nurseController");

router.get("/stats", nurse.getNurseStats);

router.get("/opd", nurse.getOpdRecords);
router.post("/opd", nurse.createOpdRecord);
router.put("/opd/:id", nurse.updateOpdRecord);
router.delete("/opd/:id", nurse.deleteOpdRecord);

router.get("/theater", nurse.getTheaterRecords);
router.post("/theater", nurse.createTheaterRecord);
router.put("/theater/:id", nurse.updateTheaterRecord);
router.delete("/theater/:id", nurse.deleteTheaterRecord);

router.get("/maternity", nurse.getMaternityRecords);
router.post("/maternity", nurse.createMaternityRecord);
router.put("/maternity/:id", nurse.updateMaternityRecord);
router.delete("/maternity/:id", nurse.deleteMaternityRecord);

router.get("/radiology", nurse.getRadiologyRecords);
router.post("/radiology", nurse.createRadiologyRecord);

module.exports = router;
