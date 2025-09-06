import express from "express";
import { Admin } from "../models/Admin.js";
const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const admins = await Admin.find();
    res.json(admins);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
