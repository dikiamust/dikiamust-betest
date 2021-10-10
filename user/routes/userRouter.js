const {Router} = require("express");
const AuthJwt = require("../middlewares/authJwt");
const errorHandler = require("../middlewares/errorHandler");
const UserController = require("../controller/userController");

class UserRouter {
  router;
  constructor() {
    this.router = Router();
    this.routes();
    this.errorHandler();
  }

  routes() {
    this.router.get("/", (req, res) => {
      res.status(200).json({message: "Wellcome to User API!"});
    });

    this.router.get("/user", UserController.getAllUsers);

    this.router.post("/user/create", UserController.createUser);

    this.router.post("/user/login", UserController.userLogin);

    this.router.use(AuthJwt.authentication);

    this.router.get(
      "/user/:id",
      AuthJwt.authorization,
      UserController.getByUserId
    );

    this.router.put(
      "/user/:id",
      AuthJwt.authorization,
      UserController.updateUser
    );

    this.router.delete(
      "/user/:id",
      AuthJwt.authorization,
      UserController.deleteUser
    );
  }

  errorHandler() {
    this.router.use(errorHandler);
  }
}

module.exports = new UserRouter().router;
