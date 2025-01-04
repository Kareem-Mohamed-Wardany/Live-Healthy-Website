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
const sendEmail = require('./util/mailer')
const User = require("./models/user");

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
  socket.on("endChatRequest", async ({ chatId, userId }) => {
    const chat = await Chat.findById(chatId)

    // Assign user agreement
    if (userId.toString() === chat.patientId.toString()) {
      chat.endChat.patient = true;
      await chat.save()
    } else if (userId.toString() === chat.doctorId.toString()) {
      chat.endChat.doctor = true;
      await chat.save()
    }
    if (chat.endChat.patient && chat.endChat.doctor) {
      chat.status = "finished";
      await chat.save()
      const doc = await User.findById(chat.doctorId)
      doc.balance = doc.balance + 100
      await doc.save()
      const patient = await User.findById(chat.patientId)
      const patientHTML = `
          <!DOCTYPE html>
    <html>
    <head>
      <style>
        body {
          font-family: Arial, sans-serif;
          line-height: 1.6;
          color: #333333;
        }
        .container {
          width: 100%;
          max-width: 600px;
          margin: 0 auto;
          padding: 20px;
          border: 1px solid #eeeeee;
          border-radius: 8px;
          background-color: #f9f9f9;
        }
        .header {
          text-align: center;
          border-bottom: 1px solid #eeeeee;
          margin-bottom: 20px;
        }
        .header h1 {
          color: #0078D7;
        }
        .content {
          text-align: left;
        }
        .footer {
          text-align: center;
          margin-top: 20px;
          font-size: 12px;
          color: #888888;
        }
        .button {
          display: inline-block;
          padding: 10px 20px;
          margin-top: 20px;
          background-color: #0078D7;
          color: #ffffff;
          text-decoration: none;
          border-radius: 5px;
        }
        .button:hover {
          background-color: #005BB5;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>Chat Ended</h1>
        </div>
        <div class="content">
          <p>Dear <strong>${patient.name}</strong>,</p>
          <p>The chat session with Dr. ${doc.name} has been successfully ended. If you have further questions or need additional assistance, feel free to schedule an appointment at your convenience.</p>
          <p>Thank you for trusting us with your care.</p>
          <a href="${process.env.PLATFORM_URL}/appointment" class="button">Schedule New Appointment</a>
        </div>
        <div class="footer">
          <p>&copy; 2025 Your Healthcare Provider. All rights reserved.</p>
        </div>
      </div>
    </body>
    </html>
    `
      const docHTML = `<!DOCTYPE html>
    <html>
    <head>
      <style>
        body {
          font-family: Arial, sans-serif;
          line-height: 1.6;
          color: #333333;
        }
        .container {
          width: 100%;
          max-width: 600px;
          margin: 0 auto;
          padding: 20px;
          border: 1px solid #eeeeee;
          border-radius: 8px;
          background-color: #f9f9f9;
        }
        .header {
          text-align: center;
          border-bottom: 1px solid #eeeeee;
          margin-bottom: 20px;
        }
        .header h1 {
          color: #0078D7;
        }
        .content {
          text-align: left;
        }
        .footer {
          text-align: center;
          margin-top: 20px;
          font-size: 12px;
          color: #888888;
        }
        .button {
          display: inline-block;
          padding: 10px 20px;
          margin-top: 20px;
          background-color: #0078D7;
          color: #ffffff;
          text-decoration: none;
          border-radius: 5px;
        }
        .button:hover {
          background-color: #005BB5;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>Chat Ended</h1>
        </div>
        <div class="content">
          <p>Dear <strong>${doc.name}</strong>,</p>
          <p>The chat session with $${patient.name} has been successfully ended. Please ensure all necessary follow-ups are recorded in the patient's file. If additional action is required, please inform the patient or the administration team.</p>
          <p>Thank you for your continued dedication to patient care.</p>
          <a href="${process.env.PLATFORM_URL}/chats" class="button">Chat With New Patiens</a>
        </div>
        <div class="footer">
          <p>&copy; 2025 Your Healthcare Provider. All rights reserved.</p>
        </div>
      </div>
    </body>
    </html>
    `
      sendEmail(patient.mail, "Chat Ended Successfully", patientHTML)
      sendEmail(doc.mail, "Chat Ended Successfully", docHTML)
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
