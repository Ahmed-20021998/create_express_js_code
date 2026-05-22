const express  = require("express");
const Posts    = require("../models/Posts");
const authMiddleware = require("../middleware/auth.middleware.js");
const upload   = require("../middleware/upload.middleware");

// Cloudinary v2 SDK
const cloudinary = require("cloudinary").v2;

// Config is read from env vars:
//   CLOUDINARY_CLOUD_NAME  CLOUDINARY_API_KEY  CLOUDINARY_API_SECRET
// Set these in your Vercel project → Settings → Environment Variables.
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key:    process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

const router = express.Router();

// Helper: upload a buffer to Cloudinary and return the secure URL
function uploadToCloudinary(buffer, mimetype) {
    return new Promise((resolve, reject) => {
        const resourceType = mimetype.startsWith("video") ? "video" : "image";
        const uploadStream = cloudinary.uploader.upload_stream(
            { resource_type: resourceType, folder: "commune" },
            (error, result) => {
                if (error) return reject(error);
                resolve(result.secure_url);
            }
        );
        uploadStream.end(buffer);
    });
}

// POST /posts/posts  — create a post (with optional media)
router.post("/posts", authMiddleware, upload.single("media"), async (req, res) => {
    try {
        let mediaUrl  = null;
        let mediaType = null;

        if (req.file) {
            mediaType = req.file.mimetype.split("/")[0]; // "image" or "video"
            mediaUrl  = await uploadToCloudinary(req.file.buffer, req.file.mimetype);
        }

        const { content } = req.body;
        const post   = new Posts(content, req.user.fullName, req.user.email, mediaUrl, mediaType);
        const result = post.newPost();
        res.status(result.success ? 201 : 400).json(result);
    } catch (err) {
        console.error("Media upload error:", err);
        res.status(500).json({ success: false, message: "Media upload failed: " + err.message });
    }
});

// GET /posts/posts
router.get("/posts", (req, res) => {
    const post = new Posts();
    res.status(200).json({ posts: post.getPosts() });
});

// GET /posts/post/:id
router.get("/post/:id", (req, res) => {
    const post = new Posts();
    res.status(200).json({ post: post.getPostById(parseInt(req.params.id)) });
});

// PUT /posts/post/:id
router.put("/post/:id", authMiddleware, (req, res) => {
    const { newContent } = req.body;
    const post   = new Posts();
    const result = post.updatePost(parseInt(req.params.id), newContent, req.user.email);
    res.status(result.success ? 200 : 403).json(result);
});

// DELETE /posts/post/:id
router.delete("/post/:id", authMiddleware, (req, res) => {
    const post   = new Posts();
    const result = post.deletePost(parseInt(req.params.id), req.user.email);
    res.status(result.success ? 200 : result.status).json(result);
});

// POST /posts/post/:id/like
router.post("/post/:id/like", (req, res) => {
    const result = Posts.likePost(req.params.id);
    res.status(result.success ? 200 : 404).json(result);
});

module.exports = router;