const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/user");

const router = express.Router();

//Create - User
router.post("/register", async (req, res) => {
    const {username, email, password, status} = req.body;

    try {
        const existingUser = await User.findByEmail(email);
        if(existingUser) {
            return res.status(400).json({message: "User already exist"});
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = await User.create({
            username, email, password: hashedPassword, status
        })

        res.status(201).json(newUser);
    } catch (error) {
        res.status(500).json({error: error.message});
    }
});

module.exports = router;