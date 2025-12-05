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
      `SELECT user_id, user_name, profile_image, created_at 
      FROM users WHERE user_id = ?`,
      [user_id]
    );
    return rows[0];
  },

  async getProfileInfo(user_id) {
    const [userRows] = await db.query(
      `SELECT user_id, user_name, profile_image, created_at
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
      `SELECT p.*, u.user_name
      FROM posts p
      JOIN users u ON p.user_id = u.user_id
      WHERE p.user_id = ?
      ORDER BY p.created_at DESC`,
      [user_id]
    );
    return rows;
  },

  async getScrappedPosts(user_id) {
    const [rows] = await db.query(
      `SELECT p.*, s.created_at AS scrap_time, u.user_name
       FROM scraps s
       JOIN posts p ON s.post_id = p.post_id
       JOIN users u ON p.user_id = u.user_id
       WHERE s.user_id = ?
       ORDER BY s.created_at DESC`,
       [user_id]
    );
    return rows;
  }
};