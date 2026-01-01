import { useState } from "react";

interface Task {
  id: number;
  title: string;
  description: string;
}

interface TaskListProps {
  tasks: Task[];
  onDeleteTask: (id: number) => void;
  onUpdateTask: (id: number, description: string) => void;
}

function ListGroup({ tasks, onDeleteTask, onUpdateTask }: TaskListProps) {
  const [editDescriptions, setEditDescriptions] = useState<
    Record<number, string>
  >({});

  return (
    <div>
      <h2>Tasks ({tasks.length})</h2>
      {tasks.length === 0 ? (
        <p>No tasks yet. Add one above!</p>
      ) : (
        <ul style={{ listStyle: "none", padding: 0 }}>
          {tasks.map((task) => (
            <li
              key={task.id}
              style={{
                border: "1px solid #ccc",
                padding: "15px",
                marginBottom: "10px",
                borderRadius: "5px",
              }}
            >
              <div>
                <h3 style={{ margin: "0 0 10px 0" }}>{task.title}</h3>
                <p style={{ margin: 0, color: "#666" }}>{task.description}</p>
                <div>
                  <textarea
                    placeholder="Updated description..."
                    value={editDescriptions[task.id] ?? ""}
                    onChange={(e) =>
                      setEditDescriptions((prev) => ({
                        ...prev,
                        [task.id]: e.target.value,
                      }))
                    }
                  />
                  <button
                    style={{ padding: "10px 20px" }}
                    onClick={() => {
                      const descToUpdate =
                        editDescriptions[task.id] ?? task.description;
                      console.log(
                        "Updating task",
                        task.id,
                        "with description:",
                        descToUpdate
                      );
                      console.log("editDescriptions state:", editDescriptions);
                      onUpdateTask(task.id, descToUpdate);
                    }}
                  >
                    Update
                  </button>
                  <button
                    style={{ padding: "10px 20px" }}
                    onClick={() => onDeleteTask(task.id)}
                  >
                    Delete
                  </button>
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default ListGroup;
