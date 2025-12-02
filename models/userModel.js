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
  }
};3