const express = require("express");
const app = express();
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");
app.use(cors());
app.get("/", (req, res) => res.json({ message: "hello" }));
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "*",
  },
});

const onlineUsers = new Map();

io.on('connection', (socket) => {
  socket.on('addUser', (userId) => {
    console.log('User connected:', userId);
    onlineUsers.set(userId, socket.id);
    console.log('Online Users:', onlineUsers);
  });
  // 'send-msg' event to send a message to a specific user
  socket.on("send-msg", (data) => {
    console.log("Receiver ID:", data.to);
    console.log("Online Users:", onlineUsers);

    const sendUserSocket = onlineUsers.get(data.to);
    console.log("Socket ID:", sendUserSocket);

    if (sendUserSocket) {
      socket.to(sendUserSocket).emit("msg-receive", data);
    }
  });
});

server.listen(3001, () => {
  console.log("SERVER IS RUNNING");
});
