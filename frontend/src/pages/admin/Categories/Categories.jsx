import { useEffect, useState } from "react";
import api from "../../../services/api";
import "./Categories.css";

function Categories() {
  const [categories, setCategories] = useState([]);

  const [formData, setFormData] = useState({
    name: "",
    description: "",
  });

  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await api.get("/categories/");

      const data = Array.isArray(response.data)
        ? response.data
        : response.data.categories || [];

      setCategories(data);
    } catch (err) {
      console.error(err);
      setError("Unable to load categories.");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const resetForm = () => {
    setFormData({
      name: "",
      description: "",
    });

    setEditingId(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.name.trim().length < 2) {
      setError(
        "Category name must contain at least 2 characters."
      );
      return;
    }

    try {
      setSaving(true);
      setError("");
      setMessage("");

      const payload = {
        name: formData.name.trim(),
        description:
          formData.description.trim() || null,
      };

      if (editingId) {
        await api.put(
          `/categories/${editingId}`,
          payload
        );

        setMessage(
          "Category updated successfully."
        );
      } else {
        await api.post(
          "/categories/",
          payload
        );

        setMessage(
          "Category created successfully."
        );
      }

      resetForm();

      await fetchCategories();

      setTimeout(() => {
        setMessage("");
      }, 2500);
    } catch (err) {
      console.error(err);

      const detail = err.response?.data?.detail;

      if (typeof detail === "string") {
        setError(detail);
      } else {
        setError(
          "Unable to save category. Category name may already exist."
        );
      }
    } finally {
      setSaving(false);
    }
  };

  const handleEdit = (category) => {
    setEditingId(category.id);

    setFormData({
      name: category.name || "",
      description:
        category.description || "",
    });

    setError("");
    setMessage("");

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  const handleDelete = async (id, name) => {
    const confirmed = window.confirm(
      `Delete "${name}" category?`
    );

    if (!confirmed) {
      return;
    }

    try {
      setError("");
      setMessage("");

      await api.delete(
        `/categories/${id}`
      );

      setMessage(
        "Category deleted successfully."
      );

      if (editingId === id) {
        resetForm();
      }

      await fetchCategories();

      setTimeout(() => {
        setMessage("");
      }, 2500);
    } catch (err) {
      console.error(err);

      const detail = err.response?.data?.detail;

      if (typeof detail === "string") {
        setError(detail);
      } else {
        setError(
          "Unable to delete category. It may contain food items."
        );
      }
    }
  };

  return (
    <div className="admin-categories-page">
      <section className="category-page-heading">
        <div>
          <span>ADMIN MANAGEMENT</span>

          <h1>Categories</h1>

          <p>
            Create and manage your restaurant
            food categories.
          </p>
        </div>

        <div className="category-count">
          <span>Total Categories</span>

          <strong>
            {categories.length}
          </strong>
        </div>
      </section>

      <div className="category-layout">
        {/* FORM */}

        <section className="category-form-card">
          <span className="category-label">
            {editingId
              ? "EDIT CATEGORY"
              : "NEW CATEGORY"}
          </span>

          <h2>
            {editingId
              ? "Update Category"
              : "Add Category"}
          </h2>

          <p className="form-description">
            {editingId
              ? "Change the category information below."
              : "Create a new category for your food menu."}
          </p>

          {message && (
            <div className="category-success">
              ✓ {message}
            </div>
          )}

          {error && (
            <div className="category-error">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="category-form-group">
              <label>
                Category Name
              </label>

              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Example: Mandi"
                minLength="2"
                required
              />
            </div>

            <div className="category-form-group">
              <label>
                Description
              </label>

              <textarea
                name="description"
                value={
                  formData.description
                }
                onChange={handleChange}
                placeholder="Write a short description..."
                rows="5"
              />
            </div>

            <button
              type="submit"
              className="save-category-button"
              disabled={saving}
            >
              {saving
                ? "Saving..."
                : editingId
                ? "Update Category"
                : "+ Add Category"}
            </button>

            {editingId && (
              <button
                type="button"
                className="cancel-edit-button"
                onClick={resetForm}
              >
                Cancel Edit
              </button>
            )}
          </form>
        </section>

        {/* CATEGORY LIST */}

        <section className="category-list-card">
          <div className="category-list-heading">
            <div>
              <span>
                RESTAURANT MENU
              </span>

              <h2>
                All Categories
              </h2>
            </div>
          </div>

          {loading ? (
            <div className="category-loading">
              Loading categories...
            </div>
          ) : categories.length === 0 ? (
            <div className="no-categories">
              <div>📂</div>

              <h3>
                No categories yet
              </h3>

              <p>
                Create your first food
                category using the form.
              </p>
            </div>
          ) : (
            <div className="category-list">
              {categories.map(
                (category, index) => (
                  <article
                    className="category-item"
                    key={category.id}
                  >
                    <div className="category-number">
                      {String(
                        index + 1
                      ).padStart(2, "0")}
                    </div>

                    <div className="category-information">
                      <h3>
                        {category.name}
                      </h3>

                      <p>
                        {category.description ||
                          "No description provided."}
                      </p>

                      <small>
                        Category ID: #
                        {category.id}
                      </small>
                    </div>

                    <div className="category-actions">
                      <button
                        type="button"
                        className="edit-category-button"
                        onClick={() =>
                          handleEdit(
                            category
                          )
                        }
                      >
                        Edit
                      </button>

                      <button
                        type="button"
                        className="delete-category-button"
                        onClick={() =>
                          handleDelete(
                            category.id,
                            category.name
                          )
                        }
                      >
                        Delete
                      </button>
                    </div>
                  </article>
                )
              )}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}

export default Categories;