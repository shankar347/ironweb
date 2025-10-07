import { useContext, useRef, useState } from 'react';
import { Button } from '../../components/ui/button';
import { Card } from '../../components/ui/card';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { User, Mail, Phone, MapPin, Home, Eye } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from "react-toastify";
import { SteamContext } from '../../hooks/steamcontext';
import { API_URL } from '../../hooks/tools';
import Select from "react-select";

const CustomerRegister = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const steamcontext = useContext(SteamContext);
  const [selectedArea, setSelectedArea] = useState<string | null>(null);
  let { formData, setFormData, setUser } = steamcontext;
  const navigate = useNavigate();

  // Refs for auto scroll
  const fieldRefs = {
    name: useRef<HTMLInputElement | null>(null),
    phoneno: useRef<HTMLInputElement | null>(null),
    email: useRef<HTMLInputElement | null>(null),
    password: useRef<HTMLInputElement | null>(null),
    streetname: useRef<HTMLInputElement | null>(null),
    houseno: useRef<HTMLInputElement | null>(null),
    area: useRef<HTMLDivElement | null>(null),
    city: useRef<HTMLInputElement | null>(null),
    pincode: useRef<HTMLInputElement | null>(null),
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    setErrors((prev) => ({ ...prev, [e.target.name]: '' })); // clear error while typing
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name) newErrors.name = '* Full Name is required';
    if (!formData.phoneno) newErrors.phoneno = '* Phone Number is required';
    if (!formData.email) newErrors.email = '* Email is required';
    if (!formData.password) newErrors.password = '* Password is required';
    if (!formData.streetname) newErrors.streetname = '* Street Name is required';
    if (!formData.houseno) newErrors.houseno = '* Door/Flat Number is required';
    if (!selectedArea) newErrors.area = '* Area selection is required';
    if (!formData.city) newErrors.city = '* City is required';
    if (!formData.pincode) newErrors.pincode = '* Pincode is required';

    setErrors(newErrors);

    // Scroll to the first missing field
    const firstErrorKey = Object.keys(newErrors)[0];
    if (firstErrorKey && fieldRefs[firstErrorKey]) {
      const ref = fieldRefs[firstErrorKey];
      ref.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      ref.current?.focus?.();
    }

    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      toast.error('Please fill all required fields');
      return;
    }

    if (formData?.phoneno?.length !== 10)
    {
      toast.error('Phone no should not less or more than 10 digits')
      return
    }

    setIsLoading(true);
    formData = { ...formData, area: selectedArea };

    try {
      const res = await fetch(`${API_URL}/user/signup`, {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ data: formData }),
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
        localStorage.setItem('token', data?.token);
        navigate('/');
      }, 1000);
    } catch (error) {
      console.error(error);
      setIsLoading(false);
      toast.error('Something went wrong. Please try again.');
    }
  };

  const Locations = ['Perungalthur', 'East tambaram', 'West tambaram', 'Selaiyur'];
  const options = Locations.map((slot) => ({ value: slot, label: slot }));

  return (
    <div className="min-h-screen bg-secondary/20 py-20">
      <div className="container mx-auto px-4">
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-8">
            <div className="bg-primary/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <User className="w-8 h-8 text-primary" />
            </div>
            <h1 className="text-3xl font-bold text-foreground mb-2">
              Create Customer Account
            </h1>
            <p className="text-muted-foreground">
              Join Steamer and get your clothes professionally pressed
            </p>
          </div>

          <Card className="card-service p-8">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Personal Information */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-foreground flex items-center space-x-2">
                  <User className="w-5 h-5 text-primary" />
                  <span>Personal Information</span>
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <Label htmlFor="name">Full Name *</Label>
                    <Input
                      ref={fieldRefs.name}
                      id="name"
                      name="name"
                      type="text"
                      placeholder="Enter your full name"
                      value={formData.name}
                      onChange={handleInputChange}
                    />
                    {errors.name && <p className="text-red-500 text-sm">{errors.name}</p>}
                  </div>

                  <div className="space-y-1">
                    <Label htmlFor="phone">Phone Number *</Label>
                    <Input
                      ref={fieldRefs.phoneno}
                      id="phoneno"
                      name="phoneno"
                      type="tel"
                      placeholder="98765 43210"
                      value={formData.phoneno}
                      onChange={handleInputChange}
                    />
                    {errors.phoneno && <p className="text-red-500 text-sm">{errors.phoneno}</p>}
                  </div>
                </div>

                <div className="space-y-1">
                  <Label htmlFor="email">Email Address *</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      ref={fieldRefs.email}
                      id="email"
                      name="email"
                      type="email"
                      placeholder="your.email@example.com"
                      className="pl-10"
                      value={formData.email}
                      onChange={handleInputChange}
                    />
                  </div>
                  {errors.email && <p className="text-red-500 text-sm">{errors.email}</p>}
                </div>

                <div className="space-y-1">
                  <Label htmlFor="password">Password *</Label>
                  <div className="relative">
                    <Eye className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      ref={fieldRefs.password}
                      id="password"
                      name="password"
                      type="password"
                      placeholder="your password"
                      className="pl-10"
                      value={formData.password}
                      onChange={handleInputChange}
                    />
                  </div>
                  {errors.password && <p className="text-red-500 text-sm">{errors.password}</p>}
                </div>
              </div>

              {/* Address Information */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-foreground flex items-center space-x-2">
                  <MapPin className="w-5 h-5 text-primary" />
                  <span>Address Information</span>
                </h3>

                <div className="space-y-1">
                  <Label htmlFor="streetname">Street Name *</Label>
                  <Input
                    ref={fieldRefs.streetname}
                    id="streetname"
                    name="streetname"
                    type="text"
                    placeholder="Enter your street name"
                    value={formData.streetname}
                    onChange={handleInputChange}
                  />
                  {errors.streetname && (
                    <p className="text-red-500 text-sm">{errors.streetname}</p>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <Label htmlFor="houseno">Door/Flat Number *</Label>
                    <div className="relative">
                      <Home className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                      <Input
                        ref={fieldRefs.houseno}
                        id="houseno"
                        name="houseno"
                        type="text"
                        placeholder="Door/Flat No."
                        className="pl-10"
                        value={formData.houseno}
                        onChange={handleInputChange}
                      />
                    </div>
                    {errors.houseno && (
                      <p className="text-red-500 text-sm">{errors.houseno}</p>
                    )}
                  </div>

                  <div className="space-y-1">
                    <Label htmlFor="area">Area Name *</Label>
                    <div ref={fieldRefs.area}>
                      <Select
                        options={options}
                        value={options.find((opt) => opt.value === selectedArea) || null}
                        onChange={(selected) => {
                          setSelectedArea(selected?.value || null);
                          setErrors((prev) => ({ ...prev, area: '' }));
                        }}
                        placeholder="Select your area "
                        className="w-full"
                        styles={{
                          control: (base) => ({
                            ...base,
                            borderRadius: '0.5rem',
                            borderColor: '#D1D5DB',
                            padding: '0.25rem',
                          }),
                          menu: (base) => ({
                            ...base,
                            borderRadius: '0.5rem',
                          }),
                        }}
                      />
                    </div>
                    {errors.area && <p className="text-red-500 text-sm">{errors.area}</p>}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <Label htmlFor="city">City *</Label>
                    <Input
                      ref={fieldRefs.city}
                      id="city"
                      name="city"
                      type="text"
                      placeholder="Chennai"
                      value={formData.city}
                      onChange={handleInputChange}
                    />
                    {errors.city && <p className="text-red-500 text-sm">{errors.city}</p>}
                  </div>

                  <div className="space-y-1">
                    <Label htmlFor="pincode">Pincode *</Label>
                    <Input
                      ref={fieldRefs.pincode}
                      id="pincode"
                      name="pincode"
                      type="text"
                      placeholder="600045"
                      value={formData.pincode}
                      onChange={handleInputChange}
                    />
                    {errors.pincode && (
                      <p className="text-red-500 text-sm">{errors.pincode}</p>
                    )}
                  </div>
                </div>
              </div>

              <div className="pt-4">
                <Button
                  type="submit"
                  className="btn-hero w-full text-lg py-4"
                  disabled={isLoading}
                >
                  {isLoading ? 'Creating Account...' : 'Create Customer Account'}
                </Button>
              </div>

              <div className="text-center">
                <p className="text-muted-foreground">
                  Already have an account?{' '}
                  <Link
                    to="/customer/login"
                    className="text-primary hover:underline font-semibold"
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

export default CustomerRegister;
