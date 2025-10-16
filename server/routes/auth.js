const authController = require("../controllers/auth.controller");

// require("express-route-grouping");
// require("express-group-routes");

const router = require("express").Router();

router.post("/auth/login", authController.login);
router.post("/auth/verify", authController.verify);

router.get("/user/contacts", (req, res) => {
  res.json({ contacts: [] });
});

module.exports = router;
