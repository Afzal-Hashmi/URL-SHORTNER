const router = require("express").Router();
const { newShortUrl, getUrl } = require("../controllers/urls");
const verifyToken = require("../middlewares/checkUser");

router.post("/", verifyToken, newShortUrl);
router.get("/:shortId", verifyToken, getUrl);

module.exports = router;
