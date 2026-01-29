const express = require("express");
const axios = require("axios");

const app = express();
app.use(express.json());

// Internal service URLs
const USER_SERVICE_URL = "http://user-service:8000";
const ORDER_SERVICE_URL = "http://order-service:3000";

/**
 * USER ROUTES
 */
app.post("/users", async (req, res) => {
  try {
    console.log('here');
    const response = await axios.post(
      `${USER_SERVICE_URL}/users`,
      req.body
    );
    res.status(response.status).json(response.data);
  } catch (err) {
    res.status(err.response?.status || 500).json({
      error: err.response?.data || "User service error",
    });
  }
});

app.get("/users/:id", async (req, res) => {
  try {
    const response = await axios.get(
      `${USER_SERVICE_URL}/users/${req.params.id}`
    );
    res.status(response.status).json(response.data);
  } catch (err) {
    res.status(err.response?.status || 500).json({
      error: err.response?.data || "User service error",
    });
  }
});

/**
 * ORDER ROUTES
 */
app.post("/orders", async (req, res) => {
  try {
    const response = await axios.post(
      `${ORDER_SERVICE_URL}/orders`,
      req.body
    );
    res.status(response.status).json(response.data);
  } catch (err) {
    res.status(err.response?.status || 500).json({
      error: err.response?.data || "Order service error",
    });
  }
});

app.get("/health", (req, res) => {
  res.json({ status: "API Gateway UP" });
});

const PORT = process.env.PORT || 8081;

app.listen(PORT, () => {
  console.log(`API Gateway running on port ${PORT}`);
});

