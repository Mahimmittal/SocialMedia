const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const morgan = require("morgan");
const helmet = require("helmet");
const cors = require("cors");
const app = express();
const userRoute = require("./routes/users");
const authRoute = require("./routes/auth");
const postRoute = require("./routes/posts");
const conversationRoute = require("./routes/conversations");
const messageRoute = require("./routes/messages");
const multer = require("multer");
const path = require("path");

dotenv.config();

mongoose.connect(
  process.env.MONGO_URL,
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  },
  (err) => {
    if (err) console.log(err);
    console.log("Connected to mongoDB Server");
  }
);
app.use(cors());

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "public/images");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + file.originalname);
  },
});
app.use("/images", express.static(path.join(__dirname, "public/images")));
app.use(express.static(path.join(__dirname, "/client/build/")));

// Middlewares
const upload = multer({ storage });
app.post("/api/upload", upload.single("file"), (req, res) => {
  try {
    return res.send(200, res.req.file.filename);
  } catch (err) {
    console.log(err);
  }
});

app.use(express.json());
app.use(helmet());
app.use(morgan("common"));
app.use("/api/users", userRoute);
app.use("/api/auth", authRoute);
app.use("/api/posts", postRoute);
app.use("/api/conversations", conversationRoute);
app.use("/api/messages", messageRoute);
app.get("*", (req, res) => {
  res
    .set(
      "Content-Security-Policy",
      "style-src 'self' http://* 'unsafe-inline'; script-src 'self' http://* 'unsafe-inline' 'unsafe-eval'"
    )
    .sendFile(path.join(__dirname, "/client/build/", "index.html"));
});
const server = app.listen(process.env.PORT || 8000, () => {
  console.log("Backend server is running on port 8000");
});
const io = require("socket.io")(server, {
  cors: {
    origin: "https://mahimsocialapp.herokuapp.com/",
  },
});
let users = [];
const addUser = (userId, socketId) => {
  if (!users.some((user) => user.userId === userId)) {
    users.push({ userId, socketId });
  }
};
const removeUser = (socketId) => {
  users = users.filter((user) => user.socketId !== socketId);
};
const getUser = (userId) => {
  return users.find((user) => user.userId === userId);
};
io.on("connection", (socket) => {
  // When connected
  console.log("A user connected.");
  // take userId and socketId from user
  socket.on("addUser", (userId) => {
    addUser(userId, socket.id);
    io.emit("getUsers", users);
  });
  // send and get message
  socket.on("sendMessage", ({ senderId, receiverId, text }) => {
    const user = getUser(receiverId);
    io.to(user.socketId).emit("getMessage", {
      senderId,
      text,
    });
  });
  // When disconnect
  socket.on("disconnect", () => {
    console.log("A user disconnected");
    removeUser(socket.id);
    io.emit("getUsers", users);
  });
});
