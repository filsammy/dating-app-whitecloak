const express = require("express");
const router = express.Router();
const { verify } = require("../auth");
const { blockUser, unblockUser, getBlockedUsers } = require("../controllers/blockController");

router.post("/block", verify, blockUser);
router.post("/unblock", verify, unblockUser);
router.get("/blocked", verify, getBlockedUsers);

module.exports = router;
