import { Link } from "react-router-dom";
import "./Home.css";

function Home() {
  const featuredFoods = [
    {
      id: 1,
      name: "Chicken Mandi",
      description: "Tender chicken served with fragrant Arabian rice.",
      price: "Rs. 2,200",
      image:
        "https://images.unsplash.com/photo-1512058564366-18510be2db19?auto=format&fit=crop&w=900&q=80",
    },
    {
      id: 2,
      name: "Chicken Pizza",
      description: "Loaded with chicken, cheese and fresh toppings.",
      price: "Rs. 1,800",
      image:
        "https://images.unsplash.com/photo-1579751626657-72bc17010498?auto=format&fit=crop&w=900&q=80",
    },
    {
      id: 3,
      name: "Chicken Fried Rice",
      description: "Flavourful fried rice with chicken and vegetables.",
      price: "Rs. 1,200",
      image:
        "https://images.unsplash.com/photo-1603133872878-684f208fb84b?auto=format&fit=crop&w=900&q=80",
    },
  ];

  return (
    <div className="home-page">
      {/* HERO */}
      <section className="hero-section">
        <div className="hero-content">
          <span className="hero-badge">
            AUTHENTIC • FRESH • DELICIOUS
          </span>

          <h1>
            Taste the warmth of
            <span> authentic food.</span>
          </h1>

          <p>
            Freshly prepared meals, rich flavours and your
            favourite dishes — delivered straight to your door.
          </p>

          <div className="hero-buttons">
            <Link to="/menu" className="primary-button">
              Explore Menu
            </Link>

            <Link to="/cart" className="secondary-button">
              View Cart
            </Link>
          </div>

          <div className="hero-features">
            <div>
              <strong>Fresh</strong>
              <span>Every Day</span>
            </div>

            <div>
              <strong>Fast</strong>
              <span>Delivery</span>
            </div>

            <div>
              <strong>100%</strong>
              <span>Great Taste</span>
            </div>
          </div>
        </div>

        <div className="hero-image-container">
          <img
            src="https://images.unsplash.com/photo-1547592180-85f173990554?auto=format&fit=crop&w=1200&q=85"
            alt="Fresh delicious food"
            className="hero-image"
          />

          <div className="hero-floating-card">
            <span>★ 4.9</span>
            <p>Customer favourite</p>
          </div>
        </div>
      </section>

      {/* INTRO */}
      <section className="home-intro">
        <span>OUR SPECIALS</span>

        <h2>Food you'll love</h2>

        <p>
          From aromatic rice dishes to cheesy favourites,
          discover something delicious for every craving.
        </p>
      </section>

      {/* FEATURED FOODS */}
      <section className="featured-foods">
        {featuredFoods.map((food) => (
          <article className="featured-card" key={food.id}>
            <div className="featured-image">
              <img
                src={food.image}
                alt={food.name}
                onError={(e) => {
                  e.currentTarget.src =
                    "https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=900&q=80";
                }}
              />
            </div>

            <div className="featured-card-content">
              <h3>{food.name}</h3>

              <p>{food.description}</p>

              <div className="featured-bottom">
                <strong>{food.price}</strong>

                <Link to="/menu">
                  Order Now →
                </Link>
              </div>
            </div>
          </article>
        ))}
      </section>

      {/* PROMO */}
      <section className="promo-section">
        <div>
          <span>READY TO ORDER?</span>

          <h2>Your next favourite meal is waiting.</h2>

          <p>
            Browse our complete menu and order your meal today.
          </p>
        </div>

        <Link to="/menu" className="promo-button">
          View Full Menu
        </Link>
      </section>
    </div>
  );
}

export default Home;