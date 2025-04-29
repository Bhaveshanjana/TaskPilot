import { useState, useEffect } from "react";
import axios from "axios";
import { Sun, Moon, Plus, Trash2, Edit, Check, X } from "lucide-react";

// Define task status options
const STATUS_OPTIONS = ["Pending", "In Progress", "Completed"];

export default function TaskManager() {
  const [project, setProject] = useState("");
  // Initialize theme state from localStorage or default to light
  const [darkMode, setDarkMode] = useState(() => {
    const savedTheme = localStorage.getItem("theme");
    return savedTheme === "dark";
  });

  // Tasks state with sample data
  const [tasks, setTasks] = useState(() => {
    const savedTasks = localStorage.getItem("tasks");
    return savedTasks
      ? JSON.parse(savedTasks)
      : [
          {
            id: 1,
            title: "Create project plan",
            description:
              "Draft the initial project plan with timeline and resources",
            status: "Completed",
            creationDate: "2025-04-20",
            completionDate: "2025-04-25",
          },
          {
            id: 2,
            title: "Schedule team meeting",
            description: "Set up a meeting to discuss project requirements",
            status: "In Progress",
            creationDate: "2025-04-24",
            completionDate: null,
          },
        ];
  });

  // State for new task form
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    status: "Pending",
  });

  // State for task editing
  const [editingTask, setEditingTask] = useState(null);

  // Save tasks to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem("tasks", JSON.stringify(tasks));
  }, [tasks]);

  // Save theme to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem("theme", darkMode ? "dark" : "light");
    // Apply dark mode class to document
    if (darkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [darkMode]);

  // Handle theme toggle
  const toggleTheme = () => {
    setDarkMode(!darkMode);
  };

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  // Create new task
  const createTask = (e) => {
    e.preventDefault();

    const newTask = {
      id: Date.now(),
      ...formData,
      creationDate: new Date().toISOString().split("T")[0],
      completionDate:
        formData.status === "Completed"
          ? new Date().toISOString().split("T")[0]
          : null,
    };

    setTasks([...tasks, newTask]);
    setFormData({ title: "", description: "", status: "Pending" });
    setIsFormOpen(false);
  };

  // Start editing a task
  const startEdit = (task) => {
    setEditingTask(task.id);
    setFormData({
      title: task.title,
      description: task.description,
      status: task.status,
    });
    setIsFormOpen(true);
  };

  // Update existing task
  const updateTask = (e) => {
    e.preventDefault();

    setTasks(
      tasks.map((task) => {
        if (task.id === editingTask) {
          const wasCompleted = task.status === "Completed";
          const isNowCompleted = formData.status === "Completed";

          return {
            ...task,
            ...formData,
            // Set completion date if newly completed
            completionDate:
              !wasCompleted && isNowCompleted
                ? new Date().toISOString().split("T")[0]
                : isNowCompleted
                ? task.completionDate
                : null,
          };
        }
        return task;
      })
    );

    setEditingTask(null);
    setFormData({ title: "", description: "", status: "Pending" });
    setIsFormOpen(false);
  };

  // Delete a task
  const deleteTask = (id) => {
    setTasks(tasks.filter((task) => task.id !== id));
  };

  // Cancel form
  const cancelForm = () => {
    setFormData({ title: "", description: "", status: "Pending" });
    setIsFormOpen(false);
    setEditingTask(null);
  };

  // Get task status badge color
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

  useEffect(() => {
    try {
      const getAllProjects = async () => {
        const res = await axios.get(
          `${import.meta.env.VITE_BASE_URL}/projects/getallproject`
        );
        setProject(res.data);
        // console.log(res);
      };
      getAllProjects();
    } catch (error) {
      console.log(error);
    }
  });

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-200">
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 shadow-sm">
        <div className="container mx-auto px-4 py-6 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            TaskPilot
          </h1>
          <button
            onClick={toggleTheme}
            className="p-2 rounded-full bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
            aria-label="Toggle theme"
          >
            {darkMode ? <Sun size={20} /> : <Moon size={20} />}
          </button>
        </div>
      </header>

      {/* Main content */}
      <main className="container mx-auto px-4 py-8">
        {/* Add Task Button */}
        <div className="mb-6 flex justify-end">
          <button
            onClick={() => setIsFormOpen(true)}
            disabled={isFormOpen}
            className={`flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors
              ${isFormOpen ? "opacity-50 cursor-not-allowed" : ""}`}
          >
            <Plus size={16} />
            Add New Task
          </button>
        </div>

        {/* Task Form */}
        {isFormOpen && (
          <div className="mb-8 bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">
              {editingTask ? "Edit Task" : "Create New Task"}
            </h2>
            <form onSubmit={editingTask ? updateTask : createTask}>
              <div className="mb-4">
                <label
                  htmlFor="title"
                  className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                >
                  Title
                </label>
                <input
                  type="text"
                  id="title"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md 
                    focus:outline-none focus:ring-2 focus:ring-blue-500 
                    bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
              </div>

              <div className="mb-4">
                <label
                  htmlFor="description"
                  className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                >
                  Description
                </label>
                <textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  rows="3"
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md 
                    focus:outline-none focus:ring-2 focus:ring-blue-500 
                    bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                ></textarea>
              </div>

              <div className="mb-4">
                <label
                  htmlFor="status"
                  className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                >
                  Status
                </label>
                <select
                  id="status"
                  name="status"
                  value={formData.status}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md 
                    focus:outline-none focus:ring-2 focus:ring-blue-500 
                    bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                >
                  {STATUS_OPTIONS.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={cancelForm}
                  className="px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 
                    rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 
                    focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  {editingTask ? "Update Task" : "Create Task"}
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Tasks List */}
        {project?.project?.map((proj) => (
          <div
            key={proj._id}
            className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden mb-6"
          >
            <h2 className="text-xl font-semibold p-6 border-b border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white">
              Project-Title: {proj.projectTitle}
            </h2>

            {proj.tasks.length === 0 ? (
              <div className="p-6 text-center text-gray-500 dark:text-gray-400">
                No tasks yet. Click "Add New Task" to create one.
              </div>
            ) : (
              <ul className="divide-y divide-gray-200 dark:divide-gray-700">
                {proj.tasks.map((task) => (
                  <li
                    key={task._id}
                    className="p-6 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                  >
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
                          <p>
                            Created:{" "}
                            {new Date(task.dateOfCreation).toLocaleDateString()}
                          </p>
                          {task.dateOfCompletion && (
                            <p>
                              Completed:{" "}
                              {new Date(
                                task.dateOfCompletion
                              ).toLocaleDateString()}
                            </p>
                          )}
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() => startEdit(task, proj._id)}
                          className="p-2 text-gray-500 hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-400"
                        >
                          <Edit size={18} />
                        </button>
                        <button
                          onClick={() => deleteTask(task._id, proj._id)}
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
        ))}
      </main>
    </div>
  );
}
