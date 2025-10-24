import React, { useEffect, useState } from "react";
import "../index.css";

function TodoList() {
 
  const [taskText, setTaskText] = useState("");
  
  const [todos, setTodos] = useState([]);
 
  const [editingId, setEditingId] = useState(null);

  const [query, setQuery] = useState("");
  
  const [filter, setFilter] = useState("all");
 
  const [priority, setPriority] = useState("low");
  
  const [darkMode, setDarkMode] = useState(false);

  const STORAGE_KEY = "my_todos_v1";
  const THEME_KEY = "my_todos_theme_v1";

  
  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        setTodos(JSON.parse(saved));
      } catch (e) {
        console.error("Failed to parse saved todos", e);
      }
    }
    const savedTheme = localStorage.getItem(THEME_KEY);
    if (savedTheme) setDarkMode(savedTheme === "dark");
  }, []);

 
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(todos));
  }, [todos]);

 
  useEffect(() => {
    localStorage.setItem(THEME_KEY, darkMode ? "dark" : "light");
  }, [darkMode]);

 
  const handleAddOrUpdate = () => {
    const text = taskText.trim();
    if (!text) return; 
    if (editingId) {
     
      setTodos((prev) =>
        prev.map((t) =>
          t.id === editingId ? { ...t, text, priority, time: t.time } : t
        )
      );
      setEditingId(null);
    } else {
    
      const newTodo = {
        id: Date.now().toString(), 
        text,
        completed: false,
        time: new Date().toISOString(),
        priority,
      };
      setTodos((prev) => [newTodo, ...prev]); 
    }
    setTaskText("");
    setPriority("low");
  };

 
  const startEdit = (id) => {
    const t = todos.find((x) => x.id === id);
    if (!t) return;
    setTaskText(t.text);
    setPriority(t.priority || "low");
    setEditingId(id);
   
    const el = document.getElementById("task-input");
    if (el) el.focus();
  };

  
  const cancelEdit = () => {
    setEditingId(null);
    setTaskText("");
    setPriority("low");
  };

  
  const deleteTask = (id) => {
    setTodos((prev) => prev.filter((t) => t.id !== id));
    if (editingId === id) cancelEdit();
  };


  const toggleComplete = (id) => {
    setTodos((prev) => prev.map((t) => (t.id === id ? { ...t, completed: !t.completed } : t)));
  };

  
  const visibleTodos = todos.filter((t) => {
   
    if (query && !t.text.toLowerCase().includes(query.toLowerCase())) return false;

    if (filter === "completed") return t.completed;
    if (filter === "pending") return !t.completed;
    return true;
  });

  
  const total = todos.length;
  const completedCount = todos.filter((t) => t.completed).length;
  const pendingCount = total - completedCount;

 
  const formatTime = (isoString) => {
    try {
      const d = new Date(isoString);
      return d.toLocaleString(); // shows date + time in user's locale
    } catch {
      return isoString;
    }
  };

  
  const priorityLabel = (p) => {
    if (p === "high") return "High";
    if (p === "medium") return "Medium";
    return "Low";
  };

  return (
    <div className={darkMode ? "app dark" : "app"}>
      <div className="topbar">
        <h1>📝 Advanced To-Do</h1>

        <div className="theme-switch">
          <button
            className="icon-btn"
            onClick={() => setDarkMode((prev) => !prev)}
            title="Toggle theme"
          >
            {darkMode ? "🌞 Light" : "🌙 Dark"}
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="stats-row">
        <div>Total: <strong>{total}</strong></div>
        <div>Completed: <strong>{completedCount}</strong></div>
        <div>Pending: <strong>{pendingCount}</strong></div>
      </div>

      {/* Add / Edit form */}
      <div className="input-row">
        <input
          id="task-input"
          type="text"
          placeholder="Enter a task..."
          value={taskText}
          onChange={(e) => setTaskText(e.target.value)}
          onKeyDown={(e) => { if (e.key === "Enter") handleAddOrUpdate(); }}
        />

        <select value={priority} onChange={(e) => setPriority(e.target.value)} aria-label="Priority">
          <option value="low">Low Priority</option>
          <option value="medium">Medium Priority</option>
          <option value="high">High Priority</option>
        </select>

        <button onClick={handleAddOrUpdate} className="primary">
          {editingId ? "Update" : "Add"}
        </button>

        {editingId && (
          <button onClick={cancelEdit} className="secondary">Cancel</button>
        )}
      </div>

      {/* Search & Filter */}
      <div className="controls-row">
        <input
          type="text"
          placeholder="Search tasks..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />

        <select value={filter} onChange={(e) => setFilter(e.target.value)}>
          <option value="all">All</option>
          <option value="completed">Completed</option>
          <option value="pending">Pending</option>
        </select>

        <button
          onClick={() => {
            setQuery("");
            setFilter("all");
          }}
          className="small"
        >
          Reset
        </button>
      </div>

      {/* Todo list */}
      <ul className="todo-list">
        {visibleTodos.length === 0 && (
          <li className="empty">No tasks found.</li>
        )}

        {visibleTodos.map((t) => (
          <li key={t.id} className={`todo-item ${t.completed ? "completed" : ""} priority-${t.priority}`}>
            <div className="left">
              <input
                type="checkbox"
                checked={t.completed}
                onChange={() => toggleComplete(t.id)}
                aria-label={`Mark ${t.text} as completed`}
              />
            </div>

            <div className="middle">
              <div className="todo-text">{t.text}</div>
              <div className="meta">
                <span className="time">{formatTime(t.time)}</span>
                <span className="prio">• {priorityLabel(t.priority)}</span>
              </div>
            </div>

            <div className="right">
              <button onClick={() => startEdit(t.id)} className="icon-btn">✏️</button>
              <button onClick={() => deleteTask(t.id)} className="icon-btn danger">🗑️</button>
            </div>
          </li>
        ))}
      </ul>

      {/* Footer small tips */}
      <div className="footer">Tip: Press Enter to add/update. Theme & tasks are saved in browser storage.</div>
    </div>
  );
}

export default TodoList;
