import express from "express";
import {
  google,
  signout,
  signin,
  signup,
  checkme,
} from "../controllers/auth.controller.js";
import { verifyToken } from "../utils/verifyUser.js";

const router = express.Router();

router.post("/signup", signup);
router.post("/signin", signin);
router.post("/google", google);
router.get("/signout", signout);
router.get("/me/:id", checkme);

export default router;
