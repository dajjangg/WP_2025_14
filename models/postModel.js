const db = require("../config/db");
const likeModel = require("./likeModel");
const scrapModel = require("./scrapModel");

module.exports = {
  async createPost(user_id, image_path, caption, description, category) {
    const [result] = await db.query(
      "INSERT INTO posts (user_id, image_path, caption, description, category) VALUES (?, ?, ?, ?, ?)",
      [user_id, image_path, caption, description, category]
    );
    return result.insertId;
  },

  async getAllPosts(user_id) {
    const [posts] = await db.query(`
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
        GROUP_CONCAT(t.tag_name SEPARATOR ' ') AS tags
      FROM posts p
      JOIN users u ON p.user_id = u.user_id
      LEFT JOIN post_tags pt ON p.post_id = pt.post_id
      LEFT JOIN tags t ON pt.tag_id = t.tag_id
      GROUP BY p.post_id
      ORDER BY p.created_at DESC
    `);
    for (const post of posts) {
      if (user_id) {
        post.liked = await likeModel.hasUserLiked(post.post_id, user_id);
        post.scrapped = await scrapModel.hasUserScrapped(post.post_id, user_id);
      } else {
        post.liked = false;
        post.scrapped = false;
      }

    }
    return posts;
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

  async updatePost(post_id, fields) {
    const updates = [];
    const values = [];

    for (let key in fields) {
      if (fields[key] !== undefined && fields[key] !== null) {
        updates.push(`${key} = ?`);
        values.push(fields[key]);
      }
    }

    if (updates.length === 0) return;

    values.push(post_id);

    await db.query(
      `UPDATE posts SET ${updates.join(", ")} WHERE post_id = ?`,
      values
    );
  },

  async deletePost(post_id) {
    const [rows] = await db.query(
      "DELETE FROM posts WHERE post_id = ?",
      [post_id]
    );
    return rows.affectedRows;
  }
};


