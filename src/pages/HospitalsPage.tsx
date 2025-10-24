import { useState, useEffect } from "react";
import { hospitals, cities, allServices } from "@/data/hospitalData";
import HospitalCard from "@/components/HospitalCard";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Chatbot from "@/components/Chatbot";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card } from "@/components/ui/card";
import { Search, X, Building2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

const HospitalsPage = () => {
  const [user, setUser] = useState<any>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCity, setSelectedCity] = useState("all");
  const [selectedServices, setSelectedServices] = useState<string[]>([]);
  const [selectedRating, setSelectedRating] = useState("all");
  const [sortBy, setSortBy] = useState("rating-high");
  
  useEffect(() => {
    document.title = "Find Hospitals • DocBook";
    
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
    });

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleServiceToggle = (service: string) => {
    setSelectedServices((prev) =>
      prev.includes(service)
        ? prev.filter((s) => s !== service)
        : [...prev, service]
    );
  };

  const clearAllFilters = () => {
    setSearchQuery("");
    setSelectedCity("all");
    setSelectedServices([]);
    setSelectedRating("all");
    setSortBy("rating-high");
  };

  // Filter hospitals
  const filteredHospitals = hospitals.filter((hospital) => {
    // Search filter
    const matchesSearch = hospital.name
      .toLowerCase()
      .includes(searchQuery.toLowerCase());

    // City filter
    const matchesCity =
      selectedCity === "all" || hospital.city === selectedCity;

    // Services filter (AND logic - hospital must have ALL selected services)
    const matchesServices =
      selectedServices.length === 0 ||
      selectedServices.every((service) => hospital.services.includes(service));

    // Rating filter
    let matchesRating = true;
    if (selectedRating === "5") {
      matchesRating = hospital.rating >= 4.9;
    } else if (selectedRating === "4") {
      matchesRating = hospital.rating >= 4.0;
    } else if (selectedRating === "3") {
      matchesRating = hospital.rating >= 3.0;
    }

    return matchesSearch && matchesCity && matchesServices && matchesRating;
  });

  // Sort hospitals
  const sortedHospitals = [...filteredHospitals].sort((a, b) => {
    switch (sortBy) {
      case "rating-high":
        return b.rating - a.rating;
      case "rating-low":
        return a.rating - b.rating;
      case "name-asc":
        return a.name.localeCompare(b.name);
      case "name-desc":
        return b.name.localeCompare(a.name);
      case "wait-time":
        return parseInt(a.avgWaitTime) - parseInt(b.avgWaitTime);
      default:
        return 0;
    }
  });

  const activeFiltersCount =
    (selectedCity !== "all" ? 1 : 0) +
    selectedServices.length +
    (selectedRating !== "all" ? 1 : 0);

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar user={user} />

      <main className="flex-1">
        {/* Header */}
        <div className="bg-gradient-to-r from-primary/10 via-primary/5 to-background py-12">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl">
              <div className="flex items-center gap-3 mb-4">
                <Building2 className="w-10 h-10 text-primary transition-all duration-300 hover:scale-110 hover:rotate-12" />
                <h1 className="text-4xl font-bold text-foreground">
                  Find Hospitals
                </h1>
              </div>
              <p className="text-lg text-muted-foreground">
                Browse through our extensive list of trusted hospitals across
                India. Filter by location, services, and ratings.
              </p>
            </div>
          </div>
        </div>

        {/* Search and Sort Bar */}
        <div className="bg-background border-b sticky top-16 z-40 shadow-sm">
          <div className="container mx-auto px-4 py-4">
            <div className="flex flex-col md:flex-row gap-4 items-center">
              {/* Search */}
              <div className="relative flex-1 w-full">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <Input
                  type="text"
                  placeholder="Search hospitals by name..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 pr-10"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery("")}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                  >
                    <X className="h-4 w-4" />
                  </button>
                )}
              </div>

              {/* Sort */}
              <div className="w-full md:w-64">
                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger>
                    <SelectValue placeholder="Sort by" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="rating-high">Rating: High to Low</SelectItem>
                    <SelectItem value="rating-low">Rating: Low to High</SelectItem>
                    <SelectItem value="name-asc">Name: A to Z</SelectItem>
                    <SelectItem value="name-desc">Name: Z to A</SelectItem>
                    <SelectItem value="wait-time">Wait Time: Low to High</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Active Filters Count */}
            {activeFiltersCount > 0 && (
              <div className="mt-3 flex items-center gap-2">
                <span className="text-sm text-muted-foreground">
                  {activeFiltersCount} filter{activeFiltersCount > 1 ? "s" : ""}{" "}
                  active
                </span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={clearAllFilters}
                  className="h-7 text-xs"
                >
                  Clear all
                </Button>
              </div>
            )}
          </div>
        </div>

        {/* Main Content */}
        <div className="container mx-auto px-4 py-8">
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Sidebar Filters */}
            <aside className="lg:w-64 flex-shrink-0">
              <Card className="p-6 sticky top-32 space-y-6">
                <div>
                  <h3 className="font-semibold text-foreground mb-3 flex items-center justify-between">
                    Filters
                    {activeFiltersCount > 0 && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={clearAllFilters}
                        className="h-7 text-xs"
                      >
                        Clear
                      </Button>
                    )}
                  </h3>
                </div>

                {/* City Filter */}
                <div className="space-y-3">
                  <Label className="text-sm font-medium">City</Label>
                  <Select value={selectedCity} onValueChange={setSelectedCity}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select city" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Cities</SelectItem>
                      {cities.map((city) => (
                        <SelectItem key={city} value={city}>
                          {city}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Services Filter */}
                <div className="space-y-3">
                  <Label className="text-sm font-medium">Services</Label>
                  <div className="space-y-2 max-h-64 overflow-y-auto">
                    {allServices.map((service) => (
                      <div key={service} className="flex items-center space-x-2">
                        <Checkbox
                          id={service}
                          checked={selectedServices.includes(service)}
                          onCheckedChange={() => handleServiceToggle(service)}
                        />
                        <label
                          htmlFor={service}
                          className="text-sm cursor-pointer flex-1"
                        >
                          {service}
                        </label>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Rating Filter */}
                <div className="space-y-3">
                  <Label className="text-sm font-medium">Minimum Rating</Label>
                  <RadioGroup value={selectedRating} onValueChange={setSelectedRating}>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="all" id="rating-all" />
                      <Label htmlFor="rating-all" className="cursor-pointer">
                        All Ratings
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="5" id="rating-5" />
                      <Label htmlFor="rating-5" className="cursor-pointer">
                        5 ⭐ only
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="4" id="rating-4" />
                      <Label htmlFor="rating-4" className="cursor-pointer">
                        4 ⭐ & above
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="3" id="rating-3" />
                      <Label htmlFor="rating-3" className="cursor-pointer">
                        3 ⭐ & above
                      </Label>
                    </div>
                  </RadioGroup>
                </div>
              </Card>
            </aside>

            {/* Hospital Grid */}
            <div className="flex-1">
              <div className="mb-6">
                <h2 className="text-2xl font-semibold text-foreground">
                  {sortedHospitals.length} Hospital
                  {sortedHospitals.length !== 1 ? "s" : ""} Found
                </h2>
              </div>

              {sortedHospitals.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                  {sortedHospitals.map((hospital) => (
                    <HospitalCard key={hospital.id} hospital={hospital} />
                  ))}
                </div>
              ) : (
                <Card className="p-12 text-center">
                  <Building2 className="w-16 h-16 text-muted-foreground mx-auto mb-4 opacity-50" />
                  <h3 className="text-xl font-semibold text-foreground mb-2">
                    No hospitals found
                  </h3>
                  <p className="text-muted-foreground mb-6">
                    Try adjusting your filters or search query
                  </p>
                  <Button onClick={clearAllFilters}>Clear All Filters</Button>
                </Card>
              )}
            </div>
          </div>
        </div>
      </main>

      <Footer />
      <Chatbot />
    </div>
  );
};

export default HospitalsPage;
