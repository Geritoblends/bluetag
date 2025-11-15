const express = require("express");
const router = express.Router();
const { getMyTags, getMyTag, insertMyTag } = require("../controllers/usersTagsController");

router.get("/users/:userId/tags", getMyTags);
router.get("/users/:userId/tags/:tagId", getMyTag);
router.post("/users/:userId/tags", insertMyTag);

module.exports = router;
