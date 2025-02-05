import { useState, useEffect } from "react";
import { createPortal } from "react-dom";

interface EditTaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  task: { id: number; title: string; description: string };
  onSave: (updatedTitle: string, updatedDescription: string) => void;
}

const EditTaskModal: React.FC<EditTaskModalProps> = ({ isOpen, onClose, task, onSave }) => {
  const [title, setTitle] = useState(task.title);
  const [description, setDescription] = useState(task.description);

  useEffect(() => {
    setTitle(task.title);
    setDescription(task.description);
  }, [task]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  const handleSave = () => {
    if (!title.trim()) return;
    onSave(title.trim(), description.trim());
    onClose();
  };

  if (!isOpen) return null;

  return createPortal(
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 animate-fadeIn">
      <div className="bg-slate-800 p-6 rounded-lg w-full max-w-lg shadow-xl">
        <h2 className="text-xl font-bold text-white mb-4">Editar Tarea</h2>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSave()}
          className="w-full p-2 mb-3 bg-slate-700 rounded text-white placeholder-gray-400 outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Título de la tarea"
          required
        />
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="w-full p-2 mb-4 bg-slate-700 rounded text-white placeholder-gray-400 outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Añadir o editar descripción"
        />
        <div className="flex justify-end gap-2 mt-4">
          <button
            className="bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-4 rounded transition-all transform hover:scale-105 shadow-md"
            onClick={handleSave}
          >
            Guardar
          </button>
          <button
            className="bg-gray-600 hover:bg-gray-700 text-white font-semibold py-2 px-4 rounded transition-all transform hover:scale-105 shadow-md"
            onClick={onClose}
          >
            Cancelar
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
};

export default EditTaskModal;
