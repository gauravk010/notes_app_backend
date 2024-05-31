const express = require("express");
const User = require("../models/user");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const authenticate = require("../middleware/AuthenticateUser");
const secret = "gaurav";
const router = express.Router();

// route 1: Create a User using: POST "/register".
router.post("/register", async (req, res) => {
  try {
    let success = false;

    // check to find if user already exist or not
    let user = await User.findOne({ email: req.body.email });
    if (user) {
      return res
        .status(400)
        .send({success, error: "Email address already exists" });
    }

    //  converting password into hash
    const salt = await bcrypt.genSalt(10);
    const secPass = await bcrypt.hash(req.body.password, salt);

    // creating a new user
    user = new User({
      fullname: req.body.fullname,
      email: req.body.email,
      password: secPass,
    });

    success = true;
    let result = await user.save();
    res.status(200).json({ success, message: "User created" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message });
  }
});

// route 2: Authenticate a User using: POST "/login".
router.post("/login", async (req, res) => {
  try {
    let success = false;

    // check to find if user registered or not
    let user = await User.findOne({ email: req.body.email });
    if (!user) {
      return res
        .status(400)
        .send({ message: "Please try to login with correct credentials" });
    }

    // check to find if password is correct or not
    const comparePassword = await bcrypt.compare(
      req.body.password,
      user.password
    );
    if (!comparePassword) {
      return res
        .status(400)
        .send({ message: "Please try to login with correct credentials" });
    }

    const data = {
      user: {
        id: user._id.toString(),
        username: user.username,
      },
    };

    success = true;
    const token = jwt.sign(data, secret);
    res.status(200).json({ success, token });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message });
  }
});

// route 3: Get loggedin User Details using: GET "/getuser". Login required
router.get("/get-user", authenticate, async (req, res) => {
    try {
      const userId = req.user.id;
      const user = await User.findById(userId).select("-password");
      res.send(user);
    } catch (error) {
      res.status(500).send({ error: "Internal Server Error" });
    }
  });

module.exports = router;
