// backend/server.js
const express = require("express");
const cors = require("cors");

const app = express();

// Allow requests from local dev ports (Vite:5173, CRA:3000)
app.use(cors());
app.use(express.json());

// In-memory todos (refresh se reset)
let todos = [
  { id: 1, text: "Learn React" },
  { id: 2, text: "Build To-Do App" },
];

// GET: all todos
app.get("/api/todos", (req, res) => {
  res.json(todos);
});

// POST: add todo  { text: "..." }
app.post("/api/todos", (req, res) => {
  const { text } = req.body || {};
  if (!text || !text.trim()) {
    return res.status(400).json({ error: "text is required" });
  }
  const newTodo = { id: Date.now(), text: text.trim() };
  todos.push(newTodo);
  res.status(201).json(newTodo);
});

// DELETE: remove by id
app.delete("/api/todos/:id", (req, res) => {
  const id = Number(req.params.id);
  const existed = todos.some((t) => t.id === id);
  todos = todos.filter((t) => t.id !== id);
  res.json({ success: existed });
});

const PORT = 5000;
app.listen(PORT, () => {
  console.log(`✅ API running at http://localhost:${PORT}`);
});
