import { useEffect, useState } from "react";
import "./App.css";

function App() {

  const [products, setProducts] = useState([]);
  const [cart, setCart] = useState([]);
  const [page, setPage] = useState("home");

  const itemsPerPage = 10;
  const [currentPage, setCurrentPage] = useState(1);
useEffect(() => {
  Promise.all([
    fetch("https://dummyjson.com/products/category/smartphones").then(res => res.json()),
    fetch("https://dummyjson.com/products/category/laptops").then(res => res.json()),
    fetch("https://dummyjson.com/products/category/tablets").then(res => res.json()),
    fetch("https://dummyjson.com/products?limit=76").then(res => res.json())
  ])
  .then(([phones, laptops, tablets, allProducts]) => {

    const combinedProducts = [
      ...phones.products,
      ...laptops.products,
      ...tablets.products,
      ...allProducts.products
    ];

    setProducts(combinedProducts);

  })
  .catch(error => console.error("Error fetching products:", error));
}, []);

  const addToCart = (product) => {

    const existing = cart.find(item => item.id === product.id);

    if (existing) {

      const updatedCart = cart.map(item =>
        item.id === product.id
          ? { ...item, quantity: item.quantity + 1 }
          : item
      );

      setCart(updatedCart);

    } else {

      setCart([...cart, { ...product, quantity: 1 }]);

    }

  };

  const removeFromCart = (id) => {
    const updatedCart = cart.filter(item => item.id !== id);
    setCart(updatedCart);
  };

  const increaseQty = (id) => {

    const updatedCart = cart.map(item =>
      item.id === id
        ? { ...item, quantity: item.quantity + 1 }
        : item
    );

    setCart(updatedCart);

  };

  const decreaseQty = (id) => {

    const updatedCart = cart.map(item =>
      item.id === id && item.quantity > 1
        ? { ...item, quantity: item.quantity - 1 }
        : item
    );

    setCart(updatedCart);

  };

  const start = (currentPage - 1) * itemsPerPage;
  const selectedProducts = products.slice(start, start + itemsPerPage);

  const totalPages = Math.ceil(products.length / itemsPerPage);

  return (
    <div className="app">

      <header className="header">

        <h1>Product Pagination App</h1>

        <div className="header-buttons">

          <button
            className="cart-btn"
            onClick={() => setPage("cart")}
          >
            🛒 CART ({cart.length})
          </button>

          <button
            className="home-btn"
            onClick={() => setPage("home")}
          >
            🏠 Home
          </button>

        </div>

      </header>


      {page === "home" && (

        <>
          <div className="product-grid">

            {selectedProducts.map((product) => (

              <div key={product.id} className="card">

                <img src={product.thumbnail} alt={product.title} />

                <h3>{product.title}</h3>

                <p>{product.description.slice(0, 60)}...</p>

                <h4>${product.price}</h4>

                <button
                  className="add-btn"
                  onClick={() => addToCart(product)}
                >
                  Add to Cart
                </button>

              </div>

            ))}

          </div>


          <div className="pagination">

            <button
              className="page-btn"
              disabled={currentPage === 1}
              onClick={() => setCurrentPage(currentPage - 1)}
            >
              Previous
            </button>

            {[...Array(totalPages)].map((_, index) => (

              <button
                key={index}
                className={
                  currentPage === index + 1
                    ? "page-number active"
                    : "page-number"
                }
                onClick={() => setCurrentPage(index + 1)}
              >
                {index + 1}
              </button>

            ))}

            <button
              className="page-btn"
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage(currentPage + 1)}
            >
              Next
            </button>

          </div>

        </>
      )}


      {page === "cart" && (

        <div className="cart-page">

          <h2>Your Cart</h2>

          {cart.length === 0 ? (

            <p>Cart is Empty</p>

          ) : (

            cart.map((item) => (

              <div key={item.id} className="cart-item">

                <img src={item.thumbnail} alt={item.title} />

                <div className="cart-details">

                  <h3>{item.title}</h3>

                  <p>${item.price}</p>

                  <div className="quantity">

                    <span>Quantity</span>

                    <button onClick={() => decreaseQty(item.id)}> - </button>

                    <span>{item.quantity}</span>

                    <button onClick={() => increaseQty(item.id)}> + </button>

                  </div>

                </div>

                <button
                  className="remove-btn"
                  onClick={() => removeFromCart(item.id)}
                >
                  Remove
                </button>

              </div>

            ))

          )}

        </div>

      )}

    </div>
  );
}

export default App;