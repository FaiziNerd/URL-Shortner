const crypto = require("crypto");

const User = require("../models/user");
const { setUser } = require("../service/auth");

function hashPassword(password) {
  const salt = crypto.randomBytes(16).toString("hex");
  const hash = crypto.scryptSync(password, salt, 64).toString("hex");
  return `${salt}:${hash}`;
}

function verifyPassword(password, stored) {
  const [salt, hash] = String(stored || "").split(":");
  if (!salt || !hash) return false;

  const actual = Buffer.from(hash, "hex");
  const expected = crypto.scryptSync(password, salt, 64);
  if (actual.length !== expected.length) return false;
  return crypto.timingSafeEqual(actual, expected);
}

async function startSession(res, user) {
  const { v4: uuidv4 } = await import("uuid");
  const sessionId = uuidv4();
  setUser(sessionId, {
    _id: user._id,
    name: user.name,
    email: user.email,
  });
  res.cookie("uid", sessionId, { httpOnly: true });
}

async function handleSignUp(req, res) {
  const { name, email, password } = req.body;
  if (!name || !email || !password) {
    return res.status(400).render("signup", { error: "All fields are required" });
  }

  try {
    const user = await User.create({
      name,
      email,
      password: hashPassword(password),
    });
    await startSession(res, user);
    return res.redirect("/");
  } catch (err) {
    if (err.code === 11000) {
      return res.status(400).render("signup", { error: "Email is already registered" });
    }
    throw err;
  }
}

async function handleUserLogin(req, res) {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (!user || !verifyPassword(password, user.password)) {
    return res.status(401).render("login", {
      error: "Invalid email or password",
    });
  }

  await startSession(res, user);
  return res.redirect("/");
}

module.exports = { handleSignUp, handleUserLogin };
