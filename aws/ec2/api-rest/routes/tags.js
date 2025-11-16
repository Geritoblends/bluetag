const express = require("express");
const router = express.Router();
const {
  getMyTags,
  getMyTag,
  insertMyTag,
  deleteMyTag,
} = require("../controllers/tagsController");

router.get("/users/:userId/tags", getMyTags);
router.get("/users/:userId/tags/:tagId", getMyTag);
router.post("/users/:userId/tags", insertMyTag);
router.delete("users/:userId/tags/:tagId", deleteMyTag);

module.exports = router;
