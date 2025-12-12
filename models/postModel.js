// 게시물 데이터를 DB에서 조회, 등록, 수정, 삭제 가능
// 유저별 게시물 목록 조회 등도 포함

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

  // 게시물 전체 조회
  // 로그인 되어있다면 좋아요, 스크랩 여부 설정 포함
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

  // 게시글 상세 조회
  async getPostById(postId) {
    const [rows] = await db.query(
      `SELECT p.*, u.user_name, GROUP_CONCAT(t.tag_name) AS tags
       FROM posts p
       JOIN users u ON p.user_id = u.user_id
       LEFT JOIN post_tags pt ON p.post_id = pt.post_id
       LEFT JOIN tags t ON pt.tag_id = t.tag_id
       WHERE p.post_id = ?
       GROUP BY p.post_id`,
      [postId]
    );
    return rows;
  },

  // 게시글들만 시간 순서로 가져오기
  async getAll() {
    const [rows] = await db.query(
      "SELECT * FROM posts ORDER BY created_at DESC"
    );
    return rows;
  },

  // 특정 post_id로 게시물 조회
  async findById(post_id) {
    const [rows] = await db.query(
      "SELECT * FROM posts WHERE post_id = ?",
      [post_id]
    );
    return rows[0];
  },

  // 게시물 수정(업데이트)
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

  // 게시물 삭제
  async deletePost(post_id) {
    const [rows] = await db.query(
      "DELETE FROM posts WHERE post_id = ?",
      [post_id]
    );
    return rows.affectedRows;
  }
};


