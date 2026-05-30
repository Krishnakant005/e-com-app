//producID, userID, quantity
export class CartItemModel {
  constructor(productID, userID, quantity, id) {
    this.productID = productID;
    this.userID = userID;
    this.quantity = quantity;
    this.id = id;
  }

  static add(productID, userID, quantity) {
    const newCartItem = new CartItemModel(
      productID,
      userID,
      quantity,
      cartItems.length + 1,
    );
    cartItems.push(newCartItem);
    return newCartItem;
  }
  static get(userID) {
    return cartItems.filter((item) => item.userID === userID);
  }

  static getAll() {
    return cartItems;
  }
  static delete(cartItemID, userID) {
    const index = cartItems.findIndex(
      (item) => item.id === cartItemID && item.userID === userID,
    );
    if (index == -1) {
      return "Cart item not found";
    } else {
      cartItems.splice(index, 1);
      return "Cart item deleted";
    }
  }
}

var cartItems = [new CartItemModel(1, 2, 1, 1), new CartItemModel(1, 1, 2, 2)];
