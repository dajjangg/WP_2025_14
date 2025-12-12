// 회원가입, 로그인, 로그아웃, 프로필 조회/수정 등 사용자 인증 관련 로직 처리 컨트롤러

const bcrypt = require("bcrypt");
const passport = require("passport");
const userModel = require("../models/userModel");
const path = require("path");
const multer = require("multer");
const upload = multer({ dest: "uploads/" });

// 회원가입
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

// 로그인
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

// 로그아웃
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

// 프로필 불러오기
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
// 프로필 정보 불러오기
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

// 프로필 수정
exports.updateProfile = async (req, res) => {
  try {
    const { user_name, intro } = req.body;
    const user_id = req.user.user_id;

    // 이름을 변경하려는 경우에만 중복 체크
    if (user_name) {
      const taken = await userModel.isUsernameTaken(user_name, user_id);
      if (taken) {
        return res.status(400).json({ message: "이미 사용 중인 사용자명입니다." });
      }
    }

    const profile_image = req.file ? req.file.filename : null;

    const success = await userModel.updateUserProfile(
      user_id,
      user_name,
      intro,
      profile_image
    );

    if (!success) {
      return res.status(400).json({ message: "프로필 업데이트 실패" });
    }

    res.json({ message: "프로필 업데이트 완료" });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "서버 오류" });
  }
};

// 프로필 사진 수정
exports.updateProfileImage = [
  upload.single("profile_image"),
  async (req, res) => {
    try {
      const userId = req.params.user_id;
      if (!req.file) {
        return res.status(400).json({ message: "파일이 업로드되지 않았습니다." });
      }

      // 파일 경로 저장 (예: uploads/파일명)
      const newImagePath = path.join("uploads", req.file.filename);

      // DB 업데이트
      await userModel.updateProfileImage(userId, newImagePath);

      return res.json({
        success: true,
        new_image_path: newImagePath
      });
    } catch (err) {
      console.error(err);
      return res.status(500).json({ error: "프로필 이미지 업데이트 실패" });
    }
  }
];

// 닉네임 수정
exports.updateUserName = async (req, res) => {
  try {
    const userId = req.params.user_id;
    const { user_name } = req.body;

    if (!user_name) {
      return res.status(400).json({ message: "새 닉네임을 입력하세요." });
    }

    // 중복 체크
    const taken = await userModel.isUsernameTaken(user_name, userId);
    if (taken) {
      return res.status(400).json({ message: "이미 사용 중인 사용자명입니다." });
    }

    const success = await userModel.updateUserName(userId, user_name);
    if (!success) {
      return res.status(400).json({ message: "닉네임 수정 실패" });
    }

    res.json({ success: true, new_user_name: user_name });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "닉네임 수정 중 서버 오류" });
  }
};

// 한 줄 소개 수정
exports.updateIntro = async (req, res) => {
  try {
    const userId = req.params.user_id;
    const { intro } = req.body;

    if (!intro) {
      return res.status(400).json({ message: "새 소개를 입력하세요." });
    }

    const success = await userModel.updateIntro(userId, intro);
    if (!success) {
      return res.status(400).json({ message: "소개 수정 실패" });
    }

    res.json({ success: true, new_intro: intro });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "소개 수정 중 서버 오류" });
  }
};
