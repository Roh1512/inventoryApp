const asyncHandler = require("express-async-handler");
const { body, validationResult } = require("express-validator");
const debug = require("debug")("brand"); //FOR LOGGING

const Brand = require("../models/brand");
const Item = require("../models/item");
const { ExpressValidator } = require("express-validator");
const password_to_match = require("../config/adminPassword");

exports.brand_list = asyncHandler(async (req, res, next) => {
  const all_brands = await Brand.find({}).sort({ name: 1 }).exec();
  debug("Brands fetched.");
  res.render("brands_list", {
    title: "All Brands",
    all_brands: all_brands,
  });
});
exports.brand_details = asyncHandler(async (req, res, next) => {
  const [brand, items_in_brand] = await Promise.all([
    Brand.findById(req.params.id).exec(),
    Item.find({ brand: req.params.id }).populate("category brand").exec(),
  ]);
  items_in_brand.forEach((item) => {
    const transformation = "w_300,h_300,c_auto,f_auto,q_auto"; // Example transformation
    item.image_url = item.image_url.replace(
      "/upload/",
      `/upload/${transformation}/`
    );
  });
  res.render("items_list", {
    title: `Items in Brand: ${brand.name}`,
    all_items: items_in_brand,
  });
});
exports.brand_create_get = asyncHandler(async (req, res, next) => {
  res.render("brand_form", { title: "Create Brand" });
});
exports.brand_create_post = [
  // Validate and sanitize the name field.
  body("name", "Brand name must not be empty")
    .trim()
    .isLength({ min: 1 })
    .escape(),
  body("adminpassword")
    .trim()
    .isLength({ min: 1 })
    .escape()
    .withMessage("Admin password must not be empty"),

  // Process request after validation and sanitization.
  asyncHandler(async (req, res, next) => {
    // Extract the validation errors from a request.
    const errors = validationResult(req);
    const entered_password = req.body.adminpassword;

    //Create a brand object with escaped and trimmed data.
    const brand = new Brand({ name: req.body.name });

    if (entered_password === password_to_match) {
      if (!errors.isEmpty()) {
        // There are errors. Render the form again with sanitized values/error messages.
        res.render("brand_form", {
          title: "Create brand",
          brand: brand,
          errors: errors.array(),
        });
        return;
      } else {
        // Data from form is valid.
        // Check if Brand with same name already exists.
        const brandExists = await Brand.findOne({
          name: req.body.name,
        })
          .collation({ locale: "en", strength: 2 })
          .exec();
        if (brandExists) {
          //Brand exists, redirect to its detail page.
          res.redirect(brandExists.url);
        } else {
          await brand.save();
          //new brand saved. Redirect to its page
          res.redirect(brand.url);
        }
      }
    } else {
      res.render("brand_form", {
        title: "Create brand",
        brand: brand,
        errors: [{ msg: "Password is not correct" }],
      });
    }
  }),
];
exports.brand_delete_get = asyncHandler(async (req, res, next) => {
  const [brand, items_in_brand] = await Promise.all([
    Brand.findById(req.params.id).exec(),
    Item.find({ brand: req.params.id }, "name description")
      .sort({ name: 1 })
      .exec(),
  ]);
  if (brand === null) {
    res.redirect("/catalog/brands");
  }
  res.render("brand_delete", {
    title: "Delete Brand",
    brand: brand,
    items_in_brand: items_in_brand,
  });
});
exports.brand_delete_post = [
  body("adminpassword", "Must not be empty")
    .trim()
    .isLength({ min: 1 })
    .escape(),
  asyncHandler(async (req, res, next) => {
    const entered_password = req.body.adminpassword;
    const [brand, items_in_brand] = await Promise.all([
      Brand.findById(req.params.id).exec(),
      Item.find({ brand: req.params.id }, "name description")
        .sort({ name: 1 })
        .exec(),
    ]);
    if (password_to_match === entered_password) {
      if (items_in_brand.length > 0) {
        //Brand has items. Render in same way as for GET route.
        res.render("brand_delete", {
          title: "Delete Brand",
          brand: brand,
          items_in_brand: items_in_brand,
        });
        return;
      } else {
        await Brand.findByIdAndDelete(req.body.brandid);
        res.redirect("/catalog/brands");
      }
    } else {
      const errors = ["Password does not match"];
      res.render("brand_delete", {
        title: "Delete Brand",
        brand: brand,
        items_in_brand: items_in_brand,
        errors: errors,
      });
    }
  }),
];
/*

*/
exports.brand_update_get = asyncHandler(async (req, res, next) => {
  const brand = await Brand.findById(req.params.id);
  if (brand === null) {
    //No brand found
    const err = new Error("Brand not found");
    err.status = 404;
    return next(err);
  }
  res.render("brand_form", {
    title: "Update brand",
    brand: brand,
  });
});
exports.brand_update_post = [
  body("name", "Brand name must not be empty")
    .trim()
    .isLength({ min: 1 })
    .escape(),
  body("adminpassword", "Admin password must not be empty")
    .trim()
    .isLength({ min: 1 })
    .escape(),
  asyncHandler(async (req, res, next) => {
    const entered_password = req.body.adminpassword;
    const brand = new Brand({
      name: req.body.name,
      _id: req.params
        .id /*// This is required, or a new ID will be assigned! */,
    });
    if (entered_password === password_to_match) {
      const errors = validationResult(req); // Extract the validation errors from a request.
      if (!errors.isEmpty()) {
        // There are errors. Render the form again with sanitized values/error messages.
        res.render("brand_form", {
          title: "Create brand",
          brand: brand,
          errors: errors.array(),
        });
        return;
      } else {
        // Data from form is valid.
        const updatedBrand = await Brand.findByIdAndUpdate(
          req.params.id,
          brand,
          {}
        );
        res.redirect(updatedBrand.url);
      }
    } else {
      res.render("brand_form", {
        title: "Create brand",
        brand: brand,
        errors: [{ msg: "Password is incorrect." }],
      });
    }
  }),
];
