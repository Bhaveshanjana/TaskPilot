import axios from "axios";
import React, { useState } from "react";
import { GoHome } from "react-icons/go";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import DarkMode from "../components/DarkMode";

const signup = () => {
  const [username, setUsername] = useState("");
  const [country, setCountry] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const navigate = useNavigate();

  const newUser = {
    username: username,
    email: email,
    password: password,
    country: country,
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Api call for register user
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_BASE_URL}/users/register`,
        newUser
      );
      toast.success("User register successfully");
      navigate("/login");
    } catch (error) {
      if (error.response.data.errors) {
        toast.error(error.response.data.errors[0].msg);
      }
      toast.error(error.response.data.message);
    }
    setUsername("");
    setEmail("");
    setPassword("");
    setCountry("");
  };
  return (
    <>
      <div className="min-h-screen flex flex-col bg-gray-900 dark:bg-white">
        {/* Navbar */}
        <div className="flex flex-wrap  gap-6 justify-end items-center py-2 dark:bg-gray-200 bg-gray-800 shadow-sm ">
          <div className="flex gap-3 mt-2 sm:mt-0 mr-6">
            <Link
              to={"/login"}
              className="bg-white border px-4 py-1 rounded-md hover:bg-yellow-400/60  dark:hover:text-white hover:text-black transition"
            >
              Login
            </Link>
            <DarkMode />
          </div>
        </div>

        {/* Signup Form */}
        <div className="flex-grow flex items-center justify-center px-3">
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
                <label>Username</label>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Username"
                  className="w-full p-2 rounded-md bg-gray-700 dark:bg-white dark:text-black dark:border dark:border-gray-300 mt-1"
                />
              </div>
              <div>
                <label>Country</label>
                <input
                  type="text"
                  value={country}
                  onChange={(e) => setCountry(e.target.value)}
                  placeholder="Country-name"
                  className="w-full p-2 rounded-md bg-gray-700 dark:bg-white dark:text-black dark:border dark:border-gray-300 mt-1"
                />
              </div>
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
                  placeholder="*******"
                  className="w-full p-2 rounded-md bg-gray-700 dark:bg-white dark:text-black dark:border dark:border-gray-300 mt-1"
                />
              </div>
              <button
                type="submit"
                disabled={!email || !password}
                className="w-full bg-red-400 hover:bg-red-500 text-white font-medium py-2 rounded-md transition cursor-pointer "
              >
                Signup
              </button>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

export default signup;
