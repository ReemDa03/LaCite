import React, { useState, useRef, useEffect } from "react";
import axios from "axios";
import { db } from "../../../firebase";
import { collection, addDoc } from "firebase/firestore";
import "./Add.css";
import { toast } from "react-toastify";
import { FiUploadCloud } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import { getAuth } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";

const Add = ({ currentUser }) => {
  const navigate = useNavigate();
  const mainImageInputRef = useRef(null);
  const galleryImagesInputRef = useRef(null);

  // States
  const [currentUserUID, setCurrentUserUID] = useState(null);
  const [productName, setProductName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [category, setCategory] = useState("");
  const [color, setColor] = useState("");
  const [gender, setGender] = useState("Women");
  const [sizes, setSizes] = useState("");
  const [mainImage, setMainImage] = useState(null);
  const [galleryImages, setGalleryImages] = useState([]);

  const [uploadingMainImage, setUploadingMainImage] = useState(false);
  const [uploadingGalleryImages, setUploadingGalleryImages] = useState(false);
  const [mainImageURL, setMainImageURL] = useState("");
  const [galleryImageURLs, setGalleryImageURLs] = useState([]);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const auth = getAuth();
    const currentUser = auth.currentUser;

    if (!currentUser) {
      navigate("/"); // إذا لم يكن المستخدم مسجلاً دخولًا، قم بتوجيهه لصفحة تسجيل الدخول
    } else {
      const userRef = doc(db, "users", currentUser.uid);
      getDoc(userRef)
        .then((docSnap) => {
          if (docSnap.exists() && docSnap.data().role === "admin") {
            setIsAdmin(true); // إذا كان الدور "admin"، يمكن الوصول إلى الصفحة
          } else {
            navigate("/"); // إذا لم يكن Admin، قم بتوجيهه لصفحة تسجيل الدخول
          }
        })
        .catch((error) => {
          console.error("Error fetching user role:", error);
          navigate("/"); // إذا حدث خطأ، قم بتوجيهه لصفحة تسجيل الدخول
        });
    }
  }, [navigate]);

  if (!isAdmin) {
    return <div>You are not authorized to view this page.</div>; // رسالة إذا لم يكن المستخدم Admin
  }

  // ✅ رفع صورة رئيسية
  const uploadMainImage = async () => {
    if (!mainImage) return;
    setUploadingMainImage(true);

    const formData = new FormData();
    formData.append("file", mainImage);
    formData.append("upload_preset", "react_upload");

    try {
      const res = await axios.post(
        "https://api.cloudinary.com/v1_1/dwupyymoc/image/upload",
        formData
      );
      setMainImageURL(res.data.secure_url);
      toast.success("Main image uploaded!");
    } catch (err) {
      console.error("Error uploading main image:", err);
      toast.error("Failed to upload main image.");
    } finally {
      setUploadingMainImage(false);
    }
  };

  // ✅ رفع صور متعددة
  const uploadGalleryImages = async () => {
    if (!galleryImages.length) return;
    setUploadingGalleryImages(true);
    const urls = [];

    for (const image of galleryImages) {
      const formData = new FormData();
      formData.append("file", image);
      formData.append("upload_preset", "react_upload");

      try {
        const res = await axios.post(
          "https://api.cloudinary.com/v1_1/dwupyymoc/image/upload",
          formData
        );
        urls.push(res.data.secure_url);
      } catch (err) {
        console.error("Error uploading gallery image:", err.message);
        toast.error("Some gallery images failed to upload.");
      }
    }

    setGalleryImageURLs(urls);
    setUploadingGalleryImages(false);
    toast.success("Gallery images uploaded!");
  };

  // ✅ إضافة منتج
  const handleAddProduct = async () => {
    if (
      !productName ||
      !description ||
      !price ||
      !category ||
      !color ||
      !gender ||
      !sizes ||
      !mainImageURL ||
      galleryImageURLs.length === 0
    ) {
      return toast.error("Please fill all fields and upload images.");
    }

    const productData = {
      name: productName,
      description,
      price,
      category,
      color,
      gender,
      sizes: sizes.split(",").map((s) => s.trim()),
      mainImage: mainImageURL,
      gallery: galleryImageURLs,
      createdAt: new Date(),
    };

    try {
      await addDoc(collection(db, "products"), productData);
      toast.success("Product added successfully!");

      // Reset fields
      setProductName("");
      setDescription("");
      setPrice("");
      setCategory("");
      setColor("");
      setGender("Women");
      setSizes("");
      setMainImage(null);
      setGalleryImages([]);
      setMainImageURL("");
      setGalleryImageURLs([]);
      mainImageInputRef.current.value = "";
      galleryImagesInputRef.current.value = "";
    } catch (err) {
      console.error("Error adding product:", err);
      toast.error("Failed to add product.");
    }
  };

  return (
    <div className="add" id="add">
      <form className="flex-col">
        <p className="to-list">
          You Wanna See All Products?{" "}
          <span onClick={() => navigate("/list")}>Click Here</span>
        </p>

        {/* رفع صورة رئيسية */}
        <div className="add-image-upload flex-col">
          <p>Upload Main Image</p>
          <label htmlFor="image">
            {mainImage ? (
              <img
                src={
                  typeof mainImage === "string"
                    ? mainImage
                    : URL.createObjectURL(mainImage)
                }
                alt="Main Preview"
              />
            ) : (
              <FiUploadCloud size={80} color="#ccc" />
            )}
          </label>
          <input
            ref={mainImageInputRef}
            type="file"
            id="image"
            hidden
            accept="image/*"
            onChange={(e) => setMainImage(e.target.files[0])}
          />
          <button
            className="btn-img"
            onClick={(e) => {
              e.preventDefault();
              uploadMainImage();
            }}
            disabled={uploadingMainImage}
          >
            {uploadingMainImage ? "Uploading..." : "Upload"}
          </button>
        </div>

        {/* باقي الحقول مثل الاسم والوصف والصور */}
        <div className="add-product-name flex-col">
          <p className="p-name">Product name</p>
          <input
            className="p-name"
            type="text"
            name="name"
            placeholder="Type here"
            value={productName}
            onChange={(e) => setProductName(e.target.value)}
          />
        </div>

        {/* باقي الحقول */}
        {/* ... */}
        <div>
          <label className="p-name">Upload More Photos:</label>
          <input
            className="p-name"
            ref={galleryImagesInputRef}
            type="file"
            multiple
            accept="image/*"
            onChange={(e) => setGalleryImages([...e.target.files])}
          />
          <button
            className="sec-btn"
            onClick={(e) => {
              e.preventDefault();
              uploadGalleryImages();
            }}
            disabled={uploadingGalleryImages}
          >
            {uploadingGalleryImages ? "Uploading..." : "Upload Now"}
          </button>
        </div>
        {/* الوصف */}
        <div className="add-product-description flex-col">
          <p className="p-name">Product description</p>
          <textarea
            className="p-name"
            name="description"
            rows="6"
            placeholder="Write content here"
            required
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          ></textarea>
        </div>
        {/* القسم */}
        <div className="add-section flex-col">
          <p className="p-name">Add section</p>
          <input
            className="p-name"
            type="text"
            placeholder="Pants / T-shirt ..."
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          />
        </div>
        {/* اللون */}
        <div className="add-color flex-col">
          <p className="p-name">Add color</p>
          <input
            className="p-name"
            type="text"
            placeholder="blue, red, yellow ..."
            value={color}
            onChange={(e) => setColor(e.target.value)}
          />
        </div>

        {/* المقاسات */}
        <div className="add-size flex-col">
          <p className="p-name">Add sizes</p>
          <input
            className="p-name"
            type="text"
            placeholder="L, XL, M ..."
            value={sizes}
            onChange={(e) => setSizes(e.target.value)}
          />
        </div>
        {/* الفئة والسعر */}
        <div className="add-category-price">
          <div className="add-category flex-col">
            <p className="p-name">Product Category</p>
            <select
              className="p-name"
              value={gender}
              onChange={(e) => setGender(e.target.value)}
            >
              <option value="Women">Women</option>
              <option value="Men">Men</option>
              <option value="Kids">Kids</option>
              <option value="Abaya">Abaya</option>
              <option value="Shoes">Shoes</option>
              <option value="Jewelry">Jewelry</option>
              <option value="Bags">Bags</option>
              <option value="New">New</option>
              <option value="Makeup">Makeup</option>
              <option value="Heels">Heels</option>
            </select>
          </div>
          <div className="add-price flex-col">
            <p className="p-name">Product price</p>
            <input
              className="p-name"
              type="number"
              placeholder="$22"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
            />
          </div>
        </div>

        {/* زر الإضافة */}
        <button type="button" className="add-button" onClick={handleAddProduct}>
          ADD
        </button>
      </form>
      <hr />
    </div>
  );
};

export default Add;