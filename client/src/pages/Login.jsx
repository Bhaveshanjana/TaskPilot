import axios from "axios";
import React, { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
// import { UserDataContext } from "../context/userContext";
import { GoHome } from "react-icons/go";
import DarkMode from "../components/DarkMode";

const login = () => {
  //   const { user, setUser } = useContext(UserDataContext);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    const newUser = {
      email: email,
      password: password,
    };

    // Api call for logging user
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_BASE_URL}/users/login`,
        newUser
      );
      const data = response.data;
      localStorage.setItem("token", data.token);
      toast.success(`Welcome ${response.data.user.username}`);
      navigate("/");
    } catch (error) {
      if (error.response.data.errors) {
        toast.error(error.response.data.errors[0].msg);
      }
      toast.error(error.response.data.message);
    }
    setEmail("");
    setPassword("");
  };

  return (
    <>
      <div className="min-h-screen flex flex-col bg-gray-900 dark:bg-white px-4">
        {/* Navbar */}
        <div className="mt-2 flex flex-wrap justify-end gap-4 ml-6 md:justify-between items-center py-4">
          <div className="flex gap-3 mt-2 sm:mt-0">
            <Link
              to={"/signup"}
              className="bg-white dark:bg-white border px-4 py-1 rounded-md hover:bg-yellow-400/60 dark:hover:text-white hover:text-black transition"
            >
              Signup
            </Link>
            <Link to={"/"}>
              <GoHome className="text-white dark:text-black text-2xl hover:text-orange-400 dark:hover:text-orange-500 mt-1" />
            </Link>
            <DarkMode />
          </div>
        </div>

        {/* Login Form */}
        <div className="flex-grow flex items-center justify-center">
          <div className="w-full max-w-md bg-gray-800 dark:bg-gray-100 p-6 rounded-xl shadow-lg">
            <h1 className="text-xl text-center text-white dark:text-black font-bold mb-2">
              Welcome to{" "}
              <span className="text-orange-300 dark:text-orange-500">
                TaskPilot
              </span>
            </h1>
            <form
              onSubmit={handleSubmit}
              className="space-y-4 text-white dark:text-black"
            >
              <div>
                <label>Email</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="example@gmail.com"
                  className="w-full p-2 rounded-md bg-gray-700 dark:bg-white dark:text-black dark:border dark:border-gray-300 mt-1"
                />
              </div>
              <div>
                <label>Password</label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="******"
                  className="w-full p-2 rounded-md bg-gray-700 dark:bg-white dark:text-black dark:border dark:border-gray-300 mt-1"
                />
              </div>
              <button
                type="submit"
                className="w-full bg-red-400 hover:bg-red-500 text-white dark:text-white font-medium py-2 rounded-md transition"
              >
                Login
              </button>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

export default login;
