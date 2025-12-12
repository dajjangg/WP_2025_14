// 태그 기반 게시물 검색 기능을 위한 DB 처리

const db = require("../config/db");

module.exports = {
  // 특정 tag(tags)를 포함하는 게시물 정보 가져오기
  async searchByTags(tagNames, user_id) {
    const placeholders = tagNames.map(() => "?").join(",");

    const sql = `
      SELECT
        p.post_id,
        p.user_id,
        p.image_path,
        p.caption,
        p.description,
        p.category,
        p.likes_count,
        p.scraps_count,
        p.created_at,
        u.user_name,
        (SELECT GROUP_CONCAT(t2.tag_name)
         FROM post_tags pt2
         JOIN tags t2 ON pt2.tag_id = t2.tag_id
         WHERE pt2.post_id = p.post_id
        ) AS tags,
        COUNT(DISTINCT t.tag_name) AS match_count,
        CASE WHEN l.user_id IS NULL THEN FALSE ELSE TRUE END AS liked,
        CASE WHEN s.user_id IS NULL THEN FALSE ELSE TRUE END AS scrapped
      FROM posts p
      JOIN post_tags pt ON p.post_id = pt.post_id
      JOIN tags t ON pt.tag_id = t.tag_id
      JOIN users u ON p.user_id = u.user_id
      LEFT JOIN likes l ON l.post_id = p.post_id AND l.user_id = ?
      LEFT JOIN scraps s ON s.post_id = p.post_id AND s.user_id = ?
      WHERE t.tag_name IN (${placeholders})
      GROUP BY p.post_id, p.user_id, p.image_path, p.caption, p.description,
               p.category, p.likes_count, p.scraps_count, p.created_at, u.user_name
      HAVING match_count = ?
      ORDER BY p.created_at DESC;
    `;

    const params = [user_id, user_id, ...tagNames, tagNames.length];

    const [rows] = await db.query(sql, params);
    return rows;
  }
};