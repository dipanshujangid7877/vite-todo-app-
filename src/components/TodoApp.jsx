import { useState, useEffect } from "react";
import TodoItem from "./TodoItem";
import TodoFilters from "./TodoFilters";
import "./TodoApp.css";

const TodoApp = () => {
  const [task, setTask] = useState("");
  const [tasks, setTasks] = useState([]);
  const [filter, setFilter] = useState("All");
  const [search, setSearch] = useState("");

  // ✅ Load tasks from localStorage on start
  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem("tasks")) || [];
    setTasks(saved);
  }, []);

  // ✅ Save tasks to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem("tasks", JSON.stringify(tasks));
  }, [tasks]);

  const addTask = () => {
    if (task.trim() === "") return;
    const newTask = {
      id: Date.now(),
      text: task.trim(),
      completed: false,
    };
    setTasks([newTask, ...tasks]);
    setTask("");
  };

  const toggleComplete = (id) => {
    const updated = tasks.map((t) =>
      t.id === id ? { ...t, completed: !t.completed } : t
    );
    setTasks(updated);
  };

  const deleteTask = (id) => {
    const updated = tasks.filter((t) => t.id !== id);
    setTasks(updated);
  };

  const editTask = (id, newText) => {
    const updated = tasks.map((t) =>
      t.id === id ? { ...t, text: newText } : t
    );
    setTasks(updated);
  };

  const filteredTasks = tasks.filter((t) => {
    if (filter === "Active") return !t.completed;
    if (filter === "Completed") return t.completed;
    return true;
  });

  const searchedTasks = filteredTasks.filter((t) =>
    t.text.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="todo-container">
      <h1 className="title">Advanced To-Do List</h1>

      <div className="input-section">
        <input
          type="text"
          placeholder="Enter your task..."
          value={task}
          onChange={(e) => setTask(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && addTask()}
        />
        <button onClick={addTask}>Add</button>
      </div>

      <input
        type="text"
        className="search-bar"
        placeholder="🔍 Search tasks..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      <TodoFilters filter={filter} setFilter={setFilter} />

      <ul className="task-list">
        {searchedTasks.length > 0 ? (
          searchedTasks.map((t) => (
            <TodoItem
              key={t.id}
              task={t}
              toggleComplete={toggleComplete}
              deleteTask={deleteTask}
              editTask={editTask}
            />
          ))
        ) : (
          <p className="no-task">No tasks found!</p>
        )}
      </ul>
    </div>
  );
};

export default TodoApp;
