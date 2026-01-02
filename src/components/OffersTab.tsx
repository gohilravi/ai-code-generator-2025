import { useState } from "react";
import { Plus, MoreVertical, Loader2 } from "lucide-react";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useOffersPaginated } from "@/hooks/useOffersList";
import { useQueryClient } from "@tanstack/react-query";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { AddOfferModal } from "./AddOfferModal";
import { AssignOfferModal } from "./AssignOfferModal";
import { CancelOfferModal } from "./CancelOfferModal";
import { Offer, User, UserType, OfferStatus } from "@/types";

interface OffersTabProps {
  userType: UserType;
  userId: string;
  sellers: User[];
}

export function OffersTab({ userType, sellers }: OffersTabProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [assignModalOpen, setAssignModalOpen] = useState(false);
  const [cancelModalOpen, setCancelModalOpen] = useState(false);
  const [selectedOffer, setSelectedOffer] = useState<Offer | null>(null);
  const pageSize = 10;
  const queryClient = useQueryClient();

  const {
    data: offersData,
    isLoading,
    error,
  } = useOffersPaginated(currentPage, pageSize);

  const offers = offersData?.offers || [];
  const totalPages = Math.ceil((offersData?.total || 0) / pageSize);
  const totalCount = offersData?.total || 0;

  const handleAssign = (offer: Offer) => {
    setSelectedOffer(offer);
    setAssignModalOpen(true);
  };

  const handleCancel = (offer: Offer) => {
    setSelectedOffer(offer);
    setCancelModalOpen(true);
  };

  const handleModalSuccess = () => {
    queryClient.invalidateQueries({ queryKey: ["offers"] });
  };

  const canAssign = (offer: Offer): boolean => {
    return (
      offer.status === "draft" &&
      (userType === "agent" || userType === "seller")
    );
  };

  const canCancel = (offer: Offer): boolean => {
    return (
      (offer.status === "draft" || offer.status === "assigned") &&
      (userType === "agent" || userType === "seller")
    );
  };

  const getStatusBadgeVariant = (status: OfferStatus) => {
    const variants: Record<
      OfferStatus,
      "default" | "secondary" | "destructive" | "outline"
    > = {
      draft: "secondary",
      assigned: "default",
      cancelled: "destructive",
      completed: "outline",
    };
    return variants[status] || "default";
  };

  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), "MMM dd, yyyy");
    } catch {
      return dateString;
    }
  };

  return (
    <div className="space-y-6">
      <Card className="bg-gradient-to-br from-blue-50 via-purple-50 to-blue-50 border-2 border-blue-200 shadow-lg">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Offer Management
              </CardTitle>
              <CardDescription className="text-base text-slate-600 font-medium mt-1">
                Create, assign, and manage vehicle offers
              </CardDescription>
            </div>
            {(userType === "seller" || userType === "agent") && (
              <Button
                onClick={() => setAddModalOpen(true)}
                className="gap-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 shadow-md hover:shadow-lg transition-all duration-200"
              >
                <Plus className="h-4 w-4" />
                Add Offer
              </Button>
            )}
          </div>
        </CardHeader>
      </Card>

      <Card className="shadow-lg border-slate-200">
        <CardHeader className="bg-gradient-to-r from-slate-50 to-blue-50">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-slate-700">All Offers</h3>
            <div className="px-4 py-2 bg-blue-100 text-blue-700 rounded-lg font-semibold text-sm shadow-sm">
              {totalCount} {totalCount === 1 ? "offer" : "offers"}
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
              <span className="ml-2 text-slate-600">Loading offers...</span>
            </div>
          ) : error ? (
            <div className="text-center py-16">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-red-100 mb-4">
                <Loader2 className="h-8 w-8 text-red-500" />
              </div>
              <p className="text-red-600 font-medium text-lg">
                Failed to load offers
              </p>
              <p className="text-slate-400 text-sm mt-2">
                Please try again later
              </p>
            </div>
          ) : offers.length === 0 ? (
            <div className="text-center py-16">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-slate-100 mb-4">
                <Plus className="h-8 w-8 text-slate-400" />
              </div>
              <p className="text-slate-600 font-medium text-lg">
                No offers available
              </p>
              <p className="text-slate-400 text-sm mt-2">
                Create your first offer to get started
              </p>
            </div>
          ) : (
            <>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-gradient-to-r from-slate-50 to-blue-50 border-b-2 border-blue-200">
                      <TableHead className="font-bold text-slate-700">
                        Offer ID
                      </TableHead>
                      <TableHead className="font-bold text-slate-700">
                        Year
                      </TableHead>
                      <TableHead className="font-bold text-slate-700">
                        Make
                      </TableHead>
                      <TableHead className="font-bold text-slate-700">
                        Model
                      </TableHead>
                      <TableHead className="font-bold text-slate-700">
                        Mileage
                      </TableHead>
                      <TableHead className="font-bold text-slate-700">
                        Title
                      </TableHead>
                      <TableHead className="font-bold text-slate-700">
                        Status
                      </TableHead>
                      {userType !== "agent" && (
                        <TableHead className="font-bold text-slate-700">
                          Seller
                        </TableHead>
                      )}
                      <TableHead className="font-bold text-slate-700">
                        Buyer
                      </TableHead>
                      <TableHead className="font-bold text-slate-700">
                        Carrier
                      </TableHead>
                      <TableHead className="font-bold text-slate-700">
                        Created
                      </TableHead>
                      <TableHead className="text-right font-bold text-slate-700">
                        Actions
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {offers.map((offer, index) => (
                      <TableRow
                        key={offer.id}
                        className={`hover:bg-blue-50/50 transition-colors ${
                          index % 2 === 0 ? "bg-white" : "bg-slate-50/30"
                        }`}
                      >
                        <TableCell className="font-semibold text-blue-600">
                          {offer.id}
                        </TableCell>
                        <TableCell className="font-medium">
                          {offer.vehicleYear}
                        </TableCell>
                        <TableCell className="font-medium">
                          {offer.vehicleMake}
                        </TableCell>
                        <TableCell className="font-medium">
                          {offer.vehicleModel}
                        </TableCell>
                        <TableCell className="text-slate-600">
                          {offer.mileage.toLocaleString()}
                        </TableCell>
                        <TableCell>
                          <span className="inline-flex items-center px-2 py-1 rounded-md bg-slate-100 text-slate-700 text-xs font-medium capitalize">
                            {offer.ownershipTitleType}
                          </span>
                        </TableCell>
                        <TableCell>
                          <Badge
                            variant={getStatusBadgeVariant(offer.status)}
                            className="shadow-sm"
                          >
                            {offer.status}
                          </Badge>
                        </TableCell>
                        {userType !== "agent" && (
                          <TableCell className="text-slate-600">
                            {offer.sellerName || "-"}
                          </TableCell>
                        )}
                        <TableCell className="text-slate-600">
                          {offer.buyerName || "-"}
                        </TableCell>
                        <TableCell className="text-slate-600">
                          {offer.carrierName || "-"}
                        </TableCell>
                        <TableCell className="text-sm text-slate-500 font-medium">
                          {formatDate(offer.createdAt)}
                        </TableCell>
                        <TableCell className="text-right">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button
                                variant="ghost"
                                size="sm"
                                className="hover:bg-blue-100 transition-colors"
                              >
                                <MoreVertical className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent
                              align="end"
                              className="shadow-lg border-slate-200"
                            >
                              <DropdownMenuItem
                                onClick={() => handleAssign(offer)}
                                disabled={!canAssign(offer)}
                                className="cursor-pointer hover:bg-blue-50 focus:bg-blue-50"
                              >
                                Assign
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onClick={() => handleCancel(offer)}
                                disabled={!canCancel(offer)}
                                className="text-red-600 cursor-pointer hover:bg-red-50 focus:bg-red-50"
                              >
                                Cancel
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>

              {totalPages > 1 && (
                <div className="flex items-center justify-between mt-6 pt-4 border-t border-slate-200">
                  <div className="text-sm font-medium text-slate-600 bg-slate-100 px-3 py-1.5 rounded-lg">
                    Page {currentPage} of {totalPages}
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                      disabled={currentPage === 1}
                      className="border-slate-300 hover:bg-blue-50 hover:border-blue-400 transition-all"
                    >
                      Previous
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() =>
                        setCurrentPage((p) => Math.min(totalPages, p + 1))
                      }
                      disabled={currentPage === totalPages}
                      className="border-slate-300 hover:bg-blue-50 hover:border-blue-400 transition-all"
                    >
                      Next
                    </Button>
                  </div>
                </div>
              )}
            </>
          )}
        </CardContent>
      </Card>

      <AddOfferModal
        open={addModalOpen}
        onOpenChange={setAddModalOpen}
        sellers={sellers}
        onSuccess={handleModalSuccess}
      />

      <AssignOfferModal
        open={assignModalOpen}
        onOpenChange={setAssignModalOpen}
        offer={selectedOffer}
        onSuccess={handleModalSuccess}
      />

      <CancelOfferModal
        open={cancelModalOpen}
        onOpenChange={setCancelModalOpen}
        offer={selectedOffer}
        onSuccess={handleModalSuccess}
      />
    </div>
  );
}
