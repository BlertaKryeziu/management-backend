const mongoose = require("mongoose");

const orderLogSchema = new mongoose.Schema({
    orderId: Number,
    table_number: String,
    waiter: String,
    items: String,
    status: String,
    timestamp: {type: Date, default: Date.now}
});

module.exports = mongoose.model("OrderLog", orderLogSchema);