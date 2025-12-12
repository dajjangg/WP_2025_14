// 좋아요 기능에 대한 API 경로 정의 라우터

const express = require("express");
const router = express.Router();
const likesController = require("../controllers/likeController");
const { isLoggedIn } = require("../middleware/authMiddleware");

// 좋아요 토글 (추가/취소)
router.post("/:post_id", isLoggedIn, likesController.toggleLike);
// 좋아요 수 조회
router.get("/:post_id/count", likesController.getLikeCount);

module.exports = router;