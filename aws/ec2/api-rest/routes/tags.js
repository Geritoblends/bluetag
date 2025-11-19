const express = require("express");
const router = express.Router();
const {
  getMyTags,
  getMyTag,
  insertMyTag,
  deleteMyTag,
} = require("../controllers/tagsController");
const { authenticate } = require("../middleware");

router.get("/users/:userId/tags", authenticate, getMyTags);
router.get("/users/:userId/tags/:tagId", authenticate, getMyTag);
router.post("/users/:userId/tags", authenticate, insertMyTag);
router.delete("users/:userId/tags/:tagId", authenticate, deleteMyTag);

module.exports = router;
