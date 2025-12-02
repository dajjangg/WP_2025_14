const postModel = require("../models/postModel");
const fs = require("fs");
const path = require("path");

exports.uploadPost = async (req, res) => {
  try {
    const user_id = req.user.user_id; // 로그인한 사용자
    const image_path = path.join("uploads", req.file.filename);
    const caption = req.body.caption || null;

    const postId = await postModel.createPost(user_id, image_path, caption);

    return res.json({ 
      message: "사진 업로드 성공", 
      postId,
      image_path,
      caption
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "업로드 실패" });
  }
};

exports.getPosts = async (req, res) => {
  try {
    const posts = await postModel.getAllPosts();
    return res.json(posts);
  } catch (err) {
    res.status(500).json({ error: "불러오기 실패" });
  }
};

exports.listPosts = async (req, res) => {
  try {
    const posts = await postModel.getAll();
    return res.json(posts);
  } catch (err) {
    res.status(500).json({ error: "불러오기 실패" });
  }
};

exports.deletePost = async (req, res) => {
  try {
    const postId = req.params.post_id;
    const userId = req.user.user_id; // 로그인한 사용자

    const post = await postModel.findById(postId);

    if (!post) {
      return res.status(404).json({ message: "사진을 찾을 수 없습니다." });
    }

    // 다른 사용자의 사진 삭제 금지
    if (post.user_id !== userId) {
      return res.status(403).json({ message: "삭제 권한이 없습니다." });
    }
    // 파일 경로 생성
    const filePath = path.join(__dirname, "..", post.image_path);
    // 파일 존재하면 삭제
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }
    // DB에서도 삭제
    await postModel.deletePost(postId);

    res.json({ message: "사진 삭제 완료" });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "서버 오류" });
  }
};