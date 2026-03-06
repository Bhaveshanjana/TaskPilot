import React, { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";

export const OrganizationContext = createContext();
export const OrganizationProvider = ({ children }) => {
  const [organizations, setOrganizations] = useState([]);
  const [currentOrganization, setCurrentOrganization] = useState(null);
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    const fetchOrganizations = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem("token");
        if (!token) {
          setLoading(true);
          return;
        }
        const res = await axios.get(
          `${import.meta.env.VITE_BASE_URL}/api/organizations`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        );
        setLoading(false)
        setOrganizations(res.data.organizations);
        if (res.data.organizations && res.data.organizations.length > 0) {
          setCurrentOrganization(res.data.organizations[0]);
        }
      } catch (error) {
        console.log("error from useeffect", error);
      }
    };
    fetchOrganizations();
  }, []);
  return (
    <OrganizationContext.Provider
      value={{
        organizations,
        currentOrganization,
        setCurrentOrganization,
        loading,
      }}
    >
      {children}
    </OrganizationContext.Provider>
  );
};

export const useOrganization = () => {
  return useContext(OrganizationContext);
};
export default OrganizationContext;
