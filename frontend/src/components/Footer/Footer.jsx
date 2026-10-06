import { Link } from "react-router-dom";
import "./Footer.css";

function Footer() {
  return (
    <footer className="main-footer">
      <div className="footer-container">
        <div className="footer-brand">
          <h2>mandhi.</h2>

          <p>
            Fresh food, authentic flavours and delicious
            meals delivered straight to your table.
          </p>
        </div>

        <div className="footer-section">
          <h3>Quick Links</h3>

          <Link to="/">Home</Link>
          <Link to="/menu">Menu</Link>
          <Link to="/cart">Cart</Link>
          <Link to="/my-orders">My Orders</Link>
        </div>

        <div className="footer-section">
          <h3>Customer</h3>

          <Link to="/login">Login</Link>
          <Link to="/register">Create Account</Link>
        </div>

        <div className="footer-section">
          <h3>Contact</h3>

          <p>Jaffna, Sri Lanka</p>
          <p>+94 77 123 4567</p>
          <p>hello@mandhi.lk</p>
        </div>
      </div>

      <div className="footer-bottom">
        <p>© 2026 Mandhi. Fresh food, made with love.</p>
      </div>
    </footer>
  );
}

export default Footer;