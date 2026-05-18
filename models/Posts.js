const postsDB = require("../DB/posts.db");

class Posts {
    constructor(content, author, authorEmail) {
        this.content = content;
        this.author = author;
        this.authorEmail = authorEmail;
        this.createdAt = new Date();
        this.likes = 0;
    }

    newPost() {
        const newpost = postsDB.length + 1;
        postsDB.push({
            id: newpost,
            content: this.content,
            author: this.author,
            authorEmail: this.authorEmail,
            createdAt: this.createdAt,
            likes: this.likes
        });
        return { success: true, postsDB }; // ✅ return just the new post

    }

    getPosts() {
        return { success: true, posts: postsDB };
    }

    getPostById(id) {
        const post = postsDB.find(p => p.id === id);
        return post || { success: false, message: "Post not found" };
    }

    updatePost(id, newContent, userEmail) {
        const post = postsDB.find(p => p.id === id);
        if (!post) {
            return { success: false, message: "Post not found" };
        }
        if (post.authorEmail !== userEmail) {
            return { success: false, message: "Unauthorized to update this post" };
        }
        post.content = newContent;
        return { success: true, message: "Post updated successfully" };
    }

    deletePost(id, userEmail) {
        const postIndex = postsDB.findIndex(p => p.id === id);
        if (postIndex === -1) {
            return { success: false, message: "Post not found" };
        }
        postsDB.splice(postIndex, 1);
        return { success: true, message: "Post deleted successfully" };
    }
}

module.exports = Posts;