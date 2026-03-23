import { useEffect, useState } from "react";
import axios from "axios";
import DarkMode from "../components/theme/DarkMode";
import TaskForm from "./TaskForm";
import ProjectList from "./ProjectList";
import { Plus } from "lucide-react";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { useOrganization } from "../context/OrganizationContext";
import NotificationBell from "./NotificationBell";

export default function TaskManager() {
  const [projects, setProjects] = useState([]);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

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
        await axios.get(
        `${import.meta.env.VITE_BASE_URL}/users/logout`,
      );
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
            <NotificationBell />
            <button
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="flex items-center gap-2 bg-gray-200 dark:bg-gray-700 px-3 py-1 rounded-md cursor-pointer"
            >
              <span className="text-sm text-gray-800 dark:text-white">
                Menu
              </span>
            </button>

            {isDropdownOpen && (
              <div className="absolute right-0 mt-2 w-60 bg-white dark:bg-gray-800 shadow-lg rounded-md border dark:border-gray-700 z-50">
                {/* Dark Mode */}
                <div className="p-3 border-b dark:border-gray-700">
                  <DarkMode />
                </div>

                {/* Organization List */}
                <div className="p-3 border-b dark:border-gray-700">
                  <p className="text-xs text-gray-500 mb-2">Organizations</p>

                  {loading ? (
                    <p className="text-sm text-gray-400">Loading...</p>
                  ) : (
                    organizations.map((org) => (
                      <button
                        key={org._id}
                        onClick={() => {
                          setCurrentOrganization(org);
                          setIsDropdownOpen(false);
                        }}
                        className={`block w-full text-left px-2 py-1 rounded hover:bg-gray-100 dark:hover:bg-gray-700 text-sm ${
                          currentOrganization?._id === org._id
                            ? "font-semibold text-blue-600"
                            : ""
                        }`}
                      >
                        {org.name}
                      </button>
                    ))
                  )}
                </div>

                {/* Logout */}
                <div className="p-3">
                  <button
                    onClick={handleLogOut}
                    className="w-full text-left text-red-500 hover:bg-gray-100 dark:hover:bg-gray-700 px-2 py-1 rounded text-sm"
                  >
                    Logout
                  </button>
                </div>
              </div>
            )}
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
