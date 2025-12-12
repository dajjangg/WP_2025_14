// 검색 기능 관련 API 경로 정의 라우터

const express = require("express");
const router = express.Router();
const searchController = require("../controllers/searchController");

// 검색
router.get("/", searchController.searchPosts);

module.exports = router;