import React, { useState } from "react";
import "./LoginSignin.css";
import { assets } from "../../assets/assets";
import { auth, db } from "../../../firebase";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from "firebase/auth";
import { doc, setDoc, getDoc } from "firebase/firestore";
import { toast } from "react-toastify";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { useNavigate } from "react-router-dom";


const LoginSignin = ({ setShowLogin, setCurrentUser }) => {
  const [currentState, setCurrentState] = useState("Sign Up");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [passwordError, setPasswordError] = useState(""); // State لتعقب خطأ كلمة المرور
  const navigate = useNavigate();


  const handleAuth = async (e) => {
    e.preventDefault();

    try {
      if (currentState === "Sign Up") {
        const userCredential = await createUserWithEmailAndPassword(
          auth,
          email,
          password
        );
        const user = userCredential.user;

        await setDoc(doc(db, "users", user.uid), {
          uid: user.uid,
          name: name,
          email: email,
        });

        const savedUser = { uid: user.uid, name: name, email: email };
        localStorage.setItem("user", JSON.stringify(savedUser));
        if (setCurrentUser) setCurrentUser(savedUser);

        toast.success("Account created successfully!");
        setShowLogin(false);
        navigate("/");

        setPasswordError(""); // Reset error on successful signup
      } else {
        const userCredential = await signInWithEmailAndPassword(
          auth,
          email,
          password
        );
        const user = userCredential.user;

        const userRef = doc(db, "users", user.uid);
        const userSnap = await getDoc(userRef);

        if (userSnap.exists()) {
          const userData = userSnap.data();
          localStorage.setItem("user", JSON.stringify(userData));
          if (setCurrentUser) setCurrentUser(userData);

          toast.success("Logged in successfully!");
          setShowLogin(false);
          setTimeout(() => window.location.reload(), 1000);
          setPasswordError(""); // Reset error on successful login
        } else {
          toast.error("User data not found!");
          setPasswordError(""); // Reset error if user not found (though unlikely here)
        }
      }
    } catch (error) {
      console.error("Authentication error:", error);

      if (error.code === "auth/email-already-in-use") {
        toast.error("Email already in use. Please login instead.");
        setCurrentState("Login");
        setPasswordError("");
      } else if (error.code === "auth/wrong-password") {
        toast.error("Wrong password. Please try again.");
        setPasswordError("Wrong password. Please try again.");
      } else if (error.code === "auth/user-not-found") {
        toast.error("User not found. Please check your email.");
        setPasswordError("");
      } else if (error.code === "auth/invalid-credential") { // معالجة خطأ بيانات الاعتماد غير الصالحة
        
        setPasswordError("Your Email or Password is not Correct!"); // تحديث حالة الخطأ عشان البوردر
      } else {
        toast.error(error.message);
        setPasswordError("");
      }
    }
  };

  return (
    <div className="login">
      <form className="login-container" onSubmit={handleAuth}>
        <div className="login-title">
          <h2>{currentState}</h2>
          <img
            onClick={() => setShowLogin(false)}
            src={assets.cross_icon}
            alt="Close"
          />
        </div>

        <div className="login-input">
          {currentState === "Sign Up" && (
            <input
              type="text"
              name="name"
              placeholder="Your Name"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          )}
          <input
            type="email"
            placeholder="Your Email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <div
            className="password-input-wrapper"
            style={{ position: "relative" }}
          >
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              style={{
                width: "100%",
                paddingRight: "35px",
                borderColor: passwordError ? "rgba(255, 0, 0, 0.7)" : "", // تغيير لون البوردر في حال وجود خطأ
                borderWidth: passwordError ? "1px" : "",
                transition: "border-color 0.3s ease-in-out", // إضافة تأثير انتقال ناعم
              }}
            />
            <span
              style={{
                position: "absolute",
                right: "10px",
                top: "50%",
                transform: "translateY(-50%)",
                cursor: "pointer",
                fontSize: "18px",
              }}
              className="eye-icon"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </span>
          </div>
          {passwordError && (
            <p style={{ color: "rgba(255, 0, 0, 0.7)", fontSize: "0.9em", }}>
              {passwordError}
            </p>
          )}
        </div>

        <button type="submit">
          {currentState === "Sign Up" ? "Create account" : "Login"}
        </button>

        <div className="login-condition">
          <input type="checkbox" required />
          <p>By continuing, I agree to the terms of use & privacy policy</p>
        </div>

        {currentState === "Login" ? (
          <p>
            Create a new account?{" "}
            <span onClick={() => setCurrentState("Sign Up")}>Click here</span>
          </p>
        ) : (
          <p>
            Already have an account?{" "}
            <span onClick={() => setCurrentState("Login")}>Login</span>
          </p>
        )}
      </form>
    </div>
  );
};

export default LoginSignin;