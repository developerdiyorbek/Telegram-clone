require("dotenv").config();

const express = require("express");
const { default: mongoose } = require("mongoose");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const errorMiddleware = require("./middlewares/error.middleware");

const app = express();

app.use(express.json());
app.use(cors());

app.use(cookieParser());

app.use("/api", require("./routes/index"));

app.use(errorMiddleware);

const bootstrap = async () => {
  try {
    const PORT = process.env.PORT || 4000;
    mongoose
      .connect(process.env.MONGODB_URL)
      .then(() => console.log("MongoDB connected"));
    app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));
  } catch (error) {
    console.error(error);
  }
};

bootstrap();
