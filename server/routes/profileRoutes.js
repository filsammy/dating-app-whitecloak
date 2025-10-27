const express = require("express");
const router = express.Router();
const profileController = require("../controllers/profileController");
const auth = require("../auth");
const { verify } = auth;

// CREATE OR UPDATE PROFILE
router.post("/", verify, profileController.createOrUpdateProfile);

// GET OWN PROFILE
router.get("/me", verify, profileController.getMyProfile);

// GET PROFILE BY ID
router.get("/:profileId", verify, profileController.getProfileById);

// DELETE PROFILE
router.delete("/", verify, profileController.deleteProfile);

module.exports = router;