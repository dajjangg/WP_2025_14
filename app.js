const express = require("express");
const path = require("path");
const session = require("express-session");
const passport = require("passport");
const dotenv = require("dotenv");
const morgan = require("morgan");

dotenv.config();

// Passport 설정 불러오기
const passportConfig = require("./passport/localStrategy");

// 라우트 불러오기
const authRoutes = require("./routes/authRoutes");
const photoRoutes = require("./routes/photoRoutes");
const commentRoutes = require("./routes/commentRoutes");

const app = express();

// 공통 미들웨어 설정
app.use(morgan("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));


// 한글 깨짐 방지
app.use((req, res, next) => {
  res.setHeader("Content-Type", "application/json; charset=utf-8");
  next();
});

// 세션 설정
app.use(
  session({
    resave: false,
    saveUninitialized: false,
    secret: process.env.COOKIE_SECRET,
    cookie: {
      httpOnly: true,
      secure: false,
    },
  })
);

// Passport 초기화
app.use(passport.initialize()); // 기본 기능 활성화
app.use(passport.session());    // 세션과 연동
passportConfig(passport);       // localStrategy 실행해서 로그인 전략 적용

// 정적 파일 제공 (업로드 이미지 접근 가능)
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

app.get("/", (req, res) => {
  res.json({ message: "서버 정상 작동 중!" });
});

// API 라우트 연결
app.use("/auth", authRoutes);
app.use("/photo", photoRoutes);
app.use("/comment", commentRoutes);

// 404 에러 처리
app.use((req, res, next) => {
  res.status(404).json({ message: "라우터가 없습니다." });
});

// 서버 오류 처리
app.use((err, req, res, next) => {
  console.error(err);
  res.status(err.status || 500).json({ error: err.message });
});

module.exports = app; // 실행은 index.js에서 할 것임