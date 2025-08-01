import { useState } from "react";

const TodoForm = ({ onAddTodo }) => {
  const [task, setTask] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!task.trim()) return;
    onAddTodo(task);
    setTask("");
  };
  return (
    <form onSubmit={handleSubmit} className="todoForm">
      <input
        type="text"
        placeholder="Enter a new task"
        className="todoInput"
        value={task}
        onChange={(e) => setTask(e.target.value)}
      />
      <button type="submit" className="addBtn">
        add
      </button>
    </form>
  );
};

export default TodoForm;
