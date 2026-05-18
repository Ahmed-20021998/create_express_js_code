const express = require("express");
const app = express();
const authRoutes = require("./routes/authRoutes");
const postsRoutes = require("./routes/postsRoutes");
const commentRoutes = require("./routes/commentRoutes");
const cookieParser = require("cookie-parser");
const cors = require("cors");


const PORT = 3000;

// middleware (optional)
app.use(express.json());
app.use(cookieParser());


app.use(cors({
  origin: "*"
}));


// Use the auth routes
app.use("/auth", authRoutes);
app.use("/posts", postsRoutes);
app.use("/comments", commentRoutes);



app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});