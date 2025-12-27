import { useContext, useState, useEffect } from 'react';
import { Button } from '../../components/ui/button';
import { Card } from '../../components/ui/card';
import { 
  User, Phone, MapPin, Shirt, ShoppingCart, 
  Clock, CreditCard, BanknoteIcon, Receipt, 
  ShoppingBasketIcon, Truck, CheckCircle, AlertCircle,
  ChevronRight, Info, X, FileText, Plus, Minus, Tag,
  Package, Calendar, Shield, Sparkles, BadgeCheck
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { toast } from "react-toastify";
import { SteamContext } from '../../hooks/steamcontext';
import { API_URL } from '../../hooks/tools';
import { motion, AnimatePresence } from 'framer-motion';

const Ordersummary = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [showTerms, setShowTerms] = useState(false);
    const [acceptedTerms, setAcceptedTerms] = useState(false);
    const steamcontext = useContext(SteamContext);
    const { orderdetails, setorderdetails } = steamcontext;
    const [localOrderDetails, setLocalOrderDetails] = useState<any>(null);
    const [showFullAddress, setShowFullAddress] = useState(false);

    const navigate = useNavigate();

    useEffect(() => {
        const checkdetails = localStorage.getItem('orderdetails');
        if (checkdetails) {
            const parsedDetails = JSON.parse(checkdetails);
            setLocalOrderDetails(parsedDetails);
            setorderdetails(parsedDetails);
        } else {
            toast.error('No order details found. Please start over.');
            navigate('/customer/bookslot');
        }
    }, []);

    // Format data for API
    const prepareApiData = () => {
        if (!localOrderDetails) return null;

        return {
            userdetails: {
                area: localOrderDetails?.userdetails?.area || '',
                city: localOrderDetails?.userdetails?.city || '',
                houseno: localOrderDetails?.userdetails?.houseno || '',
                name: localOrderDetails?.userdetails?.name || '',
                phoneno: localOrderDetails?.userdetails?.phoneno || '',
                pincode: localOrderDetails?.userdetails?.pincode || '',
                streetname: localOrderDetails?.userdetails?.streetname || ''
            },
            otherdetails: {
                paymenttype: localOrderDetails?.otherdetails?.paymenttype || '',
                timeslot: localOrderDetails?.otherdetails?.timeslot || '',
                totalamount: String(localOrderDetails?.otherdetails?.totalamount || '0'),
                totalcloths: String(localOrderDetails?.otherdetails?.totalcloths || '0'),
                deliverySpeed: localOrderDetails?.otherdetails?.deliverySpeed || 'normal'
            },
            order_cloths: localOrderDetails?.order_cloths || []
        };
    };

    const calculateItemTotal = (cost: string, quantity: string) => {
        return Number(cost) * Number(quantity);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        if (!acceptedTerms) {
            toast.error('Please accept the terms and conditions to proceed');
            return;
        }

        const apiData = prepareApiData();
        if (!apiData) {
            toast.error('Order details are incomplete');
            return;
        }

        // Validate required fields
        if (!apiData.userdetails.name || !apiData.userdetails.phoneno || 
            !apiData.userdetails.houseno || !apiData.userdetails.pincode) {
            toast.error('Please complete your address details');
            navigate('/customer/confirmaddress');
            return;
        }

        if (!apiData.otherdetails.paymenttype || !apiData.otherdetails.timeslot) {
            toast.error('Order details are incomplete');
            navigate('/customer/bookslot');
            return;
        }

        if (!apiData.order_cloths || apiData.order_cloths.length === 0) {
            toast.error('No items selected');
            navigate('/customer/bookslot');
            return;
        }

        setIsLoading(true);
        try {
            const res = await fetch(`${API_URL}/orders/createorder`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(apiData),
                credentials: 'include',
            });

            const data = await res.json();

            if (res.status === 401) {
                toast.error('Please login to place an order');
                navigate('/login');
                return;
            }

            if (!res.ok) {
                throw new Error(data?.error || 'Failed to create order');
            }

            if (data?.error) {
                toast.error(data.error);
                return;
            }

            // Clear localStorage and context
            localStorage.removeItem('orderdetails');
            setorderdetails(null);
            
            toast.success('Order placed successfully!');
            navigate('/customer/ordertrack');
        } catch (error: any) {
            console.error('Order creation error:', error);
            toast.error(error.message || 'Something went wrong. Please try again.');
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
                    className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-2 sm:p-4"
                    onClick={() => setShowTerms(false)}
                >
                    <motion.div
                        initial={{ scale: 0.9, y: 20 }}
                        animate={{ scale: 1, y: 0 }}
                        exit={{ scale: 0.9, y: 20 }}
                        className="bg-card w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-xl sm:rounded-2xl shadow-2xl border"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="sticky top-0 bg-card border-b p-4 sm:p-6 flex justify-between items-center">
                            <div className="flex items-center space-x-2 sm:space-x-3">
                                <div className="bg-primary/10 p-1 sm:p-2 rounded-lg">
                                    <FileText className="w-4 h-4 sm:w-6 sm:h-6 text-primary" />
                                </div>
                                <div>
                                    <h2 className="text-lg sm:text-2xl font-bold text-foreground">Terms & Conditions</h2>
                                    <p className="text-xs sm:text-sm text-muted-foreground">Please read carefully before proceeding</p>
                                </div>
                            </div>
                            <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => setShowTerms(false)}
                                className="rounded-full hover:bg-muted h-8 w-8 sm:h-10 sm:w-10"
                            >
                                <X className="w-3 h-3 sm:w-5 sm:h-5" />
                            </Button>
                        </div>
                        
                        <div className="p-4 sm:p-6 space-y-4 sm:space-y-6">
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
                                    className="bg-secondary/30 p-3 sm:p-4 rounded-lg sm:rounded-xl border-l-2 sm:border-l-4 border-primary"
                                >
                                    <h3 className="font-bold text-foreground text-sm sm:text-base mb-1 sm:mb-2 flex items-center">
                                        <AlertCircle className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2 text-primary" />
                                        {term.title}
                                    </h3>
                                    <p className="text-muted-foreground text-xs sm:text-sm">{term.content}</p>
                                </motion.div>
                            ))}
                        </div>
                        
                        <div className="sticky bottom-0 bg-card border-t p-4 sm:p-6">
                            <Button
                                onClick={() => {
                                    setAcceptedTerms(true);
                                    setShowTerms(false);
                                }}
                                className="w-full py-2 sm:py-3 text-sm sm:text-lg font-semibold"
                            >
                                <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
                                I Accept All Terms & Conditions
                            </Button>
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );

    // Show loading if no data
    if (!localOrderDetails) {
        return (
            <div className="min-h-screen flex items-center justify-center p-4">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
                    <p className="text-muted-foreground">Loading order details...</p>
                </div>
            </div>
        );
    }

    return (
        <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="min-h-screen bg-gradient-to-br from-secondary/10 via-background to-primary/5 py-8 sm:py-12 md:py-20"
        >
            <TermsAndConditionsModal />
            
            <div className="container mx-auto px-3 sm:px-4">
                <motion.div 
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.2 }}
                    className="max-w-2xl mx-auto"
                >
                    {/* Header */}
                    <div className="text-center mb-8 sm:mb-12">
                        <motion.div 
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ delay: 0.3, type: "spring" }}
                            className="bg-gradient-to-r from-primary to-primary/80 w-16 h-16 sm:w-20 sm:h-20 rounded-full flex items-center justify-center mx-auto mb-4 sm:mb-6 shadow-lg shadow-primary/20"
                        >
                            <ShoppingCart className="w-8 h-8 sm:w-10 sm:h-10 text-white" />
                        </motion.div>
                        <motion.h1 
                            initial={{ y: 10, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ delay: 0.4 }}
                            className="text-2xl sm:text-3xl md:text-4xl font-bold text-foreground mb-2 sm:mb-3 bg-gradient-to-r from-foreground to-foreground/80 bg-clip-text text-transparent"
                        >
                            Order Summary
                        </motion.h1>
                        <motion.p 
                            initial={{ y: 10, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ delay: 0.5 }}
                            className="text-muted-foreground text-sm sm:text-base md:text-lg"
                        >
                            Review your order before confirmation
                        </motion.p>
                    </div>

                    {/* Items Details Card */}
                    {localOrderDetails?.order_cloths && localOrderDetails.order_cloths.length > 0 && (
                        <motion.div
                            initial={{ y: 20, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ delay: 0.6 }}
                        >
                            <Card className="p-4 sm:p-6 md:p-8 mb-4 sm:mb-6 border-2 border-primary/10 shadow-lg hover:shadow-xl transition-all duration-300 rounded-xl sm:rounded-2xl bg-gradient-to-br from-card to-card/95">
                                <div className="flex items-center mb-4 sm:mb-6">
                                    <div className="bg-primary/10 p-2 sm:p-3 rounded-lg sm:rounded-xl mr-3 sm:mr-4">
                                        <ShoppingBasketIcon className="w-5 h-5 sm:w-6 sm:h-6 md:w-7 md:h-7 text-primary" />
                                    </div>
                                    <div>
                                        <h3 className="text-lg sm:text-xl md:text-2xl font-bold text-foreground">Selected Items</h3>
                                        <p className="text-muted-foreground text-xs sm:text-sm">Your order items</p>
                                    </div>
                                </div>

                                <div className="space-y-2 sm:space-y-3">
                                    {localOrderDetails.order_cloths.map((item: any, index: number) => (
                                        <motion.div
                                            key={index}
                                            initial={{ x: -20, opacity: 0 }}
                                            animate={{ x: 0, opacity: 1 }}
                                            transition={{ delay: 0.7 + index * 0.05 }}
                                            className="flex justify-between items-start sm:items-center p-3 sm:p-4 rounded-lg sm:rounded-xl bg-secondary/20 hover:bg-secondary/30 transition-colors"
                                        >
                                            <div className="flex items-start space-x-2 sm:space-x-3">
                                                <div className="bg-primary/10 p-1.5 sm:p-2 rounded-lg flex-shrink-0">
                                                    <Shirt className="w-3 h-3 sm:w-4 sm:h-4 text-primary" />
                                                </div>
                                                <div className="min-w-0">
                                                    <span className="font-medium text-foreground text-sm sm:text-base block truncate">
                                                        {item.item}
                                                    </span>
                                                    <div className="flex items-center space-x-2 mt-1">
                                                        <span className="text-xs sm:text-sm text-muted-foreground bg-secondary px-2 py-0.5 rounded-full">
                                                            {item.quantity} × ₹{item.cost}
                                                        </span>
                                                        <span className="text-xs sm:text-sm font-medium text-primary hidden sm:inline">
                                                            = ₹{calculateItemTotal(item.cost, item.quantity)}
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="flex flex-col items-end">
                                                <span className="font-bold text-foreground text-sm sm:text-base md:text-lg">
                                                    ₹{calculateItemTotal(item.cost, item.quantity)}
                                                </span>
                                                <span className="text-xs text-muted-foreground mt-0.5 sm:hidden">
                                                    {item.quantity} × ₹{item.cost}
                                                </span>
                                            </div>
                                        </motion.div>
                                    ))}

                                    {/* Items Summary */}
                                    <div className="pt-3 sm:pt-4 border-t border-secondary/30">
                                        <div className="flex justify-between items-center px-2">
                                            <div className="flex items-center space-x-2">
                                                <Tag className="w-3 h-3 sm:w-4 sm:h-4 text-primary" />
                                                <span className="text-xs sm:text-sm font-medium text-muted-foreground">
                                                    Total Items
                                                </span>
                                            </div>
                                            <span className="font-bold text-foreground text-sm sm:text-base">
                                                {localOrderDetails?.otherdetails?.totalcloths || '0'} Items
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </Card>
                        </motion.div>
                    )}

                    {/* Order Summary Card */}
                    <motion.div
                        initial={{ y: 20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: 0.8 }}
                    >
                        <Card className="p-4 sm:p-6 md:p-8 mb-4 sm:mb-6 border-2 border-primary/10 shadow-lg hover:shadow-xl transition-all duration-300 rounded-xl sm:rounded-2xl bg-gradient-to-br from-card to-card/95">
                            <div className="flex items-center mb-4 sm:mb-6">
                                <div className="bg-primary/10 p-2 sm:p-3 rounded-lg sm:rounded-xl mr-3 sm:mr-4">
                                    <Receipt className="w-5 h-5 sm:w-6 sm:h-6 md:w-7 md:h-7 text-primary" />
                                </div>
                                <div>
                                    <h3 className="text-lg sm:text-xl md:text-2xl font-bold text-foreground">Order Summary</h3>
                                    <p className="text-muted-foreground text-xs sm:text-sm">Your order specifications</p>
                                </div>
                            </div>

                            <div className="space-y-3 sm:space-y-4">
                                {[
                                    { 
                                        label: 'Selected Slot', 
                                        value: localOrderDetails?.otherdetails?.timeslot || 'Not selected', 
                                        icon: Clock,
                                        color: 'text-blue-600'
                                    },
                                    { 
                                        label: 'Payment Type', 
                                        value: localOrderDetails?.otherdetails?.paymenttype || 'Not selected', 
                                        icon: CreditCard,
                                        color: 'text-green-600'
                                    },
                                    { 
                                        label: 'Delivery Speed', 
                                        value: localOrderDetails?.otherdetails?.deliverySpeed || 'normal', 
                                        icon: Truck,
                                        color: 'text-purple-600'
                                    },
                                    { 
                                        label: 'Total Amount', 
                                        value: `₹${localOrderDetails?.otherdetails?.totalamount || '0'}`, 
                                        icon: BanknoteIcon,
                                        color: 'text-primary'
                                    }
                                ].map((item, index) => (
                                    <motion.div
                                        key={item.label}
                                        initial={{ x: -20, opacity: 0 }}
                                        animate={{ x: 0, opacity: 1 }}
                                        transition={{ delay: 0.9 + index * 0.1 }}
                                        className="flex justify-between items-center p-3 sm:p-4 rounded-lg sm:rounded-xl bg-secondary/20 hover:bg-secondary/30 transition-colors"
                                    >
                                        <div className="flex items-center space-x-2 sm:space-x-3">
                                            <div className={`bg-primary/10 p-1.5 sm:p-2 rounded-lg ${item.color}`}>
                                                <item.icon className="w-3 h-3 sm:w-4 sm:h-4" />
                                            </div>
                                            <span className="font-medium text-foreground text-sm sm:text-base">{item.label}</span>
                                        </div>
                                        <span className={`font-bold text-sm sm:text-base md:text-lg ${item.label === 'Total Amount' ? 'text-primary' : 'text-foreground'}`}>
                                            {item.value}
                                        </span>
                                    </motion.div>
                                ))}
                            </div>
                        </Card>
                    </motion.div>

                    {/* Delivery Details Card */}
                    <motion.div
                        initial={{ y: 20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: 1 }}
                    >
                        <Card className="p-4 sm:p-6 md:p-8 mb-4 sm:mb-6 border-2 border-primary/10 shadow-lg hover:shadow-xl transition-all duration-300 rounded-xl sm:rounded-2xl bg-gradient-to-br from-card to-card/95">
                            <div className="flex items-center mb-4 sm:mb-6">
                                <div className="bg-primary/10 p-2 sm:p-3 rounded-lg sm:rounded-xl mr-3 sm:mr-4">
                                    <Truck className="w-5 h-5 sm:w-6 sm:h-6 md:w-7 md:h-7 text-primary" />
                                </div>
                                <div>
                                    <h3 className="text-lg sm:text-xl md:text-2xl font-bold text-foreground">Delivery Details</h3>
                                    <p className="text-muted-foreground text-xs sm:text-sm">Where we'll deliver your order</p>
                                </div>
                            </div>

                            <div className="space-y-4 sm:space-y-6">
                                <motion.div
                                    initial={{ x: -20, opacity: 0 }}
                                    animate={{ x: 0, opacity: 1 }}
                                    transition={{ delay: 1.1 }}
                                    className="flex items-start space-x-2 sm:space-x-4 p-3 sm:p-4 rounded-lg sm:rounded-xl bg-secondary/20"
                                >
                                    <div className="bg-primary/10 p-1.5 sm:p-2 rounded-lg flex-shrink-0">
                                        <User className="w-4 h-4 sm:w-5 sm:h-5 text-primary" />
                                    </div>
                                    <div className="min-w-0 flex-1">
                                        <h4 className="font-bold text-foreground text-sm sm:text-base md:text-lg truncate">
                                            {localOrderDetails?.userdetails?.name || 'Not provided'}
                                        </h4>
                                        <p className="text-muted-foreground flex items-center mt-1 text-xs sm:text-sm">
                                            <Phone className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2 flex-shrink-0" />
                                            <span className="truncate">{localOrderDetails?.userdetails?.phoneno || 'Not provided'}</span>
                                        </p>
                                    </div>
                                </motion.div>

                                <motion.div
                                    initial={{ x: -20, opacity: 0 }}
                                    animate={{ x: 0, opacity: 1 }}
                                    transition={{ delay: 1.2 }}
                                    className="p-3 sm:p-4 rounded-lg sm:rounded-xl bg-secondary/20"
                                >
                                    <div className="flex items-center justify-between mb-2 sm:mb-3">
                                        <div className="flex items-center space-x-2">
                                            <div className="bg-primary/10 p-1.5 sm:p-2 rounded-lg">
                                                <MapPin className="w-3 h-3 sm:w-4 sm:h-4 text-primary" />
                                            </div>
                                            <h4 className="font-bold text-foreground text-sm sm:text-base">Address</h4>
                                        </div>
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            onClick={() => setShowFullAddress(!showFullAddress)}
                                            className="text-xs px-2 h-6"
                                        >
                                            {showFullAddress ? 'Show Less' : 'Show More'}
                                        </Button>
                                    </div>
                                    <div className="ml-1 sm:ml-2 space-y-1">
                                        {showFullAddress ? (
                                            <>
                                                <p className="text-foreground text-xs sm:text-sm">
                                                    <span className="font-medium">House No:</span> {localOrderDetails?.userdetails?.houseno || 'Not provided'}
                                                </p>
                                                <p className="text-foreground text-xs sm:text-sm">
                                                    <span className="font-medium">Street:</span> {localOrderDetails?.userdetails?.streetname || ''}
                                                </p>
                                                <p className="text-foreground text-xs sm:text-sm">
                                                    <span className="font-medium">Area:</span> {localOrderDetails?.userdetails?.area || ''}
                                                </p>
                                                <p className="text-foreground font-medium text-xs sm:text-sm">
                                                    {localOrderDetails?.userdetails?.city || ''} - {localOrderDetails?.userdetails?.pincode || ''}
                                                </p>
                                            </>
                                        ) : (
                                            <p className="text-foreground text-xs sm:text-sm truncate">
                                                {localOrderDetails?.userdetails?.houseno || 'Not provided'}, {localOrderDetails?.userdetails?.streetname || ''}
                                            </p>
                                        )}
                                    </div>
                                </motion.div>
                            </div>
                        </Card>
                    </motion.div>

                    {/* Terms & Conditions Section */}
                    <motion.div
                        initial={{ y: 20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: 1.3 }}
                    >
                        <Card className="p-4 sm:p-6 md:p-8 mb-4 sm:mb-6 border-2 border-secondary/30 rounded-xl sm:rounded-2xl">
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-3 sm:mb-4 gap-2">
                                <div className="flex items-center space-x-2 sm:space-x-3">
                                    <div className="bg-secondary/20 p-1.5 sm:p-2 rounded-lg">
                                        <FileText className="w-4 h-4 sm:w-5 sm:h-5 text-foreground" />
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-foreground text-sm sm:text-base">Terms & Conditions</h3>
                                        <p className="text-xs text-muted-foreground">Important service terms</p>
                                    </div>
                                </div>
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => setShowTerms(true)}
                                    className="w-full sm:w-auto text-xs sm:text-sm group hover:bg-primary hover:text-primary-foreground transition-all mt-2 sm:mt-0"
                                >
                                    <Info className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
                                    View Terms
                                    <ChevronRight className="w-3 h-3 sm:w-4 sm:h-4 ml-1 sm:ml-2 group-hover:translate-x-1 transition-transform" />
                                </Button>
                            </div>

                            <div className="flex items-center p-3 sm:p-4 rounded-lg bg-secondary/20">
                                <input
                                    type="checkbox"
                                    id="acceptTerms"
                                    checked={acceptedTerms}
                                    onChange={(e) => setAcceptedTerms(e.target.checked)}
                                    className="w-4 h-4 sm:w-5 sm:h-5 rounded border-2 border-primary text-primary focus:ring-primary focus:ring-offset-2 focus:ring-2 focus:ring-offset-background"
                                />
                                <label htmlFor="acceptTerms" className="ml-2 sm:ml-3 text-foreground cursor-pointer text-xs sm:text-sm">
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
                                    className="text-destructive text-xs sm:text-sm mt-2 flex items-center"
                                >
                                    <AlertCircle className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />
                                    You must accept the terms to place your order
                                </motion.p>
                            )}
                        </Card>
                    </motion.div>

                    {/* Action Buttons */}
                    <motion.div
                        initial={{ y: 20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: 1.4 }}
                        className="flex flex-col sm:flex-row gap-3 sm:gap-4"
                    >
                        <Button
                            variant="outline"
                            onClick={() => navigate(-1)}
                            className="flex-1 py-2 sm:py-3 text-sm sm:text-base md:text-lg border-2 hover:bg-secondary/50 transition-all"
                        >
                            Back to Edit
                        </Button>
                        <Button
                            onClick={handleSubmit}
                            disabled={isLoading || !acceptedTerms}
                            className={`flex-1 py-2 sm:py-3 text-sm sm:text-base md:text-lg font-bold transition-all ${
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
                                        className="w-4 h-4 sm:w-5 sm:h-5 border-2 border-white border-t-transparent rounded-full mr-2"
                                    />
                                    <span className="text-xs sm:text-sm">Processing...</span>
                                </span>
                            ) : (
                                <span className="flex items-center justify-center">
                                    <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 mr-1 sm:mr-2" />
                                    <span className="text-xs sm:text-sm">Place Order Now</span>
                                </span>
                            )}
                        </Button>
                    </motion.div>

                    {/* Mobile Order Summary Floating */}
                    <motion.div
                        initial={{ y: 100, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: 1.5 }}
                        className="sm:hidden fixed bottom-0 left-0 right-0 bg-card border-t border-secondary/30 p-3 shadow-2xl z-10"
                    >
                        <div className="flex justify-between items-center mb-2">
                            <div>
                                <p className="text-xs text-muted-foreground">Total Amount</p>
                                <p className="font-bold text-lg text-primary">
                                    ₹{localOrderDetails?.otherdetails?.totalamount || '0'}
                                </p>
                            </div>
                            <Button
                                onClick={handleSubmit}
                                disabled={isLoading || !acceptedTerms}
                                className={`px-6 font-bold ${
                                    !acceptedTerms 
                                        ? 'bg-muted text-muted-foreground cursor-not-allowed' 
                                        : 'bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary'
                                }`}
                            >
                                {isLoading ? (
                                    <motion.div
                                        animate={{ rotate: 360 }}
                                        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                                        className="w-4 h-4 border-2 border-white border-t-transparent rounded-full"
                                    />
                                ) : (
                                    'Place Order'
                                )}
                            </Button>
                        </div>
                        {!acceptedTerms && (
                            <p className="text-xs text-destructive text-center">
                                Please accept terms above
                            </p>
                        )}
                    </motion.div>
                </motion.div>
            </div>

            {/* Mobile spacing for floating button */}
            <div className="h-20 sm:hidden"></div>
        </motion.div>
    );
};

export default Ordersummary;