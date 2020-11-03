const express = require('express');
const router = express.Router();
const userCtrl = require("../controllers/user");
//const auth = require("../middleware/auth")

router.post("/signup", userCtrl.signup);
router.post("/login", userCtrl.login);
router.get("/accounts", userCtrl.getAllUsers);
router.get("/accounts/:id", userCtrl.getAccount);
router.delete('/accounts/:id', userCtrl.deleteUser);

module.exports = router;
