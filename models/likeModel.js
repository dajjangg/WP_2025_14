const db = require("../config/db");

module.exports = {
  // 좋아요 추가
  async addLike(post_id, user_id) {
    const [result] = await db.query(
      "INSERT INTO likes (post_id, user_id) VALUES (?, ?)",
      [post_id, user_id]
    );
    return result.affectedRows;
  },

  // 좋아요 취소
  async removeLike(post_id, user_id) {
    const [result] = await db.query(
      "DELETE FROM likes WHERE post_id = ? AND user_id = ?",
      [post_id, user_id]
    );
    return result.affectedRows;
  },

  // 좋아요 수 조회
  async countLikes(post_id) {
    const [rows] = await db.query(
      "SELECT likes_count AS likeCount FROM posts WHERE post_id = ?",
      [post_id]
    );
    return rows[0].likeCount;
  },

  // 특정 사용자가 좋아요 했는지 확인
  async hasUserLiked(post_id, user_id) {
    const [rows] = await db.query(
      "SELECT 1 FROM likes WHERE post_id = ? AND user_id = ?",
      [post_id, user_id]
    );
    return rows.length > 0;
  },

  // 해당 post 좋아요 카운트 변경
  async increaseLikeCount(post_id) {
    await db.query(
    "UPDATE posts SET likes_count = likes_count + 1 WHERE post_id = ?",
    [post_id]
    );
  },
  async decreaseLikeCount(post_id) {
    await db.query(
    "UPDATE posts SET likes_count = likes_count - 1 WHERE post_id = ? AND likes_count > 0",
    [post_id]
    );
  }
};