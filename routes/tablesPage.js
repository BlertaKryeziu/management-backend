const express = require("express");
const pool = require("../config/db");

const router = express.Router();

// Create table
router.post("/create", async (req, res) => {
    const {number, status, room } = req.body;


    try {
        const result = await pool.query(
            `INSERT INTO tablesPage (number, status, room)
            VALUES ($1, $2, $3) RETURNING *`,
            [number, status || "available", room || null]
        );
        res.status(201).json(result.rows[0]);
    } catch (error) {
        res.status(500).json({error: error.message});
    }
});


//Update
router.put("/update/:editTableId", async(req, res) =>{
    const { editTableId } = req.params;
    const {number, status, room} = req.body;

    try {
        const result = await pool.query(
            `UPDATE tablesPage SET number = $1, status = $2, room = $3 WHERE id = $4 RETURNING *`,
            [number, status, room, editTableId]
        );

        if(result.rowCount === 0){
            return res.status(404).json({message: "Table not found. "});
        }
        res.json(result.rows[0]);
    } catch (error) {
        res.status(500).json({ error: error.message});
    }
});

//Get
router.get("/", async(req, res) => {
    const result = await pool.query("SELECT * FROM tablesPage ORDER BY id");
    res.json(result.rows);
});


//Delete
router.delete("/delete/:id", async (req, res) => {
    const { id } = req.params;

    try {
        await pool.query("DELETE FROM tablesPage WHERE id = $1", [id]);
        res.json({message: "Table deleted successfully."});
    } catch (error) {
        res.status(500).json({error: error.message});
    }
});

module.exports = router;

