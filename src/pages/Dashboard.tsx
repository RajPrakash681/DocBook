import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { ArrowRight, Heart, Calendar, Shield, Sparkles } from "lucide-react";

const Dashboard = () => {
  const navigate = useNavigate();

  useEffect(() => {
    document.title = "Welcome • DocBook";

    // Check if user is already logged in
    const checkUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        // If user is logged in, redirect to home page
        navigate("/home");
      }
    };
    checkUser();
  }, [navigate]); 

  const handleGetStarted = () => {
    navigate("/login");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-purple-50 px-4 relative overflow-hidden">
      {/* Animated 3D Orbs Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Blue Orb - Top Left */}
        <div 
          className="absolute top-20 left-10 w-96 h-96 rounded-full blur-3xl opacity-20 animate-float"
          style={{
            background: "radial-gradient(circle, rgba(95, 111, 255, 0.8) 0%, rgba(95, 111, 255, 0.2) 70%)",
          }}
        />
        
        {/* Purple Orb - Bottom Right */}
        <div 
          className="absolute bottom-10 right-20 w-[500px] h-[500px] rounded-full blur-3xl opacity-25 animate-float-slow"
          style={{
            background: "radial-gradient(circle, rgba(168, 85, 247, 0.8) 0%, rgba(168, 85, 247, 0.2) 70%)",
            animationDelay: "2s",
          }}
        />
        
        {/* Pink Orb - Center Top */}
        <div 
          className="absolute top-40 right-1/3 w-80 h-80 rounded-full blur-3xl opacity-20 animate-float-medium animate-pulse-glow"
          style={{
            background: "radial-gradient(circle, rgba(236, 72, 153, 0.8) 0%, rgba(236, 72, 153, 0.2) 70%)",
            animationDelay: "4s",
          }}
        />
      </div>

      {/* Main content */}
      <div className="relative z-10 max-w-4xl mx-auto text-center space-y-8 animate-fade-in">
        {/* Logo */}
        <div className="flex justify-center mb-6">
          <div className="w-20 h-20 rounded-full bg-gradient-to-br from-primary to-primary-hover flex items-center justify-center shadow-2xl transform hover:scale-110 transition-transform duration-300">
            <span className="text-primary-foreground font-bold text-3xl">D</span>
          </div>
        </div>

        {/* Main heading */}
        <div className="space-y-4">
          <h1 className="text-5xl md:text-7xl font-bold text-foreground leading-tight tracking-tight">
            Welcome to <span className="bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">DocBook</span>
          </h1>
          <p className="text-xl md:text-2xl text-muted-foreground max-w-2xl mx-auto font-light">
            Book appointments with trusted doctors in just a few clicks
          </p>
        </div>

        {/* Features */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-3xl mx-auto pt-8">
          <div className="flex flex-col items-center space-y-2 p-4 rounded-lg bg-white/50 backdrop-blur-sm hover:bg-white/80 transition-all duration-300 group">
            <Heart className="w-8 h-8 text-primary transition-all duration-300 ease-out group-hover:scale-125 group-hover:rotate-12 group-hover:text-[#5f6fff] group-hover:drop-shadow-[0_0_12px_rgba(95,111,255,0.6)] group-hover:-translate-y-2" />
            <h3 className="font-semibold text-foreground">Trusted Doctors</h3>
            <p className="text-sm text-muted-foreground">Verified healthcare professionals</p>
          </div>
          <div className="flex flex-col items-center space-y-2 p-4 rounded-lg bg-white/50 backdrop-blur-sm hover:bg-white/80 transition-all duration-300 group">
            <Calendar className="w-8 h-8 text-primary transition-all duration-300 ease-out group-hover:scale-125 group-hover:rotate-12 group-hover:text-[#5f6fff] group-hover:drop-shadow-[0_0_12px_rgba(95,111,255,0.6)] group-hover:-translate-y-2" />
            <h3 className="font-semibold text-foreground">Easy Booking</h3>
            <p className="text-sm text-muted-foreground">Schedule in seconds</p>
          </div>
          <div className="flex flex-col items-center space-y-2 p-4 rounded-lg bg-white/50 backdrop-blur-sm hover:bg-white/80 transition-all duration-300 group">
            <Shield className="w-8 h-8 text-primary transition-all duration-300 ease-out group-hover:scale-125 group-hover:rotate-12 group-hover:text-[#5f6fff] group-hover:drop-shadow-[0_0_12px_rgba(95,111,255,0.6)] group-hover:-translate-y-2" />
            <h3 className="font-semibold text-foreground">Secure & Private</h3>
            <p className="text-sm text-muted-foreground">Your data is protected</p>
          </div>
        </div>

        {/* CTA Button */}
        <div className="pt-8">
          <Button
            size="lg"
            onClick={handleGetStarted}
            className="text-lg px-12 py-6 rounded-full shadow-2xl bg-gradient-to-r from-primary to-primary-hover hover:shadow-primary/50 hover:scale-105 transform transition-all duration-300 group"
          >
            Get Started
            <ArrowRight className="ml-2 h-5 w-5 transition-transform duration-300 group-hover:translate-x-2 group-hover:scale-110" />
          </Button>
          <p className="mt-4 text-sm text-muted-foreground">
            Already have an account?{" "}
            <button
              onClick={() => navigate("/login")}
              className="text-primary hover:underline font-medium"
            >
              Sign in here
            </button>
          </p>
        </div>

        {/* Trust indicators */}
        <div className="pt-12 flex items-center justify-center space-x-2 text-sm text-muted-foreground">
          <Sparkles className="w-4 h-4 text-primary transition-all duration-300 hover:scale-125 hover:rotate-180 hover:text-[#5f6fff] hover:drop-shadow-[0_0_8px_rgba(95,111,255,0.6)]" />
          <span>Join thousands of satisfied patients</span>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
