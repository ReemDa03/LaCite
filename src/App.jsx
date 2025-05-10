import React, { useEffect, useState } from "react";
import { Routes, Route } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import Navbar from "./Components/Navbar/Navbar";
import Header from "./Components/Header/Header";
import ExploreProducts from "./Components/ExploreProducts/ExploreProducts";
import LoginSignin from "./Components/LoginSignin/LoginSignin";
import ProductDetails from "./Pages/ProductDetails/ProductDetails";
import Cart from "./Pages/Cart/Cart";
import AboutLa from "./Components/AboutLa/AboutLa";
import Footer from "./Components/Footer/Footer";

import AdminRoute from "./Components/AdminRoute/AdminRoute";
import Add from "./Pages/Admin/Add";
import List from "./Pages/Admin/List";

const App = () => {
  const [showLogin, setShowLogin] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [selectedSection, setSelectedSection] = useState(null);

  useEffect(() => {
    const savedUser = localStorage.getItem("user");
    if (savedUser) {
      setCurrentUser(JSON.parse(savedUser));
    }
  }, []);

  return (
    <div className="app">
      {showLogin && (
        <LoginSignin
          setShowLogin={setShowLogin}
          setCurrentUser={setCurrentUser}
        />
      )}

      <Navbar
        setShowLogin={setShowLogin}
        currentUser={currentUser}
        setCurrentUser={setCurrentUser}
      />

      <Routes>
        {/* الصفحة الرئيسية */}
        <Route
          path="/"
          element={
            <>
              <Header />
              <ExploreProducts />
            </>
          }
        />

        {/* صفحات المستخدم */}
        <Route path="/#product/:id" element={<ProductDetails />} />
        <Route path="/#cart" element={<Cart />} />

        {/* صفحات الأدمن */}
        <Route
          path="/#add"
          element={
            <AdminRoute>
              <Add />
            </AdminRoute>
          }
        />
        <Route
          path="/#list"
          element={
            <AdminRoute>
              <List />
            </AdminRoute>
          }
        />
      </Routes>

      <Footer onSelectSection={setSelectedSection} />

      {selectedSection && (
        <AboutLa
          sectionTitle={selectedSection}
          onClose={() => setSelectedSection(null)}
        />
      )}

      <ToastContainer position="top-center" autoClose={2000} />
    </div>
  );
};

export default App;
