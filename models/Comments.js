const { db, saveDB, nextId } = require("../DB/db");

class Comments {
    constructor(postId, content, createdBy) {
        this.postId = Number(postId);
        this.content = content;
        this.createdAt = new Date();
        this.updatedAt = new Date();
        this.createdBy = createdBy;
    }

    createComment() {
        if (!this.content) throw new Error("Comment content is required");

        const post = posts.find(
            post => post.id === this.postId
        );

        if (!post) {
            throw new Error("Post not found");
        }

        const user = users.find(
            user => user.id === this.createdBy
        );

        if (!user) {
            throw new Error("User not found");
        }

        const newComment = {
            id: nextId(db.comments), // FIX #2: safe ID
            postId: this.postId,
            content: this.content,
            createdAt: this.createdAt,
            updatedAt: this.updatedAt,
            createdBy: this.createdBy
        };

        db.comments.push(newComment);
        saveDB(db); // FIX #1: persist
        return newComment;
    }

    getCommentsByPostId(postId) {
        return db.comments.filter(c => c.postId === Number(postId));
    }
}

module.exports = Comments;
