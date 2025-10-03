import Admin from "../models/Admin.js";
import jwt from "jsonwebtoken";

// Generate JWT Token
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET || "your-secret-key", {
    expiresIn: "30d",
  });
};

// @desc    Register admin (untuk development, bisa di-comment nanti)
// @route   POST /api/auth/register
export async function registerAdmin(req, res) {
  try {
    const { username, password, name, email } = req.body;

    // Check if admin already exists
    const adminExists = await Admin.findOne({ $or: [{ username }, { email }] });
    if (adminExists) {
      return res.status(400).json({ message: "Admin already exists" });
    }

    // Create admin
    const admin = await Admin.create({
      username,
      password,
      name,
      email,
    });

    if (admin) {
      res.status(201).json({
        _id: admin._id,
        username: admin.username,
        name: admin.name,
        email: admin.email,
        token: generateToken(admin._id),
      });
    }
  } catch (error) {
    console.error("Error in registerAdmin:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
}

// @desc    Login admin
// @route   POST /api/auth/login
export async function loginAdmin(req, res) {
  try {
    const { username, password } = req.body;

    // Find admin
    const admin = await Admin.findOne({ username });

    if (admin && (await admin.comparePassword(password))) {
      res.json({
        _id: admin._id,
        username: admin.username,
        name: admin.name,
        email: admin.email,
        token: generateToken(admin._id),
      });
    } else {
      res.status(401).json({ message: "Invalid username or password" });
    }
  } catch (error) {
    console.error("Error in loginAdmin:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
}

// @desc    Get admin profile
// @route   GET /api/auth/profile
export async function getAdminProfile(req, res) {
  try {
    const admin = await Admin.findById(req.admin._id).select("-password");
    
    if (admin) {
      res.json(admin);
    } else {
      res.status(404).json({ message: "Admin not found" });
    }
  } catch (error) {
    console.error("Error in getAdminProfile:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
}

