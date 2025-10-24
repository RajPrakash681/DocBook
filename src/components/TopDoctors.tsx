import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, Star } from "lucide-react";

// Placeholder data - will be replaced with real data from Supabase
const topDoctors = [
  {
    id: "1",
    name: "Dr. Richard James",
    speciality: "General physician",
    image: "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=400",
    available: true,
    rating: 4.9,
    experience: 15,
  },
  {
    id: "2",
    name: "Dr. Emily Clark",
    speciality: "Gynecologist",
    image: "https://images.unsplash.com/photo-1594824476967-48c8b964273f?w=400",
    available: true,
    rating: 4.8,
    experience: 12,
  },
  {
    id: "3",
    name: "Dr. Sarah Patel",
    speciality: "Dermatologist",
    image: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=400",
    available: false,
    rating: 4.7,
    experience: 10,
  },
  {
    id: "4",
    name: "Dr. Michael Chen",
    speciality: "Pediatricians",
    image: "https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=400",
    available: true,
    rating: 4.9,
    experience: 18,
  },
];

const TopDoctors = () => {
  const navigate = useNavigate();

  return (
    <section className="py-20">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Top Doctors to Book
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Simply browse through our extensive list of trusted doctors.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {topDoctors.map((doctor) => (
            <Card
              key={doctor.id}
              className="group cursor-pointer overflow-hidden transition-all duration-300 hover:shadow-2xl hover:-translate-y-2 hover:scale-[1.02]"
              onClick={() => navigate(`/appointment/${doctor.id}`)}
            >
              <div className="relative overflow-hidden">
                <img
                  src={doctor.image}
                  alt={doctor.name}
                  className="w-full h-64 object-cover transition-transform duration-500 group-hover:scale-110"
                />
                {doctor.available ? (
                  <Badge className="absolute top-3 right-3 bg-success text-success-foreground">
                    Available
                  </Badge>
                ) : (
                  <Badge className="absolute top-3 right-3" variant="secondary">
                    Not Available
                  </Badge>
                )}
              </div>
              <div className="p-5 space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold text-lg text-foreground">
                    {doctor.name}
                  </h3>
                  <div className="flex items-center gap-1">
                    <Star className="w-4 h-4 fill-warning text-warning transition-all duration-300 group-hover:scale-125 group-hover:rotate-12" />
                    <span className="text-sm font-medium">{doctor.rating}</span>
                  </div>
                </div>
                <p className="text-muted-foreground text-sm">
                  {doctor.speciality}
                </p>
                <div className="flex items-center justify-between pt-2">
                  <span className="text-xs text-muted-foreground">
                    {doctor.experience} years exp.
                  </span>
                  {doctor.available && (
                    <Button size="sm" variant="ghost" className="group-hover:text-primary">
                      Book Now
                      <ArrowRight className="ml-1 h-4 w-4 transition-all duration-300 group-hover:translate-x-1 group-hover:scale-110" />
                    </Button>
                  )}
                </div>
              </div>
            </Card>
          ))}
        </div>

        <div className="text-center">
          <Button
            size="lg"
            variant="outline"
            onClick={() => navigate("/doctors")}
            className="group"
          >
            View All Doctors
            <ArrowRight className="ml-2 h-5 w-5 transition-all duration-300 group-hover:translate-x-2 group-hover:scale-110" />
          </Button>
        </div>
      </div>
    </section>
  );
};

export default TopDoctors;
