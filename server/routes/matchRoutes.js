const express = require("express");
const router = express.Router();
const matchController = require("../controllers/matchController");
const auth = require("../auth");
const { verify } = auth;

// GET POTENTIAL MATCHES (DISCOVERY)
router.get("/discover", verify, matchController.getPotentialMatches);

// SWIPE (LIKE OR SKIP)
router.post("/swipe", verify, matchController.swipe);

// GET ALL MY MATCHES
router.get("/", verify, matchController.getMyMatches);

// CHECK IF MATCHED WITH SPECIFIC USER
router.get("/check/:otherUserId", verify, matchController.checkMatch);

// UNMATCH
router.delete("/:matchedUserId", verify, matchController.unmatch);

module.exports = router;