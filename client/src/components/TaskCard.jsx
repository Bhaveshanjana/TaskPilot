import React from "react";
import { Edit, Trash2 } from "lucide-react";

export default function TaskCard({ task, onEdit, onDelete }) {
  const getStatusColor = (status) => {
    switch (status) {
      case "Completed":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200";
      case "In Progress":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200";
      default:
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200";
    }
  };

  return (
    <li className="cursor-pointer p-6 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
      <div className="flex justify-between items-start">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white">
              Task's Title: {task.title}
            </h3>
            <span
              className={`text-xs px-2 py-1 rounded-full ${getStatusColor(
                task.status
              )}`}
            >
              {task.status}
            </span>
          </div>
          <p className="text-gray-600 dark:text-gray-300 mb-3">
            Task's Description: {task.description}
          </p>
          <div className="text-sm text-gray-500 dark:text-gray-400">
            <p>Created: {new Date(task.dateOfCreation).toLocaleDateString()}</p>
            {task.dateOfCompletion && (
              <p>
                Completed:{" "}
                {new Date(task.dateOfCompletion).toLocaleDateString()}
              </p>
            )}
          </div>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => onEdit(task)}
            className="cursor-pointer p-2 text-gray-500 hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-400"
          >
            <Edit size={18} />
          </button>
          <button
            onClick={() => onDelete(task)}
            className="cursor-pointer p-2 text-gray-500 hover:text-red-600 dark:text-gray-400 dark:hover:text-red-400"
          >
            <Trash2 size={18} />
          </button>
        </div>
      </div>
    </li>
  );
}
