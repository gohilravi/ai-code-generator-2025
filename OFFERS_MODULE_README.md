# Offer Management & Search Module

## Overview

This module implements a comprehensive offer management and search system with role-based access control, supporting sellers, buyers, carriers, and agents.

## Features Implemented

### 1. Offers Tab

#### Offers Listing

- **Paginated table** displaying all offers with the following columns:

  - Offer ID
  - Year, Make, Model
  - VIN
  - Price
  - Status (draft, assigned, cancelled, completed)
  - Seller, Buyer, Carrier names
  - Created Date
  - Last Updated Date
  - Actions dropdown

- **Search functionality** across all offer fields
- **Real-time filtering** with debounced search
- **Pagination controls** (20 items per page)
- **Role-based visibility** - users only see relevant offers

#### Add New Offer

- Modal dialog with comprehensive form
- **Required fields validation**:
  - Year (1900 - current year + 1)
  - Make, Model
  - VIN (17 characters)
  - Price (positive number)
  - Seller selection
  - Location (city, state, ZIP)
  - Mileage (positive number)
- **Optional fields**:
  - Notes
  - Validity date
  - Condition description
- Real-time validation with error messages
- Form reset on success/cancel

#### Assign Offer

- Modal with searchable buyer and carrier selection
- **Filterable dropdowns** for easy selection
- Only enabled for offers with 'draft' status
- Updates offer status to 'assigned'
- Role-based permissions (seller and agent can assign)

#### Cancel Offer

- Confirmation modal with offer details
- Warning about irreversible action
- Only enabled for 'draft' or 'assigned' offers
- Updates offer status to 'cancelled'
- Role-based permissions (seller and agent can cancel)

### 2. Search Tab

#### Token-Based Search Context

- **Automatic token generation** on tab load
- Token contains:
  - User Type
  - User ID
  - Expiration timestamp
- Token sent with all search requests via `X-Search-Token` header
- Backend enforces role-based data access

#### Search Filters

- **Multi-entity search**:
  - Offers
  - Purchases
  - Transports
  - All entities
- **User selection dropdown** per role
- **Real-time autocomplete** suggestions
- **Debounced search** for performance

#### Role-Based Access

- **Seller**: Access only seller-related offers
- **Buyer**: Access only buyer-related purchases and offers
- **Carrier**: Access only carrier-related transports
- **Agent**: Full access to all entity types

### 3. Architecture & Components

#### Type Definitions (`src/types/index.ts`)

- `OfferStatus`: draft | assigned | cancelled | completed
- `Offer`: Complete offer interface with buyer/carrier info
- `CreateOfferRequest`: Request payload for creating offers
- `AssignOfferRequest`: Request payload for assignments
- `OffersListResponse`: Paginated response type
- `SearchToken`: Token structure for search context

#### API Services (`src/services/api.ts`)

- `offerService.getOffers()`: List offers with pagination/filtering
- `offerService.createOffer()`: Create new offer
- `offerService.assignOffer()`: Assign offer to buyer/carrier
- `offerService.cancelOffer()`: Cancel offer
- `searchService.generateToken()`: Generate search token
- `setSearchToken()`: Set token in axios headers
- `clearSearchToken()`: Clear token from axios headers

#### UI Components

- **Dialog** (`components/ui/dialog.tsx`): Radix UI dialog wrapper
- **DropdownMenu** (`components/ui/dropdown-menu.tsx`): Radix UI dropdown wrapper
- **Table** (`components/ui/table.tsx`): Styled table components
- **Label** (`components/ui/label.tsx`): Form label component

#### Feature Components

- **AddOfferModal** (`components/AddOfferModal.tsx`): Create offer form
- **AssignOfferModal** (`components/AssignOfferModal.tsx`): Assign offer form
- **CancelOfferModal** (`components/CancelOfferModal.tsx`): Cancel confirmation
- **OffersTab** (`components/OffersTab.tsx`): Main offers management UI
- **SearchTab** (`components/SearchTab.tsx`): Enhanced search with tokens

### 4. Role-Based Access Control

#### Permissions Matrix

| Action       | Seller   | Buyer         | Carrier       | Agent    |
| ------------ | -------- | ------------- | ------------- | -------- |
| View Offers  | ✅ (own) | ✅ (assigned) | ✅ (assigned) | ✅ (all) |
| Create Offer | ✅       | ❌            | ❌            | ✅       |
| Assign Offer | ✅ (own) | ❌            | ❌            | ✅ (all) |
| Cancel Offer | ✅ (own) | ❌            | ❌            | ✅ (all) |
| Search All   | ❌       | ❌            | ❌            | ✅       |

### 5. API Endpoints Expected

```
GET    /api/offers                  - List offers (with pagination, search, filters)
POST   /api/offers                  - Create new offer
GET    /api/offers/:id              - Get offer by ID
POST   /api/offers/:id/assign       - Assign offer to buyer/carrier
POST   /api/offers/:id/cancel       - Cancel offer
POST   /api/search/token            - Generate search token
POST   /api/search                  - Perform search with token
POST   /api/search/autocomplete     - Get autocomplete suggestions
GET    /api/users?type=:userType    - Get users by type
```

### 6. Installation & Setup

1. **Install dependencies**:

```bash
cd frontend
npm install
```

2. **Required dependencies** (already added to package.json):

   - `@radix-ui/react-dialog`
   - `@radix-ui/react-dropdown-menu`
   - `@radix-ui/react-label`
   - `@radix-ui/react-select`
   - `date-fns`
   - `lucide-react`

3. **Environment setup**:

```bash
# Create .env file
VITE_API_BASE_URL=http://localhost:4000
```

4. **Start development server**:

```bash
npm run dev
```

### 7. Usage

#### Navigate Between User Types

Use the top-level tabs to switch between Seller, Buyer, Carrier, and Agent portals.

#### Access Offers or Search

Use the secondary tabs to switch between:

- **Offers**: Manage offer lifecycle
- **Search**: Search across entities with token-based context

#### Create an Offer

1. Click "Add Offer" button (visible for sellers and agents)
2. Fill in required vehicle and offer details
3. Select seller from dropdown
4. Submit form

#### Assign an Offer

1. Find offer with 'draft' status
2. Click Actions dropdown → "Assign"
3. Search and select buyer
4. Search and select carrier
5. Confirm assignment

#### Cancel an Offer

1. Find offer with 'draft' or 'assigned' status
2. Click Actions dropdown → "Cancel"
3. Review offer details
4. Confirm cancellation (irreversible)

### 8. Technical Highlights

- **Performance**: Debounced search, optimized re-renders, pagination
- **UX**: Loading states, error handling, empty states, confirmation modals
- **Validation**: Client-side validation with clear error messages
- **Security**: Token-based search, role-based access control
- **Maintainability**: Modular components, TypeScript types, consistent patterns
- **Accessibility**: Semantic HTML, keyboard navigation, ARIA labels

### 9. Future Enhancements

- Export offers to CSV/Excel
- Bulk operations (assign/cancel multiple)
- Advanced filtering (date ranges, price ranges)
- Offer history/audit log
- Real-time notifications
- Document attachments
- Print/PDF generation
- Analytics dashboard

## Testing Checklist

- [ ] Create offer with valid data
- [ ] Create offer with invalid data (validation errors)
- [ ] View offers list with pagination
- [ ] Search offers by various fields
- [ ] Assign offer to buyer and carrier
- [ ] Try to assign already assigned offer (should be disabled)
- [ ] Cancel offer
- [ ] Try to cancel completed offer (should be disabled)
- [ ] Switch between user types
- [ ] Test role-based permissions
- [ ] Generate and use search token
- [ ] Search with different entity types
- [ ] Test autocomplete suggestions

## Support

For issues or questions, please refer to the main project documentation or contact the development team.
