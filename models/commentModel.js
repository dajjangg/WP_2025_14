const db = require("../config/db");

module.exports = {
  // 댓글 작성
  async createComment(photo_id, user_id, comment) {
    const [result] = await db.query(
      "INSERT INTO comments (photo_id, user_id, comment) VALUES (?, ?, ?)",
      [photo_id, user_id, comment]
    );
    return result.insertId;
  },

  // 특정 사진의 댓글 전체 조회
  async getCommentsByPhotoId(photo_id) {
    const [rows] = await db.query(
      `SELECT c.*, u.username 
       FROM comments c
       JOIN users u ON c.user_id = u.id
       WHERE c.photo_id = ?
       ORDER BY c.created_at ASC`,
      [photo_id]
    );
    return rows;
  },

  // 댓글 삭제
  async deleteComment(comment_id, user_id) {
    // 본인 댓글만 삭제 가능하도록 user_id 체크
    const [result] = await db.query(
      "DELETE FROM comments WHERE id = ? AND user_id = ?",
      [comment_id, user_id]
    );
    return result.affectedRows; // 1이면 삭제 성공, 0이면 실패
  }
};
