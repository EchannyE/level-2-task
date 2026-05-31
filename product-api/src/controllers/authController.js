import {
  registerUserService,
  loginUserService
} from "../services/authService.js";

export const registerUser = async (req, res) => {
  try {
    const result = await registerUserService(req.body);

    res.status(201).json({
      success: true,
      message: "User registered successfully",
      ...result
    });
  } catch (error) {
    res.status(error.statusCode || 500).json({
      success: false,
      message: error.message || "Registration failed"
    });
  }
};

export const loginUser = async (req, res) => {
  try {
    const result = await loginUserService(req.body);

    res.status(200).json({
      success: true,
      message: "Login successful",
      ...result
    });
  } catch (error) {
    res.status(error.statusCode || 500).json({
      success: false,
      message: error.message || "Login failed"
    });
  }
};