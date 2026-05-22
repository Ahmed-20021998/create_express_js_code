const { db, saveDB, nextId } = require("../DB/db");

class Posts {
    // ✅ correct
    constructor(content, author, authorEmail, mediaUrl, mediaType) {
        this.content = content;
        this.author = author;
        this.authorEmail = authorEmail;
        this.createdAt = new Date();
        this.likes = 0;
        this.mediaUrl = mediaUrl || null;   // ← from parameter
        this.mediaType = mediaType || null; // ← from parameter
    }

    newPost() {
        const newPost = {
            id: nextId(db.posts), // FIX #2: safe ID even after deletes
            content: this.content,
            author: this.author,
            authorEmail: this.authorEmail,
            createdAt: this.createdAt,
            likes: this.likes,
            mediaUrl: this.mediaUrl,
            mediaType: this.mediaType
        };
        db.posts.push(newPost);
        saveDB(db); // FIX #1: persist to disk
        return { success: true, postsDB: db.posts };
    }

    getPosts() {
        return { success: true, posts: db.posts };
    }

    getPostById(id) {
        const post = db.posts.find(p => p.id === id);
        return post || { success: false, message: "Post not found" };
    }

    updatePost(id, newContent, userEmail) {
        const post = db.posts.find(p => p.id === id);
        if (!post) return { success: false, message: "Post not found" };
        if (post.authorEmail !== userEmail) return { success: false, message: "Unauthorized to update this post" };
        post.content = newContent;
        saveDB(db); // FIX #1: persist
        return { success: true, message: "Post updated successfully" };
    }

    deletePost(id, userEmail) {
        const postIndex = db.posts.findIndex(p => p.id === id);
        if (postIndex === -1) return { success: false, message: "Post not found" };

        // FIX #5: actually check ownership before deleting
        if (db.posts[postIndex].authorEmail !== userEmail) {
            return { success: false, message: "Unauthorized to delete this post" };
        }

        db.posts.splice(postIndex, 1);
        // Also delete the post's comments
        db.comments = db.comments.filter(c => c.postId !== id);
        saveDB(db); // FIX #1: persist
        return { success: true, message: "Post deleted successfully" };
    }

    static likePost(id) {
        const post = db.posts.find(p => p.id === parseInt(id));

        if (!post) {
            return {
                success: false,
                message: "Post not found"
            };
        }

        post.likes += 1;

        saveDB(db);

        return {
            success: true,
            message: "Post liked",
            likes: post.likes
        };
    }
}

module.exports = Posts;
