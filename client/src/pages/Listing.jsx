import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { FaBath, FaBed, FaChair, FaParking } from "react-icons/fa";
import Contact from "../components/Contact";
import Loader from "../components/Loader"; // Assuming you have a Loader component

export default function Listing() {
  const [listing, setListing] = useState(null);
  const [loading, setLoading] = useState(true); // Set initial loading state to true
  const [error, setError] = useState(false);
  const [contact, setContact] = useState(false);
  const [showAllImages, setShowAllImages] = useState(false);
  const params = useParams();
  const { currentUser } = useSelector((state) => state.user);

  useEffect(() => {
    const fetchListing = async () => {
      try {
        const res = await fetch(`/api/listing/get/${params.listingId}`);
        const data = await res.json();
        if (data.success === false) {
          setError(true);
          setLoading(false);
          return;
        }
        setListing(data);
        setLoading(false); // Set loading to false when data is fetched
        setError(false);
      } catch (error) {
        setError(true);
        setLoading(false);
      }
    };

    // Simulate loader delay
    const delay = setTimeout(() => {
      fetchListing();
      clearTimeout(delay);
    }, 1000);

    return () => clearTimeout(delay); // Cleanup function to clear timeout
  }, [params.listingId]);

  return (
    <main className="flex flex-col items-center">
      {/* Loader */}
      {loading && <Loader />}
      {error && (
        <p className="text-center my-7 text-2xl">Something went wrong!</p>
      )}
      {listing && !loading && !error && (
        <>
          <div className="w-full p-6 lg:flex lg:flex-row">
            <img
              src={listing.imageUrls[0]}
              alt="First Image"
              className="lg:w-1/2 w-full h-auto rounded-lg shadow-lg mb-6 lg:mb-0"
            />
            <div className="lg:w-1/2 lg:pl-6">
              <div className="max-w-screen mx-auto mt-6">
                <h1 className="text-3xl font-semibold text-gray-800 mb-4">
                  {listing.name}
                </h1>

                <div className="flex items-center mb-4">
                  <p className="text-xl font-semibold text-gray-800 mr-4">
                    $
                    {listing.offer
                      ? listing.discountPrice.toLocaleString("en-US")
                      : listing.regularPrice.toLocaleString("en-US")}
                  </p>
                  <p className="text-sm text-gray-600">
                    {listing.type === "rent" ? " / month" : ""}
                  </p>
                </div>
                <p className="text-gray-700 mb-6">{listing.description}</p>
                <ul className="text-sm text-gray-700 flex flex-wrap gap-4">
                  <li className="flex items-center mb-2">
                    <FaBed className="text-lg text-gray-600 mr-2" />
                    {listing.bedrooms}{" "}
                    {listing.bedrooms > 1 ? "bedrooms" : "bedroom"}
                  </li>
                  <li className="flex items-center mb-2">
                    <FaBath className="text-lg text-gray-600 mr-2" />
                    {listing.bathrooms}{" "}
                    {listing.bathrooms > 1 ? "bathrooms" : "bathroom"}
                  </li>
                  <li className="flex items-center mb-2">
                    <FaParking className="text-lg text-gray-600 mr-2" />
                    {listing.parking ? "Parking available" : "No parking"}
                  </li>
                  <li className="flex items-center mb-2">
                    <FaChair className="text-lg text-gray-600 mr-2" />
                    {listing.furnished ? "Furnished" : "Unfurnished"}
                  </li>
                </ul>
                {currentUser &&
                  listing.userRef !== currentUser._id &&
                  !contact && (
                    <button
                      onClick={() => setContact(true)}
                      className="bg-[#ac7e60] text-white px-4 py-2 rounded-md mt-6"
                    >
                      Contact landlord
                    </button>
                  )}
                {contact && <Contact listing={listing} />}
              </div>
            </div>
          </div>
          <div className="w-full max-w-4xl mx-auto mt-6 pl-2 pr-2">
            <button
              onClick={() => setShowAllImages(!showAllImages)}
              className="text-xl text-[#ac7e60]"
            >
              {showAllImages ? "Hide Images" : "Show More Images"}
            </button>
          </div>
          {showAllImages && (
            <div className="grid grid-cols-2 gap-4 mt-6 max-w-4xl mx-auto  pl-2 pr-2 pb-4">
              {listing.imageUrls.slice(1).map((url, index) => (
                <img
                  key={index}
                  src={url}
                  alt={`Image ${index + 1}`}
                  className="w-full h-auto rounded-lg shadow-lg"
                />
              ))}
            </div>
          )}
        </>
      )}
    </main>
  );
}
