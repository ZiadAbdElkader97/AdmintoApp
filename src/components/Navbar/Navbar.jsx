import "./Navbar.css";
import { useContext, useEffect, useRef, useState } from "react";
import { useLocation } from "react-router-dom";
import Modal from "react-modal";
import i18n from "../../i18n.js";
import en_lang from "../../assets/imgs/en.svg";
import ar_lang from "../../assets/imgs/ar.svg";
import de_lang from "../../assets/imgs/de.svg";
import { IoSearch } from "react-icons/io5";
import { IoNotificationsOutline } from "react-icons/io5";
import { LuFullscreen } from "react-icons/lu";
import { FiSun } from "react-icons/fi";
import { IoMoonOutline } from "react-icons/io5";
import { FaUnlock } from "react-icons/fa";
import { DataContext } from "../../context/DataContext.jsx";
// import { FaLock } from "react-icons/fa";

export default function Navbar() {
  const { isLightMode, toggleMode, toggleSidebar } = useContext(DataContext);

  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [openMenuLang, SetOpenMenuLang] = useState(false);
  const [toggleOption, setToggleOption] = useState(1);
  const [selectedLang, setSelectedLang] = useState(en_lang);
  const dropdownRef = useRef(null);

  const openModal = () => {
    setModalIsOpen(true);
  };

  const closeModal = () => {
    setModalIsOpen(false);
  };

  const toggleDropdown = () => {
    SetOpenMenuLang(!openMenuLang);
  };

  const closeDropdown = (e) => {
    if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
      SetOpenMenuLang(false);
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", closeDropdown);
    return () => {
      document.removeEventListener("mousedown", closeDropdown);
    };
  }, []);

  const location = useLocation();

  const [pageName, setPageName] = useState("");

  const pageNames = {
    "/": "Dashboard",
    "/chat": "Chat",
    "/calendar": "Calendar",
  };

  // دالة لتحديث اسم الصفحة بناءً على المسار الحالي
  useEffect(() => {
    setPageName(pageNames[location.pathname] || "Page Not Found");
  }, [location.pathname]);

  useEffect(() => {
    const savedLanguage = localStorage.getItem("selectedLanguage") || "en";
    const savedLangImage = localStorage.getItem("selectedLangImage") || en_lang;
    setSelectedLang(savedLangImage);
    i18n.changeLanguage(savedLanguage);
    setSelectedLang(savedLangImage);
    if (savedLanguage === "ar") {
      setToggleOption(2);
    } else if (savedLanguage === "de") {
      setToggleOption(3);
    } else {
      setToggleOption(1);
    }
  }, []);

  const handleToggleOption = (option, langImage, langCode) => {
    setToggleOption(option);
    setSelectedLang(langImage);
    i18n.changeLanguage(langCode);
    localStorage.setItem("selectedLanguage", langCode);
    localStorage.setItem("selectedLangImage", langImage);
    SetOpenMenuLang(false);
  };

  const handleFullScreen = () => {
    if (!document.fullscreenElement) {
      const elem = document.documentElement;

      if (elem.requestFullscreen) {
        elem.requestFullscreen();
      } else if (elem.mozRequestFullScreen) {
        elem.mozRequestFullScreen();
      } else if (elem.webkitRequestFullscreen) {
        elem.webkitRequestFullscreen();
      } else if (elem.msRequestFullscreen) {
        elem.msRequestFullscreen();
      }
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      } else if (document.mozCancelFullScreen) {
        document.mozCancelFullScreen();
      } else if (document.webkitExitFullscreen) {
        document.webkitExitFullscreen();
      } else if (document.msExitFullscreen) {
        document.msExitFullscreen();
      }
    }
  };

  return (
    <>
      <div className="container navbar_container">
        <div className="navbar">
          <div className="navbar_left">
            <div className="open_sidebar" onClick={toggleSidebar}>
              <span></span>
              <span></span>
              <span></span>
            </div>
            <div className="page_name">{pageName}</div>
          </div>

          <div className="navbar_right">
            <div className="navbar_search" onClick={openModal}>
              <input
                type="text"
                className="search_input"
                placeholder="Search Something.."
              />
              <i className="search_icon">
                <IoSearch />
              </i>
            </div>
            <div className="navbar_icons">
              {/* Language */}
              <i onClick={toggleDropdown}>
                <img className="lang_img" src={selectedLang} />
              </i>
              {openMenuLang && (
                <div className="dropdown_menu" ref={dropdownRef}>
                  <div
                    className={
                      toggleOption === 1
                        ? "dropdown_item dropdown_active"
                        : "dropdown_item"
                    }
                    onClick={() => handleToggleOption(1, en_lang, "en")}
                  >
                    <img className="dropdown_img" src={en_lang} alt="EN" />
                    <p className="dropdown_p">English</p>
                  </div>
                  <div
                    className={
                      toggleOption === 2
                        ? "dropdown_item dropdown_active"
                        : "dropdown_item"
                    }
                    onClick={() => handleToggleOption(2, ar_lang, "ar")}
                  >
                    <img className="dropdown_img" src={ar_lang} alt="AR" />
                    <p className="dropdown_p">Arabic</p>
                  </div>
                  <div
                    className={
                      toggleOption === 3
                        ? "dropdown_item dropdown_active"
                        : "dropdown_item"
                    }
                    onClick={() => handleToggleOption(3, de_lang, "de")}
                  >
                    <img className="dropdown_img" src={de_lang} alt="DE" />
                    <p className="dropdown_p">German</p>
                  </div>
                </div>
              )}

              {/* Notification */}
              <i>
                <IoNotificationsOutline />
              </i>
              {/* FullScreen */}
              <i onClick={handleFullScreen}>
                <LuFullscreen />
              </i>
              {/* Light, Dark Mode */}
              <i onClick={toggleMode}>
                {isLightMode ? <IoMoonOutline /> : <FiSun />}
              </i>
            </div>
            <div className="profile">
              <input type="button" value="LOGIN" className="login_btn" />
              <i className="login_icon">
                <FaUnlock />
              </i>
            </div>
          </div>
        </div>
      </div>

      <Modal
        isOpen={modalIsOpen}
        onRequestClose={closeModal}
        contentLabel="Search"
        className={`modal ${isLightMode ? "light_mode" : "dark_mode"}`}
        overlayClassName="overlay"
      >
        <h4>Search</h4>
        <input
          type="text"
          className="modal_search_input"
          placeholder="Search for anything you want.."
        />
        <button onClick={closeModal} className="close_modal_btn">
          Close
        </button>
      </Modal>
    </>
  );
}
