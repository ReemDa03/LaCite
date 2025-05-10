import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../../../firebase";
import "./ProductDetails.css";
import { useCart } from "../../Context/CartContext";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const ProductDetails = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [selectedColor, setSelectedColor] = useState("");
  const [selectedSize, setSelectedSize] = useState("");
  const [quantity, setQuantity] = useState(1);
  const { addToCart } = useCart();

  useEffect(() => {
    const fetchProduct = async () => {
      const docRef = doc(db, "products", id);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        setProduct(docSnap.data());
      }
    };
    fetchProduct();
  }, [id]);

  const isValidSelection = () => {
    if (!selectedColor || !selectedSize) {
      toast.warn("Please select Color and Size! ⚠️", {
        position: "top-center",
        autoClose: 3000,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: false,
        draggable: false,
      });
      return false;
    }
    return true;
  };

  const handleAddToCart = () => {
    if (!isValidSelection()) return;

    const productToAdd = {
      id,
      title: product.name,
      price: product.price,
      image: product.mainImage,
      selectedColor,
      selectedSize,
      quantity,
    };

    addToCart(productToAdd);
    toast.success("The product has been added to your cart ✔️");
    setSelectedColor("");
    setSelectedSize("");
    setQuantity(1);
  };

  const handleBuyNow = () => {
    if (!isValidSelection()) return;

    const message = `
 *New Order*
Product: ${product.name} | Price: $${product.price}
Color: ${selectedColor} | Size: ${selectedSize}
Quantity: ${quantity}
Wishing you a delightful shopping experience!
    `;
    const phone = "249997992091";
    const encodedMessage = encodeURIComponent(message);
    window.open(`https://wa.me/${phone}?text=${encodedMessage}`, "_blank");
  };

  if (!product) return <p>Loading...</p>;

  // ✅ تعديل: تأكدنا إن اللون موجود كـ string أو array وتم معالجته
  const availableColors = Array.isArray(product.color)
    ? product.color
    : typeof product.color === "string"
    ? product.color.split(",").map((c) => c.trim())
    : [];

  return (
    <div className="product-details-container">
      {/* ✅ تعديل: نقل زر الرجوع داخل div "header-row" وتنسيقه بدون التأثير على الباقي */}
      <div className="header-row">
        <button className="back-button" onClick={() => navigate(-1)}>
          ←
        </button>
        <h2 className="title">Product Details</h2>
      </div>

      <div className="details-layout">
        <div className="left-section">
          <img
            src={product.mainImage}
            alt={product.name}
            className="main-image"
          />

          {/* ✅ تعديل: إضافة كلاس scrollable حسب طول المعرض */}
          <div
            className={`gallery-scroll ${
              product.gallery?.length > 2 ? "scrollable" : ""
            }`}
          >
            {product.gallery?.map((img, index) => (
              <img
                key={index}
                src={img}
                alt={`gallery-${index}`}
                className="gallery-image"
              />
            ))}
          </div>
        </div>

        <div className="right-section">
          <h2>{product.name}</h2>
          <p className="price">${product.price}</p>

          <div className="options">
            <p>Color:</p>
            <div className="choices">
              {availableColors.map((color, index) => (
                <button
                  key={index}
                  className={`choice-button ${
                    selectedColor === color ? "selected" : ""
                  }`}
                  onClick={() => setSelectedColor(color)}
                >
                  {color}
                </button>
              ))}
            </div>

            <p>Size:</p>
            <div className="choices">
              {product.sizes?.map((size, index) => (
                <button
                  key={index}
                  className={`choice-button ${
                    selectedSize === size ? "selected" : ""
                  }`}
                  onClick={() => setSelectedSize(size)}
                >
                  {size}
                </button>
              ))}
            </div>
          </div>

          <p className="details-title">Details</p>
          <p className="description">{product.description}</p>

          <div className="quantity-control">
            <button onClick={() => setQuantity((q) => Math.max(q - 1, 1))}>
              −
            </button>
            <span>{quantity}</span>
            <button onClick={() => setQuantity((q) => q + 1)}>+</button>
          </div>

          <div className="action-buttons">
            <button className="add-to-cart" onClick={handleAddToCart}>
              Add to Cart
            </button>
            <button className="buy-now" onClick={handleBuyNow}>
              Buy Now
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;
