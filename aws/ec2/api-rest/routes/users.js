const express = require("express");
const router = express.Router();
const { login, signup, deleteUser } = require("../controllers/usersController");
const { authenticate } = require("../middleware");

router.post("/login", login);
router.post("/signup", signup);
router.delete("/users/:id", authenticate, deleteUser);

module.exports = router;
