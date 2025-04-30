import { Route, Routes } from "react-router-dom";
import TaskManager from "./components/TaskManager";
import { ToastContainer } from "react-toastify";
import Login from "./pages/Login.jsx";
import Signup from "./pages/Signup.jsx";
import AuthUser from "./pages/UserProtectWrapper.jsx";

export default function App() {
  return (
    <>
      <Routes>
        <Route
          path="/"
          element={
            <AuthUser>
              <TaskManager />
            </AuthUser>
          }
        />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
      </Routes>

      <ToastContainer
        position="top-center"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={true}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        className="custom-toast"
      />
    </>
  );
}
