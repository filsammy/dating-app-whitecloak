const Message = require("./models/Message");

function socketHandler(io) {
  io.on("connection", (socket) => {
    console.log("User connected:", socket.id);

    // Join chat room
    socket.on("joinChat", (matchId) => {
      socket.join(matchId);
      console.log(`User joined match room: ${matchId}`);
    });

    // Send message event
    socket.on("sendMessage", async (data) => {
      try {
        const { matchId, senderId, receiverId, content } = data;
        const message = await Message.create({ matchId, senderId, receiverId, content });

        io.to(matchId).emit("receiveMessage", message);
      } catch (err) {
        console.error("Socket message error:", err);
      }
    });

    socket.on("disconnect", () => {
      console.log("User disconnected:", socket.id);
    });
  });
}

module.exports = socketHandler;
