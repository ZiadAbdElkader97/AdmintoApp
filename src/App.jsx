import "./App.css";
import { useContext } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { DataContext } from "./context/DataContext";
import Navbar from "./components/Navbar/Navbar";
import Sidebar from "./components/Sidebar/Sidebar";
import Dashboard from "./pages/Dashboard/Dashboard";
import Chat from "./pages/Chat/Chat";
import Calendar from "./pages/Calendar/Calendar";
import Projects from "./pages/Projects/Projects";
import Tasks from "./pages/Tasks/Tasks";

export default function App() {
  const { isLightMode } = useContext(DataContext);

  return (
    <Router>
      <div className={`app ${isLightMode ? "light_mode" : "dark_mode"}`}>
        <Navbar />
        <Sidebar />
        <div className="content">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/chat" element={<Chat />} />
            <Route path="/calendar" element={<Calendar />} />
            <Route path="/projects" element={<Projects />} />
            <Route path="/tasks" element={<Tasks />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}
