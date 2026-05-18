const express = require("express");
const Comments = require("../models/Comments");
const authMiddleware = require("../middleware/auth.middleware.js");

const router = express.Router();

router.post("/comment/:postId", authMiddleware, (req, res) => {
    try {
        const { postId } = req.params;
        const { content } = req.body;
        const createdBy = req.user.fullName;
        const createdByEmail = req.user.email; // FIX #4: pass email for reliable validation

        const comment = new Comments(postId, content, createdBy, createdByEmail);
        const newComment = comment.createComment();
        res.status(201).json(newComment);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

router.get("/comments/:postId", (req, res) => {
    try {
        const { postId } = req.params;
        const comment = new Comments();
        const postComments = comment.getCommentsByPostId(postId);
        res.status(200).json(postComments);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

module.exports = router;
