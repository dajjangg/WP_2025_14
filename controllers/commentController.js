const commentModel = require("../models/commentModel");

exports.addComment = async (req, res) => {
  try {
    const post_id = req.params.post_id; // URL에서 가져옴
    const user_id = req.user.user_id;          // 로그인된 사용자
    const { comment } = req.body;

    if (!comment || comment.trim() === "") {
      return res.status(400).json({ message: "댓글 내용을 입력하세요." });
    }

    const commentId = await commentModel.createComment(
      post_id,
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
    const post_id = req.params.post_id;

    const comments = await commentModel.getCommentsByPostId(post_id);

    res.json(comments);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "댓글 불러오기 실패" });
  }
};

exports.updateComment = async (req, res) => {
  try {
    const comment_id = req.params.comment_id;
    const user_id = req.user.user_id;  // 로그인한 사용자
    const { comment } = req.body;

    if (!comment || comment.trim() === "") {
      return res.status(400).json({ message: "수정할 댓글 내용을 입력하세요." });
    }

    const updated = await commentModel.updateComment(comment_id, user_id, comment);

    if (updated === 0) {
      return res.status(403).json({ message: "본인의 댓글만 수정할 수 있습니다." });
    }

    res.json({ message: "댓글 수정 성공" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "댓글 수정 실패" });
  }
};

exports.deleteComment = async (req, res) => {
  try {
    const comment_id = req.params.comment_id;
    const user_id = req.user.user_id;  // 로그인한 사용자

    // comment_id, 해당 댓글의 댓글 주인 + 해당 게시물 주인 id 가져오기
    const comment = await commentModel.findCommentWithPost(comment_id);

    if (!comment) {
      return res.status(404).json({ message: "댓글을 찾을 수 없습니다." });
    }

    // 댓글 작성자이거나, 게시물 작성자가 아니라면,
    if (comment.user_id !== user_id && comment.post_owner_id !== user_id) {
      return res.status(403).json({ message: "삭제 권한이 없습니다." });
    }

    //삭제
    await commentModel.deleteComment(comment_id);

    res.json({ message: "댓글 삭제 성공" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "댓글 삭제 실패" });
  }
};
