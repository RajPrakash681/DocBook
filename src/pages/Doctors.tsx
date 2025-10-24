import { useMemo, useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { Search, Filter } from "lucide-react";
import Chatbot from "@/components/Chatbot";

interface Doctor {
  id: string;
  name: string;
  speciality: string;
  degree: string;
  experience: number;
  fees: number;
  image: string;
  available: boolean;
}

const ALL_SPECIALITIES = [
  "General physician",
  "Gynecologist",
  "Dermatologist",
  "Pediatricians",
  "Neurologist",
  "Gastroenterologist",
];

// Placeholder list (will be replaced with backend data later)
const DOCTORS: Doctor[] = [
  {
    id: "1",
    name: "Dr. Richard James",
    speciality: "General physician",
    degree: "MBBS, MD",
    experience: 15,
    fees: 50,
    image: "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=600",
    available: true,
  },
  {
    id: "2",
    name: "Dr. Emily Clark",
    speciality: "Gynecologist",
    degree: "MBBS, MS (OBG)",
    experience: 12,
    fees: 65,
    image: "https://images.unsplash.com/photo-1594824476967-48c8b964273f?w=600",
    available: true,
  },
  {
    id: "3",
    name: "Dr. Sarah Patel",
    speciality: "Dermatologist",
    degree: "MBBS, DDVL",
    experience: 10,
    fees: 55,
    image: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=600",
    available: false,
  },
  {
    id: "4",
    name: "Dr. Michael Chen",
    speciality: "Pediatricians",
    degree: "MBBS, DCH",
    experience: 18,
    fees: 60,
    image: "https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=600",
    available: true,
  },
  {
    id: "5",
    name: "Dr. Ana Gomez",
    speciality: "Neurologist",
    degree: "MBBS, DM (Neuro)",
    experience: 14,
    fees: 80,
    image: "https://images.unsplash.com/photo-1527613426441-4da17471b66d?w=600",
    available: true,
  },
  {
    id: "6",
    name: "Dr. Omar Faruk",
    speciality: "Gastroenterologist",
    degree: "MBBS, DM (Gastro)",
    experience: 11,
    fees: 70,
    image: "https://images.unsplash.com/photo-1551836022-d5d88e9218df?w=600",
    available: true,
  },
];

const Doctors = () => {
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const [selected, setSelected] = useState<string[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const p = params.get("speciality");
    if (p && ALL_SPECIALITIES.includes(p)) {
      setSelected([p]);
    }
    // Fake loading state for skeletons
    const t = setTimeout(() => setLoading(false), 400);
    return () => clearTimeout(t);
  }, [params]);

  const filtered = useMemo(() => {
    const bySpec = selected.length
      ? DOCTORS.filter((d) => selected.includes(d.speciality))
      : DOCTORS;
    const bySearch = search
      ? bySpec.filter((d) =>
          `${d.name} ${d.speciality}`.toLowerCase().includes(search.toLowerCase())
        )
      : bySpec;
    return bySearch;
  }, [selected, search]);

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-10">
        <div className="mb-8 flex items-center justify-between">
          <h1 className="text-3xl font-bold text-foreground">All Doctors</h1>
          <div className="relative w-full max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              className="pl-9"
              placeholder="Search doctors or speciality"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
          {/* Filters */}
          <aside className="md:col-span-3">
            <Card className="p-4">
              <div className="flex items-center gap-2 mb-4">
                <Filter className="h-4 w-4 text-primary" />
                <h2 className="font-semibold">Filter by Speciality</h2>
              </div>
              <div className="space-y-3">
                {ALL_SPECIALITIES.map((sp) => (
                  <label key={sp} className="flex items-center gap-2 cursor-pointer">
                    <Checkbox
                      checked={selected.includes(sp)}
                      onCheckedChange={(v) =>
                        setSelected((prev) =>
                          v ? [...prev, sp] : prev.filter((x) => x !== sp)
                        )
                      }
                    />
                    <span className="text-sm text-foreground">{sp}</span>
                  </label>
                ))}
              </div>
              {selected.length > 0 && (
                <Button
                  variant="ghost"
                  className="mt-4"
                  onClick={() => setSelected([])}
                >
                  Clear filters
                </Button>
              )}
            </Card>
          </aside>

          {/* Doctors grid */}
          <section className="md:col-span-9">
            {loading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {Array.from({ length: 6 }).map((_, i) => (
                  <Card key={i} className="overflow-hidden">
                    <Skeleton className="h-48 w-full" />
                    <div className="p-4 space-y-3">
                      <Skeleton className="h-5 w-2/3" />
                      <Skeleton className="h-4 w-1/3" />
                      <Skeleton className="h-8 w-24" />
                    </div>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {filtered.map((d) => (
                  <Card
                    key={d.id}
                    className="group cursor-pointer overflow-hidden transition-all hover:shadow-lg hover:-translate-y-1"
                    onClick={() => navigate(`/appointment/${d.id}`)}
                  >
                    <div className="relative">
                      <img src={d.image} alt={d.name} className="w-full h-56 object-cover" />
                      {d.available ? (
                        <Badge className="absolute top-3 right-3 bg-success text-success-foreground">Available</Badge>
                      ) : (
                        <Badge className="absolute top-3 right-3" variant="secondary">Not Available</Badge>
                      )}
                    </div>
                    <div className="p-5 space-y-2">
                      <h3 className="font-semibold text-foreground">{d.name}</h3>
                      <p className="text-sm text-muted-foreground">{d.speciality}</p>
                      <div className="flex items-center justify-between pt-2">
                        <span className="text-xs text-muted-foreground">{d.experience} yrs • ${d.fees}</span>
                        <Button size="sm" variant="outline">Book</Button>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            )}
          </section>
        </div>
      </div>
      <Chatbot />
    </div>
  );
};

export default Doctors;
