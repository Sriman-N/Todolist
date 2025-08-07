const express = require("express"); // express helps build the server
const fs = require("fs"); // file system module to read/write files
const cors = require("cors"); // allows React (frontend) to talk to this server (backend)

const app = express();
const PORT = 5000;

app.use(cors()); // Allow cross-origin requests from React (port 3000)
app.use(express.json()); // Automatically parse incoming JSON data

// LOGIN ROUTE
app.post("/login", (req, res) => {
  const { username, password } = req.body;

  const users = JSON.parse(fs.readFileSync("users.json", "utf-8")); // read users
  const user = users.find((u) => u.username === username); // find matching user

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

  const users = JSON.parse(fs.readFileSync("users.json", "utf-8"));
  const userExists = users.find((u) => u.username === username);

  if (userExists) {
    return res
      .status(400)
      .json({ success: false, message: "Username already exists" });
  }

  users.push({ username, password });
  fs.writeFileSync("users.json", JSON.stringify(users, null, 2), "utf-8");

  return res.json({ success: true, message: "User registered successfully" });
});

// SAVE TODOS ROUTE
app.post("/save-todos", (req, res) => {
  const { username, todos } = req.body;

  const allTodos = JSON.parse(fs.readFileSync("todos.json", "utf-8") || "{}");
  allTodos[username] = todos;
  fs.writeFileSync("todos.json", JSON.stringify(allTodos, null, 2), "utf-8");

  return res.json({ success: true, message: "Todos saved" });
});

// GET TODOS ROUTE
app.post("/get-todos", (req, res) => {
  const { username } = req.body;

  const allTodos = JSON.parse(fs.readFileSync("todos.json", "utf-8") || "{}");
  const userTodos = allTodos[username] || [];

  return res.json({ success: true, todos: userTodos });
});

// START SERVER
app.listen(PORT, () => {
  console.log(`✅ Server running on http://localhost:${PORT}`);
});
