import { Link } from "react-router-dom";
import { MdLocationOn } from "react-icons/md";

export default function ListingItem({ listing }) {
  return (
    <Link to={`/listing/${listing._id}`} className="block w-full sm:w-72">
      <div className="bg-white shadow-md hover:shadow-lg transition-shadow overflow-hidden rounded-lg">
        <img
          src={
            listing.imageUrls[0] ||
            "https://53.fs1.hubspotusercontent-na1.net/hub/53/hubfs/Sales_Blog/real-estate-business-compressor.jpg?width=595&height=400&name=real-estate-business-compressor.jpg"
          }
          alt="listing cover"
          className="h-52 w-full object-cover hover:scale-105 transition-scale duration-300"
        />
        <div className="p-4">
          <p className="text-lg font-semibold text-slate-700 truncate">
            {listing.name}
          </p>
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
        </div>
      </div>
    </Link>
  );
}
