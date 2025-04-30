import usermodel from "../models/user.model.js";
import jwt from "jsonwebtoken";

const authUser = async (req, res, next) => {
  const token = req.cookies.token || req.headers.authorization?.split(" ")[1];

  if (!token) {
    return res.status(401).json({ errors: "Unauthorized user" });
  }

  try {
    const decode = jwt.verify(token, process.env.JWT_SECRET);
    const user = await usermodel.findById(decode._id);

    req.user = user._id;
    return next();
  } catch (error) {
    res
      .status(400)
      .json({ errors: "Internal server error Please log in again" });
    console.log(error);
  }
};

export default {authUser};
