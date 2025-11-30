const LocalStrategy = require("passport-local").Strategy;
const bcrypt = require("bcrypt");
const userModel = require("../models/userModel");

module.exports = (passport) => {
  passport.use(
    new LocalStrategy({ usernameField: "username" }, async (username, password, done) => {
      try {
        const user = await userModel.findByUsername(username);
        if (!user) {
          return done(null, false, { message: "존재하지 않는 사용자입니다." });
        }

        const isMatch = await bcrypt.compare(password, user.pw_hash);
        if (!isMatch) {
          return done(null, false, { message: "비밀번호가 틀렸습니다." });
        }

        return done(null, user);
      } catch (err) {
        return done(err);
      }
    })
  );

  passport.serializeUser((user, done) => {
    done(null, user.id);
  });

  passport.deserializeUser(async (id, done) => {
    try {
      const user = await userModel.findById(id);
      done(null, user);
    } catch (err) {
      done(err);
    }
  });
};