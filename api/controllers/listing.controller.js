import Listing from "../models/listing.model.js";
import errorHandler from "../utils/error.js";

export const createListing = async (req, res, next) => {
  try {
    const listing = await Listing.create(req.body);
    res.status(201).json(listing);
  } catch (error) {
    next(error);
  }
};

export const getUserListing = async (req, res, next) => {
  if (req.user.id === req.params.id) {
    try {
      const listings = await Listing.find({
        userRef: req.params.id,
      });

      res.status(200).json(listings);
    } catch (error) {
      next(error);
    }
  } else {
    return next(errorHandler(401, "You can only view own listings"));
  }
};

export const deleteListing = async (req, res, next) => {
  const listing = await Listing.findById(req.params.id);
  if (!listing) {
    return next(errorHandler(404, "Listing not found"));
  }
  if (req.user.id !== listing.userRef.toString()) {
    return next(errorHandler(401, "can not delete this"));
  }

  try {
    await Listing.findByIdAndDelete(req.params.id);
    res.status(200).json("Listing has been deleted");
  } catch (error) {
    next(error);
  }
};

export const updateListing = async (req, res, next) => {
  try {
    const listing = await Listing.findById(req.params.id);

    if (!listing) {
      return next(errorHandler(404, "Listing not found!"));
    }

    if (req.user.id !== listing.userRef) {
      return next(errorHandler(401, "You can only update your own listings!"));
    }

    const updatedListing = await Listing.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    if (!updatedListing) {
      return next(errorHandler(500, "Failed to update listing"));
    }

    res.status(200).json(updatedListing);
  } catch (error) {
    return next(errorHandler(404, "Listing Not found"));
  }
};

export const getListing = async (req, res, next) => {
  try {
    const listing = await Listing.findById(req.params.id);
    if (!listing) {
      return next(errorHandler(404, "Listing not found!"));
    }
    res.status(200).json(listing);
  } catch (error) {
    next(error);
  }
};

export const getListings = async (req, res, next) => {
  try {
    const limit = parseInt(req.query.limit) || 9;
    const startIndex = parseInt(req.query.startIndex) || 0;
    let offer = req.query.offer;

    if (offer === undefined || offer === "false") {
      offer = { $in: [false, true] };
    }

    let furnished = req.query.furnished;

    if (furnished === undefined || furnished === "false") {
      furnished = { $in: [false, true] };
    }

    let parking = req.query.parking;

    if (parking === undefined || parking === "false") {
      parking = { $in: [false, true] };
    }

    let type = req.query.type;

    if (type === undefined || type === "all") {
      type = { $in: ["sale", "rent"] };
    }

    const searchTerm = req.query.searchTerm || "";

    const sort = req.query.sort || "createdAt";

    const order = req.query.order || "desc";

    const listings = await Listing.find({
      name: { $regex: searchTerm, $options: "i" },
      offer,
      furnished,
      parking,
      type,
    })
      .sort({ [sort]: order })
      .limit(limit)
      .skip(startIndex);

    return res.status(200).json(listings);
  } catch (error) {
    next(error);
  }
};

export const addlike = async (req, res) => {
  try {
    const listing = await Listing.findById(req.params.id);

    if (listing.likes.includes(req.user.id)) {
      return res.status(200).json({
        likes: listing.likes.length,
        dislikes: listing.dislikes.length,
      });
    }

    listing.likes.push(req.user.id);
    listing.dislikes.pull(req.user.id);

    const updatedListing = await listing.save();
    res.status(200).json({
      likes: updatedListing.likes.length,
      dislikes: updatedListing.dislikes.length,
    });
  } catch (error) {
    res.status(500).json(error);
  }
};

export const adddislike = async (req, res) => {
  try {
    const listing = await Listing.findById(req.params.id);

    if (listing.dislikes.includes(req.user.id)) {
      return res.status(200).json({
        likes: listing.likes.length,
        dislikes: listing.dislikes.length,
      });
    }

    listing.dislikes.push(req.user.id);
    listing.likes.pull(req.user.id);

    const updatedListing = await listing.save();
    res.status(200).json({
      likes: updatedListing.likes.length,
      dislikes: updatedListing.dislikes.length,
    });
  } catch (error) {
    res.status(500).json(error);
  }
};

export const getLikes = async (req, res) => {
  try {
    const listing = await Listing.findById(req.params.id);
    if (!listing) {
      return res.status(404).json({ message: "Listing not found" });
    }

    res.status(200).json({ likes: listing.likes.length });
  } catch (error) {
    console.error("Error getting likes:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const getDislikes = async (req, res) => {
  try {
    const listing = await Listing.findById(req.params.id);
    if (!listing) {
      return res.status(404).json({ message: "Listing not found" });
    }

    res.status(200).json({ dislikes: listing.dislikes.length });
  } catch (error) {
    console.error("Error getting dislikes:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
