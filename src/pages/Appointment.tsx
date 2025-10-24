import { useMemo, useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

// Reuse same placeholder data as Doctors
const DOCTORS = [
  {
    id: "1",
    name: "Dr. Richard James",
    speciality: "General physician",
    degree: "MBBS, MD",
    experience: 15,
    fees: 50,
    about: "Experienced general physician focused on preventive healthcare and chronic disease management.",
    image: "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=800",
    available: true,
  },
  {
    id: "2",
    name: "Dr. Emily Clark",
    speciality: "Gynecologist",
    degree: "MBBS, MS (OBG)",
    experience: 12,
    fees: 65,
    about: "Compassionate gynecologist specializing in comprehensive women's health.",
    image: "https://images.unsplash.com/photo-1594824476967-48c8b964273f?w=800",
    available: true,
  },
  {
    id: "3",
    name: "Dr. Sarah Patel",
    speciality: "Dermatologist",
    degree: "MBBS, DDVL",
    experience: 10,
    fees: 55,
    about: "Dermatology expert with focus on acne, pigmentation and hair disorders.",
    image: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=800",
    available: false,
  },
];

function getNext7Days() {
  const days: { label: string; date: string }[] = [];
  const formatter = new Intl.DateTimeFormat(undefined, {
    weekday: "short",
    month: "short",
    day: "numeric",
  });
  const today = new Date();
  for (let i = 0; i < 7; i++) {
    const d = new Date(today);
    d.setDate(today.getDate() + i);
    days.push({ label: formatter.format(d), date: d.toISOString().slice(0, 10) });
  }
  return days;
}

function generateSlots() {
  const slots: string[] = [];
  for (let h = 9; h <= 17; h++) {
    for (const m of [0, 30]) {
      const hh = String(h).padStart(2, "0");
      const mm = String(m).padStart(2, "0");
      slots.push(`${hh}:${mm}`);
    }
  }
  return slots;
}

const Appointment = () => {
  const { doctorId } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const doctor = useMemo(() => DOCTORS.find((d) => d.id === doctorId), [doctorId]);
  const [selectedDate, setSelectedDate] = useState(getNext7Days()[0].date);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);

  useEffect(() => {
    document.title = `Book Appointment • ${doctor?.name ?? "Doctor"}`;
  }, [doctor]);

  const slots = useMemo(() => generateSlots(), []);

  const isPast = (date: string, time: string) => {
    const [h, m] = time.split(":").map(Number);
    const d = new Date(date);
    d.setHours(h, m, 0, 0);
    return d < new Date();
  };

  const handleBook = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      toast({ title: "Please sign in", description: "Login to book an appointment." });
      navigate("/login");
      return;
    }

    if (!doctor || !selectedTime) {
      toast({ variant: "destructive", title: "Select a time", description: "Choose a date and a time slot" });
      return;
    }

    // Placeholder success (backend insert will be wired when doctors are stored)
    toast({ title: "Appointment reserved", description: `${doctor.name} • ${selectedDate} ${selectedTime}` });
    navigate("/dashboard");
  };

  if (!doctor) {
    return (
      <div className="min-h-screen flex items-center justify-center"><p className="text-muted-foreground">Doctor not found.</p></div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-10 grid lg:grid-cols-3 gap-8">
        {/* Doctor card */}
        <Card className="p-0 overflow-hidden lg:col-span-1">
          <img src={doctor.image} alt={doctor.name} className="w-full h-56 object-cover" />
          <div className="p-5 space-y-2">
            <h1 className="text-2xl font-semibold text-foreground">{doctor.name}</h1>
            <p className="text-sm text-muted-foreground">{doctor.degree} • {doctor.experience} yrs</p>
            <p className="text-sm text-muted-foreground">{doctor.speciality}</p>
            <p className="text-sm text-muted-foreground">{doctor.about}</p>
            <div className="pt-2 flex items-center gap-3">
              {doctor.available ? (
                <Badge className="bg-success text-success-foreground">Available</Badge>
              ) : (
                <Badge variant="secondary">Not Available</Badge>
              )}
              <span className="text-sm">Fee: ${doctor.fees}</span>
            </div>
          </div>
        </Card>

        {/* Booking UI */}
        <Card className="p-6 lg:col-span-2">
          <h2 className="text-xl font-semibold mb-4">Choose a slot</h2>
          <div className="space-y-6">
            {/* Dates */}
            <div className="flex gap-3 overflow-x-auto pb-1">
              {getNext7Days().map((d) => (
                <button
                  key={d.date}
                  className={`px-4 py-2 rounded-md border transition-colors ${
                    selectedDate === d.date ? "bg-primary text-primary-foreground" : "hover:bg-accent"
                  }`}
                  onClick={() => setSelectedDate(d.date)}
                >
                  {d.label}
                </button>
              ))}
            </div>

            {/* Time slots */}
            <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-2">
              {slots.map((t) => {
                const disabled = isPast(selectedDate, t) || !doctor.available;
                const active = selectedTime === t;
                return (
                  <button
                    key={t}
                    disabled={disabled}
                    onClick={() => setSelectedTime(t)}
                    className={`px-3 py-2 rounded-md border text-sm transition-colors disabled:opacity-40 disabled:cursor-not-allowed ${
                      active ? "bg-primary text-primary-foreground" : "hover:bg-accent"
                    }`}
                  >
                    {t}
                  </button>
                );
              })}
            </div>

            <div className="pt-2">
              <Button size="lg" onClick={handleBook}>Book Appointment</Button>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Appointment;
