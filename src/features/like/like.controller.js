import { LikeRepository } from "./like.repository.js";

export class LikeController {
  constructor() {
    this.likeRepository = new LikeRepository();
  }

  async likeItem(req, res, next) {
    try {
      const { id, type } = req.body;

      if (!id || !type) {
        return res.status(400).send({ error: "id and type are required" });
      }

      if (type !== "Product" && type !== "Category") {
        return res
          .status(400)
          .send({ error: "Invalid type. Must be 'Product' or 'Category'" });
      }

      if (type === "Product") {
        const product = await this.likeRepository.getProductById(id);
        if (!product)
          return res.status(404).send({ error: "Product not found" });
      } else {
        const category = await this.likeRepository.getCategoryById(id);
        if (!category)
          return res.status(404).send({ error: "Category not found" });
      }

      const userID = req.userID;
      const result = await this.likeRepository.likeItem(userID, id, type);
      res.status(200).send(result);
    } catch (error) {
      console.error("Error liking item:", error);
      next(error);
    }
  }

  async getLikes(req, res, next) {
    try {
      const userID = req.userID;
      const result = await this.likeRepository.getLikes(userID);
      res.status(200).send(result);
    } catch (error) {
      console.error("Error fetching likes:", error);
      next(error);
    }
  }
}
