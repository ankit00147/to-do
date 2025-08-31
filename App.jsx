import { useEffect, useState } from "react";

const API = import.meta.env.VITE_API_URL || "http://localhost:5000";

export default function App() {
  const [todos, setTodos] = useState([]);
  const [newTodo, setNewTodo] = useState("");
  const [loading, setLoading] = useState(true);
  const [adding, setAdding] = useState(false);
  const [error, setError] = useState("");

  // Fetch todos
  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        const res = await fetch(`${API}/api/todos`);
        const data = await res.json();
        setTodos(data);
      } catch (e) {
        setError("Failed to load todos. Is backend running on 5000?");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  // Add todo
  const addTodo = async () => {
    if (!newTodo.trim()) return;
    try {
      setAdding(true);
      const res = await fetch(`${API}/api/todos`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: newTodo }),
      });
      if (!res.ok) {
        const j = await res.json().catch(() => ({}));
        throw new Error(j.error || "Add failed");
      }
      const data = await res.json();
      setTodos((prev) => [...prev, data]);
      setNewTodo("");
    } catch (e) {
      setError(e.message);
    } finally {
      setAdding(false);
    }
  };

  // Delete todo
  const deleteTodo = async (id) => {
    const prev = todos;
    // optimistic UI
    setTodos((t) => t.filter((x) => x.id !== id));
    try {
      const res = await fetch(`${API}/api/todos/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Delete failed");
    } catch (e) {
      setError(e.message);
      setTodos(prev); // rollback on error
    }
  };

  return (
    <div style={{ maxWidth: 520, margin: "40px auto", padding: 16, fontFamily: "system-ui, sans-serif" }}>
      <h1 style={{ textAlign: "center", marginBottom: 16 }}>✅ Day 12 — To-Do App</h1>

      <div style={{
        display: "flex", gap: 8, marginBottom: 16
      }}>
        <input
          value={newTodo}
          onChange={(e) => setNewTodo(e.target.value)}
          placeholder="Enter a task"
          onKeyDown={(e) => e.key === "Enter" && addTodo()}
          style={{
            flex: 1, padding: "10px 12px", borderRadius: 10, border: "1px solid #ddd", outline: "none"
          }}
        />
        <button
          onClick={addTodo}
          disabled={adding}
          style={{
            padding: "10px 14px",
            borderRadius: 10,
            border: "none",
            cursor: "pointer",
            boxShadow: "0 2px 8px rgba(0,0,0,0.08)"
          }}
        >
          {adding ? "Adding..." : "Add"}
        </button>
      </div>

      {error && (
        <div style={{ background: "#ffe8e8", padding: 10, borderRadius: 10, color: "#b00020", marginBottom: 12 }}>
          {error}
        </div>
      )}

      {loading ? (
        <p>Loading todos…</p>
      ) : todos.length === 0 ? (
        <p>No tasks yet. Add your first task! 🎯</p>
      ) : (
        <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "grid", gap: 8 }}>
          {todos.map((todo) => (
            <li key={todo.id} style={{
              display: "flex", alignItems: "center", justifyContent: "space-between",
              padding: "10px 12px", border: "1px solid #eee", borderRadius: 12
            }}>
              <span>{todo.text}</span>
              <button
                onClick={() => deleteTodo(todo.id)}
                title="Delete"
                style={{
                  border: "none", background: "#f5f5f5", padding: "6px 10px",
                  borderRadius: 8, cursor: "pointer"
                }}
              >
                ❌
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
