const express = require("express");
const router = express.Router();
const auth = require("../../middleware/authentication");
const fs = require("fs");
const path = require("path");
const conf = require("config");
const sgAPIKey = conf.get("SENDGRID_API_KEY");
const sgMail = require("@sendgrid/mail");
sgMail.setApiKey(sgAPIKey);

const { check, validationResult } = require("express-validator");

const User = require("../../models/User");
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
    const profile = await Profile.findOne({ user: req.user.id }).populate({
      path: "user",
      model: "user",
      select: ["name", "email"],
    });
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
    const profile = await Profile.findOne({
      user: req.params.userId,
    }).populate({ path: "user", model: "user", select: ["name", "email"] });
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
    const { file } = req;

    // Build profile object.
    const fields = {};
    fields.user = req.user.id;
    if (bio) fields.bio = bio;
    if (file) {
      console.log("PATH: " + "../uploads/" + req.file.filename);
      fields.img = {
        data: fs.readFileSync(
          path.resolve(__dirname, "../../uploads/", req.file.filename)
        ),
        contentType: req.body.contentType,
      };
    }

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

// @route   POST api/profiles/help/:userId
// @desc    Send email notification to user that
//          a different user wants to help with task
// @access  Private
router.post(
  "/help/:userId",
  [auth, [check("taskId", "Task id is required.").not().isEmpty()]],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    // Find profile and update task status to active.
    try {
      let helpingUser = await User.findOne({ _id: req.user.id });
      let profile = await Profile.findOne({
        user: req.params.userId,
      }).populate({ path: "user", model: "user", select: ["name", "email"] });
      if (!profile) {
        return res.status(400).json({ msg: "Profile not found." });
      }

      // Update profile task status to Active
      const { taskId } = req.body;
      const updatedTaskList = profile.tasks;
      const taskIndex = updatedTaskList.findIndex((el) => el._id == taskId);
      const updatedTask = updatedTaskList[taskIndex];
      updatedTaskList[taskIndex].status = "ACTIVE";

      // Send email notification to task owner.
      const msg = {
        to: profile.user.email,
        from: "beaconappnotification@gmail.com",
        subject: `${helpingUser.name} wants to help you!`,
        html: `<strong>Connect with ${helpingUser.name} to get your task done!</strong></br>
               <p>(Email: ${helpingUser.email})</p>
               <br/>
               <strong>Task</strong>
               <p>Title: ${updatedTask.title}</p>
               <p>Description: ${updatedTask.description}</p>
               <br/>
               <p>- Beacon</p>`,
      };
      await sgMail.send(msg);

      const fields = {};
      fields.tasks = updatedTaskList;
      profile = await Profile.findOneAndUpdate(
        { user: req.params.userId },
        { $set: fields },
        { new: true }
      );
      res.json(profile);
    } catch (err) {
      console.error(err.message);
      if (err.kind == "ObjectId") {
        return res.status(400).json({ msg: "Profile not found." });
      }
      res.status(500).send("Server Error");
    }
  }
);

// @route    DELETE api/profiles
// @desc     Delete profile and user
// @access   Private
router.delete("/", auth, async (req, res) => {
  try {
    await Profile.findOneAndDelete({ user: req.user.id });
    await User.findOneAndDelete({ _id: req.user.id });
    res.json({ msg: "User deleted." });
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Server Error.");
  }
});

// @route   PUT api/profiles/task
// @desc    Add a beacon task
// @access  Private
router.put(
  "/task",
  [auth, [check("title", "Title of task is required.").not().isEmpty()]],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(500).json({ errors: errors.array() });
    }

    // Destructure task fields.
    const { title, description, deadline, location } = req.body;
    const newTask = {
      title,
      description,
      deadline,
      location,
      status: "UNRESOLVED",
    };

    try {
      const profile = await Profile.findOne({ user: req.user.id });
      if (!profile) {
        return res
          .json(400)
          .json({ msg: "Profile must be created to add beacon task." });
      }

      profile.tasks.unshift(newTask);
      await profile.save();
      res.json(profile);
    } catch (error) {
      console.error(error.message);
      res.status(500).send("Server Error.");
    }
  }
);

// @route   DELETE api/profiles/task/:taskId
// @desc    Delete beacon task from profile
// @access  Private
router.delete("/task/:taskId", auth, async (req, res) => {
  try {
    const profile = await Profile.findOne({ user: req.user.id });

    // Get index of task to be removed from list of beacon tasks.
    const removalIdx = profile.tasks
      .map((item) => item.id)
      .indexOf(req.params.taskId);

    // Remove experience through splice.
    if (removalIdx !== -1) {
      profile.tasks.splice(removalIdx, 1);
    }

    await profile.save();
    res.json(profile);
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Server Error.");
  }
});

module.exports = router;
