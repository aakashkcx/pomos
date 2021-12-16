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
  console.log(`Socket connected ${socket.id}`);

  socket.on("join", (room_id) => {
    socket.join(room_id);
    socket.to(room_id).emit("user-join", socket.id);
  });

  socket.on("disconnecting", () => {
    console.log(`Socket disconnected ${socket.id}`);
    socket.rooms.forEach((room_id) => {
      console.log(room_id);
      socket.to(room_id).emit("user-leave", socket.id);
    });
  });
});
