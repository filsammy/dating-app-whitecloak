require("dotenv").config();
const express = require("express");
const cors = require("cors");
const http = require("http");
const { Server } = require("socket.io");
const mongoose = require("mongoose");

const app = express();
app.use(express.json());
app.use(cors({ origin: "*", credentials: true }));

mongoose.connect(process.env.MONGO_URI);
mongoose.connection.once("open", () =>
  console.log("Now connected to MongoDB Atlas.")
);

const server = http.createServer(app);
const io = new Server(server, {
  cors: { origin: "*", methods: ["GET", "POST"] },
});

const socketHandler = require("./socketHandler");
socketHandler(io);

// ROUTES
const userRoutes = require("./routes/userRoutes");
app.use("/users", userRoutes);

const profileRoutes = require("./routes/profileRoutes");
app.use("/profiles", profileRoutes);

const matchRoutes = require("./routes/matchRoutes");
app.use("/matches", matchRoutes);

const messageRoutes = require("./routes/messageRoutes");
app.use("/messages", messageRoutes);

const blockRoutes = require("./routes/blockRoutes");
app.use("/users", blockRoutes);

// ERROR HANDLER
const { errorHandler } = require("./errorHandler");
app.use(errorHandler);

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));

module.exports = { app, io };