import { useState } from "react";
import { FaEdit } from "react-icons/fa";
import { MdDelete } from "react-icons/md";
import EditTaskModal from "./EditModal";

interface Task {
  id: number;
  title: string;
  description: string;
  completed: boolean;
}

interface TaskListProps {
  tasks: Task[];
  onEditTask: (id: number, updatedTitle: string, updatedDescription: string) => void;
  onDeleteTask: (id: number) => void;
  onToggleComplete: (id: number) => void;
}

const TaskList: React.FC<TaskListProps> = ({ tasks, onEditTask, onDeleteTask, onToggleComplete }) => {
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);

  const handleEditClick = (task: Task) => setSelectedTask(task);

  const handleSaveEdit = (updatedTitle: string, updatedDescription: string) => {
    if (selectedTask) {
      onEditTask(selectedTask.id, updatedTitle, updatedDescription);
      setSelectedTask(null);
    }
  };

  return (
    <>
      {tasks.map((task) => (
        <tr
          key={task.id}
          className={`border-b border-gray-300 dark:border-gray-700 transition-colors ${
            task.completed ? "line-through text-gray-500 opacity-50" : "hover:bg-gray-100 dark:hover:bg-gray-800"
          }`}
        >
          <td className="py-3 px-4 text-center">
            <input
              type="checkbox"
              checked={task.completed}
              onChange={() => onToggleComplete(task.id)}
              onKeyDown={(e) => e.key === "Enter" && onToggleComplete(task.id)}
              className="cursor-pointer w-5 h-5"
            />
          </td>
          <td className="py-3 px-4">{task.title}</td>
          <td className="py-3 px-4">{task.description}</td>
          <td className="py-3 px-4 flex gap-3 justify-center">
            <button
              title="Editar tarea"
              className="p-2 bg-blue-600 hover:bg-blue-700 text-white rounded transition-all transform hover:scale-105 shadow-md"
              onClick={() => handleEditClick(task)}
            >
              <FaEdit />
            </button>
            <button
              title="Eliminar tarea"
              className="p-2 bg-red-600 hover:bg-red-700 text-white rounded transition-all transform hover:scale-105 shadow-md"
              onClick={() => onDeleteTask(task.id)}
            >
              <MdDelete />
            </button>
          </td>
        </tr>
      ))}

      {selectedTask && (
        <EditTaskModal
          isOpen={!!selectedTask}
          onClose={() => setSelectedTask(null)}
          task={selectedTask}
          onSave={handleSaveEdit}
        />
      )}
    </>
  );
};

export default TaskList;
