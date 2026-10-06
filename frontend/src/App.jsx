import { Routes, Route } from "react-router-dom";

import Navbar from "./components/Navbar/Navbar";
import Footer from "./components/Footer/Footer";
import AdminRoute from "./components/AdminRoute/AdminRoute";

import Home from "./pages/Home/Home";
import Menu from "./pages/Menu/Menu";
import Cart from "./pages/Cart/Cart";
import Checkout from "./pages/Checkout/Checkout";
import OrderConfirmation from "./pages/OrderConfirmation/OrderConfirmation";
import MyOrders from "./pages/MyOrders/MyOrders";
import Login from "./pages/Login/Login";
import Register from "./pages/Register/Register";

import Dashboard from "./pages/admin/Dashboard/Dashboard";
import Categories from "./pages/admin/Categories/Categories";
import Foods from "./pages/admin/Foods/Foods";
import AdminOrders from "./pages/admin/Orders/Orders";
import Customers from "./pages/admin/Customers/Customers";

function App() {
  return (
    <>
      <Navbar />

      <main>
        <Routes>
          {/* Customer Routes */}

          <Route
            path="/"
            element={<Home />}
          />

          <Route
            path="/menu"
            element={<Menu />}
          />

          <Route
            path="/cart"
            element={<Cart />}
          />

          <Route
            path="/checkout"
            element={<Checkout />}
          />

          <Route
            path="/order-confirmation"
            element={<OrderConfirmation />}
          />

          <Route
            path="/my-orders"
            element={<MyOrders />}
          />

          <Route
            path="/login"
            element={<Login />}
          />

          <Route
            path="/register"
            element={<Register />}
          />

          {/* Admin Routes */}

          <Route
            path="/admin/dashboard"
            element={
              <AdminRoute>
                <Dashboard />
              </AdminRoute>
            }
          />

          <Route
            path="/admin/categories"
            element={
              <AdminRoute>
                <Categories />
              </AdminRoute>
            }
          />

          <Route
            path="/admin/foods"
            element={
              <AdminRoute>
                <Foods />
              </AdminRoute>
            }
          />

          <Route
            path="/admin/orders"
            element={
              <AdminRoute>
                <AdminOrders />
              </AdminRoute>
            }
          />

          <Route
            path="/admin/customers"
            element={
              <AdminRoute>
                <Customers />
              </AdminRoute>
            }
          />

          {/* Unknown URL */}

          <Route
            path="*"
            element={<Home />}
          />
        </Routes>
      </main>

      <Footer />
    </>
  );
}

export default App;