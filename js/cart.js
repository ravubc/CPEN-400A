//Product array with names of all product items.
var productsArray = [
  "Box1",
  "Box2",
  "Clothes1",
  "Clothes2",
  "Jeans",
  "Keyboard",
  "KeyboardCombo",
  "Mice",
  "PC1",
  "PC2",
  "PC3",
  "Tent"
];

//Global variables
var inactiveTime = setTimeout(alertUser, 30000);
var cart = [];
var products = [];
init();

/**
 * Initializes the product array
 */
function init(){
  for(var i = 0; i < productsArray.length; i++){
    products[productsArray[i]] = 5;
  }
};

function alertUser(){
  alert("Hey there! Are you still planning to buy something?");
};

function resetTimer(){
  clearTimeout(inactiveTime);
  inactiveTime = setTimeout(alertUser, 30000);
};

function addItem(name){
    if(products[name] > 0){
      products[name] = products[name] - 1;
    }else{
      alert("This product is out of stock.");
      return;
    }
    var numProduct = cart[name];
    if(numProduct == null){
      cart[name] = 1;
    }else{
      cart[name] = cart[name] + 1;
    }
};

function removeItem(name){
  if(products[name] < 5){
    products[name] = products[name] + 1;
  }
  var numProduct = cart[name];
  if(numProduct == null){
    alert("Product does not exist in the cart.");
  }else if(numProduct == 1){
    delete cart[name];
  }else{
    cart[name] = cart[name] - 1;
  }
};

function getItems(){
    return cart;
};

function getProducts(){
    return products;
};

function getNumOfProducts(name){
  var numProduct = cart[name];
  if(numProduct == null){
    return 0;
  }else{
    return numProduct;
  }
};

function printCart(){
  var cartItems = "";
  for (var key in cart) {
    let value = cart[key];
    cartItems = cartItems + key + " " + ":" + "  " + value + "\n";
  }
  //console.log(cartItems);
  return cartItems;
};

function addToCart(productName){
  addItem(productName);
  resetTimer();
};

function removeFromCart(productName){
  removeItem(productName);
  resetTimer();
};

function showCart(){
  var cartItems = printCart();
  console.log("In Show Cart");
  if(cartItems === ""){
    alert("No items in cart");
  }else{
    //console.log("In show cart + cartitems:" + cartItems);
    alert(cartItems);
  }
};
