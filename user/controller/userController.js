const User = require("../models/UserModel");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
require("dotenv").config();

class UserController {
  static async createUser(req, res, next) {
    const {
      user_name,
      email_address,
      password,
      account_number,
      identity_number,
    } = req.body;

    req.body.password = bcrypt.hashSync(req.body.password, 8);

    try {
      const create = await User.create(req.body);
      if (!create) {
        throw {name: "FAILED_REGISTER"};
      } else {
        res.status(201).json({
          success: true,
          message: "User was created successfully!",
          data: create,
        });
      }
    } catch (err) {
      next(err);
    }
  }

  static async userLogin(req, res, next) {
    try {
      const loginEmail = await User.findOne({
        email_address: req.body.email_address,
      }).where({deleted: false});

      if (!loginEmail) {
        throw {name: "NOT_FOUND"};
      }

      const loginPassword = bcrypt.compareSync(
        req.body.password,
        loginEmail.password
      );

      if (!loginPassword) {
        throw {name: "FALSE_LOGIN"};
      } else {
        let token = jwt.sign({id: loginEmail.id}, process.env.KEY, {
          expiresIn: "1h",
        });
        res.status(200).json({
          message: "login successful!",
          data: loginEmail,
          access_token: token,
        });
      }
    } catch (err) {
      next(err);
    }
  }

  static async getByUserId(req, res, next) {
    const {id} = req.params;

    try {
      const searchUser = await User.findById(id).where({deleted: false});
      if (!searchUser) {
        throw {name: "NOT_FOUND"};
      } else {
        res.status(200).json({
          success: true,
          message: "User successfully found!",
          data: searchUser,
        });
      }
    } catch (err) {
      next(err);
    }
  }

  static async updateUser(req, res, next) {
    const {id} = req.params;
    const {
      user_name,
      email_address,
      password,
      account_number,
      identity_number,
    } = req.body;

    const updatedData = req.body;

    for (const key in updatedData) {
      if (!updatedData[key]) {
        delete updatedData[key];
      }
    }

    const today = new Date().toISOString();
    updatedData.updated_at = today;

    try {
      const edit = await User.findByIdAndUpdate(id, updatedData, {
        new: true,
      }).where({deleted: false});

      if (!edit) {
        throw {name: "NOT_EDITED"};
      }
      res.status(200).json({
        success: true,
        message: "successfully updated this user",
        data: edit,
      });
    } catch (err) {
      next(err);
    }
  }

  static async deleteUser(req, res, next) {
    const {id} = req.params;
    const today = new Date().toISOString();
    const deleted = {deleted: true, deleted_at: today};

    try {
      const edit = await User.findByIdAndUpdate(id, deleted, {new: true}).where(
        {deleted: false}
      );
      if (!edit) {
        throw {name: "DELETED"};
      }
      res.status(200).json({
        success: true,
        message: "User was successfully deleted",
        data: edit,
      });
    } catch (err) {
      next(err);
    }
  }

  static async getAllUsers(req, res, next) {
    try {
      const result = await User.find().where({deleted: false});
      if (result.length > 0) {
        res.status(200).json({
          success: true,
          message: "Users was successfully shown",
          data: result,
        });
      } else {
        res.status(200).json({message: "No user created ", data: 0});
      }
    } catch (err) {
      next(err);
    }
  }
}

module.exports = UserController;
