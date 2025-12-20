import React, { useContext, useState, useEffect, useRef } from 'react';
import { Button } from '../../components/ui/button';
import { Card } from '../../components/ui/card';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { User, MapPin, Home, ChevronRight, CheckCircle, ArrowLeft, AlertCircle, Phone, Navigation } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { SteamContext } from '../../hooks/steamcontext';
import Select from 'react-select';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-toastify';

const Confirmaddress = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [errors, setErrors] = useState<{ [key: string]: string }>({});
    const [selectedArea, setSelectedArea] = useState<string | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
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
            const updates: any = {};
            if (userdetails?.name) updates.name = userdetails.name;
            if (userdetails?.phoneno) updates.phoneno = userdetails.phoneno;
            if (userdetails?.address?.streetname) updates.streetname = userdetails.address.streetname;
            if (userdetails?.address?.houseno) updates.houseno = userdetails.address.houseno;
            if (userdetails?.address?.area) {
                updates.area = userdetails.address.area;
                setSelectedArea(userdetails.address.area);
            }
            if (userdetails?.address?.city) updates.city = userdetails.address.city;
            if (userdetails?.address?.pincode) updates.pincode = userdetails.address.pincode;
            
            if (Object.keys(updates).length > 0) {
                setFormData(prev => ({ ...prev, ...updates }));
            }
        };
        setuserdetails();
    }, [userdetails]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: '' }));
        }
    };

    const validateForm = () => {
        const newErrors: { [key: string]: string } = {};
        const phoneRegex = /^[6-9]\d{9}$/;

        if (!formData.name?.trim()) newErrors.name = 'Full name is required';
        else if (formData.name.trim().length < 3) newErrors.name = 'Name must be at least 3 characters';

        if (!formData.phoneno?.trim()) newErrors.phoneno = 'Phone number is required';
        else if (!phoneRegex.test(formData.phoneno.replace(/\D/g, ''))) newErrors.phoneno = 'Invalid Indian phone number';

        if (!formData.streetname?.trim()) newErrors.streetname = 'Street name is required';
        else if (formData.streetname.trim().length < 3) newErrors.streetname = 'Street name is too short';

        if (!formData.houseno?.trim()) newErrors.houseno = 'House/flat number is required';

        if (!selectedArea) newErrors.area = 'Please select your area';

        if (!formData.city?.trim()) newErrors.city = 'City is required';

        if (!formData.pincode?.trim()) newErrors.pincode = 'Pincode is required';
        else if (!/^\d{6}$/.test(formData.pincode)) newErrors.pincode = 'Invalid pincode (6 digits required)';

        return newErrors;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        
        const newErrors = validateForm();

        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            setIsSubmitting(false);

            // Scroll to first invalid field
            const firstErrorField = Object.keys(newErrors)[0];
            const fieldRef = formRefs.current[firstErrorField];
            if (fieldRef) {
                fieldRef.scrollIntoView({ behavior: 'smooth', block: 'center' });
                fieldRef.focus();
            }

            return;
        }

        setIsLoading(true);
        
        // Simulate API call delay for better UX
        await new Promise(resolve => setTimeout(resolve, 500));

        try {
            const newdetails = {
                ...orderdetails,
                userdetails: { ...formData, area: selectedArea },
            };

            localStorage.removeItem('orderdetails');
            localStorage.setItem('orderdetails', JSON.stringify(newdetails));
            
            toast.success('Address confirmed successfully!');
            
            // Navigate with animation delay
            setTimeout(() => {
                navigate('/customer/order-checkout');
            }, 300);
            
        } catch (error) {
            toast.error('Failed to save address. Please try again.');
        } finally {
            setIsLoading(false);
            setIsSubmitting(false);
        }
    };

    // Animation variants
    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                duration: 0.5,
                when: "beforeChildren",
                staggerChildren: 0.1
            }
        }
    };

    const itemVariants = {
        hidden: { y: 20, opacity: 0 },
        visible: {
            y: 0,
            opacity: 1,
            transition: { type: "spring", stiffness: 100 }
        }
    };

    return (
        <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="min-h-screen bg-gradient-to-br bg-gray-100 from-secondary/10 
            via-background to-primary/5 py-20"
        >
            <div className="container mx-auto px-4">
                <motion.div 
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.2 }}
                    className="max-w-2xl mx-auto"
                >
                    {/* Header */}
                    <motion.div 
                        initial={{ y: 10, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: 0.3 }}
                        className="text-center mb-12"
                    >
                        <motion.div 
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ delay: 0.4, type: "spring" }}
                            className="bg-gradient-to-r from-primary to-primary/80 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg shadow-primary/20"
                        >
                            <User className="w-10 h-10 text-white" />
                        </motion.div>
                        <motion.h1 
                            initial={{ y: 10, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ delay: 0.5 }}
                            className="text-4xl font-bold text-foreground mb-3 bg-gradient-to-r from-foreground to-foreground/80 bg-clip-text text-transparent"
                        >
                            Delivery Details
                        </motion.h1>
                        <motion.p 
                            initial={{ y: 10, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ delay: 0.6 }}
                            className="text-muted-foreground text-lg"
                        >
                            Confirm your personal and delivery information
                        </motion.p>
                    </motion.div>

                    {/* Form Card */}
                    <motion.div
                        variants={containerVariants}
                        initial="hidden"
                        animate="visible"
                    >
                        <Card className="p-8 mb-6 border-2 border-primary/10 shadow-xl hover:shadow-2xl transition-all duration-300 rounded-2xl bg-gradient-to-br from-card to-card/95">
                            <form onSubmit={handleSubmit} className="space-y-8">
                                {/* Personal Information Section */}
                                <motion.div variants={itemVariants} className="space-y-6">
                                    <div className="flex items-center mb-2">
                                        <div className="bg-primary/10 p-3 rounded-xl mr-4">
                                            <User className="w-7 h-7 text-primary" />
                                        </div>
                                        <div>
                                            <h3 className="text-xl font-bold text-foreground">Personal Information</h3>
                                            <p className="text-muted-foreground">Your contact details</p>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <motion.div variants={itemVariants} className="space-y-3">
                                            <Label htmlFor="name" className="text-foreground font-medium">
                                                Full Name <span className="text-red-500">*</span>
                                            </Label>
                                            <div className="relative group">
                                                <Input
                                                    id="name"
                                                    name="name"
                                                    type="text"
                                                    placeholder="Enter your full name"
                                                    value={formData.name || ''}
                                                    onChange={handleInputChange}
                                                    ref={(el) => (formRefs.current.name = el)}
                                                    className={`h-12 pl-4 pr-4 text-base transition-all duration-200 ${
                                                        errors.name 
                                                            ? 'border-red-500 focus:border-red-500 focus:ring-red-500/20' 
                                                            : 'border-input focus:border-primary focus:ring-2 focus:ring-primary/20'
                                                    }`}
                                                />
                                                <AnimatePresence>
                                                    {errors.name && (
                                                        <motion.p 
                                                            initial={{ opacity: 0, y: -10 }}
                                                            animate={{ opacity: 1, y: 0 }}
                                                            exit={{ opacity: 0, y: -10 }}
                                                            className="text-red-500 text-sm mt-2 flex items-center"
                                                        >
                                                            <AlertCircle className="w-4 h-4 mr-1" />
                                                            {errors.name}
                                                        </motion.p>
                                                    )}
                                                </AnimatePresence>
                                            </div>
                                        </motion.div>

                                        <motion.div variants={itemVariants} className="space-y-3">
                                            <Label htmlFor="phoneno" className="text-foreground font-medium">
                                                Phone Number <span className="text-red-500">*</span>
                                            </Label>
                                            <div className="relative group">
                                                <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                                                <Input
                                                    id="phoneno"
                                                    name="phoneno"
                                                    type="tel"
                                                    placeholder="9876543210"
                                                    value={formData.phoneno || ''}
                                                    onChange={handleInputChange}
                                                    ref={(el) => (formRefs.current.phoneno = el)}
                                                    className={`h-12 pl-12 pr-4 text-base transition-all duration-200 ${
                                                        errors.phoneno 
                                                            ? 'border-red-500 focus:border-red-500 focus:ring-red-500/20' 
                                                            : 'border-input focus:border-primary focus:ring-2 focus:ring-primary/20'
                                                    }`}
                                                />
                                                <AnimatePresence>
                                                    {errors.phoneno && (
                                                        <motion.p 
                                                            initial={{ opacity: 0, y: -10 }}
                                                            animate={{ opacity: 1, y: 0 }}
                                                            exit={{ opacity: 0, y: -10 }}
                                                            className="text-red-500 text-sm mt-2 flex items-center"
                                                        >
                                                            <AlertCircle className="w-4 h-4 mr-1" />
                                                            {errors.phoneno}
                                                        </motion.p>
                                                    )}
                                                </AnimatePresence>
                                            </div>
                                        </motion.div>
                                    </div>
                                </motion.div>

                                {/* Address Information Section */}
                                <motion.div variants={itemVariants} className="space-y-6">
                                    <div className="flex items-center mb-2">
                                        <div className="bg-primary/10 p-3 rounded-xl mr-4">
                                            <MapPin className="w-7 h-7 text-primary" />
                                        </div>
                                        <div>
                                            <h3 className="text-xl font-bold text-foreground">Delivery Address</h3>
                                            <p className="text-muted-foreground">Where should we deliver?</p>
                                        </div>
                                    </div>

                                    <motion.div variants={itemVariants} className="space-y-3">
                                        <Label htmlFor="streetname" className="text-foreground font-medium">
                                            Street Name <span className="text-red-500">*</span>
                                        </Label>
                                        <Input
                                            id="streetname"
                                            name="streetname"
                                            type="text"
                                            placeholder="Enter street name, road, or locality"
                                            value={formData.streetname || ''}
                                            onChange={handleInputChange}
                                            ref={(el) => (formRefs.current.streetname = el)}
                                            className={`h-12 text-base transition-all duration-200 ${
                                                errors.streetname 
                                                    ? 'border-red-500 focus:border-red-500 focus:ring-red-500/20' 
                                                    : 'border-input focus:border-primary focus:ring-2 focus:ring-primary/20'
                                            }`}
                                        />
                                        <AnimatePresence>
                                            {errors.streetname && (
                                                <motion.p 
                                                    initial={{ opacity: 0, y: -10 }}
                                                    animate={{ opacity: 1, y: 0 }}
                                                    exit={{ opacity: 0, y: -10 }}
                                                    className="text-red-500 text-sm mt-2 flex items-center"
                                                >
                                                    <AlertCircle className="w-4 h-4 mr-1" />
                                                    {errors.streetname}
                                                </motion.p>
                                            )}
                                        </AnimatePresence>
                                    </motion.div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <motion.div variants={itemVariants} className="space-y-3">
                                            <Label htmlFor="houseno" className="text-foreground font-medium">
                                                House/Flat Number <span className="text-red-500">*</span>
                                            </Label>
                                            <div className="relative group">
                                                <Home className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                                                <Input
                                                    id="houseno"
                                                    name="houseno"
                                                    type="text"
                                                    placeholder="Flat/Door No."
                                                    className={`h-12 pl-12 pr-4 text-base transition-all duration-200 ${
                                                        errors.houseno 
                                                            ? 'border-red-500 focus:border-red-500 focus:ring-red-500/20' 
                                                            : 'border-input focus:border-primary focus:ring-2 focus:ring-primary/20'
                                                    }`}
                                                    value={formData.houseno || ''}
                                                    onChange={handleInputChange}
                                                    ref={(el) => (formRefs.current.houseno = el)}
                                                />
                                                <AnimatePresence>
                                                    {errors.houseno && (
                                                        <motion.p 
                                                            initial={{ opacity: 0, y: -10 }}
                                                            animate={{ opacity: 1, y: 0 }}
                                                            exit={{ opacity: 0, y: -10 }}
                                                            className="text-red-500 text-sm mt-2 flex items-center"
                                                        >
                                                            <AlertCircle className="w-4 h-4 mr-1" />
                                                            {errors.houseno}
                                                        </motion.p>
                                                    )}
                                                </AnimatePresence>
                                            </div>
                                        </motion.div>

                                        <motion.div variants={itemVariants} className="space-y-3">
                                            <Label htmlFor="area" className="text-foreground font-medium">
                                                Area <span className="text-red-500">*</span>
                                            </Label>
                                            <Select
                                                options={options}
                                                value={options.find((opt) => opt.value === selectedArea) || null}
                                                onChange={(selected) => {
                                                    setSelectedArea(selected?.value || null);
                                                    setErrors(prev => ({ ...prev, area: '' }));
                                                }}
                                                placeholder="Select your area"
                                                className="w-full"
                                                styles={{
                                                    control: (base, state) => ({
                                                        ...base,
                                                        borderRadius: '0.75rem',
                                                        borderColor: errors.area ? '#ef4444' : state.isFocused ? '#3b82f6' : '#e5e7eb',
                                                        borderWidth: '2px',
                                                        padding: '8px 12px',
                                                        minHeight: '48px',
                                                        backgroundColor: 'hsl(var(--card))',
                                                        boxShadow: state.isFocused ? '0 0 0 3px rgba(59, 130, 246, 0.1)' : 'none',
                                                        transition: 'all 0.2s ease',
                                                        '&:hover': {
                                                            borderColor: errors.area ? '#ef4444' : '#3b82f6'
                                                        }
                                                    }),
                                                    placeholder: (base) => ({
                                                        ...base,
                                                        color: 'hsl(var(--muted-foreground))'
                                                    }),
                                                    singleValue: (base) => ({
                                                        ...base,
                                                        color: 'hsl(var(--foreground))'
                                                    }),
                                                    menu: (base) => ({
                                                        ...base,
                                                        backgroundColor: 'hsl(var(--card))',
                                                        border: '2px solid hsl(var(--border))',
                                                        borderRadius: '0.75rem',
                                                        overflow: 'hidden'
                                                    }),
                                                    option: (base, state) => ({
                                                        ...base,
                                                        backgroundColor: state.isSelected ? 'hsl(var(--primary))' : state.isFocused ? 'hsl(var(--secondary))' : 'transparent',
                                                        color: state.isSelected ? 'hsl(var(--primary-foreground))' : 'hsl(var(--foreground))',
                                                        padding: '12px 16px',
                                                        cursor: 'pointer',
                                                        '&:active': {
                                                            backgroundColor: 'hsl(var(--primary))'
                                                        }
                                                    })
                                                }}
                                            />
                                            <AnimatePresence>
                                                {errors.area && (
                                                    <motion.p 
                                                        initial={{ opacity: 0, y: -10 }}
                                                        animate={{ opacity: 1, y: 0 }}
                                                        exit={{ opacity: 0, y: -10 }}
                                                        className="text-red-500 text-sm mt-2 flex items-center"
                                                    >
                                                        <AlertCircle className="w-4 h-4 mr-1" />
                                                        {errors.area}
                                                    </motion.p>
                                                )}
                                            </AnimatePresence>
                                        </motion.div>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <motion.div variants={itemVariants} className="space-y-3">
                                            <Label htmlFor="city" className="text-foreground font-medium">
                                                City <span className="text-red-500">*</span>
                                            </Label>
                                            <Input
                                                id="city"
                                                name="city"
                                                type="text"
                                                placeholder="Chennai"
                                                value={formData.city || ''}
                                                onChange={handleInputChange}
                                                ref={(el) => (formRefs.current.city = el)}
                                                className={`h-12 text-base transition-all duration-200 ${
                                                    errors.city 
                                                        ? 'border-red-500 focus:border-red-500 focus:ring-red-500/20' 
                                                        : 'border-input focus:border-primary focus:ring-2 focus:ring-primary/20'
                                                }`}
                                            />
                                            <AnimatePresence>
                                                {errors.city && (
                                                    <motion.p 
                                                        initial={{ opacity: 0, y: -10 }}
                                                        animate={{ opacity: 1, y: 0 }}
                                                        exit={{ opacity: 0, y: -10 }}
                                                        className="text-red-500 text-sm mt-2 flex items-center"
                                                    >
                                                        <AlertCircle className="w-4 h-4 mr-1" />
                                                        {errors.city}
                                                    </motion.p>
                                                )}
                                            </AnimatePresence>
                                        </motion.div>

                                        <motion.div variants={itemVariants} className="space-y-3">
                                            <Label htmlFor="pincode" className="text-foreground font-medium">
                                                Pincode <span className="text-red-500">*</span>
                                            </Label>
                                            <div className="relative group">
                                                <Navigation className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                                                <Input
                                                    id="pincode"
                                                    name="pincode"
                                                    type="text"
                                                    placeholder="600045"
                                                    maxLength={6}
                                                    value={formData.pincode || ''}
                                                    onChange={handleInputChange}
                                                    ref={(el) => (formRefs.current.pincode = el)}
                                                    className={`h-12 pl-12 pr-4 text-base transition-all duration-200 ${
                                                        errors.pincode 
                                                            ? 'border-red-500 focus:border-red-500 focus:ring-red-500/20' 
                                                            : 'border-input focus:border-primary focus:ring-2 focus:ring-primary/20'
                                                    }`}
                                                />
                                                <AnimatePresence>
                                                    {errors.pincode && (
                                                        <motion.p 
                                                            initial={{ opacity: 0, y: -10 }}
                                                            animate={{ opacity: 1, y: 0 }}
                                                            exit={{ opacity: 0, y: -10 }}
                                                            className="text-red-500 text-sm mt-2 flex items-center"
                                                        >
                                                            <AlertCircle className="w-4 h-4 mr-1" />
                                                            {errors.pincode}
                                                        </motion.p>
                                                    )}
                                                </AnimatePresence>
                                            </div>
                                        </motion.div>
                                    </div>
                                </motion.div>

                                {/* Action Buttons */}
                                <motion.div 
                                    variants={itemVariants}
                                    className="pt-6 space-y-6"
                                >
                                    <Button
                                        type="submit"
                                        disabled={isLoading || isSubmitting}
                                        className="w-full py-3 text-lg font-bold bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary shadow-lg hover:shadow-xl transition-all duration-300 group"
                                    >
                                        {isLoading ? (
                                            <span className="flex items-center justify-center">
                                                <motion.div
                                                    animate={{ rotate: 360 }}
                                                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                                                    className="w-5 h-5 border-2 border-white border-t-transparent rounded-full mr-2"
                                                />
                                                Confirming Address...
                                            </span>
                                        ) : (
                                            <span className="flex items-center justify-center">
                                                <CheckCircle className="w-5 h-5 mr-2" />
                                                Confirm Delivery Address
                                                <ChevronRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                                            </span>
                                        )}
                                    </Button>

                                    <motion.div 
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        transition={{ delay: 0.2 }}
                                        className="text-center"
                                    >
                                        <p className="text-muted-foreground">
                                            Need to change slot or number of clothes?{' '}
                                            <Link 
                                                to="/customer/book-slot" 
                                                className="text-primary hover:underline font-semibold inline-flex items-center group"
                                            >
                                                <ArrowLeft className="w-4 h-4 mr-1 group-hover:-translate-x-1 transition-transform" />
                                                Go Back
                                            </Link>
                                        </p>
                                    </motion.div>
                                </motion.div>
                            </form>
                        </Card>
                    </motion.div>
                </motion.div>
            </div>
        </motion.div>
    );
};

export default Confirmaddress;