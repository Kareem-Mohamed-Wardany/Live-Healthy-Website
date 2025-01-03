const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cors = require("cors");
const path = require("path");
const http = require("http");
const { Server } = require("socket.io");
require("dotenv").config();
require("express-async-errors");
const stripe = require("stripe")(process.env.STRIPE_KEY); // Use your actual Stripe secret key

// error handlers
const notFoundMiddleware = require("./middleware/not-found");
const errorHandlerMiddleware = require("./middleware/error-handler");

// Auth and Type Auth
const isAuth = require("./middleware/is-auth");
const TypeAuth = require("./middleware/type-auth");

// Define Routes
const authRoutes = require("./routes/auth");
const adminRoutes = require("./routes/admin");
const radioRoutes = require("./routes/radiocenter");
const userRoutes = require("./routes/user");
const appointmentRoutes = require("./routes/appointment");
const chatRoutes = require("./routes/chat")

// Initialize app and HTTP server
const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*", // Allow all origins; modify as needed
    methods: ["GET", "POST"],
  },
});


// Middleware
app.use(cors());
app.use(express.json());
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Methods",
    "OPTIONS, GET, POST, PUT, PATCH, DELETE"
  );
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
  next();
});

// Routes
app.use("/auth", authRoutes);
app.use("/admin", isAuth, TypeAuth("admin"), adminRoutes);
app.use("/radiology-center", radioRoutes);
app.use("/appointment", isAuth, appointmentRoutes);
app.use("/chat", isAuth, chatRoutes);
app.use("/user", userRoutes);
app.use("/user", userRoutes);

// Route to create a PaymentIntent
app.post("/purchase", async (req, res) => {
  const { amount } = req.body;

  try {
    const paymentIntent = await stripe.paymentIntents.create({
      amount,
      currency: "usd", // Adjust currency as needed
    });

    res.send({
      clientSecret: paymentIntent.client_secret, // Send the clientSecret to the frontend
    });
  } catch (error) {
    res.status(400).send({ error: error.message });
  }
});

// Error Handling Middleware
app.use(notFoundMiddleware);
app.use(errorHandlerMiddleware);




const Chat = require("./models/chat");

// Online Users Map
const onlineUsers = new Map();

// Real-time Chat with Socket.IO
io.on("connection", (socket) => {
  // User goes online
  socket.on("user-online", (userId) => {
    onlineUsers.set(userId, socket.id);
    console.log(`${userId} is online`);
  });

  // Fetch chat history
  socket.on("get-chat-history", async ({ cid }) => {
    const chat = await Chat.findById(cid);

    if (chat) {
      socket.emit("chat-history", chat);
    }
  });

  // Handle incoming messages
  socket.on("send-message", async ({ id, sender, receiver, message }) => {
    const timestamp = new Date();

    // Find or create chat
    const chat = await Chat.findByIdAndUpdate(
      id,
      { $push: { messages: { sender, message, timestamp } } },
      { new: true, upsert: true }
    );

    // Emit to the receiver if online
    if (onlineUsers.has(receiver)) {
      const receiverSocketId = onlineUsers.get(receiver);
      io.to(receiverSocketId).emit("receive-message", { sender, message, timestamp });
    }
  });

  // User disconnects
  socket.on("disconnect", () => {
    for (let [userId, socketId] of onlineUsers) {
      if (socketId === socket.id) {
        onlineUsers.delete(userId);
        console.log(`${userId} went offline`);
        break;
      }
    }
  });
});

// Start Server
mongoose
  .connect(process.env.DB_CONNECTION, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    server.listen(8080, () => {
      console.log("Server running on port 8080");
    });
  })
  .catch((err) => console.log(err));
