const express = require("express");
const router = express.Router();
const { insertTag } = require("../controllers/tagsController.js");

router.post("/tags", insertTag);

module.exports = router;
