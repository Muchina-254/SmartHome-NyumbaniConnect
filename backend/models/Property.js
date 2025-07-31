const mongoose = require("mongoose");

const propertySchema = new mongoose.Schema({
  title: String,
  image: String,
  price: String,
  location: String,
  rating: Number
});

module.exports = mongoose.model("Property", propertySchema);
