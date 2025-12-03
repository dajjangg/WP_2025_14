 const express = require("express");
 const router = express.Router();
 const scrapController = require("../controllers/scrapController");
 const { isLoggedIn } = require("../middleware/authMiddleware");

 // 스크랩 토글 (추가/취소)
 router.post("/:post_id", isLoggedIn, scrapController.toggleScrap);

 // 특정 게시물 스크랩 수 조회
 router.get("/:post_id/count", scrapController.getScrapCount);

 module.exports = router;