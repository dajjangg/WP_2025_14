const db = require("../config/db");

module.exports = {
  async searchByTags(tagNames) {
    const placeholders = tagNames.map(() => "?").join(",");

    const sql = `
      SELECT 
        p.*, 
        u.user_name,
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