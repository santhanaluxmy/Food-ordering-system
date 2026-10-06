import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../../services/api";
import "./MyOrders.css";

function MyOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const customerId = localStorage.getItem("customerId");

  useEffect(() => {
    const fetchOrders = async () => {
      if (!customerId) {
        setLoading(false);
        return;
      }

      try {
        const response = await api.get(
          `/orders/customer/${customerId}`
        );

        const data = Array.isArray(response.data)
          ? response.data
          : response.data.orders || [];

        setOrders(data);
      } catch (err) {
        console.error(err);

        setError(
          "Unable to load your previous orders."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [customerId]);

  const formatDate = (date) => {
    if (!date) {
      return "Recently";
    }

    return new Date(date).toLocaleDateString(
      "en-LK",
      {
        year: "numeric",
        month: "short",
        day: "numeric",
      }
    );
  };

  const getStatusClass = (status) => {
    if (!status) {
      return "pending";
    }

    return status
      .toLowerCase()
      .replaceAll(" ", "-");
  };

  if (!customerId) {
    return (
      <div className="my-orders-page">
        <section className="orders-header">
          <span>YOUR ORDERS</span>
          <h1>My Orders</h1>
        </section>

        <div className="orders-empty">
          <div className="orders-empty-icon">
            🔐
          </div>

          <h2>Login to view your orders</h2>

          <p>
            Login to your Mandhi account to see your
            previous orders.
          </p>

          <Link to="/login">
            Login
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="my-orders-page">
      <section className="orders-header">
        <span>ORDER HISTORY</span>

        <h1>My Orders</h1>

        <p>
          Track your current orders and view your
          previous orders.
        </p>
      </section>

      {loading ? (
        <div className="orders-message">
          Loading your orders...
        </div>
      ) : error ? (
        <div className="orders-error">
          {error}
        </div>
      ) : orders.length === 0 ? (
        <div className="orders-empty">
          <div className="orders-empty-icon">
            🍽️
          </div>

          <h2>No orders yet</h2>

          <p>
            Your delicious journey starts here.
            Explore our menu and place your first order.
          </p>

          <Link to="/menu">
            Explore Menu
          </Link>
        </div>
      ) : (
        <section className="orders-container">
          {orders.map((order) => (
            <article
              className="order-card"
              key={order.id}
            >
              <div className="order-card-header">
                <div>
                  <span className="order-small-label">
                    ORDER
                  </span>

                  <h2>#{order.id}</h2>
                </div>

                <span
                  className={`order-status ${getStatusClass(
                    order.status
                  )}`}
                >
                  {order.status || "Pending"}
                </span>
              </div>

              <div className="order-information">
                <div>
                  <span>Order Date</span>

                  <strong>
                    {formatDate(order.created_at)}
                  </strong>
                </div>

                <div>
                  <span>Total Amount</span>

                  <strong className="order-price">
                    Rs.{" "}
                    {Number(
                      order.total_amount || 0
                    ).toLocaleString()}
                  </strong>
                </div>
              </div>

              {order.items &&
                order.items.length > 0 && (
                  <div className="order-items-list">
                    <h3>Items</h3>

                    {order.items.map(
                      (item, index) => (
                        <div
                          className="history-item"
                          key={
                            item.id ||
                            `${order.id}-${index}`
                          }
                        >
                          <span>
                            {item.food?.name ||
                              item.food_name ||
                              `Food #${item.food_id}`}
                          </span>

                          <span>
                            × {item.quantity}
                          </span>

                          <strong>
                            Rs.{" "}
                            {Number(
                              item.subtotal ||
                                Number(
                                  item.unit_price || 0
                                ) *
                                  Number(
                                    item.quantity || 1
                                  )
                            ).toLocaleString()}
                          </strong>
                        </div>
                      )
                    )}
                  </div>
                )}

              <div className="order-card-footer">
                <div className="order-progress">
                  <span
                    className={
                      order.status === "Cancelled"
                        ? "progress-dot cancelled-dot"
                        : "progress-dot"
                    }
                  />

                  <p>
                    {order.status === "Delivered"
                      ? "Your order has been delivered."
                      : order.status === "Cancelled"
                      ? "This order was cancelled."
                      : order.status ===
                        "Out for Delivery"
                      ? "Your order is on the way."
                      : order.status === "Preparing"
                      ? "Your food is being prepared."
                      : order.status === "Confirmed"
                      ? "Your order has been confirmed."
                      : "We have received your order."}
                  </p>
                </div>
              </div>
            </article>
          ))}
        </section>
      )}

      <div className="orders-bottom">
        <Link to="/menu">
          + Order Something Delicious
        </Link>
      </div>
    </div>
  );
}

export default MyOrders;