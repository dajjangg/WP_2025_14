// 게시물 업로드/수정/삭제/조회 등의 API 경로 정의 라우터

const express = require("express");
const router = express.Router();
const upload = require("../config/multer");
const postController = require("../controllers/postController");
const { isLoggedIn } = require("../middleware/authMiddleware");

// 게시물 업로드
router.post("/upload", isLoggedIn, upload.single("image"), postController.uploadPost);
// 전체 게시물 조회
router.get("/", postController.getPosts);
// 특정 게시물 상세 조회
router.get("/:post_id", postController.getPostDetail);
// 게시물 리스트 페이지용 (HTML 렌더링)
router.get("/list", postController.listPosts);
// 게시물 수정 (사진 포함)
router.put("/:post_id", isLoggedIn, upload.single("image"), postController.updatePost);
// 게시물 삭제
router.delete("/:post_id", isLoggedIn, postController.deletePost);

module.exports = router;
