// ===== ADD TO CART BUTTONS =====
const addCartButtons = document.querySelectorAll(".add-cart");

// Prices
const prices = {
  "Solo Harvest (Small)": 600,
  "Family Fresh (Medium)": 1000,
  "Community Feast (Large)": 1500,
};

// Get existing cart
let cart = JSON.parse(localStorage.getItem("cart")) || [];

// ===== POPUP =====
const popup = document.getElementById("cart-popup");
const popupMessage = document.getElementById("popup-message");

function showPopup(message) {
  popupMessage.textContent = message;

  popup.classList.add("show");

  setTimeout(() => {
    popup.classList.remove("show");
  }, 2000);
}

// ===== ADD TO CART =====
addCartButtons.forEach((button) => {
  button.addEventListener("click", function (e) {
    e.preventDefault();

    const boxName = this.dataset.box;

    // Check if already exists
    const existingItem = cart.find((item) => item.name === boxName);

    if (existingItem) {
      existingItem.quantity += 1;
    } else {
      cart.push({
        name: boxName,
        quantity: 1,
        price: prices[boxName],
      });
    }

    // Save cart
    localStorage.setItem("cart", JSON.stringify(cart));

    showPopup(`${boxName} added to cart!`);
  });
});
