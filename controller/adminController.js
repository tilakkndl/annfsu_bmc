import Admin from "../model/adminModel.js";  
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";


const signToken = (id, role) => {
  return jwt.sign({ id, role }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
};

const createSendToken = (user, statusCode, res) => {
  const token = signToken(user._id, "admin"); // Assign role as "admin"
  const cookieOptions = {
    expires: new Date(
      Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000
    ),
    httpOnly: true,
  };
  if (process.env.NODE_ENV === "production") cookieOptions.secure = true;

  res.cookie("token", token, cookieOptions);

  // Remove password from output
  user.password = undefined;

  res.status(statusCode).json({
    status: "success",
    token,
    name: user.name,
    email: user.email,
    phoneNumber: user.phoneNumber,
  });
};

const adminRegister = async (req, res) => {
  try {
    const { name, email, phoneNumber, password } = req.body;
    if (!name || !email || !phoneNumber || !password) {
      return res.status(400).json({ msg: "All fields are required." });
    }

    if (password.length < 6) {
      return res
        .status(400)
        .json({ msg: "Password must be at least 6 characters long." });
    }

    // Check if admin already exists
    const existingAdmin = await Admin.findOne({ email });
    if (existingAdmin) {
      return res.status(400).json({ msg: "Admin already exists." });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newAdmin = new Admin({
      name,
      email,
      phoneNumber,
      password: hashedPassword,
    });

    const savedAdmin = await newAdmin.save();
    createSendToken(savedAdmin, 201, res);
  } catch (error) {
    res.status(500).json({ msg: "Something went wrong. Please try again." });
  }
};

const adminLogin = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ msg: "Email and password are required." });
    }

    const admin = await Admin.findOne({ email });
    if (!admin) {
      return res.status(400).json({ msg: "Admin does not exist." });
    }

    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch) {
      return res.status(400).json({ msg: "Invalid credentials." });
    }

    createSendToken(admin, 200, res);
  } catch (error) {
    res.status(500).json({ msg: "Something went wrong. Please try again." });
  }
};


const adminLogout = (req, res) => {
    try {
      // Clear the JWT cookie
      res.cookie("token", "", {
        expires: new Date(0),  
        httpOnly: true, 
      });
  
      res.status(200).json({
        status: "success",
        message: "Logged out successfully.",
      });
    } catch (error) {
      res.status(500).json({ msg: "Something went wrong. Please try again." });
    }
  };

export  {
  adminRegister,
  adminLogin,
    adminLogout
};
