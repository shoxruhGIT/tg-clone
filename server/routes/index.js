const authController = require("../controllers/auth.controller");
const userController = require("../controllers/user.controller");
const authMiddleware = require("../middlewares/auth.middleware");

// require("express-route-grouping");
// require("express-group-routes");

const router = require("express").Router();

// Auth
router.post("/auth/login", authController.login);
router.post("/auth/verify", authController.verify);

// user

router.get("/user/contacts", userController.getContacts);
router.get("/user/messages/:contactId", userController.getMessages);

router.post("/user/contact", userController.createContact);
router.post("/user/message", userController.createMessage);
router.post("/user/reaction", userController.createReaction);
router.post("/user/send-otp", authMiddleware, userController.sendOtp);
router.post("/user/message-read", userController.messageRead);

router.put("/user/message/:messageId", userController.updateMessage);
router.put("/user/email", authMiddleware, userController.updateEmail);
router.put("/user/profile", authMiddleware, userController.updateProfile);

router.delete("/user/message/:messageId", userController.deleteMessage);
router.delete("/user", authMiddleware, userController.deleteUser);

module.exports = router;
