const tagModel = require("../models/tagModel");

exports.createTag = async (req, res) => {
  try {
    const { tag_name } = req.body;
    if (!tag_name) return res.status(400).json({ message: "태그 이름이 필요합니다." });

    const tagId = await tagModel.findOrCreateTag(tag_name);
    res.json({ message: "태그 생성 완료", tagId, tag_name });
  } catch (err) {
    res.status(500).json({ error: "태그 생성 실패" });
  }
};

exports.getTags = async (req, res) => {
  try {
    const tags = await tagModel.getAllTags();
    res.json(tags);
  } catch (err) {
    res.status(500).json({ error: "태그 조회 실패" });
  }
};

exports.getPostsByTag = async (req, res) => {
  try {
    const tagId = req.params.tag_id;
    const posts = await tagModel.getPostsByTag(tagId);
    res.json(posts);
  } catch (err) {
    res.status(500).json({ error: "게시물 조회 실패" });
  }
};

exports.getPostsByTagName = async (req, res) => {
  try {
    const tagName = req.params.tag_name;
    const posts = await tagModel.getPostsByTagName(tagName);

    if (posts.length === 0) {
      return res.status(404).json({ message: "해당 태그의 게시물이 없습니다." });
    }

    res.json(posts);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "게시물 조회 실패" });
  }
};

//exports.deleteTag = async (req, res) => {
//  try {
//    const tagId = req.params.tag_id;
//    await tagModel.deleteTag(tagId);
//    res.json({ message: "태그 삭제 완료" });
//  } catch (err) {
//    res.status(500).json({ error: "태그 삭제 실패" });
//  }
//};