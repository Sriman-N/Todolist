import { useState, useEffect } from "react";
import TodoForm from "./TodoForm";

const Main = ({ setStats }) => {
  const [todos, setTodos] = useState([]);

  // --- AI tips UI state ---
  const [open, setOpen] = useState(false);
  const [activeTask, setActiveTask] = useState(null); // { id, task }
  const [tips, setTips] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [tipsCache, setTipsCache] = useState({}); // optional cache: { [id]: "tips..." }

  const addTodo = (task) => {
    const newTodo = {
      id: Date.now(),
      task,
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

  useEffect(() => {
    const numItems = todos.length;
    const numCompleted = todos.filter((todo) => todo.completed).length;
    const percentage =
      numItems === 0 ? 0 : Math.round((numCompleted / numItems) * 100);
    setStats({ numItems, numCompleted, percentage });
  }, [todos, setStats]);

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
      const res = await fetch("http://localhost:5000/ai-tips", {
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

              {/* New: AI tips button */}
              <button
                onClick={() => handleGetTips(todo)}
                className="aiBtn"
                title="Get AI plan of attack"
              >
                AI Tips
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
              <strong>AI plan of attack</strong>
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
