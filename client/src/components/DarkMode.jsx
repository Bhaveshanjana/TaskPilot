import React, { useEffect } from "react";
import { Sun, Moon } from "lucide-react";
import { useTheme } from "../context/ThemeProvider";

const DarkMode = () => {
  const { toggleTheme, darkMode } = useTheme();

  return (
    <div className="relative">
      <button
        onClick={toggleTheme}
        className="cursor-pointer p-2 rounded-full bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-200 hover:bg-gray-400 dark:hover:bg-gray-500 transition-colors"
        aria-label="Toggle theme"
      >
        {darkMode ? <Sun size={17} /> : <Moon size={17} />}
      </button>
    </div>
  );
};

export default DarkMode;
