const express = require("express");
const Posts = require("../models/Posts");
const authMiddleware = require("../middleware/auth.middleware.js");

const router = express.Router();

router.post("/post",authMiddleware, (req, res) => {
    const { content } = req.body;
    const post = new Posts(content, req.user.fullName, req.user.email);
    res.status(201).json({ message: post.newPost() });
});

router.get("/posts", (req, res) => {
    const post = new Posts();
    res.status(200).json({ posts: post.getPosts() });
});

router.get("/post/:id", (req, res) => {
    const post = new Posts();
    res.status(200).json({ post: post.getPostById(parseInt(req.params.id)) });
});

router.put("/post/:id", authMiddleware, (req, res) => {
    const { newcontent } = req.body;
    const post = new Posts();
    const result = post.updatePost(parseInt(req.params.id), newcontent, req.user.email);
    res.status(result.success ? 200 : 403).json(result);
});

router.delete("/post/:id", authMiddleware, (req, res) => {
    const post = new Posts();
    const result = post.deletePost(parseInt(req.params.id), req.user.email);
    res.status(result.success ? 200 : result.status).json(result);
});

router.post("/post/:id/like", (req, res) => {
    const post = new Posts();
    const result = Posts.likePost(req.params.id);
    res.status(result.success ? 200 : 404).json(result);
});

module.exports = router;