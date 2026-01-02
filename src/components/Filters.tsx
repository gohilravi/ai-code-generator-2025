import { Filter } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { EntityType, UserType } from "@/types";

interface FiltersProps {
  entityType: EntityType;
  onEntityTypeChange: (type: EntityType) => void;
  userType: UserType;
  userId: string;
  users: Array<{ id: string; name: string }>;
  onUserChange: (userId: string) => void;
}

export function Filters({
  entityType,
  onEntityTypeChange,
  userType,
  userId,
  users,
  onUserChange,
}: FiltersProps) {
  const entityTypeLabels: Record<EntityType, string> = {
    all: "All Entities",
    offer: "Offers",
    purchase: "Purchases",
    transport: "Transports",
  };

  return (
    <div className="flex flex-wrap items-center gap-3">
      <div className="flex items-center gap-2">
        <Filter className="h-4 w-4 text-muted-foreground" />
        <span className="text-sm font-medium">Filters:</span>
      </div>

      <Select
        value={entityType}
        onValueChange={(value) => onEntityTypeChange(value as EntityType)}
      >
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Select entity type" />
        </SelectTrigger>
        <SelectContent>
          {Object.entries(entityTypeLabels).map(([value, label]) => (
            <SelectItem key={value} value={value}>
              {label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      {users.length > 0 && (
        <Select value={userId} onValueChange={onUserChange}>
          <SelectTrigger className="w-[200px]">
            <SelectValue placeholder="Select user" />
          </SelectTrigger>
          <SelectContent>
            {users.map((user) => (
              <SelectItem key={user.id} value={user.id}>
                {user.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      )}

      <div className="text-xs text-muted-foreground bg-muted px-3 py-2 rounded-md">
        Role: <span className="font-semibold uppercase">{userType}</span>
      </div>
    </div>
  );
}
