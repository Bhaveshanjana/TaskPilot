import React from "react";
import TaskCard from "./TaskCard";

export default function ProjectCard({ project, onDelete, onEdit }) {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden mb-6">
      <h2 className="text-xl font-semibold p-6 border-b border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white">
        Project-Title: {project.projectTitle}
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
