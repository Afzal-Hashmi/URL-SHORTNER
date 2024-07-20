const { userSignup, userLogin, userLogout } = require("../controllers/user");
const router = require("express").Router();

router.post("/", userSignup);
router.post("/login", userLogin);
router.get("/logout", userLogout);

module.exports = router;
