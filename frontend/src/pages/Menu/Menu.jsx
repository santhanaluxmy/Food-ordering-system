import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../services/api";
import "./Menu.css";

const FALLBACK_IMAGE =
  "https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=900&q=80";

function Menu() {
  const navigate = useNavigate();

  const [foods, setFoods] = useState([]);
  const [categories, setCategories] = useState([]);

  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [sortOrder, setSortOrder] = useState("");

  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);

      const [foodResponse, categoryResponse] = await Promise.all([
        api.get("/foods/"),
        api.get("/categories/"),
      ]);

      const foodData = Array.isArray(foodResponse.data)
        ? foodResponse.data
        : foodResponse.data.items || foodResponse.data.foods || [];

      const categoryData = Array.isArray(categoryResponse.data)
        ? categoryResponse.data
        : categoryResponse.data.items ||
          categoryResponse.data.categories ||
          [];

      setFoods(foodData);
      setCategories(categoryData);
    } catch (error) {
      console.error(error);
      setMessage("Unable to load menu. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const filteredFoods = useMemo(() => {
    let result = [...foods];

    if (search.trim()) {
      const text = search.toLowerCase();

      result = result.filter((food) =>
        food.name?.toLowerCase().includes(text)
      );
    }

    if (selectedCategory !== "all") {
      result = result.filter(
        (food) =>
          String(food.category_id) === String(selectedCategory)
      );
    }

    if (sortOrder === "low") {
      result.sort(
        (a, b) => Number(a.price) - Number(b.price)
      );
    }

    if (sortOrder === "high") {
      result.sort(
        (a, b) => Number(b.price) - Number(a.price)
      );
    }

    if (sortOrder === "name") {
      result.sort((a, b) =>
        a.name.localeCompare(b.name)
      );
    }

    return result;
  }, [foods, search, selectedCategory, sortOrder]);

  const getCategoryName = (categoryId) => {
    const category = categories.find(
      (item) => String(item.id) === String(categoryId)
    );

    return category?.name || "Special";
  };

  const handleAddToCart = (food) => {
    const existingCart =
      JSON.parse(localStorage.getItem("mandhiCart")) || [];

    const existingItem = existingCart.find(
      (item) => String(item.id) === String(food.id)
    );

    let updatedCart;

    if (existingItem) {
      updatedCart = existingCart.map((item) =>
        String(item.id) === String(food.id)
          ? {
              ...item,
              quantity: Number(item.quantity || 1) + 1,
            }
          : item
      );
    } else {
      updatedCart = [
        ...existingCart,
        {
          ...food,
          quantity: 1,
        },
      ];
    }

    localStorage.setItem(
      "mandhiCart",
      JSON.stringify(updatedCart)
    );

    window.dispatchEvent(new Event("cartUpdated"));

    setMessage(`${food.name} added to cart`);

    navigate("/cart");
  };

  return (
    <div className="menu-page">
      <section className="menu-hero">
        <span>OUR MENU</span>

        <h1>Find your favourite meal</h1>

        <p>
          Fresh ingredients, authentic flavours and delicious
          dishes prepared for every craving.
        </p>
      </section>

      <section className="menu-controls">
        <div className="menu-search">
          <span>⌕</span>

          <input
            type="text"
            placeholder="Search food..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <select
          value={selectedCategory}
          onChange={(e) =>
            setSelectedCategory(e.target.value)
          }
        >
          <option value="all">All Categories</option>

          {categories.map((category) => (
            <option
              value={category.id}
              key={category.id}
            >
              {category.name}
            </option>
          ))}
        </select>

        <select
          value={sortOrder}
          onChange={(e) => setSortOrder(e.target.value)}
        >
          <option value="">Sort By</option>
          <option value="low">Price: Low to High</option>
          <option value="high">Price: High to Low</option>
          <option value="name">Name: A-Z</option>
        </select>
      </section>

      {message && (
        <div className="menu-message">
          {message}
        </div>
      )}

      {loading ? (
        <div className="menu-status">
          Loading delicious food...
        </div>
      ) : filteredFoods.length === 0 ? (
        <div className="menu-status">
          <h3>No food found</h3>
          <p>Try another search or category.</p>
        </div>
      ) : (
        <section className="menu-grid">
          {filteredFoods.map((food) => (
            <article className="food-card" key={food.id}>
              <div className="food-image-wrapper">
                <img
                  src={food.image || FALLBACK_IMAGE}
                  alt={food.name}
                  onError={(e) => {
                    e.currentTarget.onerror = null;
                    e.currentTarget.src = FALLBACK_IMAGE;
                  }}
                />

                <span
                  className={
                    food.is_available
                      ? "availability available"
                      : "availability unavailable"
                  }
                >
                  {food.is_available
                    ? "Available"
                    : "Unavailable"}
                </span>
              </div>

              <div className="food-content">
                <span className="food-category">
                  {getCategoryName(food.category_id)}
                </span>

                <h2>{food.name}</h2>

                <p>
                  {food.description ||
                    "Freshly prepared and full of flavour."}
                </p>

                <div className="food-card-bottom">
                  <div>
                    <small>Price</small>

                    <strong>
                      Rs. {Number(food.price).toLocaleString()}
                    </strong>
                  </div>

                  <button
                    type="button"
                    disabled={!food.is_available}
                    onClick={() => handleAddToCart(food)}
                  >
                    {food.is_available
                      ? "Add to Cart"
                      : "Unavailable"}
                  </button>
                </div>
              </div>
            </article>
          ))}
        </section>
      )}
    </div>
  );
}

export default Menu;