import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

const Banner = () => {
  const navigate = useNavigate();

  return (
    <section className="py-20 bg-gradient-to-r from-primary to-primary-hover">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto text-center space-y-6">
          <h2 className="text-3xl md:text-4xl font-bold text-primary-foreground">
            Book Your Appointment Online
          </h2>
          <p className="text-lg text-primary-foreground/90">
            Create your account and get access to 500+ verified doctors across all specialities.
            Schedule appointments at your convenience.
          </p>
          <Button
            size="lg"
            variant="secondary"
            className="group shadow-lg"
            onClick={() => navigate("/login")}
          >
            Create Account
            <ArrowRight className="ml-2 h-5 w-5 transition-all duration-300 group-hover:translate-x-2 group-hover:scale-110" />
          </Button>
        </div>
      </div>
    </section>
  );
};

export default Banner;
