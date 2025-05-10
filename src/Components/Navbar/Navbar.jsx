import React, { useState } from "react";
import "./Navbar.css";
import { assets } from "../../assets/assets";
import { Link, useNavigate } from "react-router-dom";
import UserMenu from "../LoginSignin/UserMenu";

const Navbar = ({ setShowLogin, currentUser, setCurrentUser }) => {
  const [menu, setMenu] = useState("");
  const navigate = useNavigate();

  const handleLogoClick = () => {
    if (currentUser?.role === "admin") {
      navigate("/add");
    } else {
      navigate("/");
    }
  };

  return (
    <div className="navbar">
      <div className="logo" onClick={handleLogoClick}>
        <h1>LaCitè</h1>
      </div>

      <ul className="navbar-menu">
        <Link
          to="/"
          onClick={() => setMenu("home")}
          className={menu === "home" ? "active" : ""}
        >
          Home
        </Link>
        <Link
          to="/#explore-products"
          onClick={() => setMenu("products")}
          className={menu === "products" ? "active" : ""}
        >
          Products
        </Link>
        <Link
          to="/#footer"
          onClick={() => setMenu("contact")}
          className={menu === "contact" ? "active" : ""}
        >
          About LaCitè
        </Link>
        <Link
          to="/#footer"
          onClick={() => setMenu("about")}
          className={menu === "about" ? "active" : ""}
        >
          Contact Us
        </Link>
      </ul>

      <div className="navbar-right">
        <img className="search" src={assets.search_icon} alt="Search Icon" />
        <div className="navbar-search-icon">
          <Link to="/cart">
            <img src={assets.basket_icon} alt="Cart" />
          </Link>
          <div className="dot"></div>
        </div>

        {currentUser ? (
          <UserMenu setCurrentUser={setCurrentUser} />
        ) : (
          <button className="ptn" onClick={() => setShowLogin(true)}>
            Login
          </button>
        )}
      </div>
    </div>
  );
};

export default Navbar;
