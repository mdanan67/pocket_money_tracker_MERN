import { Parent } from "../models/Auth.js";
export const parentsSignup = async (req, res) => {
  const { name, email, password, phone } = req.body;
  const parent = await Parent.findOne({ email });
  if (parent) {
    return res.json({
      success: "false",
      message: " already have an account on this mail",
    });
  }

  const newParents = new Parent({
    name,
    email,
    password,
    phone,
  });

  await newParents.save();

  return res.json({
    success: true,
    message: "You have signed up successfully!",
  });
};
// parent login function
export const loginParent = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await Parent.findOne({ email });
    if (user) {
      return res.json({ success: true, message: "user found" });
    }
    return res.json({ success: false, message: "user not found" });
  } catch (error) {}
};
// export { parentsSignup };
