const express = require("express");
const router = express.Router();

const upload = require("../config/multer");
const postController = require("../controllers/postController");
const { isLoggedIn } = require("../middleware/authMiddleware");

// 게시물 업로드
router.post("/upload", isLoggedIn, upload.single("image"), postController.uploadPost);
// 전체 게시물 조회
router.get("/", postController.getPosts);
// 게시물 리스트 페이지용 (HTML 렌더링)
router.get("/list", postController.listPosts);
// 게시물 삭제
router.delete("/:post_id", isLoggedIn, postController.deletePost);

module.exports = router;
