const mongoose = require('mongoose');

const CarteLilleSchema = new mongoose.Schema({
    code: { type: String, required: true },
    lieu: { type: String, required: true },
    description: { type: String, required: true },
    bonus: { type: String, required: false }
}) 

module.exports = mongoose.model("CarteLille", CarteLilleSchema, "lille");