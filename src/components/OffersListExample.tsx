import {
  useOffersList,
  useOffersPaginated,
  useOffersFiltered,
} from "@/hooks/useOffersList";
import { Loader2, AlertCircle } from "lucide-react";

// Example 1: Basic usage with default parameters (sortBy=createdAt, sortDescending=true, pageNumber=1, pageSize=20)
export function BasicOffersList() {
  const { data, isLoading, error } = useOffersList();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <Loader2 className="h-6 w-6 animate-spin" />
        <span className="ml-2">Loading offers...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center p-4 bg-red-50 rounded-lg">
        <AlertCircle className="h-5 w-5 text-red-500 mr-2" />
        <span className="text-red-700">Failed to load offers</span>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold">
        Offers (Sorted by Created Date, Descending)
      </h2>
      <div className="text-sm text-gray-600">
        Total: {data?.total || 0} offers | Page: {data?.page || 1} | Page Size:{" "}
        {data?.pageSize || 20}
      </div>
      {data?.offers?.map((offer) => (
        <div key={offer.id} className="p-4 border rounded-lg">
          <div className="flex justify-between">
            <div>
              <h3 className="font-medium">
                {offer.vehicleYear} {offer.vehicleMake} {offer.vehicleModel}
              </h3>
              <p className="text-sm text-gray-600">VIN: {offer.vin || "N/A"}</p>
              <p className="text-sm text-gray-600">
                Seller: {offer.sellerName}
              </p>
            </div>
            <div className="text-right">
              <p className="text-sm font-medium capitalize">{offer.status}</p>
              <p className="text-xs text-gray-500">
                {new Date(offer.createdAt).toLocaleDateString()}
              </p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

// Example 2: Paginated usage
export function PaginatedOffersList({ currentPage }: { currentPage: number }) {
  const { data, isLoading, error } = useOffersPaginated(currentPage);

  if (isLoading) return <div>Loading page {currentPage}...</div>;
  if (error) return <div>Error loading page {currentPage}</div>;

  return (
    <div>
      <h3>Page {currentPage} of Offers</h3>
      {data?.offers?.map((offer) => (
        <div key={offer.id} className="p-2 border-b">
          {offer.vehicleYear} {offer.vehicleMake} {offer.vehicleModel} -{" "}
          {offer.status}
        </div>
      ))}
    </div>
  );
}

// Example 3: Filtered usage
export function FilteredOffersList({
  search,
  status,
}: {
  search?: string;
  status?: string;
}) {
  const { data, isLoading, error } = useOffersFiltered({
    search,
    status: status as any, // Convert string to OfferStatus if needed
  });

  if (isLoading) return <div>Loading filtered offers...</div>;
  if (error) return <div>Error loading filtered offers</div>;

  return (
    <div>
      <h3>Filtered Offers</h3>
      {data?.offers?.map((offer) => (
        <div key={offer.id} className="p-2 border-b">
          {offer.vehicleYear} {offer.vehicleMake} {offer.vehicleModel} -{" "}
          {offer.status}
        </div>
      ))}
    </div>
  );
}
