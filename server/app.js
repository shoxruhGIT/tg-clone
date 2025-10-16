require("dotenv").config();

const express = require("express");
const cookieParser = require("cookie-parser");
const { default: mongoose } = require("mongoose");

const app = express();

// Middleware
app.use(express.json());

app.use("/api", require("./routes/auth"));

const PORT = process.env.PORT || 6000;

const bootstrap = async () => {
  try {
    const PORT = process.env.PORT || 6000;
    mongoose
      .connect(process.env.MONGO_URL)
      .then(() => console.log("MongoDB connected"));
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  } catch (error) {
    console.error(error);
  }
};

bootstrap();
