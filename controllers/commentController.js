const commentModel = require("../models/commentModel");

exports.addComment = async (req, res) => {
  try {
    const photo_id = req.params.photo_id; // URL에서 가져옴
    const user_id = req.user.id;          // 로그인된 사용자
    const { comment } = req.body;

    if (!comment || comment.trim() === "") {
      return res.status(400).json({ message: "댓글 내용을 입력하세요." });
    }

    const commentId = await commentModel.createComment(
      photo_id,
      user_id,
      comment
    );

    res.json({
      message: "댓글 작성 성공",
      commentId,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "댓글 작성 실패" });
  }
};

exports.getComments = async (req, res) => {
  try {
    const photo_id = req.params.photo_id;

    const comments = await commentModel.getCommentsByPhotoId(photo_id);

    res.json(comments);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "댓글 불러오기 실패" });
  }
};
