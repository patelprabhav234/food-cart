import React, { useEffect, useState } from 'react';
import './PostList.css';

function PostList() {
  const [posts, setPosts] = useState([]);
  const [filteredPosts, setFilteredPosts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [cart, setCart] = useState([]);

  useEffect(() => {
    fetch('https://dummyjson.com/recipes')
      .then((response) => response.json())
      .then((data) => {
        setPosts(data.recipes);
        setFilteredPosts(data.recipes);
        const allTags = data.recipes.flatMap(recipe => recipe.tags);
        const uniqueTags = [...new Set(allTags)];
        setCategories(uniqueTags);
        setLoading(false);
      })
      .catch(() => {
        setError('Failed to load posts');
        setLoading(false);
      });
  }, []);

  const handleCategoryClick = (category) => {
    setSelectedCategory(category);
    const filtered = posts.filter(post => post.tags.includes(category));
    setFilteredPosts(filtered);
  };

  const clearFilter = () => {
    setSelectedCategory(null);
    setFilteredPosts(posts);
  };

  const addToCart = (item) => {
    setCart([...cart, item]);
  };

  const handlePayment = () => {
    alert("Payment Successful!\nThanks for your order.");
    setCart([]);
  };

  const orderNow = (item) => {
    setCart([item]);  // Optional: Replace cart with this item for single-order flow
    setTimeout(() => {
      handlePayment();
    }, 300); // Short delay to simulate processing
  };

  if (loading) return <div className="text-center loading">Loading...</div>;
  if (error) return <div className="alert alert-danger">{error}</div>;

  return (
    <div className="post-list-container">
      <h1 className='food'>Food Cart</h1>

      {/* About Us */}
      <section className="mb-4 bg-light p-3 rounded">
        <h3>About Us</h3>
        <p>Welcome to our Food Cart! We provide delicious recipes from around the world. Order and enjoy your favorites.</p>
      </section>

      {/* Categories */}
      <section className="categories-section">
        <h3 className="section-title">Categories</h3>
        <div className="categories-wrapper">
          {categories.map((cat, index) => (
            <button
              key={index}
              className={`category-btn ${selectedCategory === cat ? 'active' : ''}`}
              onClick={() => handleCategoryClick(cat)}
            >
              {cat}
            </button>
          ))}
          {selectedCategory && (
            <button className="category-btn clear-btn" onClick={clearFilter}>
              Clear Filter
            </button>
          )}
        </div>
      </section>

      {/* Recipes */}
      <div className="row">
        {filteredPosts.map(post => (
          <div key={post.id} className="col-md-6 col-lg-4 mb-4">
            <div className="card recipe-card shadow">
              <img src={post.image} alt={post.name} className="card-img-top" />
              <div className="card-body">
                <h5 className="card-title">{post.name}</h5>
                <p className="small"><strong>Difficulty:</strong> {post.difficulty}</p>
                <p className="small"><strong>Prep:</strong> {post.prepTimeMinutes} min | <strong>Cook:</strong> {post.cookTimeMinutes} min</p>
                <p className="small"><strong>Servings:</strong> {post.servings} | <strong>Calories:</strong> {post.caloriesPerServing} kcal</p>
                <p className="small"><strong>Rating:</strong> ⭐ {post.rating} ({post.reviewCount})</p>

                <p><strong>Ingredients:</strong></p>
                <ul className="ingredients-list">
                  {post.ingredients.map((item, index) => (
                    <li key={index}>{item}</li>
                  ))}
                </ul>

                <p><strong>Instructions:</strong></p>
                <ol className="instructions-list">
                  {post.instructions.map((step, index) => (
                    <li key={index}>{step}</li>
                  ))}
                </ol>

                <div className="tags">
                  {post.tags.map((tag, index) => (
                    <span key={index} className="badge bg-secondary">{tag}</span>
                  ))}
                </div>

                <div className="d-flex gap-2 mt-2">
                  <button className="btn btn-success flex-fill" onClick={() => addToCart(post)}>
                    Add to Cart
                  </button>
                  <button className="btn btn-warning flex-fill" onClick={() => orderNow(post)}>
                    Order Now
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Cart Section */}
      <section className="mt-4">
        <h3>Your Order</h3>
        {cart.length === 0 ? (
          <p>No items in cart.</p>
        ) : (
          <>
            <ul className="list-group mb-3">
              {cart.map((item, index) => (
                <li key={index} className="list-group-item d-flex justify-content-between">
                  {item.name} <span>{item.caloriesPerServing} kcal</span>
                </li>
              ))}
            </ul>
            <button className="btn btn-primary" onClick={handlePayment}>
              Proceed to Payment
            </button>
          </>
        )}
      </section>

      {/* Simple Chatbot */}
      <section className="chatbot mt-5 bg-light p-3 rounded">
        <h5>Chatbot Assistant</h5>
        <p>👋 Hi! Need help? You can search by categories, add food to your cart, and pay online. Bon appétit!</p>
      </section>
    </div>
  );
}

export default PostList;
