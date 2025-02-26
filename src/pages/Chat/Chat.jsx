import "./Chat.css";
import { useState } from "react";
import {
  FaSearch,
  FaPaperPlane,
  FaMicrophone,
  FaPaperclip,
  FaEllipsisV,
} from "react-icons/fa";
import user_01 from "../../assets/imgs/avatar-2.jpg";
import user_02 from "../../assets/imgs/avatar-1.png";

export default function Chat() {
  const [activeUser, setActiveUser] = useState("Ziad");

  const chatData = {
    Ziad: [
      {
        sender: "Ziad",
        text: "Apologies 😔, I've got another meeting at 2pm. Could we possibly shift it to 3pm?",
        time: "10:18pm",
      },
      {
        sender: "Ziad",
        text: "If you have a few extra minutes, we could also go over the presentation talk format.",
        time: "10:18pm",
      },
      {
        sender: "You",
        text: "3pm works for me 👍. Absolutely, let's dive into the presentation format.",
        time: "10:19pm",
      },
    ],
    Hussien: [
      {
        sender: "Hussien",
        text: "Hey! Did you check the latest updates?",
        time: "9:30am",
      },
      {
        sender: "You",
        text: "Yes, I did! The updates look great! 🚀",
        time: "9:32am",
      },
    ],
  };

  const [messages, setMessages] = useState(chatData[activeUser]);

  const changeUser = (user) => {
    setActiveUser(user);
    setMessages(chatData[user]);
  };

  // إرسال رسالة جديدة
  const [message, setMessage] = useState("");
  const sendMessage = () => {
    if (message.trim() !== "") {
      setMessages([...messages, { sender: "You", text: message, time: "Now" }]);
      setMessage("");
    }
  };

  return (
    <>
      <div className="container">
        <div className="chat">
          <div className="chat-container">
            {/* Sidebar */}
            <div className="chat-sidebar">
              <h2>Chats</h2>
              <div className="chat-search">
                <FaSearch className="search-icon" />
                <input type="text" placeholder="Search something here..." />
              </div>
              <div
                className={`chat-user ${activeUser === "Ziad" ? "active" : ""}`}
                onClick={() => changeUser("Ziad")}
              >
                <img src={user_01} alt="User" />
                <div>
                  <h3>Ziad Abd Elkader</h3>
                  <p className="status_sidebar">typing...</p>
                </div>
              </div>

              <div
                className={`chat-user ${
                  activeUser === "Hussien" ? "active" : ""
                }`}
                onClick={() => changeUser("Hussien")}
              >
                <img src={user_02} alt="User" />
                <div>
                  <h3>Hussien Adnan</h3>
                  <p className="status_sidebar">Active</p>
                </div>
              </div>
            </div>

            {/* Chat Area */}
            <div className="chat-area">
              {/* Chat Header */}
              <div className="chat-header">
                <div className="chat-user-info">
                  <img
                    src={activeUser === "Ziad" ? user_01 : user_02}
                    alt="User"
                  />
                  <div>
                    <h3>{activeUser} Abd Elkader</h3>
                    <p className="status">Active</p>
                  </div>
                </div>
                <FaEllipsisV className="menu-icon" />
              </div>

              {/* Chat Messages */}
              <div className="chat-messages">
                {messages.map((msg, index) => (
                  <div
                    key={index}
                    className={`message ${
                      msg.sender === "You" ? "sent" : "received"
                    }`}
                  >
                    <p>{msg.text}</p>
                    <span className="timestamp">{msg.time}</span>
                  </div>
                ))}
              </div>

              {/* Chat Input */}
              <div className="chat-input">
                <button className="icon-button">
                  <FaPaperclip />
                </button>
                <input
                  type="text"
                  placeholder="Type a message..."
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  onKeyPress={(e) => e.key === "Enter" && sendMessage()}
                />
                <button className="icon-button send" onClick={sendMessage}>
                  <FaPaperPlane />
                </button>
                <button className="icon-button">
                  <FaMicrophone />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
