// 메인 서버 파일
// Express 서버 초기화, 미들웨어 설정, Passport 불러오기, 라우터 연결 등 담당

const express = require("express");
const path = require("path");
const session = require("express-session");
const passport = require("passport");
const dotenv = require("dotenv");
const morgan = require("morgan");
const cors = require("cors");

// .env 환경 변수 로드
dotenv.config();

// Passport 설정 불러오기
const passportConfig = require("./passport/localStrategy");

// 라우트 불러오기
const authRoutes = require("./routes/authRoutes");
const postRoutes = require("./routes/postRoutes");
const commentRoutes = require("./routes/commentRoutes");
const tagRoutes = require("./routes/tagRoutes");
const likeRoutes = require("./routes/likeRoutes");
const scrapRoutes = require("./routes/scrapRoutes");
const searchRoutes = require("./routes/searchRoutes");

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
// 프론트에서 쿠키 포함한 요청 허용
app.use(cors({
  origin: "http://localhost:3000",
  credentials: true
}));


// 세션 & Passport 설정
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
// Passport 초기화 및 세션 연동
app.use(passport.initialize());
app.use(passport.session());
passportConfig(passport); // localStrategy 실행해서 로그인 전략 활성화

// 정적 파일 제공 (이미지 등)
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// 기본 테스트용 라우트
app.get("/", (req, res) => {
  res.json({ message: "서버 정상 작동 중!" });
});

// API 라우트 연결
app.use("/auth", authRoutes);
app.use("/post", postRoutes);
app.use("/comment", commentRoutes);
app.use("/tag", tagRoutes);
app.use("/like", likeRoutes);
app.use("/scrap", scrapRoutes);
app.use("/search", searchRoutes);


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