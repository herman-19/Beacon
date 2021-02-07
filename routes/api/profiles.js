const express = require("express");
const router  = express.Router();
const auth    = require("../../middleware/authentication");
const { check, validationResult } = require("express-validator");

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
    res.status(500).send("Error: Could not retrieve profile.");
  }
});

// @route   GET api/profiles/user/:userId
// @desc    Get profile by user id
// @access  Public
router.get("/user/:userId", async (req, res) => {
  try {
    console.log(req.params.userId)
    const profile = await Profile.findOne({
      user: req.params.userId,
    }).populate("user", ["name", "email"]);

    if (!profile) {
      return res.status(400).json({ msg: "Profile not found." });
    }

    res.json(profile);
  } catch (err) {
    console.error(err.message);
    if (err.kind == "ObjectId") {
      return res.status(400).json({ msg: "Profile not found." });
    }
    res.status(500).send("Server Error");
  }
});

// @route   POST api/profiles
// @desc    Create or update user profile
// @access  Private
router.post(
  "/",
  [auth, [check("bio", "Bio is a required field.").not().isEmpty()]],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    // Destructure profile fields from request body.
    const { bio } = req.body;

    // Build profile object.
    const fields = {};
    fields.user = req.user.id;
    if (bio) fields.bio = bio;

    try {
      let profile = await Profile.findOne({ user: req.user.id });
      if (!profile) {
        // No profile found--create new profile.
        profile = new Profile(fields);
        await profile.save();
        res.json(profile);
      } else {
        // Found profile--update it.
        profile = await Profile.findOneAndUpdate(
          { user: req.user.id },
          { $set: fields },
          { new: true }
        );
        res.json(profile);
      }
    } catch (error) {
      console.error(error.message);
      res.status(500).send("Server Error.");
    }
  }
);

module.exports = router;
