// const express = require("express");
// const path = require("path");
// const mongoose = require("mongoose");
// const cookieParser = require("cookie-parser");
// const jwt = require("jsonwebtoken");
// const bcrypt = require("bcrypt");
// const http = require('http');
// const url = require('url');
// const fs = require('fs');

// mongoose
//   .connect("mongodb://127.0.0.1:27017", {
//     dbName: "backend1",
//   })
//   .then(() => console.log("Database Connected"))
//   .catch((e) => console.log(e));

// const userSchema = new mongoose.Schema({
//   name: String,
//   email: String,
//   password: String,
// });

// const User = mongoose.model("User", userSchema);

// const app = express();

// // Using Middlewares
// app.use(express.urlencoded({ extended: true }));
// app.use(cookieParser());

// // Setting up View Engine
// app.set("views", path.join(__dirname, "views"));
// app.set("view engine", "ejs");

// // Root URL - Redirect to login page
// app.get("/", (req, res) => {
//   res.redirect("/login");
// });

// // Login page
// app.get("/login", (req, res) => {
//   res.render("login");
// });

// // Signup page
// app.get("/register", (req, res) => {
//   res.render("register");  
// });

// // Login endpoint
// app.post("/login", async (req, res) => {
//   const { email, password } = req.body;

//   let user = await User.findOne({ email });

//   if (!user) return res.redirect("/register");

//   const isMatch = await bcrypt.compare(password, user.password);

//   if (!isMatch)
//     return res.render("login", { email, message: "Incorrect Password" });

//   const token = jwt.sign({ _id: user._id }, "sdjasdbajsdbjasd");

//   res.cookie("token", token, {
//     httpOnly: true,
//     expires: new Date(Date.now() + 60 * 1000),
//   });
//   res.redirect("/script.js"); // Redirect to the script.js page
// });

// // Signup endpoint
// app.post("/register", async (req, res) => {
//   const { name, email, password } = req.body;

//   let user = await User.findOne({ email });
//   if (user) {
//     return res.redirect("/login");
//   }
//   const hashedPassword = await bcrypt.hash(password, 10);

//   user = await User.create({
//     name,
//     email,
//     password: hashedPassword,
//   });

//   const token = jwt.sign({ _id: user._id }, "sdjasdbajsdbjasd");

//   res.cookie("token", token, {
//     httpOnly: true,
//     expires: new Date(Date.now() + 60 * 1000),
//   });
//   res.redirect("/script.js"); // Redirect to the script.js page
// });

// // Serve static files from the same directory
// app.use(express.static(__dirname));

// // Logout endpoint
// app.get("/logout", (req, res) => {
//   res.cookie("token", null, {
//     httpOnly: true,
//     expires: new Date(Date.now()),
//   });
//   res.redirect("/login");
// });

// const port = 5000; // or any other port you prefer
// app.listen(port, () => {
//   console.log(`Server is listening on port ${port}`);
// });



const express = require("express");
const path = require("path");
const mongoose = require("mongoose");
const cookieParser = require("cookie-parser");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

mongoose
  .connect("mongodb://127.0.0.1:27017", {
    dbName: "backend1",
  })
  .then(() => console.log("Database Connected"))
  .catch((e) => console.log(e));

const userSchema = new mongoose.Schema({
  name: String,
  email: String,
  password: String,
});

const User = mongoose.model("User", userSchema);

const app = express();

// Using Middlewares
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Setting up View Engine
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

// Root URL - Redirect to login page
app.get("/", (req, res) => {
  res.redirect("/login");
});

// Login page
app.get("/login", (req, res) => {
  res.render("login");
});

// Signup page
app.get("/register", (req, res) => {
  res.render("register");
});

// Login endpoint
app.post("/login", async (req, res) => {
  const { email, password } = req.body;

  let user = await User.findOne({ email });

  if (!user) return res.redirect("/login"); // Redirect back to login if user not found

  const isMatch = await bcrypt.compare(password, user.password);

  if (!isMatch)
    return res.render("login", { email, message: "Incorrect Password" });

  const token = jwt.sign({ _id: user._id }, "sdjasdbajsdbjasd");

  res.cookie("token", token, {
    httpOnly: true,
    expires: new Date(Date.now() + 60 * 1000),
  });
  res.redirect("/main"); // Redirect to main functionality
});

// Signup endpoint
app.post("/register", async (req, res) => {
  const { name, email, password } = req.body;

  let user = await User.findOne({ email });
  if (user) {
    return res.redirect("/login"); // Redirect back to login if user already exists
  }
  const hashedPassword = await bcrypt.hash(password, 10);

  user = await User.create({
    name,
    email,
    password: hashedPassword,
  });

  const token = jwt.sign({ _id: user._id }, "sdjasdbajsdbjasd");

  res.cookie("token", token, {
    httpOnly: true,
    expires: new Date(Date.now() + 60 * 1000),
  });
  res.redirect("/main"); // Redirect to main functionality
});

// Main functionality page
app.get("/main", (req, res) => {
  // Check if user is authenticated
  const token = req.cookies.token;
  if (!token) {
    // Redirect to login if token is not present
    return res.redirect("/login");
  }

  // If token is present, decode and verify it
  jwt.verify(token, "sdjasdbajsdbjasd", async (err, decoded) => {
    if (err) {
      // If token is invalid, redirect to login
      return res.redirect("/login");
    }

    // If token is valid, find user and render main functionality page
    const user = await User.findById(decoded._id);
    if (!user) {
      // If user not found, redirect to login
      return res.redirect("/login");
    }

    // Render main functionality page with user data
    res.render("main", { user });
  });
});

// Serve static files from the same directory
app.use(express.static(__dirname));

// Logout endpoint
app.get("/logout", (req, res) => {
  res.cookie("token", null, {
    httpOnly: true,
    expires: new Date(Date.now()),
  });
  res.redirect("/login");
});

const port = 5000; // or any other port you prefer
app.listen(port, () => {
  console.log(`Server is listening on port ${port}`);
});
