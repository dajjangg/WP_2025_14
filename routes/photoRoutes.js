const express = require("express");
const router = express.Router();

const upload = require("../config/multer");
const photoController = require("../controllers/photoController");
const { isLoggedIn } = require("../middleware/authMiddleware");

// 사진 업로드
router.post("/upload", isLoggedIn, upload.single("image"), photoController.uploadPhoto);
// 전체 사진 조회
router.get("/", photoController.getPhotos);
// 사진 리스트 페이지용 (HTML 렌더링)
router.get("/list", photoController.listPhotos);
// 사진 삭제
router.delete("/:id", isLoggedIn, photoController.deletePhoto);

module.exports = router;
