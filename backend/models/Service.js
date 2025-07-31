const mongoose = require('mongoose');

const serviceSchema = new mongoose.Schema({
  name: { type: String, required: true },
  category: String,
  description: String,
  contact: String,
  location: String,
});

module.exports = mongoose.model('Service', serviceSchema);
