// import module
const express = require("express");
const logger = require("morgan");
const cors = require("cors");
const path = require("path");

const app = express();
// connection to MongoDB
const connectDB = require("./database/db");
connectDB();

// import router
const categoryRouter = require("./router/categoryRouter");
const bankRouter = require("./router/bankRouter");
const itemRouter = require("./router/itemRouter");
const featureRouter = require("./router/featureRouter");
const infoRouter = require("./router/infoRouter");
const customerRouter = require("./router/customerRouter");
const bookingRouter = require("./router/bookingRouter");
const userRouter = require("./router/userRouter");

// setting cors & morgan
app.use(cors());
app.use(logger("dev"));

// post json & url-encoded
app.use(express.json()); //menerima data json
app.use(express.urlencoded({ extended: false })); // menerima input form url-encoded

// Cors
app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, Authorization, authorization, X-Requested-With, Content-Type, Accept"
  );
  res.header(
    "Cache-Control",
    "no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0"
  );
  next();
});

// public file
app.use(express.static(path.join(__dirname, "public")));

const port = 3000;

app.get("/", (req, res) => {
  res.send("Hello World!");
});

// url
app.use("/api/v1/category", categoryRouter);
app.use("/api/v1/bank", bankRouter);
app.use("/api/v1/item", itemRouter);
app.use("/api/v1/item/feature", featureRouter);
app.use("/api/v1/item/info", infoRouter);
app.use("/api/v1/customer", customerRouter);
app.use("/api/v1/booking", bookingRouter);
app.use("/api/v1/user", userRouter);

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
