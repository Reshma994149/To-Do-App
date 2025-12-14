
import { useState, useEffect } from "react";

const TodoApp = () => {
  const [tasks, setTasks] = useState([]);
  const [text, setText] = useState("");
  const [filter, setFilter] = useState("all");
  const [editId, setEditId] = useState(null);

  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem("tasks"));
    if (stored) setTasks(stored);
  }, []);

  useEffect(() => {
    localStorage.setItem("tasks", JSON.stringify(tasks));
  }, [tasks]);

  const addTask = () => {
    if (!text.trim()) return;

    if (editId !== null) {
      setTasks(tasks.map(t =>
        t.id === editId ? { ...t, text } : t
      ));
      setEditId(null);
    } else {
      setTasks([...tasks, { id: Date.now(), text, completed: false }]);
    }
    setText("");
  };

  const deleteTask = (id) => {
    setTasks(tasks.filter(t => t.id !== id));
  };

  const toggleTask = (id) => {
    setTasks(tasks.map(t =>
      t.id === id ? { ...t, completed: !t.completed } : t
    ));
  };

  const editTask = (task) => {
    setText(task.text);
    setEditId(task.id);
  };

  const filteredTasks = tasks.filter(task => {
    if (filter === "active") return !task.completed;
    if (filter === "completed") return task.completed;
    return true;
  });

  return (
    <div className="container">
      <h1>To-Do List</h1>

      <div className="input-group">
        <input
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Enter task..."
        />
        <button className="add-btn" onClick={addTask}>
          {editId ? "Update" : "Add"}
        </button>
      </div>

      <div className="filters">
        <button onClick={() => setFilter("all")} className={filter === "all" ? "active" : ""}>All</button>
        <button onClick={() => setFilter("active")} className={filter === "active" ? "active" : ""}>Active</button>
        <button onClick={() => setFilter("completed")} className={filter === "completed" ? "active" : ""}>Completed</button>
      </div>

      {filteredTasks.length === 0 ? (
        <p className="no-task">No Tasks Available</p>
      ) : (
        filteredTasks.map(task => (
          <div key={task.id} className={`todo ${task.completed ? "completed" : ""}`}>
            <span>{task.text}</span>
            <div className="todo-actions">
              <button onClick={() => toggleTask(task.id)}>
                {task.completed ? "Undo" : "Done"}
              </button>
              <button onClick={() => editTask(task)}>Edit</button>
              <button onClick={() => deleteTask(task.id)}>Delete</button>
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default TodoApp;
