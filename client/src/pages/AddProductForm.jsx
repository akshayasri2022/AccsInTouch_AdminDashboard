// src/components/AddProductForm.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/AddProductForm.css";

export default function AddProductForm({ onCancel, onProductAdded }) {
  const navigate = useNavigate();
  
  // Form state - CHANGED: status starts as empty string
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    basePrice: "",
    discountPercentage: "",
    sku: "",
    barcode: "",
    quantity: "",
    weight: "",
    height: "",
    length: "",
    width: "",
    category: "",
    tags: "",
    status: "", // CHANGED: from "in-stock" to ""
    isPhysical: true
  });

  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [popup, setPopup] = useState({ show: false, type: "", message: "" });

  const defaultImage = "https://cdn-icons-png.flaticon.com/512/7486/7486744.png";

  // Show popup
  const showPopup = (type, message) => {
    setPopup({ show: true, type, message });
  };

  // Close popup and navigate
  const closePopup = () => {
    setPopup({ show: false, type: "", message: "" });
    if (popup.type === "success") {
      setTimeout(() => {
        navigate("/ProductManagement");
      }, 100);
    }
  };

  // Handle input changes
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value
    }));
    // Clear error for this field
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: "" }));
    }
  };

  // Handle image upload
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        setErrors(prev => ({ ...prev, image: "Image size should be less than 5MB" }));
        return;
      }
      setImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
      setErrors(prev => ({ ...prev, image: "" }));
    }
  };

  // Validate form - ADDED: status validation
  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) newErrors.name = "Product name is required";
    if (!formData.basePrice || parseFloat(formData.basePrice) <= 0) {
      newErrors.basePrice = "Base price is required";
    }
    if (!formData.category) newErrors.category = "Category is required";
    if (!formData.sku.trim()) newErrors.sku = "SKU is required";
    if (!formData.quantity || parseInt(formData.quantity) < 0) {
      newErrors.quantity = "Quantity is required";
    }
    if (!formData.status) newErrors.status = "Product status is required"; // ADDED

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle form submission (Frontend only)
  const handleSubmit = async () => {
    if (!validateForm()) {
      showPopup("error", "Please fill all mandatory fields");
      return;
    }

    setLoading(true);

    // Simulate network delay
    setTimeout(() => {
      try {
        // Calculate final price with discount
        const finalPrice = formData.discountPercentage 
          ? parseFloat(formData.basePrice) * (1 - parseFloat(formData.discountPercentage) / 100)
          : parseFloat(formData.basePrice);

        // Create new product object
        const newProduct = {
          id: Date.now(),
          name: formData.name.trim(),
          description: formData.description.trim(),
          basePrice: parseFloat(formData.basePrice),
          discountPercentage: formData.discountPercentage || 0,
          finalPrice: parseFloat(finalPrice.toFixed(2)),
          sku: formData.sku.trim(),
          barcode: formData.barcode.trim(),
          quantity: parseInt(formData.quantity),
          weight: formData.weight || 0,
          height: formData.height || 0,
          length: formData.length || 0,
          width: formData.width || 0,
          category: formData.category,
          tags: formData.tags.trim().split(',').map(tag => tag.trim()).filter(tag => tag),
          status: formData.status,
          isPhysical: formData.isPhysical,
          image: imagePreview || defaultImage,
          createdAt: new Date().toISOString()
        };

        console.log("New Product Created:", newProduct);

        // Save to localStorage for persistence
        const existingProducts = JSON.parse(localStorage.getItem('products') || '[]');
        existingProducts.push(newProduct);
        localStorage.setItem('products', JSON.stringify(existingProducts));

        // Notify parent component
        if (onProductAdded) {
          onProductAdded(newProduct);
        }

        showPopup("success", "Product added successfully!");
      } catch (error) {
        console.error("Error adding product:", error);
        showPopup("error", "Failed to add product. Please try again.");
      } finally {
        setLoading(false);
      }
    }, 800);
  };

  function goToProductManagement() {
    navigate("/ProductManagement");
  }

  return (
    <div className="add-product-container full-page">
    
      {/* Popup Modal */}
      {popup.show && (
        <div className="popup-overlay" onClick={closePopup}>
          <div className="popup-modal" onClick={(e) => e.stopPropagation()}>
            <div className={`popup-icon ${popup.type}`}>
              {popup.type === "success" ? (
                <svg width="48" height="48" viewBox="0 0 24 24" fill="none">
                  <path d="M20 6L9 17L4 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              ) : (
                <svg width="48" height="48" viewBox="0 0 24 24" fill="none">
                  <path d="M12 8V12M12 16H12.01M22 12C22 17.5228 17.5228 22 12 22C6.47715 22 2 17.5228 2 12C2 6.47715 6.47715 2 12 2C17.5228 2 22 6.47715 22 12Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              )}
            </div>
            <h3 className="popup-title">
              {popup.type === "success" ? "Success!" : "Error"}
            </h3>
            <p className="popup-message">{popup.message}</p>
            <button className="popup-button" onClick={closePopup}>
              {popup.type === "success" ? "Go to Products" : "Close"}
            </button>
          </div>
        </div>
      )}

      {/* Top bar */}
      <div className="add-product-top top-v2">
        <div className="breadcrumb">
          <span
            className="crumb-link"
            onClick={goToProductManagement}
            role="link"
            tabIndex={0}
          >
            Product
          </span>
          <span className="crumb-sep">›</span>
          <span className="crumb-current">Add Product</span>
        </div>

        <div className="top-buttons">
          <button 
            className="btn cancel outlined" 
            onClick={onCancel || goToProductManagement}
          >
            <span className="btn-text">Cancel</span>
          </button>

          <button 
            className="btn add-product filled" 
            type="button"
            onClick={handleSubmit}
            disabled={loading}
          >
            <span className="btn-text">{loading ? "Adding..." : "Add Product"}</span>
          </button>
        </div>
      </div>

      {/* Main Layout */}
      <div className="add-product-layout">
        {/* Left Column */}
        <div className="add-left">
          {/* General Info */}
          <section className="card">
            <h3 className="card-title">General Information</h3>
            
            <div className="form-row">
              <label className="label">
                Product Name <span className="required">*</span>
              </label>
              <input 
                className={`input ${errors.name ? 'error' : ''}`}
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Type product name here…"
              />
              {errors.name && <span className="error-text">{errors.name}</span>}
            </div>

            <div className="form-row">
              <label className="label">Product Description</label>
              <textarea
                className="textarea"
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Type product description here…"
              />
            </div>
          </section>

          {/* Media */}
          <section className="card">
            <h3 className="card-title">Media</h3>
            <div className="media-dropzone">
              <div className="image-preview-box">
                <img
                  src={imagePreview || defaultImage}
                  alt="Preview"
                  className={imagePreview ? "uploaded-image" : "default-image"}
                />
              </div>

              <div className="media-note">
                Drag and drop image here, or click add image
              </div>

              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                style={{ display: "none" }}
                id="image-upload"
              />
              <label htmlFor="image-upload" className="btn outline small">
                Add Image
              </label>
              {errors.image && <span className="error-text">{errors.image}</span>}
            </div>
          </section>

          {/* Pricing */}
          <section className="card">
            <h3 className="card-title">Pricing</h3>
            
            <div className="form-row">
              <label className="label">
                Base Price <span className="required">*</span>
              </label>
              <input 
                className={`input no-arrows ${errors.basePrice ? 'error' : ''}`}
                name="basePrice"
                type="number"
                value={formData.basePrice}
                onChange={handleChange}
                placeholder="$ Type base price here…"
              />
              {errors.basePrice && <span className="error-text">{errors.basePrice}</span>}
            </div>

            <div className="form-row two">
              <div className="input-wrapper">
                <label className="label">Discount Percentage</label>
                <select 
                  className="select"
                  name="discountPercentage"
                  value={formData.discountPercentage}
                  onChange={handleChange}
                >
                  <option value="">No Discount</option>
                  <option value="5">5%</option>
                  <option value="10">10%</option>
                  <option value="15">15%</option>
                  <option value="20">20%</option>
                  <option value="25">25%</option>
                  <option value="30">30%</option>
                  <option value="35">35%</option>
                  <option value="40">40%</option>
                  <option value="45">45%</option>
                  <option value="50">50%</option>
                </select>
              </div>
              
              {formData.basePrice && formData.discountPercentage && (
                <div className="input-wrapper">
                  <label className="label">Final Price</label>
                  <div className="final-price">
                    ${(parseFloat(formData.basePrice) * (1 - parseFloat(formData.discountPercentage) / 100)).toFixed(2)}
                  </div>
                </div>
              )}
            </div>
          </section>

          {/* Inventory */}
          <section className="card">
            <h3 className="card-title">Inventory</h3>
            <div className="form-row three">
              <div className="input-wrapper">
                <label className="label">
                  SKU <span className="required">*</span>
                </label>
                <input 
                  className={`input ${errors.sku ? 'error' : ''}`}
                  name="sku"
                  value={formData.sku}
                  onChange={handleChange}
                  placeholder="SKU"
                />
                {errors.sku && <span className="error-text">{errors.sku}</span>}
              </div>

              <div className="input-wrapper">
                <label className="label">Barcode</label>
                <input 
                  className="input"
                  name="barcode"
                  value={formData.barcode}
                  onChange={handleChange}
                  placeholder="Barcode"
                />
              </div>

              <div className="input-wrapper">
                <label className="label">
                  Quantity <span className="required">*</span>
                </label>
                <input 
                  className={`input no-arrows ${errors.quantity ? 'error' : ''}`}
                  name="quantity"
                  type="number"
                  value={formData.quantity}
                  onChange={handleChange}
                  placeholder="Quantity"
                />
                {errors.quantity && <span className="error-text">{errors.quantity}</span>}
              </div>
            </div>
          </section>

          {/* Shipping */}
          <section className="card">
            <h3 className="card-title">Shipping</h3>
            <div className="shipping-toggle">
              <input 
                type="checkbox" 
                id="physical"
                name="isPhysical"
                checked={formData.isPhysical}
                onChange={handleChange}
              />
              <label htmlFor="physical">This is a physical product</label>
            </div>
            {formData.isPhysical && (
              <div className="form-row four" style={{ marginTop: 12 }}>
                <div className="input-wrapper">
                  <label className="label">Weight (g)</label>
                  <input 
                    className="input no-arrows"
                    name="weight"
                    type="number"
                    value={formData.weight}
                    onChange={handleChange}
                    placeholder="Weight"
                  />
                </div>

                <div className="input-wrapper">
                  <label className="label">Height (cm)</label>
                  <input 
                    className="input no-arrows"
                    name="height"
                    type="number"
                    value={formData.height}
                    onChange={handleChange}
                    placeholder="Height"
                  />
                </div>

                <div className="input-wrapper">
                  <label className="label">Length (cm)</label>
                  <input 
                    className="input no-arrows"
                    name="length"
                    type="number"
                    value={formData.length}
                    onChange={handleChange}
                    placeholder="Length"
                  />
                </div>

                <div className="input-wrapper">
                  <label className="label">Width (cm)</label>
                  <input 
                    className="input no-arrows"
                    name="width"
                    type="number"
                    value={formData.width}
                    onChange={handleChange}
                    placeholder="Width"
                  />
                </div>
              </div>
            )}
          </section>
        </div>

        {/* Right Sidebar */}
        <div className="add-right">
          <section className="card sidebar-card">
            <h3 className="card-title">Category</h3>
            
            <label className="label">
              Product Category <span className="required">*</span>
            </label>
            <select 
              className={`select ${errors.category ? 'error' : ''}`}
              name="category"
              value={formData.category}
              onChange={handleChange}
            >
              <option value="">Select a category</option>
              <option value="hairbows">Hair Bows</option>
              <option value="claws">Claws</option>
              <option value="scrunchies">Scrunchies</option>
              <option value="earrings">Earrings</option>
            </select>
            {errors.category && <span className="error-text">{errors.category}</span>}

            <label className="label" style={{ marginTop: 16 }}>Product Tags</label>
            <input 
              className="input"
              name="tags"
              value={formData.tags}
              onChange={handleChange}
              placeholder="e.g., summer, colorful, trending"
            />
            <div className="helper-text">Separate tags with commas</div>

            {/* UPDATED: Status field is now mandatory */}
            <label className="label" style={{ marginTop: 16 }}>
              Product Status <span className="required">*</span>
            </label>
            <select 
              className={`select ${errors.status ? 'error' : ''}`}
              name="status"
              value={formData.status}
              onChange={handleChange}
            >
              <option value="">Select status</option>
              <option value="in-stock">In Stock</option>
              <option value="low-stock">Low Stock</option>
              <option value="out-of-stock">Out of Stock</option>
              <option value="discontinued">Discontinued</option>
            </select>
            {errors.status && <span className="error-text">{errors.status}</span>}
          </section>
        </div>
      </div>
    </div>
  );
}