const User = require("../models/UserModel");
const jwt = require("jsonwebtoken");
require("dotenv").config();

class AuthJwt {
  static async authentication(req, res, next) {
    try {
      const access_token = await req.headers.access_token;
      if (!access_token) {
        throw {name: "MISSING_TOKEN"};
      }
      const key = process.env.KEY;
      jwt.verify(access_token, key, (err, decoded) => {
        if (err) {
          throw {name: "INVALID_TOKEN"};
        }
        req.userID = decoded.id;
        next();
      });
    } catch (err) {
      next(err);
    }
  }

  static async authorization(req, res, next) {
    const {id} = req.params;
    const UserId = req.userID;
    const searchUser = await User.findById(UserId);

    try {
      if (searchUser.id.toString() !== id) {
        throw {name: "FORBIDDEN"};
      } else {
        next();
      }
    } catch (err) {
      next(err);
    }
  }
}

module.exports = AuthJwt;
