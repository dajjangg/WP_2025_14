// 로그인 여부 확인 미들웨어
exports.isLoggedIn = (req, res, next) => {
  if (req.isAuthenticated()) {
    return next();
  }
  return res.status(401).json({ message: "로그인이 필요합니다." });
};

// 로그인 안 된 상태에서만 접근 가능 (예: 회원가입 페이지)
exports.isNotLoggedIn = (req, res, next) => {
  if (!req.isAuthenticated()) {
    return next();
  }
  return res.status(403).json({ message: "이미 로그인한 상태입니다." });
};
