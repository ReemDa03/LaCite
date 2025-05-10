import React, { useEffect, useState } from "react";
import "./List.css";
import axios from "axios";
import { toast } from "react-toastify";
import { db } from "../../../firebase";
import { collection, getDocs, deleteDoc, doc, getDoc } from "firebase/firestore";
import { useNavigate } from 'react-router-dom';
import { getAuth } from "firebase/auth"; // استيراد دوال Firebase Authentication

const List = () => {
  const [list, setList] = useState([]);
  const [isAdmin, setIsAdmin] = useState(false); // حالة للتحقق إذا كان المستخدم Admin
  const navigate = useNavigate();

  // 🔥 استرجاع البيانات من Firestore
  const fetchList = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, "products"));
      const products = [];
      querySnapshot.forEach((doc) => {
        products.push({ id: doc.id, ...doc.data() });
      });
      setList(products);
    } catch (error) {
      console.error("Error fetching products:", error);
      toast.error("Failed to fetch products");
    }
  };

  // 🔥 حذف منتج مع تأكيد
  const handleDelete = async (id, name) => {
    const confirmDelete = window.confirm(
      `Are you sure you want to delete "${name}"?`
    );
    if (!confirmDelete) return; // ❌ إذا رفض، لا نحذف

    try {
      await deleteDoc(doc(db, "products", id));
      toast.success(`"${name}" deleted successfully`);
      fetchList();
    } catch (error) {
      console.error("Error deleting product:", error);
      toast.error("Failed to delete product");
    }
  };

  useEffect(() => {
    const auth = getAuth();
    const currentUser = auth.currentUser;

    if (!currentUser) {
      navigate('/'); // إذا لم يكن المستخدم مسجلاً دخولًا، قم بتوجيهه لصفحة تسجيل الدخول
    } else {
      const userRef = doc(db, "users", currentUser.uid);
      getDoc(userRef).then((docSnap) => {
        if (docSnap.exists() && docSnap.data().role === "admin") {
          setIsAdmin(true); // إذا كان الدور "admin"، يمكن الوصول إلى الصفحة
          fetchList(); // استرجاع المنتجات فقط إذا كان المستخدم Admin
        } else {
          navigate('/'); // إذا لم يكن Admin، قم بتوجيهه لصفحة تسجيل الدخول
        }
      }).catch((error) => {
        console.error("Error fetching user role:", error);
        navigate('/'); // إذا حدث خطأ، قم بتوجيهه لصفحة تسجيل الدخول
      });
    }
  }, [navigate]);

  // 🔥 دالة لترتيب الأحجام
  const formatSizes = (sizes) => {
    if (Array.isArray(sizes)) {
      return sizes.join(", ");
    } else {
      return "No Sizes";
    }
  };

  if (!isAdmin) {
    return <div>You are not authorized to view this page.</div>; // رسالة إذا لم يكن المستخدم Admin
  }

  return (
    <div className="list" id="list">
      <div className="list add flex-col">
        <p className="to-add">You Wanna Add a New Product? <span onClick={() => navigate('/add')}>Click Here</span></p>
        <p className="titlee">All Products</p>
        <div className="list-table">
          <div className="list-table-format title">
            <p>Image</p>
            <p>Name</p>
            <p>Category</p>
            <p>Gender</p>
            <p>Size</p>
            <p>Color</p>
            <p>Price</p>
            <p>Action</p>
          </div>
          {list.map((item) => (
            <div key={item.id} className="list-table-format">
              <img src={item.mainImage} alt="Product" />
              <p>{item.name}</p>
              <p>{item.category}</p>
              <p>{item.gender}</p>
              <p>{formatSizes(item.sizes)}</p>
              <p>{item.color}</p>
              <p>${item.price}</p>
              <p
                className="cursor"
                onClick={() => handleDelete(item.id, item.name)}
              >
                X
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default List;