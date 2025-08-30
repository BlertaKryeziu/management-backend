const express = require("express");
const pool = require("../config/db");
const router = express.Router();

//GET all products
router.get("/", async (req, res) => {
    try {
        const result = await pool.query("SELECT * FROM products ORDER BY id");
        res.json(result.rows);
    } catch (error) {
        console.error("Gabim gjate marrjes se produketeve:", error);
        res.status(500).json({ error: "Gabim serveri gjate marrjes se produkteve. "});
    }
});

//CREATE 
router.post("/create", async (req, res) => {
    const { name, image, price } = req.body;

    if(!name || !image || !price) {
        return res.status(400).json({ error: "  Te gjitha fushat jane te detyrueshme."});
    }

    try {
        const result = await pool.query(
           " INSERT INTO products (name, image, price) VALUES ($1, $2, $3) RETURNING *",
           [name, image, price]
        );
        res.status(201).json(result.rows[0]);


    } catch (error) {
        console.error("Gabim gjate krijimit:", error);
        res.status(500).json({ error: "Gabim serveri gjate krijimit."});
    }
});

//UPDATE
router.put("/update/:id", async (req, res) => {
    const { id } = req.params;
    const { name, image, price} = req.body;

    if(!name || !image || price == 0){
        return res.status(400).json({error: "Te gjitha fushat jane te detyrueshme. "});
    }

    try {
        const result = await pool.query(
            "UPDATE products SET name = $1, image = $2, price = $3 WHERE id = $4 RETURNING *",
            [name, image, price, id]
        );

        if(result.rowCount === 0) {
            return res.status(404).json({message: "Produkti nuk u gjet. "});
        }

        res.json(result.rows[0]);
    } catch (error) {
        console.error("Gabim gjate perditesimit te produkteve:", error);
        res.status(500).json({ error: "Gabim serveri gjate perditesimit."});
    }
});

//DELETE
router.delete("/delete/:id", async(req, res) => {
    const { id } = req.params;

    try {
        const result = await pool.query("DELETE FROM products WHERE id = $1", [id]);

        if(result.rowCount === 0){
            return res.status(404).json({message: "Produkti nuk u gjet."});
        }

        res.json({ message: "Produkti u fshi me sukses."});
    } catch (error) {
        console.error("Gabim gjate fshirjes se produktiti:", error);
        res.status(500).json({ error: "Gabim serveri gjate fshirjes."});
    }
});

module.exports = router