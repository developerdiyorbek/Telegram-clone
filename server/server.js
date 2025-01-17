require("dotenv").config();

const express = require("express");
const { default: mongoose } = require("mongoose");
const cors = require("cors");
const errorMiddleware = require("./middlewares/error.middleware");

const app = express();

app.use(express.json());

app.use(
  cors({
    origin: process.env.ORIGIN_CLIENT_URL,
    methods: ["GET", "POST", "PUT", "DELETE"],
  })
);

app.use("/api", require("./routes/index"));

app.use(errorMiddleware);

const bootstrap = async () => {
  try {
    const PORT = process.env.PORT || 6000;
    mongoose
      .connect(process.env.MONGODB_URL)
      .then(() => console.log("MongoDB connected"));
    app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));
  } catch (error) {
    console.error(error);
  }
};

bootstrap();
