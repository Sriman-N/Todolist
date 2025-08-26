const express = require("express");
const fs = require("fs");
const cors = require("cors");
const OpenAI = require("openai"); // SDK
require("dotenv").config(); // load .env into process.env

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// ---- Helpers for safe JSON file access ----
function readJSONSafe(path, fallback) {
  try {
    if (!fs.existsSync(path)) return fallback;
    const txt = fs.readFileSync(path, "utf-8");
    return txt.trim() ? JSON.parse(txt) : fallback;
  } catch {
    return fallback;
  }
}

function writeJSON(path, data) {
  fs.writeFileSync(path, JSON.stringify(data, null, 2), "utf-8");
}

// ---- OpenAI client (with API key + Project ID) ----
const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
  project: process.env.OPENAI_PROJECT,
});

if (!process.env.OPENAI_API_KEY || !process.env.OPENAI_PROJECT) {
  console.warn(
    "⚠️  OPENAI_API_KEY or OPENAI_PROJECT is not set. Add them in your system env or .env file."
  );
}

// ---------- ROUTES ----------

// Health check (optional)
app.get("/health", (_req, res) => res.send("ok"));

// AI tips route (uses OpenAI SDK)
app.post("/ai-tips", async (req, res) => {
  try {
    const { task } = req.body || {};
    if (!task || typeof task !== "string" || !task.trim()) {
      return res
        .status(400)
        .json({ error: "Please provide a non-empty 'task' string." });
    }

    const prompt = [
      "You are a pragmatic productivity coach.",
      "Return clear, numbered steps with brief time estimates and common pitfalls.",
      "Do not cross 300 tokens",
      "Be kind and very helpful",
      `Task: "${task.trim()}"`,
    ].join(" ");

    const completion = await client.chat.completions.create({
      model: "gpt-4o-mini", // you can swap to "gpt-3.5-turbo" if needed
      messages: [
        { role: "system", content: "Be concise, actionable, and structured." },
        { role: "user", content: prompt },
      ],
      max_tokens: 300,
      temperature: 0.4,
    });

    const tips = completion.choices?.[0]?.message?.content?.trim();
    if (!tips)
      return res.status(502).json({ error: "AI returned no content." });

    res.json({ tips });
  } catch (error) {
    console.error("AI error:", error);
    res.status(500).json({ error: "Failed to get AI suggestions" });
  }
});

//change password
app.post("/change-password", (req, res) => {
  const { username, oldPassword, newPassword } = req.body;

  if (!username || !oldPassword || !newPassword) {
    return res.status(400).json({ error: "All fields are required" });
  }

  const users = JSON.parse(fs.readFileSync("users.json"));

  // Find user
  const user = users.find((u) => u.username === username);

  if (!user) {
    return res.status(404).json({ error: "User not found" });
  }

  if (user.password !== oldPassword) {
    return res.status(401).json({ error: "Old password is incorrect" });
  }

  // Update password
  user.password = newPassword;
  fs.writeFileSync("users.json", JSON.stringify(users, null, 2));

  res.json({ message: "Password updated successfully" });
});

//delete account
app.delete("/delete-account", (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ error: "Username and password required" });
  }

  let users = JSON.parse(fs.readFileSync("users.json"));

  const userIndex = users.findIndex(
    (u) => u.username === username && u.password === password
  );

  if (userIndex === -1) {
    return res.status(401).json({ error: "Invalid username or password" });
  }

  // Remove user
  users.splice(userIndex, 1);
  fs.writeFileSync("users.json", JSON.stringify(users, null, 2));

  res.json({ message: "Account deleted successfully" });
});

// LOGIN ROUTE
app.post("/login", (req, res) => {
  const { username, password } = req.body;

  const users = readJSONSafe("users.json", []);
  const user = users.find((u) => u.username === username);

  if (!user) {
    return res.status(401).json({ success: false, message: "User not found" });
  }
  if (user.password !== password) {
    return res
      .status(401)
      .json({ success: false, message: "Incorrect password" });
  }
  return res.json({ success: true, message: "Login successful" });
});

// REGISTER ROUTE
app.post("/register", (req, res) => {
  const { username, password } = req.body;
  if (!username?.trim() || !password?.trim()) {
    return res.status(400).json({ success: false, message: "Missing fields" });
  }

  const users = readJSONSafe("users.json", []);
  if (users.some((u) => u.username === username)) {
    return res
      .status(409)
      .json({ success: false, message: "Username already exists" });
  }

  users.push({ username, password });
  writeJSON("users.json", users);

  res.json({ success: true, message: "User registered successfully" });
});

// SAVE TODOS ROUTE
app.post("/save-todos", (req, res) => {
  const { username, todos } = req.body;

  if (!username?.trim() || !Array.isArray(todos)) {
    return res.status(400).json({ success: false, message: "Invalid payload" });
  }

  const allTodos = readJSONSafe("todos.json", {});
  allTodos[username] = todos;
  writeJSON("todos.json", allTodos);

  return res.json({ success: true, message: "Todos saved" });
});

// GET TODOS ROUTE
app.post("/get-todos", (req, res) => {
  const { username } = req.body;

  if (!username?.trim()) {
    return res
      .status(400)
      .json({ success: false, message: "Missing username" });
  }

  const allTodos = readJSONSafe("todos.json", {});
  const userTodos = allTodos[username] || [];

  return res.json({ success: true, todos: userTodos });
});

// START SERVER
app.listen(PORT, () => {
  console.log(`✅ Server running on http://localhost:${PORT}`);
});
