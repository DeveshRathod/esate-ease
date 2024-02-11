import express from "express";
import {
  adddislike,
  addlike,
  createListing,
  deleteListing,
  getDislikes,
  getLikes,
  getListing,
  getListings,
  updateListing,
} from "../controllers/listing.controller.js";
import { verifyToken } from "../utils/verifyUser.js";

const router = express.Router();

router.post("/create", verifyToken, createListing);
router.delete("/delete/:id", verifyToken, deleteListing);
router.post("/update/:id", verifyToken, updateListing);
router.get("/get/:id", getListing);
router.get("/get", getListings);
router.put("/like/:id", verifyToken, addlike);
router.put("/dislike/:id", verifyToken, adddislike);
router.get("/likes/:id", verifyToken, getLikes);
router.get("/dislikes/:id", verifyToken, getDislikes);

export default router;
