import { useEffect, useState } from "react";
import TaskManager from "./components/TaskManager";
import { Auth } from "./components/auth";
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

  useEffect(() => {
    const channel = supabase.channel("tasks-channel");
    channel
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "tasks" },
        (payload) => {
          console.log("INSERT event received:", payload);
          const newTask = payload.new as Task;
          setTasks((prevTasks) => [newTask, ...prevTasks]);
        }
      )
      .on(
        "postgres_changes",
        { event: "UPDATE", schema: "public", table: "tasks" },
        (payload) => {
          console.log("UPDATE event received:", payload);
          const updatedTask = payload.new as Task;
          setTasks((prevTasks) =>
            prevTasks.map((task) =>
              task.id === updatedTask.id ? updatedTask : task
            )
          );
        }
      )
      .on(
        "postgres_changes",
        { event: "DELETE", schema: "public", table: "tasks" },
        (payload) => {
          console.log("DELETE event received:", payload);
          const deletedTask = payload.old as Task;
          setTasks((prevTasks) =>
            prevTasks.filter((task) => task.id !== deletedTask.id)
          );
        }
      )
      .subscribe((status, err) => {
        console.log("Subscription status:", status);
        if (err) {
          console.error("Subscription error:", err);
        }
        if (status === "SUBSCRIBED") {
          console.log("Successfully subscribed to tasks channel!");
        }
      });

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  console.log(tasks);

  const [session, setSession] = useState<any>(null);

  const fetchSession = async () => {
    const currentSession = await supabase.auth.getSession();
    console.log(currentSession);
    setSession(currentSession.data.session);
  };

  useEffect(() => {
    fetchSession();

    const { data: authListener } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setSession(session);
      }
    );

    return () => {
      authListener?.subscription.unsubscribe();
    };
  }, []);

  const logout = async () => {
    await supabase.auth.signOut();
  };

  return (
    <>
      {session ? (
        <>
          <button onClick={logout}> Log Out</button>
          <TaskManager
            tasks={tasks}
            onTaskAdded={fetchTasks}
            onDeleteTask={deleteTask}
            onUpdateTask={updateTask}
            session={session}
          />
        </>
      ) : (
        <Auth />
      )}
    </>
  );
}

export default App;
