const mongoose = require("mongoose");
const validator = require("validator");

const today = new Date().toISOString();
const Schema = mongoose.Schema;
const userSchema = new Schema({
  user_name: {
    type: String,
  },
  email_address: {
    type: String,
    unique: true,
    lowercase: true,
    // validate: [validator.isEmail, "Please fill a valid email address"],
  },
  password: {
    type: String,
  },
  account_number: {
    type: Number,
    unique: true,
  },
  identity_number: {type: Number, unique: true},
  created_at: {type: Date, default: today},
  updated_at: {type: Date},
  deleted: {type: Boolean, default: false},
  deleted_at: {type: Date},
});

const UserModel = mongoose.model("user", userSchema);
module.exports = UserModel;
