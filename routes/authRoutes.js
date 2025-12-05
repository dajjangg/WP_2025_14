const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController");
const { isLoggedIn } = require("../middleware/authMiddleware");

router.post("/register", authController.register);
router.post("/login", authController.login);
router.post("/logout", authController.logout);

// 내 프로필
router.get("/me", isLoggedIn, authController.getMyProfile);
// 다른 사람 프로필

router.get("/:user_id/profile", authController.getUserProfile);

module.exports = router;