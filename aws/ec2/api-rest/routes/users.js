const express = require("express");
const router = express.Router();
const { login, signup, deleteUser } = require("../controllers/usersController");

router.post("/login", login);
router.post("/signup", signup);
router.delete("/users/:id", deleteUser);

module.exports = router;
