import { useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const mock = [
  { id: "a1", doctor: "Dr. Richard James", date: "2025-10-27", time: "10:00", status: "pending" },
  { id: "a2", doctor: "Dr. Emily Clark", date: "2025-10-29", time: "14:30", status: "confirmed" },
];

const Dashboard = () => {
  useEffect(() => { document.title = "My Appointments • DocBook"; }, []);

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-10 space-y-8">
        <h1 className="text-3xl font-bold text-foreground">My Appointments</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {mock.map((a) => (
            <Card key={a.id} className="p-5 flex items-center justify-between">
              <div>
                <p className="font-semibold text-foreground">{a.doctor}</p>
                <p className="text-sm text-muted-foreground">{a.date} • {a.time}</p>
              </div>
              <Badge variant={a.status === 'confirmed' ? 'default' : 'secondary'}>
                {a.status}
              </Badge>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
