import userModel from "../models/user.model.js";

const createUser = async ({ username, email, password, country }) => {
  if (!username || !email || !password || !country) {
    return res.status(400).json({ Message: "Please provide all filds" });
  }
  const user = await userModel.create({
    username,
    email,
    country,
    password,
  });
  return user;
};

export default { createUser };
