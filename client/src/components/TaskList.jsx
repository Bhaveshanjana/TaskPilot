import React from "react";

const TaskList = () => {
  return (
    <div>
      {/* Tasks List */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
        <h2 className="text-xl font-semibold p-6 border-b border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white">
          My Tasks
        </h2>

        {tasks.length === 0 ? (
          <div className="p-6 text-center text-gray-500 dark:text-gray-400">
            No tasks yet. Click "Add New Task" to create one.
          </div>
        ) : (
          <ul className="divide-y divide-gray-200 dark:divide-gray-700">
            {tasks.map((task) => (
              <li
                key={task.id}
                className="p-6 hover:bg-gray-50 dark:hover:bg-gray-750 transition-colors"
              >
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                        {task.title}
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
                      {task.description}
                    </p>
                    <div className="text-sm text-gray-500 dark:text-gray-400">
                      <p>Created: {task.creationDate}</p>
                      {task.completionDate && (
                        <p>Completed: {task.completionDate}</p>
                      )}
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => startEdit(task)}
                      className="p-2 text-gray-500 hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-400"
                    >
                      <Edit size={18} />
                    </button>
                    <button
                      onClick={() => deleteTask(task.id)}
                      className="p-2 text-gray-500 hover:text-red-600 dark:text-gray-400 dark:hover:text-red-400"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default TaskList;
