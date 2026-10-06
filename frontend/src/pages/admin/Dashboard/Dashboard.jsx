import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../../../services/api";
import "./Dashboard.css";

function Dashboard() {
  const [stats, setStats] = useState({
    total_foods: 0,
    total_categories: 0,
    total_customers: 0,
    total_orders: 0,
    total_revenue: 0,
    pending_orders: 0,
    delivered_orders: 0,
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await api.get("/dashboard/stats");

        setStats((previous) => ({
          ...previous,
          ...response.data,
        }));
      } catch (error) {
        console.error("Dashboard error:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  return (
    <div className="admin-dashboard">
      <section className="admin-heading">
        <div>
          <span>MANDHI ADMIN</span>
          <h1>Dashboard</h1>
          <p>
            Manage your restaurant, menu and customer orders.
          </p>
        </div>

        <Link to="/menu" className="view-menu-button">
          View Restaurant
        </Link>
      </section>

      {loading ? (
        <div className="dashboard-loading">
          Loading dashboard...
        </div>
      ) : (
        <>
          <section className="stats-grid">
            <div className="stat-card">
              <div className="stat-icon">🍽️</div>
              <div>
                <span>Total Foods</span>
                <strong>{stats.total_foods}</strong>
              </div>
            </div>

            <div className="stat-card">
              <div className="stat-icon">📋</div>
              <div>
                <span>Categories</span>
                <strong>{stats.total_categories}</strong>
              </div>
            </div>

            <div className="stat-card">
              <div className="stat-icon">👥</div>
              <div>
                <span>Customers</span>
                <strong>{stats.total_customers}</strong>
              </div>
            </div>

            <div className="stat-card">
              <div className="stat-icon">🛍️</div>
              <div>
                <span>Total Orders</span>
                <strong>{stats.total_orders}</strong>
              </div>
            </div>
          </section>

          <section className="dashboard-bottom-grid">
            <div className="revenue-card">
              <span>TOTAL REVENUE</span>

              <h2>
                Rs.{" "}
                {Number(
                  stats.total_revenue || 0
                ).toLocaleString()}
              </h2>

              <p>
                Revenue generated from customer orders.
              </p>
            </div>

            <div className="order-statistics">
              <h2>Order Status</h2>

              <div className="order-stat-row">
                <div>
                  <span className="status-circle pending-circle" />
                  <span>Pending Orders</span>
                </div>

                <strong>
                  {stats.pending_orders || 0}
                </strong>
              </div>

              <div className="order-stat-row">
                <div>
                  <span className="status-circle delivered-circle" />
                  <span>Delivered Orders</span>
                </div>

                <strong>
                  {stats.delivered_orders || 0}
                </strong>
              </div>
            </div>
          </section>
        </>
      )}

      <section className="admin-actions">
        <div className="admin-actions-heading">
          <span>MANAGEMENT</span>
          <h2>Quick Actions</h2>
        </div>

        <div className="admin-action-grid">
          <Link
            to="/admin/categories"
            className="admin-action-card"
          >
            <div>📂</div>
            <h3>Categories</h3>
            <p>
              Create, update and manage food categories.
            </p>
            <span>Manage Categories →</span>
          </Link>

          <Link
            to="/admin/foods"
            className="admin-action-card"
          >
            <div>🍗</div>
            <h3>Foods</h3>
            <p>
              Add meals, update prices and availability.
            </p>
            <span>Manage Foods →</span>
          </Link>

          <Link
            to="/admin/orders"
            className="admin-action-card"
          >
            <div>🧾</div>
            <h3>Orders</h3>
            <p>
              View orders and update customer order status.
            </p>
            <span>Manage Orders →</span>
          </Link>

          <Link
            to="/admin/customers"
            className="admin-action-card"
          >
            <div>👤</div>
            <h3>Customers</h3>
            <p>
              View registered Mandhi customers.
            </p>
            <span>View Customers →</span>
          </Link>
        </div>
      </section>
    </div>
  );
}

export default Dashboard;