const asyncHandler = require("express-async-handler");
const { body, validationResult } = require("express-validator");

const Category = require("../models/category");
const Item = require("../models/item");
const brand = require("../models/brand");
const category = require("../models/category");
const password_to_match = require("../config/adminPassword");

exports.category_list = asyncHandler(async (req, res, next) => {
  const all_categories = await Category.find({}).sort({ name: 1 }).exec();
  res.render("categories_list", {
    title: "All Categories",
    all_categories: all_categories,
  });
});
exports.category_details = asyncHandler(async (req, res, next) => {
  const category = await Category.findById(req.params.id).exec();
  const items_in_category = await Item.find({ category: req.params.id })
    .sort({ name: 1 })
    .populate("category brand")
    .exec();
  items_in_category.forEach((item) => {
    const transformation = "w_300,h_300,c_auto,f_auto,q_auto"; // Example transformation
    item.image_url = item.image_url.replace(
      "/upload/",
      `/upload/${transformation}/`
    );
  });
  res.render("items_list", {
    title: `Items in Category: ${category.name}`,
    all_items: items_in_category,
  });
});

exports.category_create_get = asyncHandler(async (req, res, next) => {
  res.render("category_form", { title: "Create Category" });
});
exports.category_create_post = [
  // Validate and sanitize the name field.
  body("name", "Category name must not be empty")
    .trim()
    .isLength({ min: 1 })
    .escape(),
  // Validate and sanitize the description field.
  body("description", "Description must be atleast 10 characters long")
    .trim()
    .isLength({ min: 10 })
    .escape(),
  body("adminpassword", "Admin password must not be empty")
    .trim()
    .isLength({ min: 1 })
    .escape(),
  // Process request after validation and sanitization.
  asyncHandler(async (req, res, next) => {
    const entered_password = req.body.adminpassword;

    //Create a new Category object with the sanitized name and description
    const category = new Category({
      name: req.body.name,
      description: req.body.description,
    });

    if (entered_password === password_to_match) {
      // Extract the validation errors from a request.
      const errors = validationResult(req);

      if (!errors.isEmpty()) {
        // There are errors. Render the form again with sanitized values/error messages.
        res.render("category_form", {
          title: "Create Category",
          category: category,
          errors: errors.array(),
        });
        return;
      } else {
        // Data from form is valid.
        // Check if Category with same name already exists.
        const categoryExists = await Category.findOne({ name: req.body.name })
          .collation({ locale: "en", strength: 2 })
          .exec();
        if (categoryExists) {
          //Category exists. Redirect to its details page
          res.redirect(categoryExists.url);
        } else {
          await category.save();
          res.redirect(category.url);
        }
      }
    } else {
      res.render("category_form", {
        title: "Create Category",
        category: category,
        errors: [{ msg: "Password is incorrect" }],
      });
    }
  }),
];

exports.category_delete_get = asyncHandler(async (req, res, next) => {
  const [category, items_in_category] = await Promise.all([
    Category.findById(req.params.id).exec(),
    Item.find({ category: req.params.id }, "name description")
      .sort({ name: 1 })
      .exec(),
  ]);
  if (category === null) {
    res.redirect("/catalog/categories");
  }
  res.render("category_delete", {
    title: "Delete Category",
    category: category,
    items_in_category: items_in_category,
  });
});
exports.category_delete_post = [
  body("adminpassword", "Admin password must not be empty.")
    .trim()
    .isLength({ min: 1 })
    .escape(),

  asyncHandler(async (req, res, next) => {
    const entered_password = req.body.adminpassword;
    const [category, items_in_category] = await Promise.all([
      Category.findById(req.params.id).exec(),
      Item.find({ category: req.params.id }, "name description")
        .sort({ name: 1 })
        .exec(),
    ]);
    if (entered_password === password_to_match) {
      if (items_in_category.length > 0) {
        //Category has items. Render in the same way as for GET
        res.render("category_delete", {
          title: "Delete Category",
          category: category,
          items_in_category: items_in_category,
        });
        return;
      } else {
        await Category.findByIdAndDelete(req.params.id);
        res.redirect("/catalog/categories");
      }
    } else {
      const errors = ["Password is incorrect"];
      res.render("category_delete", {
        title: "Delete Category",
        category: category,
        items_in_category: items_in_category,
        errors: errors,
      });
    }
  }),
];

exports.category_update_get = asyncHandler(async (req, res, next) => {
  const category = await Category.findById(req.params.id);
  if (category === null) {
    //No category found
    const err = new Error("Category not found");
    err.status = 404;
    return next(err);
  }
  res.render("category_form", {
    title: "Update Category",
    category: category,
  });
});
exports.category_update_post = [
  // Validate and sanitize the name field.
  body("name", "Category name must not be empty")
    .trim()
    .isLength({ min: 1 })
    .escape(),
  // Validate and sanitize the description field.
  body("description", "Description must be atleast 10 characters long")
    .trim()
    .isLength({ min: 10 })
    .escape(),
  body("adminpassword", "Admin password must not be empty")
    .trim()
    .isLength({ min: 1 })
    .escape(),

  // Process request after validation and sanitization.
  asyncHandler(async (req, res, next) => {
    const entered_password = req.body.adminpassword;
    const category = new Category({
      name: req.body.name,
      description: req.body.description,
      _id: req.params
        .id /*// This is required, or a new ID will be assigned! */,
    });

    if (entered_password === password_to_match) {
      // Extract the validation errors from a request.
      const errors = validationResult(req);

      if (!errors.isEmpty()) {
        // There are errors. Render the form again with sanitized values/error messages.
        res.render("category_form", {
          title: "Update Category",
          category: category,
          errors: errors.array(),
        });
        return;
      } else {
        // Data from form is valid.
        const updatedCategory = await Category.findByIdAndUpdate(
          req.params.id,
          category,
          {}
        );
        res.redirect(updatedCategory.url);
      }
    } else {
      //password incorrect
      res.render("category_form", {
        title: "Update Category",
        category: category,
        errors: [{ msg: "Password is incorrect" }],
      });
    }
  }),
];
