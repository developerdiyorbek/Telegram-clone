const authController = require("../controllers/auth.controller");
const userController = require("../controllers/user.controller");
const authMiddleware = require("../middlewares/auth.middleware");

const router = require("express").Router();

require("express-group-routes");

router.group("/auth", (route) => {
  route.post("/login", authController.login);
  route.post("/verify", authController.verify);
});

router.group("/user", (route) => {
  // get
  route.get("/contacts", authMiddleware, userController.getContacts);
  route.get("/messages/:contactId", authMiddleware, userController.getMessages);

  //post
  route.post("/message", authMiddleware, userController.createMessage);
  route.post("/contact", authMiddleware, userController.createContact);
  route.post("/reaction", authMiddleware, userController.createReaction);
  route.post("/send-otp", authMiddleware, userController.sendOtp);
  route.post("/message-read", authMiddleware, userController.messageRead);

  // put
  route.put(
    "/message/:messageId",
    authMiddleware,
    userController.updateMessage
  );
  route.put("/profile", authMiddleware, userController.updateProfile);
  route.put("/email", authMiddleware, userController.updateEmail);

  // delete
  route.delete("/", authMiddleware, userController.deleteUser);
  route.delete(
    "/message/:messageId",
    authMiddleware,
    userController.deleteMessage
  );
});

module.exports = router;
