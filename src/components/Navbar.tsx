import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Menu, X, User, LogOut, LayoutDashboard, Moon, Sun } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useTheme } from "@/context/ThemeContext";
import Cart from "./Cart";

interface NavbarProps {
  user?: any;
}

const Navbar = ({ user }: NavbarProps) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();
  const { isDarkMode, toggleTheme } = useTheme();

  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      toast({
        variant: "destructive",
        title: "Error signing out",
        description: error.message,
      });
    } else {
      toast({
        title: "Signed out successfully",
      });
      navigate("/"); // Redirect to landing page
    }
  };

  const navLinks = [
    { name: "Home", path: "/home" },
    { name: "All Doctors", path: "/doctors" },
    { name: "Hospitals", path: "/hospitals" },
    { name: "Medicines", path: "/medicines" },
    { name: "About", path: "/about" },
    { name: "Contact", path: "/contact" },
  ];

  return (
    <nav className="sticky top-0 z-50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b border-border">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/home" className="flex items-center space-x-2 group">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-primary-hover flex items-center justify-center transition-all duration-300 group-hover:scale-110 group-hover:rotate-12 group-hover:shadow-[0_0_16px_rgba(95,111,255,0.6)]">
              <span className="text-primary-foreground font-bold text-lg">D</span>
            </div>
            <span className="text-xl font-bold text-foreground">DocBook</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className="text-foreground hover:text-primary transition-colors"
              >
                {link.name}
              </Link>
            ))}
          </div>

          {/* Auth Section */}
          <div className="hidden md:flex items-center space-x-4">
            {/* Theme Toggle */}
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleTheme}
              className="transition-all duration-300 hover:scale-110 hover:rotate-12"
            >
              {isDarkMode ? (
                <Sun className="h-5 w-5 transition-all duration-300" />
              ) : (
                <Moon className="h-5 w-5 transition-all duration-300" />
              )}
            </Button>

            {/* Cart */}
            <Cart />

            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="icon" className="rounded-full transition-all duration-300 hover:scale-110 hover:rotate-12 hover:shadow-[0_0_12px_rgba(95,111,255,0.5)]">
                    {user.user_metadata?.avatar_url ? (
                      <img
                        src={user.user_metadata.avatar_url}
                        alt="Profile"
                        className="w-full h-full rounded-full object-cover"
                      />
                    ) : (
                      <User className="h-5 w-5 transition-all duration-300" />
                    )}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <div className="px-2 py-1.5">
                    <p className="text-sm font-medium">{user.email}</p>
                  </div>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => navigate("/profile")} className="group">
                    <User className="mr-2 h-4 w-4 transition-all duration-300 group-hover:scale-125 group-hover:rotate-12 group-hover:text-[#5f6fff]" />
                    My Profile
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => navigate("/my-appointments")} className="group">
                    <LayoutDashboard className="mr-2 h-4 w-4 transition-all duration-300 group-hover:scale-125 group-hover:rotate-12 group-hover:text-[#5f6fff]" />
                    My Appointments
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={handleLogout} className="group">
                    <LogOut className="mr-2 h-4 w-4 transition-all duration-300 group-hover:scale-125 group-hover:-rotate-12 group-hover:text-red-500" />
                    Sign out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Button onClick={() => navigate("/login")} className="group">
                Sign In
              </Button>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden transition-all duration-300 hover:scale-110 hover:rotate-12 hover:text-primary"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X className="transition-all duration-300" /> : <Menu className="transition-all duration-300" />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden py-4 space-y-4">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className="block py-2 text-foreground hover:text-primary"
                onClick={() => setIsMenuOpen(false)}
              >
                {link.name}
              </Link>
            ))}
            {user ? (
              <>
                <Button
                  variant="outline"
                  className="w-full group"
                  onClick={() => {
                    navigate("/profile");
                    setIsMenuOpen(false);
                  }}
                >
                  <User className="mr-2 h-4 w-4 transition-all duration-300 group-hover:scale-125 group-hover:rotate-12 group-hover:text-[#5f6fff]" />
                  My Profile
                </Button>
                <Button
                  variant="outline"
                  className="w-full group"
                  onClick={() => {
                    navigate("/my-appointments");
                    setIsMenuOpen(false);
                  }}
                >
                  <LayoutDashboard className="mr-2 h-4 w-4 transition-all duration-300 group-hover:scale-125 group-hover:rotate-12 group-hover:text-[#5f6fff]" />
                  My Appointments
                </Button>
                <Button
                  variant="outline"
                  className="w-full group"
                  onClick={handleLogout}
                >
                  <LogOut className="mr-2 h-4 w-4 transition-all duration-300 group-hover:scale-125 group-hover:-rotate-12 group-hover:text-red-500" />
                  Sign out
                </Button>
              </>
            ) : (
              <Button
                className="w-full"
                onClick={() => {
                  navigate("/login");
                  setIsMenuOpen(false);
                }}
              >
                Sign In
              </Button>
            )}
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
