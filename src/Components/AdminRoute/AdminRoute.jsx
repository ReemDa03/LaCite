import React, { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { onAuthStateChanged } from "firebase/auth";
import { auth, adminUID } from "../../../firebase";
import { toast } from "react-toastify";

const AdminRoute = ({ children }) => {
  const [checking, setChecking] = useState(true);
  const [authorized, setAuthorized] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user && user.uid === adminUID) {
        setAuthorized(true);
      } else {
        toast.error("Access Denied. Admin only.");
      }
      setChecking(false);
    });

    return () => unsubscribe();
  }, []);

  if (checking) return <p>Loading...</p>; // أو حطي لودر

  return authorized ? children : <Navigate to="/" />;
};

export default AdminRoute;
