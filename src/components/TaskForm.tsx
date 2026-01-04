import { useState } from "react";
import type { ChangeEvent } from "react";
import { supabase } from "../supabase-client";
import type { Session } from "@supabase/supabase-js";

interface TaskFormProps {
  onTaskAdded: () => void;
  session: Session;
}

function TaskForm({ onTaskAdded, session }: TaskFormProps) {
  const [newTask, setNewTask] = useState({ title: "", description: "" });
  const [taskImage, setTaskImage] = useState<File | null>(null);

  const uploadImage = async (file: File): Promise<string | null> => {
    const filePath = `${file.name}-${Date.now()}`;
    const { error } = await supabase.storage
      .from("tasks-images")
      .upload(filePath, file);

    if (error) {
      console.error("Erorr uploading image:", error.message);
      return null;
    }

    const { data } = await supabase.storage
      .from("tasks-images")
      .getPublicUrl(filePath);
    return data.publicUrl;
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();

    let imageUrl: string | null = null;
    if (taskImage) {
      imageUrl = await uploadImage(taskImage);
    }

    const { error } = await supabase
      .from("tasks")
      .insert({ ...newTask, email: session.user.email, image_url: imageUrl });

    if (error) {
      console.error("Error adding task:", error.message);
    } else {
      setNewTask({ title: "", description: "" });
      // Refetch tasks after successful addition
      onTaskAdded();
    }
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setTaskImage(e.target.files[0]);
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

      <input type="file" accept="image/*" onChange={handleFileChange} />

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
