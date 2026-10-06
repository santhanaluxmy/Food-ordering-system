import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Cart.css";

const FALLBACK_IMAGE =
  "https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=900&q=80";

function Cart() {
  const navigate = useNavigate();
  const [cart, setCart] = useState([]);

  useEffect(() => {
    const savedCart =
      JSON.parse(localStorage.getItem("mandhiCart")) || [];

    setCart(savedCart);
  }, []);

  const saveCart = (updatedCart) => {
    setCart(updatedCart);

    localStorage.setItem(
      "mandhiCart",
      JSON.stringify(updatedCart)
    );

    window.dispatchEvent(new Event("cartUpdated"));
  };

  const increaseQuantity = (id) => {
    const updatedCart = cart.map((item) =>
      item.id === id
        ? {
            ...item,
            quantity: (item.quantity || 1) + 1,
          }
        : item
    );

    saveCart(updatedCart);
  };

  const decreaseQuantity = (id) => {
    const updatedCart = cart.map((item) =>
      item.id === id && item.quantity > 1
        ? {
            ...item,
            quantity: item.quantity - 1,
          }
        : item
    );

    saveCart(updatedCart);
  };

  const removeItem = (id) => {
    const updatedCart = cart.filter(
      (item) => item.id !== id
    );

    saveCart(updatedCart);
  };

  const subtotal = cart.reduce(
    (total, item) =>
      total +
      Number(item.price) * Number(item.quantity || 1),
    0
  );

  const deliveryFee = cart.length > 0 ? 250 : 0;

  const total = subtotal + deliveryFee;

  const handleCheckout = () => {
    if (cart.length === 0) {
      return;
    }

    navigate("/checkout");
  };

  if (cart.length === 0) {
    return (
      <div className="cart-page">
        <section className="cart-heading">
          <span>YOUR ORDER</span>
          <h1>Shopping Cart</h1>
          <p>Review your items before checkout.</p>
        </section>

        <section className="empty-cart">
          <div className="empty-cart-icon">
            🛒
          </div>

          <h2>Your cart is empty</h2>

          <p>
            Looks like you haven't added anything delicious yet.
          </p>

          <Link to="/menu">
            Explore Menu
          </Link>
        </section>
      </div>
    );
  }

  return (
    <div className="cart-page">
      <section className="cart-heading">
        <span>YOUR ORDER</span>
        <h1>Shopping Cart</h1>
        <p>
          Review your meals and update quantities before checkout.
        </p>
      </section>

      <div className="cart-layout">
        <section className="cart-items">
          <div className="cart-items-header">
            <h2>Your Items</h2>

            <span>
              {cart.reduce(
                (totalItems, item) =>
                  totalItems + Number(item.quantity || 1),
                0
              )}{" "}
              items
            </span>
          </div>

          {cart.map((item) => (
            <article
              className="cart-item"
              key={item.id}
            >
              <img
                src={item.image || FALLBACK_IMAGE}
                alt={item.name}
                onError={(e) => {
                  e.currentTarget.onerror = null;
                  e.currentTarget.src = FALLBACK_IMAGE;
                }}
              />

              <div className="cart-item-info">
                <h3>{item.name}</h3>

                <p>
                  {item.description ||
                    "Freshly prepared and full of flavour."}
                </p>

                <strong>
                  Rs. {Number(item.price).toLocaleString()}
                </strong>
              </div>

              <div className="cart-item-actions">
                <div className="quantity-control">
                  <button
                    type="button"
                    onClick={() =>
                      decreaseQuantity(item.id)
                    }
                  >
                    −
                  </button>

                  <span>
                    {item.quantity || 1}
                  </span>

                  <button
                    type="button"
                    onClick={() =>
                      increaseQuantity(item.id)
                    }
                  >
                    +
                  </button>
                </div>

                <strong className="item-total">
                  Rs.{" "}
                  {(
                    Number(item.price) *
                    Number(item.quantity || 1)
                  ).toLocaleString()}
                </strong>

                <button
                  type="button"
                  className="remove-button"
                  onClick={() =>
                    removeItem(item.id)
                  }
                >
                  Remove
                </button>
              </div>
            </article>
          ))}

          <Link
            to="/menu"
            className="continue-shopping"
          >
            ← Continue Shopping
          </Link>
        </section>

        <aside className="order-summary">
          <span className="summary-label">
            ORDER SUMMARY
          </span>

          <h2>Summary</h2>

          <div className="summary-row">
            <span>Subtotal</span>

            <strong>
              Rs. {subtotal.toLocaleString()}
            </strong>
          </div>

          <div className="summary-row">
            <span>Delivery Fee</span>

            <strong>
              Rs. {deliveryFee.toLocaleString()}
            </strong>
          </div>

          <div className="summary-divider" />

          <div className="summary-total">
            <span>Total</span>

            <strong>
              Rs. {total.toLocaleString()}
            </strong>
          </div>

          <button
            type="button"
            className="checkout-button"
            onClick={handleCheckout}
          >
            Proceed to Checkout
          </button>

          <p className="summary-note">
            Secure checkout • Freshly prepared food
          </p>
        </aside>
      </div>
    </div>
  );
}

export default Cart;