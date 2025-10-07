import { useContext, useEffect, useState } from 'react';
import { Button } from '../../components/ui/button';
import { Card } from '../../components/ui/card';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { User, Mail, Phone, MapPin, Home, Eye, Edit } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from "react-toastify";
import { SteamContext } from '../../hooks/steamcontext';
import { API_URL } from '../../hooks/tools';
import Select from "react-select";


const Customereditprofile = () => {
  const [isLoading, setIsLoading] = useState(false);

  const steamcontext = useContext(SteamContext)

  let { formData, setFormData, User: userdetails, setUser } = steamcontext
  const [selectedArea,setSelectedArea]=useState<string | null>(null);

  const navigate = useNavigate()
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  useEffect(() => {

    const setuserdetails = () => {

      if (userdetails?.name) setFormData((prev: FormData) => ({ ...prev, name: userdetails?.name }))
      if (userdetails?.name) setFormData((prev: FormData) => ({ ...prev, phoneno: userdetails?.phoneno }))
      if (userdetails?.address?.streetname) setFormData((prev: FormData) => ({ ...prev, streetname: userdetails?.address?.streetname }))
      if (userdetails?.address?.houseno) setFormData((prev: FormData) => ({ ...prev, houseno: userdetails?.address?.houseno }))
      if (userdetails?.address?.area) setFormData((prev: FormData) => ({ ...prev, area: userdetails?.address?.area }))
      if (userdetails?.address?.city) setFormData((prev: FormData) => ({ ...prev, city: userdetails?.address?.city }))
      if (userdetails?.address?.pincode) setFormData((prev: FormData) => ({ ...prev, pincode: userdetails?.address?.pincode }))
    }

    setuserdetails()
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {


    e.preventDefault();
    setIsLoading(true);

    formData = {...formData,area:selectedArea}

    const res = await fetch(`${API_URL}/user/updateprofile`, {
      method: 'PUT',
      headers: {
        'content-type': 'application/json'
      },
      credentials: 'include',

      body: JSON.stringify(formData)
    })

    const data = await res.json()

    if (data?.error) {

      toast.error(data?.error)
      setIsLoading(false)
      return
    }

    console.log(formData, 'hi')


    // Simulate API call
    // setTimeout(() => {
    //   setIsLoading(false);
    //   setUser(data?.data)
    //   toast.success(data?.message)
    //   navigate('/customer/profile')
    // }, 2000);

  };
 const Locations=['Perungalthur','East tambaram','West tambaram','Selaiyur']

  const options=Locations.map((slot)=>({value:slot,label:slot}))
  return (
    <div className="min-h-screen bg-secondary/20 py-20">
      <div className="container mx-auto px-4">
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-8">
            <div className="bg-primary/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <Edit className="w-8 h-8 text-primary" />
            </div>
            <h1 className="text-3xl font-bold text-foreground mb-2">Edit Profile</h1>
            <p className="text-muted-foreground">Change your Personal and Address details </p>
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
                  <div className="space-y-2">
                    <Label htmlFor="name">Full Name *</Label>
                    <Input
                      id="name"
                      name="name"
                      type="text"
                      placeholder="Enter your full name"
                      value={formData.name}
                      onChange={handleInputChange}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone Number *</Label>
                    <Input
                      id="phoneno"
                      name="phoneno"
                      type="tel"
                      placeholder="+91 98765 43210"
                      value={formData.phoneno}
                      onChange={handleInputChange}
                    />
                  </div>
                </div>


                <div className="space-y-2">
                  <Label htmlFor="email">Password *</Label>
                  <div className="relative">
                    <Eye className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      id="password"
                      name="password"
                      type="password"
                      placeholder="your password"
                      className="pl-10"
                      value={formData.password}
                      onChange={handleInputChange}
                    />
                  </div>
                </div>
              </div>

              {/* Address Information */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-foreground flex items-center space-x-2">
                  <MapPin className="w-5 h-5 text-primary" />
                  <span>Address Information</span>
                </h3>

                <div className="space-y-2">
                  <Label htmlFor="address">Street Name *</Label>
                  <Input
                    id="streetname"
                    name="streetname"
                    type="text"
                    placeholder="Enter your street name"
                    value={formData.streetname}
                    onChange={handleInputChange}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="doorNo">Door/Flat Number *</Label>
                    <div className="relative">
                      <Home className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                      <Input
                        id="houseno"
                        name="houseno"
                        type="text"
                        placeholder="Door/Flat No."
                        className="pl-10"
                        value={formData.houseno}
                        onChange={handleInputChange}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
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
                                    borderColor: "#D1D5DB", // Tailwind gray-300
                                    padding: "0.25rem",
                                }),
                                menu: (base) => ({
                                    ...base,
                                    borderRadius: "0.5rem",
                                }),
                            }}
                        />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="city">City *</Label>
                    <Input
                      id="city"
                      name="city"
                      type="text"
                      placeholder="Chennai"
                      value={formData.city}
                      onChange={handleInputChange}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="pincode">Pincode *</Label>
                    <Input
                      id="pincode"
                      name="pincode"
                      type="text"
                      placeholder="600045"
                      value={formData.pincode}
                      onChange={handleInputChange}
                    />
                  </div>
                </div>
              </div>

              <div className="pt-4">
                <Button
                  type="submit"
                  className="btn-hero w-full text-lg py-4"
                  disabled={isLoading}
                >
                  {isLoading ? 'Saving' : 'Save profile'}
                </Button>
              </div>

              <div className="text-center">
                <p className="text-muted-foreground">
                  Don't want to edit profile?{' '}
                  <Link to="/customer/profile" className="text-primary hover:underline font-semibold">
                    Go back
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

export default Customereditprofile