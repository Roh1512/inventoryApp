const asyncHandler = require("express-async-handler");
const { body, validationResult } = require("express-validator");
const bcrypt = require("bcryptjs");
const passport = require("passport");

const password_to_match = require("../config/adminPassword");
const User = require("../models/user");

//Login routes
exports.login_get = asyncHandler(async (req, res, next) => {
  if (req.user) {
    res.redirect("/catalog/user");
  } else {
    res.render("login_form", {
      title: "Log-in User",
      errors: [],
    });
  }
});

exports.login_post = [
  body("username")
    .trim()
    .isLength({ min: 1 })
    .withMessage("Username must not be empty")
    .escape(),
  body("password")
    .trim()
    .isLength({ min: 1 })
    .withMessage("Password must not be empty.")
    .escape(),
  asyncHandler(async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      //There are errors
      return res.render("login_form", {
        title: "Login",
        errors: errors.array(),
      });
      return;
    }
    passport.authenticate("local", (err, user, info) => {
      if (err) {
        next(err);
      }
      if (!user) {
        return res.render("login_form", {
          title: "Login",
          errors: [{ msg: info.message }],
        });
      }
      req.logIn(user, (err) => {
        if (err) {
          return next(err);
        }
        return res.redirect("/catalog/user");
      });
    })(req, res, next);
  }),
];

//Logout
exports.logout_get = asyncHandler(async (req, res, next) => {
  req.logout((err) => {
    if (err) {
      return next(err);
    }
    res.redirect("/");
  });
});

//user
exports.user_get = asyncHandler(async (req, res, next) => {
  res.render("user_page", {
    title: "User Details",
    user: req.user,
  });
});

//Login warning
exports.login_warning = asyncHandler(async (req, res, next) => {
  res.render("login_warning", { title: "You must login first." });
});

//Signup routes
exports.signup_get = asyncHandler(async (req, res, next) => {
  res.render("signup_form", {
    title: "Sign Up",
    errors: [],
  });
});
exports.signup_post = [
  //Validate and sanitize data
  body("username")
    .trim()
    .isLength({ min: 4 })
    .withMessage("Username should be at least 4 characters long.")
    .escape(),
  body("password")
    .trim()
    .isLength({ min: 5 })
    .withMessage("Password must be at least 5 characters long.")
    .escape(),
  body("adminpassword", "Admin password must not be empty")
    .trim()
    .isLength({ min: 1 })
    .escape(),
  // Process request after validation and sanitization
  asyncHandler(async (req, res, next) => {
    const entered_admin_password = req.body.adminpassword;

    if (entered_admin_password === password_to_match) {
      const errors = validationResult(req);
      // If there are validation errors, re-render the form with error messages
      if (!errors.isEmpty()) {
        res.render("signup_form", {
          title: "Sign Up",
          errors: errors.array(),
        });
        return;
      }
      const user = await User.findOne({ username: req.body.username });
      console.log(user);
      if (user) {
        res.render("signup_form", {
          title: "Sign Up",
          errors: [{ msg: "Username already exists" }],
        });
        return;
      }
      bcrypt.hash(req.body.password, 10, async (err, hashedPassword) => {
        // if err, do something
        if (err) {
          return next(err);
        }
        // otherwise, store hashedPassword in DB
        const user = new User({
          username: req.body.username,
          password: hashedPassword,
          admin: true,
        });
        const result = await user.save();
        console.log(`User Registered.\n${result}`);
        res.redirect("/catalog/login");
      });
    } else {
      console.log("Admin password incorrect");
      res.render("signup_form", {
        title: "Sign Up",
        errors: [{ msg: "You need admin password to sign up." }],
      });
      return;
    }
  }),
];
