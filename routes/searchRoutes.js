const express = require("express");
const router = express.Router();
const searchController = require("../controllers/searchController");

// GET /search?q=부산 카페
router.get("/", searchController.searchPosts);

module.exports = router;