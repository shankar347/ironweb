import { useContext, useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { 
  Shirt, ShoppingCart, Clock, Wallet, CreditCard, 
  HandCoins, ListOrdered, Plus, Minus, Zap, Gauge, 
  Info, Calendar, Gift, Truck, Sparkles, Tag, 
  AlertCircle, ArrowRight, Check, Crown, Flashlight,
  Rocket, Shield, Star, Timer, TrendingUp
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

    const [errors, setErrors] = useState({
        items: "",
        selectedSlot: "",
        paymenttype: "",
    });

    const slotRef = useRef<HTMLDivElement | null>(null);
    const paymentRef = useRef<HTMLDivElement | null>(null);
    const itemsRef = useRef<HTMLDivElement | null>(null);

    const navigate = useNavigate();

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
        getbookItems();
    }, []);

    const deliveryCharges = {
        normal: 29,
        express: 39,
        lightning: 49
    };

    const speedInfo = {
        normal: {
            title: "Normal Delivery",
            description: "Standard 7-hour time slots. Best for planned schedules.",
            icon: Shirt,
            color: "bg-gradient-to-br from-blue-500 to-blue-600",
            borderColor: "border-blue-500",
            textColor: "text-blue-600",
            bufferHours: 3,
            features: ["Standard 7-hour slots", "Most affordable", "Free for 10+ items"]
        },
        express: {
            title: "Express Delivery",
            description: "Quick 3-hour slots. Faster service with moderate priority.",
            icon: Rocket,
            color: "bg-gradient-to-br from-orange-500 to-orange-600",
            borderColor: "border-orange-500",
            textColor: "text-orange-600",
            bufferHours: 2,
            features: ["3-hour slots", "Priority processing", "Faster turnaround"]
        },
        lightning: {
            title: "Lightning Fast",
            description: "Super fast 1.5-hour slots. Highest priority service!",
            icon: Zap,
            color: "bg-gradient-to-br from-purple-600 to-purple-700",
            borderColor: "border-purple-500",
            textColor: "text-purple-600",
            bufferHours: 1,
            features: ["1.5-hour slots", "Highest priority", "Express delivery"]
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
        return totalCount > 9 && deliverySpeed === 'normal' ? 0 : deliveryCharges[deliverySpeed];
    };

    const getTotalAmount = () => {
        // Now platform charges are 0, so we don't add 10
        return getItemsSubtotal() + getDeliveryCharge();
    };

    const getAlternativeSpeedOptions = () => {
        const alternatives = [];
        const speeds: Array<'normal' | 'express' | 'lightning'> = ['normal', 'express', 'lightning'];

        for (const speed of speeds) {
            if (speed !== deliverySpeed) {
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

        // Prepare order_cloths in the format expected by the API
        const order_cloths = itemList
            .filter(item => itemCounts[item._id] > 0)
            .map(item => ({
                item: item.name,        // Changed from 'name' to 'item'
                cost: String(item.price), // Changed from 'price' to 'cost' and ensure string
                quantity: String(itemCounts[item._id]) // Ensure string
            }));

        const updatedOrderDetails = {
            userdetails: orderdetails?.userdetails || {},
            otherdetails: {
                paymenttype,
                timeslot: actualSlot,
                totalamount: String(getTotalAmount()), // Ensure string
                totalcloths: String(totalCount),      // Ensure string
                deliverySpeed,
                isNextDay: isTomorrow
            },
            order_cloths // Add order_cloths array in the expected format
        };

        setorderdetails(updatedOrderDetails);
        localStorage.setItem('orderdetails', JSON.stringify(updatedOrderDetails));
        navigate('/customer/confirmaddress');
    };

    const allSlotOptions = getCombinedSlots();
    const todaySlots = getTodaySlots();
    const alternativeOptions = getAlternativeSpeedOptions();
    const totalClothCount = getTotalClothCount();
    const isFreeDelivery = totalClothCount > 9 && deliverySpeed === 'normal';

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
            className="min-h-screen bg-gradient-to-br from-secondary/10 via-background to-primary/5 py-12 sm:py-20"
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
                        className="text-center mb-8 sm:mb-12"
                    >
                        <motion.div 
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ delay: 0.4, type: "spring" }}
                            className="bg-gradient-to-r from-primary to-primary/80 w-16 h-16 sm:w-20 sm:h-20 rounded-full flex items-center justify-center mx-auto mb-4 sm:mb-6 shadow-lg shadow-primary/20"
                        >
                            <Shirt className="w-8 h-8 sm:w-10 sm:h-10 text-white" />
                        </motion.div>
                        <motion.h1 
                            initial={{ y: 10, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ delay: 0.5 }}
                            className="text-3xl sm:text-4xl font-bold text-foreground mb-2 sm:mb-3 bg-gradient-to-r from-foreground to-foreground/80 bg-clip-text text-transparent"
                        >
                            Book Your Slot
                        </motion.h1>
                        <motion.p 
                            initial={{ y: 10, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ delay: 0.6 }}
                            className="text-muted-foreground text-base sm:text-lg"
                        >
                            Select items, choose delivery speed, and pick your preferred time
                        </motion.p>
                    </motion.div>

                    {/* Delivery Speed Cards */}
                    <motion.div
                        variants={containerVariants}
                        initial="hidden"
                        animate="visible"
                        className="mb-6 sm:mb-8"
                    >
                        <motion.div variants={itemVariants}>
                            <Card className="p-6 sm:p-8 border-2 border-primary/10 shadow-xl hover:shadow-2xl transition-all duration-300 rounded-2xl bg-gradient-to-br from-card to-card/95">
                                <div className="flex items-center mb-6">
                                    <div className="bg-gradient-to-r from-primary to-primary/80 p-3 rounded-xl mr-4">
                                        <Rocket className="w-7 h-7 text-white" />
                                    </div>
                                    <div>
                                        <h3 className="text-xl font-bold text-foreground">Delivery Speed</h3>
                                        <p className="text-muted-foreground">Choose how fast you want your service</p>
                                    </div>
                                </div>

                                <div className="grid grid-cols-3 gap-2 sm:gap-3 mb-6 md:gap-4">
                                    {/* Normal Speed */}
                                    <div className="relative">
                                        <button
                                            onClick={() => setDeliverySpeed('normal')}
                                            onMouseEnter={() => setHoveredSpeed('normal')}
                                            onMouseLeave={() => setHoveredSpeed(null)}
                                            className={`w-full p-3 sm:p-4 rounded-lg border-2 transition-all duration-300 transform hover:scale-105 ${deliverySpeed === 'normal'
                                                    ? 'border-blue-500 bg-blue-500 shadow-lg text-white'
                                                    : 'border-blue-300 bg-white hover:border-blue-400 hover:shadow-md text-gray-700'
                                                }`}
                                        >
                                            <div className="flex flex-col items-center space-y-1 sm:space-y-2">
                                                <Shirt className={`w-5 h-5 sm:w-6 sm:h-6 md:w-8 md:h-8 transition-all duration-300 ${deliverySpeed === 'normal' ? 'text-white' : 'text-blue-500'
                                                    }`} />
                                                <span className={`font-semibold text-xs sm:text-sm md:text-base ${deliverySpeed === 'normal' ? 'text-white' : 'text-blue-600'
                                                    }`}>
                                                    Normal
                                                </span>
                                                <span className={`text-xs sm:text-sm ${deliverySpeed === 'normal' ? 'text-blue-100' : 'text-gray-600'
                                                    }`}>₹{deliveryCharges.normal}</span>
                                                <span className={`text-[10px] sm:text-xs ${deliverySpeed === 'normal' ? 'text-blue-100' : 'text-gray-500'
                                                    }`}>7 hr slots</span>
                                            </div>
                                            {deliverySpeed !== 'normal' && (
                                                <div className="absolute -top-1 -right-1">
                                                    <div className="w-3 h-3 bg-blue-400 rounded-full animate-ping"></div>
                                                </div>
                                            )}
                                        </button>
                                    </div>

                                    {/* Express Delivery */}
                                    <div className="relative">
                                        <button
                                            onClick={() => setDeliverySpeed('express')}
                                            onMouseEnter={() => setHoveredSpeed('express')}
                                            onMouseLeave={() => setHoveredSpeed(null)}
                                            className={`w-full p-3 sm:p-4 rounded-lg border-2 transition-all duration-300 transform hover:scale-105 ${deliverySpeed === 'express'
                                                    ? 'border-orange-500 bg-orange-500 shadow-lg text-white'
                                                    : 'border-orange-300 bg-white hover:border-orange-400 hover:shadow-md text-gray-700'
                                                }`}
                                        >
                                            <div className="flex flex-col items-center space-y-1 sm:space-y-2">
                                                <Gauge className={`w-5 h-5 sm:w-6 sm:h-6 md:w-8 md:h-8 transition-all duration-300 ${deliverySpeed === 'express' ? 'text-white' : 'text-orange-500'
                                                    }`} />
                                                <span className={`font-semibold text-xs sm:text-sm md:text-base ${deliverySpeed === 'express' ? 'text-white' : 'text-orange-600'
                                                    }`}>
                                                    Express
                                                </span>
                                                <span className={`text-xs sm:text-sm ${deliverySpeed === 'express' ? 'text-orange-100' : 'text-gray-600'
                                                    }`}>₹{deliveryCharges.express}</span>
                                                <span className={`text-[10px] sm:text-xs ${deliverySpeed === 'express' ? 'text-orange-100' : 'text-gray-500'
                                                    }`}>3 hr</span>
                                            </div>
                                        </button>
                                    </div>

                                    {/* Lightning Fast */}
                                    <div className="relative">
                                        <button
                                            onClick={() => setDeliverySpeed('lightning')}
                                            onMouseEnter={() => setHoveredSpeed('lightning')}
                                            onMouseLeave={() => setHoveredSpeed(null)}
                                            className={`w-full p-3 sm:p-4 rounded-lg border-2 transition-all duration-300 transform hover:scale-110 ${deliverySpeed === 'lightning'
                                                    ? 'border-purple-500 bg-gradient-to-br from-purple-500 to-purple-600 shadow-2xl text-white'
                                                    : 'border-purple-300 bg-white hover:border-purple-400 hover:shadow-md text-gray-700'
                                                }`}
                                        >
                                            <div className="flex flex-col items-center space-y-1 sm:space-y-2">
                                                <Zap className={`w-5 h-5 sm:w-6 sm:h-6 md:w-8 md:h-8 transition-all duration-300 ${deliverySpeed === 'lightning' ? 'text-yellow-300 animate-bounce' : 'text-purple-500'
                                                    }`} />
                                                <span className={`font-semibold text-xs sm:text-sm md:text-base ${deliverySpeed === 'lightning' ? 'text-white' : 'text-purple-600'
                                                    }`}>
                                                    Lightning
                                                </span>
                                                <span className={`text-xs sm:text-sm ${deliverySpeed === 'lightning' ? 'text-purple-100' : 'text-gray-600'
                                                    }`}>₹{deliveryCharges.lightning}</span>
                                                <span className={`text-[10px] sm:text-xs ${deliverySpeed === 'lightning' ? 'text-purple-100' : 'text-gray-500'
                                                    }`}>1.5 hr</span>
                                            </div>
                                        </button>
                                    </div>
                                </div>

                                {/* Active Speed Info */}
                                <AnimatePresence>
                                    <motion.div
                                        initial={{ opacity: 0, height: 0 }}
                                        animate={{ opacity: 1, height: 'auto' }}
                                        exit={{ opacity: 0, height: 0 }}
                                        className={`p-4 rounded-lg ${
                                            deliverySpeed === 'normal' ? 'bg-blue-50 border-blue-200' :
                                            deliverySpeed === 'express' ? 'bg-orange-50 border-orange-200' :
                                            'bg-purple-50 border-purple-200'
                                        } border`}
                                    >
                                        <div className="flex items-start space-x-3">
                                            <div className={`p-2 rounded-lg ${
                                                deliverySpeed === 'normal' ? 'bg-blue-100' :
                                                deliverySpeed === 'express' ? 'bg-orange-100' :
                                                'bg-purple-100'
                                            }`}>
                                                <Info className={`w-5 h-5 ${
                                                    deliverySpeed === 'normal' ? 'text-blue-600' :
                                                    deliverySpeed === 'express' ? 'text-orange-600' :
                                                    'text-purple-600'
                                                }`} />
                                            </div>
                                            <div>
                                                <h4 className="font-bold text-foreground mb-2">
                                                    {speedInfo[deliverySpeed].title} Features:
                                                </h4>
                                                <ul className="space-y-1">
                                                    {speedInfo[deliverySpeed].features.map((feature, index) => (
                                                        <li key={index} className="flex items-center text-sm text-muted-foreground">
                                                            <Check className="w-3 h-3 mr-2 text-green-500" />
                                                            {feature}
                                                        </li>
                                                    ))}
                                                </ul>
                                                <p className="text-sm text-muted-foreground mt-3">
                                                    {speedInfo[deliverySpeed].description}
                                                </p>
                                            </div>
                                        </div>
                                    </motion.div>
                                </AnimatePresence>
                            </Card>
                        </motion.div>
                    </motion.div>

                    {/* Offer Card */}
                    <motion.div variants={itemVariants}>
                        <OfferCard />
                    </motion.div>

                    {/* Item Selection */}
                    <motion.div variants={itemVariants}>
                        <Card ref={itemsRef} className="p-6 sm:p-8 my-6 border-2 border-primary/10 shadow-xl hover:shadow-2xl transition-all duration-300 rounded-2xl bg-gradient-to-br from-card to-card/95">
                            <div className="flex items-center mb-6">
                                <div className="bg-gradient-to-r from-primary to-primary/80 p-3 rounded-xl mr-4">
                                    <ShoppingCart className="w-7 h-7 text-white" />
                                </div>
                                <div>
                                    <h3 className="text-xl font-bold text-foreground">Select Items</h3>
                                    <p className="text-muted-foreground">Choose items and quantity</p>
                                </div>
                            </div>

                            {itemList.length > 0 && itemList.map((item, index) => (
                                <motion.div
                                    key={item._id}
                                    variants={itemVariants}
                                    className={`${index === 0 ? 'mb-8' : 'mt-6'} p-4 rounded-xl border hover:border-primary/30 transition-all duration-200 ${
                                        (itemCounts[item._id] || 0) > 0 ? 'bg-primary/5 border-primary/20' : 'bg-secondary/10 border-secondary'
                                    }`}
                                >
                                    {index === 0 ? (
                                        <>
                                            <div className="text-center mb-6">
                                                <h3 className="text-xl font-bold text-primary mb-2">
                                                    {item.name} (₹{item.price})
                                                </h3>
                                                <p className="text-muted-foreground">Select quantity</p>
                                            </div>
                                            
                                            <div className="flex justify-center flex-wrap gap-2 mb-6">
                                                {[1, 3, 6, 9, 10, 12, 15, 18, 20].map((btn) => (
                                                    <motion.button
                                                        key={btn}
                                                        whileHover={{ scale: 1.05 }}
                                                        whileTap={{ scale: 0.95 }}
                                                        onClick={() => handleItemCountChange(item._id, btn)}
                                                        className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                                                            itemCounts[item._id] === btn
                                                                ? 'bg-primary text-primary-foreground shadow-lg'
                                                                : 'bg-secondary hover:bg-secondary/80 text-foreground'
                                                        }`}
                                                    >
                                                        {btn}
                                                    </motion.button>
                                                ))}
                                            </div>
                                            
                                            <div className="flex items-center justify-center space-x-4">
                                                <motion.button
                                                    whileHover={{ scale: 1.1 }}
                                                    whileTap={{ scale: 0.9 }}
                                                    onClick={() => handleItemCountChange(item._id, (itemCounts[item._id] || 0) - 1)}
                                                    className="w-12 h-12 rounded-full bg-secondary hover:bg-secondary/80 flex items-center justify-center transition-all duration-200"
                                                >
                                                    <Minus className="w-5 h-5" />
                                                </motion.button>

                                                <div className="font-bold text-3xl min-w-[60px] text-center">
                                                    {itemCounts[item._id] || 0}
                                                </div>

                                                <motion.button
                                                    whileHover={{ scale: 1.1 }}
                                                    whileTap={{ scale: 0.9 }}
                                                    onClick={() => handleItemCountChange(item._id, (itemCounts[item._id] || 0) + 1)}
                                                    className="w-12 h-12 rounded-full bg-primary hover:bg-primary/90 text-primary-foreground flex items-center justify-center transition-all duration-200"
                                                >
                                                    <Plus className="w-5 h-5" />
                                                </motion.button>
                                            </div>
                                        </>
                                    ) : (
                                        <div className="flex justify-between items-center">
                                            <div>
                                                <h4 className="font-bold text-foreground">{item.name}</h4>
                                                <p className="text-sm text-muted-foreground">₹{item.price} per item</p>
                                            </div>
                                            <div className="flex items-center space-x-3">
                                                <motion.button
                                                    whileHover={{ scale: 1.1 }}
                                                    whileTap={{ scale: 0.9 }}
                                                    onClick={() => handleItemCountChange(item._id, (itemCounts[item._id] || 0) - 1)}
                                                    className="w-8 h-8 rounded-full bg-secondary hover:bg-secondary/80 flex items-center justify-center"
                                                >
                                                    <Minus className="w-3 h-3" />
                                                </motion.button>
                                                <div className="font-bold text-xl min-w-[40px] text-center">
                                                    {itemCounts[item._id] || 0}
                                                </div>
                                                <motion.button
                                                    whileHover={{ scale: 1.1 }}
                                                    whileTap={{ scale: 0.9 }}
                                                    onClick={() => handleItemCountChange(item._id, (itemCounts[item._id] || 0) + 1)}
                                                    className="w-8 h-8 rounded-full bg-primary hover:bg-primary/90 text-primary-foreground flex items-center justify-center"
                                                >
                                                    <Plus className="w-3 h-3" />
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
                                    className="text-red-500 text-sm mt-4 flex items-center justify-center"
                                >
                                    <AlertCircle className="w-4 h-4 mr-2" />
                                    {errors.items}
                                </motion.p>
                            )}
                        </Card>
                    </motion.div>

                    {/* Free Delivery Info */}
                    {isFreeDelivery && (
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="my-6"
                        >
                            <div className="p-6 bg-gradient-to-r from-emerald-500 to-green-500 rounded-2xl shadow-xl border-2 border-emerald-400">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center space-x-4">
                                        <div className="bg-white/20 p-3 rounded-full">
                                            <Gift className="w-8 h-8 text-white" />
                                        </div>
                                        <div>
                                            <h4 className="text-xl font-bold text-white">🎉 Free Delivery Unlocked!</h4>
                                            <p className="text-white/90">
                                                You've selected {totalClothCount} items. Delivery charges waived!
                                            </p>
                                        </div>
                                    </div>
                                    <Sparkles className="w-8 h-8 text-yellow-300" />
                                </div>
                            </div>
                        </motion.div>
                    )}

                    {/* Slot Selection */}
                    <motion.div variants={itemVariants}>
                        <Card ref={slotRef} className="p-6 sm:p-8 my-6 border-2 border-primary/10 shadow-xl hover:shadow-2xl transition-all duration-300 rounded-2xl bg-gradient-to-br from-card to-card/95">
                            <div className="flex items-center mb-6">
                                <div className="bg-gradient-to-r from-primary to-primary/80 p-3 rounded-xl mr-4">
                                    <Clock className="w-7 h-7 text-white" />
                                </div>
                                <div>
                                    <h3 className="text-xl font-bold text-foreground">Select Time Slot</h3>
                                    <p className="text-muted-foreground">Choose your preferred delivery time</p>
                                </div>
                            </div>

                            {todaySlots.length === 0 && (
                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="mb-6 p-4 bg-gradient-to-r from-amber-50 to-orange-50 border-2 border-amber-300 rounded-xl"
                                >
                                    <div className="flex items-center space-x-3">
                                        <Calendar className="w-6 h-6 text-amber-600" />
                                        <div>
                                            <h4 className="font-bold text-amber-800 mb-1">
                                                No slots available today for {speedInfo[deliverySpeed].title}
                                            </h4>
                                            <p className="text-sm text-amber-700">
                                                All slots shown below are for tomorrow
                                            </p>
                                        </div>
                                    </div>
                                </motion.div>
                            )}

                            {todaySlots.length > 0 && (
                                <div className="mb-4 p-3 bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-lg">
                                    <div className="flex items-center space-x-2">
                                        <Timer className="w-4 h-4 text-green-600" />
                                        <p className="text-sm font-medium text-green-800">
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
                                        padding: "12px 16px",
                                        minHeight: "56px",
                                        backgroundColor: 'hsl(var(--card))',
                                        boxShadow: state.isFocused ? '0 0 0 3px rgba(59, 130, 246, 0.1)' : 'none',
                                        transition: 'all 0.2s ease',
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
                                        boxShadow: '0 10px 25px rgba(0,0,0,0.1)'
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
                                        padding: "12px 16px",
                                        cursor: 'pointer',
                                        fontSize: '14px',
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
                                    className="text-red-500 text-sm mt-2 flex items-center"
                                >
                                    <AlertCircle className="w-4 h-4 mr-1" />
                                    {errors.selectedSlot}
                                </motion.p>
                            )}
                        </Card>
                    </motion.div>

                    {/* Payment Selection */}
                    <motion.div variants={itemVariants}>
                        <Card ref={paymentRef} className="p-6 sm:p-8 my-6 border-2 border-primary/10 shadow-xl hover:shadow-2xl transition-all duration-300 rounded-2xl bg-gradient-to-br from-card to-card/95">
                            <div className="flex items-center mb-6">
                                <div className="bg-gradient-to-r from-primary to-primary/80 p-3 rounded-xl mr-4">
                                    <Wallet className="w-7 h-7 text-white" />
                                </div>
                                <div>
                                    <h3 className="text-xl font-bold text-foreground">Payment Method</h3>
                                    <p className="text-muted-foreground">Choose how you want to pay</p>
                                </div>
                            </div>

                            <div className="space-y-4">
                                <motion.label
                                    whileHover={{ scale: 1.02 }}
                                    className={`flex items-center p-4 rounded-xl border-2 cursor-pointer transition-all duration-200 ${
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
                                    <div className="w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 mr-4">
                                        <div className={`w-2.5 h-2.5 rounded-full transition-all ${
                                            paymenttype === 'online payment' ? 'bg-primary' : 'bg-transparent'
                                        }`} />
                                    </div>
                                    <CreditCard className="w-6 h-6 text-primary mr-3" />
                                    <div className="flex-1">
                                        <h4 className="font-bold text-foreground">Online Payment</h4>
                                        <p className="text-sm text-muted-foreground">Pay securely online after delivery</p>
                                    </div>
                                    <Shield className="w-5 h-5 text-green-500" />
                                </motion.label>

                                <motion.label
                                    whileHover={{ scale: 1.02 }}
                                    className={`flex items-center p-4 rounded-xl border-2 cursor-pointer transition-all duration-200 ${
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
                                    <div className="w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 mr-4">
                                        <div className={`w-2.5 h-2.5 rounded-full transition-all ${
                                            paymenttype === 'cash on delivery' ? 'bg-primary' : 'bg-transparent'
                                        }`} />
                                    </div>
                                    <HandCoins className="w-6 h-6 text-primary mr-3" />
                                    <div className="flex-1">
                                        <h4 className="font-bold text-foreground">Cash on Delivery</h4>
                                        <p className="text-sm text-muted-foreground">Pay cash when you receive your items</p>
                                    </div>
                                </motion.label>
                            </div>

                            {errors.paymenttype && (
                                <motion.p
                                    initial={{ opacity: 0, y: -10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="text-red-500 text-sm mt-4 flex items-center"
                                >
                                    <AlertCircle className="w-4 h-4 mr-1" />
                                    {errors.paymenttype}
                                </motion.p>
                            )}
                        </Card>
                    </motion.div>

                    {/* Order Summary */}
                    <motion.div variants={itemVariants}>
                        <Card className="p-6 sm:p-8 border-2 border-primary/10 shadow-xl hover:shadow-2xl transition-all duration-300 rounded-2xl bg-gradient-to-br from-card to-card/95">
                            <div className="flex items-center mb-6">
                                <div className="bg-gradient-to-r from-primary to-primary/80 p-3 rounded-xl mr-4">
                                    <ListOrdered className="w-7 h-7 text-white" />
                                </div>
                                <div>
                                    <h3 className="text-xl font-bold text-foreground">Order Summary</h3>
                                    <p className="text-muted-foreground">Review your order details</p>
                                </div>
                            </div>

                            <div className="space-y-4 mb-6">
                                {/* Items Breakdown */}
                                {itemList.map((item) => {
                                    const count = itemCounts[item._id] || 0;
                                    if (count === 0) return null;
                                    const itemTotal = count * Number(item.price);
                                    return (
                                        <div key={item._id} className="flex justify-between items-center p-3 bg-secondary/20 rounded-lg">
                                            <div className="flex items-center space-x-3">
                                                <Shirt className="w-4 h-4 text-primary" />
                                                <span className="font-medium">{item.name}</span>
                                                <span className="text-sm text-muted-foreground">× {count}</span>
                                            </div>
                                            <span className="font-bold">₹{itemTotal}</span>
                                        </div>
                                    );
                                })}

                                {/* Subtotal */}
                                {totalClothCount > 0 && (
                                    <div className="flex justify-between p-3 border-t border-b border-secondary/30">
                                        <div className="font-medium">Items Subtotal ({totalClothCount} items)</div>
                                        <div className="font-bold">₹{getItemsSubtotal()}</div>
                                    </div>
                                )}

                                {/* Delivery Charges */}
                                <div className="flex justify-between items-center p-3 bg-secondary/10 rounded-lg">
                                    <div className="flex items-center space-x-3">
                                        <Truck className="w-4 h-4 text-primary" />
                                        <span>Delivery Charges ({speedInfo[deliverySpeed].title})</span>
                                        {isFreeDelivery && (
                                            <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">
                                                FREE
                                            </span>
                                        )}
                                    </div>
                                    <div className="flex items-center space-x-2">
                                        {isFreeDelivery ? (
                                            <>
                                                <span className="line-through text-muted-foreground">₹{deliveryCharges[deliverySpeed]}</span>
                                                <span className="font-bold text-green-600">₹0</span>
                                            </>
                                        ) : (
                                            <span className="font-bold">₹{deliveryCharges[deliverySpeed]}</span>
                                        )}
                                    </div>
                                </div>

                                {/* Platform Charges */}
                                <div className="flex justify-between items-center p-3 bg-gradient-to-r from-amber-50/50 to-yellow-50/50 rounded-lg border border-amber-200/50">
                                    <div className="flex items-center space-x-3">
                                        <Tag className="w-4 h-4 text-amber-600" />
                                        <span className="text-foreground">Platform Charges</span>
                                        <span className="text-xs bg-amber-100 text-amber-800 px-2 py-1 rounded-full">
                                            FREE
                                        </span>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                        <span className="line-through text-muted-foreground">₹10</span>
                                        <span className="font-bold text-green-600">₹0</span>
                                    </div>
                                </div>

                                {/* Total */}
                                <motion.div
                                    initial={{ scale: 0.95 }}
                                    animate={{ scale: 1 }}
                                    className="flex justify-between items-center p-4 bg-gradient-to-r from-primary/10 to-primary/5 rounded-xl border-2 border-primary/20"
                                >
                                    <div className="font-bold text-lg">Total Amount</div>
                                    <div className="text-2xl font-bold text-primary">₹{getTotalAmount()}</div>
                                </motion.div>

                                {/* Savings Summary */}
                                {(isFreeDelivery || getDeliveryCharge() === 0) && (
                                    <motion.div
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        className="p-4 bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-lg"
                                    >
                                        <h4 className="font-bold text-green-800 mb-3 flex items-center">
                                            <Sparkles className="w-4 h-4 mr-2 text-green-600" />
                                            You're Saving
                                        </h4>
                                        <div className="space-y-2">
                                            {isFreeDelivery && (
                                                <div className="flex justify-between items-center">
                                                    <div className="flex items-center space-x-2">
                                                        <Truck className="w-4 h-4 text-green-600" />
                                                        <span className="text-green-700">Delivery Charges</span>
                                                    </div>
                                                    <span className="font-bold text-green-700">₹{deliveryCharges[deliverySpeed]}</span>
                                                </div>
                                            )}
                                            <div className="flex justify-between items-center">
                                                <div className="flex items-center space-x-2">
                                                    <Tag className="w-4 h-4 text-amber-600" />
                                                    <span className="text-amber-700">Platform Charges</span>
                                                </div>
                                                <span className="font-bold text-amber-700">₹10</span>
                                            </div>
                                            <div className="pt-2 border-t border-green-300">
                                                <div className="flex justify-between items-center">
                                                    <span className="font-bold text-green-800">Total Savings</span>
                                                    <span className="font-bold text-xl text-green-800">
                                                        ₹{isFreeDelivery ? deliveryCharges[deliverySpeed] + 10 : 10}
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
                                    className="w-full py-6 text-lg font-bold bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary shadow-xl hover:shadow-2xl transition-all duration-300 group"
                                >
                                    {isLoading ? (
                                        <div className="flex items-center justify-center">
                                            <motion.div
                                                animate={{ rotate: 360 }}
                                                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                                                className="w-5 h-5 border-2 border-white border-t-transparent rounded-full mr-2"
                                            />
                                            Processing...
                                        </div>
                                    ) : (
                                        <div className="flex items-center justify-center">
                                            <span>Proceed to Confirm Address</span>
                                            <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                                        </div>
                                    )}
                                </Button>
                            </motion.div>
                        </Card>
                    </motion.div>
                </motion.div>
            </div>
        </motion.div>
    );
};

export default BookSlot;