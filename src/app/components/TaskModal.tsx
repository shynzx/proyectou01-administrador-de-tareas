import { FaTimes } from "react-icons/fa";
import { useState, useEffect } from "react";
import { createPortal } from "react-dom";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (title: string, description: string) => void;
}

const TaskModal: React.FC<ModalProps> = ({ isOpen, onClose, onSubmit }) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return; // Evita enviar tareas vacías

    onSubmit(title.trim(), description.trim());
    setTitle("");
    setDescription("");
    onClose();
  };

  if (!isOpen) return null;

  return createPortal(
    <div
      className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 animate-fadeIn"
      onClick={onClose} // Cierra al hacer clic fuera
    >
      <div
        className="bg-slate-800 p-6 rounded-lg w-full max-w-lg shadow-xl"
        onClick={(e) => e.stopPropagation()} // Evita cerrar si hace clic dentro
      >
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-white">Nueva Tarea</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-white">
            <FaTimes />
          </button>
        </div>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSubmit(e)}
            className="w-full p-2 mb-3 bg-slate-700 rounded text-white placeholder-gray-400 outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Título de la tarea"
            required
          />
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full p-2 mb-4 bg-slate-700 rounded text-white placeholder-gray-400 outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Descripción (opcional)"
          />
          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded transition-all transform hover:scale-105 shadow-md"
          >
            Agregar Tarea
          </button>
        </form>
      </div>
    </div>,
    document.body
  );
};

export default TaskModal;
