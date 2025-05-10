import React from 'react';
import './ProductCard.css';

const ProductCard = ({ product, onViewDetails }) => {
  return (
    <div className='product-card'>

      {/* نلف الصورة والمعلومات داخل div قابل للنقر للتفاصيل */}
      <div className='clickable-area' onClick={onViewDetails}>
        <img src={product.mainImage} alt={product.name} className='product-image' />
        <div className='product-info'>
          <p className='product-name'>{product.name}</p>
          <p className='product-price'>${product.price}</p>
        </div>
      </div>


    </div>
  );
};

export default ProductCard;
