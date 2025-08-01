import { useState } from "react";
import TodoForm from "./TodoForm";

const Main = () => {
  const [todos, setTodos] = useState([]);

  const addTodo = (task) => {
    const newTodo = {
      id: Date.now(),
      task,
      completed: false,
    };
    setTodos([...todos, newTodo]);
  };

  const toggleComplete = (id) => {
    const updatedTodos = todos.map((todo) =>
      todo.id === id ? { ...todo, completed: !todo.completed } : todo
    );
    setTodos(updatedTodos);
  };

  return (
    <div className="main">
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
            <button onClick={() => toggleComplete(todo.id)} className="doneBtn">
              {todo.completed ? "Undo" : "Done"}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Main;
