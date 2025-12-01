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

exports.deleteComment = async (req, res) => {
  try {
    const comment_id = req.params.comment_id;
    const user_id = req.user.id;  // 로그인한 사용자

    const deleted = await commentModel.deleteComment(comment_id, user_id);

    if (deleted === 0) {
      return res.status(403).json({
        message: "본인의 댓글만 삭제할 수 있습니다."
      });
    }

    res.json({ message: "댓글 삭제 성공" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "댓글 삭제 실패" });
  }
};
