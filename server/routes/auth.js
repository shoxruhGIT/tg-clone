const authController = require("../controllers/auth.controller");

const router = require("express").Router();

require("express-group-routes");

router.post("/login", authController.login);
router.post("/verify", authController.verify);

router.get("/contacts", (req, res) => {
  res.json({ contacts: [] });
});

module.exports = router;
