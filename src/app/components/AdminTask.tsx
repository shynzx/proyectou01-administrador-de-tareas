"use client";
import { useEffect, useState } from "react";
import { FaPlus } from "react-icons/fa";
import TaskList from "./ListTask";
import TaskModal from "./TaskModal";

interface Task {
  id: number;
  title: string;
  description: string;
  completed: boolean;
}

const STORAGE_KEY = "AdminTask";

const AdminTask: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [nextId, setNextId] = useState(1);
  const [filter, setFilter] = useState<"all" | "active" | "completed">("all");

  useEffect(() => {
    const savedTasks = localStorage.getItem(STORAGE_KEY);
    if (savedTasks) {
      try {
        const parsedTasks: Task[] = JSON.parse(savedTasks);
        setTasks(parsedTasks);
        const maxId = parsedTasks.reduce((max, task) => Math.max(max, task.id), 0);
        setNextId(maxId + 1);
      } catch (error) {
        console.error("Error al cargar las tareas:", error);
      }
    }
  }, []);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
  }, [tasks]);

  const handleAddTask = (title: string, description: string) => {
    const newTask = { id: nextId, title, description, completed: false };
    setTasks([...tasks, newTask]);
    setNextId(nextId + 1);
  };

  const handleEditTask = (id: number, updatedTitle: string, updatedDescription: string) => {
    setTasks(tasks.map((task) =>
      task.id === id ? { ...task, title: updatedTitle, description: updatedDescription } : task
    ));
  };

  const handleDeleteTask = (id: number) => {
    setTasks(tasks.filter((task) => task.id !== id));
  };

  const handleToggleComplete = (id: number) => {
    setTasks(tasks.map((task) =>
      task.id === id ? { ...task, completed: !task.completed } : task
    ));
  };

  const filteredTasks = tasks.filter((task) => {
    if (filter === "active") return !task.completed;
    if (filter === "completed") return task.completed;
    return true;
  });

  return (
    <div className="p-6 min-h-screen bg-gray-900 text-white flex flex-col items-center">
      {/* Título */}
      <div className="bg-gray-800 text-white p-4 rounded-lg shadow-lg w-full max-w-4xl">
        <h1 className="text-3xl font-bold text-center">Administrador de Tareas</h1>
      </div>

      {/* Botón de Crear y Filtros */}
      <div className="flex flex-col md:flex-row justify-between items-center w-full max-w-4xl mt-4">
        <button 
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white py-2 px-6 rounded-lg transition-all transform hover:scale-105 shadow-md"
          onClick={() => setIsModalOpen(true)}
        >
          <FaPlus /> Crear Tarea
        </button>

        <div className="flex gap-2 mt-3 md:mt-0">
          {["all", "active", "completed"].map((type) => (
            <button
              key={type}
              className={`px-4 py-2 rounded-lg transition-all transform hover:scale-105 shadow-md ${
                filter === type ? "bg-blue-600 text-white" : "bg-gray-700 hover:bg-gray-600"
              }`}
              onClick={() => setFilter(type as "all" | "active" | "completed")}
            >
              {type === "all" ? "Todas" : type === "active" ? "Pendientes" : "Completadas"}
            </button>
          ))}
        </div>
      </div>

      {/* Tabla de Tareas */}
      <div className="w-full max-w-4xl mt-6 bg-gray-800 shadow-lg rounded-lg overflow-hidden">
        <table className="table-auto w-full text-left">
          <thead className="bg-gray-700 text-white">
            <tr>
              <th className="py-3 px-4">Estado</th>
              <th className="py-3 px-4">Tarea</th>
              <th className="py-3 px-4">Descripción</th>
              <th className="py-3 px-4">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-700">
            <TaskList
              tasks={filteredTasks}
              onEditTask={handleEditTask}
              onDeleteTask={handleDeleteTask}
              onToggleComplete={handleToggleComplete}
            />
          </tbody>
        </table>
      </div>

      {/* Modal para agregar tareas */}
      <TaskModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleAddTask}
      />
    </div>
  );
};

export default AdminTask;
