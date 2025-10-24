import { useNavigate } from "react-router-dom";
import { Heart, Baby, Brain, Stethoscope, Activity, User, Building2 } from "lucide-react";
import { Card } from "@/components/ui/card";

const specialities = [
  {
    name: "General physician",
    icon: Stethoscope,
    description: "Primary care and wellness",
    type: "doctor",
  },
  {
    name: "Gynecologist",
    icon: Heart,
    description: "Women's health specialist",
    type: "doctor",
  },
  {
    name: "Dermatologist",
    icon: User,
    description: "Skin care expert",
    type: "doctor",
  },
  {
    name: "Pediatricians",
    icon: Baby,
    description: "Children's health care",
    type: "doctor",
  },
  {
    name: "Neurologist",
    icon: Brain,
    description: "Brain & nervous system",
    type: "doctor",
  },
  {
    name: "Gastroenterologist",
    icon: Activity,
    description: "Digestive health",
    type: "doctor",
  },
  {
    name: "Search Hospitals",
    icon: Building2,
    description: "Find trusted hospitals",
    type: "hospital",
  },
];

const SpecialitySection = () => {
  const navigate = useNavigate();

  const handleSpecialityClick = (speciality: { name: string; type: string }) => {
    if (speciality.type === "hospital") {
      navigate("/hospitals");
    } else {
      navigate(`/doctors?speciality=${encodeURIComponent(speciality.name)}`);
    }
  };

  return (
    <section className="py-20 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Find by Speciality
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Simply browse through our extensive list of trusted doctors,
            schedule your appointment hassle-free.
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 md:gap-6">
          {specialities.map((speciality) => {
            const Icon = speciality.icon;
            const isHospital = speciality.type === "hospital";
            return (
              <Card
                key={speciality.name}
                className={`group cursor-pointer transition-all duration-300 hover:shadow-lg hover:-translate-y-2 border-2 hover:border-primary ${
                  isHospital ? "col-span-2 md:col-span-3 lg:col-start-3 lg:col-span-2" : ""
                }`}
                onClick={() => handleSpecialityClick(speciality)}
              >
                <div className="p-6 flex flex-col items-center text-center space-y-3">
                  <div className={`w-16 h-16 rounded-full ${
                    isHospital ? "bg-primary" : "bg-primary-light"
                  } flex items-center justify-center group-hover:bg-primary group-hover:scale-110 transition-all duration-300`}>
                    <Icon className={`w-8 h-8 ${
                      isHospital ? "text-primary-foreground" : "text-primary group-hover:text-primary-foreground"
                    } transition-all duration-300 group-hover:scale-125 group-hover:rotate-12`} />
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground mb-1">
                      {speciality.name}
                    </h3>
                    <p className="text-xs text-muted-foreground">
                      {speciality.description}
                    </p>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default SpecialitySection;
