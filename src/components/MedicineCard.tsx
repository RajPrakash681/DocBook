import { useState } from "react";
import { ShoppingCart, Star, CheckCircle, AlertCircle } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useNavigate } from "react-router-dom";
import { Medicine } from "@/data/medicineData";
import { useToast } from "@/hooks/use-toast";

interface MedicineCardProps {
  medicine: Medicine;
  onAddToCart: (medicine: Medicine) => void;
}

const MedicineCard = ({ medicine, onAddToCart }: MedicineCardProps) => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isAdding, setIsAdding] = useState(false);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsAdding(true);
    
    setTimeout(() => {
      onAddToCart(medicine);
      setIsAdding(false);
      toast({
        title: "Added to cart!",
        description: `${medicine.name} has been added to your cart.`,
        duration: 2000,
      });
    }, 300);
  };

  const handleCardClick = () => {
    navigate(`/medicine/${medicine.id}`);
  };

  const renderStars = (rating: number) => {
    return (
      <div className="flex items-center gap-1">
        {[...Array(5)].map((_, index) => (
          <Star
            key={index}
            className={`h-4 w-4 ${
              index < rating
                ? "fill-yellow-400 text-yellow-400"
                : "fill-gray-200 text-gray-200"
            }`}
          />
        ))}
      </div>
    );
  };

  return (
    <Card
      className="overflow-hidden cursor-pointer hover:shadow-xl transition-all duration-300 group border hover:border-primary/50 hover:-translate-y-2"
      onClick={handleCardClick}
    >
      <CardContent className="p-0">
        {/* Image Container */}
        <div className="relative overflow-hidden bg-muted h-48">
          <img
            src={medicine.image}
            alt={medicine.name}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
          />
          
          {/* Discount Badge */}
          {medicine.discount > 0 && (
            <Badge className="absolute top-3 left-3 bg-red-500 text-white">
              {medicine.discount}% OFF
            </Badge>
          )}

          {/* Stock Status */}
          <Badge
            className={`absolute top-3 right-3 ${
              medicine.stockStatus === "In Stock"
                ? "bg-green-500"
                : medicine.stockStatus === "Low Stock"
                ? "bg-orange-500"
                : "bg-gray-500"
            } text-white`}
          >
            {medicine.stockStatus}
          </Badge>
        </div>

        {/* Content */}
        <div className="p-4 space-y-3">
          {/* Title and Manufacturer */}
          <div>
            <h3 className="font-semibold text-lg line-clamp-1 group-hover:text-primary transition-colors">
              {medicine.name}
            </h3>
            <p className="text-sm text-muted-foreground line-clamp-1">
              {medicine.genericName}
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              by {medicine.manufacturer}
            </p>
          </div>

          {/* Category */}
          <Badge variant="outline" className="text-xs">
            {medicine.category}
          </Badge>

          {/* Pack Size and Dosage */}
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <span>{medicine.packSize}</span>
            <span>•</span>
            <span>{medicine.dosage}</span>
          </div>

          {/* Rating and Reviews */}
          <div className="flex items-center gap-2">
            {renderStars(medicine.rating)}
            <span className="text-sm text-muted-foreground">
              ({medicine.reviews})
            </span>
          </div>

          {/* Prescription Required */}
          {medicine.prescriptionRequired && (
            <div className="flex items-center gap-1 text-orange-600">
              <AlertCircle className="h-4 w-4" />
              <span className="text-xs font-medium">Prescription Required</span>
            </div>
          )}

          {/* Price and Add to Cart */}
          <div className="flex items-center justify-between pt-2 border-t">
            <div>
              <div className="flex items-baseline gap-2">
                <span className="text-2xl font-bold text-primary">
                  ₹{medicine.price}
                </span>
                {medicine.discount > 0 && (
                  <span className="text-sm text-muted-foreground line-through">
                    ₹{medicine.mrp}
                  </span>
                )}
              </div>
              {medicine.discount > 0 && (
                <p className="text-xs text-green-600 font-medium">
                  Save ₹{medicine.mrp - medicine.price}
                </p>
              )}
            </div>

            <Button
              onClick={handleAddToCart}
              disabled={medicine.stockStatus === "Out of Stock" || isAdding}
              className={`transition-all duration-300 ${
                isAdding ? "scale-95" : "hover:scale-105"
              }`}
              size="sm"
            >
              {isAdding ? (
                <CheckCircle className="h-4 w-4 animate-pulse" />
              ) : medicine.stockStatus === "Out of Stock" ? (
                "Out of Stock"
              ) : (
                <>
                  <ShoppingCart className="h-4 w-4 mr-1" />
                  Add
                </>
              )}
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default MedicineCard;
