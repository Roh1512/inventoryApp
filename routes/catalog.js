const express = require("express");
const router = express.Router();
const passport = require("passport");

const item_Controller = require("../controllers/itemController");
const category_Controller = require("../controllers/categoryController");
const brand_Controller = require("../controllers/brandController");
const user_Controller = require("../controllers/userController");

router.get("/", item_Controller.index);

// Items routes
router.get("/items/create", item_Controller.item_create_get);
router.post("/items/create", item_Controller.item_create_post);
router.get("/items/:id/delete", item_Controller.item_delete_get);
router.post("/items/:id/delete", item_Controller.item_delete_post);
router.get("/items/:id/update", item_Controller.item_update_get);
router.post("/items/:id/update", item_Controller.item_update_post);
router.get("/items/:id", item_Controller.item_details);
router.get("/items", item_Controller.items_list);

// Category routes
router.get("/categories/create", category_Controller.category_create_get);
router.post("/categories/create", category_Controller.category_create_post);
router.get("/categories/:id/delete", category_Controller.category_delete_get);
router.post("/categories/:id/delete", category_Controller.category_delete_post);
router.get("/categories/:id/update", category_Controller.category_update_get);
router.post("/categories/:id/update", category_Controller.category_update_post);
router.get("/categories", category_Controller.category_list);
router.get("/categories/:id", category_Controller.category_details);

// Brand routes
router.get("/brands/create", brand_Controller.brand_create_get);
router.post("/brands/create", brand_Controller.brand_create_post);
router.get("/brands/:id/delete", brand_Controller.brand_delete_get);
router.post("/brands/:id/delete", brand_Controller.brand_delete_post);
router.get("/brands/:id/update", brand_Controller.brand_update_get);
router.post("/brands/:id/update", brand_Controller.brand_update_post);
router.get("/brands", brand_Controller.brand_list);
router.get("/brands/:id", brand_Controller.brand_details);

// Login routes
router.get("/login", user_Controller.login_get);
router.post(
  "/login",
  passport.authenticate("local", {
    successRedirect: "/catalog/user",
    failureRedirect: "/catalog/signup",
  })
);

//logout routes
router.get("/logout", user_Controller.logout_get);

// User routes
router.get("/user", user_Controller.user_get);

// Signup routes
router.get("/signup", user_Controller.signup_get);
router.post("/signup", user_Controller.signup_post);

//login warning
router.get("/loginwarning", user_Controller.login_warning);

module.exports = router;
