/**import { generate } from "otp-generator";
import User from "../models/User.js";
import sendOtp from "../unity/sendOTP.js";
import bcrypt from "bcryptjs";
import { v4 as uuidv4 } from "uuid";
import jwt from "jsonwebtoken"
import models from "../models/User.js"






//! registration of a student step 1: register user and send otp
export async function registerUser(req, res) {
  try {
    const { name, email, phone, password } = req.body;

    if (!email) return res.status(400).json({
      message: "Email is required."
    });

    const cleanPhone = phone ? phone.toString().replace(/\D/g, "") : "";
    if (cleanPhone.length !== 10) {
      return res.status(400).json({
        message: "Mobile number must be exactly of 10 digits"
      });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      if (existingUser.isVerified) return res.status(400).json({
        message: "User already exists"
      });
      await User.deleteOne({ email });
    }

    const otp = generate(6, {
      upperCaseAlphabets: false,
      lowerCaseAlphabets: false,
      specialChars: false
    });

    // to send otp
    try {
      // এখানে আপনার Nodemailer/SMS সার্ভিস দিয়ে OTP পাঠানোর কোড থাকবে
      await sendOtpToEmail(email, otp);
      
    } catch (emailError) {
      console.error('Error send', emailError)
      return res.status(500).json({
        message : "Field to send OTP email please try again"
      })

     const hashedPassword = await bcrypt.hash(password,10);
     const otpExpiry = new Date ( Date.now()+5 * 60 *1000)
    const studentID = `ST-${uuidv4().slice(0, 8).toUpperCase()}`;

    
    const user = await User.create({
  name,
  email,
  phone: cleanPhone,
  password: hashedPassword,
  otp,
  otpExpiry,
  studentId
});

res.status(201).json({
  message: `User registered successfully, OTP sent to email: ${user.email}`,
  user
});

    }


  } catch (error) {
     console.error('error register user', error)
     res.status(500).json({message : "Error register message: ", error : error.message})
  }
}





//! step-2 otp verify 
export async function verifyOtp(req, res) {
  try {
    const { email, otp } = req.body;

    if (!email || !otp) {
      return res.status(400).json({
        message: "Email and OTP are required"
      });
    }

    const user = await User.findOne({ email });

    // ইউজার না পাওয়া গেলে
    if (!user) {
      return res.status(404).json({
        message: "User not found"
      });
    }

    // অ্যাকাউন্ট যদি আগে থেকেই ভেরিফায়েড থাকে
    if (user.isVerified) {
      return res.status(400).json({
        message: "User is already verified"
      });
    }

    // OTP ম্যাচ না করলে
    if (user.otp !== otp) {
      return res.status(400).json({
        message: "Invalid OTP"
      });
    }

    // OTP-এর মেয়াদ শেষ হয়ে গেলে
    if (user.otpExpiry < new Date()) {
      return res.status(400).json({
        message: "OTP has expired. Please request a new one."
      });
    }

    // OTP সঠিক হলে ইউজারকে ভেরিফাইড করা
    user.isVerified = true;
    user.otp = undefined;       // ভেরিফাই হওয়ার পর OTP মুছে দেওয়া হলো
    user.otpExpiry = undefined; // মেয়াদও ক্লিয়ার করা হলো
    await user.save();

    return res.status(200).json({
      message: "Account verified successfully!",
      isVerified: user.isVerified
    });

  } catch (error) {
    console.error("Error verifying OTP:", error);
    return res.status(500).json({
      message: "Failed to verify OTP",
      error: error.message
    });
  }
}






//! complete Profile
// step 3: complete profile
export async function completeProfile(req, res) {
  try {
    const { email, department, stream, semester, year, rollNo } = req.body;

    if (!email) {
      return res.status(400).json({ message: "Email is required" });
    }

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // ১. ইউজার অ্যাকাউন্ট ভেরিফাই করেছে কি না তা চেক করা
    if (!user.isVerified) {
      return res.status(400).json({ 
        message: "Please verify your email with OTP first." 
      });
    }

    // ২. প্রোফাইলের নতুন তথ্যগুলো সেট করা
    user.department = department || user.department;
    user.stream = stream || user.stream;
    user.semester = semester || user.semester;
    user.year = year || user.year;
    user.rollNo = rollNo || user.rollNo;

    // ৩. প্রোফাইল কমপ্লিট স্ট্যাটাস ট্রু করে দেওয়া
    user.isProfileComplete = true;

    await user.save();

    return res.status(200).json({
      message: "Profile completed successfully!",
      user
    });

  } catch (error) {
    console.error("Error completing profile:", error);
    return res.status(500).json({
      message: "Failed to complete profile",
      error: error.message
    });
  }
}





//! Login as a student or admin 
export async function loginUser(req, res) {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email and Password are required"
      });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found"
      });
    }

    if (!user.isVerified) {
      return res.status(403).json({
        success: false,
        message: "Please verify your email with OTP before logging in."
      });
    }

    const isPasswordMatch = await bcrypt.compare(password, user.password);
    if (!isPasswordMatch) {
      return res.status(400).json({
        success: false,
        message: "Invalid credentials"
      });
    }

    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    return res.status(200).json({
      success: true,
      message: `${user.role === "admin" ? "Admin" : "Student"} logged in successfully`,
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        studentId: user.studentId
      }
    });

  } catch (error) {
    console.error("Login Error:", error);
    return res.status(500).json({
      success: false,
      message: "Server Error",
      error: error.message
    });
  }
}





//! get current user profile (me)
export async function getProfile(req, res) {
  try {
    const user = await User.findById(req.user.id).select("-password -otp -otpExpiry");

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found"
      });
    }

    return res.status(200).json({
      success: true,
      user
    });

  } catch (error) {
    console.error("Error getting user profile:", error);
    return res.status(500).json({
      success: false,
      message: "Server error while fetching profile",
      error: error.message
    });
  }
}





//! update user profile 
export async function updateProfile(req, res) {
  try {
    const { name, email, phone, department, stream, semester, academicYear, rollNumber } = req.body;
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ message: "User not found" });

    if (email) {
      const normalizedEmail = email.trim().toLowerCase();
      if (normalizedEmail !== user.email.toLowerCase()) {
        if (user.role === "user") {
          return res.status(400).json({ message: "Students are not allowed to change their email address" });
        }
        if (await User.findOne({ email: normalizedEmail, _id: { $ne: user._id } })) {
          return res.status(400).json({ message: "Email already in use" });
        }
        user.email = normalizedEmail;
      }
    }
    if (phone) {
      const cleanPhone = phone.toString().replace(/\D/g, "");
      if (cleanPhone.length !== 10) {
        return res.status(400).json({ message: "Mobile number must be exactly 10 digits" });
      }
      user.phone = cleanPhone;
    }

    if (name) user.name = name;
    if (department) user.department = department;
    if (stream) user.stream = stream;
    if (semester) user.semester = semester;
    if (academicYear) user.year = academicYear;
    if (rollNumber) user.rollNo = rollNumber;

    await user.save();
    res.status(200).json({ success: true, message: "Profile updated successfully", user });
  } catch (error) {
    console.error("Error updating profile:", error);
    res.status(500).json({ message: "Error updating profile", error: error.message });
  }
}





// ! Get all verified and completed student accounts
export async function getUsers(req, res) {
  try {
    const users = await User.find({
      role: "user",              // অথবা "student", আপনার স্কিমা অনুযায়ী
      isVerified: true,
      isProfileComplete: true
    }).select("-password -otp -otpExpiry");

    return res.status(200).json({
      success: true,
      count: users.length,
      users
    });

  } catch (error) {
    console.error("Error fetching users:", error);
    return res.status(500).json({
      success: false,
      message: "Error fetching users",
      error: error.message
    });
  }
}






//! for get admin registation 
// register new admin account
export async function registerAdmin(req, res) {
  try {
    const { name, email, phone, password } = req.body;

    // ১. প্রয়োজনীয় ইনপুট ভ্যালিডেশন
    if (!name || !email || !phone || !password) {
      return res.status(400).json({
        message: "Please enter all required fields."
      });
    }

    // ২. ইমেইল ক্লিন এবং ডুপ্লিকেট চেক
    const normalizedEmail = email.trim().toLowerCase();
    const existingUser = await User.findOne({ email: normalizedEmail });

    if (existingUser) {
      return res.status(400).json({
        message: `User already exists with email: ${normalizedEmail}`
      });
    }

    // ৩. ফোন নাম্বার ভ্যালিডেশন (১০ ডিজিট)
    const cleanPhone = phone.toString().replace(/\D/g, "");
    if (cleanPhone.length !== 10) {
      return res.status(400).json({
        message: "Mobile number must be exactly 10 digits"
      });
    }

    // ৪. পাসওয়ার্ড হ্যাশিং
    const hashedPassword = await bcrypt.hash(password, 10);

    // ৫. এডমিন অ্যাকাউন্ট তৈরি
    const admin = await User.create({
      name,
      email: normalizedEmail,
      phone: cleanPhone,
      password: hashedPassword,
      role: "admin",             // রোল সেট করা হলো এডমিন
      isVerified: true,         // এডমিনদের অটো-ভেরিফাইড রাখা হলো
      isProfileComplete: true   // প্রোফাইলও অটো-কমপ্লিট
    });

    // ৬. সফল রেসপন্স (পাসওয়ার্ড বাদ দিয়ে)
    return res.status(201).json({
      success: true,
      message: "Admin registered successfully!",
      admin: {
        id: admin._id,
        name: admin.name,
        email: admin.email,
        phone: admin.phone,
        role: admin.role
      }
    });

  } catch (error) {
    console.error("Error registering admin:", error);
    return res.status(500).json({
      success: false,
      message: "Error registering admin",
      error: error.message
    });
  }
} */

import { generate } from "otp-generator";
import User from "../models/User.js";
import sendOtp from "../unity/sendOTP.js";
import bcrypt from "bcryptjs";
import { v4 as uuidv4 } from "uuid";
import jwt from "jsonwebtoken";

//! registration of a student step 1: register user and send otp
export async function registerUser(req, res) {
  try {
    const { name, email, phone, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        message: "Email and password are required."
      });
    }

    const cleanPhone = phone ? phone.toString().replace(/\D/g, "") : "";
    if (cleanPhone && cleanPhone.length !== 10) {
      return res.status(400).json({
        message: "Mobile number must be exactly 10 digits"
      });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      if (existingUser.isVerified) {
        return res.status(400).json({ message: "User already exists" });
      }
      // অন-ভেরিফাইড ইউজার হলে আগের ডেটা মুছে ফেলা হবে
      await User.deleteOne({ email });
    }

    // OTP জেনারেট করা
    const otp = generate(6, {
      upperCaseAlphabets: false,
      lowerCaseAlphabets: false,
      specialChars: false
    });

    // ইমেইল সার্ভিস দিয়ে OTP পাঠানো (সঠিক ফাংশন sendOtp)
    try {
      await sendOtp(email, otp);
    } catch (emailError) {
      console.error('Error sending OTP:', emailError);
      return res.status(500).json({
        message: "Failed to send OTP email, please try again"
      });
    }

    // পাসওয়ার্ড হ্যাশ এবং ইউজার ডাটাবেজে ক্রিয়েট
    const hashedPassword = await bcrypt.hash(password, 10);
    const otpExpiry = new Date(Date.now() + 5 * 60 * 1000); // 5 Minutes
    const studentId = `ST-${uuidv4().slice(0, 8).toUpperCase()}`;

    const user = await User.create({
      name,
      email,
      phone: cleanPhone,
      password: hashedPassword,
      otp,
      otpExpiry,
      studentId
    });

    return res.status(201).json({
      success: true,
      message: `User registered successfully, OTP sent to email: ${user.email}`,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        studentId: user.studentId
      }
    });

  } catch (error) {
    console.error('Error registering user:', error);
    return res.status(500).json({ 
      message: "Error registering user", 
      error: error.message 
    });
  }
}

//! step-2 otp verify 
export async function verifyOtp(req, res) {
  try {
    const { email, otp } = req.body;

    if (!email || !otp) {
      return res.status(400).json({
        message: "Email and OTP are required"
      });
    }

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (user.isVerified) {
      return res.status(400).json({ message: "User is already verified" });
    }

    if (user.otp !== otp) {
      return res.status(400).json({ message: "Invalid OTP" });
    }

    if (user.otpExpiry < new Date()) {
      return res.status(400).json({ message: "OTP has expired. Please request a new one." });
    }

    user.isVerified = true;
    user.otp = undefined;
    user.otpExpiry = undefined;
    await user.save();

    return res.status(200).json({
      success: true,
      message: "Account verified successfully!",
      isVerified: user.isVerified
    });

  } catch (error) {
    console.error("Error verifying OTP:", error);
    return res.status(500).json({
      message: "Failed to verify OTP",
      error: error.message
    });
  }
}

//! step 3: complete profile
export async function completeProfile(req, res) {
  try {
    const { email, department, stream, semester, year, rollNo } = req.body;

    if (!email) {
      return res.status(400).json({ message: "Email is required" });
    }

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (!user.isVerified) {
      return res.status(400).json({ 
        message: "Please verify your email with OTP first." 
      });
    }

    user.department = department || user.department;
    user.stream = stream || user.stream;
    user.semester = semester || user.semester;
    user.year = year || user.year;
    user.rollNo = rollNo || user.rollNo;
    user.isProfileComplete = true;

    await user.save();

    return res.status(200).json({
      success: true,
      message: "Profile completed successfully!",
      user
    });

  } catch (error) {
    console.error("Error completing profile:", error);
    return res.status(500).json({
      message: "Failed to complete profile",
      error: error.message
    });
  }
}

//! Login as a student or admin 
export async function loginUser(req, res) {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email and Password are required"
      });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found"
      });
    }

    if (!user.isVerified) {
      return res.status(403).json({
        success: false,
        message: "Please verify your email with OTP before logging in."
      });
    }

    const isPasswordMatch = await bcrypt.compare(password, user.password);
    if (!isPasswordMatch) {
      return res.status(400).json({
        success: false,
        message: "Invalid credentials"
      });
    }

    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    return res.status(200).json({
      success: true,
      message: `${user.role === "admin" ? "Admin" : "Student"} logged in successfully`,
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        studentId: user.studentId
      }
    });

  } catch (error) {
    console.error("Login Error:", error);
    return res.status(500).json({
      success: false,
      message: "Server Error",
      error: error.message
    });
  }
}

//! get current user profile (me)
export async function getProfile(req, res) {
  try {
    const user = await User.findById(req.user.id).select("-password -otp -otpExpiry");

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found"
      });
    }

    return res.status(200).json({
      success: true,
      user
    });

  } catch (error) {
    console.error("Error getting user profile:", error);
    return res.status(500).json({
      success: false,
      message: "Server error while fetching profile",
      error: error.message
    });
  }
}

//! update user profile 
export async function updateProfile(req, res) {
  try {
    const { name, email, phone, department, stream, semester, academicYear, rollNumber } = req.body;
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ message: "User not found" });

    if (email) {
      const normalizedEmail = email.trim().toLowerCase();
      if (normalizedEmail !== user.email.toLowerCase()) {
        if (user.role === "user") {
          return res.status(400).json({ message: "Students are not allowed to change their email address" });
        }
        if (await User.findOne({ email: normalizedEmail, _id: { $ne: user._id } })) {
          return res.status(400).json({ message: "Email already in use" });
        }
        user.email = normalizedEmail;
      }
    }
    if (phone) {
      const cleanPhone = phone.toString().replace(/\D/g, "");
      if (cleanPhone.length !== 10) {
        return res.status(400).json({ message: "Mobile number must be exactly 10 digits" });
      }
      user.phone = cleanPhone;
    }

    if (name) user.name = name;
    if (department) user.department = department;
    if (stream) user.stream = stream;
    if (semester) user.semester = semester;
    if (academicYear) user.year = academicYear;
    if (rollNumber) user.rollNo = rollNumber;

    await user.save();
    return res.status(200).json({ success: true, message: "Profile updated successfully", user });
  } catch (error) {
    console.error("Error updating profile:", error);
    return res.status(500).json({ message: "Error updating profile", error: error.message });
  }
}

//! Get all verified and completed student accounts
export async function getUsers(req, res) {
  try {
    const users = await User.find({
      role: "user",
      isVerified: true,
      isProfileComplete: true
    }).select("-password -otp -otpExpiry");

    return res.status(200).json({
      success: true,
      count: users.length,
      users
    });

  } catch (error) {
    console.error("Error fetching users:", error);
    return res.status(500).json({
      success: false,
      message: "Error fetching users",
      error: error.message
    });
  }
}

//! register new admin account
export async function registerAdmin(req, res) {
  try {
    const { name, email, phone, password } = req.body;

    if (!name || !email || !phone || !password) {
      return res.status(400).json({
        message: "Please enter all required fields."
      });
    }

    const normalizedEmail = email.trim().toLowerCase();
    const existingUser = await User.findOne({ email: normalizedEmail });

    if (existingUser) {
      return res.status(400).json({
        message: `User already exists with email: ${normalizedEmail}`
      });
    }

    const cleanPhone = phone.toString().replace(/\D/g, "");
    if (cleanPhone.length !== 10) {
      return res.status(400).json({
        message: "Mobile number must be exactly 10 digits"
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const admin = await User.create({
      name,
      email: normalizedEmail,
      phone: cleanPhone,
      password: hashedPassword,
      role: "admin",
      isVerified: true,
      isProfileComplete: true
    });

    return res.status(201).json({
      success: true,
      message: "Admin registered successfully!",
      admin: {
        id: admin._id,
        name: admin.name,
        email: admin.email,
        phone: admin.phone,
        role: admin.role
      }
    });

  } catch (error) {
    console.error("Error registering admin:", error);
    return res.status(500).json({
      success: false,
      message: "Error registering admin",
      error: error.message
    });
  }
}









