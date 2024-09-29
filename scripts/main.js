let cartIcon = document.querySelector("#cart-icon");
let cart = document.querySelector(".cart");
let closeCart = document.querySelector("#close-cart");

cartIcon.onclick = () => {
  cart.classList.add("active");
};

closeCart.onclick = () => {
  cart.classList.remove("active");
};

if (document.readyState == "loading") {
  document.addEventListener("DOMContentLoaded", ready);
} else {
  ready();
}

function ready() {
  var removeCartButtons = document.getElementsByClassName("cart-remove");
  for (var i = 0; i < removeCartButtons.length; i++) {
    var button = removeCartButtons[i];
    button.addEventListener("click", removeCartItem);
  }
  var quantityInputs = document.getElementsByClassName("cart-quantity");
  for (var i = 0; i < quantityInputs.length; i++) {
    var input = quantityInputs[i];
    input.addEventListener("change", quantityChanged);
  }
  var addCart = document.getElementsByClassName("add-cart");
  for (var i = 0; i < addCart.length; i++) {
    var button = addCart[i];
    button.addEventListener("click", addCartClicked);
  }
  document
    .getElementsByClassName("btn-buy")[0]
    .addEventListener("click", buyButtonClicked);
}

async function sendToTelegram(cartData, phoneNumber) {
  const botToken = "7362624081:AAGZbsuIDiUE0KTAAANpg8isq6o2dr7Yqvc";
  const chatId = "-1002167799073";
  const message = `
    📞 *Telefon*: ${phoneNumber}
    ${cartData
      .map(
        (item) => `
      📚 *Kitob*: ${item.title}
      💰 *Narxi*: ${item.price}
      📦 *Soni*: ${item.quantity}
    `
      )
      .join("\n\n")}
  `;
  const url = `https://api.telegram.org/bot${botToken}/sendMessage`;
  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      chat_id: chatId,
      text: message,
      parse_mode: "Markdown",
    }),
  });
  if (!response.ok) {
    console.error("Error sending message to Telegram:", await response.json());
  }
}

async function buyButtonClicked() {
  const { value: phoneNumber } = await Swal.fire({
    title: "Telefon raqamingizni kiriting:",
    input: "text",
    inputAttributes: {
      autocapitalize: "off",
      maxlength: 15,
    },
    showCancelButton: true,
    confirmButtonText: "Jo'natish",
    showLoaderOnConfirm: true,
    preConfirm: (value) => {
      if (!value) {
        Swal.showValidationMessage("Telefon raqamni kiriting!");
      }
    },
  });
  if (phoneNumber) {
    let cartItems = document.getElementsByClassName("cart-box");
    let cartData = [];
    for (let i = 0; i < cartItems.length; i++) {
      let cartBox = cartItems[i];
      let title =
        cartBox.getElementsByClassName("cart-product-title")[0].innerText;
      let price = cartBox.getElementsByClassName("cart-price")[0].innerText;
      let quantity = cartBox.getElementsByClassName("cart-quantity")[0].value;
      cartData.push({
        title: title,
        price: price,
        quantity: quantity,
      });
    }
    await sendToTelegram(cartData, phoneNumber);
    Swal.fire({
      title: "Buyurtma qabul qilindi!",
      icon: "success",
    });
    let cartContent = document.getElementsByClassName("cart-content")[0];
    while (cartContent.hasChildNodes()) {
      cartContent.removeChild(cartContent.firstChild);
    }
    updateTotal();
  }
}

function removeCartItem(event) {
  var buttonClicked = event.target;
  buttonClicked.parentElement.remove();
  updateTotal();
}

function quantityChanged(event) {
  var input = event.target;
  if (isNaN(input.value) || input.value <= 0) {
    input.value = 1;
  }
  updateTotal();
}

function addCartClicked(event) {
  var button = event.target;
  var shopProducts = button.parentElement;
  var title = shopProducts.getElementsByClassName("product-title")[0].innerText;
  var price = shopProducts.getElementsByClassName("price")[0].innerText;
  var productImg = shopProducts.getElementsByClassName("product-img")[0].src;
  addItemToCart(title, price, productImg);
  updateTotal();
}

function addItemToCart(title, price, productImg) {
  var cartItems = document.getElementsByClassName("cart-content")[0];
  var cartItemNames = cartItems.getElementsByClassName("cart-product-title");
  for (var i = 0; i < cartItemNames.length; i++) {
    if (
      cartItemNames[i].innerText.trim().toLowerCase() ===
      title.trim().toLowerCase()
    ) {
      Swal.fire({
        title: "Bu kitob qo'shilgan!",
        icon: "info",
      });
      return;
    }
  }
  var cartShopBox = document.createElement("div");
  cartShopBox.classList.add("cart-box");
  var cartBoxContents = `
    <img src="${productImg}" class="cart-img">
    <div class="detail-box">
      <div class="cart-product-title">${title}</div>
      <div class="cart-price">${price}</div>
      <input type="number" class="cart-quantity" value="1">
    </div>
    <i class="bx bxs-trash-alt cart-remove"></i>
  `;
  cartShopBox.innerHTML = cartBoxContents;
  cartItems.append(cartShopBox);
  cartShopBox
    .getElementsByClassName("cart-remove")[0]
    .addEventListener("click", removeCartItem);
  cartShopBox
    .getElementsByClassName("cart-quantity")[0]
    .addEventListener("change", quantityChanged);
  updateTotal();
}

function updateTotal() {
  var cartContent = document.getElementsByClassName("cart-content")[0];
  var cartBoxes = cartContent.getElementsByClassName("cart-box");
  var total = 0;
  for (var i = 0; i < cartBoxes.length; i++) {
    var cartBox = cartBoxes[i];
    var priceElement = cartBox.getElementsByClassName("cart-price")[0];
    var quantityElement = cartBox.getElementsByClassName("cart-quantity")[0];
    var price = parseFloat(
      priceElement.innerText.replace("UZS", "").replace(",", "")
    );
    var quantity = quantityElement.value;
    total = total + price * quantity;
  }
  total = Math.round(total * 100) / 100;
  document.getElementsByClassName("total-price")[0].innerText =
    "UZS" + " " + total;
}

document.addEventListener("DOMContentLoaded", () => {
  fetch("./data/books.json")
    .then((response) => response.json())
    .then((data) => {
      let bookList = document.getElementById("book-list");
      data.forEach((book) => {
        let bookBox = document.createElement("div");
        bookBox.classList.add("product-box");
        bookBox.innerHTML = `
          <img src="${book.image}" class="product-img">
          <h2 class="product-title">${book.title}</h2>
          <span class="price">UZS ${book.price}</span>
          <i class="bx bx-shopping-bag add-cart"></i>
        `;
        bookList.appendChild(bookBox);
        bookBox.querySelector(".add-cart").addEventListener("click", () => {
          addItemToCart(book.title, `UZS ${book.price}`, book.image);
        });
      });
    })
    .catch((error) => {
      console.error({ error });
    });
});
