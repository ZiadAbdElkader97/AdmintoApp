import "./Sidebar.css";
import { useContext } from "react";
import { Link } from "react-router-dom";
import logo_dark from "../../assets/imgs/logo-dark.png";
import logo_light from "../../assets/imgs/logo.png";
import { MdClose } from "react-icons/md";
import { FaUnlock, FaRegCalendarCheck } from "react-icons/fa";
import { AiOutlineDashboard } from "react-icons/ai";
import { IoChatboxEllipsesOutline } from "react-icons/io5";
import { DataContext } from "../../context/DataContext";

export default function Sidebar() {
  const { isLightMode, toggleSidebar, sidebarRef } = useContext(DataContext);

  return (
    <>
      <div className="sidebar" ref={sidebarRef}>
        <div className="sidebar_header">
          <img
            className="sidebar_logo"
            src={isLightMode ? logo_dark : logo_light}
            alt="Sidebar Logo"
          />
          <span className="sidebar_close" onClick={toggleSidebar}>
            <MdClose />
          </span>
        </div>

        <div className="profile">
          <input type="button" value="LOGIN" className="login_btn" />
          <i className="login_icon">
            <FaUnlock />
          </i>
        </div>

        <div className="sidebar_menu">
          <Link to="/" className="menu_tab" onClick={toggleSidebar}>
            <i className="menu_icon">
              <AiOutlineDashboard />
            </i>
            <p className="menu_name">Dashboard</p>
          </Link>
          <Link to="/chat" className="menu_tab" onClick={toggleSidebar}>
            <i className="menu_icon">
              <IoChatboxEllipsesOutline />
            </i>
            <p className="menu_name">Chat</p>
          </Link>
          <Link to="/calendar" className="menu_tab" onClick={toggleSidebar}>
            <i className="menu_icon">
              <FaRegCalendarCheck />
            </i>
            <p className="menu_name">Calendar</p>
          </Link>
        </div>
      </div>
    </>
  );
}
