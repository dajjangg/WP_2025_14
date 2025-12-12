// 게시물의 태그 데이터를 저장 및 조회하는 DB 처리
// 게시물-태그 관계 관련 기능 포함

const db = require("../config/db");

// 태그 생성 또는 기존 태그 찾기
exports.findOrCreateTag = async (tagName) => {
  const [rows] = await db.query("SELECT tag_id FROM tags WHERE tag_name = ?", [tagName]);
  if (rows.length > 0) return rows[0].tag_id;

  const [result] = await db.query("INSERT INTO tags (tag_name) VALUES (?)", [tagName]);
  return result.insertId;
};

// 특정 게시물에 태그 추가
exports.addTagToPost = async (postId, tagId) => {
  await db.query("INSERT INTO post_tags (post_id, tag_id) VALUES (?, ?)", [postId, tagId]);
};

// 특정 게시물의 태그 모두 삭제
exports.removeTagsFromPost = async (postId) => {
  await db.query("DELETE FROM post_tags WHERE post_id = ?", [postId]);
};

// 전체 태그 조회
exports.getAllTags = async () => {
  const [rows] = await db.query("SELECT * FROM tags");
  return rows;
};

// 특정 태그로 게시물 조회
exports.getPostsByTag = async (tagId) => {
  const [rows] = await db.query(
    `SELECT p.* FROM posts p
     JOIN post_tags pt ON p.post_id = pt.post_id
     WHERE pt.tag_id = ?`,
    [tagId]
  );
  return rows;
};

// 태그 이름으로 게시물 조회
exports.getPostsByTagName = async (tagName) => {
  const [rows] = await db.query(
    `SELECT p.* FROM posts p
     JOIN post_tags pt ON p.post_id = pt.post_id
     JOIN tags t ON pt.tag_id = t.tag_id
     WHERE t.tag_name = ?`,
    [tagName]
  );
  return rows;
};

// orphan 태그 정리 (post 삭제때 아무도 안쓰는 tag 제거용)
exports.cleanupOrphanTags = async () => {
  await db.query(`
    DELETE FROM tags
    WHERE tag_id NOT IN (SELECT DISTINCT tag_id FROM post_tags)
  `);
};