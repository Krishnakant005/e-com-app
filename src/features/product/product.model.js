  import { ApplicationError } from "../../error-handler/applicationError.js";
  import UserModel from "../user/user.model.js";

  export default class ProductModel {
    constructor(name, desc, price, imageUrl, category, sizes,id) {
    
      this.name = name;
      this.desc = desc;
      this.price = price;
      this.imageUrl = imageUrl;
      this.category = category;
      this.sizes = sizes;
      this._id = id;
    }
  }