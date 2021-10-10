const express = require("express");
const connectDB = require("./db/dbConfig");
const cors = require("cors");
const UserRouter = require("./routes/userRouter");

class App {
  app;
  constructor() {
    require("dotenv").config();
    this.app = express();
    this.plugin();
    this.cors();
    this.route();
  }

  plugin() {
    this.app.use(express.json());
    this.app.use(express.urlencoded({extended: true}));
    connectDB();
  }

  cors() {
    this.app.use((req, res, next) => {
      res.setHeader("Access-Control-Allow-Origin", "*");
      res.setHeader(
        "Access-Control-Allow-Headers",
        "Origin, X-Requested-With, Content-Type, Accept, Authorization"
      );
      res.setHeader(
        "Access-Control-Allow-Methods",
        "GET, POST, PATCH, PUT, DELETE, OPTIONS"
      );
      next();
    });
    this.app.use(cors());
  }

  route() {
    this.app.use(UserRouter);
  }
}

module.exports = new App().app;
