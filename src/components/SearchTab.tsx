import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Search,
  Building2,
  Users,
  TrendingUp,
  UserCheck,
  Loader2,
} from "lucide-react";
import { useEffect } from "react";
import { UserType, User, Offer, OfferStatus, SearchToken } from "@/types";
import { searchService, setSearchToken } from "@/services/api";
import {
  generateLocalTokenSync,
  isTokenValidSync,
} from "@/utils/tokenGenerator";

interface SearchTabProps {
  allUsers: {
    seller: User[];
    buyer: User[];
    carrier: User[];
    agent: User[];
  };
}

const DUMMY_SEARCH_RESULTS: Offer[] = [
  {
    id: "OFF-001",
    sellerId: "seller-1",
    sellerName: "John Auto Sales",
    vehicleYear: "2008",
    vehicleMake: "Toyota",
    vehicleModel: "Corolla",
    vehicleTrim: "LE",
    vehicleBodyType: "Sedan",
    vehicleCabType: "Standard",
    vehicleDoorCount: 4,
    vehicleFuelType: "Gasoline",
    vehicleBodyStyle: "Compact",
    vehicleUsage: "personal",
    vehicleZipCode: "73301",
    ownershipType: "owned",
    ownershipTitleType: "clean",
    mileage: 126450,
    isMileageUnverifiable: false,
    drivetrainCondition: "drives",
    keyOrFobAvailable: "yes",
    workingBatteryInstalled: "yes",
    allTiresInflated: "yes",
    wheelsRemoved: "no",
    wheelsRemovedDriverFront: false,
    wheelsRemovedDriverRear: false,
    wheelsRemovedPassengerFront: false,
    wheelsRemovedPassengerRear: false,
    bodyPanelsIntact: "yes",
    bodyDamageFree: "no",
    mirrorsLightsGlassIntact: "yes",
    interiorIntact: "yes",
    floodFireDamageFree: "yes",
    engineTransmissionCondition: "intact",
    airbagsDeployed: "no",
    status: "draft",
    createdAt: "2025-01-01T10:00:00Z",
    updatedAt: "2025-01-01T10:00:00Z",
  },
  {
    id: "OFF-002",
    sellerId: "seller-2",
    sellerName: "Premium Motors",
    buyerId: "buyer-1",
    buyerName: "Sarah Johnson",
    carrierId: "carrier-1",
    carrierName: "FastTransport LLC",
    vehicleYear: "2020",
    vehicleMake: "Honda",
    vehicleModel: "Civic",
    vehicleTrim: "Sport",
    vehicleBodyType: "Sedan",
    vehicleCabType: "Standard",
    vehicleDoorCount: 4,
    vehicleFuelType: "Gasoline",
    vehicleBodyStyle: "Compact",
    vehicleUsage: "personal",
    vehicleZipCode: "90210",
    ownershipType: "owned",
    ownershipTitleType: "clean",
    mileage: 45000,
    isMileageUnverifiable: false,
    drivetrainCondition: "drives",
    keyOrFobAvailable: "yes",
    workingBatteryInstalled: "yes",
    allTiresInflated: "yes",
    wheelsRemoved: "no",
    wheelsRemovedDriverFront: false,
    wheelsRemovedDriverRear: false,
    wheelsRemovedPassengerFront: false,
    wheelsRemovedPassengerRear: false,
    bodyPanelsIntact: "yes",
    bodyDamageFree: "yes",
    mirrorsLightsGlassIntact: "yes",
    interiorIntact: "yes",
    floodFireDamageFree: "yes",
    engineTransmissionCondition: "intact",
    airbagsDeployed: "no",
    status: "assigned",
    createdAt: "2025-01-02T14:30:00Z",
    updatedAt: "2025-01-02T16:00:00Z",
  },
  {
    id: "OFF-003",
    sellerId: "seller-1",
    sellerName: "John Auto Sales",
    vehicleYear: "2015",
    vehicleMake: "Ford",
    vehicleModel: "F-150",
    vehicleTrim: "XLT",
    vehicleBodyType: "Truck",
    vehicleCabType: "Crew Cab",
    vehicleDoorCount: 4,
    vehicleFuelType: "Gasoline",
    vehicleBodyStyle: "Full-size",
    vehicleUsage: "commercial",
    vehicleZipCode: "75001",
    ownershipType: "owned",
    ownershipTitleType: "clean",
    mileage: 89000,
    isMileageUnverifiable: false,
    drivetrainCondition: "drives",
    keyOrFobAvailable: "yes",
    workingBatteryInstalled: "yes",
    allTiresInflated: "yes",
    wheelsRemoved: "no",
    wheelsRemovedDriverFront: false,
    wheelsRemovedDriverRear: false,
    wheelsRemovedPassengerFront: false,
    wheelsRemovedPassengerRear: false,
    bodyPanelsIntact: "yes",
    bodyDamageFree: "no",
    mirrorsLightsGlassIntact: "yes",
    interiorIntact: "yes",
    floodFireDamageFree: "yes",
    engineTransmissionCondition: "intact",
    airbagsDeployed: "no",
    status: "completed",
    createdAt: "2024-12-15T09:00:00Z",
    updatedAt: "2024-12-20T11:00:00Z",
  },
];

const USER_TYPE_CONFIG = {
  seller: { icon: Building2, label: "Seller", color: "bg-blue-500" },
  buyer: { icon: Users, label: "Buyer", color: "bg-green-500" },
  carrier: { icon: TrendingUp, label: "Carrier", color: "bg-orange-500" },
  agent: { icon: UserCheck, label: "Agent", color: "bg-purple-500" },
};

export function SearchTab({ allUsers }: SearchTabProps) {
  const [selectedUserType, setSelectedUserType] = useState<UserType>("seller");
  const [selectedUserId, setSelectedUserId] = useState<string>(
    allUsers.seller[0]?.id || ""
  );
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const [results, setResults] = useState<Offer[]>([]);
  const [currentToken, setCurrentToken] = useState<SearchToken | null>(null);
  const [isGeneratingToken, setIsGeneratingToken] = useState(false);

  const currentUsers = allUsers[selectedUserType];

  const handleUserTypeChange = (type: UserType) => {
    setSelectedUserType(type);
    const newUserId = allUsers[type][0]?.id || "";
    setSelectedUserId(newUserId);
    setResults([]);
    setHasSearched(false);

    // Generate new token for the selected user type and user
    if (newUserId) {
      generateToken(type, newUserId);
    }
  };

  const generateToken = (userType: UserType, userId: string) => {
    setIsGeneratingToken(true);
    try {
      // Generate token locally without API call
      const token = generateLocalTokenSync(userType, userId);
      setCurrentToken(token);
      setSearchToken(token);
      console.log(
        `Token generated locally for ${userType} (${userId}):`,
        token.token.substring(0, 50) + "..."
      );
      console.log(`Token expires at: ${token.expiresAt}`);
    } catch (error) {
      console.error("Error generating token:", error);
    } finally {
      setIsGeneratingToken(false);
    }
  };

  // Generate token on mount
  useEffect(() => {
    if (selectedUserId) {
      generateToken(selectedUserType, selectedUserId);
    }
  }, []);

  // Generate new token when user changes (but not user type, as that's handled in handleUserTypeChange)
  useEffect(() => {
    if (selectedUserId) {
      generateToken(selectedUserType, selectedUserId);
    }
  }, [selectedUserId]);

  const handleSearch = async () => {
    if (!searchQuery.trim()) return;

    // Ensure we have a valid token before searching
    if (!currentToken || !isTokenValidSync(currentToken)) {
      console.log("Token missing or expired. Generating new token...");
      generateToken(selectedUserType, selectedUserId);
    }

    // Check again after generation
    if (!currentToken) {
      console.error("Failed to generate token. Cannot perform search.");
      return;
    }

    setIsSearching(true);
    setHasSearched(true);

    try {
      // Call the actual search API with the token
      const response = await searchService.search(
        {
          userType: selectedUserType,
          userId: selectedUserId,
          query: searchQuery,
          entityType: "offer",
        },
        1,
        20
      );

      // For now, if API returns empty or fails, fall back to dummy data
      if (response.results.length === 0) {
        console.log(
          "API returned no results, using dummy data for demonstration"
        );

        // Filter dummy data based on user type and query
        const query = searchQuery.toLowerCase();
        let filtered = DUMMY_SEARCH_RESULTS;

        if (selectedUserType === "seller") {
          filtered = filtered.filter(
            (o) =>
              o.sellerId === selectedUserId ||
              o.vehicleMake.toLowerCase().includes(query) ||
              o.vehicleModel.toLowerCase().includes(query)
          );
        } else if (selectedUserType === "buyer") {
          filtered = filtered.filter(
            (o) => o.buyerId === selectedUserId || o.status === "assigned"
          );
        } else if (selectedUserType === "carrier") {
          filtered = filtered.filter(
            (o) => o.carrierId === selectedUserId || o.status === "assigned"
          );
        } else if (selectedUserType === "agent") {
          // Agents can see all offers
          filtered = DUMMY_SEARCH_RESULTS;
        }

        filtered = filtered.filter(
          (o) =>
            o.vehicleMake.toLowerCase().includes(query) ||
            o.vehicleModel.toLowerCase().includes(query) ||
            o.vehicleYear.includes(query) ||
            o.id.toLowerCase().includes(query)
        );

        setResults(filtered);
      } else {
        // Use API results
        setResults(response.results as Offer[]);
      }
    } catch (error) {
      console.error("Search error:", error);
      // Fall back to dummy data on error
      const query = searchQuery.toLowerCase();
      const filtered = DUMMY_SEARCH_RESULTS.filter(
        (o) =>
          o.vehicleMake.toLowerCase().includes(query) ||
          o.vehicleModel.toLowerCase().includes(query) ||
          o.vehicleYear.includes(query) ||
          o.id.toLowerCase().includes(query)
      );
      setResults(filtered);
    } finally {
      setIsSearching(false);
    }
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

  const getSearchDescription = () => {
    const descriptions = {
      seller: "Search offers you've created and manage your listings",
      buyer: "Find available offers and view your assigned purchases",
      carrier: "Track transport assignments and delivery schedules",
      agent: "Access all entities across sellers, buyers, and carriers",
    };
    return descriptions[selectedUserType];
  };

  return (
    <div className="space-y-6">
      <Card className="bg-gradient-to-br from-blue-50 via-purple-50 to-blue-50 border-2 border-blue-200 shadow-lg">
        <CardHeader>
          <CardTitle className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Search Portal
          </CardTitle>
          <CardDescription className="text-base text-slate-600 font-medium mt-1">
            Select a user type and search for offers based on role-based access
          </CardDescription>
        </CardHeader>
      </Card>

      <Card className="shadow-lg border-slate-200">
        <CardHeader className="bg-gradient-to-r from-slate-50 to-blue-50">
          <CardTitle className="text-lg font-bold text-slate-700">
            Select User Type
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {(Object.keys(USER_TYPE_CONFIG) as UserType[]).map((type) => {
              const config = USER_TYPE_CONFIG[type];
              const Icon = config.icon;
              const isSelected = selectedUserType === type;

              return (
                <button
                  key={type}
                  onClick={() => handleUserTypeChange(type)}
                  className={`p-5 rounded-xl border-2 transition-all duration-200 flex flex-col items-center gap-3 shadow-md hover:shadow-lg ${
                    isSelected
                      ? "border-blue-500 bg-gradient-to-br from-blue-50 to-purple-50 scale-105"
                      : "border-slate-200 hover:border-blue-300 hover:bg-slate-50"
                  }`}
                >
                  <div
                    className={`p-3 rounded-full shadow-md transition-all ${
                      isSelected
                        ? "bg-gradient-to-br from-blue-600 to-purple-600 text-white"
                        : "bg-slate-100 text-slate-600"
                    }`}
                  >
                    <Icon className="h-6 w-6" />
                  </div>
                  <span
                    className={`font-semibold text-sm ${
                      isSelected ? "text-blue-700" : "text-slate-700"
                    }`}
                  >
                    {config.label}
                  </span>
                </button>
              );
            })}
          </div>

          <div className="mt-6 p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl border border-blue-200">
            <p className="text-sm text-slate-700 font-medium">
              {getSearchDescription()}
            </p>
          </div>

          {/* Token Status Indicator */}
          <div className="mt-4 p-3 bg-white rounded-lg border border-slate-200 shadow-sm">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div
                  className={`h-2 w-2 rounded-full ${
                    currentToken
                      ? "bg-green-500"
                      : isGeneratingToken
                      ? "bg-yellow-500 animate-pulse"
                      : "bg-red-500"
                  }`}
                />
                <span className="text-xs font-medium text-slate-600">
                  {isGeneratingToken
                    ? "Generating token..."
                    : currentToken
                    ? "Authenticated"
                    : "No token"}
                </span>
              </div>
              {currentToken && (
                <span className="text-xs text-slate-400 font-mono">
                  {currentToken.token.substring(0, 16)}...
                </span>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="shadow-lg border-slate-200">
        <CardHeader className="bg-gradient-to-r from-slate-50 to-blue-50">
          <CardTitle className="text-lg font-bold text-slate-700">
            Search Filters
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 pt-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {selectedUserType !== "agent" && (
              <div className="space-y-2">
                <Label>Select {USER_TYPE_CONFIG[selectedUserType].label}</Label>
                <Select
                  value={selectedUserId}
                  onValueChange={setSelectedUserId}
                >
                  <SelectTrigger>
                    <SelectValue placeholder={`Select ${selectedUserType}`} />
                  </SelectTrigger>
                  <SelectContent>
                    {currentUsers.map((user) => (
                      <SelectItem key={user.id} value={user.id}>
                        {user.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}

            <div
              className={`space-y-2 ${
                selectedUserType === "agent" ? "md:col-span-3" : "md:col-span-2"
              }`}
            >
              <Label>Search Query</Label>
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search by ID, make, model, year..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                    className="pl-9"
                  />
                </div>
                <Button
                  onClick={handleSearch}
                  disabled={isSearching || !searchQuery.trim()}
                  className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 shadow-md hover:shadow-lg transition-all duration-200"
                >
                  {isSearching ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    "Search"
                  )}
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {hasSearched && (
        <Card className="shadow-lg border-slate-200">
          <CardHeader className="bg-gradient-to-r from-slate-50 to-blue-50">
            <CardTitle className="text-lg font-bold text-slate-700">
              Search Results ({results.length})
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-6">
            {isSearching ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
              </div>
            ) : results.length === 0 ? (
              <div className="text-center py-16">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-slate-100 mb-4">
                  <Search className="h-8 w-8 text-slate-400" />
                </div>
                <p className="text-slate-600 font-medium text-lg">
                  No results found for your search
                </p>
                <p className="text-slate-400 text-sm mt-2">
                  Try adjusting your search terms or filters
                </p>
              </div>
            ) : (
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
                        Status
                      </TableHead>
                      <TableHead className="font-bold text-slate-700">
                        Seller
                      </TableHead>
                      <TableHead className="font-bold text-slate-700">
                        Buyer
                      </TableHead>
                      <TableHead className="font-bold text-slate-700">
                        Carrier
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {results.map((offer, index) => (
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
                          <Badge
                            variant={getStatusBadgeVariant(offer.status)}
                            className="shadow-sm"
                          >
                            {offer.status}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-slate-600">
                          {offer.sellerName || "-"}
                        </TableCell>
                        <TableCell className="text-slate-600">
                          {offer.buyerName || "-"}
                        </TableCell>
                        <TableCell className="text-slate-600">
                          {offer.carrierName || "-"}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
