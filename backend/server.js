const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const mongoose = require("mongoose");
const cors = require("cors");

const Message = require("./models/Message");

const app = express();

app.use(cors());
app.use(express.json());

mongoose
.connect("mongodb://127.0.0.1:27017/chatapp")
.then(() => console.log("MongoDB Connected"))
.catch((err) => console.log(err));

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
  },
});

io.on("connection", (socket) => {

  console.log("User Connected:", socket.id);

  socket.on("join_room", async (room) => {

    socket.join(room);
    console.log("User joined room:", room);

    const messages = await Message.find({ room: room });
    socket.emit("previous_messages", messages);

  });

  socket.on("send_message", async (data) => {

    const newMessage = new Message(data);
    await newMessage.save();

    socket.to(data.room).emit("receive_message", data);

  });

  socket.on("disconnect", () => {
    console.log("User Disconnected", socket.id);
  });

});

server.listen(5000, () => {
  console.log("Server running on port 5000");
});