const router = require("express").Router();
const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// helper: get user from token
const getUserFromToken = (req) => {
  const auth = req.headers.authorization;
  if (!auth) throw new Error("No token");

  const token = auth.split(" ")[1];
  const decoded = jwt.verify(token, "secretkey");
  return decoded.id;
};

// ------------------- SIGNUP -------------------
router.post("/signup", async (req,res)=>{
  try{
    const {name,email,password} = req.body;

    // 🔥 basic validation
    if(!name || !email || !password){
      return res.status(400).json("All fields required");
    }

    if(password.length < 6){
      return res.status(400).json("Password must be 6+ chars");
    }

    // 🔥 check existing user
    const exists = await User.findOne({email});
    if(exists){
      return res.status(400).json("Email already exists");
    }

    const hashed = await bcrypt.hash(password,10);

    const user = await User.create({
      name,
      email,
      password: hashed
    });

    // ❌ password send mat karo
    res.json({
      _id: user._id,
      name: user.name,
      email: user.email
    });

  }catch(err){
    res.status(500).json("Signup failed");
  }
});

// ------------------- LOGIN -------------------
router.post("/login", async (req,res)=>{
  try{
    const {email,password} = req.body;

    const user = await User.findOne({email});
    if(!user) return res.status(400).json("User not found");

    const match = await bcrypt.compare(password,user.password);
    if(!match) return res.status(400).json("Wrong password");

    const token = jwt.sign(
      {id:user._id},
      "secretkey",
      {expiresIn:"1d"}
    );

    res.json({
      token,
      name: user.name   // 👈 frontend me use kar sakta hai
    });

  }catch{
    res.status(500).json("Login failed");
  }
});

// ------------------- GET PROFILE -------------------
router.get("/me", async (req,res)=>{
  try{
    const userId = getUserFromToken(req);

    const user = await User.findById(userId).select("-password");

    res.json(user);
  }catch{
    res.status(401).json("Unauthorized");
  }
});

// ------------------- UPDATE PROFILE -------------------
router.put("/update", async (req,res)=>{
  try{
    const userId = getUserFromToken(req);

    const {name,email} = req.body;

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      {name,email},
      {new:true}
    ).select("-password");

    res.json(updatedUser);
  }catch{
    res.status(400).json("Update failed");
  }
});

module.exports = router;