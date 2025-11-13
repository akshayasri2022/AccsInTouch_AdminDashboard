const express = require("express");
const crypto = require("crypto");
const bodyParser = require("body-parser");
const sequelize = require("./config/database");
const defineAssociations = require("./api/associations");
const cors = require("cors");
const http = require("http");
const path = require("path");
const app = express();
const PORT = process.env.DB_PORT;

const userRouter = require("./api/routers/userRouter");
const authRouter = require("./api/routers/authRouter");
const customerRouter= require("./api/routers/customerRouter");
const orderRouter=require("./api/routers/orderRouter");
const productRouter=require("./api/routers/productRouter")

const corsOpts = {
  origin: (origin, callback) => {
    callback(null, origin || '*'); // reflect the origin dynamically
  },
  credentials: true,
  // ⭐ FIX: Added "PATCH" to the allowed methods array
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"], 
  allowedHeaders: ["Content-Type", "Authorization"],
};
app.use(cors(corsOpts));

// ... (rest of your application)

app.use(bodyParser.json({ limit: '200mb' })); // Increase JSON body limit
app.use(bodyParser.urlencoded({ limit: '200mb', extended: true })); // Increase URL-encoded body limit

defineAssociations();
app.use("/api", userRouter);
app.use("/api", authRouter);
app.use("/api", customerRouter);
app.use("/api", orderRouter);
app.use("/api",productRouter);
app.get("/", (req, res) => {
  res.send("Welcome to the user API");
});

const server = http.createServer(app);
(async () => {
  try {
    await sequelize.authenticate();
    console.log("✅ Database connected successfully");

    await sequelize.sync();
    console.log("✅ Database synchronized");

    server.listen(PORT, () => {
      console.log(`🚀 Server running at https://acc-in-touch-1.onrender.com/api:${PORT}`);
    });

  } catch (err) {
    console.error("❌ DB connection failed:", err);
  }
})();


