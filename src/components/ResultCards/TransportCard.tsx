import { Truck, MapPin, Calendar, Navigation, Activity } from "lucide-react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { Transport } from "@/types";
import { formatDate } from "@/lib/utils";

interface TransportCardProps {
  transport: Transport;
}

export function TransportCard({ transport }: TransportCardProps) {
  const statusColors = {
    scheduled: "info",
    "in-transit": "warning",
    delivered: "success",
    cancelled: "destructive",
  } as const;

  return (
    <Card className="hover:shadow-lg transition-shadow duration-200 animate-fade-in">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-orange-500/10 rounded-lg">
              <Truck className="h-6 w-6 text-orange-600" />
            </div>
            <div>
              <h3 className="font-bold text-lg">Transport #{transport.id}</h3>
              <p className="text-sm text-muted-foreground">
                Purchase ID: {transport.purchaseId}
              </p>
            </div>
          </div>
          <Badge variant={statusColors[transport.status]}>
            {transport.status.toUpperCase()}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="space-y-2">
          <div className="flex items-start gap-2 text-sm">
            <MapPin className="h-4 w-4 text-green-600 mt-1 flex-shrink-0" />
            <div>
              <p className="text-xs font-semibold text-muted-foreground">
                PICKUP
              </p>
              <p className="font-medium">
                {transport.pickupLocation.city},{" "}
                {transport.pickupLocation.state}
              </p>
              <p className="text-xs text-muted-foreground">
                {transport.pickupLocation.address}
              </p>
            </div>
          </div>

          <div className="flex items-start gap-2 text-sm">
            <Navigation className="h-4 w-4 text-red-600 mt-1 flex-shrink-0" />
            <div>
              <p className="text-xs font-semibold text-muted-foreground">
                DELIVERY
              </p>
              <p className="font-medium">
                {transport.deliveryLocation.city},{" "}
                {transport.deliveryLocation.state}
              </p>
              <p className="text-xs text-muted-foreground">
                {transport.deliveryLocation.address}
              </p>
            </div>
          </div>
        </div>

        <div className="border-t pt-3">
          <div className="flex items-center gap-2 text-sm">
            <Calendar className="h-4 w-4 text-muted-foreground" />
            <div>
              <p className="text-xs text-muted-foreground">Scheduled Date</p>
              <p className="font-semibold">
                {formatDate(transport.scheduleDate)}
              </p>
            </div>
          </div>
        </div>

        {transport.vehicleDetails && (
          <div className="bg-muted/50 p-3 rounded-lg">
            <div className="flex items-center gap-2 mb-1">
              <Activity className="h-4 w-4 text-muted-foreground" />
              <span className="text-xs font-semibold text-muted-foreground">
                VEHICLE
              </span>
            </div>
            <p className="font-medium">
              {transport.vehicleDetails.make} {transport.vehicleDetails.model}
            </p>
            <p className="text-xs text-muted-foreground">
              VIN: {transport.vehicleDetails.vin}
            </p>
          </div>
        )}

        {transport.carrierInfo && (
          <div className="text-xs">
            <p className="text-muted-foreground">Carrier</p>
            <p className="font-medium">{transport.carrierInfo.name}</p>
            <p className="text-muted-foreground">
              {transport.carrierInfo.contact}
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
