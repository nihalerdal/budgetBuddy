require("dotenv").config();
require("express-async-errors");
const swaggerUi = require("swagger-ui-express");
const YAML = require("yamljs");

//extra security packages
const helmet = require("helmet");
const cors = require("cors");
const xss = require("xss-clean");
const ratelimiter = require("express-rate-limit");

const express = require("express");
const app = express();
app.use(express.static("public"));

//swagger
const swaggerDocument =
  process.env.NODE_ENV === "production"
    ? YAML.load("./swaggerProd.yaml")
    : YAML.load("./swagger.yaml");
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

if (process.env.NODE_ENV === "production") {
  console.log("Running in production mode");
} else {
  console.log("Running in development mode");
}

//connectDB
const connectDB = require("./db/connect");
const authenticateUser = require("./middleware/authentication.js");

//routers
const authRouter = require("./routes/auth");
const expensesRouter = require("./routes/expenses");

// error handler
const notFoundMiddleware = require("./middleware/not-found");
const errorHandlerMiddleware = require("./middleware/error-handler");

app.set("trust proxy", 1);
app.use(
  ratelimiter({
    windowMs: 15 * 60 * 1000,
    max: 100, //limit each IP to 100 requests per windowMs
  })
);
app.use(express.json());
app.use(helmet());
app.use(cors());
app.use(xss());

// routes
app.use("/api/v1/auth", authRouter);
app.use("/api/v1/expenses", authenticateUser, expensesRouter);

app.use(notFoundMiddleware);
app.use(errorHandlerMiddleware);

const port = process.env.PORT || 3000;
console.log("Using port:", port);

const start = async () => {
  try {
    await connectDB(process.env.MONGO_URI);
    app.listen(port, () =>
      console.log(`Server is listening on port ${port}...`)
    );
  } catch (error) {
    console.log(error);
  }
};

start();
