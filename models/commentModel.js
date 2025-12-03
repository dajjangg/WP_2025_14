const db = require("../config/db");

module.exports = {
  // 댓글 작성
  async createComment(post_id, user_id, comment) {
    const [result] = await db.query(
      "INSERT INTO comments (post_id, user_id, comment) VALUES (?, ?, ?)",
      [post_id, user_id, comment]
    );
    return result.insertId;
  },

  // 특정 사진의 댓글 전체 조회
  async getCommentsByPostId(post_id) {
    const [rows] = await db.query(
      `SELECT c.*, u.user_name 
       FROM comments c
       JOIN users u ON c.user_id = u.user_id
       WHERE c.post_id = ?
       ORDER BY c.created_at ASC`,
      [post_id]
    );
    return rows;
  },

  // 댓글 수정
  async updateComment(comment_id, user_id, comment) {
    const [result] = await db.query(
      "UPDATE comments SET comment = ? WHERE comment_id = ? AND user_id = ?",
      [comment, comment_id, user_id]
    );
    return result.affectedRows; // 1이면 수정 성공, 0이면 실패
  },

  // 댓글 and 게시물의 작성자 정보 조회
    async findCommentWithPost(comment_id) {
      const [rows] = await db.query(
        `SELECT c.comment_id, c.user_id, p.user_id AS post_owner_id
         FROM comments c
         JOIN posts p ON c.post_id = p.post_id
         WHERE c.comment_id = ?`,
        [comment_id]
      );
      return rows[0]; // 없으면 undefined
    },

  // 댓글 삭제 (user_id 체크는 컨트롤러에서 처리)
  async deleteComment(comment_id, user_id) {
    // 본인 댓글만 삭제 가능하도록 user_id 체크
    const [result] = await db.query(
      "DELETE FROM comments WHERE comment_id = ?",
      [comment_id]
    );
    return result.affectedRows; // 1이면 삭제 성공, 0이면 실패
  }
};
