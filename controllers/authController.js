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
  req.logout(() => {
    res.json({ message: "로그아웃 되었습니다." });
  });
};