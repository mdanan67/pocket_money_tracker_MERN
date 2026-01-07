import express, { Router } from "express";
import { parentsSignup, loginParent } from "./controll/parentSignup.js";
const router = express.Router();

router.post("/signup", parentsSignup);
router.post("/login", loginParent);

export { router };
