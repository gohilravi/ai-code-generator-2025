import { useState } from "react";
import { FileText, Search as SearchIcon } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { OffersTab } from "@/components/OffersTab";
import { SearchTab } from "@/components/SearchTab";
import type { UserType } from "@/types";

const MOCK_USERS = {
  seller: [
    { id: "seller-1", name: "John Auto Sales", type: "seller" as UserType },
    { id: "seller-2", name: "Premium Motors", type: "seller" as UserType },
  ],
  buyer: [
    { id: "buyer-1", name: "Sarah Johnson", type: "buyer" as UserType },
    { id: "buyer-2", name: "Mike Peters", type: "buyer" as UserType },
  ],
  carrier: [
    { id: "carrier-1", name: "FastTransport LLC", type: "carrier" as UserType },
    { id: "carrier-2", name: "QuickShip Motors", type: "carrier" as UserType },
  ],
  agent: [
    { id: "agent-1", name: "Emma Wilson (Agent)", type: "agent" as UserType },
    { id: "agent-2", name: "David Chen (Agent)", type: "agent" as UserType },
  ],
};

function App() {
  const [activeTab, setActiveTab] = useState<"offers" | "search">("offers");

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-slate-50 via-blue-50 to-slate-100">
      <header className="bg-white/80 backdrop-blur-md border-b border-slate-200 shadow-sm sticky top-0 z-10">
        <div className="container mx-auto px-4 py-5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center shadow-lg">
                <FileText className="h-5 w-5 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-blue-600 bg-clip-text text-transparent">
                  Offer Management System
                </h1>
                <p className="text-xs text-slate-500 font-medium">
                  Enterprise Automotive Marketplace
                </p>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="flex-1 container mx-auto px-4 py-8">
        <Tabs
          value={activeTab}
          onValueChange={(v) => setActiveTab(v as "offers" | "search")}
          className="w-full"
        >
          <TabsList className="grid w-full max-w-md mx-auto grid-cols-2 mb-8 h-12 bg-white shadow-md border border-slate-200">
            <TabsTrigger
              value="offers"
              className="gap-2 data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-600 data-[state=active]:to-purple-600 data-[state=active]:text-white transition-all duration-200"
            >
              <FileText className="h-4 w-4" />
              <span className="font-medium">Offers</span>
            </TabsTrigger>
            <TabsTrigger
              value="search"
              className="gap-2 data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-600 data-[state=active]:to-purple-600 data-[state=active]:text-white transition-all duration-200"
            >
              <SearchIcon className="h-4 w-4" />
              <span className="font-medium">Search</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent
            value="offers"
            className="mt-0 animate-in fade-in-50 duration-300"
          >
            <OffersTab
              userType="agent"
              userId="agent-1"
              sellers={MOCK_USERS.seller}
            />
          </TabsContent>

          <TabsContent
            value="search"
            className="mt-0 animate-in fade-in-50 duration-300"
          >
            <SearchTab allUsers={MOCK_USERS} />
          </TabsContent>
        </Tabs>
      </main>

      <footer className="bg-white/80 backdrop-blur-md border-t border-slate-200 py-6 mt-auto">
        <div className="container mx-auto px-4 text-center">
          <p className="text-sm text-slate-600 font-medium">
            &copy; 2025 Offer Management System. All rights reserved.
          </p>
          <p className="text-xs text-slate-400 mt-1">
            Powered by Modern React & TypeScript
          </p>
        </div>
      </footer>
    </div>
  );
}

export default App;
