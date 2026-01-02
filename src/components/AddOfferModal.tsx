import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useCreateOffer } from "@/hooks/useOffers";
import {
  CreateOfferRequest,
  User,
  BodyType,
  FuelType,
  OwnershipType,
  TitleType,
  DrivetrainCondition,
  EngineTransmissionCondition,
  YesNo,
} from "@/types";
import {
  Loader2,
  Car,
  Settings,
  Shield,
  Wrench,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

interface AddOfferModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  sellers: User[];
  onSuccess: () => void;
}

const BODY_TYPES: BodyType[] = [
  "Sedan",
  "SUV",
  "Truck",
  "Van",
  "Coupe",
  "Convertible",
  "Wagon",
  "Hatchback",
  "Other",
];
const FUEL_TYPES: FuelType[] = [
  "Gasoline",
  "Diesel",
  "Electric",
  "Hybrid",
  "Other",
];
const OWNERSHIP_TYPES: OwnershipType[] = ["owned", "leased", "financed"];
const TITLE_TYPES: TitleType[] = [
  "clean",
  "salvage",
  "rebuilt",
  "lemon",
  "flood",
];
const DRIVETRAIN_CONDITIONS: { value: DrivetrainCondition; label: string }[] = [
  { value: "drives", label: "Drives" },
  { value: "runs_but_does_not_drive", label: "Runs but does not drive" },
  { value: "does_not_run", label: "Does not run" },
];
const ENGINE_CONDITIONS: EngineTransmissionCondition[] = [
  "intact",
  "damaged",
  "missing",
];

const getDefaultFormData = (sellerId: string): CreateOfferRequest => ({
  sellerId,
  vin: "",
  vehicleYear: new Date().getFullYear().toString(),
  vehicleMake: "",
  vehicleModel: "",
  vehicleTrim: "",
  vehicleBodyType: "Sedan",
  vehicleCabType: "Standard",
  vehicleDoorCount: 4,
  vehicleFuelType: "Gasoline",
  vehicleBodyStyle: "",
  vehicleUsage: "personal",
  vehicleZipCode: "",
  ownershipType: "owned",
  ownershipTitleType: "clean",
  mileage: 0,
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
});

const STEPS = [
  { id: 1, title: "Vehicle Info", icon: Car },
  { id: 2, title: "Ownership", icon: Settings },
  { id: 3, title: "Condition", icon: Wrench },
  { id: 4, title: "Safety", icon: Shield },
];

export function AddOfferModal({
  open,
  onOpenChange,
  sellers,
  onSuccess,
}: AddOfferModalProps) {
  const createOfferMutation = useCreateOffer();
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<CreateOfferRequest>(
    getDefaultFormData(sellers[0]?.id || "")
  );

  const validateStep = (step: number): boolean => {
    const newErrors: Record<string, string> = {};

    if (step === 1) {
      const year = parseInt(formData.vehicleYear);
      if (!year || year < 1900 || year > new Date().getFullYear() + 1) {
        newErrors.vehicleYear = `Valid year (1900-${
          new Date().getFullYear() + 1
        }) required`;
      }
      if (!formData.vehicleMake.trim())
        newErrors.vehicleMake = "Make is required";
      if (!formData.vehicleModel.trim())
        newErrors.vehicleModel = "Model is required";
      if (!formData.vehicleZipCode.trim())
        newErrors.vehicleZipCode = "ZIP code is required";
      else if (!/^\d{5}$/.test(formData.vehicleZipCode))
        newErrors.vehicleZipCode = "ZIP code must be 5 digits";
      if (!formData.sellerId) newErrors.sellerId = "Seller is required";
    }

    if (step === 2) {
      if (formData.mileage < 0)
        newErrors.mileage = "Mileage cannot be negative";
      if (formData.mileage > 1000000)
        newErrors.mileage = "Mileage seems too high";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateStep(currentStep)) {
      setCurrentStep((prev) => Math.min(prev + 1, 4));
    }
  };

  const handlePrev = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 1));
  };

  const handleSubmit = async () => {
    if (!validateStep(currentStep)) return;

    try {
      await createOfferMutation.mutateAsync(formData);
      onSuccess();
      onOpenChange(false);
      resetForm();
    } catch (error) {
      console.error("Failed to create offer:", error);
      setErrors({ submit: "Failed to create offer. Please try again." });
    }
  };

  const resetForm = () => {
    setFormData(getDefaultFormData(sellers[0]?.id || ""));
    setErrors({});
    setCurrentStep(1);
  };

  const updateField = <K extends keyof CreateOfferRequest>(
    field: K,
    value: CreateOfferRequest[K]
  ) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  const renderYesNoSelect = (
    field: keyof CreateOfferRequest,
    label: string
  ) => (
    <div className="space-y-2">
      <Label>{label}</Label>
      <Select
        value={formData[field] as YesNo}
        onValueChange={(v) => updateField(field, v as YesNo)}
      >
        <SelectTrigger>
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="yes">Yes</SelectItem>
          <SelectItem value="no">No</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );

  const renderStep1 = () => (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold flex items-center gap-2 text-primary">
        <Car className="h-5 w-5" /> Vehicle Information
      </h3>
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="seller">Seller *</Label>
          <Select
            value={formData.sellerId}
            onValueChange={(v) => updateField("sellerId", v)}
          >
            <SelectTrigger className={errors.sellerId ? "border-red-500" : ""}>
              <SelectValue placeholder="Select seller" />
            </SelectTrigger>
            <SelectContent>
              {sellers.map((seller) => (
                <SelectItem key={seller.id} value={seller.id}>
                  {seller.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {errors.sellerId && (
            <p className="text-sm text-red-500">{errors.sellerId}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="vin">VIN</Label>
          <Input
            id="vin"
            value={formData.vin}
            onChange={(e) => updateField("vin", e.target.value.toUpperCase())}
            placeholder="1HGCM82633A123456"
            maxLength={17}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="vehicleYear">Year *</Label>
          <Input
            id="vehicleYear"
            value={formData.vehicleYear}
            onChange={(e) => updateField("vehicleYear", e.target.value)}
            placeholder="2024"
            className={errors.vehicleYear ? "border-red-500" : ""}
          />
          {errors.vehicleYear && (
            <p className="text-sm text-red-500">{errors.vehicleYear}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="vehicleMake">Make *</Label>
          <Input
            id="vehicleMake"
            value={formData.vehicleMake}
            onChange={(e) => updateField("vehicleMake", e.target.value)}
            placeholder="Toyota"
            className={errors.vehicleMake ? "border-red-500" : ""}
          />
          {errors.vehicleMake && (
            <p className="text-sm text-red-500">{errors.vehicleMake}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="vehicleModel">Model *</Label>
          <Input
            id="vehicleModel"
            value={formData.vehicleModel}
            onChange={(e) => updateField("vehicleModel", e.target.value)}
            placeholder="Corolla"
            className={errors.vehicleModel ? "border-red-500" : ""}
          />
          {errors.vehicleModel && (
            <p className="text-sm text-red-500">{errors.vehicleModel}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="vehicleTrim">Trim</Label>
          <Input
            id="vehicleTrim"
            value={formData.vehicleTrim}
            onChange={(e) => updateField("vehicleTrim", e.target.value)}
            placeholder="LE"
          />
        </div>

        <div className="space-y-2">
          <Label>Body Type</Label>
          <Select
            value={formData.vehicleBodyType}
            onValueChange={(v) => updateField("vehicleBodyType", v as BodyType)}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {BODY_TYPES.map((type) => (
                <SelectItem key={type} value={type}>
                  {type}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label>Door Count</Label>
          <Select
            value={formData.vehicleDoorCount.toString()}
            onValueChange={(v) => updateField("vehicleDoorCount", parseInt(v))}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {[2, 3, 4, 5].map((count) => (
                <SelectItem key={count} value={count.toString()}>
                  {count} doors
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label>Fuel Type</Label>
          <Select
            value={formData.vehicleFuelType}
            onValueChange={(v) => updateField("vehicleFuelType", v as FuelType)}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {FUEL_TYPES.map((type) => (
                <SelectItem key={type} value={type}>
                  {type}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label>Usage</Label>
          <Select
            value={formData.vehicleUsage}
            onValueChange={(v) =>
              updateField("vehicleUsage", v as "personal" | "commercial")
            }
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="personal">Personal</SelectItem>
              <SelectItem value="commercial">Commercial</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="vehicleZipCode">ZIP Code *</Label>
          <Input
            id="vehicleZipCode"
            value={formData.vehicleZipCode}
            onChange={(e) =>
              updateField(
                "vehicleZipCode",
                e.target.value.replace(/\D/g, "").slice(0, 5)
              )
            }
            placeholder="73301"
            maxLength={5}
            className={errors.vehicleZipCode ? "border-red-500" : ""}
          />
          {errors.vehicleZipCode && (
            <p className="text-sm text-red-500">{errors.vehicleZipCode}</p>
          )}
        </div>
      </div>
    </div>
  );

  const renderStep2 = () => (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold flex items-center gap-2 text-primary">
        <Settings className="h-5 w-5" /> Ownership & Mileage
      </h3>
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>Ownership Type</Label>
          <Select
            value={formData.ownershipType}
            onValueChange={(v) =>
              updateField("ownershipType", v as OwnershipType)
            }
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {OWNERSHIP_TYPES.map((type) => (
                <SelectItem key={type} value={type} className="capitalize">
                  {type}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label>Title Type</Label>
          <Select
            value={formData.ownershipTitleType}
            onValueChange={(v) =>
              updateField("ownershipTitleType", v as TitleType)
            }
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {TITLE_TYPES.map((type) => (
                <SelectItem key={type} value={type} className="capitalize">
                  {type}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="mileage">Mileage *</Label>
          <Input
            id="mileage"
            type="number"
            value={formData.mileage}
            onChange={(e) =>
              updateField("mileage", parseInt(e.target.value) || 0)
            }
            placeholder="126450"
            className={errors.mileage ? "border-red-500" : ""}
          />
          {errors.mileage && (
            <p className="text-sm text-red-500">{errors.mileage}</p>
          )}
        </div>

        <div className="space-y-2 flex items-center gap-2 pt-6">
          <input
            type="checkbox"
            id="isMileageUnverifiable"
            checked={formData.isMileageUnverifiable}
            onChange={(e) =>
              updateField("isMileageUnverifiable", e.target.checked)
            }
            className="h-4 w-4 rounded border-gray-300"
          />
          <Label htmlFor="isMileageUnverifiable" className="cursor-pointer">
            Mileage Unverifiable
          </Label>
        </div>

        <div className="space-y-2">
          <Label>Drivetrain Condition</Label>
          <Select
            value={formData.drivetrainCondition}
            onValueChange={(v) =>
              updateField("drivetrainCondition", v as DrivetrainCondition)
            }
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {DRIVETRAIN_CONDITIONS.map((item) => (
                <SelectItem key={item.value} value={item.value}>
                  {item.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {renderYesNoSelect("keyOrFobAvailable", "Key/Fob Available")}
        {renderYesNoSelect(
          "workingBatteryInstalled",
          "Working Battery Installed"
        )}
        {renderYesNoSelect("allTiresInflated", "All Tires Inflated")}
      </div>
    </div>
  );

  const renderStep3 = () => (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold flex items-center gap-2 text-primary">
        <Wrench className="h-5 w-5" /> Vehicle Condition
      </h3>
      <div className="grid grid-cols-2 gap-4">
        {renderYesNoSelect("wheelsRemoved", "Wheels Removed")}

        {formData.wheelsRemoved === "yes" && (
          <div className="col-span-2 p-4 bg-slate-50 rounded-lg space-y-3">
            <Label className="text-sm font-medium">
              Which wheels are removed?
            </Label>
            <div className="grid grid-cols-2 gap-3">
              {[
                {
                  field: "wheelsRemovedDriverFront" as const,
                  label: "Driver Front",
                },
                {
                  field: "wheelsRemovedDriverRear" as const,
                  label: "Driver Rear",
                },
                {
                  field: "wheelsRemovedPassengerFront" as const,
                  label: "Passenger Front",
                },
                {
                  field: "wheelsRemovedPassengerRear" as const,
                  label: "Passenger Rear",
                },
              ].map((item) => (
                <div key={item.field} className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id={item.field}
                    checked={formData[item.field]}
                    onChange={(e) => updateField(item.field, e.target.checked)}
                    className="h-4 w-4 rounded border-gray-300"
                  />
                  <Label
                    htmlFor={item.field}
                    className="cursor-pointer text-sm"
                  >
                    {item.label}
                  </Label>
                </div>
              ))}
            </div>
          </div>
        )}

        {renderYesNoSelect("bodyPanelsIntact", "Body Panels Intact")}
        {renderYesNoSelect("bodyDamageFree", "Body Damage Free")}
        {renderYesNoSelect(
          "mirrorsLightsGlassIntact",
          "Mirrors/Lights/Glass Intact"
        )}
        {renderYesNoSelect("interiorIntact", "Interior Intact")}

        <div className="space-y-2">
          <Label>Engine/Transmission Condition</Label>
          <Select
            value={formData.engineTransmissionCondition}
            onValueChange={(v) =>
              updateField(
                "engineTransmissionCondition",
                v as EngineTransmissionCondition
              )
            }
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {ENGINE_CONDITIONS.map((type) => (
                <SelectItem key={type} value={type} className="capitalize">
                  {type}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  );

  const renderStep4 = () => (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold flex items-center gap-2 text-primary">
        <Shield className="h-5 w-5" /> Safety & Final Details
      </h3>
      <div className="grid grid-cols-2 gap-4">
        {renderYesNoSelect("floodFireDamageFree", "Flood/Fire Damage Free")}
        {renderYesNoSelect("airbagsDeployed", "Airbags Deployed")}
      </div>

      <div className="mt-6 p-4 bg-slate-50 rounded-lg">
        <h4 className="font-medium mb-3">Summary</h4>
        <div className="grid grid-cols-2 gap-2 text-sm">
          <div>
            <span className="text-muted-foreground">Vehicle:</span>{" "}
            {formData.vehicleYear} {formData.vehicleMake}{" "}
            {formData.vehicleModel}
          </div>
          <div>
            <span className="text-muted-foreground">Trim:</span>{" "}
            {formData.vehicleTrim || "N/A"}
          </div>
          <div>
            <span className="text-muted-foreground">Body:</span>{" "}
            {formData.vehicleBodyType}
          </div>
          <div>
            <span className="text-muted-foreground">Fuel:</span>{" "}
            {formData.vehicleFuelType}
          </div>
          <div>
            <span className="text-muted-foreground">Mileage:</span>{" "}
            {formData.mileage.toLocaleString()}
          </div>
          <div>
            <span className="text-muted-foreground">Title:</span>{" "}
            <span className="capitalize">{formData.ownershipTitleType}</span>
          </div>
          <div>
            <span className="text-muted-foreground">ZIP:</span>{" "}
            {formData.vehicleZipCode}
          </div>
          <div>
            <span className="text-muted-foreground">Drivetrain:</span>{" "}
            <span className="capitalize">
              {formData.drivetrainCondition.replace(/_/g, " ")}
            </span>
          </div>
        </div>
      </div>

      {errors.submit && (
        <div className="p-3 bg-red-50 border border-red-200 rounded-md">
          <p className="text-sm text-red-600">{errors.submit}</p>
        </div>
      )}
    </div>
  );

  return (
    <Dialog
      open={open}
      onOpenChange={(isOpen) => {
        if (!isOpen) resetForm();
        onOpenChange(isOpen);
      }}
    >
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Add New Offer</DialogTitle>
        </DialogHeader>

        <div className="flex items-center justify-center gap-2 mb-6">
          {STEPS.map((step, index) => (
            <div key={step.id} className="flex items-center">
              <div
                className={`flex items-center justify-center w-10 h-10 rounded-full border-2 transition-colors ${
                  currentStep >= step.id
                    ? "bg-primary border-primary text-white"
                    : "border-gray-300 text-gray-400"
                }`}
              >
                <step.icon className="h-5 w-5" />
              </div>
              {index < STEPS.length - 1 && (
                <div
                  className={`w-12 h-1 mx-1 ${
                    currentStep > step.id ? "bg-primary" : "bg-gray-200"
                  }`}
                />
              )}
            </div>
          ))}
        </div>

        <div className="min-h-[400px]">
          {currentStep === 1 && renderStep1()}
          {currentStep === 2 && renderStep2()}
          {currentStep === 3 && renderStep3()}
          {currentStep === 4 && renderStep4()}
        </div>

        <DialogFooter className="flex justify-between mt-6">
          <div>
            {currentStep > 1 && (
              <Button type="button" variant="outline" onClick={handlePrev}>
                <ChevronLeft className="h-4 w-4 mr-1" /> Previous
              </Button>
            )}
          </div>
          <div className="flex gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            {currentStep < 4 ? (
              <Button type="button" onClick={handleNext}>
                Next <ChevronRight className="h-4 w-4 ml-1" />
              </Button>
            ) : (
              <Button
                onClick={handleSubmit}
                disabled={createOfferMutation.isPending}
              >
                {createOfferMutation.isPending ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Creating...
                  </>
                ) : (
                  "Create Offer"
                )}
              </Button>
            )}
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
