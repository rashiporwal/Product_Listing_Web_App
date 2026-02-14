import React, { useEffect, useState } from "react";
import "./App.css";
import axios from "axios";

const App = () => {
  const [products, setProducts] = useState([]);
  const [visibleCount, setVisibleCount] = useState(10);
  const [error, setError] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [loading, setLoading] = useState(false); 

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true); // start loading
      try {
        const res = await axios.get("https://fakestoreapi.com/products");
        setProducts(res.data);
      } catch (err) {
        setError("Failed to load data");
      } finally {
        setLoading(false); // stop loading
      }
    };
    fetchProducts();
  }, []);

  const categories = ["All", ...new Set(products.map((p) => p.category))];
  
  {/* filtering Products */}
  const filteredProducts =
    selectedCategory === "All"
      ? products.slice(0, visibleCount)
      : products
          .filter((p) => p.category === selectedCategory)
          .slice(0, visibleCount);

  const handleShowMore = () => {
    setVisibleCount((prev) => prev + 10);
  };

  return (
    <div className="main">
      <h1 className="shop-title">Shop-Store</h1>
      {error && <p>{error}</p>}

      {/* Dropdown */}
      <div className="dropdown-container">
        <label htmlFor="category">Filter by Category: </label>
        <select
          id="category"
          value={selectedCategory}
          onChange={(e) => {
            setSelectedCategory(e.target.value);
            setVisibleCount(10);
          }}
          className="dropdown"
        >
          {categories.map((cat, index) => (
            <option value={cat} key={index}>
              {cat}
            </option>
          ))}
        </select>
      </div>

      {/* Loading Indicator */}
      {loading ? (
        <div className="loading-spinner">
          <div className="spinner"></div>
          <p>Loading products...</p>
        </div>
      ) : (
        <> 
          <div className="product-container">
            {filteredProducts.map((product) => (
              <div key={product.id} className="product-card">
                <img src={product.image} alt={product.title} />
                <h3>{product.title}</h3>
                <p className="category">{product.category}</p>
                <p className="price">${product.price}</p>
              </div>
            ))}
          </div>

          {/* Show More Button */}
          {filteredProducts.length <
            products.filter((p) =>
              selectedCategory === "All"
                ? true
                : p.category === selectedCategory,
            ).length && (
            <div className="showmore-container">
              <button
                type="button"
                onClick={handleShowMore}
                className="showmore-btn"
              >
                Show More
              </button>
            </div>
          )}
        </>
      )}

      {/* footer */}
      <footer className="footer">
        <p>© 2026 Shop-Store.All rights reserved</p>
      </footer>
    </div>
  );
};

export default App;
