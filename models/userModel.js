// 사용자 정보 관련 DB 처리
// 회원가입, 로그인용 데이터 조회, 프로필 정보 수정 등 포함

const db = require("../config/db");

module.exports = {
  // user_name(사용자 닉네임)으로 사용자 정보 조회
  async findByUsername(user_name) {
    const [rows] = await db.query(
      "SELECT * FROM users WHERE user_name = ?",
      [user_name]
    );
    return rows[0];
  },

  // user_id로 사용자 정보 조회
  async findById(user_id) {
    const [rows] = await db.query(
      "SELECT * FROM users WHERE user_id = ?",
      [user_id]
    );
    return rows[0];
  },

  // 새 사용자 생성 (회원가입)
  async createUser(user_name, pw_hash) {
    const [result] = await db.query(
      "INSERT INTO users (user_name, pw_hash) VALUES (?, ?)",
      [user_name, pw_hash]
    );
    return result.insertId;
  },

  // user_id로 프로필용 사용자 정보 조회
  async getUserById(user_id) {
    const [rows] = await db.query(
      `SELECT user_id, user_name, profile_image, intro, created_at 
      FROM users WHERE user_id = ?`,
      [user_id]
    );
    return rows[0];
  },

  // 프로필 페이지에서 필요한 전체 정보 조회
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

  // 사용자가 업로드한 게시물 전체 조회
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

  // 사용자가 스크랩한 게시물 전체 조회
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

  // 사용자 이름/소개/프로필 이미지 등을 선택적으로 업데이트
  async updateUserProfile(user_id, user_name = null, intro = null, profile_image = null) {
    let sql = `UPDATE users SET `;
    let params = [];
    let updateFields = [];

    if (user_name !== null) {
      updateFields.push(`user_name = ?`);
      params.push(user_name);
    }
    if (intro !== null) {
      updateFields.push(`intro = ?`);
      params.push(intro);
    }
    if (profile_image !== null) {
      updateFields.push(`profile_image = ?`);
      params.push(profile_image);
    }
    if (updateFields.length === 0) return false;

    sql += updateFields.join(", ") + ` WHERE user_id = ?`;
    params.push(user_id);

    const [result] = await db.query(sql, params);
    return result.affectedRows > 0;
  },

  // 프로필 이미지 경로만 업데이트
  async updateProfileImage(userId, imagePath) {
    const [result] = await db.query(
      "UPDATE users SET profile_image = ? WHERE user_id = ?",
      [imagePath, userId]
    );
    return result;
  },

  // 닉네임 중복 여부 확인 (닉네임 수정 시 필요)
  async isUsernameTaken(user_name, exclude_user_id = null) {
    let sql = `SELECT user_id FROM users WHERE user_name = ?`;
    let params = [user_name];

    if (exclude_user_id !== null) {
      sql += ` AND user_id != ?`;
      params.push(exclude_user_id);
    }

    const [rows] = await db.query(sql, params);
    return rows.length > 0;
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