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
//Price array with prices of all product items.
var priceArray = [ 10, 5, 20, 30, 50, 20, 40, 20, 350, 400, 300, 100];

//Image url array with url's of all the product images.
var urlArray = [
  "images/Box1_$10.png",
  "images/Box2_$5.png",
  "images/Clothes1_$20.png",
  "images/Clothes2_$30.png",
  "images/Jeans_$50.png",
  "images/Keyboard_$20.png",
  "images/KeyboardCombo_$40.png",
  "images/Mice_$20.png",
  "images/PC1_$350.png",
  "images/PC2_$400.png",
  "images/PC3_$300.png",
  "images/Tent_$100.png"
];

/**
*Creates a constructor function Product.
*initializes the properties name, price and imageUrl for constructor function
*/
var Product = function(name, price, quantity, imageUrl){
  this.name = name;
  this.price = price;
  this.imageUrl = imageUrl;
  this.quantity = quantity;
};

/**
*Creates a prototype function computeNetPrice.
*@Calculates total price according to quantity
*/
Product.prototype.computeNetPrice = function(quantity){
  return this.price*quantity;
};

/**
var box1 = new Product('Box1', 10, 'images/products/Box1_$10.png');
console.log( box1.name );
console.log( box1.computeNetPrice(5) );
**/


//Global variables
var inactiveTime = setInterval(alertUser, 1000);
var counter = 0;
var cart = {};
var products = {};
var total = 0;
var errorTimeout = 0;
var errorLimit = 10;
var checkoutTimeout = 0;
var checkoutLimit = 30;


/**
 * Success callback function to initialize products
 * @param response from the request made
 * @modifies: 'products' variable with all products
 */
function initializeProducts(response){
    var response = JSON.parse(response);
    console.log(response);
    errorTimeout = 0;
    for(var product in response){
        console.log(product);
        console.log(response[product]);
        var obj = {};
        obj = new Product(response[product].name, response[product].price, response[product].quantity, response[product].imageUrl);
        console.log(obj);
        products[product] = obj;
        document.getElementById("price_" + product).innerText = "$" + response[product].price;
    }

    updateCartTotal();
};

/**
 * Error callback function on request failure
 * @param error retrieved from request
 */
function handleRequestError(error){
  console.log("ERROR" + error);
  errorTimeout = errorTimeout + 1;
  if(errorTimeout < errorLimit){
    console.log("Making request again");
    makeRequest(initializeProducts, handleRequestError);
  }else{
    errorTimeout = 0;
  }
};

/**
 * Initializes the global variable products.
 *
 */
function init(){
  makeRequest(initializeProducts, handleRequestError);

  for(var i = 0; i < productsArray.length; i++){

    var removeButton = document.getElementById("remove_" + productsArray[i]);
    removeClass(removeButton, "removeButton");
    addClass(removeButton, "hideRemoveButton");

  }

};

/**
 * Make request to retrieve product list
 * @param successCallback the sucesscallback on success
 * @param errorCallback the errorcallback on error
 */
function makeRequest(successCallback, errorCallback){

    ajaxGet("https://cpen400a-bookstore.herokuapp.com/products", successCallback, errorCallback);

};

/**
*Creates a function to hide add button when the product is out of stock.
* Displays a friendly message to notify user.
*/
function hideAddButton(name){
  var addButton = document.getElementById("add_" + name);
  removeClass(addButton, "addButton");
  addClass(addButton, "hideAddButton");
  var outofstock = document.getElementById("stock_" + name);
  outofstock.innerText = "Out of stock!";
  removeClass(outofstock, "hideOutOfStock");
  addClass(outofstock, "outOfStock");
};

/**
*Creates a function to display add button when the product quantity is restocked.
*removes message out of stock when product quanity restocks
*/
function showAddButton(name){
  var addButton = document.getElementById("add_" + name);
  removeClass(addButton, "hideAddButton");
  addClass(addButton, "addButton");
  var outofstock = document.getElementById("stock_" + name);
  outofstock.innerText = "";
  removeClass(outofstock, "outOfStock");
  addClass(outofstock, "hideOutOfStock");
};

/**
*Creates a function to hide remove button.
*remove button is hidden when the product is not in the cart.
*/
function hideRemoveButton(name){
  var removeButton = document.getElementById("remove_" + name);
  removeClass(removeButton, "removeButton");
  addClass(removeButton, "hideRemoveButton");
};

/**
*Creates a function to show remove button.
*remove button is displayes when the product is availble in the cart.
*/
function showRemoveButton(name){
  var removeButton = document.getElementById("remove_" + name);
  removeClass(removeButton, "hideRemoveButton");
  addClass(removeButton, "removeButton");
};

/**
Remove class from html element.
*/
function removeClass( element, classname ) {
    var cn = element.className;
    cn = cn.replace( classname, '' );
    element.className = cn;
};

/**
Add given class to html element.
*/
function addClass( element, classname) {
    var cn = element.className;
    //test for existance
    if( cn.indexOf( classname ) != -1 ) {
        return;
    }
    //add a space if the element already has class
    if( cn != '' ) {
        classname = ' '+classname;
    }
    element.className = cn+classname;
};


/**
*Updates the total price of the products in the cart and calls the function
*computeNetPrice to calculate total price of the products.
*This function is called whenever any product is added or removed from the cart.
*/
function updateCartTotal(){
  total = 0;
  for(var key in cart){
    let quantity = cart[key];
    total = total + products[key].computeNetPrice(quantity);
  }
  //updateCart();

  document.getElementById("cartTotal").innerText = "Cart ($" + total + ")";

  return total;
};

/**
* Alert user to be used by timeout function to alert user.
*/
function alertUser(){
  counter = counter + 1;
  document.getElementById("inactiveTimeDisplay").innerText = "Inactive Time: " + counter;
  if(counter === 300){
    alert("Hey there! Are you still planning to buy something?");
    resetTimer();
  }
};

/**
*Clears and resets the global variable 'inactiveTime'. This function
*is called whenever a click action is performed.
*@modifies: 'inactiveTime' global variable.
*/
function resetTimer(){
  counter = 0;
  clearTimeout(inactiveTime);
  inactiveTime = setInterval(alertUser, 1000);
};

/**
*Adds a product item to global variable 'cart'.
*@modifies: Adds a product item to 'cart' if not present or increments quantity by 1 if already
*present.
*/
function addItem(name){
    if(products[name].quantity > 0){
      products[name].quantity = products[name].quantity - 1;
    }else{
      alert("This product is out of stock.");
      return;
    }
    var numProduct = cart[name];
    if(numProduct == null){
      cart[name] = 1;
      showRemoveButton(name);
    }else{
      cart[name] = cart[name] + 1;
      if(products[name].quantity === 0){
        hideAddButton(name);
      }
    }

    updateCart();
};

/**
*Removes an item from global variable 'cart'.
*@modifies: removes a product item from 'cart' if quanity is 1
*otherwise decrements quantity by 1
*/
function removeItem(name){
  if(cart[name] != null && cart[name] > 0){
    products[name].quantity = products[name].quantity + 1;
  }
  var numProduct = cart[name];
  if(numProduct == null){
    alert("Product does not exist in the cart.");
  }else if(numProduct == 1){
    delete cart[name];
    hideRemoveButton(name);
  }else{
    cart[name] = cart[name] - 1;
    showAddButton(name);
  }

  updateCart();
};

/**
*Constructs string of product items present in cart.
*@returns: string with concatenated product item names and respective quantities.
*/
function printCart(){
  var cartItems = "";
  for (var key in cart) {
    let value = cart[key];
    cartItems = cartItems + key + " " + ":" + "  " + value + "\n";
  }
  //console.log(cartItems);
  return cartItems;
};

/**
* Add to cart functions adds product item to cart and resets timer.
*/
function addToCart(productName){
  addItem(productName);
  updateCartTotal();
  resetTimer();
};

/**
*Remove from cart removes product item from cart and resets timer.
*/
function removeFromCart(productName){
  removeItem(productName);
  updateCartTotal();
  resetTimer();
};

/**
*Show cart alerts the user about current cart status with the product items
*in the cart presently.
*/
function showCart(){
  // var cartItems = printCart();
  // if(cartItems === ""){
  //   alert("No items in cart");
  // }else{
  //   //console.log("In show cart + cartitems:" + cartItems);
  //   alert(cartItems);
  // }
  resetTimer();

  document.getElementById("cartTotal").innerText = "Cart ($0)";
  // Get the modal
  var modal = document.getElementById('myModal');
  // Get the button that opens the modal
  var btn = document.getElementById("cartTotal");
  // Get the <span> element that closes the modal
  var span = document.getElementsByClassName("close")[0];
  // When the user clicks on the button, open the modal
  modal.style.display = "block";
  // When the user clicks on <span> (x), close the modal
  span.onclick = function() {
    modal.style.display = "none";
  }
  // When the user clicks anywhere outside of the modal, close it
  window.onclick = function(event) {
    if (event.target == modal) {
        modal.style.display = "none";
    }
  }

  updateCart();
  updateCartTotal();
};

/**
*Creates a function keyEvent.
*When a user presses esc key, the modal hides.
*/
function keyEvent(e) {
  var modal = document.getElementById('myModal');
	if(e.keyCode == 27){
		modal.style.display = "none";
	}
}


window.addEventListener("keydown", keyEvent, false);


/**
*Creates updateCart function, and displays the modal with product name, quantity
* and total price.
* Allows user to modify quantity on the modal itself.
*/
function updateCart(){
  updateCartTotal();
  var cartTable = document.getElementById("cartItems");
  cartTable.innerHTML = "";

  var rowT = cartTable.insertRow(0);
  var c1 = rowT.insertCell(0);
  var c2 = rowT.insertCell(1);
  var c3 = rowT.insertCell(2);
  c1.innerHTML = "<h4>Total: </h4>";
  c3.innerHTML = total;
  for (var key in cart) {
        var row = cartTable.insertRow(0);
	    	var c1 = row.insertCell(0);
	    	var c2 = row.insertCell(1);
	    	var c3 = row.insertCell(2);

	    	c1.innerHTML = key;
	    	c2.innerHTML = cart[key];
	    	quantity = cart[key];
	    	price = products[key].computeNetPrice(quantity);
        c2.innerHTML += '       '
        c2.innerHTML += '<button onclick=\'addToCart("'+ key +'")\'>+</button>'
        c2.innerHTML += '    '
        c2.innerHTML += '<button onclick=\'removeFromCart("'+ key +'")\'>-</button>'
	    	c3.innerHTML = price;

	}
  var row1 = cartTable.insertRow(0);
	var c1 = row1.insertCell(0);
	var c2 = row1.insertCell(1);
	var c3 = row1.insertCell(2);
	c1.innerHTML = "<h4>Product Name</h4>";
	c2.innerHTML = "<h4>Quantity</h4>";
	c3.innerHTML = "<h4>Price</h4>";
};

/**
 * The function to make an ajax call and handle success, error respectively.
 * @param url the url to which the request is made
 * @param successCallback callback function on success
 * @param errorCallback callback function on error
 */
var ajaxGet = function(url, successCallback, errorCallback) {
	var xhttp = new XMLHttpRequest();
	xhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
       // Typical action to be performed when the document is ready:
	//console.log(this.readyState + " " + this.status);
	    successCallback(this.responseText);
	  }
      else if (this.readyState == 4) {
		//console.log(this.readyState + " " + this.status + " " + "inside error");
		errorCallback(this.status);
      }
    };

	xhttp.onerror = function () {
        errorCallback(this.status);
    };

	xhttp.timeout = 2000;
    xhttp.open("GET", url, true);
    xhttp.send();
};

/**
 * Success callback function for request made on checkout
 * @param response retrieved from request
 */
function checkOutSuccess(response){
    var response = JSON.parse(response);
  console.log("Inside check out success");
  checkoutTimeout = 0;
  var isCartModified = false;
  for(var key in cart){
    console.log(products[key].price);
    console.log(response[key].price);
    if(products[key].price != response[key].price){
      var oldprice = products[key].price;
      var newprice = response[key].price;
      products[key].price =  newprice;
      alert("The price for product " + key + " has changed from $" +
            oldprice + " to $" + newprice);
      isCartModified = true;
    }

    console.log(response[key].quantity);
    console.log(cart[key]);
    if(cart[key] > response[key].quantity){
        if(response[key].quantity === 0){
            alert("Product " +  key + " is out of stock!");
            delete cart[key];
        }else {
            var newquantity = response[key].quantity;
            alert("The available quanity for " + key + " is " + newquantity);
            cart[key] = newquantity;
        }

        isCartModified = true;
    }
  }

    updateCart();
    var total = updateCartTotal();

    if(isCartModified){
        alert("The new total is $" + total);
    }

    alert("The products price and availability have been confirmed.")


};

/**
 * Error callback function for request made on checkout
 * @param response retrieved from request
 */
function checkOutFailure(response){
    checkoutTimeout = checkoutTimeout + 1;
    if(checkoutTimeout < checkoutLimit){
        console.log("Making request again");
        makeRequest(checkOutSuccess, checkOutFailure);
    }else{
        errorTimeout = 0;
    }
};

/**
 * Function called on clicking check out to make sure the products in the cart are valid
 */
function checkOut(){
    resetTimer();
    console.log("Inside check out");
    makeRequest(checkOutSuccess, checkOutFailure);
};






