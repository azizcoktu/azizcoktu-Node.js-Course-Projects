const path = require("path");
const http = require("http");
const express = require("express");
const socketio = require("socket.io");
const Filter = require("bad-words");
const { generateMessage } = require("./utils/messages.js");
const {
  addUser,
  removeUser,
  getUser,
  getUsersInRoom,
} = require("./utils/users.js");

const app = express();
const server = http.createServer(app);
const io = socketio(server);

const port = process.env.PORT || 3000;
const publicDirectoryPath = path.join(__dirname, "../public");

app.use(express.static(publicDirectoryPath));

io.on("connection", (socket) => {
  console.log("New WebSocket connection");

  socket.on("join", ({ username, room }, callback) => {
    const { error, user } = addUser({ id: socket.id, username, room });

    if (error) {
      return callback(error);
    }

    socket.join(user.room);

    socket.emit("message", generateMessage("Welcome!"));
    socket.broadcast
      .to(user.room)
      .emit("message", generateMessage(`${user.username} has joined`));

    io.to(user.room).emit("roomData", {
      room: user.room,
      users: getUsersInRoom(user.room),
    });

    callback();
  });

  socket.on("disconnect", () => {
    const removedUser = removeUser(socket.id);

    if (removedUser)
      io.to(removedUser.room).emit(
        "message",
        generateMessage(`${removedUser.username} has left!`)
      );
  });

  socket.on("sendMessage", (message, callback) => {
    const filter = new Filter();
    if (filter.isProfane(message)) return callback("Profanity is not allowed!");
    const user = getUser(socket.id);
    io.to(user.room).emit("message", generateMessage(message, user.username));
    callback();
  });

  socket.on("sendLocation", (coords, callback) => {
    const user = getUser(socket.id);
    io.to(user.room).emit(
      "locationMessage",
      generateMessage(
        `https://google.com/maps?q=${coords.latitude},${coords.longitude}`,
        user.username
      )
    );
    callback();
  });
});

server.listen(port, () => console.log(`Server is up on port ${port}`));
