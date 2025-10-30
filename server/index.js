require("dotenv").config();
const express = require("express");
const cors = require("cors");
const http = require("http");
const { Server } = require("socket.io");
const mongoose = require("mongoose");

const app = express();

// ✅ FIXED CORS CONFIGURATION
const allowedOrigins = [
  "http://localhost:3000",
  "http://localhost:3001", 
  process.env.FRONTEND_URL || "https://dating-app-henna.vercel.app", // Use env variable with fallback
];

app.use(
  cors({
    origin: function (origin, callback) {
      // Allow requests with no origin (like mobile apps or curl requests)
      if (!origin) return callback(null, true);
      
      if (allowedOrigins.indexOf(origin) === -1) {
        const msg = `The CORS policy for this site does not allow access from the specified Origin: ${origin}`;
        return callback(new Error(msg), false);
      }
      return callback(null, true);
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

app.use(express.json());

mongoose.connect(process.env.MONGO_URI);
mongoose.connection.once("open", () =>
  console.log("Now connected to MongoDB Atlas.")
);

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: allowedOrigins,
    methods: ["GET", "POST"],
    credentials: true,
  },
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