// 서버 실행을 위한 진입점 파일
// app.js를 불러와 포트를 열어 서버 시작
const app = require("./app");
const dotenv = require("dotenv");

dotenv.config();

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});