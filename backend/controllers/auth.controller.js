import bcrypt from "bcryptjs";
import generateTokenAndSetCookie from "../utils/generateToken.js";
import User from "../models/authuser.model.js";
// check const uesr = new user() why not working;
export const signup = async (req, res) => {
  const { password, username, confirmPassword, email, full_name } = req.body;
  try {
    if (password !== confirmPassword) {
      return res.status(400).json({ error: "Passwords don't match" });
    }
    const users = await User.findByUsername(username);
    if (users) {
      return res.status(400).json({ error: "Username already exists" });
    }
    // HASH PASSWORD HERE
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    const boyProfilePic = `https://avatar.iran.liara.run/public/boy?username=${username}`;
    const girlProfilePic = `https://avatar.iran.liara.run/public/girl?username=${username}`;
    const profilePic = "male" === "male" ? boyProfilePic : girlProfilePic;
    const newUser = {
      full_name,
      username,
      password: hashedPassword,
      email,
      profile_pic: profilePic,
    };
    const result = await User.create(newUser);
    if (newUser) {
      generateTokenAndSetCookie(result?.id, res);
      res.status(201).json({
        id: result?.id,
        fullName: newUser.full_name,
        username: newUser.username,
        profilePic: newUser.profile_pic,
      });
    } else {
      res.status(400).json({ error: "Invalid user data" });
    }
  } catch (error) {
    console.log("Error in signup controller", error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export const login = async (req, res) => {
  if (!req.body) {
    return res.status(400).send({
      message: "Content cannot be empty!",
    });
  }
  const { username, password } = req.body;

  try {
    const user = await User.findByUsername(username);
    const isPasswordCorrect = await bcrypt.compare(
      password,
      user?.password || ""
    );
    if (!user || !isPasswordCorrect) {
      return res.status(400).json({ error: "Invalid username or password" });
    }
    generateTokenAndSetCookie(user.id, res);

    res.status(200).json({
      id: user.id,
      full_name: user.fullName,
      username: user.username,
      profile_pic: user.profile_pic,
    });
  } catch (error) {
    console.log("Error in login controller", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export const logout = (req, res) => {
  try {
    res.cookie("jwt", "", { maxAge: 0 });
    res.status(200).json({ message: "Logged out successfully" });
  } catch (error) {
    console.log("Error in logout controller", error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
