import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../../services/api";
import "./Checkout.css";

function Checkout() {
  const navigate = useNavigate();

  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [customer, setCustomer] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
  });

  useEffect(() => {
    const savedCart =
      JSON.parse(localStorage.getItem("mandhiCart")) || [];

    setCart(savedCart);

    const savedName =
      localStorage.getItem("customerName") || "";

    setCustomer((previous) => ({
      ...previous,
      name: savedName,
    }));
  }, []);

  const handleChange = (e) => {
    setCustomer({
      ...customer,
      [e.target.name]: e.target.value,
    });
  };

  const subtotal = cart.reduce(
    (total, item) =>
      total +
      Number(item.price) * Number(item.quantity || 1),
    0
  );

  const deliveryFee = cart.length > 0 ? 250 : 0;
  const total = subtotal + deliveryFee;

  const handlePlaceOrder = async (e) => {
    e.preventDefault();

    if (cart.length === 0) {
      setError("Your cart is empty.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      let customerId =
        localStorage.getItem("customerId");

      /*
       * If the customer has not logged in,
       * create a customer using checkout information.
       */
      if (!customerId) {
        const customerResponse = await api.post(
          "/customers/",
          customer
        );

        customerId = customerResponse.data.id;

        localStorage.setItem(
          "customerId",
          customerId
        );
      }

      const orderData = {
        customer_id: Number(customerId),

        items: cart.map((item) => ({
          food_id: item.id,
          quantity: Number(item.quantity || 1),
        })),
      };

      const response = await api.post(
        "/orders/",
        orderData
      );

      localStorage.removeItem("mandhiCart");

      window.dispatchEvent(
        new Event("cartUpdated")
      );

      navigate("/order-confirmation", {
        state: {
          order: response.data,
          customer,
          subtotal,
          deliveryFee,
          total,
        },
      });
    } catch (err) {
      console.error(err);

      const detail = err.response?.data?.detail;

      if (typeof detail === "string") {
        setError(detail);
      } else {
        setError(
          "Unable to place your order. Please check your information."
        );
      }
    } finally {
      setLoading(false);
    }
  };

  if (cart.length === 0) {
    return (
      <div className="checkout-page">
        <div className="checkout-empty">
          <h1>No items to checkout</h1>

          <p>
            Add something delicious from our menu first.
          </p>

          <Link to="/menu">
            Explore Menu
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="checkout-page">
      <section className="checkout-heading">
        <span>ALMOST THERE</span>

        <h1>Checkout</h1>

        <p>
          Enter your delivery information and confirm your order.
        </p>
      </section>

      <div className="checkout-layout">
        {/* CUSTOMER FORM */}

        <section className="checkout-form-section">
          <div className="checkout-section-title">
            <span>1</span>

            <div>
              <h2>Delivery Information</h2>

              <p>
                Where should we deliver your food?
              </p>
            </div>
          </div>

          {error && (
            <div className="checkout-error">
              {error}
            </div>
          )}

          <form
            id="checkout-form"
            onSubmit={handlePlaceOrder}
          >
            <div className="form-group">
              <label>Full Name</label>

              <input
                type="text"
                name="name"
                value={customer.name}
                onChange={handleChange}
                placeholder="Enter your full name"
                minLength="2"
                required
              />
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Email</label>

                <input
                  type="email"
                  name="email"
                  value={customer.email}
                  onChange={handleChange}
                  placeholder="you@example.com"
                  required
                />
              </div>

              <div className="form-group">
                <label>Phone</label>

                <input
                  type="tel"
                  name="phone"
                  value={customer.phone}
                  onChange={handleChange}
                  placeholder="077 123 4567"
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <label>Delivery Address</label>

              <textarea
                name="address"
                value={customer.address}
                onChange={handleChange}
                placeholder="House number, street, city..."
                rows="4"
                required
              />
            </div>

            <div className="delivery-box">
              <div className="delivery-icon">
                🚚
              </div>

              <div>
                <strong>Standard Delivery</strong>

                <p>
                  Fresh food delivered directly to your address.
                </p>
              </div>

              <strong>Rs. 250</strong>
            </div>
          </form>
        </section>

        {/* ORDER SUMMARY */}

        <aside className="checkout-summary">
          <span className="checkout-summary-label">
            YOUR ORDER
          </span>

          <h2>Order Summary</h2>

          <div className="checkout-items">
            {cart.map((item) => (
              <div
                className="checkout-item"
                key={item.id}
              >
                <div>
                  <span className="checkout-quantity">
                    {item.quantity || 1}×
                  </span>

                  <span>{item.name}</span>
                </div>

                <strong>
                  Rs.{" "}
                  {(
                    Number(item.price) *
                    Number(item.quantity || 1)
                  ).toLocaleString()}
                </strong>
              </div>
            ))}
          </div>

          <div className="checkout-divider" />

          <div className="checkout-price-row">
            <span>Subtotal</span>

            <strong>
              Rs. {subtotal.toLocaleString()}
            </strong>
          </div>

          <div className="checkout-price-row">
            <span>Delivery</span>

            <strong>
              Rs. {deliveryFee.toLocaleString()}
            </strong>
          </div>

          <div className="checkout-divider" />

          <div className="checkout-total">
            <span>Total</span>

            <strong>
              Rs. {total.toLocaleString()}
            </strong>
          </div>

          <button
            type="submit"
            form="checkout-form"
            className="place-order-button"
            disabled={loading}
          >
            {loading
              ? "Placing Order..."
              : "Place Order"}
          </button>

          <Link
            to="/cart"
            className="back-to-cart"
          >
            ← Back to Cart
          </Link>
        </aside>
      </div>
    </div>
  );
}

export default Checkout;