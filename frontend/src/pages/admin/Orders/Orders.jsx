import { useEffect, useState } from "react";
import api from "../../../services/api";
import "./Orders.css";

const ORDER_STATUSES = [
  "Pending",
  "Confirmed",
  "Preparing",
  "Out for Delivery",
  "Delivered",
  "Cancelled",
];

function Orders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState(null);

  const [filter, setFilter] = useState("All");
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await api.get("/orders/");

      const data = Array.isArray(response.data)
        ? response.data
        : response.data.orders || [];

      setOrders(data);
    } catch (err) {
      console.error("Order loading error:", err);
      setError("Unable to load customer orders.");
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      setUpdatingId(orderId);
      setError("");
      setMessage("");

      await api.put(`/orders/${orderId}/status`, {
        status: newStatus,
      });

      setOrders((previousOrders) =>
        previousOrders.map((order) =>
          order.id === orderId
            ? {
                ...order,
                status: newStatus,
              }
            : order
        )
      );

      setMessage(
        `Order #${orderId} updated to ${newStatus}.`
      );

      setTimeout(() => {
        setMessage("");
      }, 2500);
    } catch (err) {
      console.error("Status update error:", err);

      const detail = err.response?.data?.detail;

      setError(
        typeof detail === "string"
          ? detail
          : "Unable to update order status."
      );
    } finally {
      setUpdatingId(null);
    }
  };

  const formatDate = (date) => {
    if (!date) return "Recently";

    return new Date(date).toLocaleString("en-LK", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getStatusClass = (status) => {
    if (!status) return "pending";

    return status
      .toLowerCase()
      .replaceAll(" ", "-");
  };

  const filteredOrders =
    filter === "All"
      ? orders
      : orders.filter(
          (order) => order.status === filter
        );

  const pendingCount = orders.filter(
    (order) => order.status === "Pending"
  ).length;

  const deliveredCount = orders.filter(
    (order) => order.status === "Delivered"
  ).length;

  const totalRevenue = orders
    .filter((order) => order.status === "Delivered")
    .reduce(
      (total, order) =>
        total + Number(order.total_amount || 0),
      0
    );

  return (
    <div className="admin-orders-page">
      <section className="admin-orders-heading">
        <div>
          <span>ORDER MANAGEMENT</span>

          <h1>Customer Orders</h1>

          <p>
            View customer orders and manage their
            delivery status.
          </p>
        </div>

        <button
          type="button"
          className="refresh-orders-button"
          onClick={fetchOrders}
        >
          Refresh Orders
        </button>
      </section>

      <section className="order-overview">
        <div className="order-overview-card">
          <span>Total Orders</span>
          <strong>{orders.length}</strong>
        </div>

        <div className="order-overview-card">
          <span>Pending</span>
          <strong>{pendingCount}</strong>
        </div>

        <div className="order-overview-card">
          <span>Delivered</span>
          <strong>{deliveredCount}</strong>
        </div>

        <div className="order-overview-card revenue">
          <span>Delivered Revenue</span>

          <strong>
            Rs. {totalRevenue.toLocaleString()}
          </strong>
        </div>
      </section>

      {message && (
        <div className="admin-order-success">
          ✓ {message}
        </div>
      )}

      {error && (
        <div className="admin-order-error">
          {error}
        </div>
      )}

      <section className="order-filter-section">
        <div>
          <span>FILTER ORDERS</span>
          <h2>All Orders</h2>
        </div>

        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
        >
          <option value="All">All Statuses</option>

          {ORDER_STATUSES.map((status) => (
            <option
              key={status}
              value={status}
            >
              {status}
            </option>
          ))}
        </select>
      </section>

      {loading ? (
        <div className="admin-orders-status">
          Loading orders...
        </div>
      ) : filteredOrders.length === 0 ? (
        <div className="admin-orders-status">
          <div>🧾</div>
          <h3>No orders found</h3>
          <p>
            Customer orders will appear here.
          </p>
        </div>
      ) : (
        <section className="admin-order-list">
          {filteredOrders.map((order) => (
            <article
              className="admin-order-card"
              key={order.id}
            >
              <div className="admin-order-card-header">
                <div>
                  <span>ORDER NUMBER</span>

                  <h2>#{order.id}</h2>
                </div>

                <span
                  className={`admin-order-badge ${getStatusClass(
                    order.status
                  )}`}
                >
                  {order.status || "Pending"}
                </span>
              </div>

              <div className="admin-order-details">
                <div>
                  <span>Customer</span>

                  <strong>
                    {order.customer?.name ||
                      order.customer_name ||
                      `Customer #${order.customer_id}`}
                  </strong>
                </div>

                <div>
                  <span>Customer ID</span>

                  <strong>
                    #{order.customer_id}
                  </strong>
                </div>

                <div>
                  <span>Order Date</span>

                  <strong>
                    {formatDate(order.created_at)}
                  </strong>
                </div>

                <div>
                  <span>Total Amount</span>

                  <strong className="admin-order-price">
                    Rs.{" "}
                    {Number(
                      order.total_amount || 0
                    ).toLocaleString()}
                  </strong>
                </div>
              </div>

              {order.items &&
                order.items.length > 0 && (
                  <div className="admin-order-items">
                    <h3>Order Items</h3>

                    {order.items.map((item, index) => (
                      <div
                        className="admin-order-item"
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
                          Qty: {item.quantity}
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
                    ))}
                  </div>
                )}

              <div className="order-status-control">
                <div>
                  <span>UPDATE STATUS</span>

                  <p>
                    Change the current order status.
                  </p>
                </div>

                <select
                  value={order.status || "Pending"}
                  disabled={updatingId === order.id}
                  onChange={(e) =>
                    handleStatusChange(
                      order.id,
                      e.target.value
                    )
                  }
                >
                  {ORDER_STATUSES.map((status) => (
                    <option
                      value={status}
                      key={status}
                    >
                      {status}
                    </option>
                  ))}
                </select>
              </div>
            </article>
          ))}
        </section>
      )}
    </div>
  );
}

export default Orders;