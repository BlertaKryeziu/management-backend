const express = require('express');
const OrderLog = require('../models/OrderLog');
const router = express.Router();

router.get("/", async (req, res) => {
    try {
        const logs = await OrderLog.find().sort({timestamp: -1});
        res.json(logs);

    } catch (error) {
        console.error(error);
        res.status(500).json({error: "Gabim gjate marrjes se log"});
    }
});

module.exports = router;