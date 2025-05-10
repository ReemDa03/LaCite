// src/components/LoginSignin/UserMenu.jsx
import React, { useState, useRef, useEffect } from 'react';
import './UserMenu.css';
import { toast } from 'react-toastify';
import { useNavigate } from "react-router-dom";

const UserMenu = ({ setCurrentUser }) => {
  const [showMenu, setShowMenu] = useState(false);
  const menuRef = useRef(null);
  const navigate = useNavigate();


  const user = JSON.parse(localStorage.getItem("user"));

  const handleLogout = () => {
    const ToastContent = ({ closeToast }) => (
      <div>
        <p>Are you sure you want to logout?</p>
        <div style={{ display: "flex", justifyContent: "space-between", marginTop: "10px" }}>
          <button
            style={{ background: "#ff4d4f", color: "#fff", border: "none", padding: "6px 10px", borderRadius: "4px" }}
            onClick={() => {
              localStorage.removeItem("user");
              setCurrentUser(null);
              toast.success("Logged out successfully!");
              closeToast();
              navigate("/");

            }}
          >
            Yes
          </button>
          <button
            style={{ background: "#ccc", border: "none", padding: "6px 10px", borderRadius: "4px" }}
            onClick={closeToast}
          >
            No
          </button>
        </div>
      </div>
    );
  
    toast.info(<ToastContent />, {
      autoClose: false,
      closeOnClick: false,
      draggable: false,
      closeButton: false,
    });
  };
  
  // إغلاق القائمة عند الضغط خارجها
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setShowMenu(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  if (!user) return null;

  return (
    <div className="user-menu" ref={menuRef}>
      <div
        className="menu-icon"
        onClick={() => setShowMenu(prev => !prev)}
        title="Account Menu"
        style={{ cursor: 'pointer', fontSize: '22px' }}
      >
        ☰
      </div>

      {showMenu && (
        <div className="dropdown">
          <p><strong>{user.name}</strong></p>
          <p style={{ fontSize: "14px", color: "#555" }}>{user.email}</p>
          <button onClick={handleLogout}>Logout</button>
        </div>
      )}
    </div>
  );
};

export default UserMenu;
