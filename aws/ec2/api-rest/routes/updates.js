const express = require("express");
const router = express.Router();
const { getMyTagUpdates } = require("../controllers/updatesController");

router.get("/users/:userId/tags/:tagId/updates", getMyTagUpdates);

module.exports = router;
