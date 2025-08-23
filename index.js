const express = require('express')
const cors = require("cors")
const dotenv = require("dotenv")

dotenv.config();

const authRoutes = require("./routes/auth");

const app = express();

app.use(cors({origin: "http://localhost:5173"}));
app.use(express.json());

app.use("/api/auth", authRoutes)

const PORT = process.env.PORT || 8095;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
})