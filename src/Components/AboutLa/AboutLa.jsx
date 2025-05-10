import React from "react";
import "./AboutLa.css";

const sections = {
  "Working Hours": "We are open from 10AM to 8PM, Sunday to Thursday.",
  "Payment Methods": "We accept Cash on Delivery and Visa/MasterCard payments.",
  "Delivery Services":
    "We deliver all across Saudi Arabia within 2-5 business days.",
  "Exchange & Return Policy":
    "You may exchange or return items within 7 days of purchase with the receipt.",
  "Privacy & Policy":
    "We respect your privacy. Your data is securely protected and never shared.",
};

const AboutLa = ({ sectionTitle, onClose }) => {
  const content = sections[sectionTitle];

  return (
    <div className="AboutLa" onClick={onClose}>
      <div className="about-container" onClick={(e) => e.stopPropagation()}>
        <button
          className="close-btn"
          onClick={onClose}
          aria-label="Close About Section"
        >
          ×
        </button>
        <h2>{sectionTitle || "Info"}</h2>
        <p>
          {content ||
            "Sorry, we couldn't find the information you're looking for."}
        </p>
      </div>
    </div>
  );
};

export default AboutLa;
