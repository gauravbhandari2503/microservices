const express = require("express");
const pool = require("../db");
const { getUserById } = require("../services/userClient");

const router = express.Router();

router.post("/orders", async (req, res) => {
  const { user_id, product_name } = req.body;

  // 1. Validate user
  const user = await getUserById(user_id);
  if (!user) {
    return res.status(404).json({ error: "User not found" });
  }

  // 2. Create order
  const result = await pool.query(
    "INSERT INTO orders (user_id, product_name) VALUES ($1, $2) RETURNING *",
    [user_id, product_name]
  );

  res.status(201).json(result.rows[0]);
});

module.exports = router;
