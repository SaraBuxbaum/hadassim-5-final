import React, { useState } from 'react';
import './ProductAccordion.css';

const ProductAccordion = ({ products, setProducts }) => {
  const [openIndex, setOpenIndex] = useState(null);

  const addProduct = () => {
    setProducts([...products, { id: '', name: '', price: '', minQty: '' }]);
    setOpenIndex(products.length); // פותח את הכרטיס החדש אוטומטית
  };

  const toggleCard = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  const handleFieldChange = (index, field, value) => {
    const updated = [...products];
    updated[index][field] = value;
    setProducts(updated);
  };

  const removeProduct = (index) => {
    const updated = products.filter((_, i) => i !== index);
    setProducts(updated);
    if (openIndex === index) setOpenIndex(null);
    else if (openIndex > index) setOpenIndex(openIndex - 1);
  };

  return (
    <div className="products-container">
      <h2 className="products-title">(: הכנס את המוצרים שהינך מוכר</h2>
      <button type="button" className="add-product-btn" onClick={addProduct}>➕ הוסף מוצר</button>
      {products.map((product, idx) => (
        <div
          className={`product-card ${openIndex === idx ? 'open' : ''}`}
          key={idx}
          onClick={() => toggleCard(idx)}
        >
          <div className="product-header">
            <span>מוצר {idx + 1}</span>
            <button
              className="remove-btn"
              onClick={(e) => {
                e.stopPropagation();
                removeProduct(idx);
              }}
            >
              ✖
            </button>
          </div>
          {openIndex === idx && (
            <div className="product-details">
              <input
                className="product-input"
                placeholder="מזהה"
                value={product.id}
                onClick={(e) => e.stopPropagation()}
                onChange={(e) => handleFieldChange(idx, 'id', e.target.value)}
              />
              <input
                className="product-input"
                placeholder="שם"
                value={product.name}
                onClick={(e) => e.stopPropagation()}
                onChange={(e) => handleFieldChange(idx, 'name', e.target.value)}
              />
              <input
                className="product-input"
                type="number"
                placeholder="מחיר"
                value={product.price}
                onClick={(e) => e.stopPropagation()}
                onChange={(e) => handleFieldChange(idx, 'price', e.target.value)}
              />
              <input
                className="product-input"
                type="number"
                placeholder="כמות מינ׳"
                value={product.minQty}
                onClick={(e) => e.stopPropagation()}
                onChange={(e) => handleFieldChange(idx, 'minQty', e.target.value)}
              />
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default ProductAccordion;
