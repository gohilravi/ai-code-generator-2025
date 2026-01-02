import {
  ShoppingCart,
  DollarSign,
  User,
  Calendar,
  Activity,
} from "lucide-react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { Purchase } from "@/types";
import { formatCurrency, formatDate } from "@/lib/utils";

interface PurchaseCardProps {
  purchase: Purchase;
}

export function PurchaseCard({ purchase }: PurchaseCardProps) {
  const statusColors = {
    pending: "warning",
    completed: "success",
    cancelled: "destructive",
  } as const;

  return (
    <Card className="hover:shadow-lg transition-shadow duration-200 animate-fade-in">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-green-500/10 rounded-lg">
              <ShoppingCart className="h-6 w-6 text-green-600" />
            </div>
            <div>
              <h3 className="font-bold text-lg">Purchase #{purchase.id}</h3>
              <p className="text-sm text-muted-foreground">
                Offer ID: {purchase.offerId}
              </p>
            </div>
          </div>
          <Badge variant={statusColors[purchase.status]}>
            {purchase.status.toUpperCase()}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="grid grid-cols-2 gap-4">
          <div className="flex items-center gap-2 text-sm">
            <DollarSign className="h-4 w-4 text-muted-foreground" />
            <div>
              <p className="text-xs text-muted-foreground">Amount</p>
              <p className="font-semibold">{formatCurrency(purchase.amount)}</p>
            </div>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <Calendar className="h-4 w-4 text-muted-foreground" />
            <div>
              <p className="text-xs text-muted-foreground">Purchase Date</p>
              <p className="font-semibold">
                {formatDate(purchase.purchaseDate)}
              </p>
            </div>
          </div>
        </div>

        <div className="border-t pt-3">
          <div className="flex items-center gap-2">
            <User className="h-4 w-4 text-muted-foreground" />
            <div className="text-sm">
              <p className="font-medium">{purchase.buyerDetails.name}</p>
              <p className="text-xs text-muted-foreground">
                {purchase.buyerDetails.email} • {purchase.buyerDetails.phone}
              </p>
            </div>
          </div>
        </div>

        {purchase.offer && (
          <div className="bg-muted/50 p-3 rounded-lg">
            <div className="flex items-center gap-2 mb-1">
              <Activity className="h-4 w-4 text-muted-foreground" />
              <span className="text-xs font-semibold text-muted-foreground">
                VEHICLE DETAILS
              </span>
            </div>
            <p className="font-medium">
              {purchase.offer.year} {purchase.offer.make} {purchase.offer.model}
            </p>
            <p className="text-xs text-muted-foreground">
              VIN: {purchase.offer.vin}
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
