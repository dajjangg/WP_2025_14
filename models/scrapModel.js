const db = require("../config/db");

module.exports = {
  // 스크랩 추가
  async addScrap(post_id, user_id) {
    const [result] = await db.query(
      "INSERT INTO scraps (post_id, user_id) VALUES (?, ?)",
      [post_id, user_id]
    );
    return result.affectedRows;
  },

  // 스크랩 취소
  async removeScrap(post_id, user_id) {
    const [result] = await db.query(
      "DELETE FROM scraps WHERE post_id = ? AND user_id = ?",
      [post_id, user_id]
    );
    return result.affectedRows;
  },

  // 특정 게시물 스크랩 수 조회
  async countScraps(post_id) {
    const [rows] = await db.query(
      "SELECT COUNT(*) AS scrapCount FROM scraps WHERE post_id = ?",
      [post_id]
    );
    return rows[0].scrapCount;
  },

  // 특정 사용자가 스크랩했는지 확인
  async hasUserScrapped(post_id, user_id) {
    const [rows] = await db.query(
      "SELECT 1 FROM scraps WHERE post_id = ? AND user_id = ?",
      [post_id, user_id]
    );
    return rows.length > 0;
  }
};