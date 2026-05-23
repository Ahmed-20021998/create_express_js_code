// require("dotenv").config(); // ← must be first line

// const express = require("express");
// const app = express();
// const authRoutes = require("./routes/authRoutes");
// const postsRoutes = require("./routes/postsRoutes");
// const commentRoutes = require("./routes/commentRoutes");
// const cookieParser = require("cookie-parser");
// const cors = require("cors");
// const path = require("path");
// const fs = require("fs");

// const PORT = 3000;

// // Auto-create uploads/ folder locally — safely ignored on Vercel (read-only fs)
// const uploadsDir = path.join(__dirname, "uploads");
// try {
//   if (!fs.existsSync(uploadsDir)) {
//     fs.mkdirSync(uploadsDir, { recursive: true });
//   }
// } catch (e) {
//   // Vercel has a read-only filesystem, safe to ignore
// }

// // middleware
// app.use(express.json());
// app.use(cookieParser());
// app.use("/uploads", express.static(uploadsDir));

// app.use(cors({
//   origin: "*"
// }));

// // Routes
// app.use("/auth", authRoutes);
// app.use("/posts", postsRoutes);
// app.use("/comments", commentRoutes);

// app.listen(PORT, () => {
//   console.log(`Server is running on http://localhost:${PORT}`);
// });


require("dotenv").config();

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

const uploadsDir = path.join(__dirname, "uploads");
try {
  if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true });
  }
} catch (e) {
  // Vercel has a read-only filesystem, safe to ignore
}

// Allowed origins
const allowedOrigins = [
  "http://127.0.0.1:5500",
  "http://localhost:5500",
  "http://localhost:3000",
];

// middleware
app.use(express.json());
app.use(cookieParser());
app.use("/uploads", express.static(uploadsDir));

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (mobile apps, curl, Postman)
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error(`CORS blocked for origin: ${origin}`));
      }
    },
    credentials: true, // ← required for cookies/auth headers
  })
);

// Routes
app.use("/auth", authRoutes);
app.use("/posts", postsRoutes);
app.use("/comments", commentRoutes);

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});