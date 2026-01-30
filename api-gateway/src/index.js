const express = require("express");
const axios = require("axios");
const jwt = require("jsonwebtoken");

const JWT_SECRET = process.env.JWT_SECRET || "your_jwt_secret_key"; // Use env var in production

const app = express();
app.use(express.json());

// Internal service URLs
const USER_SERVICE_URL = "http://user-service:8000";
const ORDER_SERVICE_URL = "http://order-service:3000";

// Middleware to authenticate JWT
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) return res.sendStatus(401);

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) return res.sendStatus(403);
    req.user = user;
    next();
  });
};

/**
 * AUTH ROUTES
 */
app.post("/auth/login", async (req, res) => {
  try {
    // 1. Validate credentials with User Service
    const response = await axios.post(
      `${USER_SERVICE_URL}/users/validate`,
      req.body
    );
    
    const user = response.data;

    // 2. Generate JWT
    const accessToken = jwt.sign(
      { userId: user.id, email: user.email },
      JWT_SECRET,
      { expiresIn: "1h" }
    );

    res.json({ token: accessToken });
  } catch (err) {
    if (err.response?.status === 401) {
      return res.status(401).json({ error: "Invalid credentials" });
    }
    res.status(500).json({ error: "Authentication failed" });
  }
});
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

app.get("/users/:id", authenticateToken, async (req, res) => {
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
app.post("/orders", authenticateToken, async (req, res) => {
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

