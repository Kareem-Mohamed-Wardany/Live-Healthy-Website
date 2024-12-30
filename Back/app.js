const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cors = require("cors");
const path = require("path");
require("dotenv").config();
require('express-async-errors');
const stripe = require('stripe')(process.env.STRIPE_KEY); // Use your actual Stripe secret key

// error handlers
const notFoundMiddleware = require('./middleware/not-found');
const errorHandlerMiddleware = require('./middleware/error-handler');

// Define Routes
const authRoutes = require("./routes/auth");
const radioRoutes = require("./routes/radiocenter");
const userRoutes = require("./routes/user");

const app = express();

app.use(cors());


app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Methods",
    "OPTIONS, GET, POST, PUT, PATCH, DELETE"
  );
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
  next();
});
app.use("/auth", authRoutes);
app.use("/radiology-center", radioRoutes);
app.use("/user", userRoutes);

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


app.use(notFoundMiddleware);
app.use(errorHandlerMiddleware);

mongoose
  .connect(process.env.DB_CONNECTION)
  .then((result) => {
    app.listen(8080);
    console.log("Server runing on 8080");
  })
  .catch((err) => console.log(err));
