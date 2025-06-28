"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { UserPlus, GraduationCap, Building2, Stethoscope, CheckCircle2, XCircle } from "lucide-react"
import Link from "next/link"
import { useState, useRef, useEffect } from "react"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem } from "@/components/ui/command"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { cn } from "@/lib/utils"
import { apiFetch } from "@/lib/api"
import { useRouter } from "next/navigation"

export default function SignupPage() {
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [openSpecialty, setOpenSpecialty] = useState(false)
  const [openInstitution, setOpenInstitution] = useState(false)
  const [openLocation, setOpenLocation] = useState(false)
  const [selectedSpecialty, setSelectedSpecialty] = useState("")
  const [selectedInstitution, setSelectedInstitution] = useState("")
  const [selectedLocation, setSelectedLocation] = useState("")
  const [form, setForm] = useState({ name: "", email: "", password: "" })
  const [error, setError] = useState<string | null>(null)
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [accountType, setAccountType] = useState("");
  const [agreed, setAgreed] = useState(false);
  const [profilePic, setProfilePic] = useState<File | null>(null);
  const [profilePicPreview, setProfilePicPreview] = useState<string>("");
  const [specialties, setSpecialties] = useState<string[]>([]);
  const [institutions, setInstitutions] = useState<string[]>([]);
  const [indianCities, setIndianCities] = useState<string[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  const passwordRequirements = [
    { id: "length", text: "At least 8 characters", met: password.length >= 8 },
    { id: "uppercase", text: "At least one uppercase letter", met: /[A-Z]/.test(password) },
    { id: "lowercase", text: "At least one lowercase letter", met: /[a-z]/.test(password) },
    { id: "number", text: "At least one number", met: /[0-9]/.test(password) },
    { id: "special", text: "At least one special character", met: /[!@#$%^&*(),.?":{}|<>]/.test(password) },
  ]

  const passwordsMatch = password === confirmPassword && password !== ""

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleProfilePicChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setProfilePic(file);
      setProfilePicPreview(URL.createObjectURL(file));
    }
  };

const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  setError(null);

  if (!agreed) {
    setError("You must agree to the Terms of Service and Privacy Policy.");
    return;
  }

  if (!firstName || !lastName || !selectedSpecialty || !selectedInstitution || !selectedLocation || !accountType) {
    setError("Please fill in all required fields.");
    return;
  }

  if (!passwordsMatch) {
    setError("Passwords do not match.");
    return;
  }

  const signupData = {
    name: `${firstName} ${lastName}`.trim(),
    email: form.email,
    password,
    specialty: selectedSpecialty,
    institution: selectedInstitution,
    location: selectedLocation,
    accountType,
  };

    try {
    const formData = new FormData();
    Object.entries(signupData).forEach(([key, value]) =>
      formData.append(key, value)
    );

    // Ensure 'profilePic' key is always present
    if (profilePic) {
      formData.append("profilePic", profilePic);
    } else {
      formData.append("profilePic", "");
    }

    await apiFetch("/auth/signup", {
      method: "POST",
      data: formData,
      headers: { "Content-Type": "multipart/form-data" },
    });

    router.push("/login");
  } catch (err: any) {
    if (err.message?.toLowerCase().includes("already registered")) {
      router.push("/login");
      return;
    }
    setError(err.message);
  }
};

  useEffect(() => {
    async function fetchLookups() {
      try {
        const [specialitiesRes, institutionsRes, citiesRes] = await Promise.all([
          apiFetch<{ name: string }[]>("/lookup/specialities-list"),
          apiFetch<{ name: string }[]>("/lookup/institutions-list"),
          apiFetch<{ name: string }[]>("/lookup/cities-list"),
        ]);
        setSpecialties(specialitiesRes.map((s) => s.name));
        setInstitutions(institutionsRes.map((i) => i.name));
        setIndianCities(citiesRes.map((c) => c.name));
      } catch (err) {
        // Optionally handle error
      }
    }
    fetchLookups();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 flex items-center justify-center py-6 px-4 sm:px-6 lg:px-8">
      <div className="max-w-lg w-full space-y-6 p-6 bg-white rounded-2xl shadow-xl">
        <div className="text-center space-y-1">
          <h2 className="text-2xl font-bold text-blue-900">Create your Med Connect Account</h2>
          <p className="text-gray-600 text-sm">Join the professional medical network</p>
        </div>

        <Card className="shadow-none border-none bg-transparent">
          <CardContent className="space-y-4 p-0">
            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Profile Picture Upload */}
              <div className="flex flex-col items-center space-y-2 pb-2">
                <div className="relative">
                  {profilePicPreview ? (
                    <img
                      src={profilePicPreview}
                      alt="Profile Preview"
                      className="w-20 h-20 rounded-full object-cover border-2 border-blue-200 shadow"
                    />
                  ) : (
                    <img
                      src="https://ui-avatars.com/api/?name=Profile&background=E0E7EF&color=374151&size=80&rounded=true"
                      alt="Profile Placeholder"
                      className="w-20 h-20 rounded-full object-cover border-2 border-blue-200 shadow"
                    />
                  )}
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="absolute bottom-0 right-0 bg-blue-600 text-white rounded-full p-1 shadow hover:bg-blue-700 focus:outline-none"
                    aria-label="Upload profile picture"
                  >
                    <UserPlus className="w-4 h-4" />
                  </button>
                </div>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleProfilePicChange}
                />
                <span className="text-xs text-gray-500">Upload a profile picture (optional)</span>
              </div>

              {/* Account Type Selection */}
              <div className="space-y-2">
                <Label className="text-sm font-medium text-gray-700">I am a:</Label>
                <div className="grid sm:grid-cols-3 gap-2">
                  <label
                    className={`flex items-center space-x-2 p-2 border border-blue-200 rounded-lg hover:bg-blue-50 cursor-pointer transition-all ${
                      accountType === "doctor" ? "ring-2 ring-blue-500 bg-blue-50" : ""
                    }`}
                    onClick={() => setAccountType("doctor")}
                  >
                    <Checkbox 
                      id="doctor" 
                      checked={accountType === "doctor"} 
                      onCheckedChange={() => setAccountType("doctor")}
                      className="pointer-events-none"
                    />
                    <div className="flex items-center space-x-1">
                      <UserPlus className="w-4 h-4 text-blue-600" />
                      <span className="text-sm">Doctor</span>
                    </div>
                  </label>
                  <label
                    className={`flex items-center space-x-2 p-2 border border-blue-200 rounded-lg hover:bg-blue-50 cursor-pointer transition-all ${
                      accountType === "student" ? "ring-2 ring-blue-500 bg-blue-50" : ""
                    }`}
                    onClick={() => setAccountType("student")}
                  >
                    <Checkbox 
                      id="student" 
                      checked={accountType === "student"} 
                      onCheckedChange={() => setAccountType("student")}
                      className="pointer-events-none"
                    />
                    <div className="flex items-center space-x-1">
                      <GraduationCap className="w-4 h-4 text-blue-600" />
                      <span className="text-sm">Student</span>
                    </div>
                  </label>
                  <label
                    className={`flex items-center space-x-2 p-2 border border-blue-200 rounded-lg hover:bg-blue-50 cursor-pointer transition-all ${
                      accountType === "institution" ? "ring-2 ring-blue-500 bg-blue-50" : ""
                    }`}
                    onClick={() => setAccountType("institution")}
                  >
                    <Checkbox 
                      id="institution" 
                      checked={accountType === "institution"} 
                      onCheckedChange={() => setAccountType("institution")}
                      className="pointer-events-none"
                    />
                    <div className="flex items-center space-x-1">
                      <Building2 className="w-4 h-4 text-blue-600" />
                      <span className="text-sm">Hospital</span>
                    </div>
                  </label>
                </div>
              </div>

              {/* Personal Information */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <Label htmlFor="firstName" className="text-sm">First Name</Label>
                  <Input id="firstName" placeholder="John" value={firstName} onChange={e => setFirstName(e.target.value)} className="h-9" />
                </div>
                <div className="space-y-1">
                  <Label htmlFor="lastName" className="text-sm">Last Name</Label>
                  <Input id="lastName" placeholder="Doe" value={lastName} onChange={e => setLastName(e.target.value)} className="h-9" />
                </div>
              </div>

              <div className="space-y-1">
                <Label htmlFor="email" className="text-sm">Email Address</Label>
                <Input id="email" type="email" placeholder="john.doe@example.com" name="email" value={form.email} onChange={handleChange} className="h-9" />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <Label htmlFor="password" className="text-sm">Password</Label>
                  <Input 
                    id="password" 
                    type="password" 
                    placeholder="••••••••" 
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="h-9"
                  />
                </div>
                <div className="space-y-1">
                  <Label htmlFor="confirmPassword" className="text-sm">Confirm Password</Label>
                  <Input 
                    id="confirmPassword" 
                    type="password" 
                    placeholder="••••••••" 
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="h-9"
                  />
                </div>
              </div>

              {/* Password Requirements */}
              <div className="grid grid-cols-2 gap-2 text-xs">
                {passwordRequirements.map((req) => (
                  <div key={req.id} className="flex items-center space-x-1">
                    {req.met ? (
                      <CheckCircle2 className="w-3 h-3 text-green-500" />
                    ) : (
                      <XCircle className="w-3 h-3 text-red-500" />
                    )}
                    <span className={req.met ? "text-green-600" : "text-red-600"}>
                      {req.text}
                    </span>
                  </div>
                ))}
              </div>

              {/* Professional Information */}
              <div className="grid sm:grid-cols-3 gap-4">
                <div className="space-y-1">
                  <Label htmlFor="specialty" className="text-sm">Specialty</Label>
                  <Popover open={openSpecialty} onOpenChange={setOpenSpecialty}>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        role="combobox"
                        aria-expanded={openSpecialty}
                        className="w-full h-9 justify-between text-sm"
                      >
                        {selectedSpecialty || "Select..."}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-[200px] p-0">
                      <Command>
                        <CommandInput placeholder="Search..." className="h-9" />
                        <CommandEmpty>None found</CommandEmpty>
                        <CommandGroup className="max-h-[200px] overflow-y-auto">
                          {specialties.map((specialty) => (
                            <CommandItem
                              key={specialty}
                              value={specialty}
                              onSelect={() => {
                                setSelectedSpecialty(specialty)
                                setOpenSpecialty(false)
                              }}
                              className="text-sm"
                            >
                              {specialty}
                            </CommandItem>
                          ))}
                        </CommandGroup>
                      </Command>
                    </PopoverContent>
                  </Popover>
                </div>

                <div className="space-y-1">
                  <Label htmlFor="institution" className="text-sm">Institution</Label>
                  <Popover open={openInstitution} onOpenChange={setOpenInstitution}>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        role="combobox"
                        aria-expanded={openInstitution}
                        className="w-full h-9 justify-between text-sm"
                      >
                        {selectedInstitution || "Select..."}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-[200px] p-0">
                      <Command>
                        <CommandInput placeholder="Search..." className="h-9" />
                        <CommandEmpty>None found</CommandEmpty>
                        <CommandGroup className="max-h-[200px] overflow-y-auto">
                          {institutions.map((institution) => (
                            <CommandItem
                              key={institution}
                              value={institution}
                              onSelect={() => {
                                setSelectedInstitution(institution)
                                setOpenInstitution(false)
                              }}
                              className="text-sm"
                            >
                              {institution}
                            </CommandItem>
                          ))}
                        </CommandGroup>
                      </Command>
                    </PopoverContent>
                  </Popover>
                </div>

                <div className="space-y-1">
                  <Label htmlFor="location" className="text-sm">Location</Label>
                  <Popover open={openLocation} onOpenChange={setOpenLocation}>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        role="combobox"
                        aria-expanded={openLocation}
                        className="w-full h-9 justify-between text-sm"
                      >
                        {selectedLocation || "Select..."}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-[200px] p-0">
                      <Command>
                        <CommandInput placeholder="Search..." className="h-9" />
                        <CommandEmpty>None found</CommandEmpty>
                        <CommandGroup className="max-h-[200px] overflow-y-auto">
                          {indianCities.map((city) => (
                            <CommandItem
                              key={city}
                              value={city}
                              onSelect={() => {
                                setSelectedLocation(city)
                                setOpenLocation(false)
                              }}
                              className="text-sm"
                            >
                              {city}
                            </CommandItem>
                          ))}
                        </CommandGroup>
                      </Command>
                    </PopoverContent>
                  </Popover>
                </div>
              </div>

              {/* Terms and Error */}
              <div className="space-y-4">
                <div className="flex items-center space-x-2">
                  <Checkbox id="terms" checked={agreed} onCheckedChange={val => setAgreed(val === true)} />
                  <Label htmlFor="terms" className="text-xs text-gray-600">
                    I agree to the{" "}
                    <Link href="#" className="text-blue-600 hover:underline">Terms</Link>
                    {" "}and{" "}
                    <Link href="#" className="text-blue-600 hover:underline">Privacy Policy</Link>
                  </Label>
                </div>
                {error && <div className="text-red-600 text-xs">{error}</div>}
              </div>

              {/* Submit and Login */}
              <div className="pt-2 space-y-3">
                <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white h-10 font-medium rounded-lg" type="submit">
                  Create Account
                </Button>
                <div className="text-center">
                  <span className="text-xs text-gray-600">
                    Already have an account?{" "}
                    <Link href="/login" className="text-blue-600 hover:underline font-medium">
                      Sign in
                    </Link>
                  </span>
                </div>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
