// 사용자 관련 API 경로 정의 라우터
// 회원가입, 로그인, 로그아웃, 프로필 조회/수정

const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController");
const { isLoggedIn } = require("../middleware/authMiddleware");

// 회원가입
router.post("/register", authController.register);
// 로그인
router.post("/login", authController.login);
// 로그아웃
router.post("/logout", authController.logout);
// 내 프로필
router.get("/me", isLoggedIn, authController.getMyProfile);
// 다른 사람 프로필
router.get("/:user_id/profile", authController.getUserProfile);
// 닉네임 수정
router.post("/:user_id/profile/username", authController.updateUserName);
// 한 줄 소개 수정
router.post("/:user_id/profile/intro", authController.updateIntro);
// 프로필 이미지 업로드
router.post("/:user_id/profile/image", authController.updateProfileImage);
//로그인 했는지 아닌지 체크
router.get("/status", (req, res) => {
  if (req.isAuthenticated()) {
    return res.json({
      loggedIn: true,
      user_id: req.user.user_id,
      user_name: req.user.user_name
    });
  }
  return res.json({ loggedIn: false });
});


module.exports = router;
