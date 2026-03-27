import { Request, Response, NextFunction } from "express";
import { User } from "../model/User.model";
import { registerSchema } from "../schema/User.schema";
import { success } from "zod";

export const registerUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
    try {
    const validatedData = registerSchema.parse(req.body);

    const existingUser = await User.findOne({ email: validatedData.email });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "User with this email already exists."
      });
    }

    const user = new User(validatedData);
    await user.save();

    const userResponse = user.toObject();
    delete userResponse.password;

    res.status(201).json({
      success: true,
      message: "User registered successfully",
      user: userResponse
    });
  } catch (error) {
    next(error);        
  }
}