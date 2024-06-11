const asyncHandler = require("express-async-handler");
const { body, validationResult } = require("express-validator");

const multer = require("multer");
const cloudinary = require("../config/cloudinaryConfig");
const upload = require("../config/multerConfig");

const Item = require("../models/item");
const Category = require("../models/category");
const Brand = require("../models/brand");

exports.index = asyncHandler(async (req, res, next) => {
  const [number_of_items, number_of_categories, number_of_brands] =
    await Promise.all([
      Item.countDocuments({}).exec(),
      Category.countDocuments({}).exec(),
      Brand.countDocuments({}).exec(),
    ]);
  res.render("index", {
    title: "Fake Store Home",
    number_of_items: number_of_items,
    number_of_categories: number_of_categories,
    number_of_brands: number_of_brands,
  });
});
exports.items_list = asyncHandler(async (req, res, next) => {
  const all_items = await Item.find({}, "name price image_url url")
    .sort({
      name: 1,
    })
    .populate("brand category")
    .exec();
  all_items.forEach((item) => {
    const transformation = "w_300,h_300,c_auto,f_auto,q_auto"; // Example transformation
    item.image_url = item.image_url.replace(
      "/upload/",
      `/upload/${transformation}/`
    );
  });
  res.render("items_list", {
    title: "All Items",
    all_items: all_items,
  });
});
exports.item_details = asyncHandler(async (req, res, next) => {
  const item = await Item.findById(req.params.id)
    .populate("category brand")
    .exec();

  const transformation = "w_900,h_600,c_fit,f_auto,q_auto";
  item.image_url = item.image_url.replace(
    "/upload/",
    `/upload/${transformation}/`
  );
  res.render("item_details", {
    title: item.name,
    item: item,
  });
});
exports.item_create_get = asyncHandler(async (req, res, next) => {
  const [all_categories, all_brands] = await Promise.all([
    Category.find().sort({ name: 1 }).exec(),
    Brand.find().sort({ name: 1 }).exec(),
  ]);
  res.render("item_form", {
    title: "Create New Item",
    categories: all_categories,
    brands: all_brands,
  });
});
exports.item_create_post = [
  // Middleware to handle file upload
  upload.single("image"),

  body("name", "Item name must not be empty.")
    .trim()
    .isLength({ min: 1 })
    .escape(),
  body("price")
    .trim()
    .isLength({ min: 1 })
    .escape()
    .withMessage("price must be specified.")
    .isNumeric()
    .withMessage("Price must contain only numbers."),
  body("description")
    .trim()
    .isLength({ min: 10 })
    .escape()
    .withMessage("Description must be at least 10 characters long"),
  body("category", "Category must not be empty")
    .trim()
    .isLength({ min: 1 })
    .escape(),
  body("brand", "Brand name must not be empty")
    .trim()
    .isLength({ min: 1 })
    .escape(),
  body("number_in_stock")
    .trim()
    .isLength({ min: 1 })
    .escape()
    .withMessage("Number of items in stock must not be empty.")
    .isInt()
    .withMessage("Number of items in stock must be an integer"),

  // Process request after validation and sanitization
  asyncHandler(async (req, res, next) => {
    // Extract validation errors from the request
    const errors = validationResult(req);

    const item = new Item({
      name: req.body.name,
      price: req.body.price,
      description: req.body.description,
      category: req.body.category,
      brand: req.body.brand,
      number_in_stock: req.body.number_in_stock,
    });

    // If there are validation errors, re-render the form with error messages
    if (!errors.isEmpty()) {
      const [categories, brands] = await Promise.all([
        Category.find().sort({ name: 1 }).exec(),
        Brand.find().sort({ name: 1 }).exec(),
      ]);
      res.render("item_form", {
        title: "Create New Item",
        item: item,
        categories: categories,
        brands: brands,
        errors: errors.array(),
      });
      return;
    }

    // If no validation errors, proceed to upload the image
    try {
      const uploadStream = await cloudinary.uploader.upload_stream(
        {
          folder: "shoppingInventory",
        },
        async (error, result) => {
          if (error) {
            return next(error);
          }
          // Create a new Item object with the Cloudinary URL and other form data
          const item = new Item({
            name: req.body.name,
            price: req.body.price,
            description: req.body.description,
            category: req.body.category,
            brand: req.body.brand,
            number_in_stock: req.body.number_in_stock,
            image_url: result.secure_url.toString(),
            image_public_id: result.public_id.toString(),
          });
          // Save the item to the database
          await item.save();
          res.redirect(item.url);
        }
      );
      if (req.file && req.file.buffer) {
        uploadStream.end(req.file.buffer);
      } else {
        throw new Error("File not provided");
      }
    } catch (error) {
      return next(error);
    }
  }),
];
exports.item_delete_get = asyncHandler(async (req, res, next) => {
  const item = await Item.findById(req.params.id, "name description");
  if (item === null) {
    res.redirect("/catalog/items");
  }
  res.render("delete_item", {
    title: `Delete Item`,
    item: item,
  });
});
exports.item_delete_post = asyncHandler(async (req, res, next) => {
  const itemId = req.params.id;
  try {
    // Find the item by ID
    const item = await Item.findById(itemId);

    // If the item doesn't exist, redirect to the item list page
    if (!item) {
      res.redirect("/catalog/items");
      return;
    }
    const image_public_id = item.image_public_id;
    // Delete the image from Cloudinary
    await cloudinary.uploader.destroy(image_public_id);
    // Delete the item from the database
    await Item.findByIdAndDelete(itemId);

    // Redirect to the item list page
    res.redirect("/catalog/items");
  } catch (error) {
    next(error);
  }
});
exports.item_update_get = asyncHandler(async (req, res, next) => {
  const [item, categories, brands] = await Promise.all([
    Item.findById(req.params.id).populate("category brand").exec(),
    Category.find().sort({ name: 1 }).exec(),
    Brand.find().sort({ name: 1 }).exec(),
  ]);

  if (item === null) {
    //No results
    const err = new Error("No item found");
    err.status = 404;
    return next(err);
  }
  res.render("item_form", {
    title: "Update Item",
    item: item,
    categories: categories,
    brands: brands,
  });
});
exports.item_update_post = [
  // Middleware to handle file upload
  upload.single("image"),

  body("name", "Item name must not be empty.")
    .trim()
    .isLength({ min: 1 })
    .escape(),
  body("price")
    .trim()
    .isLength({ min: 1 })
    .escape()
    .withMessage("price must be specified.")
    .isNumeric()
    .withMessage("Price must contain only numbers."),
  body("description")
    .trim()
    .isLength({ min: 10 })
    .escape()
    .withMessage("Description must be at least 10 characters long"),
  body("category", "Category must not be empty")
    .trim()
    .isLength({ min: 1 })
    .escape(),
  body("brand", "Brand name must not be empty")
    .trim()
    .isLength({ min: 1 })
    .escape(),
  body("number_in_stock")
    .trim()
    .isLength({ min: 1 })
    .escape()
    .withMessage("Number of items in stock must not be empty.")
    .isInt()
    .withMessage("Number of items in stock must be an integer"),

  // Process request after validation and sanitization
  asyncHandler(async (req, res, next) => {
    // Extract validation errors from the request
    const errors = validationResult(req);

    const item = new Item({
      _id: req.params.id,
      name: req.body.name,
      price: req.body.price,
      description: req.body.description,
      category: req.body.category,
      brand: req.body.brand,
      number_in_stock: req.body.number_in_stock,
    });

    if (!errors.isEmpty()) {
      const [categories, brands] = await Promise.all([
        Category.find().sort({ name: 1 }).exec(),
        Brand.find().sort({ name: 1 }).exec(),
      ]);
      res.render("item_form", {
        title: "Create New Item",
        item: item,
        categories: categories,
        brands: brands,
        errors: errors.array(),
      });
      return;
    }
    const itemId = req.params.id;
    try {
      const item_fetched = await Item.findById(itemId).exec();
      if (!item_fetched) {
        res.redirect("/catalog/items");
        return;
      }
      const image_public_id = item_fetched.image_public_id;
      // Delete the image from Cloudinary
      await cloudinary.uploader.destroy(image_public_id);

      //Add new image
      // Upload the new image to Cloudinary
      const uploadStream = await cloudinary.uploader.upload_stream(
        {
          folder: "shoppingInventory",
        },
        async (error, result) => {
          if (error) {
            return next(error);
          }
          // Create a new Item object with the Cloudinary URL and other form data
          const item = new Item({
            _id: req.params.id,
            name: req.body.name,
            price: req.body.price,
            description: req.body.description,
            category: req.body.category,
            brand: req.body.brand,
            number_in_stock: req.body.number_in_stock,
            image_url: result.secure_url.toString(),
            image_public_id: result.public_id.toString(),
          });
          // Save the item to the database
          const updatedItem = await Item.findByIdAndUpdate(
            req.params.id,
            item,
            {}
          );
          res.redirect(updatedItem.url);
        }
      );
      if (req.file && req.file.buffer) {
        uploadStream.end(req.file.buffer);
      } else {
        throw new Error("File not provided");
      }
    } catch (error) {
      return next(error);
    }
  }),
];
