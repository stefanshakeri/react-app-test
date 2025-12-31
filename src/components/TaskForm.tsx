import { useState } from "react";
import { supabase } from "../supabase-client";
import type { Session } from "@supabase/supabase-js";

interface TaskFormProps {
  onTaskAdded: () => void;
  session: Session;
}

function TaskForm({ onTaskAdded, session }: TaskFormProps) {
  const [newTask, setNewTask] = useState({ title: "", description: "" });

  const handleSubmit = async (e: any) => {
    e.preventDefault();

    const { error } = await supabase
      .from("tasks")
      .insert({ ...newTask, email: session.user.email });

    if (error) {
      console.error("Error adding task:", error.message);
    } else {
      setNewTask({ title: "", description: "" });
      // Refetch tasks after successful addition
      onTaskAdded();
    }
  };

  return (
    <form onSubmit={handleSubmit} style={{ marginBottom: "30px" }}>
      <div style={{ marginBottom: "10px" }}>
        <input
          type="text"
          placeholder="Task Title"
          value={newTask.title}
          onChange={(e) =>
            setNewTask((prev) => ({ ...prev, title: e.target.value }))
          }
          style={{ width: "100%", padding: "10px", fontSize: "16px" }}
        />
      </div>
      <div style={{ marginBottom: "10px" }}>
        <textarea
          placeholder="Task Description"
          value={newTask.description}
          onChange={(e) =>
            setNewTask((prev) => ({ ...prev, description: e.target.value }))
          }
          style={{
            width: "100%",
            padding: "10px",
            fontSize: "16px",
            minHeight: "80px",
          }}
        />
      </div>

      <button
        type="submit"
        style={{ padding: "10px 20px", fontSize: "16px", cursor: "pointer" }}
      >
        Add Task
      </button>
    </form>
  );
}

export default TaskForm;
