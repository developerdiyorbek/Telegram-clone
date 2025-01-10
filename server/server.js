require("dotenv").config();

const express = require("express");
const { default: mongoose } = require("mongoose");
const errorMiddleware = require("./middlewares/error.middleware");

const app = express();

// Middleware
app.use(express.json());

app.use("/api", require("./routes/index"));

app.use(errorMiddleware);

const PORT = process.env.PORT || 6000;

const bootstrap = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URL);
    console.log("Mongodb connected");
    app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));
  } catch (error) {}
};

bootstrap();
