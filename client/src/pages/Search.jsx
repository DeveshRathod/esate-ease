import React, { useEffect, useState } from "react";
import ListingItem from "../components/ListingItem";
import Loader from "../components/Loader";

const Search = () => {
  const [loading, setLoading] = useState(true);
  const [listings, setListings] = useState([]);
  const [showMore, setShowMore] = useState(false);
  const [searchQuery, setSearchQuery] = useState({
    searchTerm: "",
    type: "all",
    parking: false,
    furnished: false,
    offer: false,
    sort: "created_at_desc",
  });

  useEffect(() => {
    const delay = setTimeout(() => {
      fetchListings();
    }, 1000);
    return () => clearTimeout(delay);
  }, [searchQuery]);

  const fetchListings = async () => {
    setShowMore(false);

    setTimeout(async () => {
      const urlParams = new URLSearchParams();
      Object.entries(searchQuery).forEach(([key, value]) => {
        if (value !== "" && value !== false) {
          urlParams.set(key, value);
        }
      });

      const res = await fetch(`/api/listing/get?${urlParams.toString()}`);
      const data = await res.json();

      if (data.length > 8) {
        setShowMore(true);
      }

      setListings(data);
      setLoading(false);
    }, 500);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    fetchListings();
  };

  const handleChange = (e) => {
    const { id, value, type } = e.target;
    setSearchQuery((prevSearchQuery) => ({
      ...prevSearchQuery,
      [id]: type === "checkbox" ? e.target.checked : value,
    }));
  };

  const onShowMoreClick = async () => {
    const res = await fetch(`/api/listing/get?startIndex=${listings.length}`);
    const data = await res.json();
    if (data.length < 9) {
      setShowMore(false);
    }
    setListings([...listings, ...data]);
  };

  return (
    <div className="flex flex-col md:flex-row h-full">
      <div className="md:w-1/4 md:order-2 bg-white p-4">
        <h2 className="text-lg font-semibold mb-4">Filter</h2>
        <form onSubmit={handleSubmit}>
          <label className="block mb-2">
            Search:
            <input
              type="text"
              id="searchTerm"
              value={searchQuery.searchTerm}
              onChange={handleChange}
              className="block w-full border border-gray-300 rounded-md p-2 mt-1"
            />
          </label>
          <label className="block mb-2">
            Type:
            <select
              id="type"
              value={searchQuery.type}
              onChange={handleChange}
              className="block w-full border border-gray-300 rounded-md p-2 mt-1"
            >
              <option value="all">All</option>
              <option value="rent">Rent</option>
              <option value="sale">Sale</option>
            </select>
          </label>
          <label className="block mb-2">
            <input
              type="checkbox"
              id="parking"
              checked={searchQuery.parking}
              onChange={handleChange}
              className="mr-2"
            />
            Parking
          </label>
          <label className="block mb-2">
            <input
              type="checkbox"
              id="furnished"
              checked={searchQuery.furnished}
              onChange={handleChange}
              className="mr-2"
            />
            Furnished
          </label>
          <label className="block mb-2">
            <input
              type="checkbox"
              id="offer"
              checked={searchQuery.offer}
              onChange={handleChange}
              className="mr-2"
            />
            Offer
          </label>
          <button
            type="submit"
            className="bg-[#ac7e60] text-white px-4 py-2 rounded-md mt-4"
          >
            Search
          </button>
        </form>
      </div>
      <div className="md:w-3/4 md:order-1 p-2 md:pl-4 flex justify-center items-center">
        <div className="w-full max-w-4xl">
          {!loading && listings.length > 0 && (
            <h2 className="text-lg font-semibold mb-4">Results:</h2>
          )}
          {loading ? (
            <Loader />
          ) : (
            (listings.length === 0 && <Loader />) || (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {listings.map((listing) => (
                  <ListingItem key={listing._id} listing={listing} />
                ))}
              </div>
            )
          )}
          {showMore && (
            <button
              onClick={onShowMoreClick}
              className="bg-[#ac7e60] text-white px-4 py-2 rounded-md mt-4"
            >
              Show more
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default Search;
