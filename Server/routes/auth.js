const express = require("express");
const router = express.Router();
const User = require("../models/AuthDetail");
const { body, validationResult } = require("express-validator");
const jwt = require("jsonwebtoken");
const fetchuser = require('../middleware/fetchauth');

require("dotenv").config();
const JWT_SECRET = process.env.JWT_SECRET;

// Route 1: Create a new user method: post "/api/auth/createuser"
router.post("/createuser", [body("email", "Invalid email").isEmail(), body("branch", "Invalid Branch name").isLength({ max: 3 })], async (req, res) => {
  // If there are errors , return bed 404 request.
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ success: false, error: errors.array() });
  }
  try {
    // Check whether the user with this email exists already
    let user = await User.findOne({ email: req.body.email });
    if (user) {
      return res.status(400).json({ success: false, error: "Sorry a user with this email already exists" });
    }
    // const {name,email,password,year,branch,roll} = req.body;
    // create a new collection in database
    user = await User.create(req.body);
    const data = {
      user: {
        id: user.id,
        role: user.role,
      },
    };
    const authtoken = jwt.sign(data, JWT_SECRET);
    res.json({ success: true, authtoken });
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Internal Server Error");
  }
});

// Route 2: Authenticate a User using : post"/api/auth/login".
router.post("/login", [body("email", "Invalid email").isEmail(), body("password", "Password cannot be blank").exists()], async (req, res) => {
  // If there are errors , return bed 404 request.
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ error: errors.array() });
  }
  const { email, password } = req.body;
  try {
    let user = await User.findOne({ email });
    // user email comparing
    if (!user) {
      return res.status(400).json({ success: false, error: "Please try to login with corrent credentials" });
    }
    // password checking and comparing with data
    if (password !== user.password) {
      return res.status(400).json({ success: false, error: "Please try to login with corrent credentials" });
    }
    // jwt tokent convert
    const data = {
      user: {
        id: user.id,
        role: user.role,
      },
    };
    // console.log(data);
    const authtoken = jwt.sign(data, JWT_SECRET);
    res.json({ success: true, authtoken });
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Internal Server Error");
  }
});

// Route 3: Get loggerin User Details using : post"/api/auth/getuser".
router.get("/getuserprofile", fetchuser ,async (req, res) => {
  try {
    userId = req.user.id;
    const user = await User.findById(userId).select(["-password","-date"]);
    res.send(user)
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Internal Server Error");
  }
}
);

router.get("/usersprofile", fetchuser,async(req,res)=>{
  try{
    userrole = req.user.role;
    if (userrole !== 'admin'){
      res.status(500).send("Your can't access this");
    }
    const users = await User.find({role:'user'});
    const admins = await User.find({role:'admin'});
    res.send({users:users,admins:admins})
    
  }catch(error){
    console.error(error.message);
    res.status(500).send("Internal Server Error");
  }
})

router.put("/usersprofile/update/:id",fetchuser,async(req,res)=>{
  const {name,email,year,branch,role} = req.body;
  try {
    userrole = req.user.role;
    if (userrole !== 'admin'){
      res.status(500).send("Your can't access this");
    }
    const newNote = {};
    if (name) {
      newNote.name = name;
    }
    if (email) {
      newNote.email = email;
    }
    if (year) {
      newNote.year = year;
    }
    if (branch) {
      newNote.branch = branch;
    }
    if (role) {
      newNote.role = role;
    }
    let userpro = await User.findById(req.params.id);
    if (!userpro) {
      return res.status(404).send("Not Found");
    }
    userpro = await User.findByIdAndUpdate(
      req.params.id,
      { $set: newNote },
      { new: true }
    );
    res.json({ userpro });
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Internal Server Error");
  }
})

router.delete('/usersprofile/delete/:id', fetchuser, async (req, res) => {
  try {
      // Find the note to be delete and delete it
      let user = await User.findById(req.params.id);
      if (!user) { return res.status(404).send("Not Found") }

      // Allow deletion only if user owns this Note
      userrole = req.user.role;
    if (userrole !== 'admin'){
      res.status(500).send("Your can't access this");
    }

      user = await User.findByIdAndDelete(req.params.id)
      res.json({ "Success": "User has been deleted", user: user });
  } catch (error) {
      console.error(error.message);
      res.status(500).send("Internal Server Error");
  }
});

module.exports = router;
