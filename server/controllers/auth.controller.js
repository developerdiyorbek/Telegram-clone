const BaseError = require("../errors/base.error");
const userModel = require("../models/user.model");
const mailService = require("../service/mail.service");

class AuthController {
  async login(req, res, next) {
    try {
      const { email } = req.body;
      await mailService.sendOtp(email);

      // const isExistUser = await userModel.findOne({ email });

      // if (isExistUser) {
      //   throw BaseError.BadRequest("User already exist", [
      //     "email already exist",
      //   ]);
      // }

      await userModel.create({ email });
      res.status(201).json({ email });
    } catch (error) {
      next(error);
    }
  }

  async verify(req, res, next) {
    try {
      const { email, otp } = req.query;
      res.send({ email, otp });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new AuthController();
