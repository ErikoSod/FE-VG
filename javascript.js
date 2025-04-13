function loadProductPage() {
  fetch("https://fakestoreapi.com/products")
    .then((res) => res.json())
    .then((products) => render(products));
  updateCart();
}

function render(products) {
  let output = '<div class="row g-4">';

  products.forEach((product) => {
    output += `
<div class="col-12 col-sm-6 col-md-4 col-lg-3 mb-4">
<div class="card" style="width: 100%">
  <img src="${product.image}" class="card-img-top" alt="${product.title}">
  <div class="card-body">
    <h5 class="card-title">${product.title}</h5>
    <h6>${(product.price * 10).toFixed(2)} kr</h6>
    <button class="btn btn-secondary" onclick='addToCart(${product.id},"${
      product.title
    }",${product.price}* 10)'>Add to Cart</button>
  </div>
</div>
</div>
`;
  });

  output += "</div>";

  document.getElementById("Products").innerHTML = output;
}

function addToCart(id, name, price) {
  console.log(price + " " + name);

  if (localStorage.getItem(id)) {
    let item = JSON.parse(localStorage.getItem(id));
    let amount = parseInt(item[3]) + 1;
    let productInfo = [id, name, price, amount];

    localStorage.setItem(id, JSON.stringify(productInfo));
  } else {
    console.log("new");

    let newProductInfo = [id, name, price, 1];
    localStorage.setItem(id, JSON.stringify(newProductInfo));
  }
  updateCart();
}

function removeOneFromCart(id) {
  let item = JSON.parse(localStorage.getItem(id));
  let amount = parseInt(item[3]) - 1;
  if (amount == 0) {
    localStorage.removeItem(id);
  } else {
    let productInfo = [item[0], item[1], item[2], amount];
    localStorage.setItem(id, JSON.stringify(productInfo));
  }
  updateCart();
}


function updateCart() {
  document.getElementById("cartbody").innerHTML = "";
  let sum = 0;

  for (var i = 0; i < localStorage.length; i++) {
    let item = JSON.parse(localStorage.getItem(localStorage.key(i)));
    let id = item[0];
    let name = item[1];
    let price = item[2];
    let amount = item[3];

    let cartCard = document.createElement("div");

    cartCard.setAttribute("class", "container rounded");
    cartCard.setAttribute("id", "cartItem");

    let pName = document.createElement("div");
    pName.innerHTML = `<b>${name}</b>`;

    let add = document.createElement("a");
    add.setAttribute("class", "pointer-link");
    add.innerHTML = '<i class="fa fa-plus-circle" aria-hidden="true"></i>';
    add.addEventListener("click", function () {
      addToCart(id, name, price);
    });

    let removeOne = document.createElement("a");
    removeOne.setAttribute("class", "pointer-link");
    removeOne.innerHTML =
      '<i class="fa fa-minus-circle" aria-hidden="true"></i>';
    removeOne.addEventListener("click", function () {
      removeOneFromCart(id);
    });

    let removeAll = document.createElement("a");
    removeAll.setAttribute("class", "pointer-link");
    removeAll.innerHTML = '<i class="fa fa-trash" aria-hidden="true"></i>';
    removeAll.addEventListener("click", function () {
      localStorage.removeItem(id);
      updateCart();
    });

    let pAmount = document.createElement("div");
    pAmount.append((price * amount).toFixed(2) + " kr");

    buttonSpan = document.createElement("span");
    buttonSpan.setAttribute("style", "float:right");

    buttonSpan.appendChild(removeOne);
    buttonSpan.append(amount);
    buttonSpan.appendChild(add);
    buttonSpan.appendChild(removeAll);

    pAmount.appendChild(buttonSpan);
    pName.appendChild(pAmount);
    cartCard.appendChild(pName);
    document.getElementById("cartbody").appendChild(cartCard);
    sum += price * amount;
  }

  if (localStorage.length > 0) {
    let pPrice = document.createElement("p");
    pPrice.setAttribute("style","margin-top: 10px")
    pPrice.innerHTML = `<b>Total cost: </b> ${sum.toFixed(2)} kr`;
    document.getElementById("cartbody").appendChild(pPrice);

    let clearCart = document.createElement("button");
    clearCart.setAttribute("class", "btn btn-secondary");
    clearCart.innerHTML = "Clear Cart";
    clearCart.addEventListener("click", function () {
      localStorage.clear();
      updateCart();
    });
    document.getElementById("cartbody").appendChild(clearCart);

    let checkOut = document.createElement("button");
    checkOut.setAttribute("class", "btn btn-secondary");
    checkOut.innerHTML = "Check Out";
    checkOut.addEventListener("click", function () {
      window.location = "order.html";
    });
    document.getElementById("cartbody").appendChild(checkOut);
  }
}

function order(parentElement) {
  let sum = 0;

  for (var i = 0; i < localStorage.length; i++) {
    let item = JSON.parse(localStorage.getItem(localStorage.key(i)));
    let name = item[1];
    let price = item[2];
    let amount = item[3];

    let cartCard = document.createElement("div");

    cartCard.setAttribute("class", "container rounded");
    cartCard.setAttribute("id", "cartItem");

    let pName = document.createElement("div");
    pName.innerHTML = `<b>${name} x ${amount} </b>`;

    let pAmount = document.createElement("p");
    pAmount.append((price * amount).toFixed(2) + " kr");

    pName.appendChild(pAmount);
    cartCard.appendChild(pName);
    document.getElementById(parentElement.toString()).appendChild(cartCard);
    sum += price * amount;
  }

  let pPrice = document.createElement("p");
  pPrice.setAttribute("class", "text-center");
  pPrice.innerHTML = "<b>Total cost: </b>" + sum.toFixed(2) + " kr";
  document.getElementById(parentElement.toString()).appendChild(pPrice);

  if (parentElement == "completeOrder") {
    localStorage.clear();
  }
}

function validateForm(e) {
  e.preventDefault();
  let validater = true;

  let name = document.forms["customerForm"]["customerName"].value;
  let mail = document.forms["customerForm"]["e-mail"].value;
  let phone = document.forms["customerForm"]["phoneNumber"].value;
  let street = document.forms["customerForm"]["street"].value;
  let zipcode = document.forms["customerForm"]["zipCode"].value;
  let city = document.forms["customerForm"]["city"].value;

  document.getElementById("nameLable").innerHTML = "First- and Last Name:";
  if (name.length < 2 || name.length > 50) {
    document.getElementById(
      "nameLable"
    ).innerHTML += `<div style="color:Tomato">At least 2 symbols, max 50</div>`;
    validater = false;
  }

  document.getElementById("mailLable").innerHTML = "E-mail:";
  if (!mail.includes("@") || mail.length > 50) {
    document.getElementById(
      "mailLable"
    ).innerHTML += `<div style="color:Tomato">Must contain an '@' symbol</div>`;
    validater = false;
  }

  document.getElementById("phoneLable").innerHTML = "Phone Number:";
  if (/[^\d()-]/.test(phone) || phone == "") {
    document.getElementById(
      "phoneLable"
    ).innerHTML += `<div style="color:Tomato">Only numbers, hyphen and parentheses</div>`;
    validater = false;
  }

  document.getElementById("streetLable").innerHTML = "Street:";
  if (street.length < 2 || street.length > 50) {
    document.getElementById(
      "streetLable"
    ).innerHTML += `<div style="color:Tomato">At least 2 symbols, max 50</div>`;
    validater = false;
  }

  document.getElementById("zipLable").innerHTML = "Zip code:";
  if (zipcode.length != 5 || /[^\d]/.test(zipcode)) {
    document.getElementById(
      "zipLable"
    ).innerHTML += `<div style="color:Tomato">Exactly 5 numbers</div>`;
    validater = false;
  }

  document.getElementById("cityLable").innerHTML = "City:";
  if (city.length < 2 || city.length > 50) {
    document.getElementById(
      "cityLable"
    ).innerHTML += `<div style="color:Tomato">At least 2 symbols, max 50</div>`;
    validater = false;
  }

  if (validater) {
    alert("Order Successful");
    window.location = "orderComplete.html";
  }
}
