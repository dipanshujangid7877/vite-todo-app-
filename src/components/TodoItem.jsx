import { useState } from "react";

const TodoItem = ({ task, toggleComplete, deleteTask, editTask }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [newText, setNewText] = useState(task.text);

  const handleEdit = () => {
    if (isEditing && newText.trim()) editTask(task.id, newText);
    setIsEditing(!isEditing);
  };

  return (
    <li className={`task-item ${task.completed ? "completed" : ""}`}>
      {isEditing ? (
        <input
          type="text"
          value={newText}
          onChange={(e) => setNewText(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleEdit()}
        />
      ) : (
        <span onClick={() => toggleComplete(task.id)}>{task.text}</span>
      )}

      <div className="actions">
        <button onClick={handleEdit}>{isEditing ? "💾" : "✏️"}</button>
        <button onClick={() => deleteTask(task.id)}>🗑️</button>
      </div>
    </li>
  );
};

export default TodoItem;
