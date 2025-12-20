import { useContext, useState, useEffect } from 'react';
import { Button } from '../../components/ui/button';
import { Card } from '../../components/ui/card';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { 
  User, Mail, Phone, MapPin, Home, Eye, CalendarCheck, 
  Shirt, ShirtIcon, Calendar, Package, ShoppingBasket, 
  ShoppingCart, Clock, Wallet, CreditCard, Banknote, 
  BanknoteIcon, LucideBanknote, Coins, HandCoinsIcon, 
  ListOrdered, Receipt, FileText, LucideShirt, 
  ShoppingBasketIcon, Truck, CheckCircle, AlertCircle,
  ChevronRight, Info, X
} from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from "react-toastify";
import { SteamContext } from '../../hooks/steamcontext';
import { API_URL } from '../../hooks/tools';
import Select from "react-select";
import { motion, AnimatePresence } from 'framer-motion';

const Ordersummary = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [showTerms, setShowTerms] = useState(false);
    const [acceptedTerms, setAcceptedTerms] = useState(false);
    const steamcontext = useContext(SteamContext);
    const { formData, setFormData, orderdetails, setorderdetails } = steamcontext;

    const navigate = useNavigate();

    useEffect(() => {
        const checkdetails = localStorage.getItem('orderdetails');
        if (checkdetails) {
            setorderdetails(JSON.parse(checkdetails));
        }
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        if (!acceptedTerms) {
            toast.error('Please accept the terms and conditions to proceed');
            return;
        }

        setIsLoading(true);
        try {
            const res = await fetch(`${API_URL}/orders/createorder`, {
                method: 'POST',
                headers: {
                    'content-type': 'application/json'
                },
                body: JSON.stringify(orderdetails),
                credentials: 'include',
            });

            const data = await res.json();

            if (data?.error) {
                toast.error(data?.error);
                return;
            }

            localStorage.removeItem('orderdetails');
            toast.success(data?.message);
            navigate('/');
        } catch (error) {
            toast.error('Something went wrong. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    const TermsAndConditionsModal = () => (
        <AnimatePresence>
            {showTerms && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4"
                    onClick={() => setShowTerms(false)}
                >
                    <motion.div
                        initial={{ scale: 0.9, y: 20 }}
                        animate={{ scale: 1, y: 0 }}
                        exit={{ scale: 0.9, y: 20 }}
                        className="bg-card max-w-2xl w-full max-h-[80vh] overflow-y-auto rounded-2xl shadow-2xl border"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="sticky top-0 bg-card border-b p-6 flex justify-between items-center">
                            <div className="flex items-center space-x-3">
                                <div className="bg-primary/10 p-2 rounded-lg">
                                    <FileText className="w-6 h-6 text-primary" />
                                </div>
                                <div>
                                    <h2 className="text-2xl font-bold text-foreground">Terms & Conditions</h2>
                                    <p className="text-muted-foreground text-sm">Please read carefully before proceeding</p>
                                </div>
                            </div>
                            <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => setShowTerms(false)}
                                className="rounded-full hover:bg-muted"
                            >
                                <X className="w-5 h-5" />
                            </Button>
                        </div>
                        
                        <div className="p-6 space-y-6">
                            {[
                                {
                                    title: "Garment Condition & Damage",
                                    content: "Not responsible for colour fade, shrinkage, weak fabric, loose threads, or pre-existing stains."
                                },
                                {
                                    title: "Valuables in Clothing",
                                    content: "Remove cash, wallet, jewellery, rings, gold, keys, cards, earphones, or documents. Steemer is not responsible for any items left in pockets."
                                },
                                {
                                    title: "Special / Delicate Garments",
                                    content: "No liability for damage to delicate fabrics, embroidery, sequins, stones, or printed designs."
                                },
                                {
                                    title: "Stain Disclaimer",
                                    content: "No guarantee for stain removal; stains may remain based on fabric type."
                                },
                                {
                                    title: "Garment Count Verification",
                                    content: "Customer must confirm garment count during pickup. Not responsible for missing items if count is not checked."
                                },
                                {
                                    title: "Pickup & Delivery Check",
                                    content: "Please check clothes immediately at delivery and report issues instantly."
                                },
                                {
                                    title: "Timings & Delays",
                                    content: "Delivery time may vary due to traffic, weather, or operational reasons."
                                },
                                {
                                    title: "Garment Preparation",
                                    content: "Clothes must be clean, dry, and ready for pickup."
                                },
                                {
                                    title: "Order Confirmation",
                                    content: "Placing an order means you accept all Steemer service terms."
                                }
                            ].map((term, index) => (
                                <motion.div
                                    key={index}
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: index * 0.05 }}
                                    className="bg-secondary/30 p-4 rounded-xl border-l-4 border-primary"
                                >
                                    <h3 className="font-bold text-foreground mb-2 flex items-center">
                                        <AlertCircle className="w-4 h-4 mr-2 text-primary" />
                                        {term.title}
                                    </h3>
                                    <p className="text-muted-foreground">{term.content}</p>
                                </motion.div>
                            ))}
                        </div>
                        
                        <div className="sticky bottom-0 bg-card border-t p-6">
                            <Button
                                onClick={() => {
                                    setAcceptedTerms(true);
                                    setShowTerms(false);
                                }}
                                className="w-full py-3 text-lg font-semibold"
                            >
                                <CheckCircle className="w-5 h-5 mr-2" />
                                I Accept All Terms & Conditions
                            </Button>
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );

    return (
        <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="min-h-screen bg-gradient-to-br 
            from-secondary/10 via-background 
            bg-gray-100
            to-primary/5 py-20"
        >
            <TermsAndConditionsModal />
            
            <div className="container mx-auto px-4">
                <motion.div 
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.2 }}
                    className="max-w-2xl mx-auto"
                >
                    <div className="text-center mb-12">
                        <motion.div 
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ delay: 0.3, type: "spring" }}
                            className="bg-gradient-to-r from-primary to-primary/80 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg shadow-primary/20"
                        >
                            <ShoppingCart className="w-10 h-10 text-white" />
                        </motion.div>
                        <motion.h1 
                            initial={{ y: 10, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ delay: 0.4 }}
                            className="text-4xl font-bold text-foreground mb-3 bg-gradient-to-r from-foreground to-foreground/80 bg-clip-text text-transparent"
                        >
                            Order Summary
                        </motion.h1>
                        <motion.p 
                            initial={{ y: 10, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ delay: 0.5 }}
                            className="text-muted-foreground text-lg"
                        >
                            Review your order details before confirmation
                        </motion.p>
                    </div>

                    {/* Order Details Card */}
                    <motion.div
                        initial={{ y: 20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: 0.6 }}
                    >
                        <Card className="p-8 mb-6 border-2 border-primary/10 shadow-xl hover:shadow-2xl transition-all duration-300 rounded-2xl bg-gradient-to-br from-card to-card/95">
                            <div className="flex items-center mb-6">
                                <div className="bg-primary/10 p-3 rounded-xl mr-4">
                                    <ShoppingBasketIcon className="w-7 h-7 text-primary" />
                                </div>
                                <div>
                                    <h3 className="text-xl font-bold text-foreground">Cloth & Slot Details</h3>
                                    <p className="text-muted-foreground">Your order specifications</p>
                                </div>
                            </div>

                            <div className="space-y-4">
                                {[
                                    { label: 'No of Cloths', value: `${orderdetails?.otherdetails?.totalcloths} Nos`, icon: Shirt },
                                    { label: 'Selected Slot', value: orderdetails?.otherdetails?.timeslot, icon: Clock },
                                    { label: 'Payment Type', value: orderdetails?.otherdetails?.paymenttype, icon: CreditCard },
                                    { label: 'Total Amount', value: `₹${orderdetails?.otherdetails?.totalamount}`, icon: BanknoteIcon }
                                ].map((item, index) => (
                                    <motion.div
                                        key={item.label}
                                        initial={{ x: -20, opacity: 0 }}
                                        animate={{ x: 0, opacity: 1 }}
                                        transition={{ delay: 0.7 + index * 0.1 }}
                                        className="flex justify-between items-center p-4 rounded-xl bg-secondary/20 hover:bg-secondary/30 transition-colors"
                                    >
                                        <div className="flex items-center space-x-3">
                                            <div className="bg-primary/10 p-2 rounded-lg">
                                                <item.icon className="w-4 h-4 text-primary" />
                                            </div>
                                            <span className="font-medium text-foreground">{item.label}</span>
                                        </div>
                                        <span className="font-bold text-lg text-foreground">{item.value}</span>
                                    </motion.div>
                                ))}
                            </div>
                        </Card>
                    </motion.div>

                    {/* Delivery Details Card */}
                    <motion.div
                        initial={{ y: 20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: 0.8 }}
                    >
                        <Card className="p-8 mb-6 border-2 border-primary/10 shadow-xl hover:shadow-2xl transition-all duration-300 rounded-2xl bg-gradient-to-br from-card to-card/95">
                            <div className="flex items-center mb-6">
                                <div className="bg-primary/10 p-3 rounded-xl mr-4">
                                    <Truck className="w-7 h-7 text-primary" />
                                </div>
                                <div>
                                    <h3 className="text-xl font-bold text-foreground">Delivery Details</h3>
                                    <p className="text-muted-foreground">Where we'll deliver your order</p>
                                </div>
                            </div>

                            <div className="space-y-6">
                                <motion.div
                                    initial={{ x: -20, opacity: 0 }}
                                    animate={{ x: 0, opacity: 1 }}
                                    transition={{ delay: 0.9 }}
                                    className="flex items-start space-x-4 p-4 rounded-xl bg-secondary/20"
                                >
                                    <User className="w-5 h-5 text-primary mt-1 flex-shrink-0" />
                                    <div>
                                        <h4 className="font-bold text-foreground text-lg">{orderdetails?.userdetails?.name}</h4>
                                        <p className="text-muted-foreground flex items-center mt-1">
                                            <Phone className="w-4 h-4 mr-2" />
                                            {orderdetails?.userdetails?.phoneno}
                                        </p>
                                    </div>
                                </motion.div>

                                <motion.div
                                    initial={{ x: -20, opacity: 0 }}
                                    animate={{ x: 0, opacity: 1 }}
                                    transition={{ delay: 1 }}
                                    className="p-4 rounded-xl bg-secondary/20"
                                >
                                    <div className="flex items-center mb-3">
                                        <MapPin className="w-5 h-5 text-primary mr-2" />
                                        <h4 className="font-bold text-foreground">Address</h4>
                                    </div>
                                    <div className="ml-7 space-y-1">
                                        <p className="text-foreground">
                                            {orderdetails?.userdetails?.houseno}, {orderdetails?.userdetails?.streetname}
                                        </p>
                                        <p className="text-foreground">{orderdetails?.userdetails?.area}</p>
                                        <p className="text-foreground font-medium">
                                            {orderdetails?.userdetails?.city} - {orderdetails?.userdetails?.pincode}
                                        </p>
                                    </div>
                                </motion.div>
                            </div>
                        </Card>
                    </motion.div>

                    {/* Terms & Conditions Section */}
                    <motion.div
                        initial={{ y: 20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: 1.1 }}
                    >
                        <Card className="p-8 mb-6 border-2 border-secondary/30 rounded-2xl">
                            <div className="flex items-center justify-between mb-4">
                                <div className="flex items-center space-x-3">
                                    <div className="bg-secondary/20 p-2 rounded-lg">
                                        <FileText className="w-5 h-5 text-foreground" />
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-foreground">Terms & Conditions</h3>
                                        <p className="text-sm text-muted-foreground">Important service terms</p>
                                    </div>
                                </div>
                                <Button
                                    variant="outline"
                                    onClick={() => setShowTerms(true)}
                                    className="group hover:bg-primary hover:text-primary-foreground transition-all"
                                >
                                    <Info className="w-4 h-4 mr-2" />
                                    View Terms
                                    <ChevronRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                                </Button>
                            </div>

                            <div className="flex items-center p-4 rounded-lg bg-secondary/20">
                                <input
                                    type="checkbox"
                                    id="acceptTerms"
                                    checked={acceptedTerms}
                                    onChange={(e) => setAcceptedTerms(e.target.checked)}
                                    className="w-5 h-5 rounded border-2 border-primary text-primary focus:ring-primary focus:ring-offset-2 focus:ring-2 focus:ring-offset-background"
                                />
                                <label htmlFor="acceptTerms" className="ml-3 text-foreground cursor-pointer">
                                    I accept all{' '}
                                    <button
                                        type="button"
                                        onClick={() => setShowTerms(true)}
                                        className="text-primary hover:underline font-medium"
                                    >
                                        Terms & Conditions
                                    </button>
                                </label>
                            </div>

                            {!acceptedTerms && (
                                <motion.p
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    className="text-destructive text-sm mt-2 flex items-center"
                                >
                                    <AlertCircle className="w-4 h-4 mr-1" />
                                    You must accept the terms to place your order
                                </motion.p>
                            )}
                        </Card>
                    </motion.div>

                    {/* Action Buttons */}
                    <motion.div
                        initial={{ y: 20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: 1.2 }}
                        className="flex flex-col sm:flex-row gap-4"
                    >
                        <Button
                            variant="outline"
                            onClick={() => navigate(-1)}
                            className="flex-1 py-3 text-lg border-2 hover:bg-secondary/50 transition-all"
                        >
                            Back to Edit
                        </Button>
                        <Button
                            onClick={handleSubmit}
                            disabled={isLoading || !acceptedTerms}
                            className={`flex-1 py-3 text-lg font-bold transition-all ${
                                !acceptedTerms 
                                    ? 'bg-muted text-muted-foreground cursor-not-allowed' 
                                    : 'bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary shadow-lg hover:shadow-xl'
                            }`}
                        >
                            {isLoading ? (
                                <span className="flex items-center justify-center">
                                    <motion.div
                                        animate={{ rotate: 360 }}
                                        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                                        className="w-5 h-5 border-2 border-white border-t-transparent rounded-full mr-2"
                                    />
                                    Processing Order...
                                </span>
                            ) : (
                                <span className="flex items-center justify-center">
                                    <CheckCircle className="w-5 h-5 mr-2" />
                                    Place Order Now
                                </span>
                            )}
                        </Button>
                    </motion.div>
                </motion.div>
            </div>
        </motion.div>
    );
};

export default Ordersummary;