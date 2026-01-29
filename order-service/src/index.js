const express = require("express");
const createOrdersTable = require("./models/order");

const ordersRouter = require("./routes/orders");

const app = express();
app.use(express.json());

// Init DB
createOrdersTable();

app.use(ordersRouter);

app.get("/health", (req, res) => {
  res.json({ status: "UP" });
});

app.listen(3000, () => {
  console.log("Order Service running on port 3000");
});
