// ===== MODAL =====
const confirmModal = document.getElementById("confirm-modal");
const receiptContent = document.getElementById("receipt-content");
const confirmOrderBtn = document.getElementById("confirm-order");
const cancelOrderBtn = document.getElementById("cancel-order");
const successPopup = document.getElementById("success-popup");

// ===== ELEMENTS =====
const cartItemsContainer = document.getElementById("cart-items");
const orderFormBox = document.querySelector(".order-form");
const placeOrderBtn = document.querySelector(".place-order");

// ===== ERROR POPUP =====
const errorPopup = document.getElementById("error-popup");
const errorMessage = document.getElementById("error-message");

function showError(message) {
  errorMessage.textContent = message;
  errorPopup.classList.add("show");

  setTimeout(() => {
    errorPopup.classList.remove("show");
  }, 2000);
}

// ===== CART =====
let cart = JSON.parse(localStorage.getItem("cart")) || [];

// ===== PRICES =====
const boxPrices = {
  "Solo Harvest (Small)": 600,
  "Family Fresh (Medium)": 1000,
  "Community Feast (Large)": 1500,
};

const addonPrices = {
  "Farm Eggs (1 dozen)": 180,
  "Organic Honey": 250,
  "Herbal Teas": 150,
};

const deliveryFee = 100;

// ===== RENDER CART =====
function renderCart() {
  cartItemsContainer.innerHTML = "";

  if (cart.length === 0) {
    cartItemsContainer.innerHTML = `<p>Your basket is empty.</p>`;
    updateTotal();
    return;
  }

  cart.forEach((item, index) => {
    const boxItem = document.createElement("div");
    boxItem.classList.add("box-item");

    boxItem.innerHTML = `
      <label>Box Type:</label>

      <select data-index="${index}">
        <option ${item.name === "Solo Harvest (Small)" ? "selected" : ""}>
          Solo Harvest (Small)
        </option>

        <option ${item.name === "Family Fresh (Medium)" ? "selected" : ""}>
          Family Fresh (Medium)
        </option>

        <option ${item.name === "Community Feast (Large)" ? "selected" : ""}>
          Community Feast (Large)
        </option>
      </select>

      <label>Quantity:</label>

      <input type="number" min="1" value="${item.quantity}" data-index="${index}">

      <button class="remove-box" data-index="${index}">
        Remove
      </button>
    `;

    cartItemsContainer.appendChild(boxItem);
  });

  attachCartEvents();
  updateTotal();
}

// ===== EVENTS =====
function attachCartEvents() {
  document.querySelectorAll(".box-item input").forEach((input) => {
    input.addEventListener("input", function () {
      const index = this.dataset.index;
      cart[index].quantity = parseInt(this.value);

      localStorage.setItem("cart", JSON.stringify(cart));
      updateTotal();
    });
  });

  document.querySelectorAll(".box-item select").forEach((select) => {
    select.addEventListener("change", function () {
      const index = this.dataset.index;
      cart[index].name = this.value;
      cart[index].price = boxPrices[this.value];

      localStorage.setItem("cart", JSON.stringify(cart));
      updateTotal();
    });
  });

  document.querySelectorAll(".remove-box").forEach((button) => {
    button.addEventListener("click", function () {
      const index = this.dataset.index;
      cart.splice(index, 1);

      localStorage.setItem("cart", JSON.stringify(cart));
      renderCart();
    });
  });
}

// ===== TOTAL =====
function updateTotal() {
  let total = 0;
  let summary = "";

  cart.forEach((item, index) => {
    const subtotal = item.price * item.quantity;
    total += subtotal;

    summary += `
Box ${index + 1}: ${item.name} x${item.quantity}
(PHP ${subtotal})

`;
  });

  document
    .querySelectorAll('.basket-overview input[type="checkbox"]')
    .forEach((chk) => {
      if (chk.checked) {
        const label = chk.parentElement.textContent.trim();
        total += addonPrices[label];

        summary += `
Add-on: ${label}
(PHP ${addonPrices[label]})

`;
      }
    });

  total += deliveryFee;

  summary += `
Delivery Fee: PHP ${deliveryFee}
`;

  document.querySelector(".order-summary").textContent = summary;
  document.querySelector("p strong").textContent =
    `Total: PHP ${total.toFixed(2)}`;
}

// ===== VALIDATION =====
function validateForm() {
  const requiredFields = orderFormBox.querySelectorAll("input[required]");

  for (let field of requiredFields) {
    if (field.type !== "radio" && !field.value.trim()) {
      showError("Please fill out all required fields.");
      return false;
    }
  }

  const paymentChecked = document.querySelector(
    'input[name="payment"]:checked',
  );

  if (!paymentChecked) {
    showError("Please select a payment method.");
    return false;
  }

  return true;
}

// ===== PLACE ORDER =====
function placeOrder() {
  if (!validateForm()) return;

  const inputs = orderFormBox.querySelectorAll("input");

  const fullName = inputs[0].value;
  const address = inputs[1].value;
  const contact = inputs[2].value;
  const email = inputs[3].value;

  const paymentMethod = document
    .querySelector('input[name="payment"]:checked')
    .parentElement.textContent.trim();

  let total = 0;

  let receipt = `
Customer Information
-------------------------
Name: ${fullName}
Address: ${address}
Contact: ${contact}
Email: ${email}

Orders
-------------------------
`;

  cart.forEach((item) => {
    const subtotal = item.price * item.quantity;
    total += subtotal;

    receipt += `
${item.name}
Qty: ${item.quantity}
PHP ${subtotal}

`;
  });

  document
    .querySelectorAll('.basket-overview input[type="checkbox"]')
    .forEach((chk) => {
      if (chk.checked) {
        const label = chk.parentElement.textContent.trim();
        total += addonPrices[label];

        receipt += `
Add-on:
${label}
PHP ${addonPrices[label]}

`;
      }
    });

  total += deliveryFee;

  receipt += `
Delivery Fee: PHP ${deliveryFee}

Payment Method:
${paymentMethod}

-------------------------
TOTAL: PHP ${total.toFixed(2)}
`;

  receiptContent.textContent = receipt;
  confirmModal.classList.add("show");
}

// ===== ADD BOX =====
document.querySelector(".add-box").addEventListener("click", function () {
  cart.push({
    name: "Solo Harvest (Small)",
    quantity: 1,
    price: 600,
  });

  localStorage.setItem("cart", JSON.stringify(cart));
  renderCart();
});

// ===== ADDON EVENTS =====
document
  .querySelectorAll('.basket-overview input[type="checkbox"]')
  .forEach((chk) => {
    chk.addEventListener("change", updateTotal);
  });

// ===== BUTTONS =====
placeOrderBtn.addEventListener("click", placeOrder);

cancelOrderBtn.addEventListener("click", function () {
  confirmModal.classList.remove("show");
});

confirmOrderBtn.addEventListener("click", function () {
  confirmModal.classList.remove("show");

  successPopup.classList.add("show");

  cart = [];
  localStorage.removeItem("cart");

  setTimeout(() => {
    successPopup.classList.remove("show");
    renderCart();
  }, 2500);
});

// ===== START =====
renderCart();
