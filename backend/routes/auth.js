const router = require("express").Router();
const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");


const getUserFromToken = (req) => {
  const auth = req.headers.authorization;
  if (!auth) throw new Error("No token");

  const token = auth.split(" ")[1];
  const decoded = jwt.verify(token, process.env.JWT_SECRET);
  return decoded.id;
};


router.post("/signup", async (req, res) => {
  try {
    const { name, email, password } = req.body;

    
    if (!name || !email || !password) {
      return res.status(400).json({ message: "All fields required" });
    }

    if (password.length < 6) {
      return res.status(400).json({ message: "Password must be at least 6 characters" });
    }

    
    const exists = await User.findOne({ email });
    if (exists) {
      return res.status(400).json({ message: "Email already exists" });
    }

    const hashed = await bcrypt.hash(password, 10);

    const user = await User.create({
      name,
      email,
      password: hashed,
    });

    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
    });

  } catch (err) {
    res.status(500).json({ message: "Signup failed" });
  }
});


router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "User not found" });

    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(400).json({ message: "Wrong password" });

    const token = jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    res.json({
      token,
      name: user.name,
    });

  } catch (err) {
    res.status(500).json({ message: "Login failed" });
  }
});


router.get("/me", async (req, res) => {
  try {
    const userId = getUserFromToken(req);

    const user = await User.findById(userId).select("-password");

    res.json(user);
  } catch (err) {
    res.status(401).json({ message: "Unauthorized" });
  }
});


router.put("/update", async (req, res) => {
  try {
    const userId = getUserFromToken(req);

    const { name, email } = req.body;

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { name, email },
      { new: true }
    ).select("-password");

    res.json(updatedUser);
  } catch (err) {
    res.status(400).json({ message: "Update failed" });
  }
});

module.exports = router;