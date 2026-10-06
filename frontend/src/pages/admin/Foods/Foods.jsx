import { useEffect, useState } from "react";
import api from "../../../services/api";
import "./Foods.css";

const FALLBACK_IMAGE =
  "https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=900&q=80";

function Foods() {
  const [foods, setFoods] = useState([]);
  const [categories, setCategories] = useState([]);

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    image: "",
    category_id: "",
    is_available: true,
  });

  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      setError("");

      const [foodsResponse, categoriesResponse] =
        await Promise.all([
          api.get("/foods/"),
          api.get("/categories/"),
        ]);

      const foodData = Array.isArray(foodsResponse.data)
        ? foodsResponse.data
        : foodsResponse.data.items ||
          foodsResponse.data.foods ||
          [];

      const categoryData = Array.isArray(
        categoriesResponse.data
      )
        ? categoriesResponse.data
        : categoriesResponse.data.categories ||
          categoriesResponse.data.items ||
          [];

      setFoods(foodData);
      setCategories(categoryData);
    } catch (err) {
      console.error(err);
      setError("Unable to load food data.");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    setFormData((previous) => ({
      ...previous,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const resetForm = () => {
    setFormData({
      name: "",
      description: "",
      price: "",
      image: "",
      category_id: "",
      is_available: true,
    });

    setEditingId(null);
  };

  const showMessage = (text) => {
    setMessage(text);

    setTimeout(() => {
      setMessage("");
    }, 2500);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.name.trim().length < 2) {
      setError(
        "Food name must contain at least 2 characters."
      );
      return;
    }

    if (Number(formData.price) <= 0) {
      setError("Food price must be greater than 0.");
      return;
    }

    if (!formData.category_id) {
      setError("Please select a category.");
      return;
    }

    const payload = {
      name: formData.name.trim(),
      description:
        formData.description.trim() || null,
      price: Number(formData.price),
      image: formData.image.trim() || null,
      is_available: formData.is_available,
      category_id: Number(formData.category_id),
    };

    try {
      setSaving(true);
      setError("");
      setMessage("");

      if (editingId) {
        await api.put(
          `/foods/${editingId}`,
          payload
        );

        showMessage(
          "Food updated successfully."
        );
      } else {
        await api.post("/foods/", payload);

        showMessage(
          "Food added successfully."
        );
      }

      resetForm();
      await loadData();
    } catch (err) {
      console.error(err);

      const detail = err.response?.data?.detail;

      setError(
        typeof detail === "string"
          ? detail
          : "Unable to save food."
      );
    } finally {
      setSaving(false);
    }
  };

  const handleEdit = (food) => {
    setEditingId(food.id);

    setFormData({
      name: food.name || "",
      description: food.description || "",
      price: food.price || "",
      image: food.image || "",
      category_id: food.category_id || "",
      is_available:
        food.is_available !== false,
    });

    setError("");
    setMessage("");

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  const handleDelete = async (food) => {
    const confirmed = window.confirm(
      `Delete "${food.name}"?`
    );

    if (!confirmed) return;

    try {
      setError("");

      await api.delete(`/foods/${food.id}`);

      if (editingId === food.id) {
        resetForm();
      }

      await loadData();

      showMessage(
        "Food deleted successfully."
      );
    } catch (err) {
      console.error(err);

      const detail = err.response?.data?.detail;

      setError(
        typeof detail === "string"
          ? detail
          : "Unable to delete food."
      );
    }
  };

  const handleAvailability = async (food) => {
    const payload = {
      name: food.name,
      description: food.description || null,
      price: Number(food.price),
      image: food.image || null,
      category_id: Number(food.category_id),
      is_available: !food.is_available,
    };

    try {
      setError("");

      await api.put(
        `/foods/${food.id}`,
        payload
      );

      await loadData();

      showMessage(
        food.is_available
          ? `${food.name} marked unavailable.`
          : `${food.name} marked available.`
      );
    } catch (err) {
      console.error(err);

      setError(
        "Unable to change food availability."
      );
    }
  };

  const getCategoryName = (categoryId) => {
    const category = categories.find(
      (item) =>
        String(item.id) === String(categoryId)
    );

    return category?.name || "Unknown";
  };

  return (
    <div className="admin-foods-page">
      <section className="foods-page-heading">
        <div>
          <span>MENU MANAGEMENT</span>

          <h1>Food Management</h1>

          <p>
            Add meals, update prices and manage
            availability.
          </p>
        </div>

        <div className="food-count">
          <span>Total Foods</span>
          <strong>{foods.length}</strong>
        </div>
      </section>

      {message && (
        <div className="food-success-message">
          ✓ {message}
        </div>
      )}

      {error && (
        <div className="food-error-message">
          {error}
        </div>
      )}

      <div className="food-admin-layout">
        {/* FORM */}

        <section className="food-form-card">
          <span className="food-form-label">
            {editingId
              ? "EDIT FOOD"
              : "NEW FOOD"}
          </span>

          <h2>
            {editingId
              ? "Update Food"
              : "Add New Food"}
          </h2>

          <p>
            Enter your menu item information below.
          </p>

          <form onSubmit={handleSubmit}>
            <div className="admin-food-group">
              <label>Food Name</label>

              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Chicken Mandi"
                minLength="2"
                required
              />
            </div>

            <div className="admin-food-group">
              <label>Description</label>

              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Describe the food..."
                rows="3"
              />
            </div>

            <div className="food-form-row">
              <div className="admin-food-group">
                <label>Price (Rs.)</label>

                <input
                  type="number"
                  name="price"
                  value={formData.price}
                  onChange={handleChange}
                  placeholder="2200"
                  min="1"
                  step="0.01"
                  required
                />
              </div>

              <div className="admin-food-group">
                <label>Category</label>

                <select
                  name="category_id"
                  value={formData.category_id}
                  onChange={handleChange}
                  required
                >
                  <option value="">
                    Select Category
                  </option>

                  {categories.map((category) => (
                    <option
                      key={category.id}
                      value={category.id}
                    >
                      {category.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="admin-food-group">
              <label>Image URL</label>

              <input
                type="url"
                name="image"
                value={formData.image}
                onChange={handleChange}
                placeholder="https://example.com/food.jpg"
              />
            </div>

            {formData.image && (
              <div className="food-image-preview">
                <span>Image Preview</span>

                <img
                  src={formData.image}
                  alt="Preview"
                  onError={(e) => {
                    e.currentTarget.onerror = null;
                    e.currentTarget.src =
                      FALLBACK_IMAGE;
                  }}
                />
              </div>
            )}

            <label className="availability-checkbox">
              <input
                type="checkbox"
                name="is_available"
                checked={formData.is_available}
                onChange={handleChange}
              />

              <span>
                Food is currently available
              </span>
            </label>

            <button
              type="submit"
              className="food-save-button"
              disabled={saving}
            >
              {saving
                ? "Saving..."
                : editingId
                ? "Update Food"
                : "+ Add Food"}
            </button>

            {editingId && (
              <button
                type="button"
                className="food-cancel-button"
                onClick={resetForm}
              >
                Cancel Edit
              </button>
            )}
          </form>
        </section>

        {/* FOOD LIST */}

        <section className="admin-food-list">
          <div className="food-list-heading">
            <span>RESTAURANT MENU</span>
            <h2>All Food Items</h2>
          </div>

          {loading ? (
            <div className="food-admin-status">
              Loading foods...
            </div>
          ) : foods.length === 0 ? (
            <div className="food-admin-status">
              <div className="empty-food-icon">
                🍽️
              </div>

              <h3>No food items yet</h3>

              <p>
                Add your first food using the form.
              </p>
            </div>
          ) : (
            <div className="admin-food-grid">
              {foods.map((food) => (
                <article
                  className="admin-food-card"
                  key={food.id}
                >
                  <div className="admin-food-image">
                    <img
                      src={
                        food.image ||
                        FALLBACK_IMAGE
                      }
                      alt={food.name}
                      onError={(e) => {
                        e.currentTarget.onerror =
                          null;

                        e.currentTarget.src =
                          FALLBACK_IMAGE;
                      }}
                    />

                    <span
                      className={
                        food.is_available
                          ? "food-available-badge"
                          : "food-unavailable-badge"
                      }
                    >
                      {food.is_available
                        ? "Available"
                        : "Unavailable"}
                    </span>
                  </div>

                  <div className="admin-food-content">
                    <span className="admin-food-category">
                      {getCategoryName(
                        food.category_id
                      )}
                    </span>

                    <h3>{food.name}</h3>

                    <p>
                      {food.description ||
                        "No description."}
                    </p>

                    <strong className="admin-food-price">
                      Rs.{" "}
                      {Number(
                        food.price
                      ).toLocaleString()}
                    </strong>

                    <div className="admin-food-actions">
                      <button
                        type="button"
                        className="food-edit-button"
                        onClick={() =>
                          handleEdit(food)
                        }
                      >
                        Edit
                      </button>

                      <button
                        type="button"
                        className={
                          food.is_available
                            ? "food-hide-button"
                            : "food-show-button"
                        }
                        onClick={() =>
                          handleAvailability(
                            food
                          )
                        }
                      >
                        {food.is_available
                          ? "Unavailable"
                          : "Available"}
                      </button>

                      <button
                        type="button"
                        className="food-delete-button"
                        onClick={() =>
                          handleDelete(food)
                        }
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}

export default Foods;