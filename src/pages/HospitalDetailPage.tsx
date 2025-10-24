import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { hospitals } from "@/data/hospitalData";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Chatbot from "@/components/Chatbot";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  MapPin,
  Phone,
  Mail,
  Globe,
  Bed,
  Users,
  Clock,
  Calendar,
  Star,
  CheckCircle2,
  Building2,
  Stethoscope,
  Activity,
  Heart,
  Copy,
  ChevronRight,
  Ambulance,
  ParkingCircle,
  Shield,
  ArrowRight,
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

// Dummy doctors data for the hospital
const getDoctorsForHospital = (hospitalId: number) => {
  const doctorNames = [
    { name: "Dr. Rajesh Kumar", speciality: "Cardiologist", rating: 4.9, image: "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=200" },
    { name: "Dr. Priya Sharma", speciality: "Neurologist", rating: 4.8, image: "https://images.unsplash.com/photo-1594824476967-48c8b964273f?w=200" },
    { name: "Dr. Amit Patel", speciality: "Orthopedic Surgeon", rating: 4.7, image: "https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=200" },
    { name: "Dr. Sneha Reddy", speciality: "Pediatrician", rating: 4.9, image: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=200" },
    { name: "Dr. Vikram Singh", speciality: "General Surgeon", rating: 4.6, image: "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=200" },
    { name: "Dr. Anjali Menon", speciality: "Gynecologist", rating: 4.8, image: "https://images.unsplash.com/photo-1594824476967-48c8b964273f?w=200" },
    { name: "Dr. Karthik Rao", speciality: "Oncologist", rating: 4.7, image: "https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=200" },
    { name: "Dr. Meera Iyer", speciality: "Dermatologist", rating: 4.8, image: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=200" },
  ];
  
  return doctorNames.map((doctor, index) => ({
    ...doctor,
    id: `${hospitalId}-${index}`,
  }));
};

// Dummy reviews
const reviews = [
  {
    id: 1,
    patientName: "Ramesh Kumar",
    rating: 5,
    comment: "Excellent hospital with world-class facilities and caring staff. My surgery went smoothly and recovery was faster than expected.",
    date: "2 weeks ago",
  },
  {
    id: 2,
    patientName: "Priya Nair",
    rating: 4,
    comment: "Good hospital with experienced doctors. Wait time was a bit long but overall satisfied with the treatment and care.",
    date: "1 month ago",
  },
  {
    id: 3,
    patientName: "Suresh Reddy",
    rating: 5,
    comment: "Outstanding medical care! The doctors are highly skilled and the nursing staff is very attentive. Highly recommended.",
    date: "1 month ago",
  },
  {
    id: 4,
    patientName: "Lakshmi Devi",
    rating: 5,
    comment: "Very professional and efficient. The emergency department handled my case quickly and the doctors were excellent.",
    date: "2 months ago",
  },
  {
    id: 5,
    patientName: "Arun Krishnan",
    rating: 4,
    comment: "Great hospital with modern equipment. The staff is helpful and doctors take time to explain everything clearly.",
    date: "3 months ago",
  },
];

const HospitalDetailPage = () => {
  const { hospitalId } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [user, setUser] = useState<any>(null);

  const hospital = hospitals.find((h) => h.id === Number(hospitalId));
  const doctors = hospital ? getDoctorsForHospital(hospital.id) : [];

  useEffect(() => {
    if (hospital) {
      document.title = `${hospital.name} • DocBook`;
    }

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
  }, [hospital]);

  if (!hospital) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar user={user} />
        <div className="flex-1 flex items-center justify-center">
          <Card className="p-12 text-center max-w-md">
            <Building2 className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-foreground mb-2">
              Hospital Not Found
            </h2>
            <p className="text-muted-foreground mb-6">
              The hospital you're looking for doesn't exist.
            </p>
            <Button onClick={() => navigate("/hospitals")}>
              Browse All Hospitals
            </Button>
          </Card>
        </div>
        <Footer />
      </div>
    );
  }

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Copied!",
      description: `${label} copied to clipboard`,
    });
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, index) => (
      <Star
        key={index}
        className={`w-5 h-5 ${
          index < Math.floor(rating)
            ? "fill-warning text-warning"
            : "text-gray-300"
        }`}
      />
    ));
  };

  const serviceIcons: Record<string, any> = {
    Emergency: Activity,
    ICU: Heart,
    Surgery: Stethoscope,
    Cardiology: Heart,
    Neurology: Activity,
    Orthopedics: Activity,
    Pediatrics: Users,
    Oncology: Activity,
    Gastroenterology: Activity,
    Nephrology: Activity,
    Urology: Activity,
    Gynecology: Users,
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar user={user} />

      <main className="flex-1">
        {/* Banner */}
        <div className="relative h-96 overflow-hidden">
          <img
            src={hospital.bannerImage}
            alt={hospital.name}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />
          
          {/* Hospital Name Overlay */}
          <div className="absolute bottom-0 left-0 right-0 p-8">
            <div className="container mx-auto">
              {/* Breadcrumb */}
              <div className="flex items-center gap-2 text-white/80 text-sm mb-4">
                <Link to="/home" className="hover:text-white transition-colors">
                  Home
                </Link>
                <ChevronRight className="w-4 h-4" />
                <Link
                  to="/hospitals"
                  className="hover:text-white transition-colors"
                >
                  Hospitals
                </Link>
                <ChevronRight className="w-4 h-4" />
                <span className="text-white">{hospital.name}</span>
              </div>

              <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
                {hospital.name}
              </h1>
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2 text-white">
                  <MapPin className="w-5 h-5" />
                  <span className="text-lg">
                    {hospital.city}, {hospital.state}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Rating Badge */}
          <div className="absolute top-8 right-8">
            <Card className="p-4 bg-white/95 backdrop-blur-sm">
              <div className="flex items-center gap-2 mb-2">
                {renderStars(hospital.rating)}
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-foreground">
                  {hospital.rating}
                </div>
                <div className="text-sm text-muted-foreground">
                  {hospital.reviews} reviews
                </div>
              </div>
            </Card>
          </div>
        </div>

        {/* Quick Info Cards */}
        <div className="bg-muted/30 border-b">
          <div className="container mx-auto px-4 py-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <Card className="p-4 text-center group hover:shadow-lg transition-all">
                <Bed className="w-8 h-8 text-primary mx-auto mb-2 transition-all duration-300 group-hover:scale-125 group-hover:rotate-12" />
                <div className="text-2xl font-bold text-foreground">
                  {hospital.beds}
                </div>
                <div className="text-sm text-muted-foreground">Beds</div>
              </Card>
              <Card className="p-4 text-center group hover:shadow-lg transition-all">
                <Users className="w-8 h-8 text-primary mx-auto mb-2 transition-all duration-300 group-hover:scale-125 group-hover:rotate-12" />
                <div className="text-2xl font-bold text-foreground">
                  {hospital.doctors}
                </div>
                <div className="text-sm text-muted-foreground">Doctors</div>
              </Card>
              <Card className="p-4 text-center group hover:shadow-lg transition-all">
                <Calendar className="w-8 h-8 text-primary mx-auto mb-2 transition-all duration-300 group-hover:scale-125 group-hover:rotate-12" />
                <div className="text-2xl font-bold text-foreground">
                  {hospital.established}
                </div>
                <div className="text-sm text-muted-foreground">Established</div>
              </Card>
              <Card className="p-4 text-center group hover:shadow-lg transition-all">
                <Clock className="w-8 h-8 text-primary mx-auto mb-2 transition-all duration-300 group-hover:scale-125 group-hover:rotate-12" />
                <div className="text-2xl font-bold text-foreground">
                  {hospital.avgWaitTime}
                </div>
                <div className="text-sm text-muted-foreground">Avg Wait Time</div>
              </Card>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="container mx-auto px-4 py-12">
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Left Column - Main Content */}
            <div className="lg:col-span-2 space-y-8">
              {/* About */}
              <Card className="p-6">
                <h2 className="text-2xl font-bold text-foreground mb-4">
                  About {hospital.name}
                </h2>
                <p className="text-muted-foreground leading-relaxed">
                  {hospital.description}
                </p>
              </Card>

              {/* Services */}
              <Card className="p-6">
                <h2 className="text-2xl font-bold text-foreground mb-6">
                  Services Offered
                </h2>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {hospital.services.map((service) => {
                    const Icon = serviceIcons[service] || Activity;
                    return (
                      <Card
                        key={service}
                        className="p-4 text-center group hover:shadow-lg hover:border-primary transition-all duration-300"
                      >
                        <Icon className="w-8 h-8 text-primary mx-auto mb-2 transition-all duration-300 group-hover:scale-125 group-hover:rotate-12" />
                        <div className="text-sm font-medium text-foreground">
                          {service}
                        </div>
                      </Card>
                    );
                  })}
                </div>
              </Card>

              {/* Specializations */}
              <Card className="p-6">
                <h2 className="text-2xl font-bold text-foreground mb-4">
                  Specializations
                </h2>
                <div className="flex flex-wrap gap-2">
                  {hospital.specializations.map((spec) => (
                    <Badge
                      key={spec}
                      variant="secondary"
                      className="px-4 py-2 text-sm"
                    >
                      {spec}
                    </Badge>
                  ))}
                </div>
              </Card>

              {/* Facilities */}
              <Card className="p-6">
                <h2 className="text-2xl font-bold text-foreground mb-6">
                  Facilities
                </h2>
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="flex items-center gap-3">
                    <CheckCircle2 className={`w-5 h-5 ${hospital.parkingAvailable ? "text-success" : "text-muted-foreground"}`} />
                    <div className="flex items-center gap-2">
                      <ParkingCircle className="w-5 h-5 text-primary" />
                      <span className={hospital.parkingAvailable ? "text-foreground" : "text-muted-foreground"}>
                        Parking Available
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <CheckCircle2 className={`w-5 h-5 ${hospital.ambulanceService ? "text-success" : "text-muted-foreground"}`} />
                    <div className="flex items-center gap-2">
                      <Ambulance className="w-5 h-5 text-primary" />
                      <span className={hospital.ambulanceService ? "text-foreground" : "text-muted-foreground"}>
                        24/7 Ambulance Service
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <CheckCircle2 className={`w-5 h-5 ${hospital.acceptsInsurance ? "text-success" : "text-muted-foreground"}`} />
                    <div className="flex items-center gap-2">
                      <Shield className="w-5 h-5 text-primary" />
                      <span className={hospital.acceptsInsurance ? "text-foreground" : "text-muted-foreground"}>
                        Insurance Accepted
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <CheckCircle2 className="text-success w-5 h-5" />
                    <div className="flex items-center gap-2">
                      <Clock className="w-5 h-5 text-primary" />
                      <span className="text-foreground">{hospital.availability}</span>
                    </div>
                  </div>
                </div>
              </Card>

              {/* Contact Information */}
              <Card className="p-6">
                <h2 className="text-2xl font-bold text-foreground mb-6">
                  Contact Information
                </h2>
                <div className="space-y-4">
                  <div className="flex items-start gap-4 group">
                    <MapPin className="w-5 h-5 text-primary mt-1 flex-shrink-0 transition-all duration-300 group-hover:scale-125" />
                    <div className="flex-1">
                      <div className="font-medium text-foreground">Address</div>
                      <div className="text-muted-foreground">{hospital.address}</div>
                    </div>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => copyToClipboard(hospital.address, "Address")}
                    >
                      <Copy className="w-4 h-4" />
                    </Button>
                  </div>
                  <div className="flex items-center gap-4 group">
                    <Phone className="w-5 h-5 text-primary flex-shrink-0 transition-all duration-300 group-hover:scale-125 group-hover:rotate-12" />
                    <div className="flex-1">
                      <div className="font-medium text-foreground">Phone</div>
                      <div className="text-muted-foreground">{hospital.phone}</div>
                    </div>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => copyToClipboard(hospital.phone, "Phone number")}
                    >
                      <Copy className="w-4 h-4" />
                    </Button>
                  </div>
                  <div className="flex items-center gap-4 group">
                    <Mail className="w-5 h-5 text-primary flex-shrink-0 transition-all duration-300 group-hover:scale-125 group-hover:rotate-12" />
                    <div className="flex-1">
                      <div className="font-medium text-foreground">Email</div>
                      <div className="text-muted-foreground">{hospital.email}</div>
                    </div>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => copyToClipboard(hospital.email, "Email")}
                    >
                      <Copy className="w-4 h-4" />
                    </Button>
                  </div>
                  <div className="flex items-center gap-4 group">
                    <Globe className="w-5 h-5 text-primary flex-shrink-0 transition-all duration-300 group-hover:scale-125 group-hover:rotate-12" />
                    <div className="flex-1">
                      <div className="font-medium text-foreground">Website</div>
                      <a
                        href={`https://${hospital.website}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-primary hover:underline"
                      >
                        {hospital.website}
                      </a>
                    </div>
                  </div>
                </div>
              </Card>
            </div>

            {/* Right Column - Sidebar */}
            <div className="space-y-6">
              {/* CTA Card */}
              <Card className="p-6 sticky top-24 space-y-4">
                <Button
                  size="lg"
                  className="w-full text-lg py-6 group"
                  onClick={() => navigate("/doctors")}
                >
                  Book Appointment
                  <ArrowRight className="ml-2 h-5 w-5 transition-all duration-300 group-hover:translate-x-2" />
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  className="w-full group"
                  onClick={() => window.open(`tel:${hospital.phone}`)}
                >
                  <Phone className="mr-2 h-5 w-5 transition-all duration-300 group-hover:scale-125 group-hover:rotate-12" />
                  Call Hospital
                </Button>
                <div className="pt-4 border-t">
                  <div className="text-sm text-muted-foreground mb-2">
                    Availability
                  </div>
                  <Badge variant="default" className="w-full justify-center py-2">
                    {hospital.availability}
                  </Badge>
                </div>
              </Card>

              {/* Map Placeholder */}
              <Card className="p-6">
                <h3 className="font-semibold text-foreground mb-4">Location</h3>
                <div className="aspect-video bg-muted rounded-lg flex items-center justify-center">
                  <div className="text-center text-muted-foreground">
                    <MapPin className="w-12 h-12 mx-auto mb-2" />
                    <p className="text-sm">Map View</p>
                  </div>
                </div>
              </Card>
            </div>
          </div>

          {/* Doctors Section */}
          <div className="mt-12">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-3xl font-bold text-foreground">
                Doctors at this Hospital
              </h2>
              <Button
                variant="outline"
                onClick={() => navigate("/doctors")}
                className="group"
              >
                View All
                <ArrowRight className="ml-2 h-4 w-4 transition-all duration-300 group-hover:translate-x-1" />
              </Button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {doctors.slice(0, 8).map((doctor) => (
                <Card
                  key={doctor.id}
                  className="p-5 text-center group hover:shadow-lg hover:-translate-y-1 transition-all duration-300 cursor-pointer"
                  onClick={() => navigate("/doctors")}
                >
                  <img
                    src={doctor.image}
                    alt={doctor.name}
                    className="w-24 h-24 rounded-full mx-auto mb-4 object-cover transition-transform duration-300 group-hover:scale-110"
                  />
                  <h3 className="font-semibold text-foreground mb-1">
                    {doctor.name}
                  </h3>
                  <p className="text-sm text-muted-foreground mb-3">
                    {doctor.speciality}
                  </p>
                  <div className="flex items-center justify-center gap-1 mb-3">
                    <Star className="w-4 h-4 fill-warning text-warning" />
                    <span className="text-sm font-medium">{doctor.rating}</span>
                  </div>
                  <Button size="sm" variant="outline" className="w-full">
                    Book Now
                  </Button>
                </Card>
              ))}
            </div>
          </div>

          {/* Reviews Section */}
          <div className="mt-12">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-3xl font-bold text-foreground">
                Patient Reviews
              </h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {reviews.map((review) => (
                <Card key={review.id} className="p-6">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <div className="font-semibold text-foreground">
                        {review.patientName}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {review.date}
                      </div>
                    </div>
                    <div className="flex items-center gap-1">
                      {renderStars(review.rating)}
                    </div>
                  </div>
                  <p className="text-muted-foreground text-sm leading-relaxed">
                    {review.comment}
                  </p>
                </Card>
              ))}
            </div>
            <div className="text-center mt-8">
              <Button variant="outline" size="lg">
                View All Reviews
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </div>
          </div>
        </div>
      </main>

      <Footer />
      <Chatbot />
    </div>
  );
};

export default HospitalDetailPage;
