const express = require("express");
const router  = express.Router();
const auth    = require("../../middleware/authentication");
const conf    = require("config");
const jwt     = require("jsonwebtoken");
const bcrypt  = require('bcryptjs');
const { check, validationResult } = require("express-validator");

const User = require("../../models/User");

// @route   GET api/auth
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

// @route   POST api/auth
// @desc    Authenticate user and get token--i.e., user login.
// @access  Public
router.post(
  "/",
  [
    check("email", "Please provide a valid email.").isEmail(),
    check("password", "Password required.").exists(),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    // Destructure request body.
    const { email, password } = req.body;
    try {
      // Check if user exists.
      const user = await User.findOne({ email });
      if (!user) {
        return res
          .status(400)
          .json({ errors: [{ msg: "Invalid credentials" }] });
      }

      // Check for password match between raw password and stored password.
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res
          .status(400)
          .json({ errors: [{ msg: "Invalid credentials." }] });
      }

      // Return jsonwebtoken for user login.
      const payload = {
        user: {
          id: user.id,
        },
      };

      // Sign the payload into the JSON web token and return it to client.
      jwt.sign(
        payload,
        conf.get("jwtSecret"),
        { expiresIn: 360000 },
        (err, token) => {
          if (err) throw err;
          res.json({ token });
        }
      );
    } catch (error) {
      console.error(error.message);
      res.status(500).send("Server error.");
    }
  }
);

module.exports = router;