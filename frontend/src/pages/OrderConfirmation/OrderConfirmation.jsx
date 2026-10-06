import { Link, useLocation } from "react-router-dom";
import "./OrderConfirmation.css";

function OrderConfirmation() {
  const location = useLocation();

  const order = location.state?.order;
  const customer = location.state?.customer;
  const subtotal = location.state?.subtotal || 0;
  const deliveryFee = location.state?.deliveryFee || 0;
  const total =
    location.state?.total ||
    order?.total_amount ||
    0;

  if (!order) {
    return (
      <div className="confirmation-page">
        <div className="confirmation-missing">
          <div className="missing-icon">🍽️</div>

          <h1>No recent order</h1>

          <p>
            Browse our menu and place your first delicious order.
          </p>

          <Link to="/menu">
            Explore Menu
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="confirmation-page">
      <div className="confirmation-container">
        <section className="success-section">
          <div className="success-icon">
            ✓
          </div>

          <span className="success-label">
            ORDER CONFIRMED
          </span>

          <h1>Thank you for your order!</h1>

          <p>
            Your food order has been received and our kitchen
            will start preparing it soon.
          </p>
        </section>

        <section className="receipt-card">
          <div className="receipt-header">
            <div>
              <span>ORDER RECEIPT</span>
              <h2>mandhi.</h2>
            </div>

            <div className="order-number">
              <small>Order ID</small>

              <strong>
                #{order.id || order.order_id || "NEW"}
              </strong>
            </div>
          </div>

          <div className="receipt-divider" />

          <div className="status-box">
            <div className="status-icon">
              🍳
            </div>

            <div>
              <small>Current Status</small>

              <strong>
                {order.status || "Pending"}
              </strong>
            </div>
          </div>

          {customer && (
            <div className="delivery-details">
              <h3>Delivery Details</h3>

              <div className="detail-row">
                <span>Name</span>
                <strong>{customer.name}</strong>
              </div>

              <div className="detail-row">
                <span>Phone</span>
                <strong>{customer.phone}</strong>
              </div>

              <div className="detail-row">
                <span>Email</span>
                <strong>{customer.email}</strong>
              </div>

              <div className="detail-row address-row">
                <span>Address</span>
                <strong>{customer.address}</strong>
              </div>
            </div>
          )}

          <div className="receipt-divider" />

          <div className="price-details">
            {subtotal > 0 && (
              <div className="price-row">
                <span>Subtotal</span>

                <strong>
                  Rs. {Number(subtotal).toLocaleString()}
                </strong>
              </div>
            )}

            {deliveryFee > 0 && (
              <div className="price-row">
                <span>Delivery Fee</span>

                <strong>
                  Rs. {Number(deliveryFee).toLocaleString()}
                </strong>
              </div>
            )}

            <div className="grand-total">
              <span>Total</span>

              <strong>
                Rs. {Number(total).toLocaleString()}
              </strong>
            </div>
          </div>

          <div className="receipt-message">
            <span>🚚</span>

            <p>
              We'll prepare your meal fresh and deliver it
              to your address.
            </p>
          </div>
        </section>

        <div className="confirmation-actions">
          <Link
            to="/my-orders"
            className="orders-button"
          >
            View My Orders
          </Link>

          <Link
            to="/menu"
            className="menu-button"
          >
            Order More Food
          </Link>
        </div>
      </div>
    </div>
  );
}

export default OrderConfirmation;