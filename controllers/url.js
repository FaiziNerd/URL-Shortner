const URL = require("../models/url");

function isHttpUrl(value) {
  try {
    const url = new URL(value);
    return url.protocol === "http:" || url.protocol === "https:";
  } catch {
    return false;
  }
}

async function handleGenerateNewShortURL(req, res) {
  const body = req.body;
  if (!body.url) {
    return res.status(400).render("home", { error: "URL is required" });
  }
  if (!isHttpUrl(body.url)) {
    return res.status(400).render("home", { error: "Enter a valid http or https URL" });
  }

  const { nanoid } = await import("nanoid");
  const shortID = nanoid(8);
  await URL.create({
    shortId: shortID,
    redirectURL: body.url,
    visitHistory: [],
  });

  return res.render("home", {
    id: shortID,
    shortUrl: `${req.protocol}://${req.get("host")}/url/${shortID}`,
  });
}

async function handleGetAnalytics(req, res) {
  const shortId = req.params.shortId;
  const result = await URL.findOne({ shortId });
  if (!result) {
    return res.status(404).json({ error: "Short URL not found" });
  }

  const history = result.visitHistory || [];
  return res.json({
    totalClicks: history.length,
    analytics: history,
  });
}

async function handleRedirect(req, res) {
  const shortId = req.params.shortId;
  const entry = await URL.findOneAndUpdate(
    { shortId },
    {
      $push: {
        visitHistory: {
          timestamp: Date.now(),
        },
      },
    }
  );

  if (!entry) {
    return res.status(404).send("Short URL not found");
  }

  return res.redirect(entry.redirectURL);
}

module.exports = {
  handleGenerateNewShortURL,
  handleGetAnalytics,
  handleRedirect,
};
