/* eslint-disable react/prop-types */
import { useState, useEffect, useRef } from "react";
import { DataContext } from "./DataContext.jsx";

export default function DataProvider({ children }) {
  const [isLightMode, setIsLightMode] = useState(
    localStorage.getItem("mode") === "light" || false
  );

  const toggleMode = () => {
    setIsLightMode(!isLightMode);
    localStorage.setItem("mode", !isLightMode ? "light" : "dark");
  };

  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const sidebarRef = useRef(null);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
    if (sidebarRef.current) {
      sidebarRef.current.classList.toggle("open");
      document.querySelector(".app").classList.toggle("dimmed"); // أضف/أزل الصف `dimmed` للـ app
    }
  };

  const handleClickOutside = (event) => {
    if (sidebarRef.current && !sidebarRef.current.contains(event.target)) {
      setIsSidebarOpen(false);
      sidebarRef.current.classList.remove("open");
      document.querySelector(".app").classList.remove("dimmed"); // أزل الصف `dimmed` للـ app
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  

  return (
    <DataContext.Provider
      value={{ isLightMode, toggleMode, toggleSidebar, sidebarRef }}
    >
      {children}
    </DataContext.Provider>
  );
}
