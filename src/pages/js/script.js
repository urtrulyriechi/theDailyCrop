// === Elements ===
const basketOverview = document.querySelector('.basket-overview');
const orderFormBox = document.querySelector('.order-form');
const placeOrderBtn = document.querySelector('.place-order');
const popup = document.getElementById('order-popup');

// Prices (example values)
const boxPrices = {
  "Solo Harvest (Small)": 600,
  "Family Fresh (Medium)": 1000,
  "Community Feast (Large)": 1500
};
const addonPrices = {
  "Farm Eggs (1 dozen)": 180,
  "Organic Honey": 250,
  "Herbal Teas": 150
};
const deliveryFee = 100;

// === Functions ===
function updateTotal() {
  let total = 0;
  let summary = "";

  // Loop through all box items
  document.querySelectorAll('.box-item').forEach((box, index) => {
    const type = box.querySelector('select').value;
    const qty = parseInt(box.querySelector('input[type="number"]').value) || 1;
    const subtotal = boxPrices[type] * qty;

    total += subtotal;
    summary += `Box ${index + 1}: ${type} x${qty} (PHP ${subtotal})\n`;
  });

  // Add-ons
  document.querySelectorAll('.basket-overview input[type="checkbox"]').forEach(chk => {
    if (chk.checked) {
      const label = chk.parentElement.textContent.trim();
      total += addonPrices[label];
      summary += `Add-on: ${label} (PHP ${addonPrices[label]})\n`;
    }
  });

  // Add delivery fee
  total += deliveryFee;
  summary += `Delivery Fee: PHP ${deliveryFee}\n`;

  // Update Order Form display
  const summaryBox = orderFormBox.querySelector('.order-summary');
  if (summaryBox) {
    summaryBox.textContent = summary;
  }

  orderFormBox.querySelector('p strong').textContent = `Total: PHP ${total.toFixed(2)}`;
}


function addBox() {
  const newBox = document.createElement('div');
  newBox.classList.add('box-item');
  newBox.innerHTML = `
    <label>Box Type:</label>
    <select>
      <option>Solo Harvest (Small)</option>
      <option>Family Fresh (Medium)</option>
      <option>Community Feast (Large)</option>
    </select>

    <label>Quantity:</label>
    <input type="number" min="1" value="1">

    <button class="remove-box">Remove</button>
  `;
  basketOverview.insertBefore(newBox, basketOverview.querySelector('.add-box'));

  // Attach event listeners
  newBox.querySelector('select').addEventListener('change', updateTotal);
  newBox.querySelector('input').addEventListener('input', updateTotal);
  newBox.querySelector('.remove-box').addEventListener('click', () => {
    newBox.remove();
    updateTotal();
  });

  updateTotal();
}

function validateForm() {
  const requiredFields = orderFormBox.querySelectorAll('input[required], input[name="payment"]');
  for (let field of requiredFields) {
    if (field.type === "radio") {
      const radios = orderFormBox.querySelectorAll('input[name="payment"]');
      if (![...radios].some(r => r.checked)) {
        alert("Please select a payment method.");
        return false;
      }
    } else if (!field.value.trim()) {
      alert("Please fill out all required fields.");
      return false;
    }
  }
  return true;
}

function placeOrder() {
  if (validateForm()) {
    popup.style.display = 'block';
    setTimeout(() => {
      popup.style.display = 'none';
    }, 2000);
  }
}

// === Event Listeners ===
document.querySelector('.add-box').addEventListener('click', addBox);
document.querySelectorAll('.basket-overview select, .basket-overview input[type="number"], .basket-overview input[type="checkbox"]').forEach(el => {
  el.addEventListener('change', updateTotal);
  el.addEventListener('input', updateTotal);
});
placeOrderBtn.addEventListener('click', placeOrder);

// Initial total
updateTotal();
