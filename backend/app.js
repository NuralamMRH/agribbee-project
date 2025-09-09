const express = require("express");
const app = express();
const cors = require("cors");

const cookieParser = require("cookie-parser");
const bodyParser = require("body-parser");
require("dotenv").config();
// const dotenv = require('dotenv');
const path = require("path");

const errorMiddleware = require("./middlewares/errors");

// Setting up config file
// if (process.env.NODE_ENV !== "PRODUCTION")
//   require("dotenv").config({ path: "backend/config/config.env" });

// console.log(process.env);
// dotenv.config({ path: 'backend/config/config.env' })
app.use(cors({ origin: "*" }));
app.use(
  "/public/uploads",
  express.static(path.join(__dirname, "public/uploads"))
);

app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());

// Import all routes
const configs = require("./routes/config");
app.use("/api/v1", configs);

const globalUploadDelete = require("./routes/globalUploadDelete");
app.use("/api/v1", globalUploadDelete);

const landingPage = require("./routes/landingPage");
app.use("/api/v1", landingPage);

const auction = require("./routes/auction");
app.use("/api/v1", auction);

const subscription = require("./routes/subscription");
app.use("/api/v1", subscription);

const vendor = require("./routes/vendor");
app.use("/api/v1", vendor);

const seller = require("./routes/seller");
app.use("/api/v1", seller);

const category = require("./routes/category");
app.use("/api/v1", category);

const location = require("./routes/location");
app.use("/api/v1", location);

const google = require("./routes/googlePlaceApi");
app.use("/api/v1", google);

const products = require("./routes/product");
app.use("/api/v1", products);

const cart = require("./routes/cart");
app.use("/api/v1", cart);

const auth = require("./routes/auth");
app.use("/api/v1", auth);

const payment = require("./routes/payment");
app.use("/api/v1", payment);

const warehouseTransferRoutes = require("./routes/WarehouseTransferRoutes");
app.use("/api/v1", warehouseTransferRoutes);

const inventory = require("./routes/inventory");
app.use("/api/v1", inventory);

const order = require("./routes/order");
app.use("/api/v1", order);

const log = require("./routes/log");
app.use("/api/v1", log);

// Import vessel setting routes
const vesselSettingRoutes = require("./routes/iTruckSeAiUU/vesselSettingRoutes");
// Mount routes
app.use("/api/v1", vesselSettingRoutes);

// Middleware to handle errors
app.use(errorMiddleware);

module.exports = app;
