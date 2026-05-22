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
        if (!this.content) {
            throw new Error("Comment content is required");
        }

        const post = db.posts.find(
            post => post.id === Number(this.postId)
        );

        if (!post) {
            throw new Error("Post not found");
        }

        const user = db.users.find(
            u => u.fullName === this.createdBy
        );

        if (!user) {
            throw new Error("User not found");
        }

        const newComment = {
            id: nextId(db.comments),
            postId: Number(this.postId),
            content: this.content,
            createdAt: this.createdAt,
            updatedAt: this.updatedAt,
            createdBy: this.createdBy,
            createdByName: user.fullName
        };

        db.comments.push(newComment);
        saveDB(db);

        return newComment;
    }

    getCommentsByPostId(postId) {
        return db.comments.filter(c => c.postId === Number(postId));
    }
}

module.exports = Comments;