"use client";

import { useState, useEffect } from "react";

export default function TodoPage() {
  const [todos, setTodos] = useState([]);
  const [task, setTask] = useState("");

  // Load todos on page load
  useEffect(() => {
    fetchTodos();
  }, []);

  // Fetch all todos from API
  const fetchTodos = async () => {
    try {
      const res = await fetch("/api/todo");
      const data = await res.json();
      setTodos(data);
    } catch (err) {
      console.error("Failed to fetch todos:", err);
    }
  };

  // Add a new todo
  const addTodo = async () => {
    if (!task) return;
    try {
      await fetch("/api/todo", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title: task }),
      });
      setTask("");
      fetchTodos(); // refresh list
    } catch (err) {
      console.error("Failed to add todo:", err);
    }
  };

  return (
    <div className="p-5 max-w-md mx-auto">
      <h1 className="text-2xl font-bold mb-4">Todo App</h1>

      {/* Add new todo */}
      <div className="flex mb-4">
        <input
          className="flex-1 border p-2 mr-2"
          value={task}
          onChange={(e) => setTask(e.target.value)}
          placeholder="Enter a todo..."
        />
        <button className="bg-blue-500 text-white px-4" onClick={addTodo}>
          Add
        </button>
      </div>

      {/* Todo list */}
      <ul>
        {todos.map((todo) => (
          <li key={todo.id} className="mb-2 border-b pb-1">
            {todo.title}
          </li>
        ))}
      </ul>
    </div>
  );
}
