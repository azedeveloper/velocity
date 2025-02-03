const express = require("express");
const env = require("dotenv").config();
const cors = require("cors")
const authRoutes = require("./api/auth");
const userRoutes = require("./api/users");
const postRoutes = require("./api/posts");

const app = express();
app.use(express.json());
app.use(cors())

app.use(authRoutes);
app.use(userRoutes);
app.use(postRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
