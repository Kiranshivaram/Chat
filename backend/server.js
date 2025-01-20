
const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const { Sequelize, DataTypes } = require("sequelize");

const sequelize = new Sequelize("sqlite::memory:"); // SQLite database
const Message = sequelize.define("Message", {
  content: DataTypes.TEXT,
});

const app = express();
const server = http.createServer(app);
const io = new Server(server);

app.use(express.json());

app.get("/messages", async (req, res) => {
  const messages = await Message.findAll();
  res.json(messages);
});

io.on("connection", (socket) => {
  console.log("A user connected");

  socket.on("message", async (msg) => {
    await Message.create({ content: msg });
    io.emit("message", msg);
  });
});

sequelize.sync().then(() => {
  server.listen(4000, () => console.log("Server running on http://localhost:4000"));
});
