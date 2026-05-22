const comments = require("../DB/comments.db");
const posts = require("../DB/posts.db");
const users = require("../DB/user.db");

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
            id: comments.length + 1,
            postId: this.postId,
            content: this.content,
            createdAt: this.createdAt,
            updatedAt: this.updatedAt,
            createdBy: this.createdBy
        };

        comments.push(newComment);

        return newComment;
    }

    getCommentsByPostId(postId) {
        const postComments = comments.filter(
            comment => comment.postId === Number(postId)
        );
        return postComments;
    }


}

module.exports = Comments;