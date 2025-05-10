import React from "react";
import "./Footer.css";
import { FaInstagram, FaWhatsapp, FaEnvelope } from "react-icons/fa";

const Footer = ({ onSelectSection }) => {
  return (
    <div className="footer" id="footer">
      <div className="footer-content">
        {/* القسم الأيسر */}
        <div className="footer-left">
          <h2>LaCitè</h2>
          <p>
            Discover abayas, shoes, and jewelry crafted for elegance. Your go-to
            fashion hub for timeless style and grace.
          </p>
          <p>Contact Us</p>
          <div className="footer-icons">
            <a href="mailto:reemdarwish2022@gmail.com" aria-label="Email">
              <FaEnvelope />
            </a>
            <a
              href="https://wa.me/249997992091"
              target="_blank"
              rel="noreferrer"
              aria-label="WhatsApp"
            >
              <FaWhatsapp />
            </a>
            <a
              href="https://instagram.com/reemda03"
              target="_blank"
              rel="noreferrer"
              aria-label="Instagram"
            >
              <FaInstagram />
            </a>
          </div>
        </div>

        {/* القسم الأيمن */}
        <div className="footer-right">
          <h4>Company</h4>
          <ul className="footer-lists">
            <li onClick={() => onSelectSection("Working Hours")}>Working Hours &gt;</li>
            <li onClick={() => onSelectSection("Payment Methods")}>Payment Methods &gt;</li>
            <li onClick={() => onSelectSection("Delivery Services")}>Delivery Services &gt;</li>
            <li onClick={() => onSelectSection("Exchange & Return Policy")}>Exchange & Return Policy &gt;</li>
            <li onClick={() => onSelectSection("Privacy & Policy")}>Privacy & Policy &gt;</li>
          </ul>
        </div>
      </div>

      <hr />

      <p className="footer-copyright">
        &copy; 2025 LaCitè.com – All Rights Reserved
      </p>
    </div>
  );
};

export default Footer;
