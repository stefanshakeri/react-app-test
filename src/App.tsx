import { useEffect, useState } from "react";
import TaskForm from "./components/TaskForm";
import ListGroup from "./components/ListGroup";
import { supabase } from "./supabase-client";

interface Task {
  id: number;
  title: string;
  description: string;
}

function App() {
  const [tasks, setTasks] = useState<Task[]>([]);

  const fetchTasks = async () => {
    // fetch tasks from supabase
    const { error, data } = await supabase
      .from("tasks")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching tasks:", error.message);
    } else {
      setTasks(data);
    }
  };

  const deleteTask = async (id: number) => {
    const { error } = await supabase.from("tasks").delete().eq("id", id);

    if (error) {
      console.error("Error deleting task:", error.message);
    } else {
      // Refetch tasks after successful deletion
      await fetchTasks();
    }
  };

  const updateTask = async (id: number, description: string) => {
    const { error } = await supabase
      .from("tasks")
      .update({ description })
      .eq("id", id);

    if (error) {
      console.error("Error updating task:", error.message);
    } else {
      // Refetch tasks after successful deletion
      await fetchTasks();
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  console.log(tasks);

  return (
    <div style={{ padding: "20px", maxWidth: "600px", margin: "0 auto" }}>
      <h1>Task Manager</h1>
      <TaskForm onTaskAdded={fetchTasks} />

      <ListGroup
        tasks={tasks}
        onDeleteTask={deleteTask}
        onUpdateTask={updateTask}
      />
    </div>
  );
}

export default App;
