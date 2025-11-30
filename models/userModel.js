const db = require("../config/db");

module.exports = {
  async findByUsername(username) {
    const [rows] = await db.query(
      "SELECT * FROM users WHERE username = ?",
      [username]
    );
    return rows[0];
  },

  async findById(id) {
    const [rows] = await db.query(
      "SELECT * FROM users WHERE id = ?",
      [id]
    );
    return rows[0];
  },

  async createUser(username, pw_hash) {
    const [result] = await db.query(
      "INSERT INTO users (username, pw_hash) VALUES (?, ?)",
      [username, pw_hash]
    );
    return result.insertId;
  }
};