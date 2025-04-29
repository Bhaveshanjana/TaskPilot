import { useEffect, useState } from "react";
import axios from "axios";
import DarkMode from "./DarkMode";
import TaskForm from "./TaskForm";
import ProjectList from "./ProjectList";
import { Plus } from "lucide-react";
import { toast } from "react-toastify";

export default function TaskManager() {
  const [projects, setProjects] = useState([]);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [formData, setFormData] = useState({
    projectTitle: "",
    title: "",
    description: "",
    status: "Pending",
  });

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_BASE_URL}/projects/getallproject`
        );
        setProjects(res.data.project);
      } catch (error) {
        console.log(error);
      }
    };
    fetchProjects();
  }, []);

  const handleCreateOrUpdate = async (e) => {
    e.preventDefault();
    try {
      if (editingTask) {
        const res = await axios.put(
          `${
            import.meta.env.VITE_BASE_URL
          }/projects/updateproject/${editingTask}`,
          formData
        );
        toast.success(res.data.message);
      } else {
        const dataToSend = {
          projectTitle: formData.projectTitle,
          task: {
            title: formData.title,
            description: formData.description,
            status: formData.status,
            dateOfcreation: new Date().toISOString(),
            datOfcompletion: "",
          },
        };
        const res = await axios.post(
          `${import.meta.env.VITE_BASE_URL}/projects/createproject`,
          dataToSend
        );
        toast.success(res.data.message);
      }

      setIsFormOpen(false);
      setEditingTask(null);
      setFormData({
        title: "",
        description: "",
        status: "Pending",
        projectTitle: "",
      });
    } catch (error) {
      console.log(error);
    }
  };

  const handleDelete = async (task) => {
    try {
      const res = await axios.delete(
        `${import.meta.env.VITE_BASE_URL}/projects/${task._id}`
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
    });
  };

  const handleCancel = () => {
    setIsFormOpen(false);
    setEditingTask(null);
    setFormData({
      title: "",
      description: "",
      status: "Pending",
      projectTitle: "",
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-200">
      <header className="bg-white dark:bg-gray-800 shadow-sm">
        <div className="container mx-auto px-4 p-3 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            TaskPilot
          </h1>
          <DarkMode />
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
        />
      </main>
    </div>
  );
}
