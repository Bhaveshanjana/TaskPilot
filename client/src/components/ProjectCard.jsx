import React from "react";
import TaskCard from "./TaskCard";
import { Trash2 } from "lucide-react";
import axios from "axios";
import { toast } from "react-toastify";

export default function ProjectCard({ project, onDelete, onEdit }) {
  const deleteProject = async (projectId) => {
    try {
      const res = await axios.delete(
        `${import.meta.env.VITE_BASE_URL}/projects/deletedproject/${projectId}`
      );
      toast.success(res.data.message);
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden mb-6">
      <h2 className="text-xl font-semibold p-3 border-b border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white flex justify-between">
        Project-Title: {project.projectTitle}
        <button
          onClick={() => deleteProject(project._id)}
          className="cursor-pointer p-2 text-gray-500 hover:text-red-600 dark:text-gray-400 dark:hover:text-red-400"
        >
          <Trash2 size={18} />
        </button>
      </h2>
      {project.tasks.length === 0 ? (
        <div className="p-6 text-center text-gray-500 dark:text-gray-400">
          No tasks yet. Click "Add New Task" to create one.
        </div>
      ) : (
        <ul className="divide-y divide-gray-200 dark:divide-gray-700">
          {project.tasks.map((task) => (
            <TaskCard
              key={task._id}
              task={task}
              onDelete={onDelete}
              onEdit={onEdit}
            />
          ))}
        </ul>
      )}
    </div>
  );
}
