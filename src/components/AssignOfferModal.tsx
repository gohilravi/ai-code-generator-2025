import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { searchService } from "@/services/api";
import { useAssignOffer } from "@/hooks/useOffers";
import { Offer, User } from "@/types";
import { Loader2, Search } from "lucide-react";

interface AssignOfferModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  offer: Offer | null;
  onSuccess: () => void;
}

export function AssignOfferModal({
  open,
  onOpenChange,
  offer,
  onSuccess,
}: AssignOfferModalProps) {
  const assignOfferMutation = useAssignOffer();
  const [buyers, setBuyers] = useState<User[]>([]);
  const [carriers, setCarriers] = useState<User[]>([]);
  const [selectedBuyerId, setSelectedBuyerId] = useState("");
  const [selectedCarrierId, setSelectedCarrierId] = useState("");
  const [buyerSearch, setBuyerSearch] = useState("");
  const [carrierSearch, setCarrierSearch] = useState("");
  const [isLoadingBuyers, setIsLoadingBuyers] = useState(false);
  const [isLoadingCarriers, setIsLoadingCarriers] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (open) {
      loadBuyers();
      loadCarriers();
    }
  }, [open]);

  const loadBuyers = async () => {
    setIsLoadingBuyers(true);
    try {
      const result = await searchService.getUsers("buyer");
      setBuyers(result);
      if (result.length > 0 && !selectedBuyerId) {
        setSelectedBuyerId(result[0].id);
      }
    } catch (error) {
      console.error("Failed to load buyers:", error);
    } finally {
      setIsLoadingBuyers(false);
    }
  };

  const loadCarriers = async () => {
    setIsLoadingCarriers(true);
    try {
      const result = await searchService.getUsers("carrier");
      setCarriers(result);
      if (result.length > 0 && !selectedCarrierId) {
        setSelectedCarrierId(result[0].id);
      }
    } catch (error) {
      console.error("Failed to load carriers:", error);
    } finally {
      setIsLoadingCarriers(false);
    }
  };

  const handleSubmit = async () => {
    if (!offer) return;

    if (!selectedBuyerId || !selectedCarrierId) {
      setError("Please select both buyer and carrier");
      return;
    }

    setError("");

    try {
      await assignOfferMutation.mutateAsync({
        offerId: offer.id,
        data: {
          buyer_id: parseInt(selectedBuyerId),
          carrier_id: parseInt(selectedCarrierId),
        },
      });
      onSuccess();
      onOpenChange(false);
      resetForm();
    } catch (error) {
      console.error("Failed to assign offer:", error);
      setError("Failed to assign offer. Please try again.");
    }
  };

  const resetForm = () => {
    setSelectedBuyerId("");
    setSelectedCarrierId("");
    setBuyerSearch("");
    setCarrierSearch("");
    setError("");
  };

  const filteredBuyers = buyers.filter((buyer) =>
    buyer.name.toLowerCase().includes(buyerSearch.toLowerCase())
  );

  const filteredCarriers = carriers.filter((carrier) =>
    carrier.name.toLowerCase().includes(carrierSearch.toLowerCase())
  );

  if (!offer) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md shadow-2xl border-slate-200">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Assign Offer
          </DialogTitle>
          <DialogDescription className="text-slate-600 font-medium">
            Assign offer {offer.id} ({offer.vehicleYear} {offer.vehicleMake}{" "}
            {offer.vehicleModel}) to buyer and carrier
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label>Select Buyer *</Label>
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search buyers..."
                value={buyerSearch}
                onChange={(e) => setBuyerSearch(e.target.value)}
                className="pl-9"
              />
            </div>
            {isLoadingBuyers ? (
              <div className="flex items-center justify-center py-4">
                <Loader2 className="h-4 w-4 animate-spin" />
              </div>
            ) : (
              <Select
                value={selectedBuyerId}
                onValueChange={setSelectedBuyerId}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select buyer" />
                </SelectTrigger>
                <SelectContent>
                  {filteredBuyers.length === 0 ? (
                    <div className="p-2 text-sm text-muted-foreground">
                      No buyers found
                    </div>
                  ) : (
                    filteredBuyers.map((buyer) => (
                      <SelectItem key={buyer.id} value={buyer.id}>
                        {buyer.name}
                      </SelectItem>
                    ))
                  )}
                </SelectContent>
              </Select>
            )}
          </div>

          <div className="space-y-2">
            <Label>Select Carrier *</Label>
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search carriers..."
                value={carrierSearch}
                onChange={(e) => setCarrierSearch(e.target.value)}
                className="pl-9"
              />
            </div>
            {isLoadingCarriers ? (
              <div className="flex items-center justify-center py-4">
                <Loader2 className="h-4 w-4 animate-spin" />
              </div>
            ) : (
              <Select
                value={selectedCarrierId}
                onValueChange={setSelectedCarrierId}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select carrier" />
                </SelectTrigger>
                <SelectContent>
                  {filteredCarriers.length === 0 ? (
                    <div className="p-2 text-sm text-muted-foreground">
                      No carriers found
                    </div>
                  ) : (
                    filteredCarriers.map((carrier) => (
                      <SelectItem key={carrier.id} value={carrier.id}>
                        {carrier.name}
                      </SelectItem>
                    ))
                  )}
                </SelectContent>
              </Select>
            )}
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
            disabled={assignOfferMutation.isPending}
            className="border-slate-300 hover:bg-slate-100 transition-all"
          >
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={
              assignOfferMutation.isPending ||
              !selectedBuyerId ||
              !selectedCarrierId
            }
            className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 shadow-md hover:shadow-lg transition-all duration-200"
          >
            {assignOfferMutation.isPending ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Assigning...
              </>
            ) : (
              "Assign"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
