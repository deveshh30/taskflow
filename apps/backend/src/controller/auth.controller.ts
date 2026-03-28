import { Request, Response, NextFunction } from "express";
import { User } from "../model/User.model";
import { loginSchema, registerSchema } from "../schema/User.schema";
import { success } from "zod";
import bcrypt from 'bcryptjs';

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
    if ('password' in userResponse) {
      delete userResponse.password;
    }

    res.status(201).json({
      success: true,
      message: "User registered successfully",
      user: userResponse
    });
  } catch (error) {
    next(error);        
  }
};


export const loginUser = async (req:Request , res : Response , next : NextFunction) => {
  try {
    const validatedData = loginSchema.parse(req.body);

    const user = await User.findOne({ 
      $or : [
        {email : validatedData.identifier},
        {userName : validatedData.identifier},
      ]
    }).select('+password');

    if(!user ) {
      return res
      .status(401).json({
        success: false, 
        message: 'User with these credentials does not exist'
      });
    }

    const isPasswordValid = await bcrypt.compare(validatedData.password, user.password);
    
    if (!isPasswordValid) {
      return res.status(401).json({ 
        success: false, 
        message: 'Invalid email/username or password' 
      });
    }

    const userResponse = user.toObject();
    if ('password' in userResponse) {
      delete (userResponse as any).password;
    }

    res.status(200).json({
      success: true,
      message: 'Login successful',
      user: userResponse
    });
  } catch (error) {
    throw error;
  }
}