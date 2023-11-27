const express = require("express");
const app = express();
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");

app.use(cors());
app.get('/',(req,res) => res.json({message: 'hello'}))
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "*"
  },
});
  
  global.onlineUsers = new Map()
  io.on('connection', (socket) => {
    global.chatsocket = socket
    socket.on('addUser', (id) =>{
        onlineUsers.set(id, socket.id)
    })

    socket.on('send-msg', (data) => {
      if (Array.isArray(data.to)) {
        data.to.forEach((userId) => {
          const sendUserSocket = onlineUsers.get(userId);
          if (sendUserSocket) {
            socket.to(sendUserSocket).emit('msg-receive', data);
          }
        });
      }
    });
});

  server.listen(3001, () => {
    console.log("SERVER IS RUNNING");
  });