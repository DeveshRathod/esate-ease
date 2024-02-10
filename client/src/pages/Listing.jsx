import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import {
  FaBath,
  FaBed,
  FaChair,
  FaMapMarkerAlt,
  FaParking,
  FaShare,
} from "react-icons/fa";
import Contact from "../components/Contact";
import Loader from "../components/Loader";

export default function Listing() {
  const [listing, setListing] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [copied, setCopied] = useState(false);
  const [contact, setContact] = useState(false);
  const params = useParams();
  const { currentUser } = useSelector((state) => state.user);

  useEffect(() => {
    const fetchListing = async () => {
      try {
        setLoading(true);
        const res = await fetch(`/api/listing/get/${params.listingId}`);
        const data = await res.json();
        if (data.success === false) {
          setError(true);
          setLoading(false);
          return;
        }
        setListing(data);
        setLoading(false);
        setError(false);
      } catch (error) {
        setError(true);
        setLoading(false);
      }
    };
    fetchListing();
  }, [params.listingId]);

  return (
    <main>
      {loading && <Loader />}
      {error && (
        <p className="text-center my-7 text-2xl">Something went wrong!</p>
      )}
      {listing && !loading && !error && (
        <div className="max-w-4xl mx-auto p-3 my-7 gap-4">
          <div className="relative mb-6">
            <img
              src={listing.imageUrls[0]}
              alt="Listing Image"
              className="h-96 w-full object-cover rounded-lg shadow-lg"
            />
            <button
              className="absolute top-4 right-4 bg-white p-2 rounded-full text-slate-500 hover:bg-slate-200"
              onClick={() => {
                navigator.clipboard.writeText(window.location.href);
                setCopied(true);
                setTimeout(() => {
                  setCopied(false);
                }, 2000);
              }}
            >
              <FaShare />
            </button>
            {copied && (
              <p className="absolute top-12 right-4 z-10 rounded-md bg-slate-100 p-2">
                Link copied!
              </p>
            )}
          </div>
          <h1 className="text-3xl font-semibold">
            {listing.name} - Rs{" "}
            {listing.offer
              ? listing.discountPrice.toLocaleString("en-IN")
              : listing.regularPrice.toLocaleString("en-IN")}
            {listing.type === "rent" && " / month"}
          </h1>
          <p className="mt-2 text-slate-600 text-sm">
            <FaMapMarkerAlt className="text-green-700" />
            {listing.address}
          </p>
          <div className="flex gap-4 mt-2">
            <p className="bg-red-500 text-white text-center p-2 rounded-md">
              {listing.type === "rent" ? "For Rent" : "For Sale"}
            </p>
            {listing.offer && (
              <p className="bg-green-900 text-white text-center p-2 rounded-md">
                Rs.{+listing.regularPrice - +listing.discountPrice} OFF
              </p>
            )}
          </div>
          <p className="mt-4 text-slate-800">
            <span className="font-semibold">Description - </span>
            {listing.description}
          </p>
          <ul className="mt-4 flex flex-wrap items-center gap-4 sm:gap-6">
            <li className="flex items-center gap-1">
              <FaBed className="text-lg" />
              {listing.bedrooms > 1
                ? `${listing.bedrooms} beds `
                : `${listing.bedrooms} bed `}
            </li>
            <li className="flex items-center gap-1">
              <FaBath className="text-lg" />
              {listing.bathrooms > 1
                ? `${listing.bathrooms} baths `
                : `${listing.bathrooms} bath `}
            </li>
            <li className="flex items-center gap-1">
              <FaParking className="text-lg" />
              {listing.parking ? "Parking spot" : "No Parking"}
            </li>
            <li className="flex items-center gap-1">
              <FaChair className="text-lg" />
              {listing.furnished ? "Furnished" : "Unfurnished"}
            </li>
          </ul>
          {currentUser && listing.userRef !== currentUser._id && !contact && (
            <button
              onClick={() => setContact(true)}
              className="bg-slate-700 text-white rounded-lg uppercase hover:opacity-95 px-6 py-3 mt-4"
            >
              Contact landlord
            </button>
          )}
          {contact && <Contact listing={listing} />}
        </div>
      )}
    </main>
  );
}
