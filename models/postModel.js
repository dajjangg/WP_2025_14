const db = require("../config/db");

module.exports = {
  async createPhoto(user_id, image_path, caption) {
    const [result] = await db.query(
      "INSERT INTO photos (user_id, image_path, caption) VALUES (?, ?, ?)",
      [user_id, image_path, caption]
    );
    return result.insertId;
  },

  async getAllPhotos() {
    const [rows] = await db.query(
      `SELECT p.*, u.username 
       FROM photos p 
       JOIN users u ON p.user_id = u.id
       ORDER BY p.created_at DESC`
    );
    return rows;
  },

  async getPhotoById(photo_id) {
    const [rows] = await db.query(
      "SELECT * FROM photos WHERE photo_id = ?",
      [photo_id]
    );
    return rows[0];
  },

  async getAll() {
    const [rows] = await db.query(
      "SELECT * FROM photos ORDER BY created_at DESC"
    );
    return rows;
  },
  async findById(id) {
    const [rows] = await db.query(
      "SELECT * FROM photos WHERE photo_id = ?",
      [id]
    );
    return rows[0];
  },

  async deletePhoto(id) {
    const [rows] = await db.query(
      "DELETE FROM photos WHERE photo_id = ?",
      [id]
    );
    return rows.affectedRows;
  }
};


