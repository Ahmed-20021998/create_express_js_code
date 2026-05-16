const express = require("express");
const app = express();
const authRoutes = require("./routes/authRoutes");
const cookieParser = require("cookie-parser");


const PORT = 3000;

// middleware (optional)
app.use(express.json());
app.use(cookieParser());

app.use(cors({
  origin: "*"
}));


// Use the auth routes
app.use("/auth", authRoutes);



app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});