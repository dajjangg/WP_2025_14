const searchModel = require("../models/searchModel");

exports.searchPosts = async (req, res) => {
  try {
    const query = req.query.q;

    if (!query || query.trim() === "") {
      return res.status(400).json({ message: "검색어를 입력하세요." });
    }

    // "부산 경치" → ['부산', '경치']
    const tags = query.trim().split(/\s+/);

    const posts = await searchModel.searchByTags(tags);

    res.json(posts);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "검색 오류" });
  }
};