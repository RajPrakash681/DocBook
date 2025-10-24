import { useState, useEffect } from "react";
import { Search, SlidersHorizontal } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { medicines, categories, Medicine } from "@/data/medicineData";
import MedicineCard from "@/components/MedicineCard";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Chatbot from "@/components/Chatbot";
import { useCart } from "@/context/CartContext";
import { supabase } from "@/integrations/supabase/client";

const MedicinesPage = () => {
  const [user, setUser] = useState<any>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedPrescription, setSelectedPrescription] = useState<string>("all");
  const [selectedStock, setSelectedStock] = useState<string>("all");
  const [sortBy, setSortBy] = useState("popularity");
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 1000]);
  const [showFilters, setShowFilters] = useState(true);
  const { addToCart } = useCart();

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  // Filter medicines
  const filteredMedicines = medicines.filter((medicine) => {
    // Search filter
    const matchesSearch =
      medicine.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      medicine.genericName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      medicine.category.toLowerCase().includes(searchQuery.toLowerCase());

    // Category filter
    const matchesCategory =
      selectedCategories.length === 0 ||
      selectedCategories.includes(medicine.category);

    // Prescription filter
    const matchesPrescription =
      selectedPrescription === "all" ||
      (selectedPrescription === "required" && medicine.prescriptionRequired) ||
      (selectedPrescription === "not-required" && !medicine.prescriptionRequired);

    // Stock filter
    const matchesStock =
      selectedStock === "all" ||
      (selectedStock === "in-stock" && medicine.stockStatus === "In Stock") ||
      (selectedStock === "low-stock" && medicine.stockStatus === "Low Stock");

    // Price filter
    const matchesPrice =
      medicine.price >= priceRange[0] && medicine.price <= priceRange[1];

    return (
      matchesSearch &&
      matchesCategory &&
      matchesPrescription &&
      matchesStock &&
      matchesPrice
    );
  });

  // Sort medicines
  const sortedMedicines = [...filteredMedicines].sort((a, b) => {
    switch (sortBy) {
      case "price-low":
        return a.price - b.price;
      case "price-high":
        return b.price - a.price;
      case "name":
        return a.name.localeCompare(b.name);
      case "rating":
        return b.rating - a.rating;
      case "discount":
        return b.discount - a.discount;
      case "popularity":
      default:
        return b.reviews - a.reviews;
    }
  });

  const handleCategoryToggle = (category: string) => {
    setSelectedCategories((prev) =>
      prev.includes(category)
        ? prev.filter((c) => c !== category)
        : [...prev, category]
    );
  };

  const handleClearFilters = () => {
    setSelectedCategories([]);
    setSelectedPrescription("all");
    setSelectedStock("all");
    setPriceRange([0, 1000]);
    setSearchQuery("");
  };

  return (
    <div className="min-h-screen flex flex-col bg-muted/30">
      <Navbar user={user} />

      <div className="container mx-auto px-4 py-8 flex-1">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">Online Pharmacy</h1>
          <p className="text-muted-foreground">
            Order medicines online with prescription upload and doorstep delivery
          </p>
        </div>

        {/* Search and Sort Bar */}
        <div className="mb-6 flex flex-col md:flex-row gap-4">
          {/* Search */}
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <Input
              placeholder="Search medicines by name, generic name, or category..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>

          {/* Sort */}
          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className="w-full md:w-[200px]">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="popularity">Most Popular</SelectItem>
              <SelectItem value="price-low">Price: Low to High</SelectItem>
              <SelectItem value="price-high">Price: High to Low</SelectItem>
              <SelectItem value="name">Name: A to Z</SelectItem>
              <SelectItem value="rating">Highest Rated</SelectItem>
              <SelectItem value="discount">Best Discount</SelectItem>
            </SelectContent>
          </Select>

          {/* Toggle Filters (Mobile) */}
          <Button
            variant="outline"
            onClick={() => setShowFilters(!showFilters)}
            className="md:hidden"
          >
            <SlidersHorizontal className="h-5 w-5 mr-2" />
            Filters
          </Button>
        </div>

        {/* Results Count */}
        <div className="mb-4 flex items-center justify-between">
          <p className="text-muted-foreground">
            Showing <span className="font-semibold text-foreground">{sortedMedicines.length}</span> of{" "}
            <span className="font-semibold text-foreground">{medicines.length}</span> medicines
          </p>
          {(selectedCategories.length > 0 ||
            selectedPrescription !== "all" ||
            selectedStock !== "all" ||
            searchQuery) && (
            <Button variant="ghost" onClick={handleClearFilters} size="sm">
              Clear All Filters
            </Button>
          )}
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Filters Sidebar */}
          <div
            className={`lg:col-span-1 ${
              showFilters ? "block" : "hidden"
            } lg:block`}
          >
            <Card className="p-6 sticky top-4">
              <h3 className="font-semibold text-lg mb-4 flex items-center gap-2">
                <SlidersHorizontal className="h-5 w-5" />
                Filters
              </h3>

              <Separator className="mb-4" />

              {/* Category Filter */}
              <div className="mb-6">
                <h4 className="font-medium mb-3">Category</h4>
                <div className="space-y-2">
                  {categories.map((category) => (
                    <div key={category} className="flex items-center space-x-2">
                      <Checkbox
                        id={category}
                        checked={selectedCategories.includes(category)}
                        onCheckedChange={() => handleCategoryToggle(category)}
                      />
                      <Label
                        htmlFor={category}
                        className="text-sm cursor-pointer"
                      >
                        {category}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>

              <Separator className="mb-4" />

              {/* Prescription Filter */}
              <div className="mb-6">
                <h4 className="font-medium mb-3">Prescription</h4>
                <RadioGroup
                  value={selectedPrescription}
                  onValueChange={setSelectedPrescription}
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="all" id="prescription-all" />
                    <Label htmlFor="prescription-all" className="text-sm cursor-pointer">
                      All Medicines
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="required" id="prescription-required" />
                    <Label
                      htmlFor="prescription-required"
                      className="text-sm cursor-pointer"
                    >
                      Prescription Required
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem
                      value="not-required"
                      id="prescription-not-required"
                    />
                    <Label
                      htmlFor="prescription-not-required"
                      className="text-sm cursor-pointer"
                    >
                      No Prescription Needed
                    </Label>
                  </div>
                </RadioGroup>
              </div>

              <Separator className="mb-4" />

              {/* Stock Filter */}
              <div className="mb-6">
                <h4 className="font-medium mb-3">Availability</h4>
                <RadioGroup value={selectedStock} onValueChange={setSelectedStock}>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="all" id="stock-all" />
                    <Label htmlFor="stock-all" className="text-sm cursor-pointer">
                      All
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="in-stock" id="stock-in" />
                    <Label htmlFor="stock-in" className="text-sm cursor-pointer">
                      In Stock
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="low-stock" id="stock-low" />
                    <Label htmlFor="stock-low" className="text-sm cursor-pointer">
                      Low Stock
                    </Label>
                  </div>
                </RadioGroup>
              </div>

              <Separator className="mb-4" />

              {/* Price Range */}
              <div>
                <h4 className="font-medium mb-3">Price Range</h4>
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span>₹{priceRange[0]}</span>
                    <span>₹{priceRange[1]}</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="1000"
                    step="50"
                    value={priceRange[1]}
                    onChange={(e) =>
                      setPriceRange([priceRange[0], parseInt(e.target.value)])
                    }
                    className="w-full"
                  />
                </div>
              </div>
            </Card>
          </div>

          {/* Medicine Grid */}
          <div className="lg:col-span-3">
            {sortedMedicines.length === 0 ? (
              <Card className="p-12 text-center">
                <p className="text-muted-foreground text-lg mb-2">
                  No medicines found
                </p>
                <p className="text-sm text-muted-foreground mb-4">
                  Try adjusting your filters or search query
                </p>
                <Button onClick={handleClearFilters}>Clear Filters</Button>
              </Card>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {sortedMedicines.map((medicine) => (
                  <MedicineCard
                    key={medicine.id}
                    medicine={medicine}
                    onAddToCart={addToCart}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      <Footer />
      <Chatbot />
    </div>
  );
};

export default MedicinesPage;
