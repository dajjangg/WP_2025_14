const db = require("../config/db");

module.exports = {
  async findByUsername(user_name) {
    const [rows] = await db.query(
      "SELECT * FROM users WHERE user_name = ?",
      [user_name]
    );
    return rows[0];
  },

  async findById(user_id) {
    const [rows] = await db.query(
      "SELECT * FROM users WHERE user_id = ?",
      [user_id]
    );
    return rows[0];
  },

  async createUser(user_name, pw_hash) {
    const [result] = await db.query(
      "INSERT INTO users (user_name, pw_hash) VALUES (?, ?)",
      [user_name, pw_hash]
    );
    return result.insertId;
  },

  async getUserById(user_id) {
    const [rows] = await db.query(
      `SELECT user_id, user_name, profile_image, intro, created_at 
      FROM users WHERE user_id = ?`,
      [user_id]
    );
    return rows[0];
  },

  async getProfileInfo(user_id) {
    const [userRows] = await db.query(
      `SELECT user_id, user_name, profile_image, intro, created_at
       FROM users
       WHERE user_id = ?`,
      [user_id]
    );
    if (userRows.length === 0) return null;
    const user = userRows[0];
    const [postCountRows] = await db.query(
      `SELECT COUNT(*) AS post_count
       FROM posts
       WHERE user_id = ?`,
      [user_id]
    );
    const [scrapCountRows] = await db.query(
      `SELECT COUNT(*) AS scrap_count
       FROM scraps
       WHERE user_id = ?`,
      [user_id]
    );
    return {
      ...user,
      post_count: postCountRows[0].post_count,
      scrap_count: scrapCountRows[0].scrap_count
    };
  },

  async getUserPosts(user_id) {
    const [rows] = await db.query(
      `SELECT 
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
        GROUP_CONCAT(t.tag_name SEPARATOR ' ') AS tags
      FROM posts p
      JOIN users u ON p.user_id = u.user_id
      LEFT JOIN post_tags pt ON p.post_id = pt.post_id
      LEFT JOIN tags t ON pt.tag_id = t.tag_id
      WHERE p.user_id = ?
      GROUP BY p.post_id
      ORDER BY p.created_at DESC`,
      [user_id]
    );
    return rows;
  },

  async getScrappedPosts(user_id) {
    const [rows] = await db.query(
      `SELECT
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
        s.created_at AS scrap_time,
        GROUP_CONCAT(t.tag_name SEPARATOR ' ') AS tags
      FROM scraps s
      JOIN posts p ON s.post_id = p.post_id
      JOIN users u ON p.user_id = u.user_id
      LEFT JOIN post_tags pt ON p.post_id = pt.post_id
      LEFT JOIN tags t ON pt.tag_id = t.tag_id
      WHERE s.user_id = ?
      GROUP BY p.post_id
      ORDER BY s.created_at DESC`,
      [user_id]
    );
    return rows;
  },

  async updateUserProfile(user_id, user_name = null, intro = null, profile_image = null) {
    let sql = `UPDATE users SET `;
    let params = [];
    let updateFields = [];

    // �̸� ����
    if (user_name !== null) {
      updateFields.push(`user_name = ?`);
      params.push(user_name);
    }

    // �Ұ� ����
    if (intro !== null) {
      updateFields.push(`intro = ?`);
      params.push(intro);
    }

    // ������ �̹��� ����
    if (profile_image !== null) {
      updateFields.push(`profile_image = ?`);
      params.push(profile_image);
    }

    // ������Ʈ�� �׸��� ���ٸ� ����
    if (updateFields.length === 0) return false;

    sql += updateFields.join(", ") + ` WHERE user_id = ?`;
    params.push(user_id);

    const [result] = await db.query(sql, params);
    return result.affectedRows > 0;
  },

  async updateProfileImage(userId, imagePath) {
    const [result] = await db.query(
      "UPDATE users SET profile_image = ? WHERE user_id = ?",
      [imagePath, userId]
    );
    return result;
  },

  async isUsernameTaken(user_name, exclude_user_id = null) {
    let sql = `SELECT user_id FROM users WHERE user_name = ?`;
    let params = [user_name];

    // ���� ���� ���� (���� �̸� �״�� ������ �� ���� ����)
    if (exclude_user_id !== null) {
      sql += ` AND user_id != ?`;
      params.push(exclude_user_id);
    }

    const [rows] = await db.query(sql, params);
    return rows.length > 0; // �ߺ� ���� �� true
  },

  // 닉네임 수정
  async updateUserName(user_id, user_name) {
    const [result] = await db.query(
      "UPDATE users SET user_name = ? WHERE user_id = ?",
      [user_name, user_id]
    );
    return result.affectedRows > 0;
  },

  // 소개 수정
  async updateIntro(user_id, intro) {
    const [result] = await db.query(
      "UPDATE users SET intro = ? WHERE user_id = ?",
      [intro, user_id]
    );
    return result.affectedRows > 0;
  }
};