const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cors = require("cors");
const multer = require("multer");
const path = require("path");
require("dotenv").config();
const stripe = require('stripe')(process.env.STRIPE_KEY); // Use your actual Stripe secret key



// Define Routes
const authRoutes = require("./routes/auth");
const radioRoutes = require("./routes/radiocenter");
const userRoutes = require("./routes/user");

const app = express();

app.use(bodyParser.json({ limit: "10mb" })); // application/json
app.use(cors());
const fileStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "images");
  },
  filename: (req, file, cb) => {
    cb(null, new Date().toISOString() + "-" + file.originalname);
  },
});

const fileFilter = (req, file, cb) => {
  if (
    file.mimetype === "image/png" ||
    file.mimetype === "image/jpg" ||
    file.mimetype === "image/jpeg"
  ) {
    cb(null, true);
  } else {
    cb(null, false);
  }
};

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Methods",
    "OPTIONS, GET, POST, PUT, PATCH, DELETE"
  );
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
  next();
});
app.use(
  multer({ storage: fileStorage, fileFilter: fileFilter }).single("image")
);
app.use("/images", express.static(path.join(__dirname, "images")));

app.use("/auth", authRoutes);
app.use("/radiology-center", radioRoutes);
app.use("/user", userRoutes);

app.use((error, req, res, next) => {
  console.log(error);
  const status = error.statusCode || 500;
  const message = error.message;
  const data = error.data;
  res.status(status).json({ message: message, data: data });
});

// Route to create a PaymentIntent
app.post('/purchase', async (req, res) => {
  const { amount } = req.body; // Get the amount from the client-side request

  try {
    const paymentIntent = await stripe.paymentIntents.create({
      amount,
      currency: 'usd', // Adjust currency as needed
    });

    res.send({
      clientSecret: paymentIntent.client_secret, // Send the clientSecret to the frontend
    });
  } catch (error) {
    res.status(400).send({ error: error.message });
  }
});


mongoose
  .connect(process.env.DB_CONNECTION)
  .then((result) => {
    app.listen(8080);
    console.log("Server runing on 8080");
  })
  .catch((err) => console.log(err));
