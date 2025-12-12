// 댓글 CRUD 관련 API 경로 정의 라우터
// 댓글 작성, 조회, 수정, 삭제 엔드포인트 포함

const express = require("express");
const router = express.Router();
const commentController = require("../controllers/commentController");
const { isLoggedIn } = require("../middleware/authMiddleware");

// 댓글 작성
router.post("/:post_id", isLoggedIn, commentController.addComment);
// 특정 사진의 댓글 목록
router.get("/:post_id", commentController.getComments);
// 댓글 수정
router.put("/:comment_id", isLoggedIn, commentController.updateComment);
//댓글 삭제
router.delete("/:comment_id", isLoggedIn, commentController.deleteComment);

module.exports = router;
