const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const db = require("./config/db");
const cors = require("cors");
require("dotenv").config();
const app = express();
const path = require("path");
const http = require("http"); // Import the HTTP module to create a server
const socketIo = require("socket.io"); // Import Socket.IO
const cloudinary = require("cloudinary").v2;
const Chat = require("./models/Chat"); // Import the Chat model

// Create an HTTP server
const server = http.createServer(app);

// Initialize Socket.IO with the server
const io = socketIo(server, {
  cors: {
    origin:  process.env.CLIENT_ORIGIN, 
    credentials: true,// Specify the allowed origin (frontend URL)
    methods: ["GET", "POST"],
  },
});

// Middleware for JSON body parsing
app.use(bodyParser.json());
// app.use(
//   cors({
//     origin: process.env.CLIENT_ORIGIN, // fronted URL for development
//     credentials: true,
//   })
// );

app.use(cors({ origin: '*' }));

app.use(express.json());
// Cloudinary configuration
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// WhatsApp Webhook Verification
app.get("/webhook", (req, res) => {
  let mode = req.query["hub.mode"];
  let token = req.query["hub.verify_token"];
  let challenge = req.query["hub.challenge"];

  if (mode === "subscribe" && token === "YOUR_VERIFY_TOKEN") {
    console.log("✅ Webhook Verified!");
    res.status(200).send(challenge);
  } else {
    res.sendStatus(403);
  }
});

// Webhook to Receive WhatsApp Messages
app.post("/webhook", (req, res) => {
  console.log(
    "📩 Received WhatsApp Message:",
    JSON.stringify(req.body, null, 2)
  );
  res.status(200).send("EVENT_RECEIVED");
});

// Socket.IO Event Handling
io.on("connection", (socket) => {
  console.log("A user connected");

  // Listen for chat messages from clients
  socket.on("chat", async (messageData) => {
    console.log("Received message: ", messageData);

    // Ensure the message data contains both sender and message
    if (!messageData.username || !messageData.text) {
      console.error("Missing sender (username) or message (text)");
      return;
    }

    let media = null;
    // Check if there is a media file to upload
    if (messageData.media) {
      try {
        const uploadResult = await cloudinary.uploader.upload(
          messageData.media,
          {
            folder: "gym",
            transformation: [{ width: 500, height: 500, crop: "limit" }],
          }
        );
        media = uploadResult.secure_url; // Store the image URL
      } catch (uploadError) {
        console.error("Error uploading media to Cloudinary:", uploadError);
        return; // Optionally return if media upload fails
      }
    }

    // Create a new chat document
    const newChat = new Chat({
      sender: messageData.username,
      message: messageData.text,
      media: media || null, // Store the media URL if available
      photoUrl: messageData.photoUrl || null, // Don't upload profile photo to Cloudinary
    });

    try {
      // Save the chat message to the database
      await newChat.save();
      console.log("Message saved to the database");

      // Emit the message with media (if available)
      io.emit("chat", {
        ...messageData,
        media: media || null,
      });
    } catch (error) {
      console.error("Error saving message:", error);
    }
  });

  // Handle disconnection event
  socket.on("disconnect", () => {
    console.log("A user disconnected");
  });
});

// Routes
const authRoutes = require("./routes/authRoutes");
const userRoutes = require("./routes/userRoutes");
const adminRoutes = require("./routes/adminRoutes");
const planRoutes = require("./routes/planRoutes");
const trainerRoutes = require("./routes/trainerRoutes");
const feedbackRoutes = require("./routes/feedbackRoutes");
const taskRoutes = require("./routes/taskRoutes");
const paymentRoutes = require("./routes/paymentRoutes");
const classRoutes = require("./routes/classRoutes");
const forgotRoute = require("./routes/forgotRoute");
const slotRoutes = require("./routes/slotRoutes");
const gptRoutes = require("./routes/gptRoutes");

app.get("/", (req, res) => res.send("API Running"));
app.use("/api/auth", authRoutes);
app.use("/api/user", userRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/plan", planRoutes);
app.use("/api/forgotPassword", forgotRoute);
app.use("/api/trainer", trainerRoutes);
app.use("/api/feedback", feedbackRoutes);
app.use("/api/task", taskRoutes);
app.use("/api/payment", paymentRoutes);
const chatRoutes = require("./routes/chatRoutes");
app.use("/chat", chatRoutes);
app.use("/api/class", classRoutes);
app.use("/api/slots", slotRoutes);
app.use("/api/generate-plan", gptRoutes);
require("./cronJobs"); // Import cron jobs to automate tasks

// Start the server (HTTP and WebSocket)
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});
