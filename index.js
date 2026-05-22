require("dotenv").config(); // ← must be first line

const express = require("express");
const app = express();
const authRoutes = require("./routes/authRoutes");
const postsRoutes = require("./routes/postsRoutes");
const commentRoutes = require("./routes/commentRoutes");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const path = require("path");
const fs = require("fs");

const PORT = 3000;

// Auto-create uploads/ folder locally (on Vercel this is skipped gracefully)
const uploadsDir = path.join(__dirname, "uploads");
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// middleware
app.use(express.json());
app.use(cookieParser());
app.use("/uploads", express.static(uploadsDir));

app.use(cors({
  origin: "*"
}));

// Routes
app.use("/auth", authRoutes);
app.use("/posts", postsRoutes);
app.use("/comments", commentRoutes);

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});