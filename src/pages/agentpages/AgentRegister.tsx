
import { useState, useRef, useContext } from "react";
import { Button } from "../../components/ui/button";
import { Card } from "../../components/ui/card";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import {
  Truck,
  Mail,
  Phone,
  MapPin,
  Home,
  FileText,
  CreditCard,
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { API_URL } from "../../hooks/tools";
import Select from "react-select";
import { SteamContext } from "../../hooks/steamcontext";

const AgentRegister = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [selectedArea, setSelectedArea] = useState<string | null>(null);
  const [errors, setErrors] = useState<any>({});
  const steamcontext = useContext(SteamContext);
  const { setUser } = steamcontext;

  let [formData, setFormData] = useState({
    name: "",
    phoneno: "",
    email: "",
    houseno: "",
    streetname: "",
    city: "",
    pincode: "",
    vehicleNumber: "",
    drivingLicense: "",
    aadharCard: "",
  });

  // Refs for scrolling to first missing field
  const nameRef = useRef<HTMLDivElement | null>(null);
  const phoneRef = useRef<HTMLDivElement | null>(null);
  const emailRef = useRef<HTMLDivElement | null>(null);
  const streetRef = useRef<HTMLDivElement | null>(null);
  const houseRef = useRef<HTMLDivElement | null>(null);
  const areaRef = useRef<HTMLDivElement | null>(null);
  const cityRef = useRef<HTMLDivElement | null>(null);
  const pincodeRef = useRef<HTMLDivElement | null>(null);
  const vehicleRef = useRef<HTMLDivElement | null>(null);
  const licenseRef = useRef<HTMLDivElement | null>(null);
  const aadharRef = useRef<HTMLDivElement | null>(null);

  const navigate = useNavigate();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    let newErrors: any = {};
    let firstErrorRef: HTMLDivElement | null = null;

    // Validate fields
    const requiredFields: Record<string, any> = {
      name: nameRef,
      phoneno: phoneRef,
      email: emailRef,
      streetname: streetRef,
      houseno: houseRef,
      city: cityRef,
      pincode: pincodeRef,
      vehicleNumber: vehicleRef,
      drivingLicense: licenseRef,
      aadharCard: aadharRef,
    };

    Object.entries(requiredFields).forEach(([key, ref]) => {
      if (!formData[key as keyof typeof formData]) {
        newErrors[key] = "Please fill this required field";
        if (!firstErrorRef) firstErrorRef = ref.current;
      }
    });

    if (!selectedArea) {
      newErrors.area = "Please select your area";
      if (!firstErrorRef) firstErrorRef = areaRef.current;
    }

    setErrors(newErrors);

    if (firstErrorRef) {
      firstErrorRef.scrollIntoView({ behavior: "smooth", block: "center" });
      toast.error("Please fill all required fields");
      return;
    }


      if (formData?.phoneno?.length !== 10)
        {
          toast.error('Phone no should not less or more than 10 digits')
          return
        }

    // Proceed if valid
    setIsLoading(true);
    formData = { ...formData, area: selectedArea };

    try {
      const res = await fetch(`${API_URL}/user/signup`, {
        method: "POST",
        headers: {
          "content-type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          data: formData,
          isagentapplied: true,
        }),
      });

      const data = await res.json();

      if (data?.error) {
        toast.error(data?.error);
        setIsLoading(false);
        return;
      }

      setUser(data?.data);

      setTimeout(() => {
        setIsLoading(false);
        toast.success(data?.message);
        navigate("/agent/login");
      }, 2000);
    } catch (error) {
      toast.error("Something went wrong!");
      setIsLoading(false);
    }
  };

  const Locations = ["Perungalthur", "East tambaram", "West tambaram", "Selaiyur"];
  const options = Locations.map((slot) => ({ value: slot, label: slot }));

  return (
    <div className="min-h-screen bg-secondary/20 py-20">
      <div className="container mx-auto px-4">
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-8">
            <div className="bg-success/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <Truck className="w-8 h-8 text-success" />
            </div>
            <h1 className="text-3xl font-bold text-foreground mb-2">
              Join as Delivery Agent
            </h1>
            <p className="text-muted-foreground">
              Start earning with flexible working hours
            </p>
          </div>

          <Card className="card-service p-8">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Personal Information */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-foreground flex items-center space-x-2">
                  <Truck className="w-5 h-5 text-success" />
                  <span>Personal Information</span>
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div ref={nameRef} className="space-y-2">
                    <Label htmlFor="name">Full Name *</Label>
                    <Input
                      id="name"
                      name="name"
                      type="text"
                      placeholder="Enter your full name"
                      value={formData.name}
                      onChange={handleInputChange}
                    />
                    {errors.name && <p className="text-red-500 text-sm">* {errors.name}</p>}
                  </div>

                  <div ref={phoneRef} className="space-y-2">
                    <Label htmlFor="phone">Phone Number *</Label>
                    <Input
                      id="phone"
                      name="phoneno"
                      type="tel"
                      placeholder="98765 43210"
                      value={formData.phoneno}
                      onChange={handleInputChange}
                    />
                    {errors.phoneno && (
                      <p className="text-red-500 text-sm">* {errors.phoneno}</p>
                    )}
                  </div>
                </div>

                <div ref={emailRef} className="space-y-2">
                  <Label htmlFor="email">Email Address *</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      placeholder="your.email@example.com"
                      className="pl-10"
                      value={formData.email}
                      onChange={handleInputChange}
                    />
                  </div>
                  {errors.email && <p className="text-red-500 text-sm">* {errors.email}</p>}
                </div>
              </div>

              {/* Address Information */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-foreground flex items-center space-x-2">
                  <MapPin className="w-5 h-5 text-success" />
                  <span>Address Information</span>
                </h3>

                <div ref={streetRef} className="space-y-2">
                  <Label htmlFor="address">Street Address *</Label>
                  <Input
                    id="address"
                    name="streetname"
                    type="text"
                    placeholder="Enter your street address"
                    value={formData.streetname}
                    onChange={handleInputChange}
                  />
                  {errors.streetname && (
                    <p className="text-red-500 text-sm">* {errors.streetname}</p>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div ref={houseRef} className="space-y-2">
                    <Label htmlFor="doorNo">Door/Flat Number *</Label>
                    <div className="relative">
                      <Home className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                      <Input
                        id="doorNo"
                        name="houseno"
                        type="text"
                        placeholder="Door/Flat No."
                        className="pl-10"
                        value={formData.houseno}
                        onChange={handleInputChange}
                      />
                    </div>
                    {errors.houseno && (
                      <p className="text-red-500 text-sm">* {errors.houseno}</p>
                    )}
                  </div>

                  <div ref={areaRef} className="space-y-2">
                    <Label htmlFor="area">Area Name *</Label>
                    <Select
                      options={options}
                      value={options.find((opt) => opt.value === selectedArea) || null}
                      onChange={(selected) => setSelectedArea(selected?.value || null)}
                      placeholder="Select your area "
                      className="w-full"
                      styles={{
                        control: (base) => ({
                          ...base,
                          borderRadius: "0.5rem",
                          borderColor: "#D1D5DB",
                          padding: "0.25rem",
                        }),
                        menu: (base) => ({
                          ...base,
                          borderRadius: "0.5rem",
                        }),
                      }}
                    />
                    {errors.area && (
                      <p className="text-red-500 text-sm">* {errors.area}</p>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div ref={cityRef} className="space-y-2">
                    <Label htmlFor="city">City *</Label>
                    <Input
                      id="city"
                      name="city"
                      type="text"
                      placeholder="Chennai"
                      value={formData.city}
                      onChange={handleInputChange}
                    />
                    {errors.city && <p className="text-red-500 text-sm">* {errors.city}</p>}
                  </div>

                  <div ref={pincodeRef} className="space-y-2">
                    <Label htmlFor="pincode">Pincode *</Label>
                    <Input
                      id="pincode"
                      name="pincode"
                      type="text"
                      placeholder="600045"
                      value={formData.pincode}
                      onChange={handleInputChange}
                    />
                    {errors.pincode && (
                      <p className="text-red-500 text-sm">* {errors.pincode}</p>
                    )}
                  </div>
                </div>
              </div>

              {/* Vehicle & Documents */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-foreground flex items-center space-x-2">
                  <FileText className="w-5 h-5 text-success" />
                  <span>Vehicle & Documents</span>
                </h3>

                <div ref={vehicleRef} className="space-y-2">
                  <Label htmlFor="vehicleNumber">Vehicle Number *</Label>
                  <Input
                    id="vehicleNumber"
                    name="vehicleNumber"
                    type="text"
                    placeholder="TN 01 AB 1234"
                    value={formData.vehicleNumber}
                    onChange={handleInputChange}
                  />
                  {errors.vehicleNumber && (
                    <p className="text-red-500 text-sm">* {errors.vehicleNumber}</p>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div ref={licenseRef} className="space-y-2">
                    <Label htmlFor="drivingLicense">Driving License Number *</Label>
                    <div className="relative">
                      <CreditCard className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                      <Input
                        id="drivingLicense"
                        name="drivingLicense"
                        type="text"
                        placeholder="DL Number"
                        className="pl-10"
                        value={formData.drivingLicense}
                        onChange={handleInputChange}
                      />
                    </div>
                    {errors.drivingLicense && (
                      <p className="text-red-500 text-sm">* {errors.drivingLicense}</p>
                    )}
                  </div>

                  <div ref={aadharRef} className="space-y-2">
                    <Label htmlFor="aadharCard">Aadhar Card Number *</Label>
                    <div className="relative">
                      <CreditCard className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                      <Input
                        id="aadharCard"
                        name="aadharCard"
                        type="text"
                        placeholder="XXXX XXXX XXXX"
                        className="pl-10"
                        value={formData.aadharCard}
                        onChange={handleInputChange}
                      />
                    </div>
                    {errors.aadharCard && (
                      <p className="text-red-500 text-sm">* {errors.aadharCard}</p>
                    )}
                  </div>
                </div>
              </div>

              <div className="bg-secondary/50 rounded-lg p-4">
                <p className="text-sm text-muted-foreground">
                  <strong>Note:</strong> All information will be verified during the
                  approval process. You'll receive a confirmation email within 2-3
                  business days.
                </p>
              </div>

              <div className="pt-4">
                <Button
                  type="submit"
                  className="bg-success hover:bg-success/90 text-success-foreground w-full text-lg py-4"
                  disabled={isLoading}
                >
                  {isLoading ? "Submitting Application..." : "Submit Application"}
                </Button>
              </div>

              <div className="text-center">
                <p className="text-muted-foreground">
                  Already registered?{" "}
                  <Link
                    to="/agent/login"
                    className="text-success hover:underline font-semibold"
                  >
                    Sign In
                  </Link>
                </p>
              </div>
            </form>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default AgentRegister;

