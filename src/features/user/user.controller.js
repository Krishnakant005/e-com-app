import jwt from "jsonwebtoken";
import UserRepository from "./user.repository.js";
import { ApplicationError } from "../../error-handler/applicationError.js";
import bcrypt from "bcrypt";

export default class UserController {
  constructor() {
    this.userRepository = new UserRepository();
  }
  async resetPassword(req, res, next) {
    try {
      const userID = req.userID;

      const { newPassword } = req.body;

      const hashedPassword = await bcrypt.hash(newPassword, 12);

      const updatedUser = await this.userRepository.resetPassword(
        userID,
        hashedPassword,
      );

      res.status(200).json({
        message: "Password reset successfully",
        user: updatedUser,
      });
    } catch (error) {
      console.error("Error resetting password:", error);
      next(error);
    }
  }
  async signUp(req, res, next) {
    try {
      const { name, email, password, type } = req.body;
      const hashedPassword = await bcrypt.hash(password, 12);
      const newUser = await this.userRepository.signUp({
        name,
        email,
        password: hashedPassword,
        type,
      });
      res
        .status(201)
        .json({ message: "User created successfully", user: newUser });
    } catch (error) {
      console.error("Error signing up user:", error);
      next(error);
    }
  }
  async signIn(req, res, next) {
    try {
      const { email, password } = req.body;

      // 1. Find user by email
      const user = await this.userRepository.findByEmail(email);
      if (!user) {
        throw new ApplicationError("Invalid email or password", 401);
      }

      // 2. Compare password
      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (!isPasswordValid) {
        throw new ApplicationError("Invalid email or password", 401);
      }

      // 3. Generate token
      const token = jwt.sign(
        { userID: user._id, email: user.email },
        process.env.JWT_SECRET || "mySuperSecretJWTKey123",
        { expiresIn: "1h" },
      );

      res.status(200).json({
        message: "User signed in successfully",
        token: token,
      });
    } catch (error) {
      console.error("Error signing in user:", error);
      next(error); // ← let error middleware handle status codes
    }
  }
}