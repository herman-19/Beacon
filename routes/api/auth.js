const express = require("express");
const router  = express.Router();
const auth    = require("../../middleware/authentication");

const User = require("../../models/User");

// @route   GET /api/auth
// @desc    Use middleware to authenticate user for protected routes.
// @access  Public
router.get("/", auth, async (req, res) => {
  try {
    // Get user id from token.
    const user = await User.findById(req.user.id).select("-password");
    res.json(user);
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Server error.");
  }
});

module.exports = router;