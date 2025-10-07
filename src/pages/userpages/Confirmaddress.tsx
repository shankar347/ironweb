import React, { useContext, useState, useEffect, useRef } from 'react';
import { Button } from '../../components/ui/button';
import { Card } from '../../components/ui/card';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { User, MapPin, Home } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { SteamContext } from '../../hooks/steamcontext';
import Select from 'react-select';

const Confirmaddress = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [errors, setErrors] = useState<{ [key: string]: string }>({});
    const [selectedArea, setSelectedArea] = useState<string | null>(null);
    const formRefs = useRef<{ [key: string]: HTMLInputElement | null }>({});

    const steamcontext = useContext(SteamContext);
    const { User: userdetails, orderdetails, formData, setFormData } = steamcontext;
    const navigate = useNavigate();

    const Locations = ['Perungalthur', 'East tambaram', 'West tambaram', 'Selaiyur'];
    const options = Locations.map((slot) => ({ value: slot, label: slot }));

    useEffect(() => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }, []);

    // Prefill user details
    useEffect(() => {
        const setuserdetails = () => {
            if (userdetails?.name) setFormData((prev) => ({ ...prev, name: userdetails?.name }));
            if (userdetails?.phoneno) setFormData((prev) => ({ ...prev, phoneno: userdetails?.phoneno }));
            if (userdetails?.address?.streetname) setFormData((prev) => ({ ...prev, streetname: userdetails?.address.streetname }));
            if (userdetails?.address?.houseno) setFormData((prev) => ({ ...prev, houseno: userdetails?.address.houseno }));
            if (userdetails?.address?.area) setFormData((prev) => ({ ...prev, area: userdetails?.address.area }));
            if (userdetails?.address?.city) setFormData((prev) => ({ ...prev, city: userdetails?.address.city }));
            if (userdetails?.address?.pincode) setFormData((prev) => ({ ...prev, pincode: userdetails?.address.pincode }));
        };
        setuserdetails();
    }, []);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
        setErrors((prev) => ({ ...prev, [e.target.name]: '' }));
    };

    const validateForm = () => {
        const newErrors: { [key: string]: string } = {};

        if (!formData.name?.trim()) newErrors.name = 'Please enter your full name';
        if (!formData.phoneno?.trim()) newErrors.phoneno = 'Please enter your phone number';
        if (!formData.streetname?.trim()) newErrors.streetname = 'Please enter your street name';
        if (!formData.houseno?.trim()) newErrors.houseno = 'Please enter your house/door number';
        if (!selectedArea) newErrors.area = 'Please select your area';
        if (!formData.city?.trim()) newErrors.city = 'Please enter your city';
        if (!formData.pincode?.trim()) newErrors.pincode = 'Please enter your pincode';

        return newErrors;
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const newErrors = validateForm();

        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);

            // Scroll to first invalid field
            const firstErrorField = Object.keys(newErrors)[0];
            const fieldRef = formRefs.current[firstErrorField];
            if (fieldRef) {
                fieldRef.scrollIntoView({ behavior: 'smooth', block: 'center' });
                fieldRef.focus();
            }

            return;
        }

        const newdetails = {
            ...orderdetails,
            userdetails: { ...formData, area: selectedArea },
        };

        localStorage.removeItem('orderdetails');
        localStorage.setItem('orderdetails', JSON.stringify(newdetails));
        navigate('/customer/order-checkout');
    };

    return (
        <div className="min-h-screen bg-secondary/20 py-20">
            <div className="container mx-auto px-4">
                <div className="max-w-2xl mx-auto">
                    <div className="text-center mb-8">
                        <div className="bg-primary/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                            <User className="w-8 h-8 text-primary" />
                        </div>
                        <h1 className="text-3xl font-bold text-foreground mb-2">User Details</h1>
                        <p className="text-muted-foreground">Confirm Personal and Address Information</p>
                    </div>

                    <Card className="card-service p-8">
                        <form onSubmit={handleSubmit} className="space-y-6">
                            {/* Personal Info */}
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
                                            ref={(el) => (formRefs.current.name = el)}
                                        />
                                        {errors.name && <p className="text-red-500 text-sm">{errors.name}</p>}
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="phoneno">Phone Number *</Label>
                                        <Input
                                            id="phoneno"
                                            name="phoneno"
                                            type="tel"
                                            placeholder="+91 98765 43210"
                                            value={formData.phoneno}
                                            onChange={handleInputChange}
                                            ref={(el) => (formRefs.current.phoneno = el)}
                                        />
                                        {errors.phoneno && <p className="text-red-500 text-sm">{errors.phoneno}</p>}
                                    </div>
                                </div>
                            </div>

                            {/* Address Info */}
                            <div className="space-y-4">
                                <h3 className="text-lg font-semibold text-foreground flex items-center space-x-2">
                                    <MapPin className="w-5 h-5 text-primary" />
                                    <span>Address Information</span>
                                </h3>

                                <div className="space-y-2">
                                    <Label htmlFor="streetname">Street Name *</Label>
                                    <Input
                                        id="streetname"
                                        name="streetname"
                                        type="text"
                                        placeholder="Enter your street name"
                                        value={formData.streetname}
                                        onChange={handleInputChange}
                                        ref={(el) => (formRefs.current.streetname = el)}
                                    />
                                    {errors.streetname && <p className="text-red-500 text-sm">{errors.streetname}</p>}
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="houseno">Door/Flat Number *</Label>
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
                                                ref={(el) => (formRefs.current.houseno = el)}
                                            />
                                        </div>
                                        {errors.houseno && <p className="text-red-500 text-sm">{errors.houseno}</p>}
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="area">Area Name *</Label>
                                        <Select
                                            options={options}
                                            value={options.find((opt) => opt.value === selectedArea) || null}
                                            onChange={(selected) => {
                                                setSelectedArea(selected?.value || null);
                                                setErrors((prev) => ({ ...prev, area: '' }));
                                            }}
                                            placeholder="Select your area"
                                            className="w-full"
                                            styles={{
                                                control: (base) => ({
                                                    ...base,
                                                    borderRadius: '0.5rem',
                                                    borderColor: '#D1D5DB',
                                                    padding: '0.25rem',
                                                }),
                                            }}
                                        />
                                        {errors.area && <p className="text-red-500 text-sm">{errors.area}</p>}
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
                                            ref={(el) => (formRefs.current.city = el)}
                                        />
                                        {errors.city && <p className="text-red-500 text-sm">{errors.city}</p>}
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
                                            ref={(el) => (formRefs.current.pincode = el)}
                                        />
                                        {errors.pincode && <p className="text-red-500 text-sm">{errors.pincode}</p>}
                                    </div>
                                </div>
                            </div>

                            <div className="pt-4">
                                <Button type="submit" className="btn-hero w-full text-lg py-4" disabled={isLoading}>
                                    {isLoading ? 'Saving...' : 'Confirm delivery address'}
                                </Button>
                            </div>

                            <div className="text-center">
                                <p className="text-muted-foreground">
                                    Want to change slot or number of clothes?{' '}
                                    <Link to="/customer/book-slot" className="text-primary hover:underline font-semibold">
                                        Go Back
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

export default Confirmaddress;
