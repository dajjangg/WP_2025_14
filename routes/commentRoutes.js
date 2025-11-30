const express = require("express");
const router = express.Router();
const commentController = require("../controllers/commentController");
const { isLoggedIn } = require("../middleware/authMiddleware");

// 댓글 작성
router.post("/:photo_id", isLoggedIn, commentController.addComment);

// 특정 사진의 댓글 목록
router.get("/:photo_id", commentController.getComments);

module.exports = router;
