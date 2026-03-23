import { useEffect, useState } from "react";
import axios from "axios";
import DarkMode from "../components/theme/DarkMode";
import TaskForm from "./TaskForm";
import ProjectList from "./ProjectList";
import { LogOut, Plus } from "lucide-react";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { useOrganization } from "../context/OrganizationContext";
import NotificationBell from "./NotificationBell";
import { AnimatePresence, motion } from "motion/react";

export default function TaskManager() {
  const [projects, setProjects] = useState([]);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [isOpen, setIsOpen] = useState(false);

  const navigate = useNavigate();
  const {
    organizations,
    currentOrganization,
    setCurrentOrganization,
    loading,
  } = useOrganization();

  const [formData, setFormData] = useState({
    projectTitle: "",
    title: "",
    description: "",
    status: "To Do",
    datOfcompletion: "",
    priority: "Medium",
    assignee: null,
    dueDate: "",
  });

  // Get all project's
  const fetchProjects = async () => {
    if (!currentOrganization) return;
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_BASE_URL}/projects/getallproject/${currentOrganization._id}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        },
      );
      setProjects(res.data.project);
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    fetchProjects();
  }, [currentOrganization]);

  const handleCreateOrUpdate = async (e) => {
    e.preventDefault();
    try {
      if (editingTask) {
        const res = await axios.put(
          `${
            import.meta.env.VITE_BASE_URL
          }/projects/updateproject/${editingTask}`,
          formData,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          },
        );
        toast.success(res.data.message);
      } else {
        const dataToSend = {
          projectTitle: formData.projectTitle,
          organizationId: currentOrganization._id,
          task: {
            title: formData.title,
            description: formData.description,
            status: formData.status,
            dateOfcreation: new Date().toISOString(),
            datOfcompletion: "",
            priority: formData.priority,
            assignee: formData.assignee,
            dueDate: formData.dueDate,
          },
        };
        console.log("duedate", dataToSend);

        await axios.post(
          `${import.meta.env.VITE_BASE_URL}/projects/createproject`,
          dataToSend,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          },
        );
        toast.success("Project created successfully");
      }

      setIsFormOpen(false);
      setEditingTask(null);
      setFormData({
        title: "",
        description: "",
        status: "To Do",
        projectTitle: "",
        dateOfcompletion: "",
        priority: "Medium",
        assignee: "",
        dueDate: "",
      });
    } catch (error) {
      console.log(error.response.data.message);
    }
  };

  const handleDelete = async (task) => {
    try {
      const res = await axios.delete(
        `${import.meta.env.VITE_BASE_URL}/projects/${task._id}`,
      );
      toast.success(res.data.message);
    } catch (error) {
      console.log(error);
    }
  };

  const handleEdit = (task) => {
    setEditingTask(task._id);
    setIsFormOpen(true);
    setFormData({
      title: task.title,
      description: task.description,
      status: task.status,
      projectTitle: "", // Uneditable during edit
      dateOfcompletion: task.dateOfcompletion || "",
      priority: task.priority,
      assignee: task.assignee?._id,
      dueDate: task.dueDate,
    });
  };

  const handleCancel = () => {
    setIsFormOpen(false);
    setEditingTask(null);
    setFormData({
      title: "",
      description: "",
      status: "To Do",
      projectTitle: "",
      priority: "Medium",
      assignee: "",
      dueDate: "",
    });
  };

  const handleLogOut = async () => {
    try {
      await axios.get(`${import.meta.env.VITE_BASE_URL}/users/logout`);
      localStorage.removeItem("token");
      navigate("/login");
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-200">
      <header className="bg-white dark:bg-gray-800 shadow-sm">
        <div className="container mx-auto px-4 p-3 flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              TaskPilot
            </h1>
          </div>
          <div className="relative">
            <div className="flex items-center gap-2">
              {/* Notificationbell */}
              <NotificationBell />

              {/* Menu icons */}
              <button
                onClick={() => setIsOpen(!isOpen)}
                className="flex items-center justify-center w-8 h-8 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-md transition-all duration-300 cursor-pointer"
              >
                <div className="relative w-6 h-6">
                  {/* Top Line */}
                  <motion.span
                    className="absolute left-1 top-1 w-4 h-0.5 bg-black dark:bg-gray-300"
                    animate={{
                      rotate: isOpen ? 45 : 0,
                      y: isOpen ? 8 : 0,
                    }}
                    transition={{ duration: 0.3 }}
                  />

                  {/* Middle Line */}
                  <motion.span
                    className="absolute left-1 top-3 w-4 h-0.5 bg-black dark:bg-gray-300"
                    animate={{
                      opacity: isOpen ? 0 : 1,
                    }}
                    transition={{ duration: 0.2 }}
                  />

                  {/* Bottom Line */}
                  <motion.span
                    className="absolute left-1 top-5 w-4 h-0.5 bg-black dark:bg-gray-300"
                    animate={{
                      rotate: isOpen ? -45 : 0,
                      y: isOpen ? -8 : 0,
                    }}
                    transition={{ duration: 0.3 }}
                  />
                </div>
              </button>
            </div>

            <AnimatePresence>
              {isOpen && (
                <motion.div
                  initial={{ opacity: 0, y: -10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -10, scale: 0.95 }}
                  transition={{ duration: 0.2 }}
                  className="absolute right-0 mt-4 w-64 bg-white dark:bg-gray-800 shadow-xl rounded-xl border dark:border-gray-700 z-50 overflow-hidden"
                >
                  {/* Dark Mode */}
                  <div className="px-4 py-3 border-b dark:border-gray-700">
                    <DarkMode />
                  </div>

                  {/* Organization List */}
                  <div className="px-4 py-3 border-b dark:border-gray-700">
                    <p className="text-xs font-medium text-gray-400 uppercase tracking-wide mb-3">
                      Organizations
                    </p>

                    {loading ? (
                      <div className="space-y-2">
                        <div className="h-3 w-3/4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
                        <div className="h-3 w-1/2 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
                      </div>
                    ) : (
                      <div className="space-y-1">
                        {organizations.map((org) => (
                          <motion.button
                            key={org._id}
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={() => {
                              setCurrentOrganization(org);
                              setIsOpen(false);
                            }}
                            className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm transition-all ${
                              currentOrganization?._id === org._id
                                ? "bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-300 font-medium"
                                : "hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-200"
                            }`}
                          >
                            {org.name}

                            {currentOrganization?._id === org._id && (
                              <span className="text-xs">✓</span>
                            )}
                          </motion.button>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Logout */}
                  <div className="px-4 py-3">
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.97 }}
                      onClick={handleLogOut}
                      className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-red-500 hover:bg-red-50 dark:hover:bg-red-900/30 transition cursor-pointer"
                    >
                      <span>
                        <LogOut className="size-4"/>
                      </span>
                      Logout
                    </motion.button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="mb-6 flex justify-end">
          <button
            onClick={() => setIsFormOpen(true)}
            disabled={isFormOpen}
            className={`cursor-pointer flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors ${
              isFormOpen ? "opacity-50 cursor-not-allowed" : ""
            }`}
          >
            <Plus size={16} />
            Add New Task
          </button>
        </div>

        {isFormOpen && (
          <TaskForm
            teamMembers={currentOrganization?.members}
            formData={formData}
            setFormData={setFormData}
            isEditing={!!editingTask}
            onCancel={handleCancel}
            onSubmit={handleCreateOrUpdate}
          />
        )}

        <ProjectList
          projects={projects}
          onDelete={handleDelete}
          onEdit={handleEdit}
          onStatusChange={fetchProjects}
        />
      </main>
    </div>
  );
}
