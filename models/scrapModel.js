// 스크랩(즐겨찾기) 기능과 관련된 DB 처리
// 스크랩 추가/취소, 스크랩 수 조회, 스크랩 여부 확인 등 포함

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

  // 특정 게시물이 스크랩된 수 조회
  async countScraps(post_id) {
    const [rows] = await db.query(
      "SELECT scraps_count AS scrapCount FROM posts WHERE post_id = ?",
      [post_id]
    );
    return rows[0].scrapCount;
  },

  // 특정 사용자가 특정 게시물을 스크랩했는지 확인
  async hasUserScrapped(post_id, user_id) {
    const [rows] = await db.query(
      "SELECT 1 FROM scraps WHERE post_id = ? AND user_id = ?",
      [post_id, user_id]
    );
    return rows.length > 0;
  },

  // 해당 post 스크랩 수 변경
  async increaseScrapCount(post_id) {
    await db.query(
      "UPDATE posts SET scraps_count = scraps_count + 1 WHERE post_id = ?",
      [post_id]
    );
  },
  async decreaseScrapCount(post_id) {
    await db.query(
      "UPDATE posts SET scraps_count = GREATEST(scraps_count - 1, 0) WHERE post_id = ?",
      [post_id]
    );
  }
};