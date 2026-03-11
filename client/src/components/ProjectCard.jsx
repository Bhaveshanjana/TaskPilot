import React, { useState, useMemo } from "react";
import { Trash2, Filter } from "lucide-react";
import axios from "axios";
import { toast } from "react-toastify";
import KanbanBoard from "./KanbanBoard";

export default function ProjectCard({
  project,
  onDelete,
  onEdit,
  onStatusChange,
}) {
  // --- FILTER STATE ---
  const [filterPriority, setFilterPriority] = useState("All");
  const [filterAssignee, setFilterAssignee] = useState("All");
  const [filterOverdue, setFilterOverdue] = useState(false);

  const uniqueAssignees = useMemo(() => {
    const list = [];
    project.tasks.forEach((task) => {
      if (task.assignee && !list.find((a) => a._id === task.assignee._id)) {
        list.push(task.assignee);
      }
    });
    return list;
  }, [project.tasks]);

  // --- FILTER LOGIC ---
  const filteredTasks = useMemo(() => {
    return project.tasks.filter((task) => {
      if (filterPriority !== "All" && task.priority !== filterPriority) {
        return false;
      }

      // Assignee Filter
      if (filterAssignee !== "All") {
        if (filterAssignee === "Unassigned" && task.assignee) return false;
        if (
          filterAssignee !== "Unassigned" &&
          (!task.assignee || task.assignee._id !== filterAssignee)
        )
          return false;
      }

      // Due Date Filter
      if (filterOverdue) {
        if (!task.dueDate) return false;
        const isOverdue =
          new Date(task.dueDate) < new Date() && task.status !== "Done";
        if (!isOverdue) return false;
      }

      return true;
    });
  }, [project.tasks, filterPriority, filterAssignee, filterOverdue]);

  const deleteProject = async (projectId) => {
    try {
      const res = await axios.delete(
        `${import.meta.env.VITE_BASE_URL}/projects/deletedproject/${projectId}`,
      );
      toast.success(res.data.message);
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden mb-6 border border-gray-200">
      {/* HEADER SECTION */}
      <div className="p-4 border-b border-gray-200 dark:border-gray-700 bg-gray-50 flex justify-between items-center">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white">
          {project.projectTitle}
        </h2>
        <button
          onClick={() => deleteProject(project._id)}
          className="cursor-pointer p-2 bg-white border border-gray-200 rounded text-gray-500 hover:text-red-600 dark:text-gray-400 dark:hover:text-red-400 shadow-sm"
        >
          <Trash2 size={18} />
        </button>
      </div>

      {/* FILTER BAR SECTION */}
      {project.tasks.length > 0 && (
        <div className="p-4 bg-white border-b border-gray-200 flex flex-wrap gap-4 items-center">
          <div className="flex items-center gap-2 text-gray-600 font-medium text-sm">
            <Filter size={16} /> Filters:
          </div>

          <select
            value={filterPriority}
            onChange={(e) => setFilterPriority(e.target.value)}
            className="p-1.5 border border-gray-300 rounded text-sm bg-gray-50 focus:ring-2 focus:ring-blue-500 outline-none"
          >
            <option value="All">All Priorities</option>
            <option value="Urgent">Urgent</option>
            <option value="High">High</option>
            <option value="Medium">Medium</option>
            <option value="Low">Low</option>
          </select>

          <select
            value={filterAssignee}
            onChange={(e) => setFilterAssignee(e.target.value)}
            className="p-1.5 border border-gray-300 rounded text-sm bg-gray-50 focus:ring-2 focus:ring-blue-500 outline-none"
          >
            <option value="All">All Assignees</option>
            <option value="Unassigned">Unassigned</option>
            {uniqueAssignees.map((user) => (
              <option key={user._id} value={user._id}>
                {user.username}
              </option>
            ))}
          </select>

          <label className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer">
            <input
              type="checkbox"
              checked={filterOverdue}
              onChange={(e) => setFilterOverdue(e.target.checked)}
              className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
            />
            Show Overdue Only
          </label>

          {/* Clear Filters Button */}
          {(filterPriority !== "All" ||
            filterAssignee !== "All" ||
            filterOverdue) && (
            <button
              onClick={() => {
                setFilterPriority("All");
                setFilterAssignee("All");
                setFilterOverdue(false);
              }}
              className="text-sm text-blue-600 hover:text-blue-800 underline ml-auto cursor-pointer"
            >
              Clear Filters
            </button>
          )}
        </div>
      )}

      {/* KANBAN BOARD SECTION */}
      {project.tasks.length === 0 ? (
        <div className="p-6 text-center text-gray-500 dark:text-gray-400">
          No tasks yet. Click "Add New Task" to create one.
        </div>
      ) : (
        <KanbanBoard
          tasks={filteredTasks}
          columns={project.columns}
          onEdit={onEdit}
          onDelete={onDelete}
          onStatusChange={onStatusChange}
          projectId={project._id}
        />
      )}
    </div>
  );
}
