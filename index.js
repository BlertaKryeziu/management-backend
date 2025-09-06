const express = require('express');
const cors = require("cors");
const dotenv = require("dotenv");
const http = require("http");
const { Server } = require("socket.io");

dotenv.config();

const authRoutes = require("./routes/auth");
const tablesPage = require("./routes/tablesPage");
const waiter = require("./routes/waiter");
const products = require("./routes/products");
const orders = require("./routes/orders");

const connectDB = require("./config/mongo");
connectDB();

const orderLogRoute = require("./routes/orderLogs");

const app = express();

app.use(cors({ origin: "http://localhost:5173" }));
app.use(express.json());

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/tablesPage", tablesPage);
app.use("/api/waiter", waiter);
app.use("/api/products", products);
app.use("/api/orders", orders);
app.use("/api/orderLogs", orderLogRoute);

const PORT = process.env.PORT || 8095;

// Server HTTP
const server = http.createServer(app);

// Socket.IO
const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST", "PUT", "DELETE"]
  }
});

io.on("connection", (socket) => {
  console.log("Client connected:", socket.id);

  socket.on("disconnect", () => {
    console.log("Client disconnected:", socket.id);
  });
});

//  io ne app 
app.set("io", io);

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
