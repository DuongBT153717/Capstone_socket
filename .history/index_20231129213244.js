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
    socket.on('addUser', (userId) => {
      console.log('User connected:', userId);
      onlineUsers.set(userId, socket.id);
      console.log('Online Users:', onlineUsers);
    });

    // socket.on('send-msg', (data) => {
    //     const sendUserSocket = onlineUsers.get(data.to)
    //     console.log(data.to);
    //     console.log(sendUserSocket);
    //     if(sendUserSocket){
    //         socket.to(sendUserSocket).emit('msg-receive', data)
    //     }
    // })
    // socket.on('disconnect', () => {
    //   // Handle user disconnection by removing their entry from the onlineUsers map
    //   for (const [userId, userSocketId] of onlineUsers.entries()) {
    //     if (userSocketId === socket.id) {
    //       onlineUsers.delete(userId);
    //       console.log(`User disconnected: ${userId}`);
    //       break;
    //     }
    //   }
    // });

    socket.on("join-chat", (room) => {
      socket.join(room);
      console.log("User Joined Room: " + room);
    });

    // socket.on('send-msg', (data) => {
    //   if (Array.isArray(data.to)) {
    //     data.to.forEach((userId) => {
    //       const sendUserSocket = onlineUsers.get(userId);
    //       console.log(userId);
    //       console.log(sendUserSocket);
    //       if (sendUserSocket) {
    //         socket.to(sendUserSocket).emit('msg-receive', data);
    //       }
    //     });
    //   }
    // });

    socket.on("send-msg", (data) => {
      data.to.forEach((userId) => {
        if (userId == data.senderId) return;
  
        socket.in(userId).emit("msg-receive", data);
      });
    });
  })

  server.listen(3001, () => {
    console.log("SERVER IS RUNNING");
  });