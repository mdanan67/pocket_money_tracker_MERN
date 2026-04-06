import express, { Router } from "express";
import {
  parentsSignup,
  loginParent,
  addChild,
  spendingSettingUpsert,
  parentBalances,
  getParentBalances,
  loginChield,
  getSpendingLimits,
  getAllChildren,
  topUpChildBalance,
  getChildFromToken,
  paymentProcess,
} from "./controll/parentSignup.js";
const router = express.Router();
router.post("/signup", parentsSignup);
router.post("/login", loginParent);
router.post("/login-chield", loginChield);
router.post("/parent/addchild", addChild);
router.post("/parent/spendingsetting", spendingSettingUpsert);
router.post("/parent/parentbalances", parentBalances);
router.get("/parent/parentbalances", getParentBalances);
router.get("/parent/getspendingdata", getSpendingLimits);
router.get("/parent/children/all", getAllChildren);
router.post("/parent/children/:childId/topup", topUpChildBalance);
router.get("/child/me", getChildFromToken);
router.post("/child/payment", paymentProcess);

export { router };
