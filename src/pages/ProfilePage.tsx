import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Chatbot from "@/components/Chatbot";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { Loader2, User, Heart, Phone, FileText, Save, AlertCircle } from "lucide-react";

interface ProfileData {
  full_name: string;
  age: number | null;
  gender: string;
  blood_group: string;
  weight: number | null;
  height: number | null;
  emergency_contact_name: string;
  emergency_contact_phone: string;
  allergies: string[];
  chronic_conditions: string[];
  current_medications: string[];
}

const ProfilePage = () => {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const [profileData, setProfileData] = useState<ProfileData>({
    full_name: "",
    age: null,
    gender: "",
    blood_group: "",
    weight: null,
    height: null,
    emergency_contact_name: "",
    emergency_contact_phone: "",
    allergies: [],
    chronic_conditions: [],
    current_medications: [],
  });

  const [allergyInput, setAllergyInput] = useState("");
  const [conditionInput, setConditionInput] = useState("");
  const [medicationInput, setMedicationInput] = useState("");

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    
    if (!session) {
      toast({
        variant: "destructive",
        title: "Authentication required",
        description: "Please login to access your profile",
      });
      navigate("/login");
      return;
    }

    setUser(session.user);
    await loadProfile(session.user.id);
  };

  const loadProfile = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", userId)
        .single();

      if (error) throw error;

      if (data) {
        setProfileData({
          full_name: data.full_name || "",
          age: data.age || null,
          gender: data.gender || "",
          blood_group: data.blood_group || "",
          weight: data.weight || null,
          height: data.height || null,
          emergency_contact_name: data.emergency_contact_name || "",
          emergency_contact_phone: data.emergency_contact_phone || "",
          allergies: data.allergies || [],
          chronic_conditions: data.chronic_conditions || [],
          current_medications: data.current_medications || [],
        });
      }
    } catch (error: any) {
      console.error("Error loading profile:", error);
      toast({
        variant: "destructive",
        title: "Error loading profile",
        description: error.message,
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSaveProfile = async () => {
    if (!user) return;

    // Validation
    if (!profileData.full_name.trim()) {
      toast({
        variant: "destructive",
        title: "Validation Error",
        description: "Full name is required",
      });
      return;
    }

    setSaving(true);

    try {
      const { error } = await supabase
        .from("profiles")
        .update({
          full_name: profileData.full_name,
          age: profileData.age,
          gender: profileData.gender || null,
          blood_group: profileData.blood_group || null,
          weight: profileData.weight,
          height: profileData.height,
          emergency_contact_name: profileData.emergency_contact_name || null,
          emergency_contact_phone: profileData.emergency_contact_phone || null,
          allergies: profileData.allergies,
          chronic_conditions: profileData.chronic_conditions,
          current_medications: profileData.current_medications,
          updated_at: new Date().toISOString(),
        })
        .eq("id", user.id);

      if (error) throw error;

      toast({
        title: "Profile updated successfully!",
        description: "Your personal details have been saved.",
      });
    } catch (error: any) {
      console.error("Error saving profile:", error);
      toast({
        variant: "destructive",
        title: "Error saving profile",
        description: error.message,
      });
    } finally {
      setSaving(false);
    }
  };

  const addAllergy = () => {
    if (allergyInput.trim() && !profileData.allergies.includes(allergyInput.trim())) {
      setProfileData({
        ...profileData,
        allergies: [...profileData.allergies, allergyInput.trim()],
      });
      setAllergyInput("");
    }
  };

  const removeAllergy = (allergy: string) => {
    setProfileData({
      ...profileData,
      allergies: profileData.allergies.filter((a) => a !== allergy),
    });
  };

  const addCondition = () => {
    if (conditionInput.trim() && !profileData.chronic_conditions.includes(conditionInput.trim())) {
      setProfileData({
        ...profileData,
        chronic_conditions: [...profileData.chronic_conditions, conditionInput.trim()],
      });
      setConditionInput("");
    }
  };

  const removeCondition = (condition: string) => {
    setProfileData({
      ...profileData,
      chronic_conditions: profileData.chronic_conditions.filter((c) => c !== condition),
    });
  };

  const addMedication = () => {
    if (medicationInput.trim() && !profileData.current_medications.includes(medicationInput.trim())) {
      setProfileData({
        ...profileData,
        current_medications: [...profileData.current_medications, medicationInput.trim()],
      });
      setMedicationInput("");
    }
  };

  const removeMedication = (medication: string) => {
    setProfileData({
      ...profileData,
      current_medications: profileData.current_medications.filter((m) => m !== medication),
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar user={user} />
        <div className="flex-1 flex items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-muted/30">
      <Navbar user={user} />

      <div className="container mx-auto px-4 py-8 flex-1">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">My Profile</h1>
          <p className="text-muted-foreground">
            Manage your personal details and medical information
          </p>
        </div>

        <Tabs defaultValue="personal" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3 max-w-[600px]">
            <TabsTrigger value="personal">
              <User className="h-4 w-4 mr-2" />
              Personal
            </TabsTrigger>
            <TabsTrigger value="medical">
              <Heart className="h-4 w-4 mr-2" />
              Medical
            </TabsTrigger>
            <TabsTrigger value="emergency">
              <Phone className="h-4 w-4 mr-2" />
              Emergency
            </TabsTrigger>
          </TabsList>

          {/* Personal Information Tab */}
          <TabsContent value="personal">
            <Card>
              <CardHeader>
                <CardTitle>Personal Information</CardTitle>
                <CardDescription>
                  Update your basic personal details
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Full Name */}
                <div className="space-y-2">
                  <Label htmlFor="full_name">
                    Full Name <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="full_name"
                    placeholder="Enter your full name"
                    value={profileData.full_name}
                    onChange={(e) =>
                      setProfileData({ ...profileData, full_name: e.target.value })
                    }
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Age */}
                  <div className="space-y-2">
                    <Label htmlFor="age">Age</Label>
                    <Input
                      id="age"
                      type="number"
                      placeholder="Enter your age"
                      value={profileData.age || ""}
                      onChange={(e) =>
                        setProfileData({
                          ...profileData,
                          age: e.target.value ? parseInt(e.target.value) : null,
                        })
                      }
                    />
                  </div>

                  {/* Gender */}
                  <div className="space-y-2">
                    <Label htmlFor="gender">Gender</Label>
                    <Select
                      value={profileData.gender}
                      onValueChange={(value) =>
                        setProfileData({ ...profileData, gender: value })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select gender" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="male">Male</SelectItem>
                        <SelectItem value="female">Female</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Blood Group */}
                  <div className="space-y-2">
                    <Label htmlFor="blood_group">Blood Group</Label>
                    <Select
                      value={profileData.blood_group}
                      onValueChange={(value) =>
                        setProfileData({ ...profileData, blood_group: value })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select blood group" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="A+">A+</SelectItem>
                        <SelectItem value="A-">A-</SelectItem>
                        <SelectItem value="B+">B+</SelectItem>
                        <SelectItem value="B-">B-</SelectItem>
                        <SelectItem value="O+">O+</SelectItem>
                        <SelectItem value="O-">O-</SelectItem>
                        <SelectItem value="AB+">AB+</SelectItem>
                        <SelectItem value="AB-">AB-</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Weight */}
                  <div className="space-y-2">
                    <Label htmlFor="weight">Weight (kg)</Label>
                    <Input
                      id="weight"
                      type="number"
                      step="0.1"
                      placeholder="Enter weight"
                      value={profileData.weight || ""}
                      onChange={(e) =>
                        setProfileData({
                          ...profileData,
                          weight: e.target.value ? parseFloat(e.target.value) : null,
                        })
                      }
                    />
                  </div>

                  {/* Height */}
                  <div className="space-y-2">
                    <Label htmlFor="height">Height (cm)</Label>
                    <Input
                      id="height"
                      type="number"
                      step="0.1"
                      placeholder="Enter height"
                      value={profileData.height || ""}
                      onChange={(e) =>
                        setProfileData({
                          ...profileData,
                          height: e.target.value ? parseFloat(e.target.value) : null,
                        })
                      }
                    />
                  </div>
                </div>

                {/* Email (Read-only) */}
                <div className="space-y-2">
                  <Label htmlFor="email">Email Address</Label>
                  <Input
                    id="email"
                    type="email"
                    value={user?.email || ""}
                    disabled
                    className="bg-muted"
                  />
                  <p className="text-xs text-muted-foreground">
                    Email cannot be changed
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Medical Information Tab */}
          <TabsContent value="medical">
            <Card>
              <CardHeader>
                <CardTitle>Medical Information</CardTitle>
                <CardDescription>
                  Manage your allergies, chronic conditions, and current medications
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Allergies */}
                <div className="space-y-3">
                  <Label>Allergies</Label>
                  <div className="flex gap-2">
                    <Input
                      placeholder="Add an allergy (e.g., Penicillin, Peanuts)"
                      value={allergyInput}
                      onChange={(e) => setAllergyInput(e.target.value)}
                      onKeyPress={(e) => e.key === "Enter" && addAllergy()}
                    />
                    <Button onClick={addAllergy} type="button">
                      Add
                    </Button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {profileData.allergies.length === 0 ? (
                      <p className="text-sm text-muted-foreground">
                        No allergies added
                      </p>
                    ) : (
                      profileData.allergies.map((allergy) => (
                        <Badge
                          key={allergy}
                          variant="secondary"
                          className="cursor-pointer hover:bg-destructive hover:text-destructive-foreground"
                          onClick={() => removeAllergy(allergy)}
                        >
                          {allergy} ×
                        </Badge>
                      ))
                    )}
                  </div>
                </div>

                {/* Chronic Conditions */}
                <div className="space-y-3">
                  <Label>Chronic Conditions</Label>
                  <div className="flex gap-2">
                    <Input
                      placeholder="Add a condition (e.g., Diabetes, Hypertension)"
                      value={conditionInput}
                      onChange={(e) => setConditionInput(e.target.value)}
                      onKeyPress={(e) => e.key === "Enter" && addCondition()}
                    />
                    <Button onClick={addCondition} type="button">
                      Add
                    </Button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {profileData.chronic_conditions.length === 0 ? (
                      <p className="text-sm text-muted-foreground">
                        No chronic conditions added
                      </p>
                    ) : (
                      profileData.chronic_conditions.map((condition) => (
                        <Badge
                          key={condition}
                          variant="secondary"
                          className="cursor-pointer hover:bg-destructive hover:text-destructive-foreground"
                          onClick={() => removeCondition(condition)}
                        >
                          {condition} ×
                        </Badge>
                      ))
                    )}
                  </div>
                </div>

                {/* Current Medications */}
                <div className="space-y-3">
                  <Label>Current Medications</Label>
                  <div className="flex gap-2">
                    <Input
                      placeholder="Add a medication (e.g., Metformin 500mg)"
                      value={medicationInput}
                      onChange={(e) => setMedicationInput(e.target.value)}
                      onKeyPress={(e) => e.key === "Enter" && addMedication()}
                    />
                    <Button onClick={addMedication} type="button">
                      Add
                    </Button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {profileData.current_medications.length === 0 ? (
                      <p className="text-sm text-muted-foreground">
                        No medications added
                      </p>
                    ) : (
                      profileData.current_medications.map((medication) => (
                        <Badge
                          key={medication}
                          variant="secondary"
                          className="cursor-pointer hover:bg-destructive hover:text-destructive-foreground"
                          onClick={() => removeMedication(medication)}
                        >
                          {medication} ×
                        </Badge>
                      ))
                    )}
                  </div>
                </div>

                <div className="flex items-start gap-2 p-4 bg-blue-50 dark:bg-blue-950 rounded-lg">
                  <AlertCircle className="h-5 w-5 text-blue-500 mt-0.5" />
                  <p className="text-sm text-blue-700 dark:text-blue-300">
                    This information helps doctors provide better care. Keep it updated
                    and accurate.
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Emergency Contact Tab */}
          <TabsContent value="emergency">
            <Card>
              <CardHeader>
                <CardTitle>Emergency Contact</CardTitle>
                <CardDescription>
                  Add a contact person for emergency situations
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="emergency_contact_name">Contact Name</Label>
                  <Input
                    id="emergency_contact_name"
                    placeholder="Enter emergency contact name"
                    value={profileData.emergency_contact_name}
                    onChange={(e) =>
                      setProfileData({
                        ...profileData,
                        emergency_contact_name: e.target.value,
                      })
                    }
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="emergency_contact_phone">Contact Phone</Label>
                  <Input
                    id="emergency_contact_phone"
                    type="tel"
                    placeholder="Enter emergency contact phone"
                    value={profileData.emergency_contact_phone}
                    onChange={(e) =>
                      setProfileData({
                        ...profileData,
                        emergency_contact_phone: e.target.value,
                      })
                    }
                  />
                </div>

                <div className="flex items-start gap-2 p-4 bg-orange-50 dark:bg-orange-950 rounded-lg">
                  <AlertCircle className="h-5 w-5 text-orange-500 mt-0.5" />
                  <p className="text-sm text-orange-700 dark:text-orange-300">
                    This person will be contacted in case of medical emergencies. Make
                    sure their phone number is always up-to-date.
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Save Button */}
        <div className="flex justify-end mt-6">
          <Button
            onClick={handleSaveProfile}
            disabled={saving}
            size="lg"
            className="min-w-[150px]"
          >
            {saving ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <Save className="mr-2 h-4 w-4" />
                Save Profile
              </>
            )}
          </Button>
        </div>
      </div>

      <Footer />
      <Chatbot />
    </div>
  );
};

export default ProfilePage;
