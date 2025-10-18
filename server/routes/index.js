const authController = require("../controllers/auth.controller");
const userController = require("../controllers/user.controller");

// require("express-route-grouping");
// require("express-group-routes");

const router = require("express").Router();

// Auth
router.post("/auth/login", authController.login);
router.post("/auth/verify", authController.verify);

// user
router.get("/user/messages/:contactId", userController.getMessages);
router.post("/user/create-message", userController.createMessage);

// router.get("/user/contacts", (req, res) => {
//   res.json({ contacts: [] });
// });

module.exports = router;
