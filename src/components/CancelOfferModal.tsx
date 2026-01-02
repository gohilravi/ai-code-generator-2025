import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useCancelOffer } from "@/hooks/useOffers";
import { Offer } from "@/types";
import { Loader2, AlertTriangle } from "lucide-react";

interface CancelOfferModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  offer: Offer | null;
  onSuccess: () => void;
}

export function CancelOfferModal({
  open,
  onOpenChange,
  offer,
  onSuccess,
}: CancelOfferModalProps) {
  const cancelOfferMutation = useCancelOffer();
  const [error, setError] = useState("");

  const handleConfirm = async () => {
    if (!offer) return;

    setError("");

    try {
      await cancelOfferMutation.mutateAsync(offer.id);
      onSuccess();
      onOpenChange(false);
    } catch (error) {
      console.error("Failed to cancel offer:", error);
      setError("Failed to cancel offer. Please try again.");
    }
  };

  if (!offer) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md shadow-2xl border-slate-200">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl">
            <div className="p-2 rounded-full bg-red-100">
              <AlertTriangle className="h-5 w-5 text-red-600" />
            </div>
            <span className="bg-gradient-to-r from-red-600 to-orange-600 bg-clip-text text-transparent font-bold">
              Cancel Offer
            </span>
          </DialogTitle>
          <DialogDescription className="text-slate-600 font-medium">
            Are you sure you want to cancel this offer? This action is
            irreversible.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-3 py-4">
          <div className="p-4 bg-gradient-to-br from-slate-50 to-blue-50 rounded-xl border border-slate-200 shadow-sm space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Offer ID:</span>
              <span className="font-medium">{offer.id}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Vehicle:</span>
              <span className="font-medium">
                {offer.vehicleYear} {offer.vehicleMake} {offer.vehicleModel}
              </span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Mileage:</span>
              <span className="font-medium">
                {offer.mileage.toLocaleString()} miles
              </span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Title:</span>
              <span className="font-medium capitalize">
                {offer.ownershipTitleType}
              </span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Status:</span>
              <span className="font-medium capitalize">{offer.status}</span>
            </div>
          </div>

          <div className="p-4 bg-gradient-to-r from-red-50 to-orange-50 border-2 border-red-200 rounded-xl shadow-sm">
            <p className="text-sm text-red-700 font-bold flex items-center gap-2">
              <AlertTriangle className="h-4 w-4" />
              Warning: This action cannot be undone
            </p>
          </div>

          {error && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-md">
              <p className="text-sm text-red-600">{error}</p>
            </div>
          )}
        </div>

        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={cancelOfferMutation.isPending}
            className="border-slate-300 hover:bg-slate-100 transition-all"
          >
            Go Back
          </Button>
          <Button
            variant="destructive"
            onClick={handleConfirm}
            disabled={cancelOfferMutation.isPending}
            className="bg-gradient-to-r from-red-600 to-orange-600 hover:from-red-700 hover:to-orange-700 shadow-md hover:shadow-lg transition-all duration-200"
          >
            {cancelOfferMutation.isPending ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Cancelling...
              </>
            ) : (
              "Confirm Cancel"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
