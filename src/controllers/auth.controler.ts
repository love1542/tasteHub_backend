import type { Request, Response } from "express";
import User from "../models/user.model.js";

export const login = async (req: Request, res: Response) => {
  res.json({
    message: "Login successful",
  });
};

export const registerUser = async (req: Request, res: Response) => {
    const { email, password } = req.body
    
    try {
        const newuser = await User.create({email, password})
        res.status(201).json({
            message: "User registered successfully",
            user: newuser
        })
    } catch (error) {
        res.status(500).json({
            message: "Error registering user",
            error
        })
    }
};