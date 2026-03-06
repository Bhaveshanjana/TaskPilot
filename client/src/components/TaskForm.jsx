import React from "react";

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

  return (
    <form
      onSubmit={onSubmit}
      className="mb-8 bg-white dark:bg-gray-800 rounded-lg shadow-md p-6"
    >
      <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">
        {isEditing ? "Edit Task" : "Create New Project"}
      </h2>

      {!isEditing && (
        <div className="mb-4">
          <label
            htmlFor="projectTitle"
            className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
          >
            Project Title
          </label>
          <input
            type="text"
            id="projectTitle"
            name="projectTitle"
            value={formData.projectTitle}
            onChange={handleInputChange}
            required
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
          />
        </div>
      )}

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
          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
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
          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
        ></textarea>
      </div>

      <div className="mb-4">
        <label
          htmlFor="priority"
          className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
        >
          priority
        </label>
        <select
          id="priority"
          name="priority"
          value={formData.priority}
          onChange={handleInputChange}
          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white cursor-pointer"
        >
          {PRIORITY_OPTIONS.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
      </div>
      <div className="flex flex-col gap-2 w-full max-w-sm">
        <label
          htmlFor="assignee"
          className="text-sm font-medium text-gray-700 dark:text-gray-300"
        >
          Assignee
        </label>

        <select
          name="assignee"
          id="assignee"
          onChange={handleInputChange}
          className="w-full rounded-lg border border-gray-300 dark:border-gray-600 
    bg-white dark:bg-gray-800 
    px-3 py-2 text-sm text-gray-800 dark:text-gray-200 
    focus:outline-none focus:ring-2 focus:ring-blue-500 
    focus:border-blue-500 transition"
        >
          <option value="">Select team member</option>

          {teamMembers.map((member) => (
            <option key={member._id} value={member._id}>
              {member.user.username}
            </option>
          ))}
        </select>
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
          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white cursor-pointer"
        >
          {STATUS_OPTIONS.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
      </div>
      {isEditing && (
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Date of Completion
          </label>
          <input
            type="date"
            value={formData.dateOfcompletion}
            onChange={(e) =>
              setFormData({ ...formData, dateOfcompletion: e.target.value })
            }
            className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring focus:border-blue-300 dark:bg-gray-700 dark:text-white cursor-pointer"
          />
        </div>
      )}

      <div className="flex justify-end gap-2">
        <button
          type="button"
          onClick={onCancel}
          className="cursor-pointer px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 cursor-pointer"
        >
          {isEditing ? "Update Task" : "Create Task"}
        </button>
      </div>
    </form>
  );
}
