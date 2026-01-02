import { Car, DollarSign, MapPin, Calendar, Activity } from "lucide-react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { Offer } from "@/types";
import { formatCurrency, formatDate } from "@/lib/utils";

interface OfferCardProps {
  offer: Offer;
}

export function OfferCard({ offer }: OfferCardProps) {
  const statusColors = {
    available: "success",
    sold: "destructive",
    pending: "warning",
  } as const;

  return (
    <Card className="hover:shadow-lg transition-shadow duration-200 animate-fade-in">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-primary/10 rounded-lg">
              <Car className="h-6 w-6 text-primary" />
            </div>
            <div>
              <h3 className="font-bold text-lg">
                {offer.year} {offer.make} {offer.model}
              </h3>
              <p className="text-sm text-muted-foreground">VIN: {offer.vin}</p>
            </div>
          </div>
          <Badge variant={statusColors[offer.status]}>
            {offer.status.toUpperCase()}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="grid grid-cols-2 gap-4">
          <div className="flex items-center gap-2 text-sm">
            <DollarSign className="h-4 w-4 text-muted-foreground" />
            <div>
              <p className="text-xs text-muted-foreground">Offer Amount</p>
              <p className="font-semibold">
                {formatCurrency(offer.offerAmount)}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <MapPin className="h-4 w-4 text-muted-foreground" />
            <div>
              <p className="text-xs text-muted-foreground">Location</p>
              <p className="font-semibold">
                {offer.location.city}, {offer.location.state}
              </p>
            </div>
          </div>
        </div>

        <div className="border-t pt-3">
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-2">
              <Activity className="h-4 w-4 text-muted-foreground" />
              <span className="text-muted-foreground">
                {offer.condition.mileage.toLocaleString()} miles
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-muted-foreground" />
              <span className="text-muted-foreground">
                {formatDate(offer.createdAt)}
              </span>
            </div>
          </div>
        </div>

        {offer.condition.description && (
          <div className="text-xs text-muted-foreground bg-muted/50 p-2 rounded">
            {offer.condition.description}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
