const express = require("express");
const router = express.Router();
const tagController = require("../controllers/tagController");
const { isLoggedIn } = require("../middleware/authMiddleware");

// 태그 생성 (post 생성시 같이 생성하므로 필요없다고 생각했습니다)
//router.post("/", isLoggedIn, tagController.createTag);

// 전체 태그 조회
router.get("/", tagController.getTags);

// 특정 태그로 게시물 조회
router.get("/:tag_id/posts", tagController.getPostsByTag);

// 또는 태그 이름으로 게시물 조회
router.get("/name/:tag_name/posts", tagController.getPostsByTagName);

// 태그 삭제 (또한 수동으로 삭제할 일이 없을 것 같습니다)
//router.delete("/:tag_id", isLoggedIn, tagController.deleteTag);

module.exports = router;