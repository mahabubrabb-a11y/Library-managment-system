import jwt from "jsonwebtoken";
import User from "../models/User.js";

//! ১. ইউজার লগইন অবস্থায় আছে কি না চেক করার মিডলওয়্যার
export async function authenticateToken(req, res, next) {
  try {
    let token;

    // ১.১ হেডার থেকে Authorization টোকেন নেওয়া (Bearer <token>)
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer")
    ) {
      token = req.headers.authorization.split(" ")[1];
    }

    // টোকেন না থাকলে ব্লক করা
    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Not authorized, no token provided"
      });
    }

    // ১.২ টোকেন ভেরিফাই করা
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // ১.৩ ডাটাবেজ থেকে ইউজারের তথ্য খুঁজে বের করে req.user-এ সেট করা (পাসওয়ার্ড ছাড়া)
    req.user = await User.findById(decoded.id).select("-password -otp -otpExpiry");

    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: "User no longer exists"
      });
    }

    next(); // সব ঠিক থাকলে পরবর্তী কন্ট্রোলারে পাঠাবে

  } catch (error) {
    console.error("Auth Middleware Error:", error.message);
    return res.status(401).json({
      success: false,
      message: "Not authorized, token failed or expired"
    });
  }
}

//! ২. ইউজার Admin কি না তা চেক করার মিডলওয়্যার
export function isAdmin(req, res, next) {
  if (req.user && req.user.role === "admin") {
    next();
  } else {
    return res.status(403).json({
      success: false,
      message: "Access denied. Admin resources only."
    });
  }
}


// 特定/নির্দিষ্ট Roles চেক করার ডায়নামিক মিডলওয়্যার
export function authorizeRoles(...allowedRoles) {
  return (req, res, next) => {
    // protect মিডলওয়্যার থেকে req.user আসছে কি না তা দেখা
    if (!req.user || !req.user.role) {
      return res.status(401).json({
        success: false,
        message: "Not authorized, user role not found"
      });
    }

    // ইউজারের রোল অনুমতিপ্রাপ্ত রোলের তালিকায় আছে কি না চেক করা
    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: `Access denied. Role '${req.user.role}' is not allowed to access this resource.`
      });
    }

    next(); // রোল মিলে গেলে পরবর্তী কন্ট্রোলারে যাবে
  };
}