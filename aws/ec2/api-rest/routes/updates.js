const express = require("express");
const router = express.Router();
const { getMyTagUpdates } = require("../controllers/updatesController");
const { authenticate } = require("../middleware");

router.get("/users/:userId/tags/:tagId/updates", authenticate, getMyTagUpdates);

module.exports = router;
