import React, { useState } from "react";
import { Edit, Trash2 } from "lucide-react";
import axios from "axios";
import { toast } from "react-toastify";

export default function TaskCard({
  task,
  onEdit,
  onDelete,
  projectId,
  onStatusChange,
}) {
  const [showComments, setShowComments] = useState(false);
  const [newComment, setNewComment] = useState("");

  const getStatusColor = (status) => {
    switch (status) {
      case "Done":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200";
      case "In Progress":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200";
      default:
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200";
    }
  };

  const handleAddComment = async () => {
    if (!newComment.trim()) return;
    try {
      axios.post(
        `${import.meta.env.VITE_BASE_URL}/projects/${projectId}/tasks/${task._id}/comment`,
        { text: newComment },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        },
      );
      toast.success("comment added!");
      if (onStatusChange) {
        onStatusChange();
      }
      if (onStatusChange) {
        onStatusChange();
      }

      setNewComment("");
    } catch (error) {
      toast.error("Faild to add comment");
    }
  };

  return (
    <div className="cursor-pointer p-3 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
      <div className="flex justify-between items-start">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white">
              Task's Title: {task.title}
            </h3>
            <span
              className={`text-xs px-2 py-1 rounded-full ${getStatusColor(
                task.status,
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
          <div>
            <h5 className="text-red-500">Priority: {task.priority}</h5>
            <h5>Assignee: {task?.assignee?.username}</h5>
            <h5>DueDate {new Date(task.dueDate).toLocaleDateString()}</h5>
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
      {/* Comments Section Toggle */}
      <div className="mt-4 border-t dark:border-gray-700 pt-2">
        <button
          onClick={() => setShowComments(!showComments)}
          className="text-sm text-blue-500 hover:text-blue-700 font-medium"
        >
          {showComments
            ? "Hide Comments"
            : `View Comments (${task.comments?.length || 0})`}
        </button>

        {showComments && (
          <div className="mt-3 space-y-3">
            {/* List Existing Comments */}
            <div className="max-h-32 overflow-y-auto space-y-2">
              {task.comments?.map((comment, index) => (
                <div
                  key={index}
                  className="bg-gray-100 dark:bg-gray-700 p-2 rounded text-sm"
                >
                  <span className="font-semibold text-gray-800 dark:text-gray-200">
                    {comment.author?.username || "Unknown"}:{" "}
                  </span>
                  <span className="text-gray-600 dark:text-gray-300">
                    {comment.text}
                  </span>
                </div>
              ))}
              {(!task.comments || task.comments.length === 0) && (
                <p className="text-xs text-gray-500">No comments yet.</p>
              )}
            </div>

            {/* Add New Comment Input */}
            <div className="flex gap-2">
              <input
                type="text"
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder="Write a comment..."
                className="flex-1 text-sm p-1.5 border rounded dark:bg-gray-800 dark:border-gray-600 dark:text-white"
              />
              <button
                onClick={handleAddComment}
                className="bg-blue-600 text-white px-3 py-1.5 rounded text-sm hover:bg-blue-700"
              >
                Post
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
