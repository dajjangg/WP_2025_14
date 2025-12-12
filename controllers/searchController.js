// 태그 기반 검색 요청 처리

const searchModel = require("../models/searchModel");

// 태그 기반 검색
exports.searchPosts = async (req, res) => {
  try {
    const query = req.query.q;
    const user_id = req.user ? req.user.user_id : null; // 로그인 사용자 ID

    if (!query || query.trim() === "") {
      return res.status(400).json({ message: "검색어를 입력하세요." });
    }

    // "부산 경치" → ['부산', '경치']
    const tags = query.trim().split(/\s+/);

    const posts = await searchModel.searchByTags(tags, user_id);

    res.json(posts);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "검색 오류" });
  }
};