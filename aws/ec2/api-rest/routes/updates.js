const express = require("express");
const router = express.Router();
const { getMyTagUpdates } = require("../controllers/updatesController");

router.get("/branch", getBranches);
router.get("/branch/:branchNo", getBranch);
router.post("/branch", insertBranch);

module.exports = router;
