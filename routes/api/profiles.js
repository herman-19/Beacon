const express = require("express");
const router  = express.Router();
const auth    = require("../../middleware/authentication");

const Profile = require("../../models/Profile");

// @route   GET api/profiles
// @desc    Get all user profiles
// @access  Public
router.get("/", async (req, res) => {
  try {
    // Retrieve all existing profiles.
    const profiles = await Profile.find({}).populate("user", ["name", "email"]);
    return res.json(profiles);
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Server Error.");
  }
});

// @route   GET api/profiles/me
// @desc    Retrieve profile of user based on token
// @access  Private
router.get("/me", auth, async (req, res) => {
  try {
    const profile = await (
      await Profile.findOne({ user: req.user.id })
    ).populate("user", ["name", "email"]);
    if (!profile) {
      return res.status(400).json({ msg: "No existing profile." });
    } else {
      return res.json(profile);
    }
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Server Error.");
  }
});

module.exports = router;
