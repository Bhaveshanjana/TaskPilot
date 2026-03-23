import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const UserProtectWrapper = ({ children }) => {
  const [isloading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    setIsLoading(true)
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
    } else {
      setIsLoading(false);
    }
  }, [navigate]);

  if (isloading) {
    return <div className="text-center translate-y-9">Loading...</div>;
  }

  return <>{children}</>;
};

export default UserProtectWrapper;
