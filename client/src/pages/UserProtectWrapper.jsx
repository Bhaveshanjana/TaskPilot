import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const UserProtectWrapper = ({ children }) => {
  const [isloading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const token = localStorage.getItem("token");

  useEffect(() => {
    if (!token) {
      navigate("/login");
    } else {
      navigate("/");
    }
  }, [token]);

  if (isloading) {
    return <div className="text-center translate-y-9">Loading...</div>;
  }

  return <>{children}</>;
};

export default UserProtectWrapper;
