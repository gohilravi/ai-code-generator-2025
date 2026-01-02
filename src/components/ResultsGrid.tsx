import { Loader2, Search as SearchIcon } from "lucide-react";
import { OfferCard } from "./ResultCards/OfferCard";
import { PurchaseCard } from "./ResultCards/PurchaseCard";
import { TransportCard } from "./ResultCards/TransportCard";
import type { SearchResult } from "@/types";

interface ResultsGridProps {
  results: SearchResult[];
  isLoading: boolean;
  hasSearched: boolean;
}

export function ResultsGrid({
  results,
  isLoading,
  hasSearched,
}: ResultsGridProps) {
  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <Loader2 className="h-12 w-12 animate-spin text-primary mb-4" />
        <p className="text-muted-foreground">Searching...</p>
      </div>
    );
  }

  if (!hasSearched) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <div className="p-4 bg-primary/10 rounded-full mb-4">
          <SearchIcon className="h-12 w-12 text-primary" />
        </div>
        <h3 className="text-xl font-semibold mb-2">Start Your Search</h3>
        <p className="text-muted-foreground max-w-md">
          Enter keywords, VIN, ID, location, or any other details to search
          across offers, purchases, and transports
        </p>
      </div>
    );
  }

  if (results.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <div className="p-4 bg-muted rounded-full mb-4">
          <SearchIcon className="h-12 w-12 text-muted-foreground" />
        </div>
        <h3 className="text-xl font-semibold mb-2">No Results Found</h3>
        <p className="text-muted-foreground max-w-md">
          Try adjusting your search terms or filters to find what you're looking
          for
        </p>
      </div>
    );
  }

  const renderCard = (result: SearchResult, index: number) => {
    if ("vin" in result && "sellerId" in result) {
      return <OfferCard key={`offer-${result.id}-${index}`} offer={result} />;
    }
    if ("buyerId" in result && "offerId" in result) {
      return (
        <PurchaseCard
          key={`purchase-${result.id}-${index}`}
          purchase={result}
        />
      );
    }
    if ("carrierId" in result && "purchaseId" in result) {
      return (
        <TransportCard
          key={`transport-${result.id}-${index}`}
          transport={result}
        />
      );
    }
    return null;
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          Found{" "}
          <span className="font-semibold text-foreground">
            {results.length}
          </span>{" "}
          {results.length === 1 ? "result" : "results"}
        </p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {results.map((result, index) => renderCard(result, index))}
      </div>
    </div>
  );
}
