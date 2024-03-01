import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { MdLocationOn } from "react-icons/md";
import { AiOutlineLike, AiOutlineDislike } from "react-icons/ai";
import { useSelector } from "react-redux";

export default function ListingItem({ listing }) {
  const { currentUser } = useSelector((state) => state.user);
  const [likes, setLikes] = useState(listing.likes.length || 0);
  const [dislikes, setDislikes] = useState(listing.dislikes.length || 0);

  const handleLike = async () => {
    try {
      const res = await fetch(`/api/listing/like/${listing._id}`, {
        method: "PUT",
      });
      if (res.ok) {
        const data = await res.json();
        setLikes(data.likes);
        setDislikes(data.dislikes);
      } else {
        throw new Error("Failed to like listing");
      }
    } catch (error) {
      console.error("Error liking:", error);
    }
  };

  const handleDislike = async () => {
    try {
      const res = await fetch(`/api/listing/dislike/${listing._id}`, {
        method: "PUT",
      });
      if (res.ok) {
        const data = await res.json();
        setLikes(data.likes);
        setDislikes(data.dislikes);
      } else {
        throw new Error("Failed to dislike listing");
      }
    } catch (error) {
      console.error("Error disliking:", error);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const likesRes = await fetch(`/api/listing/likes/${listing._id}`);
        const dislikesRes = await fetch(`/api/listing/dislikes/${listing._id}`);
        if (likesRes.ok && dislikesRes.ok) {
          const likesData = await likesRes.json();
          const dislikesData = await dislikesRes.json();
          setLikes(likesData.likes);
          setDislikes(dislikesData.dislikes);
        }
      } catch (error) {
        console.error("Error fetching likes/dislikes:", error);
      }
    };

    fetchData();
  }, [listing._id]);

  return (
    <div className="block w-full sm:w-72">
      <div className="bg-white shadow-md hover:shadow-lg transition-shadow overflow-hidden rounded-lg">
        <Link to={`/listing/${listing._id}`}>
          <img
            src={
              listing.imageUrls[0] ||
              "https://53.fs1.hubspotusercontent-na1.net/hub/53/hubfs/Sales_Blog/real-estate-business-compressor.jpg?width=595&height=400&name=real-estate-business-compressor.jpg"
            }
            alt="listing cover"
            className="h-52 w-full object-cover hover:scale-105 transition-scale duration-300"
          />
        </Link>
        <div className="p-4">
          <Link
            to={`/listing/${listing._id}`}
            className="text-lg font-semibold text-slate-700 truncate"
          >
            {listing.name}
          </Link>
          <div className="flex items-center gap-1 text-gray-600 text-sm truncate">
            <MdLocationOn className="h-4 w-4 text-green-700" />
            <p>{listing.address}</p>
          </div>

          <p className="text-slate-500 mt-2 font-semibold">
            Rs.
            {listing.offer
              ? listing.discountPrice.toLocaleString("en-IN")
              : listing.regularPrice.toLocaleString("en-IN")}
            {listing.type === "rent" && " / month"}
          </p>
          {currentUser && (
            <div className="flex w-full justify-start gap-5 mt-2">
              <button className="flex items-center gap-1" onClick={handleLike}>
                <AiOutlineLike />
                <p>{likes}</p>
              </button>
              <button
                className="flex items-center gap-1"
                onClick={handleDislike}
              >
                <AiOutlineDislike />
                <p>{dislikes}</p>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
