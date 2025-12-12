// 이미지 파일 업로드 관련 설정 정의

const multer = require("multer");
const path = require("path");

// uploads 폴더에 저장
const storage = multer.diskStorage({
  destination(req, file, done) {
    done(null, path.join(__dirname, "../uploads"));
  },

  filename(req, file, done) {
    const ext = path.extname(file.originalname);
    const basename = path.basename(file.originalname, ext);
    done(null, basename + "_" + Date.now() + ext);
  },
});

// 업로드
const upload = multer({ 
  storage,
  limits: {
    fieldSize: 10 * 1024 * 1024,   // 10MB
    fileSize: 10 * 1024 * 1024
  }
});

module.exports = upload;
