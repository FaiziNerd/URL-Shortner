const express = require("express");

const {
  handleGenerateNewShortURL,
  handleGetAnalytics,
  handleRedirect,
} = require("../controllers/url");
const { restrictToLoggedinUserOnly } = require("../middlewares/auth");

const router = express.Router();

router.post("/", restrictToLoggedinUserOnly, handleGenerateNewShortURL);
router.get("/analytics/:shortId", restrictToLoggedinUserOnly, handleGetAnalytics);
router.get("/:shortId", handleRedirect);

module.exports = router;
