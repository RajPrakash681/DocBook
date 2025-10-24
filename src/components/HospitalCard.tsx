import { useNavigate } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MapPin, Star, Bed, Users, Clock, ArrowRight } from "lucide-react";
import { Hospital } from "@/data/hospitalData";

interface HospitalCardProps {
  hospital: Hospital;
}

const HospitalCard = ({ hospital }: HospitalCardProps) => {
  const navigate = useNavigate();

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, index) => (
      <Star
        key={index}
        className={`w-4 h-4 transition-all duration-300 ${
          index < Math.floor(rating)
            ? "fill-warning text-warning"
            : "text-gray-300"
        }`}
      />
    ));
  };

  const visibleServices = hospital.services.slice(0, 3);
  const remainingServices = hospital.services.length - 3;

  return (
    <Card
      className="group cursor-pointer overflow-hidden transition-all duration-300 hover:shadow-2xl hover:-translate-y-2 hover:scale-[1.02]"
      onClick={() => navigate(`/hospital/${hospital.id}`)}
    >
      {/* Hospital Image */}
      <div className="relative overflow-hidden h-56">
        <img
          src={hospital.image}
          alt={hospital.name}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
        />
        <div className="absolute top-3 right-3 bg-white/95 backdrop-blur-sm px-3 py-1.5 rounded-full shadow-lg">
          <div className="flex items-center gap-1">
            <Star className="w-4 h-4 fill-warning text-warning transition-all duration-300 group-hover:scale-125 group-hover:rotate-12" />
            <span className="font-semibold text-sm">{hospital.rating}</span>
            <span className="text-xs text-muted-foreground">
              ({hospital.reviews})
            </span>
          </div>
        </div>
      </div>

      {/* Hospital Info */}
      <div className="p-5 space-y-4">
        {/* Name and Location */}
        <div className="space-y-2">
          <h3 className="font-bold text-lg text-foreground line-clamp-1 group-hover:text-primary transition-colors">
            {hospital.name}
          </h3>
          <div className="flex items-center gap-1.5 text-muted-foreground">
            <MapPin className="w-4 h-4 flex-shrink-0 transition-all duration-300 group-hover:scale-110 group-hover:text-primary" />
            <span className="text-sm">{hospital.city}, {hospital.state}</span>
          </div>
        </div>

        {/* Rating Stars */}
        <div className="flex items-center gap-1">
          {renderStars(hospital.rating)}
        </div>

        {/* Services */}
        <div className="flex flex-wrap gap-2">
          {visibleServices.map((service, index) => (
            <Badge
              key={index}
              variant="secondary"
              className="text-xs transition-all duration-300 group-hover:bg-primary group-hover:text-primary-foreground"
            >
              {service}
            </Badge>
          ))}
          {remainingServices > 0 && (
            <Badge variant="outline" className="text-xs">
              +{remainingServices} more
            </Badge>
          )}
        </div>

        {/* Quick Stats */}
        <div className="flex items-center justify-between pt-3 border-t">
          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <div className="flex items-center gap-1.5 group/stat">
              <Bed className="w-4 h-4 transition-all duration-300 group-hover/stat:scale-125 group-hover/stat:text-primary" />
              <span>{hospital.beds}</span>
            </div>
            <div className="flex items-center gap-1.5 group/stat">
              <Users className="w-4 h-4 transition-all duration-300 group-hover/stat:scale-125 group-hover/stat:text-primary" />
              <span>{hospital.doctors}</span>
            </div>
            <div className="flex items-center gap-1.5 group/stat">
              <Clock className="w-4 h-4 transition-all duration-300 group-hover/stat:scale-125 group-hover/stat:text-primary" />
              <span className="text-xs">{hospital.avgWaitTime}</span>
            </div>
          </div>
        </div>

        {/* Availability Badge */}
        <div className="flex items-center justify-between">
          <Badge
            variant={hospital.availability === "24/7 Open" ? "default" : "secondary"}
            className="transition-all duration-300"
          >
            {hospital.availability}
          </Badge>
          <Button
            size="sm"
            variant="ghost"
            className="group-hover:text-primary group-hover:bg-primary/10"
            onClick={(e) => {
              e.stopPropagation();
              navigate(`/hospital/${hospital.id}`);
            }}
          >
            View Details
            <ArrowRight className="ml-1.5 h-4 w-4 transition-all duration-300 group-hover:translate-x-1" />
          </Button>
        </div>
      </div>
    </Card>
  );
};

export default HospitalCard;
