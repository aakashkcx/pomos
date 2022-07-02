const express = require("express");
const socketio = require("socket.io");
const path = require("path");

const app = express();

const PORT = 8080 || process.env.PORT;

app.get("/", (req, res) => {
  res.redirect("/" + new Date().getTime().toString(36));
});

app.get("/:id", (req, res) => {
  res.sendFile(path.join(__dirname, "index.html"));
});

const server = app.listen(PORT, () =>
  console.log(`Server listening on port ${PORT}`)
);

const io = socketio(server);

io.on("connection", (socket) => {
  const room_id = socket.handshake.query.room_id;

  socket.join(room_id);
  io.to(room_id).emit("user-join", socket.id);
  console.log(`[Room ${room_id}] Socket connected ${socket.id}`);

  socket.on("start-work", (seconds) => {
    io.to(room_id).emit("start-work", seconds);
  });

  socket.on("start-break", (seconds) => {
    io.to(room_id).emit("start-break", seconds);
  });

  socket.on("stop", () => {
    io.to(room_id).emit("stop");
  });

  socket.on("disconnecting", () => {
    io.to(room_id).emit("user-leave", socket.id);
    console.log(`[Room ${room_id}] Socket disconnected ${socket.id}`);
  });
});
