# Centralized Search Platform - Frontend

A modern, responsive React frontend for the Centralized Search Platform with role-based interfaces for Sellers, Buyers, Carriers, and Agents.

## Features

- ✨ **Modern UI**: Built with React, TypeScript, and Tailwind CSS
- 🎨 **Beautiful Design**: Using shadcn/ui components for a polished look
- 📱 **Responsive**: Works seamlessly on desktop, tablet, and mobile devices
- 🔍 **Smart Search**:
  - Real-time autocomplete suggestions
  - Typo tolerance
  - Entity detection (VIN, IDs, locations)
  - Multi-field search
- 👥 **Role-Based Views**: Separate portals for each user type
- 🎯 **Entity Filters**: Filter by Offers, Purchases, or Transports
- ⚡ **Fast Performance**: Optimized rendering and API calls
- 🎭 **Animations**: Smooth transitions and loading states

## Tech Stack

- **Framework**: React 18 + TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS
- **UI Components**: shadcn/ui (Radix UI primitives)
- **Icons**: Lucide React
- **HTTP Client**: Axios
- **State Management**: React Hooks

## Getting Started

### Prerequisites

- Node.js 18+ and npm

### Installation

1. Navigate to the frontend directory:

```bash
cd frontend
```

2. Install dependencies:

```bash
npm install
```

3. Create environment file:

```bash
cp .env.example .env
```

4. Update `.env` with your API URL:

```
VITE_API_BASE_URL=http://localhost:4000
```

### Development

Run the development server:

```bash
npm run dev
```

The application will be available at `http://localhost:3000`

### Build

Build for production:

```bash
npm run build
```

Preview production build:

```bash
npm run preview
```

## Docker Deployment

### Build the image:

```bash
docker build -t search-frontend .
```

### Run the container:

```bash
docker run -p 80:80 search-frontend
```

## Project Structure

```
frontend/
├── src/
│   ├── components/          # React components
│   │   ├── ui/             # Base UI components (shadcn/ui)
│   │   ├── ResultCards/    # Entity-specific result cards
│   │   ├── SearchBar.tsx   # Search input with autocomplete
│   │   ├── Filters.tsx     # Filter controls
│   │   └── ResultsGrid.tsx # Results display
│   ├── services/           # API service layer
│   ├── types/              # TypeScript type definitions
│   ├── lib/                # Utility functions
│   ├── App.tsx             # Main application component
│   ├── main.tsx            # Application entry point
│   └── index.css           # Global styles
├── public/                 # Static assets
├── Dockerfile             # Docker configuration
├── nginx.conf             # Nginx configuration
└── package.json           # Dependencies
```

## User Types & Features

### 🏢 Seller Portal

- Search their own vehicle offers
- View offer details (VIN, make, model, price, location)
- Filter by offer status

### 🛒 Buyer Portal

- Search available offers
- View purchase history
- Track purchase status

### 🚛 Carrier Portal

- Search transport assignments
- View pickup and delivery details
- Track transport status

### 👨‍💼 Agent Portal

- Search across ALL entities
- Access complete customer information
- Help users with cross-entity queries

## Component Highlights

### SearchBar

- Real-time autocomplete with debouncing
- Keyboard navigation (Arrow keys, Enter, Escape)
- Entity type detection and highlighting
- Smart suggestions

### Entity Cards

- **OfferCard**: Vehicle offers with pricing and location
- **PurchaseCard**: Purchase transactions with buyer info
- **TransportCard**: Transport details with route information

### Filters

- Entity type selector (All/Offers/Purchases/Transports)
- User selector for each role
- Active role indicator

## API Integration

The frontend expects the following API endpoints:

- `POST /api/search` - Main search endpoint
- `POST /api/search/autocomplete` - Autocomplete suggestions
- `GET /api/users?type={userType}` - Get users by type

See `src/services/api.ts` for detailed API contracts.

## Styling

The application uses a modern design system with:

- Custom color palette (primary, secondary, accent)
- Responsive breakpoints
- Smooth animations and transitions
- Accessible color contrasts
- Dark mode ready (theme variables)

## Performance Optimizations

- Debounced autocomplete requests (300ms)
- Lazy loading for result cards
- Optimized re-renders with React.memo
- Efficient state management
- Code splitting with Vite

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Contributing

When adding new features:

1. Follow the existing component structure
2. Use TypeScript for type safety
3. Maintain consistent styling with Tailwind
4. Add proper error handling
5. Test across different user types

## License

MIT
