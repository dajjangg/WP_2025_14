// 태그 데이터 조회 및 검색 등을 위한 API 경로 정의 라우터

const express = require("express");
const router = express.Router();
const tagController = require("../controllers/tagController");
const { isLoggedIn } = require("../middleware/authMiddleware");

// 전체 태그 조회
router.get("/", tagController.getTags);
// 특정 태그로 게시물 조회
router.get("/:tag_id/posts", tagController.getPostsByTag);
// 또는 태그 이름으로 게시물 조회
router.get("/name/:tag_name/posts", tagController.getPostsByTagName);

module.exports = router;