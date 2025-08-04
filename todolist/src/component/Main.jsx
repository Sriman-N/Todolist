import { useState, useEffect } from "react";
import TodoForm from "./TodoForm";

const Main = ({ setStats }) => {
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

  const deleteTodo = (id) => {
    const filtered = todos.filter((todo) => todo.id !== id);
    setTodos(filtered);
  };

  useEffect(() => {
    const numItems = todos.length;
    const numCompleted = todos.filter((todo) => todo.completed).length;
    const percentage =
      numItems === 0 ? 0 : Math.round((numCompleted / numItems) * 100);
    setStats({ numItems, numCompleted, percentage });
  }, [todos, setStats]);

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
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Main;
