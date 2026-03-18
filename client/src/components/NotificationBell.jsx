import React, { useState, useEffect } from "react";
import { Bell, Check, Trash2 } from "lucide-react";
import axios from "axios";

export default function NotificationBell() {
  const [notifications, setNotifications] = useState([]);
  const [isOpen, setIsOpen] = useState(false);

  // Fetch notifications on load
  const fetchNotifications = async () => {
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_BASE_URL}/users/notifications`,
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        },
      );
      // Sort them so the newest is at the top
      const sorted = res.data.notifications.sort(
        (a, b) => new Date(b.createdAt) - new Date(a.createdAt),
      );
      setNotifications(sorted);
    } catch (error) {
      console.error("Failed to fetch notifications", error);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  const handleMarkAsRead = async (id) => {
    try {
      await axios.put(
        `${import.meta.env.VITE_BASE_URL}/users/notifications/${id}/read`,
        {},
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        },
      );
      // Update UI optimistically
      setNotifications((prev) =>
        prev.map((n) => (n._id === id ? { ...n, isRead: true } : n)),
      );
    } catch (error) {
      console.error(error);
    }
  };

  const handleClearAll = async () => {
    try {
      await axios.delete(
        `${import.meta.env.VITE_BASE_URL}/users/notifications`,
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        },
      );
      setNotifications([]);
      setIsOpen(false);
    } catch (error) {
      console.error(error);
    }
  };

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  return (
    <div className="relative isolate z-[100]">
      {/* BELL BUTTON */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full cursor-pointer"
      >
        <Bell size={20} />
        {unreadCount > 0 && (
          <span className="absolute top-0 right-0 inline-flex items-center justify-center w-4 h-4 text-[10px] font-bold text-white bg-red-500 rounded-full border-2 border-white dark:border-gray-800">
            {unreadCount}
          </span>
        )}
      </button>

      {/* DROPDOWN MENU */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 bg-white dark:bg-gray-800 rounded-lg shadow-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
          <div className="p-3 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center bg-gray-50 dark:bg-gray-900">
            <h3 className="font-semibold text-gray-800 dark:text-gray-200">
              Notifications
            </h3>
            {notifications.length > 0 && (
              <button
                onClick={handleClearAll}
                className="text-xs text-red-500 hover:underline flex items-center gap-1 cursor-pointer"
              >
                <Trash2 size={12} /> Clear All
              </button>
            )}
          </div>

          <div className="max-h-[300px] overflow-y-auto">
            {notifications.length === 0 ? (
              <div className="p-4 text-center text-sm text-gray-500 dark:text-gray-400">
                You have no notifications.
              </div>
            ) : (
              notifications.map((notif) => (
                <div
                  key={notif._id}
                  className={`p-3 border-b border-gray-100 dark:border-gray-700 text-sm flex justify-between gap-3 ${notif.isRead ? "bg-white dark:bg-gray-800 opacity-70" : "bg-blue-50 dark:bg-blue-900/20"}`}
                >
                  <div className="flex-1">
                    <p
                      className={`text-gray-800 dark:text-gray-200 ${!notif.isRead && "font-medium"}`}
                    >
                      {notif.message}
                    </p>
                    <span className="text-xs text-gray-400 mt-1 block">
                      {new Date(notif.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  {!notif.isRead && (
                    <button
                      onClick={() => handleMarkAsRead(notif._id)}
                      className="text-blue-600 hover:text-blue-800 p-1 flex-shrink-0 cursor-pointer h-fit rounded hover:bg-blue-100 dark:hover:bg-blue-800/30"
                      title="Mark as read"
                    >
                      <Check size={16} />
                    </button>
                  )}
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}
