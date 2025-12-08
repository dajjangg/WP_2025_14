const db = require("../config/db");

module.exports = {
  async searchByTags(tagNames) {
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
        COUNT(*) AS match_count
      FROM posts p
      JOIN post_tags pt ON p.post_id = pt.post_id
      JOIN tags t ON pt.tag_id = t.tag_id
      JOIN users u ON p.user_id = u.user_id
      WHERE t.tag_name IN (${placeholders})
      GROUP BY p.post_id
      HAVING match_count = ?
      ORDER BY p.created_at DESC;
    `;

    const params = [...tagNames, tagNames.length];

    const [rows] = await db.query(sql, params);
    return rows;
  }
};