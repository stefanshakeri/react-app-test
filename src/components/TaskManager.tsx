import TaskForm from "./TaskForm";
import ListGroup from "./ListGroup";

interface Task {
  id: number;
  title: string;
  description: string;
}

interface TaskManagerProps {
  tasks: Task[];
  onTaskAdded: () => void;
  onDeleteTask: (id: number) => void;
  onUpdateTask: (id: number, description: string) => void;
}

function TaskManager({ tasks, onTaskAdded, onDeleteTask, onUpdateTask }: TaskManagerProps) {
  return (
    <div style={{ padding: "20px", maxWidth: "600px", margin: "0 auto" }}>
      <h1>Task Manager</h1>
      <TaskForm onTaskAdded={onTaskAdded} />
      <ListGroup
        tasks={tasks}
        onDeleteTask={onDeleteTask}
        onUpdateTask={onUpdateTask}
      />
    </div>
  );
}

export default TaskManager;