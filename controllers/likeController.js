const likesModel = require("../models/likeModel");

exports.toggleLike = async (req, res) => {
  try {
    const post_id = req.params.post_id;
    const user_id = req.user.user_id;

    //이미 좋아요 눌렀는지 확인
    const alreadyLiked = await likesModel.hasUserLiked(post_id, user_id);

    if (alreadyLiked) {
      // 이미 좋아요 → 취소
      await likesModel.removeLike(post_id, user_id);
      return res.json({ message: "좋아요 취소 성공" });
    } else {
      // 아직 안 눌렀음 → 추가
      await likesModel.addLike(post_id, user_id);
      return res.json({ message: "좋아요 성공" });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "좋아요 토글 실패" });
  }
};

exports.getLikeCount = async (req, res) => {
  try {
    const post_id = req.params.post_id;
    const count = await likesModel.countLikes(post_id);

    res.json({ post_id, likeCount: count });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "좋아요 수 조회 실패" });
  }
};