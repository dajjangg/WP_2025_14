const scrapModel = require("../models/scrapModel");

exports.toggleScrap = async (req, res) => {
  try {
    const post_id = req.params.post_id;
    const user_id = req.user.user_id;

    const alreadyScrapped = await scrapModel.hasUserScrapped(post_id, user_id);

    if (alreadyScrapped) {
      // 이미 스크랩 → 취소
      await scrapModel.removeScrap(post_id, user_id);
      await scrapModel.decreaseScrapCount(post_id);
      const count = await scrapModel.countScraps(post_id);
      return res.json({ scrapped: false, scrapCount: count, message: "스크랩 취소 성공" });
    } else {
      // 아직 안 했음 → 추가
      await scrapModel.addScrap(post_id, user_id);
      await scrapModel.increaseScrapCount(post_id);
      const count = await scrapModel.countScraps(post_id);
      return res.json({ scrapped: true, scrapCount: count, message: "스크랩 성공" });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "스크랩 토글 실패" });
  }
};

exports.getScrapCount = async (req, res) => {
  try {
    const post_id = req.params.post_id;
    const count = await scrapModel.countScraps(post_id);

    res.json({ post_id, scrapCount: count });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "스크랩 수 조회 실패" });
  }
};