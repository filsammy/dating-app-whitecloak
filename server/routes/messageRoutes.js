const express = require("express");
const router = express.Router();
const messageController = require("../controllers/messageController");
const auth = require("../auth");
const { verify } = auth;

// GET ALL CONVERSATIONS
router.get("/conversations", verify, messageController.getAllConversations);

// GET MESSAGES BY MATCH ID
router.get("/:matchId", verify, messageController.getMessagesByMatchId);

// SEND MESSAGE (HTTP backup)
router.post("/", verify, messageController.sendMessage);

// DELETE MESSAGE
router.delete("/:messageId", verify, messageController.deleteMessage);

module.exports = router;