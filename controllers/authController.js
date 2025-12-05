const bcrypt = require("bcrypt");
const passport = require("passport");
const userModel = require("../models/userModel");

exports.register = async (req, res) => {
  const { user_name, password } = req.body;

  try {
    const exists = await userModel.findByUsername(user_name);
    if (exists) {
      return res.status(400).json({ message: "이미 존재하는 사용자명입니다." });
    }

    const hashed = await bcrypt.hash(password, 10);
    const userId = await userModel.createUser(user_name, hashed);

    res.json({ message: "회원가입 성공", userId });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.login = (req, res, next) => {
  // 이미 로그인된 상태라면 로그인 못 하게 막기
  if (req.isAuthenticated()) {
    return res.status(400).json({
      message: "이미 로그인된 상태입니다. 로그아웃 후 이용하세요."
    });
  }

  passport.authenticate("local", (err, user, info) => {
    if (err) return next(err);
    if (!user) return res.status(401).json({ message: info.message });

    req.login(user, (err) => {
      if (err) return next(err);
      res.json({ message: "로그인 성공", user });
    });
  })(req, res, next);
};

exports.logout = (req, res) => {
  if (!req.isAuthenticated()) {
    return res.status(400).json({ message: "로그인 상태가 아닙니다." });
  }

  req.logout(err => {
    if (err) return res.status(500).json({ message: "로그아웃 실패" });

    req.session.destroy(() => {
      res.clearCookie("connect.sid"); // 세션 쿠키 삭제
      res.json({ message: "로그아웃 되었습니다." });
    });
  });
};

exports.getMyProfile = async (req, res) => {
  try {
    const user_id = req.user.user_id;

    const profile = await userModel.getProfileInfo(user_id);

    if (!profile) {
      return res.status(404).json({ message: "유저 정보를 찾을 수 없습니다." });
    }

    res.json(profile);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "프로필 정보 불러오기 실패" });
  }
};

exports.getUserProfile = async (req, res) => {
  try {
    const userId = req.params.user_id; // URL에서 user id 가져오기

    // 유저 기본 정보
    const user = await userModel.getUserById(userId);
    if (!user) {
      return res.status(404).json({ message: "존재하지 않는 사용자입니다." });
    }

    // 유저가 업로드한 게시물들
    const posts = await userModel.getUserPosts(userId);

    // 유저가 스크랩한 게시물들
    const scraps = await userModel.getScrappedPosts(userId);

    return res.json({
      user,
      posts,
      scraps,
    });

  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "프로필 정보를 불러오지 못했습니다." });
  }
};
