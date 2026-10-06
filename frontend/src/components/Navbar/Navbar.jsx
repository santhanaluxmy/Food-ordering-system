import { Link, useNavigate } from "react-router-dom";
import "./Navbar.css";

function Navbar() {
  const navigate = useNavigate();

  const token = localStorage.getItem("token");
  const customerName = localStorage.getItem("customerName");
  const role = localStorage.getItem("role");

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    localStorage.removeItem("customerId");
    localStorage.removeItem("customerName");

    navigate("/login");
  };

  return (
    <nav className="navbar">
      <Link to="/" className="navbar-logo">
        MANDHI
      </Link>

      <div className="navbar-links">
        <Link to="/">Home</Link>

        <Link to="/menu">Menu</Link>

        {token && role === "customer" && (
          <Link to="/my-orders">My Orders</Link>
        )}

        <Link to="/cart" className="cart-link">
          Cart
        </Link>

        {!token ? (
          <>
            <Link to="/login" className="login-btn">
              Login
            </Link>

            <Link to="/register" className="register-btn">
              Register
            </Link>
          </>
        ) : (
          <>
            <span className="welcome-user">
              Hi, {customerName || "Customer"}
            </span>

            {role === "admin" && (
              <Link to="/admin/dashboard">
                Admin
              </Link>
            )}

            <button
              className="logout-btn"
              onClick={handleLogout}
            >
              Logout
            </button>
          </>
        )}
      </div>
    </nav>
  );
}

export default Navbar;