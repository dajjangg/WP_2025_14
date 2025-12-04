const postModel = require("../models/postModel");
const tagModel = require("../models/tagModel");
const fs = require("fs");
const path = require("path");

exports.uploadPost = async (req, res) => {
  try {
    const user_id = req.user.user_id; // 로그인한 사용자
    const image_path = path.join("uploads", req.file.filename);
    const caption = req.body.caption || null;
    const description = req.body.description || null;
    const category = req.body.category || null;
    let tags = []; // 태그 -> 띄어쓰기 구분, 배열/문자열 모두 처리
    if (req.body.tags) {
      const rawTags = Array.isArray(req.body.tags)
        ? req.body.tags.join(" ")
        : req.body.tags;

      tags = rawTags
        .split(" ")
        .map(t => t.trim())
        .filter(t => t.length > 0);
    }

    const allowedCategories = ["한식", "중식", "양식", "일식", "기타"];
    if (category && !allowedCategories.includes(category)) {
      return res.status(400).json({ message: "잘못된 카테고리입니다." });
    }

    const postId = await postModel.createPost(user_id, image_path, caption, description, category);

    //태그 처리
    if (tags.length > 0) {
      for (const tagName of tags) {
        const tagId = await tagModel.findOrCreateTag(tagName.trim());
        await tagModel.addTagToPost(postId, tagId);
      }
    }

    return res.json({
      message: "사진 업로드 성공", 
      postId,
      image_path,
      caption,
      description,
      category,
      tags
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "업로드 실패" });
  }
};

exports.getPosts = async (req, res) => {
  try {
    const posts = await postModel.getAllPosts();
    return res.json(posts);
  } catch (err) {
    res.status(500).json({ error: "불러오기 실패" });
  }
};

exports.listPosts = async (req, res) => {
  try {
    const posts = await postModel.getAll();
    return res.json(posts);
  } catch (err) {
    res.status(500).json({ error: "불러오기 실패" });
  }
};

exports.updatePost = async (req, res) => {
  try {
    const postId = req.params.post_id;
    const userId = req.user.user_id;

    const { caption, description, category } = req.body;

    let tags = [];
    if (req.body.tags) {
      const rawTags = Array.isArray(req.body.tags)
        ? req.body.tags.join(" ")     // 배열이면 공백 문자열로 합치기
        : req.body.tags;              // 문자열이면 그대로

      tags = rawTags
        .split(" ")                   // 공백 기준 분리
        .map(t => t.trim())
        .filter(t => t.length > 0);   // 빈 문자열 제거
    }

    const allowedCategories = ["한식", "중식", "양식", "일식", "기타"]; // category 제한

    if (category && !allowedCategories.includes(category)) {
      return res.status(400).json({ message: "잘못된 카테고리입니다." });
    }

    const post = await postModel.findById(postId);
    if (!post) return res.status(404).json({ message: "게시물을 찾을 수 없습니다." });

    if (post.user_id !== userId) {
      return res.status(403).json({ message: "수정 권한이 없습니다." });
    }

    // 변경된 이미지 처리
    let newImagePath = post.image_path;

    if (req.file) {
      // 기존 파일 삭제
      const oldPath = path.join(__dirname, "..", post.image_path);
      if (fs.existsSync(oldPath)) fs.unlinkSync(oldPath);

      newImagePath = path.join("uploads", req.file.filename);
    }

    // 업데이트 실행
    await postModel.updatePost(postId, {
      caption,
      description,
      category,
      image_path: newImagePath
    });

    // 태그 업데이트 (기존 태그 삭제 후 새로 추가)
    if (req.body.tags !== undefined) {
      // 기존 태그 모두 삭제
      await tagModel.removeTagsFromPost(postId);

      // 새 태그 등록
      for (const tagName of tags) {
        const tagId = await tagModel.findOrCreateTag(tagName);
        await tagModel.addTagToPost(postId, tagId);
      }
    }


    res.json({ message: "게시물 수정 완료" });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "수정 실패" });
  }
};

exports.deletePost = async (req, res) => {
  try {
    const postId = req.params.post_id;
    const userId = req.user.user_id; // 로그인한 사용자

    const post = await postModel.findById(postId);

    if (!post) {
      return res.status(404).json({ message: "사진을 찾을 수 없습니다." });
    }

    // 다른 사용자의 사진 삭제 금지
    if (post.user_id !== userId) {
      return res.status(403).json({ message: "삭제 권한이 없습니다." });
    }
    // 파일 경로 생성
    const filePath = path.join(__dirname, "..", post.image_path);
    // 파일 존재하면 삭제
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }
    // DB에서도 삭제
    await postModel.deletePost(postId);

    // 태그 정리, 아무도 안쓰는 tag 삭제 (tagModel 호출)
    await tagModel.cleanupOrphanTags();

    res.json({ message: "사진 삭제 완료" });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "서버 오류" });
  }
};