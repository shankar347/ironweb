import { useContext, useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { 
  Shirt, ShoppingCart, Clock, Wallet, CreditCard, 
  HandCoins, ListOrdered, Plus, Minus, Zap, Gauge, 
  Info, Calendar, Gift, Truck, Sparkles, Tag, 
  AlertCircle, ArrowRight, Check, Crown, Flashlight,
  Rocket, Shield, Star, Timer, TrendingUp, X,
  CalendarDays, PartyPopper, Lock, AlertTriangle,
  Crown as CrownIcon, Flame, Trophy, Target
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { toast } from "react-toastify";
import { SteamContext } from '@/hooks/steamcontext';
import Select from "react-select";
import { API_URL } from '../../hooks/tools';
import OfferCard from './offercard';
import { motion, AnimatePresence } from 'framer-motion';

const BookSlot = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [isBookingOpen, setIsBookingOpen] = useState(true);
    const [showBookingClosedModal, setShowBookingClosedModal] = useState(false);
    const steamcontext = useContext(SteamContext);
    const [selectedSlot, setSelectedSlot] = useState<string | null>(null);
    const { formData, setFormData, orderdetails, setorderdetails } = steamcontext;
    const [paymenttype, selectpaymenttype] = useState('');
    const [deliverySpeed, setDeliverySpeed] = useState<'normal' | 'express' | 'lightning'>('normal');
    const [hoveredSpeed, setHoveredSpeed] = useState<string | null>(null);
    const [currentTime, setCurrentTime] = useState(new Date());
    const [itemList, setItemlist] = useState([]);
    const [itemCounts, setItemCounts] = useState({});
    const [activeSpeedInfo, setActiveSpeedInfo] = useState<string | null>(null);
    const [showLaunchCard, setShowLaunchCard] = useState(true);

    const [errors, setErrors] = useState({
        items: "",
        selectedSlot: "",
        paymenttype: "",
    });

    const slotRef = useRef<HTMLDivElement | null>(null);
    const paymentRef = useRef<HTMLDivElement | null>(null);
    const itemsRef = useRef<HTMLDivElement | null>(null);
    const launchCardRef = useRef<HTMLDivElement | null>(null);

    const navigate = useNavigate();

    // Check if we're in launch period (till 3rd January 2026 12PM)
    const isLaunchPeriod = () => {
        const today = new Date();
        const launchEndDate = new Date('2026-01-03T12:00:00'); // 3rd January 2026, 12:00 PM
        return today <= launchEndDate;
    };

    // Calculate days remaining for launch offer (for 2026)
    const getDaysRemaining = () => {
        if (!isLaunchPeriod()) return 0;
        const today = new Date();
        const launchEndDate = new Date('2026-01-03T12:00:00');
        const diffTime = launchEndDate.getTime() - today.getTime();
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        return diffDays > 0 ? diffDays : 0; // Ensure non-negative
    };

    // Get booking status from API
    const getBookingStatus = async () => {
        try {
            const res = await fetch(`${API_URL}/admin/getbookstatus`, {
                credentials: 'include',
            });
            const data = await res.json();
            if (data.success) {
                setIsBookingOpen(data.status);
            }
        } catch (error) {
            console.error('Error fetching booking status:', error);
        }
    };

    const getbookItems = async () => {
        try {
            const res = await fetch(`${API_URL}/admin/getbookitems`, {
                credentials: 'include',
            });
            const data = await res.json();

            if (data?.data) {
                setItemlist(data?.data);
                const initialCounts = {};
                data.data.forEach(item => {
                    initialCounts[item._id] = 0;
                });
                if (data.data.length > 0) {
                    initialCounts[data.data[0]._id] = 1;
                }
                setItemCounts(initialCounts);
            }
        } catch (err) {
            toast.error("Error in fetching book items");
        }
    };

    useEffect(() => {
        getBookingStatus();
        getbookItems();
    }, []);

    useEffect(() => {
        if (!isBookingOpen) {
            setShowBookingClosedModal(true);
        }
    }, [isBookingOpen]);

    // Calculate delivery charges based on launch period and cloth count
    const getDeliveryCharges = () => {
        const baseCharges = {
            normal: 29,
            express: 39,
            lightning: 49
        };

        return baseCharges;
    };

    const deliveryCharges = getDeliveryCharges();

    const speedInfo = {
        normal: {
            title: "Normal Delivery",
            description: "Standard 7-hour time slots. Best for planned schedules.",
            icon: Shirt,
            color: "bg-gradient-to-br from-blue-500 to-blue-600",
            borderColor: "border-blue-500",
            textColor: "text-blue-600",
            bufferHours: 3,
            features: ["Standard 7-hour slots", "Most affordable", "First 3 days FREE delivery"],
            available: true,
            isLaunchOffer: isLaunchPeriod()
        },
        express: {
            title: "Express Delivery",
            description: "Quick 3-hour slots. Faster service with moderate priority.",
            icon: Rocket,
            color: "bg-gradient-to-br from-orange-500 to-orange-600",
            borderColor: "border-orange-500",
            textColor: "text-orange-600",
            bufferHours: 2,
            features: ["3-hour slots", "Priority processing", "Faster turnaround"],
            available: true
        },
        lightning: {
            title: "Lightning Fast",
            description: "Super fast 1.5-hour slots. Highest priority service!",
            icon: Zap,
            color: "bg-gradient-to-br from-purple-600 to-purple-700",
            borderColor: "border-purple-500",
            textColor: "text-purple-600",
            bufferHours: 1,
            features: ["1.5-hour slots", "Highest priority", "Express delivery"],
            available: false,
            comingSoon: true
        }
    };

    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentTime(new Date());
        }, 60000);

        return () => clearInterval(timer);
    }, []);

    const parseTimeSlot = (slot: string) => {
        const [start, end] = slot.split(' - ');
        const parseTime = (time: string) => {
            const [hourStr, period] = time.split(/(?=[AP]M)/);
            let hour = parseInt(hourStr);
            if (period === 'PM' && hour !== 12) hour += 12;
            if (period === 'AM' && hour === 12) hour = 0;
            return hour;
        };
        return { startHour: parseTime(start), endHour: parseTime(end) };
    };

    const isSlotAvailable = (slot: string) => {
        const { endHour } = parseTimeSlot(slot);
        const now = currentTime;
        const currentHour = now.getHours();
        const currentMinutes = now.getMinutes();
        const bufferHours = speedInfo[deliverySpeed].bufferHours;

        const currentTimeDecimal = currentHour + (currentMinutes / 60);
        const deadlineTimeDecimal = endHour - bufferHours;

        return currentTimeDecimal < deadlineTimeDecimal;
    };

    const getAllTimeSlots = () => {
        let allSlots: string[] = [];

        switch (deliverySpeed) {
            case 'normal':
                allSlots = ['6AM - 1PM', '1PM - 8PM'];
                break;
            case 'express':
                allSlots = ['6AM - 9AM', '9AM - 12PM', '12PM - 3PM', '3PM - 6PM', '6PM - 8PM'];
                break;
            case 'lightning':
                allSlots = ['8AM - 9:30AM', '9:30AM - 11AM', '11AM - 12:30PM', '12:30PM - 2PM',
                    '2PM - 3:30PM', '3:30PM - 5PM', '5PM - 6:30PM', '6:30PM - 8PM'];
                break;
            default:
                allSlots = ['6AM - 1PM', '1PM - 8PM'];
        }

        return allSlots;
    };

    const getTodaySlots = () => {
        const allSlots = getAllTimeSlots();
        return allSlots.filter(slot => isSlotAvailable(slot));
    };

    const getTomorrowSlots = () => {
        return getAllTimeSlots();
    };

    const getCombinedSlots = () => {
        const todaySlots = getTodaySlots();

        if (todaySlots.length > 0) {
            return todaySlots.map(slot => ({
                value: slot,
                label: slot,
                isToday: true
            }));
        }

        const tomorrowSlots = getTomorrowSlots();
        return tomorrowSlots.map(slot => ({
            value: `${slot}__tomorrow`,
            label: `${slot} (Tomorrow)`,
            isToday: false,
            originalSlot: slot
        }));
    };

    useEffect(() => {
        window.scrollTo({ top: 0, behavior: "smooth" });
    }, []);

    useEffect(() => {
        setSelectedSlot(null);
    }, [deliverySpeed, currentTime]);

    const handleItemCountChange = (itemId: string, value: number) => {
        setItemCounts(prev => ({
            ...prev,
            [itemId]: Math.max(0, value)
        }));
    };

    const getTotalClothCount = () => {
        return Object.values(itemCounts).reduce((sum: number, count: number) => sum + count, 0);
    };

    const getItemsSubtotal = () => {
        return itemList.reduce((total, item) => {
            const count = itemCounts[item._id] || 0;
            return total + (count * Number(item.price));
        }, 0);
    };

    const getDeliveryCharge = () => {
        const totalCount = getTotalClothCount();
        
        // First 3 days FREE for normal delivery during AND after launch period
        if (deliverySpeed === 'normal') {
            return 0;
        }
        
        // Express delivery is First 3 dayscharged
        return deliveryCharges[deliverySpeed];
    };

    const getTotalAmount = () => {
        return getItemsSubtotal() + getDeliveryCharge();
    };

    const getAlternativeSpeedOptions = () => {
        const alternatives = [];
        const speeds: Array<'normal' | 'express' | 'lightning'> = ['normal', 'express', 'lightning'];

        for (const speed of speeds) {
            if (speed !== deliverySpeed && speedInfo[speed].available) {
                const testSlots = speed === 'normal'
                    ? ['6AM - 1PM', '1PM - 8PM']
                    : speed === 'express'
                        ? ['6AM - 9AM', '9AM - 12PM', '12PM - 3PM', '3PM - 6PM', '6PM - 8PM']
                        : ['8AM - 9:30AM', '9:30AM - 11AM', '11AM - 12:30PM', '12:30PM - 2PM',
                            '2PM - 3:30PM', '3:30PM - 5PM', '5PM - 6:30PM', '6:30PM - 8PM'];

                const currentHour = currentTime.getHours();
                const currentMinutes = currentTime.getMinutes();
                const currentTimeDecimal = currentHour + (currentMinutes / 60);

                const availableToday = testSlots.some(slot => {
                    const { endHour } = parseTimeSlot(slot);
                    const deadlineTimeDecimal = endHour - speedInfo[speed].bufferHours;
                    return currentTimeDecimal < deadlineTimeDecimal;
                });

                if (availableToday) {
                    alternatives.push(speed);
                }
            }
        }

        return alternatives;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        // Check if booking is open
   

        let newErrors = { items: "", selectedSlot: "", paymenttype: "" };
        let firstErrorRef: HTMLDivElement | null = null;

        const totalCount = getTotalClothCount();
        if (totalCount === 0) {
            newErrors.items = "* Please select at least one item";
            firstErrorRef = firstErrorRef || itemsRef.current;
        }
        if (!selectedSlot) {
            newErrors.selectedSlot = "* Please select a time slot";
            firstErrorRef = firstErrorRef || slotRef.current;
        }
        if (!paymenttype) {
            newErrors.paymenttype = "* Please select a payment type";
            firstErrorRef = firstErrorRef || paymentRef.current;
        }

        setErrors(newErrors);

        if (firstErrorRef) {
            firstErrorRef.scrollIntoView({ behavior: "smooth", block: "center" });
            toast.error("Please fill all required fields before proceeding");
            return;
        }

        const isTomorrow = selectedSlot?.includes('__tomorrow') || false;
        const actualSlot = isTomorrow ? selectedSlot?.replace('__tomorrow', '') : selectedSlot;

        // Store in localStorage with tomorrow flag
        const slotForStorage = isTomorrow ? `${actualSlot} (Tomorrow)` : actualSlot;

        // Prepare order_cloths in the format expected by the API
        const order_cloths = itemList
            .filter(item => itemCounts[item._id] > 0)
            .map(item => ({
                item: item.name,
                cost: String(item.price),
                quantity: String(itemCounts[item._id])
            }));

        const updatedOrderDetails = {
            userdetails: orderdetails?.userdetails || {},
            otherdetails: {
                paymenttype,
                timeslot: slotForStorage, // Store with "(Tomorrow)" if applicable
                originalSlot: actualSlot, // Store the actual slot without "(Tomorrow)"
                isTomorrow: isTomorrow, // Store boolean flag
                totalamount: String(getTotalAmount()),
                totalcloths: String(totalCount),
                deliverySpeed,
                deliveryCharge: String(getDeliveryCharge()),
                isFreeDelivery: getDeliveryCharge() === 0,
                launchPeriod: isLaunchPeriod()
            },
            order_cloths
        };

        setorderdetails(updatedOrderDetails);
        localStorage.setItem('orderdetails', JSON.stringify(updatedOrderDetails));
        navigate('/customer/confirmaddress');
    };

    const allSlotOptions = getCombinedSlots();
    const todaySlots = getTodaySlots();
    const alternativeOptions = getAlternativeSpeedOptions();
    const totalClothCount = getTotalClothCount();
    const daysRemaining = getDaysRemaining();
    
    // Normal delivery is First 3 days FREE (both during and after launch period)
    const isFreeDelivery = deliverySpeed === 'normal';

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

    const cardHoverVariants = {
        initial: { scale: 1 },
        hover: { 
            scale: 1.02,
            transition: { type: "spring", stiffness: 300 }
        }
    };

    const pulseAnimation = {
        scale: [1, 1.02, 1],
        transition: {
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut"
        }
    };

    return (
        <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="min-h-screen bg-gradient-to-br from-secondary/10 via-background to-primary/5 py-6 sm:py-12 lg:py-20 relative"
        >
            {/* Booking Closed Modal */}
            <AnimatePresence>
                {showBookingClosedModal && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4"
                        onClick={() => setShowBookingClosedModal(false)}
                    >
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.9, opacity: 0 }}
                            className="bg-gradient-to-br from-card to-card/95 border-2 border-primary/20 rounded-2xl shadow-2xl max-w-md w-full p-6 sm:p-8"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <div className="text-center">
                                <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-r from-rose-500 to-pink-600 rounded-full flex items-center justify-center mx-auto mb-6">
                                    <Lock className="w-8 h-8 sm:w-10 sm:h-10 text-white" />
                                </div>
                                
                                <h3 className="text-2xl font-bold text-foreground mb-3">
                                    Bookings Temporarily Closed
                                </h3>
                                
                                <p className="text-muted-foreground mb-6">
                                    We're currently at full capacity for today. Our delivery slots for today are completely filled.
                                </p>
                                
                                <div className="bg-secondary/30 rounded-xl p-4 mb-6">
                                    <div className="flex items-center justify-center space-x-3 mb-3">
                                        <CalendarDays className="w-5 h-5 text-primary" />
                                        <h4 className="font-bold text-lg text-foreground">Book for Tomorrow</h4>
                                    </div>
                                    <p className="text-sm text-muted-foreground">
                                        You can still book slots for tomorrow between <span className="font-bold text-primary">6:00 AM - 7:00 PM</span>. Simply select a tomorrow slot to proceed.
                                    </p>
                                </div>
                                
                                <div className="flex flex-col sm:flex-row gap-3">
                                    <Button
                                        onClick={() => setShowBookingClosedModal(false)}
                                        className="flex-1"
                                        variant="outline"
                                    >
                                        <X className="w-4 h-4 mr-2" />
                                        Close
                                    </Button>
                                    <Button
                                        onClick={() => {
                                            setShowBookingClosedModal(false);
                                            setSelectedSlot(null);
                                        }}
                                        className="flex-1"
                                    >
                                        <Calendar className="w-4 h-4 mr-2" />
                                        Book Tomorrow
                                    </Button>
                                </div>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            <div className="container mx-auto px-3 sm:px-4">
                <motion.div 
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.2 }}
                    className="max-w-2xl mx-auto"
                >
                    {/* Launch Period Card - Updated with Blue Gradient */}
                    {isLaunchPeriod() && (
                        <motion.div
                            ref={launchCardRef}
                            initial={{ y: -50, opacity: 0, scale: 0.8 }}
                            animate={{ y: 0, opacity: 1, scale: 1 }}
                            transition={{ 
                                type: "spring", 
                                stiffness: 100, 
                                damping: 15,
                                delay: 0.1 
                            }}
                            whileHover={{ scale: 1.02 }}
                            className="mb-6 sm:mb-8"
                        >
                            <Card className="relative overflow-hidden border-0 shadow-2xl bg-gradient-to-r from-blue-500 via-indigo-600 to-blue-700">
                                {/* Blue gradient background effects */}
                                <div className="absolute inset-0 bg-gradient-to-r from-blue-400/20 to-indigo-400/20" />
                                <div className="absolute -top-4 -right-4 w-24 h-24 bg-blue-300/20 rounded-full blur-xl" />
                                <div className="absolute -bottom-4 -left-4 w-24 h-24 bg-indigo-300/20 rounded-full blur-xl" />
                                
                                <div className="relative p-4 sm:p-6 lg:p-8">
                                    <div className="flex flex-col lg:flex-row items-center justify-between gap-4">
                                        <div className="flex items-center space-x-3 sm:space-x-4">
                                            <motion.div
                                                animate={pulseAnimation}
                                                className="bg-white/20 p-2 sm:p-3 rounded-full backdrop-blur-sm"
                                            >
                                                <CrownIcon className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
                                            </motion.div>
                                            <div>
                                                <h3 className="text-lg sm:text-xl lg:text-2xl font-bold text-white mb-1">
                                                    🎉 LAUNCH SPECIAL OFFER! 🎉
                                                </h3>
                                                <div className="flex flex-wrap items-center gap-1 sm:gap-2">
                                                    <span className="text-white/90 text-xs sm:text-sm lg:text-base">
                                                        Free Normal Delivery for <strong>ANY</strong> cloth count
                                                    </span>
                                                    <motion.span
                                                        animate={{ 
                                                            scale: [1, 1.1, 1],
                                                            rotate: [0, 5, 0, -5, 0]
                                                        }}
                                                        transition={{ 
                                                            duration: 2, 
                                                            repeat: Infinity,
                                                            ease: "easeInOut" 
                                                        }}
                                                        className="bg-gradient-to-r from-cyan-300 to-blue-400 text-white text-xs font-bold px-2 sm:px-3 py-0.5 sm:py-1 rounded-full"
                                                    >
                                                        LIMITED TIME
                                                    </motion.span>
                                                </div>
                                            </div>
                                        </div>
                                        
                                        <motion.div
                                            initial={{ scale: 0 }}
                                            animate={{ scale: 1 }}
                                            transition={{ delay: 0.3, type: "spring" }}
                                            className="text-center mt-4 lg:mt-0"
                                        >
                                            <div className="bg-black/20 backdrop-blur-sm rounded-xl p-3 border border-white/20">
                                                <div className="text-white/90 text-sm">Ends in</div>
                                                <div className="text-xl sm:text-2xl lg:text-3xl font-bold text-white">
                                                    {daysRemaining} day{daysRemaining !== 1 ? 's' : ''}
                                                </div>
                                                <div className="text-white/70 text-xs">Till 3rd Jan 2026, 12 PM</div>
                                            </div>
                                        </motion.div>
                                    </div>
                                    
                                    <div className="mt-4 sm:mt-6 p-3 sm:p-4 bg-white/10 backdrop-blur-sm rounded-xl border border-white/20">
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-4">
                                            <div className="flex items-center space-x-1 sm:space-x-2">
                                                <Target className="w-3 h-3 sm:w-4 sm:h-4 text-cyan-300" />
                                                <span className="text-white text-xs sm:text-sm">Free delivery for 1 cloth or more</span>
                                            </div>
                                            <div className="flex items-center space-x-1 sm:space-x-2">
                                                <Flame className="w-3 h-3 sm:w-4 sm:h-4 text-cyan-300" />
                                                <span className="text-white text-xs sm:text-sm">Normal delivery is First 3 days FREE</span>
                                            </div>
                                        </div>
                                    </div>
                                    
                                    <div className="mt-3 sm:mt-4 p-2 sm:p-3 bg-gradient-to-r from-blue-600/30 to-indigo-600/30 rounded-lg border border-blue-400/30">
                                        <p className="text-white text-xs sm:text-sm text-center">
                                            ⚠️ <strong>Important:</strong> This offer applies only to <strong>Normal Delivery</strong>. Express delivery charges remain applicable.
                                        </p>
                                    </div>
                                </div>
                            </Card>
                        </motion.div>
                    )}

                    {/* Header */}
                    <motion.div 
                        initial={{ y: 10, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: 0.3 }}
                        className="text-center mb-6 sm:mb-8 lg:mb-12"
                    >
                        <motion.div 
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ delay: 0.4, type: "spring" }}
                            className="bg-gradient-to-r from-primary to-primary/80 w-14 h-14 sm:w-16 sm:h-16 lg:w-20 lg:h-20 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4 lg:mb-6 shadow-lg shadow-primary/20"
                        >
                            <Shirt className="w-6 h-6 sm:w-8 sm:h-8 lg:w-10 lg:h-10 text-white" />
                        </motion.div>
                        <motion.h1 
                            initial={{ y: 10, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ delay: 0.5 }}
                            className="text-2xl sm:text-3xl lg:text-4xl font-bold text-foreground mb-2 sm:mb-3 bg-gradient-to-r from-foreground to-foreground/80 bg-clip-text text-transparent"
                        >
                            Book Your Slot
                        </motion.h1>
                        <motion.p 
                            initial={{ y: 10, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ delay: 0.6 }}
                            className="text-muted-foreground text-sm sm:text-base lg:text-lg"
                        >
                            Select items, choose delivery speed, and pick your preferred time
                        </motion.p>
                    </motion.div>

                    {/* Delivery Speed Cards - Made Responsive */}
                    <motion.div
                        variants={containerVariants}
                        initial="hidden"
                        animate="visible"
                        className="mb-4 sm:mb-6 lg:mb-8"
                    >
                        <motion.div variants={itemVariants}>
                            <motion.div
                                variants={cardHoverVariants}
                                initial="initial"
                                whileHover="hover"
                            >
                                <Card className="p-4 sm:p-6 lg:p-8 border-2 border-primary/10 shadow-xl hover:shadow-2xl transition-all duration-300 rounded-2xl bg-gradient-to-br from-card to-card/95">
                                    <div className="flex items-center mb-4 sm:mb-6">
                                        <div className="bg-gradient-to-r from-primary to-primary/80 p-2 sm:p-3 rounded-xl mr-3 sm:mr-4">
                                            <Rocket className="w-5 h-5 sm:w-6 sm:h-6 lg:w-7 lg:h-7 text-white" />
                                        </div>
                                        <div>
                                            <h3 className="text-lg sm:text-xl lg:text-xl font-bold text-foreground">Delivery Speed</h3>
                                            <p className="text-muted-foreground text-sm sm:text-base">Choose how fast you want your service</p>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-3 gap-1 sm:gap-2 lg:gap-3 mb-4 sm:mb-6">
                                        {/* Normal Speed - First 3 days FREE */}
                                        <motion.div 
                                            className="relative"
                                            whileHover={{ scale: 1.05 }}
                                            whileTap={{ scale: 0.95 }}
                                        >
                                            <button
                                                onClick={() => setDeliverySpeed('normal')}
                                                onMouseEnter={() => setHoveredSpeed('normal')}
                                                onMouseLeave={() => setHoveredSpeed(null)}
                                                className={`w-full p-2 sm:p-3 lg:p-4 rounded-lg border-2 transition-all duration-300 ${deliverySpeed === 'normal'
                                                        ? 'border-blue-500 bg-blue-500 shadow-lg text-white'
                                                        : 'border-blue-300 bg-white hover:border-blue-400 hover:shadow-md text-gray-700'
                                                    }`}
                                            >
                                                <div className="flex flex-col items-center space-y-1 sm:space-y-2">
                                                    <motion.div 
                                                        className="absolute -top-1 sm:-top-2 -right-1 sm:-right-2"
                                                        animate={{ 
                                                            scale: [1, 1.2, 1],
                                                            rotate: [0, 5, 0, -5, 0]
                                                        }}
                                                        transition={{ 
                                                            duration: 3, 
                                                            repeat: Infinity,
                                                            ease: "easeInOut" 
                                                        }}
                                                    >
                                                        <div className="bg-gradient-to-r from-green-500 to-emerald-600 text-white text-xs px-1 sm:px-2 py-0.5 sm:py-1 rounded-full font-bold shadow-lg whitespace-nowrap">
                                                            FREE
                                                        </div>
                                                    </motion.div>
                                                    <Shirt className={`w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6 transition-all duration-300 ${deliverySpeed === 'normal' ? 'text-white' : 'text-blue-500'
                                                        }`} />
                                                    <span className={`font-semibold text-xs sm:text-sm lg:text-base ${deliverySpeed === 'normal' ? 'text-white' : 'text-blue-600'
                                                        }`}>
                                                        Normal
                                                    </span>
                                                    <div className="flex flex-col items-center">
                                                        <span className="line-through text-gray-500 text-xs">₹{deliveryCharges.normal}</span>
                                                        <span className={`text-xs font-bold ${deliverySpeed === 'normal' ? 'text-green-300' : 'text-green-600'
                                                            }`}>
                                                            ₹0
                                                        </span>
                                                    </div>
                                                    <span className={`text-[10px] sm:text-xs ${deliverySpeed === 'normal' ? 'text-blue-100' : 'text-gray-500'
                                                        }`}>7 hr slots</span>
                                                </div>
                                                {deliverySpeed !== 'normal' && (
                                                    <div className="absolute -top-1 -right-1">
                                                        <div className="w-2 h-2 sm:w-3 sm:h-3 bg-green-400 rounded-full animate-ping"></div>
                                                    </div>
                                                )}
                                            </button>
                                        </motion.div>

                                        {/* Express Delivery */}
                                        <motion.div 
                                            className="relative"
                                            whileHover={{ scale: 1.05 }}
                                            whileTap={{ scale: 0.95 }}
                                        >
                                            <button
                                                onClick={() => setDeliverySpeed('express')}
                                                onMouseEnter={() => setHoveredSpeed('express')}
                                                onMouseLeave={() => setHoveredSpeed(null)}
                                                className={`w-full p-2 sm:p-3 lg:p-4 rounded-lg border-2 transition-all duration-300 ${deliverySpeed === 'express'
                                                        ? 'border-orange-500 bg-orange-500 shadow-lg text-white'
                                                        : 'border-orange-300 bg-white hover:border-orange-400 hover:shadow-md text-gray-700'
                                                    }`}
                                            >
                                                <div className="flex flex-col items-center space-y-1 sm:space-y-2">
                                                    <Rocket className={`w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6 transition-all duration-300 ${deliverySpeed === 'express' ? 'text-white' : 'text-orange-500'
                                                        }`} />
                                                    <span className={`font-semibold text-xs sm:text-sm lg:text-base ${deliverySpeed === 'express' ? 'text-white' : 'text-orange-600'
                                                        }`}>
                                                        Express
                                                    </span>
                                                    <span className={`text-xs ${deliverySpeed === 'express' ? 'text-orange-100' : 'text-gray-600'
                                                        }`}>₹{deliveryCharges.express}</span>
                                                    <span className={`text-[10px] sm:text-xs ${deliverySpeed === 'express' ? 'text-orange-100' : 'text-gray-500'
                                                        }`}>3 hr</span>
                                                </div>
                                            </button>
                                        </motion.div>

                                        {/* Lightning Fast - Responsive Coming Soon */}
                                        <motion.div 
                                            className="relative"
                                            whileHover={{ scale: 1.05 }}
                                            whileTap={{ scale: 0.95 }}
                                        >
                                            <div className="relative w-full">
                                                <motion.div
                                                    whileHover={{ scale: 1.02 }}
                                                    className="w-full p-2 sm:p-3 lg:p-4 rounded-lg border-2 border-purple-300 bg-gradient-to-br from-purple-50 to-purple-100 relative cursor-not-allowed"
                                                >
                                                    <motion.div
                                                        animate={{ 
                                                            y: [0, -2, 0],
                                                        }}
                                                        transition={{ 
                                                            duration: 2, 
                                                            repeat: Infinity,
                                                            ease: "easeInOut" 
                                                        }}
                                                        className="absolute -top-1 sm:-top-2 -right-1 sm:-right-2 z-30"
                                                    >
                                                        <div className="bg-gradient-to-r from-purple-600 to-purple-800 text-white text-xs px-1 sm:px-2 py-0.5 sm:py-1 rounded-full font-bold shadow-lg whitespace-nowrap text-[10px] sm:text-xs">
                                                            SOON
                                                        </div>
                                                    </motion.div>
                                                    <div className="flex flex-col items-center space-y-1 sm:space-y-2 relative z-20">
                                                        <Zap className="w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6 text-purple-400" />
                                                        <span className="font-semibold text-xs sm:text-sm lg:text-base text-purple-500 whitespace-nowrap">
                                                            Lightning
                                                        </span>
                                                        <span className="text-xs text-purple-400">₹{deliveryCharges.lightning}</span>
                                                        <span className="text-[10px] sm:text-xs text-purple-400">1.5 hr</span>
                                                    </div>
                                                    <div className="absolute inset-0 bg-gradient-to-br from-white/50 to-transparent rounded-lg" />
                                                </motion.div>
                                            </div>
                                        </motion.div>
                                    </div>

                                    {/* Active Speed Info */}
                                    <AnimatePresence>
                                        <motion.div
                                            initial={{ opacity: 0, height: 0 }}
                                            animate={{ opacity: 1, height: 'auto' }}
                                            exit={{ opacity: 0, height: 0 }}
                                            className={`p-3 sm:p-4 rounded-lg ${
                                                deliverySpeed === 'normal' ? 'bg-blue-50 border-blue-200' :
                                                deliverySpeed === 'express' ? 'bg-orange-50 border-orange-200' :
                                                'bg-purple-50 border-purple-200'
                                            } border`}
                                        >
                                            <div className="flex items-start space-x-2 sm:space-x-3">
                                                <div className={`p-1 sm:p-2 rounded-lg flex-shrink-0 ${
                                                    deliverySpeed === 'normal' ? 'bg-blue-100' :
                                                    deliverySpeed === 'express' ? 'bg-orange-100' :
                                                    'bg-purple-100'
                                                }`}>
                                                    <Info className={`w-4 h-4 sm:w-5 sm:h-5 ${
                                                        deliverySpeed === 'normal' ? 'text-blue-600' :
                                                        deliverySpeed === 'express' ? 'text-orange-600' :
                                                        'text-purple-600'
                                                    }`} />
                                                </div>
                                                <div className="flex-1">
                                                    <div className="flex flex-wrap items-center gap-1 sm:gap-2 mb-2">
                                                        <h4 className="font-bold text-foreground text-sm sm:text-base">
                                                            {speedInfo[deliverySpeed].title} Features:
                                                        </h4>
                                                        {deliverySpeed === 'normal' && (
                                                            <motion.span
                                                                animate={{ 
                                                                    scale: [1, 1.1, 1],
                                                                    rotate: [0, 5, 0, -5, 0]
                                                                }}
                                                                transition={{ 
                                                                    duration: 3, 
                                                                    repeat: Infinity,
                                                                    ease: "easeInOut" 
                                                                }}
                                                                className="bg-gradient-to-r from-green-500 to-emerald-600 text-white text-xs px-1 sm:px-2 py-0.5 sm:py-1 rounded-full font-bold"
                                                            >
                                                                First 3 days FREE
                                                            </motion.span>
                                                        )}
                                                    </div>
                                                    <ul className="space-y-1">
                                                        {speedInfo[deliverySpeed].features.map((feature, index) => (
                                                            <motion.li 
                                                                key={index} 
                                                                initial={{ opacity: 0, x: -10 }}
                                                                animate={{ opacity: 1, x: 0 }}
                                                                transition={{ delay: index * 0.1 }}
                                                                className="flex items-start text-xs sm:text-sm text-muted-foreground"
                                                            >
                                                                <Check className="w-3 h-3 mr-1 sm:mr-2 text-green-500 flex-shrink-0 mt-0.5" />
                                                                {feature}
                                                            </motion.li>
                                                        ))}
                                                    </ul>
                                                    <motion.p 
                                                        initial={{ opacity: 0 }}
                                                        animate={{ opacity: 1 }}
                                                        transition={{ delay: 0.3 }}
                                                        className="text-xs sm:text-sm text-muted-foreground mt-2 sm:mt-3"
                                                    >
                                                        {speedInfo[deliverySpeed].description}
                                                    </motion.p>
                                                    {deliverySpeed === 'normal' && (
                                                        <motion.div
                                                            initial={{ opacity: 0, y: 10 }}
                                                            animate={{ opacity: 1, y: 0 }}
                                                            transition={{ delay: 0.4 }}
                                                            className="mt-2 sm:mt-3 p-2 sm:p-3 bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-lg"
                                                        >
                                                            <p className="text-xs sm:text-sm font-medium text-green-800">
                                                                🎉 <strong>Great News!</strong> Normal delivery is First 3 days FREE for any cloth count!
                                                            </p>
                                                            <p className="text-xs text-green-700 mt-1">
                                                                <strong>Note:</strong> Express delivery charges remain ₹{deliveryCharges.express} for faster service
                                                            </p>
                                                        </motion.div>
                                                    )}
                                                </div>
                                            </div>
                                        </motion.div>
                                    </AnimatePresence>
                                </Card>
                            </motion.div>
                        </motion.div>
                    </motion.div>

                    {/* Offer Card */}
                    {/* <motion.div variants={itemVariants}>
                        <OfferCard />
                    </motion.div> */}

                    {/* Item Selection */}
                    <motion.div variants={itemVariants}>
                        <motion.div
                            variants={cardHoverVariants}
                            initial="initial"
                            whileHover="hover"
                        >
                            <Card ref={itemsRef} className= " mt-8 p-4 sm:p-6 lg:p-8 my-4 sm:my-6 border-2 border-primary/10 shadow-xl hover:shadow-2xl transition-all duration-300 rounded-2xl bg-gradient-to-br from-card to-card/95">
                                <div className="flex items-center mb-4 sm:mb-6">
                                    <div className="bg-gradient-to-r from-primary to-primary/80 p-2 sm:p-3 rounded-xl mr-3 sm:mr-4">
                                        <ShoppingCart className="w-5 h-5 sm:w-6 sm:h-6 lg:w-7 lg:h-7 text-white" />
                                    </div>
                                    <div>
                                        <h3 className="text-lg sm:text-xl lg:text-xl font-bold text-foreground">Select Items</h3>
                                        <p className="text-muted-foreground text-sm sm:text-base">Choose items and quantity</p>
                                    </div>
                                </div>

                                {itemList.length > 0 && itemList.map((item, index) => (
                                    <motion.div
                                        key={item._id}
                                        variants={itemVariants}
                                        className={`${index === 0 ? 'mb-6 sm:mb-8' : 'mt-4 sm:mt-6'} p-3 sm:p-4 rounded-xl border hover:border-primary/30 transition-all duration-200 ${
                                            (itemCounts[item._id] || 0) > 0 ? 'bg-primary/5 border-primary/20' : 'bg-secondary/10 border-secondary'
                                        }`}
                                    >
                                        {index === 0 ? (
                                            <>
                                                <div className="text-center mb-4 sm:mb-6">
                                                    <h3 className="text-lg sm:text-xl font-bold text-primary mb-1 sm:mb-2">
                                                        {item.name} (₹{item.price})
                                                    </h3>
                                                    <p className="text-muted-foreground text-sm sm:text-base">Select quantity</p>
                                                </div>
                                                
                                                <div className="flex justify-center flex-wrap gap-1 sm:gap-2 mb-4 sm:mb-6">
                                                    {[1, 3, 6, 9, 10, 12, 15, 18, 20].map((btn) => (
                                                        <motion.button
                                                            key={btn}
                                                            whileHover={{ scale: 1.05 }}
                                                            whileTap={{ scale: 0.95 }}
                                                            onClick={() => handleItemCountChange(item._id, btn)}
                                                            className={`px-2 sm:px-3 lg:px-4 py-1 sm:py-2 rounded-lg font-medium transition-all duration-200 text-xs sm:text-sm ${
                                                                itemCounts[item._id] === btn
                                                                    ? 'bg-primary text-primary-foreground shadow-lg'
                                                                    : 'bg-secondary hover:bg-secondary/80 text-foreground'
                                                            }`}
                                                        >
                                                            {btn}
                                                        </motion.button>
                                                    ))}
                                                </div>
                                                
                                                <div className="flex items-center justify-center space-x-3 sm:space-x-4">
                                                    <motion.button
                                                        whileHover={{ scale: 1.1 }}
                                                        whileTap={{ scale: 0.9 }}
                                                        onClick={() => handleItemCountChange(item._id, (itemCounts[item._id] || 0) - 1)}
                                                        className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-secondary hover:bg-secondary/80 flex items-center justify-center transition-all duration-200"
                                                    >
                                                        <Minus className="w-4 h-4 sm:w-5 sm:h-5" />
                                                    </motion.button>

                                                    <div className="font-bold text-2xl sm:text-3xl min-w-[50px] sm:min-w-[60px] text-center">
                                                        {itemCounts[item._id] || 0}
                                                    </div>

                                                    <motion.button
                                                        whileHover={{ scale: 1.1 }}
                                                        whileTap={{ scale: 0.9 }}
                                                        onClick={() => handleItemCountChange(item._id, (itemCounts[item._id] || 0) + 1)}
                                                        className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-primary hover:bg-primary/90 text-primary-foreground flex items-center justify-center transition-all duration-200"
                                                    >
                                                        <Plus className="w-4 h-4 sm:w-5 sm:h-5" />
                                                    </motion.button>
                                                </div>
                                            </>
                                        ) : (
                                            <div className="flex justify-between items-center">
                                                <div>
                                                    <h4 className="font-bold text-foreground text-sm sm:text-base">{item.name}</h4>
                                                    <p className="text-xs sm:text-sm text-muted-foreground">₹{item.price} per item</p>
                                                </div>
                                                <div className="flex items-center space-x-2 sm:space-x-3">
                                                    <motion.button
                                                        whileHover={{ scale: 1.1 }}
                                                        whileTap={{ scale: 0.9 }}
                                                        onClick={() => handleItemCountChange(item._id, (itemCounts[item._id] || 0) - 1)}
                                                        className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-secondary hover:bg-secondary/80 flex items-center justify-center"
                                                    >
                                                        <Minus className="w-2 h-2 sm:w-3 sm:h-3" />
                                                    </motion.button>
                                                    <div className="font-bold text-lg sm:text-xl min-w-[30px] sm:min-w-[40px] text-center">
                                                        {itemCounts[item._id] || 0}
                                                    </div>
                                                    <motion.button
                                                        whileHover={{ scale: 1.1 }}
                                                        whileTap={{ scale: 0.9 }}
                                                        onClick={() => handleItemCountChange(item._id, (itemCounts[item._id] || 0) + 1)}
                                                        className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-primary hover:bg-primary/90 text-primary-foreground flex items-center justify-center"
                                                    >
                                                        <Plus className="w-2 h-2 sm:w-3 sm:h-3" />
                                                    </motion.button>
                                                </div>
                                            </div>
                                        )}
                                    </motion.div>
                                ))}

                                {errors.items && (
                                    <motion.p
                                        initial={{ opacity: 0, y: -10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        className="text-red-500 text-xs sm:text-sm mt-4 flex items-center justify-center"
                                    >
                                        <AlertCircle className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
                                        {errors.items}
                                    </motion.p>
                                )}
                            </Card>
                        </motion.div>
                    </motion.div>

                    {/* Free Delivery Info */}
                    {isFreeDelivery && (
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="my-4 sm:my-6"
                        >
                            <motion.div
                                variants={cardHoverVariants}
                                initial="initial"
                                whileHover="hover"
                            >
                                <div className="p-4 sm:p-6 bg-gradient-to-r from-green-500 to-emerald-500 rounded-2xl shadow-xl border-2 border-green-400">
                                    <div className="flex flex-col sm:flex-row items-center justify-between gap-3 sm:gap-4">
                                        <div className="flex items-center space-x-3 sm:space-x-4">
                                            <motion.div
                                                animate={{ 
                                                    rotate: [0, 10, 0, -10, 0],
                                                }}
                                                transition={{ 
                                                    duration: 3, 
                                                    repeat: Infinity,
                                                    ease: "easeInOut" 
                                                }}
                                                className="bg-white/20 p-2 sm:p-3 rounded-full"
                                            >
                                                <Gift className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
                                            </motion.div>
                                            <div>
                                                <h4 className="text-lg sm:text-xl font-bold text-white">
                                                    🎉 Free Normal Delivery!
                                                </h4>
                                                <p className="text-white/90 text-xs sm:text-sm">
                                                    Normal delivery is First 3 days FREE! No minimum items required.
                                                </p>
                                            </div>
                                        </div>
                                        <Sparkles className="w-6 h-6 sm:w-8 sm:h-8 text-yellow-300 mt-2 sm:mt-0" />
                                    </div>
                                </div>
                            </motion.div>
                        </motion.div>
                    )}

                    {/* Slot Selection */}
                    <motion.div variants={itemVariants}>
                        <motion.div
                            variants={cardHoverVariants}
                            initial="initial"
                            whileHover="hover"
                        >
                            <Card ref={slotRef} className="p-4 sm:p-6 lg:p-8 my-4 sm:my-6 border-2 border-primary/10 shadow-xl hover:shadow-2xl transition-all duration-300 rounded-2xl bg-gradient-to-br from-card to-card/95">
                                <div className="flex items-center mb-4 sm:mb-6">
                                    <div className="bg-gradient-to-r from-primary to-primary/80 p-2 sm:p-3 rounded-xl mr-3 sm:mr-4">
                                        <Clock className="w-5 h-5 sm:w-6 sm:h-6 lg:w-7 lg:h-7 text-white" />
                                    </div>
                                    <div>
                                        <h3 className="text-lg sm:text-xl lg:text-xl font-bold text-foreground">Select Time Slot</h3>
                                        <p className="text-muted-foreground text-sm sm:text-base">Choose your preferred delivery time</p>
                                    </div>
                                </div>

                                {!isBookingOpen && (
                                    <motion.div
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        className="mb-4 sm:mb-6 p-3 sm:p-4 bg-gradient-to-r from-rose-50 to-pink-50 border-2 border-rose-300 rounded-xl"
                                    >
                                        <div className="flex items-center space-x-2 sm:space-x-3">
                                            <AlertTriangle className="w-5 h-5 sm:w-6 sm:h-6 text-rose-600" />
                                            <div>
                                                <h4 className="font-bold text-rose-800 mb-1 text-sm sm:text-base">
                                                    Today's Slots Are Fully Booked
                                                </h4>
                                                <p className="text-xs sm:text-sm text-rose-700">
                                                    All available slots for today have been booked. Please select a slot for tomorrow.
                                                </p>
                                            </div>
                                        </div>
                                    </motion.div>
                                )}

                                {todaySlots.length === 0 && isBookingOpen && (
                                    <motion.div
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        className="mb-4 sm:mb-6 p-3 sm:p-4 bg-gradient-to-r from-amber-50 to-orange-50 border-2 border-amber-300 rounded-xl"
                                    >
                                        <div className="flex items-center space-x-2 sm:space-x-3">
                                            <Calendar className="w-5 h-5 sm:w-6 sm:h-6 text-amber-600" />
                                            <div>
                                                <h4 className="font-bold text-amber-800 mb-1 text-sm sm:text-base">
                                                    No slots available today for {speedInfo[deliverySpeed].title}
                                                </h4>
                                                <p className="text-xs sm:text-sm text-amber-700">
                                                    All slots shown below are for tomorrow
                                                </p>
                                            </div>
                                        </div>
                                    </motion.div>
                                )}

                                {todaySlots.length > 0 && (
                                    <div className="mb-3 sm:mb-4 p-2 sm:p-3 bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-lg">
                                        <div className="flex items-center space-x-1 sm:space-x-2">
                                            <Timer className="w-3 h-3 sm:w-4 sm:h-4 text-green-600" />
                                            <p className="text-xs sm:text-sm font-medium text-green-800">
                                                ✓ {todaySlots.length} slot{todaySlots.length > 1 ? 's' : ''} available today
                                            </p>
                                        </div>
                                    </div>
                                )}

                                <Select
                                    options={allSlotOptions}
                                    value={allSlotOptions.find((opt) => opt.value === selectedSlot) || null}
                                    onChange={(selected) => setSelectedSlot(selected?.value || null)}
                                    placeholder="Select your preferred time slot"
                                    className="w-full"
                                    styles={{
                                        control: (base, state) => ({
                                            ...base,
                                            borderRadius: "0.75rem",
                                            borderColor: state.isFocused ? '#3b82f6' : errors.selectedSlot ? '#ef4444' : '#e5e7eb',
                                            borderWidth: "2px",
                                            padding: "8px 12px",
                                            minHeight: "48px",
                                            fontSize: "14px",
                                            backgroundColor: 'hsl(var(--card))',
                                            boxShadow: state.isFocused ? '0 0 0 3px rgba(59, 130, 246, 0.1)' : 'none',
                                            transition: 'all 0.2s ease',
                                            '@media (min-width: 640px)': {
                                                padding: "12px 16px",
                                                minHeight: "56px",
                                            },
                                            '&:hover': {
                                                borderColor: state.isFocused ? '#3b82f6' : '#3b82f6'
                                            }
                                        }),
                                        placeholder: (base) => ({
                                            ...base,
                                            color: 'hsl(var(--muted-foreground))',
                                            fontSize: '14px'
                                        }),
                                        singleValue: (base) => ({
                                            ...base,
                                            color: 'hsl(var(--foreground))',
                                            fontSize: '14px'
                                        }),
                                        menu: (base) => ({
                                            ...base,
                                            backgroundColor: 'hsl(var(--card))',
                                            border: '2px solid hsl(var(--border))',
                                            borderRadius: '0.75rem',
                                            overflow: 'hidden',
                                            boxShadow: '0 10px 25px rgba(0,0,0,0.1)',
                                            zIndex: 9999
                                        }),
                                        option: (base, state) => ({
                                            ...base,
                                            backgroundColor: state.isSelected 
                                                ? 'hsl(var(--primary))' 
                                                : state.data.isToday
                                                    ? state.isFocused ? 'hsl(var(--secondary))' : 'hsl(var(--accent))'
                                                    : state.isFocused ? 'hsl(var(--secondary))' : 'transparent',
                                            color: state.isSelected 
                                                ? 'hsl(var(--primary-foreground))' 
                                                : state.data.isToday ? 'hsl(var(--foreground))' : 'hsl(var(--muted-foreground))',
                                            padding: "8px 12px",
                                            cursor: 'pointer',
                                            fontSize: '14px',
                                            '@media (min-width: 640px)': {
                                                padding: "12px 16px",
                                            },
                                            '&:active': {
                                                backgroundColor: 'hsl(var(--primary))'
                                            }
                                        })
                                    }}
                                />

                                {errors.selectedSlot && (
                                    <motion.p
                                        initial={{ opacity: 0, y: -10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        className="text-red-500 text-xs sm:text-sm mt-2 flex items-center"
                                    >
                                        <AlertCircle className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
                                        {errors.selectedSlot}
                                    </motion.p>
                                )}
                            </Card>
                        </motion.div>
                    </motion.div>

                    {/* Payment Selection */}
                    <motion.div variants={itemVariants}>
                        <motion.div
                            variants={cardHoverVariants}
                            initial="initial"
                            whileHover="hover"
                        >
                            <Card ref={paymentRef} className="p-4 sm:p-6 lg:p-8 my-4 sm:my-6 border-2 border-primary/10 shadow-xl hover:shadow-2xl transition-all duration-300 rounded-2xl bg-gradient-to-br from-card to-card/95">
                                <div className="flex items-center mb-4 sm:mb-6">
                                    <div className="bg-gradient-to-r from-primary to-primary/80 p-2 sm:p-3 rounded-xl mr-3 sm:mr-4">
                                        <Wallet className="w-5 h-5 sm:w-6 sm:h-6 lg:w-7 lg:h-7 text-white" />
                                    </div>
                                    <div>
                                        <h3 className="text-lg sm:text-xl lg:text-xl font-bold text-foreground">Payment Method</h3>
                                        <p className="text-muted-foreground text-sm sm:text-base">Choose how you want to pay</p>
                                    </div>
                                </div>

                                <div className="space-y-3 sm:space-y-4">
                                    <motion.label
                                        whileHover={{ scale: 1.02 }}
                                        className={`flex items-center p-3 sm:p-4 rounded-xl border-2 cursor-pointer transition-all duration-200 ${
                                            paymenttype === 'online payment'
                                                ? 'border-primary bg-primary/5 shadow-md'
                                                : 'border-secondary hover:border-primary/50 hover:bg-secondary/20'
                                        }`}
                                    >
                                        <input
                                            type="radio"
                                            name="payment"
                                            value="online"
                                            className="hidden peer"
                                            checked={paymenttype === 'online payment'}
                                            onChange={() => selectpaymenttype('online payment')}
                                        />
                                        <div className="w-4 h-4 sm:w-5 sm:h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 mr-3 sm:mr-4">
                                            <div className={`w-2 h-2 sm:w-2.5 sm:h-2.5 rounded-full transition-all ${
                                                paymenttype === 'online payment' ? 'bg-primary' : 'bg-transparent'
                                            }`} />
                                        </div>
                                        <CreditCard className="w-5 h-5 sm:w-6 sm:h-6 text-primary mr-2 sm:mr-3" />
                                        <div className="flex-1">
                                            <h4 className="font-bold text-foreground text-sm sm:text-base">Online Payment</h4>
                                            <p className="text-xs sm:text-sm text-muted-foreground">Pay securely online after delivery</p>
                                        </div>
                                        <Shield className="w-4 h-4 sm:w-5 sm:h-5 text-green-500" />
                                    </motion.label>

                                    <motion.label
                                        whileHover={{ scale: 1.02 }}
                                        className={`flex items-center p-3 sm:p-4 rounded-xl border-2 cursor-pointer transition-all duration-200 ${
                                            paymenttype === 'cash on delivery'
                                                ? 'border-primary bg-primary/5 shadow-md'
                                                : 'border-secondary hover:border-primary/50 hover:bg-secondary/20'
                                        }`}
                                    >
                                        <input
                                            type="radio"
                                            name="payment"
                                            value="cod"
                                            className="hidden peer"
                                            checked={paymenttype === 'cash on delivery'}
                                            onChange={() => selectpaymenttype('cash on delivery')}
                                        />
                                        <div className="w-4 h-4 sm:w-5 sm:h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 mr-3 sm:mr-4">
                                            <div className={`w-2 h-2 sm:w-2.5 sm:h-2.5 rounded-full transition-all ${
                                                paymenttype === 'cash on delivery' ? 'bg-primary' : 'bg-transparent'
                                            }`} />
                                        </div>
                                        <HandCoins className="w-5 h-5 sm:w-6 sm:h-6 text-primary mr-2 sm:mr-3" />
                                        <div className="flex-1">
                                            <h4 className="font-bold text-foreground text-sm sm:text-base">Cash on Delivery</h4>
                                            <p className="text-xs sm:text-sm text-muted-foreground">Pay cash when you receive your items</p>
                                        </div>
                                    </motion.label>
                                </div>

                                {errors.paymenttype && (
                                    <motion.p
                                        initial={{ opacity: 0, y: -10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        className="text-red-500 text-xs sm:text-sm mt-3 sm:mt-4 flex items-center"
                                    >
                                        <AlertCircle className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
                                        {errors.paymenttype}
                                    </motion.p>
                                )}
                            </Card>
                        </motion.div>
                    </motion.div>

                    {/* Order Summary */}
                    <motion.div variants={itemVariants}>
                        <motion.div
                            variants={cardHoverVariants}
                            initial="initial"
                            whileHover="hover"
                        >
                            <Card className="p-4 sm:p-6 lg:p-8 border-2 border-primary/10 shadow-xl hover:shadow-2xl transition-all duration-300 rounded-2xl bg-gradient-to-br from-card to-card/95">
                                <div className="flex items-center mb-4 sm:mb-6">
                                    <div className="bg-gradient-to-r from-primary to-primary/80 p-2 sm:p-3 rounded-xl mr-3 sm:mr-4">
                                        <ListOrdered className="w-5 h-5 sm:w-6 sm:h-6 lg:w-7 lg:h-7 text-white" />
                                    </div>
                                    <div>
                                        <h3 className="text-lg sm:text-xl lg:text-xl font-bold text-foreground">Order Summary</h3>
                                        <p className="text-muted-foreground text-sm sm:text-base">Review your order details</p>
                                    </div>
                                </div>

                                <div className="space-y-3 sm:space-y-4 mb-4 sm:mb-6">
                                    {/* Items Breakdown */}
                                    {itemList.map((item) => {
                                        const count = itemCounts[item._id] || 0;
                                        if (count === 0) return null;
                                        const itemTotal = count * Number(item.price);
                                        return (
                                            <motion.div 
                                                key={item._id} 
                                                initial={{ opacity: 0, x: -20 }}
                                                animate={{ opacity: 1, x: 0 }}
                                                className="flex justify-between items-center p-2 sm:p-3 bg-secondary/20 rounded-lg"
                                            >
                                                <div className="flex items-center space-x-2 sm:space-x-3">
                                                    <Shirt className="w-3 h-3 sm:w-4 sm:h-4 text-primary" />
                                                    <span className="font-medium text-sm sm:text-base">{item.name}</span>
                                                    <span className="text-xs sm:text-sm text-muted-foreground">× {count}</span>
                                                </div>
                                                <span className="font-bold text-sm sm:text-base">₹{itemTotal}</span>
                                            </motion.div>
                                        );
                                    })}

                                    {/* Subtotal */}
                                    {totalClothCount > 0 && (
                                        <div className="flex justify-between p-2 sm:p-3 border-t border-b border-secondary/30">
                                            <div className="font-medium text-sm sm:text-base">Items Subtotal ({totalClothCount} items)</div>
                                            <div className="font-bold text-sm sm:text-base">₹{getItemsSubtotal()}</div>
                                        </div>
                                    )}

                                    {/* Delivery Charges */}
                                    <motion.div
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        className="flex justify-between items-center p-2 sm:p-3 bg-secondary/10 rounded-lg"
                                    >
                                        <div className="flex items-center space-x-2 sm:space-x-3">
                                            <Truck className="w-3 h-3 sm:w-4 sm:h-4 text-primary" />
                                            <span className="text-sm sm:text-base">Delivery Charges ({speedInfo[deliverySpeed].title})</span>
                                            {isFreeDelivery && (
                                                <motion.span
                                                    animate={{ 
                                                        scale: [1, 1.1, 1],
                                                    }}
                                                    transition={{ 
                                                        duration: 2, 
                                                        repeat: Infinity,
                                                        ease: "easeInOut" 
                                                    }}
                                                    className="text-xs bg-green-100 text-green-800 px-1 sm:px-2 py-0.5 sm:py-1 rounded-full whitespace-nowrap"
                                                >
                                                    FREE
                                                </motion.span>
                                            )}
                                        </div>
                                        <div className="flex items-center space-x-1 sm:space-x-2">
                                            {isFreeDelivery ? (
                                                <>
                                                    <span className="line-through text-muted-foreground text-xs sm:text-sm">
                                                        ₹{deliveryCharges[deliverySpeed]}
                                                    </span>
                                                    <span className="font-bold text-green-600 text-sm sm:text-base">₹0</span>
                                                </>
                                            ) : (
                                                <span className="font-bold text-sm sm:text-base">₹{deliveryCharges[deliverySpeed]}</span>
                                            )}
                                        </div>
                                    </motion.div>

                                    {/* Platform Charges */}
                                    <motion.div
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: 0.1 }}
                                        className="flex justify-between items-center p-2 sm:p-3 bg-gradient-to-r from-amber-50/50 to-yellow-50/50 rounded-lg border border-amber-200/50"
                                    >
                                        <div className="flex items-center space-x-2 sm:space-x-3">
                                            <Tag className="w-3 h-3 sm:w-4 sm:h-4 text-amber-600" />
                                            <span className="text-foreground text-sm sm:text-base">Platform Charges</span>
                                            <span className="text-xs bg-amber-100 text-amber-800 px-1 sm:px-2 py-0.5 sm:py-1 rounded-full">
                                                FREE
                                            </span>
                                        </div>
                                        <div className="flex items-center space-x-1 sm:space-x-2">
                                            <span className="line-through text-muted-foreground text-xs sm:text-sm">₹10</span>
                                            <span className="font-bold text-green-600 text-sm sm:text-base">₹0</span>
                                        </div>
                                    </motion.div>

                                    {/* Total */}
                                    <motion.div
                                        initial={{ scale: 0.95 }}
                                        animate={{ scale: 1 }}
                                        transition={{ delay: 0.2 }}
                                        className="flex justify-between items-center p-3 sm:p-4 bg-gradient-to-r from-primary/10 to-primary/5 rounded-xl border-2 border-primary/20"
                                    >
                                        <div className="font-bold text-base sm:text-lg">Total Amount</div>
                                        <div className="text-xl sm:text-2xl font-bold text-primary">₹{getTotalAmount()}</div>
                                    </motion.div>

                                    {/* Savings Summary */}
                                    {(isFreeDelivery || getDeliveryCharge() === 0) && (
                                        <motion.div
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ delay: 0.3 }}
                                            className="p-3 sm:p-4 bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-lg"
                                        >
                                            <h4 className="font-bold text-green-800 mb-2 sm:mb-3 flex items-center text-sm sm:text-base">
                                                <Sparkles className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2 text-green-600" />
                                                You're Saving
                                            </h4>
                                            <div className="space-y-1 sm:space-y-2">
                                                {isFreeDelivery && (
                                                    <div className="flex justify-between items-center">
                                                        <div className="flex items-center space-x-1 sm:space-x-2">
                                                            <Truck className="w-3 h-3 sm:w-4 sm:h-4 text-green-600" />
                                                            <span className="text-green-700 text-xs sm:text-sm">Delivery Charges</span>
                                                        </div>
                                                        <span className="font-bold text-green-700 text-xs sm:text-sm">₹{deliveryCharges[deliverySpeed]}</span>
                                                    </div>
                                                )}
                                                <div className="flex justify-between items-center">
                                                    <div className="flex items-center space-x-1 sm:space-x-2">
                                                        <Tag className="w-3 h-3 sm:w-4 sm:h-4 text-amber-600" />
                                                        <span className="text-amber-700 text-xs sm:text-sm">Platform Charges</span>
                                                    </div>
                                                    <span className="font-bold text-amber-700 text-xs sm:text-sm">₹10</span>
                                                </div>
                                                <div className="pt-1 sm:pt-2 border-t border-green-300">
                                                    <div className="flex justify-between items-center">
                                                        <span className="font-bold text-green-800 text-sm sm:text-base">Total Savings</span>
                                                        <span className="font-bold text-lg sm:text-xl text-green-800">
                                                            ₹{deliveryCharges[deliverySpeed] + 10}
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>
                                        </motion.div>
                                    )}
                                </div>

                                {/* Submit Button */}
                                <motion.div
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                >
                                    <Button
                                        onClick={handleSubmit}
                                        disabled={isLoading}
                                        className="w-full py-4 sm:py-6 text-base sm:text-lg font-bold bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary shadow-xl hover:shadow-2xl transition-all duration-300 group"
                                    >
                                        {isLoading ? (
                                            <div className="flex items-center justify-center">
                                                <motion.div
                                                    animate={{ rotate: 360 }}
                                                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                                                    className="w-4 h-4 sm:w-5 sm:h-5 border-2 border-white border-t-transparent rounded-full mr-2"
                                                />
                                                Processing...
                                            </div>
                                        ) : !isBookingOpen ? (
                                            <div className="flex items-center justify-center">
                                                <Calendar className="w-4 h-4 sm:w-5 sm:h-5 mr-1 sm:mr-2" />
                                                <span>Book for Tomorrow</span>
                                            </div>
                                        ) : (
                                            <div className="flex items-center justify-center">
                                                <span>Proceed to Confirm Address</span>
                                                <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 ml-1 sm:ml-2 group-hover:translate-x-1 transition-transform" />
                                            </div>
                                        )}
                                    </Button>
                                </motion.div>

                                {!isBookingOpen && (
                                    <p className="text-center text-xs sm:text-sm text-muted-foreground mt-3 sm:mt-4">
                                        Today's slots are fully booked. You can still book for tomorrow.
                                    </p>
                                )}
                            </Card>
                        </motion.div>
                    </motion.div>
                </motion.div>
            </div>
        </motion.div>
    );
};

export default BookSlot;