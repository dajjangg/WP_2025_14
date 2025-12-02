const db = require("../config/db");

module.exports = {
  async createPost(user_id, image_path, caption) {
    const [result] = await db.query(
      "INSERT INTO posts (user_id, image_path, caption) VALUES (?, ?, ?)",
      [user_id, image_path, caption]
    );
    return result.insertId;
  },

  async getAllPosts() {
    const [rows] = await db.query(
      `SELECT p.*, u.user_name 
       FROM posts p 
       JOIN users u ON p.user_id = u.user_id
       ORDER BY p.created_at DESC`
    );
    return rows;
  },

  async getAll() {
    const [rows] = await db.query(
      "SELECT * FROM posts ORDER BY created_at DESC"
    );
    return rows;
  },

  async findById(post_id) {
    const [rows] = await db.query(
      "SELECT * FROM posts WHERE post_id = ?",
      [post_id]
    );
    return rows[0];
  },

  async deletePost(post_id) {
    const [rows] = await db.query(
      "DELETE FROM posts WHERE post_id = ?",
      [post_id]
    );
    return rows.affectedRows;
  }
};


