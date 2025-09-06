const express = require("express");
const pool = require("../config/db");
const router = express.Router();

//Get orders
router.get("/", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM orders ORDER BY id DESC");
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ error: "Gabim gjate marrjes se porosive" });
  }
});

//POST
router.post("/", async (req, res) => {
  const { table_number, waiter, items, status } = req.body;

  try {
    //kontroll per waiter
    const waiterCheck = await pool.query("SELECT * FROM waiter WHERE name=$1", [waiter]);
    if (waiterCheck.rows.length === 0) return res.status(400).json({ error: "Ky waiter nuk ekziston" });

    //per items
    const itemList = items.split(",").map(i => i.trim());
    const productsCheck = await pool.query("SELECT name FROM products WHERE name = ANY($1)", [itemList]);
    if (productsCheck.rows.length !== itemList.length) return res.status(400).json({ error: "Nje ose me shume items nuk ekzistojne" });

    
    //Insert
    const result = await pool.query(
      "INSERT INTO orders (table_number, waiter, items, status) VALUES ($1,$2,$3,$4) RETURNING *",
      [table_number, waiter, items, status || "Pending"]
    );

    const newOrder = result.rows[0];

    //Log ne MongoDB
    const OrderLog = require("../models/OrderLog");
    await OrderLog.create({
      orderId: newOrder.id,
      table_number: newOrder.table_number,
      waiter: newOrder.waiter,
      items: newOrder.items,
      status: newOrder.status
    });

    //socket
    const io = req.app.get("io");
    if (io) io.emit("newOrder", newOrder);

    res.json(newOrder);

  } catch (error) {
    res.status(500).json({ error: "Gabim gjate krijimit te porosive "});
  }
});

//PUT- update
router.put("/:id", async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  try {
    const result = await pool.query("UPDATE orders SET status=$1 WHERE id=$2 RETURNING *", [status, id]);
    if (result.rows.length === 0) return res.status(404).json({error: "Porosia nuk ekziston "});

    const updatedOrder = result.rows[0];
    const io = req.app.get("io");
    if (io) io.emit("updateOrder", updatedOrder);

    res.json(updatedOrder);
  } catch (error) {
    res.status(500).json({error: "Gabim gjate ndryshimit te statusit. "});
  }
});

//DELETE
router.delete("/:id", async (req, res) => {
  const { id } = req.params;
  try {
    await pool.query("DELETE FROM orders WHERE id=$1", [id]);

    const io = req.app.get("io");
    if(io) io.emit("deleteOrder", { id });

    res.json({message: "Porosia u fshi "});
  } catch (error) {
    res.status(500).json({error: "Gabim gjate fshirjes se porosive" });
  } 
});

module.exports = router;