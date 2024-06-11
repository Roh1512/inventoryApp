const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const ItemSchema = new Schema({
  name: { type: String, required: true },
  price: { type: Number, required: true },
  description: { type: String, required: true, minLength: 10 },
  category: { type: Schema.Types.ObjectId, ref: "Category", required: true },
  brand: { type: Schema.Types.ObjectId, ref: "Brand", required: true },
  number_in_stock: { type: Number, required: true },
  image_url: { type: String },
  image_public_id: { type: String },
});

ItemSchema.virtual("url").get(function () {
  return `/catalog/items/${this._id}`;
});

module.exports = mongoose.model("Items", ItemSchema);
