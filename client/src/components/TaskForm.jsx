import React from "react";
import {
  Calendar,
  User,
  Flag,
  CheckCircle,
  AlignLeft,
  Type,
  FolderDot,
  X,
} from "lucide-react";
// eslint-disable-next-line no-unused-vars
import { motion } from "motion/react";

const STATUS_OPTIONS = ["To Do", "In Progress", "Done"];
const PRIORITY_OPTIONS = ["Low", "Medium", "High"];

export default function TaskForm({
  formData,
  setFormData,
  onSubmit,
  onCancel,
  isEditing,
  teamMembers,
}) {
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const isFormValid = isEditing
    ? formData.title?.trim() !== ""
    : formData.title?.trim() !== "" && formData.projectTitle?.trim() !== "";

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95, y: -20 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95, y: -20 }}
      className="mb-8"
    >
      <form
        onSubmit={onSubmit}
        className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl border border-gray-200 dark:border-gray-700 rounded-2xl shadow-xl overflow-hidden transition-all"
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-gray-800 dark:to-gray-800 px-6 py-4 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
          <h2 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-400 dark:to-indigo-400 bg-clip-text text-transparent">
            {isEditing ? "Edit Task Details" : "Create New Task"}
          </h2>
          <button
            type="button"
            onClick={onCancel}
            className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors p-1 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 cursor-pointer"
          >
            <X size={20} />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {!isEditing && (
              <div>
                <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                  <FolderDot size={16} className="text-blue-500" />
                  Project Title
                </label>
                <input
                  type="text"
                  name="projectTitle"
                  value={formData.projectTitle}
                  onChange={handleInputChange}
                  required
                  placeholder="E.g., Website Redesign"
                  className="w-full px-4 py-2.5  bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl transition-all duration-200 dark:text-white focus:outline-none focus:ring-1 focus:ring-gray-400/40 focus:border-gray-500"
                />
              </div>
            )}

            <div className={isEditing ? "md:col-span-2" : ""}>
              <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                <Type size={16} className="text-blue-500" />
                Task Title
              </label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                required
                placeholder="What needs to be done?"
                className="w-full px-4 py-2.5  bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl transition-all duration-200 dark:text-white focus:outline-none focus:ring-1 focus:ring-gray-400/40 focus:border-gray-500"
              />
            </div>
          </div>

          <div>
            <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
              <AlignLeft size={16} className="text-blue-500" />
              Description
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              rows="3"
              placeholder="Add more details about this task..."
              className="w-full px-4 py-2.5  bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl transition-all duration-200 dark:text-white focus:outline-none focus:ring-1 focus:ring-gray-400/40 focus:border-gray-500"
            ></textarea>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div>
              <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                <Flag size={16} className="text-orange-500" />
                Priority
              </label>
              <select
                name="priority"
                value={formData.priority}
                onChange={handleInputChange}
                className="w-full px-4 py-2.5 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-1 focus:ring-gray-400/40 focus:border-gray-500 transition-all dark:text-white cursor-pointer"
              >
                {PRIORITY_OPTIONS.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                <CheckCircle size={16} className="text-green-500" />
                Status
              </label>
              <select
                name="status"
                value={formData.status}
                onChange={handleInputChange}
                className="w-full px-4 py-2.5 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-1 focus:ring-gray-400/40 focus:border-gray-500 transition-all dark:text-white cursor-pointer"
              >
                {STATUS_OPTIONS.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                <User size={16} className="text-purple-500" />
                Assignee
              </label>
              <select
                name="assignee"
                value={formData.assignee || ""}
                onChange={handleInputChange}
                className="w-full px-4 py-2.5 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xlfocus:ring-1 focus:ring-gray-400/40 focus:border-gray-500 transition-all dark:text-white cursor-pointer rounded-xl"
              >
                <option value="">Unassigned</option>
                {teamMembers?.map((member) => (
                  <option key={member._id} value={member.user._id}>
                    {member.user.username}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                <Calendar size={16} className="text-pink-500" />
                {isEditing ? "Completed On" : "Due Date"}
              </label>
              <input
                type="date"
                name={isEditing ? "dateOfcompletion" : "dueDate"}
                value={
                  isEditing
                    ? formData.dateOfcompletion || ""
                    : formData.dueDate || ""
                }
                onChange={handleInputChange}
                className="w-full px-4 py-2.5 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-1 focus:ring-gray-400/40 focus:border-gray-500 transition-all dark:text-white cursor-pointer"
              />
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="bg-gray-50 dark:bg-gray-900/50 px-6 py-4 border-t border-gray-200 dark:border-gray-700 flex justify-end gap-3">
          <button
            type="button"
            onClick={onCancel}
            className="cursor-pointer px-5 py-2.5 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors focus:ring-2 focus:ring-gray-200 dark:focus:ring-gray-700"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={!isFormValid}
            className={`px-5 py-2.5 text-sm font-medium text-white rounded-xl shadow-md flex items-center gap-2 transition-all focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-gray-900 ${
              isFormValid
                ? "bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 hover:shadow-lg transform active:scale-95 cursor-pointer"
                : "bg-gray-400 dark:bg-gray-600 cursor-not-allowed opacity-70"
            }`}
          >
            {isEditing ? <CheckCircle size={16} /> : <FolderDot size={16} />}
            {isEditing ? "Save Changes" : "Create Task"}
          </button>
        </div>
      </form>
    </motion.div>
  );
}
