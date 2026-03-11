import React, { useState } from "react";
import TaskCard from "./TaskCard";
import { DragDropContext, Draggable, Droppable } from "@hello-pangea/dnd";
import axios from "axios";
import { toast } from "react-toastify";
import { Check, Edit2, Plus, Trash2, X } from "lucide-react";

const themeColors = {
  gray: {
    bg: "bg-gray-200",
    text: "text-gray-700",
    badge: "bg-gray-200 text-gray-800",
  },
  blue: {
    bg: "bg-blue-100",
    text: "text-blue-700",
    badge: "bg-blue-200 text-blue-800",
  },
  green: {
    bg: "bg-green-100",
    text: "text-green-700",
    badge: "bg-green-200 text-green-800",
  },
  red: {
    bg: "bg-red-100",
    text: "text-red-700",
    badge: "bg-red-200 text-red-800",
  },
  yellow: {
    bg: "bg-yellow-100",
    text: "text-yellow-700",
    badge: "bg-yellow-200 text-yellow-800",
  },
  purple: {
    bg: "bg-purple-100",
    text: "text-purple-700",
    badge: "bg-purple-200 text-purple-800",
  },
};

const KanbanBoard = ({
  tasks,
  columns,
  onEdit,
  onDelete,
  onStatusChange,
  projectId,
}) => {
  const [isAddingColumn, setIsAddingColumn] = useState(false);
  const [newColumnName, setNewColumnName] = useState("");
  const [newColumnColor, setNewColumnColor] = useState("gray");
  // --- STATE FOR EDITING A COLUMN ---
  const [editingColumnId, setEditingColumnId] = useState(null);
  const [editColumnName, setEditColumnName] = useState("");
  const [editColumnColor, setEditColumnColor] = useState("gray");

  const handleDragEnd = async (result) => {
    const { destination, draggableId, source } = result;
    if (!destination) return;
    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    ) {
      return;
    }
    const newStatus = destination.droppableId;
    const draggedTask = tasks.find((t) => t._id === draggableId);
    const updatedTaskData = { ...draggedTask, status: newStatus };
    try {
      await axios.put(
        `${import.meta.env.VITE_BASE_URL}/projects/updateproject/${draggableId}`,
        updatedTaskData,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        },
      );
      if (onStatusChange) {
        onStatusChange();
      }
      toast.success(`Task moved to ${newStatus}`);
    } catch (error) {
      console.log(error);
      toast.error("Faild to move task");
    }
  };

  const handleAddColumn = async () => {
    try {
      await axios.post(
        `${import.meta.env.VITE_BASE_URL}/projects/${projectId}/columns`,
        {
          name: newColumnName,
          color: newColumnColor,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        },
      );
      onStatusChange();
      setIsAddingColumn(false);
      setNewColumnName("");
      setNewColumnColor("gray");
      toast.success("Column is added");
    } catch (error) {
      console.error(error);
      toast.error("Faild to add column");
    }
  };

  const handleUpdateColumn = async (columnId) => {
    try {
      await axios.put(
        `${import.meta.env.VITE_BASE_URL}/projects/${projectId}/columns/${columnId}`,
        {
          name: editColumnName,
          color: editColumnColor,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        },
      );
      onStatusChange();
      setEditingColumnId(null);
      setEditColumnName("");
      setEditColumnColor("gray");
      toast.success("Column updated successfully");
    } catch (error) {
      console.error(error);
      toast.error("Faild to update column");
    }
  };

  const handleDeleteColumn = async (columnId) => {
    try {
      await axios.delete(
        `${import.meta.env.VITE_BASE_URL}/projects/${projectId}/columns/${columnId}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        },
      );
      onStatusChange();
      toast.success("Column deleted successfully");
    } catch (error) {
      console.error(error);
      toast.error("Faild to delete column");
    }
  };

  const renderTaskCard = (task, index) => (
    <Draggable key={task._id} draggableId={task._id} index={index}>
      {(provided) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          className="mb-3"
        >
          <TaskCard
            key={task._id}
            task={task}
            onDelete={onDelete}
            onEdit={onEdit}
            projectId={projectId}
            onStatusChange={onStatusChange}
          />
        </div>
      )}
    </Draggable>
  );
  return (
    <DragDropContext
      onDragEnd={handleDragEnd}
      className="p-6 bg-gray-50 min-h-[500px]"
    >
      <div className="flex gap-6 overflow-x-auto pb-4 max-w-full items-start">
        {columns &&
          columns.map((col) => {
            // Filter tasks belonging to THIS column dynamically
            const columnTasks = tasks.filter(
              (task) => task.status === col.name,
            );
            const theme = themeColors[col.color] || themeColors.gray;
            return (
              <div
                key={col._id}
                className="bg-gray-100 p-4 rounded-xl min-w-[320px] max-w-[320px] flex-shrink-0"
              >
                {/* Column Header (Edit Mode vs View Mode) */}
                {editingColumnId === col._id ? (
                  <div className="mb-4 bg-white p-3 rounded shadow-sm border border-blue-300">
                    <input
                      type="text"
                      value={editColumnName}
                      onChange={(e) => setEditColumnName(e.target.value)}
                      className="w-full mb-2 p-1 border rounded text-sm font-semibold text-gray-700"
                    />
                    <select
                      value={editColumnColor}
                      onChange={(e) => setEditColumnColor(e.target.value)}
                      className="w-full mb-3 p-1 border rounded text-sm"
                    >
                      <option value="gray">Gray</option>
                      <option value="blue">Blue</option>
                      <option value="green">Green</option>
                      <option value="red">Red</option>
                      <option value="yellow">Yellow</option>
                      <option value="purple">Purple</option>
                    </select>
                    <div className="flex justify-end gap-2">
                      <button
                        onClick={() => setEditingColumnId(null)}
                        className="p-1 px-2 text-gray-500 hover:bg-gray-100 rounded"
                      >
                        <X size={16} />
                      </button>
                      <button
                        onClick={() => handleUpdateColumn(col._id)}
                        className="p-1 px-2 text-white bg-green-500 hover:bg-green-600 rounded"
                      >
                        <Check size={16} />
                      </button>
                    </div>
                  </div>
                ) : (
                  <h2
                    className={`text-lg font-bold mb-4 flex items-center justify-between ${theme.text}`}
                  >
                    <div className="flex items-center gap-2">
                      {col.name}
                      <span
                        className={`${theme.badge} text-xs py-1 px-2 rounded-full`}
                      >
                        {columnTasks.length}
                      </span>
                    </div>

                    {/* Column Action Icons */}
                    <div className="flex gap-1 opacity-60 hover:opacity-100 transition-opacity">
                      <button
                        onClick={() => {
                          setEditingColumnId(col._id);
                          setEditColumnName(col.name);
                          setEditColumnColor(col.color);
                        }}
                        className="p-1 text-gray-500 hover:text-blue-600 cursor-pointer"
                      >
                        <Edit2 size={16} />
                      </button>
                      <button
                        onClick={() => {
                          if (
                            window.confirm(
                              "Are you sure you want to delete this column?",
                            )
                          ) {
                            handleDeleteColumn(col._id);
                          }
                        }}
                        className="p-1 text-gray-500 hover:text-red-500 cursor-pointer"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </h2>
                )}
                <div className="flex flex-col">
                  <Droppable droppableId={col.name}>
                    {(provided) => (
                      <div
                        ref={provided.innerRef}
                        {...provided.droppableProps}
                        className="min-h-[200px]"
                      >
                        {columnTasks.length > 0 ? (
                          columnTasks.map((task, index) =>
                            renderTaskCard(task, index),
                          )
                        ) : (
                          <p className="text-sm text-gray-500 italic mt-2">
                            Drop tasks here...
                          </p>
                        )}
                        {provided.placeholder}
                      </div>
                    )}
                  </Droppable>
                </div>
              </div>
            );
          })}
        {/* --- Add New Column Button / Form --- */}
        <div className="min-w-[320px] max-w-[320px] flex-shrink-0">
          {isAddingColumn ? (
            <div className="bg-white p-4 rounded-xl shadow border border-gray-200">
              <h3 className="font-semibold mb-3 text-gray-700">
                Add New Column
              </h3>
              <input
                type="text"
                placeholder="Column Name (e.g., QA)"
                value={newColumnName}
                onChange={(e) => setNewColumnName(e.target.value)}
                className="w-full mb-3 p-2 border rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <select
                value={newColumnColor}
                onChange={(e) => setNewColumnColor(e.target.value)}
                className="w-full mb-3 p-2 border rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="gray">Gray</option>
                <option value="blue">Blue</option>
                <option value="green">Green</option>
                <option value="red">Red</option>
                <option value="yellow">Yellow</option>
                <option value="purple">Purple</option>
              </select>
              <div className="flex gap-2">
                <button
                  onClick={handleAddColumn}
                  className="flex-1 bg-blue-600 text-white py-2 rounded text-sm font-medium hover:bg-blue-700 disabled:opacity-50 cursor-pointer"
                  disabled={!newColumnName.trim()}
                >
                  Save
                </button>
                <button
                  onClick={() => setIsAddingColumn(false)}
                  className="px-3 bg-gray-100 text-gray-600 rounded hover:bg-gray-200 cursor-pointer text-sm"
                >
                  Cancel
                </button>
              </div>
            </div>
          ) : (
            <button
              onClick={() => setIsAddingColumn(true)}
              className="w-full h-[60px] flex items-center justify-center gap-2 border-2 border-dashed border-gray-300 rounded-xl text-gray-500 hover:text-gray-700 hover:border-gray-400 hover:bg-gray-50 transition-colors cursor-pointer"
            >
              <Plus size={20} />
              <span className="font-medium">Add New Column</span>
            </button>
          )}
        </div>
      </div>
    </DragDropContext>
  );
};

export default KanbanBoard;
