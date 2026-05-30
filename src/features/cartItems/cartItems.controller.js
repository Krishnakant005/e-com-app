import CartItemsRepository from "./cartItems.repository.js";

export default class CartItemsController {
  constructor() {
    this.cartItemsRepository = new CartItemsRepository();
  }

  async add(req, res, next) {
    try {
      const { productID, quantity } = req.body;
      const userID = req.userID;
      await this.cartItemsRepository.add(productID, userID, Number(quantity));
      res.status(201).send("Cart is updated");
    } catch (error) {
      next(error);
    }
  }

  async get(req, res, next) {
    try {
      const userID = req.userID;
      const cartItems = await this.cartItemsRepository.get(userID);
      res.status(200).json(cartItems);
    } catch (error) {
      next(error);
    }
  }

  async delete(req, res, next) {
    try {
      const userID = req.userID;
      const cartItemID = req.params.id;
      const deletedItem = await this.cartItemsRepository.delete(
        userID,
        cartItemID,
      ); // ← passing cartItemID as productID
      if (!deletedItem) {
        return res.status(404).send("Cart item not found");
      }
      res.status(200).send("Cart item deleted");
    } catch (error) {
      next(error);
    }
  }
}
