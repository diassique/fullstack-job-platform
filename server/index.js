import express from "express";
import mongoose from "mongoose";
import morgan from "morgan";
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import cors from "cors";
import { config as dotenvConfig } from "dotenv";
import errorHandler from "./middleware/error.js"

// Import routes
import authRoutes from "./routes/authRoutes.js"

dotenvConfig();

const app = express();

const port = process.env.PORT || 8000;

// db connection
mongoose.connect(process.env.DB_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => {
  console.log("DB ok")
}).catch((err) => {
  console.log("Unable to connect to DB:", err);
})

// middleware
app.use(morgan('dev'));
app.use(bodyParser.json({limit: "5mb"}));
app.use(bodyParser.urlencoded({
  limit: "5mb",
  extended: true
}));
app.use(cookieParser());
app.use(cors());

// error middleware
app.use(errorHandler);

// Routes middleware
app.use('/', authRoutes);



app.listen(port, () => {
  console.log(`Server successfully started on port ${port}`);
});