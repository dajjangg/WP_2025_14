const photoModel = require("../models/postModel");
const fs = require("fs");
const path = require("path");

exports.uploadPhoto = async (req, res) => {
  try {
    const user_id = req.user.id; // 로그인한 사용자
    const image_path = path.join("uploads", req.file.filename);
    const caption = req.body.caption || null;

    const photoId = await photoModel.createPhoto(user_id, image_path, caption);

    return res.json({ 
      message: "사진 업로드 성공", 
      photoId,
      image_path,
      caption
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "업로드 실패" });
  }
};

exports.getPhotos = async (req, res) => {
  try {
    const photos = await photoModel.getAllPhotos();
    return res.json(photos);
  } catch (err) {
    res.status(500).json({ error: "불러오기 실패" });
  }
};

exports.listPhotos = async (req, res) => {
  try {
    const photos = await photoModel.getAll();
    return res.json(photos);
  } catch (err) {
    res.status(500).json({ error: "불러오기 실패" });
  }
};

exports.deletePhoto = async (req, res) => {
  try {
    const photoId = req.params.id;
    const userId = req.user.id; // 로그인한 사용자

    const photo = await photoModel.findById(photoId);

    if (!photo) {
      return res.status(404).json({ message: "사진을 찾을 수 없습니다." });
    }

    // 다른 사용자의 사진 삭제 금지
    if (photo.user_id !== userId) {
      return res.status(403).json({ message: "삭제 권한이 없습니다." });
    }
    // 파일 경로 생성
    const filePath = path.join(__dirname, "..", photo.image_path);
    // 파일 존재하면 삭제
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }
    // DB에서도 삭제
    await photoModel.deletePhoto(photoId);

    res.json({ message: "사진 삭제 완료" });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "서버 오류" });
  }
};