import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import crypto from "crypto";
import User from "../models/User.js"

export const signupService = async (data) => {

    const { name, email, password } = data;

    if (!name || !email || !password) {
        const error = new Error("All fields are required");
        error.statusCode = 400;
        throw error;
    }

    const existingUser = await User.findOne({ email });

    if (existingUser) {
        const error = new Error("User already exists");
        error.statusCode = 409;
        throw error;
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
        userId: crypto.randomUUID(),
        name,
        email,
        password: hashedPassword,
    });

    const sanitizedUser = {
        id: user._id,
        userId: user.userId,
        name: user.name,
        email: user.email,
    };

    return {
        message: "User registered successfully",
        user: sanitizedUser
    };
};


export const loginService = async (data) => {

    const { email, password } = data;

    // Validation
    if (!email || !password) {

        const error = new Error(
            "Email and password are required"
        );

        error.statusCode = 400;

        throw error;
    }

    // Find user
    const user = await User.findOne({ email });

    if (!user) {

        const error = new Error("User not found");

        error.statusCode = 404;

        throw error;
    }

    // Compare password
    const isPasswordMatched = await bcrypt.compare(
        password,
        user.password
    );

    if (!isPasswordMatched) {

        const error = new Error("Invalid credentials");

        error.statusCode = 401;

        throw error;
    }

    // JWT payload
    const payload = {
        id: user._id,
        userId: user.userId,
        email: user.email,
    };

    // Generate token
    const token = jwt.sign(
        payload,
        process.env.JWT_SECRET,
        {
            expiresIn:
                process.env.JWT_EXPIRES_IN || "7d",
        }
    );

    // Sanitized user
    const sanitizedUser = {
        id: user._id,
        userId: user.userId,
        name: user.name,
        email: user.email,
    };

    return {
        message: "Login Successful",
        token,
        user: sanitizedUser,
    }
};