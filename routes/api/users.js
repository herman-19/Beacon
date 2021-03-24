const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const conf = require("config");
const { check, validationResult } = require("express-validator");

const User = require("../../models/User");
const Profile = require("../../models/Profile");

// @route   POST api/users
// @desc    Register user
// @access  Public
router.post(
  "/",
  [
    check("name", "Name is required.").not().isEmpty(),
    check("email", "Please provide a valid email.").isEmail(),
    check("password", "Password must be 8 or more characters.").isLength({
      min: 8,
    }),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    // Destructure request body to extract required fields.
    const { name, email, password } = req.body;
    try {
      // Check if user already exists.
      let user = await User.findOne({ email });
      if (user) {
        return res
          .status(400)
          .json({ errors: [{ msg: "User already exists." }] });
      }

      // Create instance of a user--not yet saved to database.
      user = new User({
        name,
        email,
        password,
      });

      // Encrypt password.
      const salt = await bcrypt.genSalt(10); // used to do the hashing
      user.password = await bcrypt.hash(password, salt);

      // Store new user to the database.
      await user.save();

      // Create associated user profile.
      console.log("New user id:" + user.id);
      const fields = {
        user: user.id,
        bio: "Hi! I'm new to Beacon--excited to help out!",
      };

      const profile = new Profile(fields);
      await profile.save();

      // Return jsonwebtoken so user is logged in after registration.
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
          console.log(`User created: ${name}!`);
          res.json({ token });
        }
      );
    } catch (error) {
      console.error(error.message);
      res.status(500).send("Server Error.");
    }
  }
);

module.exports = router;
