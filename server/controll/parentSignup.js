import { Parent } from "../models/Auth.js";
import { Child } from "../models/addChild.js";
import { spendLimit } from "../models/spendingSetting.js";
import { parentBalance } from "../models/parentBalance.js";

import jwt from "jsonwebtoken";

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
      const token = jwt.sign({ id: user.email }, process.env.JWT_PRIVATEKEY, {
        expiresIn: "7d",
      });
      res.cookie("token", token, {
        httpOnly: true,
        sameSite: "lax",
      });

      return res.json({ success: true, message: "Welcome user" });
    }
    return res.json({ success: false, message: "user not found" });
  } catch (error) {
    console.error("Login error:", error);
    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

// parent login function

export const loginChield = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await Child.findOne({ email });

    if (user) {
      const tokenC = jwt.sign({ id: user.email }, process.env.JWT_PRIVATEKEY, {
        expiresIn: "7d",
      });
      res.cookie("tokenC", tokenC, {
        httpOnly: true,
        sameSite: "lax",
      });

      return res.json({ success: true, message: "Welcome user" });
    }
    return res.json({ success: false, message: "user not found" });
  } catch (error) {
    console.error("Login error:", error);
    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};
//addchildFunction
export const addChild = async (req, res) => {
  try {
    const token = req.cookies?.token;
    const payload = jwt.verify(token, process.env.JWT_PRIVATEKEY);
    const parentId = payload.id;

    const { email, password, phone, gender, name } = req.body;
    const child = await Child.findOne({ email });
    const newChild = new Child({
      parentId,
      email,
      password,
      phone,
      gender,
      name,
    });
    await newChild.save();

    return res.json({ success: true, message: "Your child is in queue" });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};
//spending setting limit settign

export const spendingSettingUpsert = async (req, res) => {
  const token = req.cookies?.token;
  const payload = jwt.verify(token, process.env.JWT_PRIVATEKEY);
  const parentId = payload.id;
  try {
    const {
      phone,
      shopping,
      food,
      travels,
      mobile,
      gift,
      entertainment,
      other,
    } = req.body;

    const updated = await spendLimit.findOneAndUpdate(
      { parentId },
      {
        $set: {
          parentId,
          phone,
          shopping,
          food,
          travels,
          mobile,
          gift,
          entertainment,
          other,
        },
      },
      { new: true, upsert: true, runValidators: true },
    );

    res.status(201).json({
      success: true,
      message: "Spend Limit inserted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Insert failed",
      error: error.message,
    });
  }
};

// parent balance
export const parentBalances = async (req, res) => {
  try {
    const token = req.cookies?.token;
    if (!token) {
      return res.status(401).json({ success: false, message: "No token" });
    }

    const payload = jwt.verify(token, process.env.JWT_PRIVATEKEY);
    const parentId = payload.id;

    const { method, amount, monthlySpend, chieldSpend } = req.body;

    if (!method) {
      return res
        .status(400)
        .json({ success: false, message: "Method required" });
    }
    if (amount === undefined || amount === null || Number(amount) <= 0) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid amount" });
    }

    // incoming values (frontend)
    const incAmount = Number(amount) || 0;
    const incMonthly = Number(monthlySpend) || 0;
    const incChild = Number(chieldSpend) || 0;

    // get existing doc (create if not exists)
    const existing = await parentBalance.findOne({ parentId });

    const currentAmount = Number(existing?.amount) || 0;
    const currentMonthly = Number(existing?.monthlySpend) || 0;
    const currentChild = Number(existing?.chieldSpend) || 0;

    const newAmount = currentAmount + incAmount;
    const newMonthly = currentMonthly + incMonthly;
    const newChild = currentChild + incChild;

    const updated = await parentBalance.findOneAndUpdate(
      { parentId },
      {
        $set: {
          parentId,
          amount: String(newAmount),
          monthlySpend: String(newMonthly),
          chieldSpend: String(newChild),
        },
        $push: {
          method: {
            method,
            amount: String(incAmount),
            // time auto from schema: default Date.now
          },
        },
      },
      { new: true, upsert: true, runValidators: true },
    );

    return res.status(201).json({
      success: true,
      message: "Balance added & saved",
      data: updated,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Insert failed",
      error: error.message,
    });
  }
};

// get parent data
export const getParentBalances = async (req, res) => {
  try {
    const token = req.cookies?.token;
    if (!token) {
      return res.status(401).json({ success: false, message: "No token" });
    }

    const payload = jwt.verify(token, process.env.JWT_PRIVATEKEY);
    const parentId = payload.id;

    const data = await parentBalance.findOne({ parentId });

    return res.status(200).json({
      success: true,
      data: data || {
        parentId,
        amount: "0",
        monthlySpend: "0",
        chieldSpend: "0",
        method: [],
      },
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Fetch failed",
      error: error.message,
    });
  }
};

// get spending limits
export const getSpendingLimits = async (req, res) => {
  try {
    const token = req.cookies?.token;
    if (!token) {
      return res.status(401).json({
        success: false,
        message: "No token",
      });
    }

    const payload = jwt.verify(token, process.env.JWT_PRIVATEKEY);
    const parentId = payload.id;

    const data = await spendLimit.findOne({ parentId });

    // ✅ if no limits found, return default 0s
    if (!data) {
      return res.status(200).json({
        success: true,
        data: {
          parentId,
          phone: "0",
          shopping: "0",
          food: "0",
          travels: "0",
          mobile: "0",
          gift: "0",
          entertainment: "0",
          other: "0",
        },
      });
    }

    return res.status(200).json({
      success: true,
      data,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Fetch failed",
      error: error.message,
    });
  }
};

// get all the cheldren
export const getAllChildren = async (req, res) => {
  try {
    const children = await Child.find({});

    return res.status(200).json({
      success: true,
      count: children.length,
      data: children,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to fetch children",
      error: error.message,
    });
  }
};

// topupchield

export const topUpChildBalance = async (req, res) => {
  try {
    const token = req.cookies?.token;
    if (!token) {
      return res.status(401).json({ success: false, message: "No token" });
    }

    // verify parent token (you can also use payload.id if you want parentId)
    jwt.verify(token, process.env.JWT_PRIVATEKEY);

    const { childId } = req.params;
    const { amount } = req.body;

    const inc = Number(amount);
    if (!Number.isFinite(inc) || inc <= 0) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid amount" });
    }

    const child = await Child.findById(childId);
    if (!child) {
      return res
        .status(404)
        .json({ success: false, message: "Child not found" });
    }

    const current = Number(child.balance) || 0;
    const updatedBalance = current + inc;

    child.balance = String(updatedBalance);
    await child.save();

    return res.status(200).json({
      success: true,
      message: "Child balance topped up",
      data: {
        childId,
        balance: child.balance, // ✅ return new balance for frontend
      },
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Topup failed",
      error: error.message,
    });
  }
};

// read chield balance and name

export const getChildFromToken = async (req, res) => {
  try {
    const tokenC = req.cookies?.tokenC;
    if (!tokenC) {
      return res.status(401).json({ success: false, message: "No tokenC" });
    }

    const payload = jwt.verify(tokenC, process.env.JWT_PRIVATEKEY);

    const email = payload.id;

    const child = await Child.findOne({ email });
    if (!child) {
      return res
        .status(404)
        .json({ success: false, message: "Child not found" });
    }

    return res.status(200).json({
      success: true,
      data: child,
    });
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: "Invalid tokenC",
      error: error.message,
    });
  }
};

// chield payment process
export const paymentProcess = async (req, res) => {
  try {
    const { amount, categoryName, paymentMethod } = req.body;

    const tokenC = req.cookies?.tokenC;
    if (!tokenC) {
      return res.status(401).json({ success: false, message: "No tokenC" });
    }

    let payload;
    try {
      payload = jwt.verify(tokenC, process.env.JWT_PRIVATEKEY);
    } catch (e) {
      return res.status(401).json({ success: false, message: "Invalid token" });
    }

    const email = payload.id; // only if token stores email in id
    const child = await Child.findOne({ email });
    if (!child) {
      return res
        .status(404)
        .json({ success: false, message: "Child not found" });
    }

    const toNumber = (v) => {
      const cleaned = String(v ?? "").replace(/[^\d.]/g, "");
      const n = Number(cleaned);
      return Number.isFinite(n) ? n : 0;
    };

    const payAmount = toNumber(amount);
    if (!categoryName || !paymentMethod) {
      return res
        .status(400)
        .json({ success: false, message: "Missing fields" });
    }
    if (payAmount <= 0) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid amount" });
    }

    const balance = toNumber(child.balance);
    if (payAmount > balance) {
      return res
        .status(400)
        .json({ success: false, message: "Insufficient balance" });
    }

    // IMPORTANT: make sure the model name matches your import
    const limitsDoc = await spendLimit.findOne({ parentId: child.parentId });
    if (!limitsDoc) {
      return res
        .status(404)
        .json({ success: false, message: "Limits not found" });
    }

    const key = String(categoryName).toLowerCase().trim();
    const limit = toNumber(limitsDoc[key]);

    if (limit > 0 && payAmount > limit) {
      return res.status(400).json({
        success: false,
        message: `Over the limit for ${key}. Limit: ${limit}`,
      });
    }

    return res.json({ success: true, message: "Payment allowed" });
  } catch (error) {
    console.log("paymentProcess error:", error);
    return res.status(500).json({ success: false, message: error.message });
  }
};
