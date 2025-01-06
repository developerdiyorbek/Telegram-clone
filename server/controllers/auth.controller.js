class AuthController {
  async login(req, res, next) {
    try {
      const { email } = req.body;
      res.send({ email });
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
