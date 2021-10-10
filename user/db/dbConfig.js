const mongoose = require("mongoose");
const dotenv = require("dotenv");

class connectDB {
  constructor() {
    dotenv.config();
  }

  connect() {
    const db = mongoose.connection;
    const pathURI = process.env.DB_HOST;
    const connectOption = {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    };
    mongoose.set("runValidators", true);
    mongoose.connect(pathURI, connectOption);

    db.on("error", console.error.bind(console, "Database connection error: "));
    db.once("open", () => {
      console.log("Database connected..");
    });
  }
}

module.exports = new connectDB().connect;
