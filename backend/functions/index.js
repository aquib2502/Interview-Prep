const express = require("express");
const cors = require("cors");
const admin = require("firebase-admin");
const jwt = require("jsonwebtoken");
const OpenAI = require("openai");
const dotenv = require("dotenv");

// Load environment variables from .env file
dotenv.config();

// Initialize Firebase Admin SDK
const serviceAccount = require(process.env.FIREBASE_SERVICE_ACCOUNT_KEY_PATH);
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

// Initialize OpenAI with API key from .env
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const app = express();
app.use(cors());
app.use(express.json());

// Middleware to verify JWT
const verifyToken = (req, res, next) => {
  const token = req.headers["authorization"];
  if (!token) return res.status(401).json({ error: "Access denied. No token provided." });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    res.status(400).json({ error: "Invalid token." });
  }
};

// Routes
app.post("/signup", async (req, res) => {
  const { email, password } = req.body;
  try {
    const userRecord = await admin.auth().createUser({ email, password });
    res.status(201).json({ uid: userRecord.uid });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

app.post("/login", async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await admin.auth().getUserByEmail(email);
    const token = jwt.sign({ uid: user.uid }, process.env.JWT_SECRET, { expiresIn: "1h" });
    res.status(200).json({ token });
  } catch (err) {
    res.status(400).json({ error: "Invalid credentials." });
  }
});

app.post("/interview/start", verifyToken, async (req, res) => {
  const { domain } = req.body;
  try {
    const prompt = `Generate 5 interview questions for the ${domain} domain.`;
    const response = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [{ role: "user", content: prompt }],
    });
    const questions = response.choices[0].message.content.split("\n");
    res.status(200).json({ questions });
  } catch (err) {
    res.status(500).json({ error: "Failed to generate questions." });
  }
});

app.post("/interview/answer", verifyToken, async (req, res) => {
  const { question, answer } = req.body;
  try {
    const prompt = `Evaluate this answer for the question "${question}": ${answer}. Provide feedback on clarity, confidence, relevance, and correctness.`;
    const response = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [{ role: "user", content: prompt }],
    });
    const feedback = response.choices[0].message.content;
    res.status(200).json({ feedback });
  } catch (err) {
    res.status(500).json({ error: "Failed to evaluate answer." });
  }
});

app.get("/interview/results/:id", verifyToken, async (req, res) => {
  // Fetch results logic here
  res.status(200).json({ message: "Results fetched successfully." });
});

app.get("/interview/history", verifyToken, async (req, res) => {
  // Fetch history logic here
  res.status(200).json({ message: "History fetched successfully." });
});

app.get("/admin/insights", verifyToken, async (req, res) => {
  // Admin insights logic here
  res.status(200).json({ message: "Insights fetched successfully." });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});