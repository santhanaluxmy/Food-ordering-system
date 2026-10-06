import { useEffect, useMemo, useState } from "react";
import api from "../../../services/api";
import "./Customers.css";

function Customers() {
  const [customers, setCustomers] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchCustomers();
  }, []);

  const fetchCustomers = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await api.get("/customers/");

      const data = Array.isArray(response.data)
        ? response.data
        : response.data.customers || [];

      setCustomers(data);
    } catch (err) {
      console.error("Customer loading error:", err);

      setError("Unable to load customers.");
    } finally {
      setLoading(false);
    }
  };

  const filteredCustomers = useMemo(() => {
    const text = search.toLowerCase().trim();

    if (!text) {
      return customers;
    }

    return customers.filter((customer) => {
      return (
        customer.name
          ?.toLowerCase()
          .includes(text) ||
        customer.email
          ?.toLowerCase()
          .includes(text) ||
        customer.phone
          ?.toLowerCase()
          .includes(text)
      );
    });
  }, [customers, search]);

  const getInitial = (name) => {
    if (!name) {
      return "C";
    }

    return name.charAt(0).toUpperCase();
  };

  return (
    <div className="admin-customers-page">
      <section className="customers-heading">
        <div>
          <span>CUSTOMER MANAGEMENT</span>

          <h1>Customers</h1>

          <p>
            View registered customers and their
            contact information.
          </p>
        </div>

        <div className="customers-count">
          <span>Total Customers</span>

          <strong>{customers.length}</strong>
        </div>
      </section>

      <section className="customer-tools">
        <div className="customer-search">
          <span>⌕</span>

          <input
            type="text"
            placeholder="Search name, email or phone..."
            value={search}
            onChange={(e) =>
              setSearch(e.target.value)
            }
          />
        </div>

        <button
          type="button"
          onClick={fetchCustomers}
        >
          Refresh
        </button>
      </section>

      {error && (
        <div className="customers-error">
          {error}
        </div>
      )}

      {loading ? (
        <div className="customers-status">
          Loading customers...
        </div>
      ) : filteredCustomers.length === 0 ? (
        <div className="customers-status">
          <div>👥</div>

          <h2>
            {search
              ? "No customers found"
              : "No customers yet"}
          </h2>

          <p>
            {search
              ? "Try another search."
              : "Registered customers will appear here."}
          </p>
        </div>
      ) : (
        <section className="customers-table-card">
          <div className="customers-table-heading">
            <div>
              <span>REGISTERED USERS</span>

              <h2>Customer List</h2>
            </div>

            <span className="result-count">
              {filteredCustomers.length} results
            </span>
          </div>

          <div className="customers-table-wrapper">
            <table className="customers-table">
              <thead>
                <tr>
                  <th>Customer</th>
                  <th>Email</th>
                  <th>Phone</th>
                  <th>Address</th>
                  <th>ID</th>
                </tr>
              </thead>

              <tbody>
                {filteredCustomers.map(
                  (customer) => (
                    <tr key={customer.id}>
                      <td>
                        <div className="customer-name-cell">
                          <div className="customer-avatar">
                            {getInitial(
                              customer.name
                            )}
                          </div>

                          <div>
                            <strong>
                              {customer.name}
                            </strong>

                            <span>
                              Mandhi Customer
                            </span>
                          </div>
                        </div>
                      </td>

                      <td>
                        {customer.email || "—"}
                      </td>

                      <td>
                        {customer.phone || "—"}
                      </td>

                      <td>
                        <span className="customer-address">
                          {customer.address ||
                            "No address"}
                        </span>
                      </td>

                      <td>
                        <span className="customer-id">
                          #{customer.id}
                        </span>
                      </td>
                    </tr>
                  )
                )}
              </tbody>
            </table>
          </div>
        </section>
      )}
    </div>
  );
}

export default Customers;