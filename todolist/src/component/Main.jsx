import { useState, useEffect, useRef } from "react";
import TodoForm from "./TodoForm";

const API_BASE = process.env.REACT_APP_API_BASE || "http://localhost:5000";

const Main = ({ username, setStats }) => {
  const [todos, setTodos] = useState([]);

  // --- AI tips UI state ---
  const [open, setOpen] = useState(false);
  const [activeTask, setActiveTask] = useState(null); // { id, task }
  const [tips, setTips] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [tipsCache, setTipsCache] = useState({}); // optional cache: { [id]: "tips..." }

  // debounce timer for autosave
  const saveTimer = useRef(null);

  // Load todos for this user on mount / when username changes
  useEffect(() => {
    if (!username) return;
    (async () => {
      try {
        const res = await fetch(`${API_BASE}/get-todos`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ username }),
        });
        const data = await res.json();
        if (res.ok && data.success) {
          setTodos(Array.isArray(data.todos) ? data.todos : []);
        } else {
          console.error("Load todos failed:", data);
        }
      } catch (e) {
        console.error("Load todos error:", e);
      }
    })();
  }, [username]);

  // Update stats and auto-save todos (debounced)
  useEffect(() => {
    // stats
    const numItems = todos.length;
    const numCompleted = todos.filter((todo) => todo.completed).length;
    const percentage =
      numItems === 0 ? 0 : Math.round((numCompleted / numItems) * 100);
    setStats({ numItems, numCompleted, percentage });

    // autosave (debounced)
    if (!username) return;
    if (saveTimer.current) clearTimeout(saveTimer.current);
    saveTimer.current = setTimeout(async () => {
      try {
        await fetch(`${API_BASE}/save-todos`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ username, todos }),
        });
      } catch (e) {
        console.error("Save todos error:", e);
      }
    }, 500);

    return () => clearTimeout(saveTimer.current);
  }, [todos, username, setStats]);

  const addTodo = (task) => {
    const clean = (task || "").trim();
    if (!clean) return;
    const newTodo = {
      id: Date.now(),
      task: clean,
      completed: false,
    };
    setTodos((prev) => [...prev, newTodo]);
  };

  const toggleComplete = (id) => {
    setTodos((prev) =>
      prev.map((todo) =>
        todo.id === id ? { ...todo, completed: !todo.completed } : todo
      )
    );
  };

  const deleteTodo = (id) => {
    setTodos((prev) => prev.filter((todo) => todo.id !== id));
    // close panel if you delete the active task
    if (activeTask?.id === id) setOpen(false);
  };

  async function handleGetTips(todo) {
    setActiveTask(todo);
    setOpen(true);
    setError("");
    setTips("");

    // If cached, show instantly
    if (tipsCache[todo.id]) {
      setTips(tipsCache[todo.id]);
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/ai-tips`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ task: todo.task }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to get AI tips");
      setTips(data.tips);
      setTipsCache((prev) => ({ ...prev, [todo.id]: data.tips }));
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="mainWrapper">
      <div style={{ marginBottom: 8, opacity: 0.75 }}>
        Signed in as <b>{username}</b>
      </div>

      <TodoForm onAddTodo={addTodo} />

      <ul className="todoList">
        {todos.map((todo) => (
          <li key={todo.id} className="todoItem">
            <span
              style={{
                textDecoration: todo.completed ? "line-through" : "none",
              }}
            >
              {todo.task}
            </span>

            <div className="btn">
              <button
                onClick={() => toggleComplete(todo.id)}
                className="doneBtn"
              >
                {todo.completed ? "Undo" : "Done"}
              </button>

              <button onClick={() => deleteTodo(todo.id)} className="deleteBtn">
                Delete
              </button>

              {/* AI tips button */}
              <button
                onClick={() => handleGetTips(todo)}
                className="aiBtn"
                title="AI Advice"
              >
                Advice from AI
              </button>
            </div>
          </li>
        ))}
      </ul>

      {/* Simple overlay + panel for AI tips */}
      {open && (
        <div className="overlay" onClick={() => setOpen(false)}>
          <div className="panel" onClick={(e) => e.stopPropagation()}>
            <div className="panelHeader">
              <strong>AI Advice</strong>
              <button className="closeBtn" onClick={() => setOpen(false)}>
                ✕
              </button>
            </div>
            <div className="panelSub">
              Task: <em>{activeTask?.task}</em>
            </div>
            <div className="panelBody">
              {loading && <p>Thinking…</p>}
              {error && <p style={{ color: "tomato" }}>{error}</p>}
              {!loading && !error && tips && (
                <pre style={{ whiteSpace: "pre-wrap", margin: 0 }}>{tips}</pre>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Main;
