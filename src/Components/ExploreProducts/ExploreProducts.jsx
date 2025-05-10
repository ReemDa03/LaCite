import React, { useEffect, useState, useRef } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../../../firebase";
import { useNavigate } from "react-router-dom";
import "./ExploreProducts.css";
import ProductCard from "../ProductCard/ProductCard";
import { useCart } from "../../Context/CartContext.jsx";

const ExploreProducts = () => {
  const [categories, setCategories] = useState([]);
  const [activeCategory, setActiveCategory] = useState(null);
  const [allProducts, setAllProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [visibleCount, setVisibleCount] = useState(16);
  const [isTransitioning, setIsTransitioning] = useState(false);

  const { addToCart, removeFromCart, cartItems } = useCart();
  const navigate = useNavigate();
  const categoriesRef = useRef(null);

  const scrollCategories = () => {
    if (categoriesRef.current) {
      categoriesRef.current.scrollBy({ left: 200, behavior: "smooth" });
    }
  };

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "categories"));
        const categoryData = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setCategories(categoryData);
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };
    fetchCategories();
  }, []);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "products"));
        const productData = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setAllProducts(productData);
        setFilteredProducts(productData);
        setVisibleCount(16);
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };
    fetchProducts();
  }, []);

  const handleCategoryClick = (categoryName) => {
    setIsTransitioning(true);

    setTimeout(() => {
      if (activeCategory === categoryName) {
        setActiveCategory(null);
        setFilteredProducts(allProducts);
      } else {
        setActiveCategory(categoryName);
        const filtered = allProducts.filter(
          (product) =>
            product.gender?.toLowerCase() === categoryName.toLowerCase()
        );
        setFilteredProducts(filtered);
      }
      setVisibleCount(16);
      setIsTransitioning(false);
    }, 300);
  };

  const handleViewDetails = (productId) => {
    navigate(`/product/${productId}`);
  };

  const handleViewMore = () => {
    setIsTransitioning(true);

    setTimeout(() => {
      setVisibleCount(filteredProducts.length);
      setIsTransitioning(false);
    }, 300);
  };

  return (
    <div className="explore-products" id="explore-products">
      <h1>Explore Our Products</h1>

      <div className="explore-text-row">
        <p className="explore-text">
          Explore our collection of handpicked products – stylish, practical,
          and made just for you. Find your next favorite piece today!
        </p>
        <div className="scroll-button-wrapper">
          <button className="scroll-button" onClick={scrollCategories}>
            ➤
          </button>
        </div>
      </div>

      <div className="explore-products-list" ref={categoriesRef}>
        {categories.map((category) => (
          <div
            className={`category-card ${
              activeCategory === category.name ? "active" : ""
            }`}
            key={category.id}
            onClick={() => handleCategoryClick(category.name)}
          >
            <img
              src={category.image}
              alt={category.name}
              className={`category-image ${
                activeCategory === category.name ? "active" : ""
              }`}
            />
            <p className="category-name">
              {category.name.charAt(0).toUpperCase() + category.name.slice(1)}
            </p>
          </div>
        ))}
      </div>

      <hr />

      <div className={`product-list ${isTransitioning ? "hidden" : ""}`}>
        {filteredProducts.length > 0 ? (
          filteredProducts.slice(0, visibleCount).map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              quantity={cartItems[product.id]?.quantity || 0}
              onAdd={() => addToCart(product)}
              onRemove={() => removeFromCart(product)}
              onViewDetails={() => handleViewDetails(product.id)}
            />
          ))
        ) : (
          <p className="no-products">No products found.</p>
        )}
      </div>

      {visibleCount < filteredProducts.length && (
        <div className="view-more-container">
          <button className="view-more-button" onClick={handleViewMore}>
            View More
          </button>
        </div>
      )}
    </div>
  );
};

export default ExploreProducts;
