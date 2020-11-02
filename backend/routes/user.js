const router = require("express").Router();
const userCtrl = require("../controllers/user")
//const auth = require("../middleware/auth")

router.post("/signup", userCtrl.signup);
router.post("/login", userCtrl.login);
router.get("/accounts", userCtrl.getAllUsers);

module.exports = router;
