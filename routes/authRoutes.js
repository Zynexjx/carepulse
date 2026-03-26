const router = require("express").Router();
const auth = require("../controllers/authController");

router.post("/register", auth.registerUser);
router.post("/login", auth.login);

module.exports = router;