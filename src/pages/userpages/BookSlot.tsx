import { useContext, useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Shirt, ShoppingCart, Clock, Wallet, CreditCard, HandCoins, ListOrdered, Plus, Minus, Zap, Gauge, Info, Calendar } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { toast } from "react-toastify";
import { SteamContext } from '@/hooks/steamcontext';
import Select from "react-select";

const BookSlot = () => {
    const [isLoading, setIsLoading] = useState(false);
    const steamcontext = useContext(SteamContext);
    const [selectedSlot, setSelectedSlot] = useState<string | null>(null);
    const [totalcloths, setTotalcloths] = useState('1');
    const { formData, setFormData, orderdetails, setorderdetails } = steamcontext;
    const [isinputon, setisinputon] = useState(false);
    const [paymenttype, selectpaymenttype] = useState('');
    const [totalamount, settotalamount] = useState(0);
    const [deliverySpeed, setDeliverySpeed] = useState<'normal' | 'Express' | 'lightning'>('normal');
    const [hoveredSpeed, setHoveredSpeed] = useState<string | null>(null);
    const [currentTime, setCurrentTime] = useState(new Date());

    const [errors, setErrors] = useState({
        totalcloths: "",
        selectedSlot: "",
        paymenttype: "",
    });

    const clothRef = useRef<HTMLDivElement | null>(null);
    const slotRef = useRef<HTMLDivElement | null>(null);
    const paymentRef = useRef<HTMLDivElement | null>(null);

    const navigate = useNavigate();

    let ironprice = 15;
    let handlingcharge = 10;

    const deliveryCharges = {
        normal: 20,
        Express: 35,
        lightning: 45
    };

    const speedInfo = {
        normal: {
            title: "Normal Delivery",
            description: "Standard 7-hour time slots. Best for planned schedules.",
            icon: Shirt,
            color: "blue",
            bufferHours: 3
        },
        Express: {
            title: "Speed Delivery",
            description: "Quick 3-hour slots. Faster service with moderate priority.",
            icon: Gauge,
            color: "orange",
            bufferHours: 2
        },
        lightning: {
            title: "Lightning Delivery",
            description: "Express 1.5-hour slots. Highest priority and fastest service!",
            icon: Zap,
            color: "purple",
            bufferHours: 1
        }
    };

    const buttonValues = ['1', '3', '6', '9', '10', '12', '15', '18', '20'];

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
        const bufferHours = 3; // Fixed 3-hour freezing time before slot end
        
        // Convert current time to decimal hours for accurate comparison
        const currentTimeDecimal = currentHour + (currentMinutes / 60);
        const deadlineTimeDecimal = endHour - bufferHours;
        
        return currentTimeDecimal < deadlineTimeDecimal;
    };

    const getAllTimeSlots = () => {
        let allSlots: string[] = [];
        
        switch(deliverySpeed) {
            case 'normal':
                allSlots = ['6AM - 1PM', '1PM - 8PM'];
                break;
            case 'Express':
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
        
        // If there are today slots available, only show today slots
        if (todaySlots.length > 0) {
            return todaySlots.map(slot => ({
                value: slot,
                label: slot,
                isToday: true
            }));
        }
        
        // If no today slots, show tomorrow slots
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

    useEffect(() => {
        const deliveryprice = deliveryCharges[deliverySpeed];
        settotalamount(handlingcharge + deliveryprice + (Number(totalcloths) * ironprice));
    }, [totalcloths, deliverySpeed]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        let newErrors = { totalcloths: "", selectedSlot: "", paymenttype: "" };
        let firstErrorRef: HTMLDivElement | null = null;

        if (!totalcloths) {
            newErrors.totalcloths = "* Please enter the number of cloths";
            firstErrorRef = firstErrorRef || clothRef.current;
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

        // Extract the actual slot and check if it's tomorrow
        const isTomorrow = selectedSlot?.includes('__tomorrow') || false;
        const actualSlot = isTomorrow ? selectedSlot?.replace('__tomorrow', '') : selectedSlot;

        const updatedOrderDetails = {
            ...orderdetails,
            otherdetails: {
                totalcloths,
                timeslot: actualSlot,
                paymenttype,
                totalamount,
                deliverySpeed,
                isNextDay: isTomorrow
            }
        };

        setorderdetails(updatedOrderDetails);
        localStorage.setItem('orderdetails', JSON.stringify(updatedOrderDetails));
        navigate('/customer/confirmaddress');
    };

    const allSlotOptions = getCombinedSlots();
    const todaySlots = getTodaySlots();

    const getAlternativeSpeedOptions = () => {
        const alternatives = [];
        const speeds: Array<'normal' | 'Express' | 'lightning'> = ['normal', 'Express', 'lightning'];
        
        for (const speed of speeds) {
            if (speed !== deliverySpeed) {
                const testSlots = speed === 'normal' 
                    ? ['6AM - 1PM', '1PM - 8PM']
                    : speed === 'Express'
                    ? ['6AM - 9AM', '9AM - 12PM', '12PM - 3PM', '3PM - 6PM', '6PM - 8PM']
                    : ['8AM - 9:30AM', '9:30AM - 11AM', '11AM - 12:30PM', '12:30PM - 2PM', 
                       '2PM - 3:30PM', '3:30PM - 5PM', '5PM - 6:30PM', '6:30PM - 8PM', '8PM - 9:30PM'];
                
                const currentHour = currentTime.getHours();
                const currentMinutes = currentTime.getMinutes();
                const currentTimeDecimal = currentHour + (currentMinutes / 60);
                
                const availableToday = testSlots.some(slot => {
                    const { endHour } = parseTimeSlot(slot);
                    const deadlineTimeDecimal = endHour - 3; // Fixed 3-hour freezing time
                    return currentTimeDecimal < deadlineTimeDecimal;
                });
                
                if (availableToday) {
                    alternatives.push(speed);
                }
            }
        }
        
        return alternatives;
    };

    const alternativeOptions = getAlternativeSpeedOptions();

    return (
        <div className="min-h-screen bg-secondary/20 py-20">
            <div className="container mx-auto px-4">
                <div className="max-w-2xl mx-auto">
                    <div className="text-center mb-8">
                        <div className="bg-primary/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                            <Shirt className="w-8 h-8 text-primary" />
                        </div>
                        <h1 className="text-2xl sm:text-3xl font-bold text-foreground mb-2">
                            Book Iron Slot
                        </h1>
                        <p className="text-sm sm:text-base text-muted-foreground">
                            Select your preferred slot and quantity
                        </p>
                    </div>

                    {/* Delivery Speed Selection - Outside Card */}
                    <div className="mb-5 px-2">
                        <h3 className="text-base sm:text-lg font-semibold text-foreground flex items-center space-x-2 mb-4">
                            <Zap className="w-4 h-4 sm:w-5 sm:h-5 text-primary" />
                            <span>Choose Delivery Speed</span>
                        </h3>
                        
                        <div className="grid grid-cols-3 gap-2 sm:gap-3 md:gap-4">
                            {/* Normal Speed */}
                            <div className="relative">
                                <button
                                    onClick={() => setDeliverySpeed('normal')}
                                    onMouseEnter={() => setHoveredSpeed('normal')}
                                    onMouseLeave={() => setHoveredSpeed(null)}
                                    className={`w-full p-3 sm:p-4 rounded-lg border-2 transition-all duration-300 transform hover:scale-105 ${
                                        deliverySpeed === 'normal' 
                                            ? 'border-blue-500 bg-blue-500 shadow-lg text-white' 
                                            : 'border-blue-300 bg-white hover:border-blue-400 hover:shadow-md text-gray-700'
                                    }`}
                                >
                                    <div className="flex flex-col items-center space-y-1 sm:space-y-2">
                                        <Shirt className={`w-5 h-5 sm:w-6 sm:h-6 md:w-8 md:h-8 transition-all duration-300 ${
                                            deliverySpeed === 'normal' ? 'text-white' : 'text-blue-500'
                                        } ${deliverySpeed !== 'normal' ? 'animate-bounce' : ''}`} />
                                        <span className={`font-semibold text-xs sm:text-sm md:text-base ${
                                            deliverySpeed === 'normal' ? 'text-white' : 'text-blue-600'
                                        }`}>
                                            Normal
                                        </span>
                                        <span className={`text-xs sm:text-sm ${
                                            deliverySpeed === 'normal' ? 'text-blue-100' : 'text-gray-600'
                                        }`}>₹{deliveryCharges.normal}</span>
                                        <span className={`text-[10px] sm:text-xs ${
                                            deliverySpeed === 'normal' ? 'text-blue-100' : 'text-gray-500'
                                        }`}>7 hr slots</span>
                                    </div>
                                    {deliverySpeed !== 'normal' && (
                                        <div className="absolute -top-1 -right-1">
                                            <div className="w-3 h-3 bg-blue-400 rounded-full animate-ping"></div>
                                        </div>
                                    )}
                                </button>
                                
                                {hoveredSpeed === 'normal' && (
                                    <div className="hidden sm:block absolute z-10 w-64 p-3 mt-2 bg-white border border-gray-200 rounded-lg shadow-xl left-1/2 transform -translate-x-1/2">
                                        <div className="flex items-start space-x-2">
                                            <Info className="w-4 h-4 text-blue-500 mt-0.5 flex-shrink-0" />
                                            <div>
                                                <p className="font-semibold text-sm text-gray-800">{speedInfo.normal.title}</p>
                                                <p className="text-xs text-gray-600 mt-1">{speedInfo.normal.description}</p>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Speed Delivery */}
                            <div className="relative">
                                <button
                                    onClick={() => setDeliverySpeed('Express')}
                                    onMouseEnter={() => setHoveredSpeed('Express')}
                                    onMouseLeave={() => setHoveredSpeed(null)}
                                    className={`w-full p-3 sm:p-4 rounded-lg border-2 transition-all duration-300 transform hover:scale-105 ${
                                        deliverySpeed === 'Express' 
                                            ? 'border-orange-500 bg-orange-500 shadow-lg text-white' 
                                            : 'border-orange-300 bg-white hover:border-orange-400 hover:shadow-md text-gray-700'
                                    } ${deliverySpeed !== 'Express' ? 'hover:animate-pulse' : ''}`}
                                >
                                    <div className="flex flex-col items-center space-y-1 sm:space-y-2">
                                        <Gauge className={`w-5 h-5 sm:w-6 sm:h-6 md:w-8 md:h-8 transition-all duration-300 ${
                                            deliverySpeed === 'Express' ? 'text-white' : 'text-orange-500'
                                        } ${deliverySpeed === 'Express' ? 'animate-spin' : ''}`} 
                                        style={{ animationDuration: deliverySpeed === 'Express' ? '2s' : 'none' }} />
                                        <span className={`font-semibold text-xs sm:text-sm md:text-base ${
                                            deliverySpeed === 'Express' ? 'text-white' : 'text-orange-600'
                                        }`}>
                                            Express
                                        </span>
                                        <span className={`text-xs sm:text-sm ${
                                            deliverySpeed === 'Express' ? 'text-orange-100' : 'text-gray-600'
                                        }`}>₹{deliveryCharges.Express}</span>
                                        <span className={`text-[10px] sm:text-xs ${
                                            deliverySpeed === 'Express' ? 'text-orange-100' : 'text-gray-500'
                                        }`}>3 hr</span>
                                    </div>
                                    {deliverySpeed === 'Express' && (
                                        <div className="absolute top-2 right-2">
                                            <div className="w-2 h-2 bg-white rounded-full animate-ping"></div>
                                        </div>
                                    )}
                                    {deliverySpeed !== 'Express' && (
                                        <div className="absolute -top-1 -right-1">
                                            <div className="w-3 h-3 bg-orange-400 rounded-full animate-pulse"></div>
                                        </div>
                                    )}
                                </button>
                                
                                {hoveredSpeed === 'Express' && (
                                    <div className="hidden sm:block absolute z-10 w-64 p-3 mt-2 bg-white border border-gray-200 rounded-lg shadow-xl left-1/2 transform -translate-x-1/2">
                                        <div className="flex items-start space-x-2">
                                            <Info className="w-4 h-4 text-orange-500 mt-0.5 flex-shrink-0" />
                                            <div>
                                                <p className="font-semibold text-sm text-gray-800">{speedInfo.Express.title}</p>
                                                <p className="text-xs text-gray-600 mt-1">{speedInfo.Express.description}</p>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Lightning Fast */}
                            <div className="relative">
                                <button
                                    onClick={() => setDeliverySpeed('lightning')}
                                    onMouseEnter={() => setHoveredSpeed('lightning')}
                                    onMouseLeave={() => setHoveredSpeed(null)}
                                    className={`w-full p-3 sm:p-4 rounded-lg border-2 transition-all duration-300 transform hover:scale-110 ${
                                        deliverySpeed === 'lightning' 
                                            ? 'border-purple-500 bg-gradient-to-br from-purple-500 to-purple-600 shadow-2xl text-white' 
                                            : 'border-purple-300 bg-white hover:border-purple-400 hover:shadow-md text-gray-700'
                                    } ${deliverySpeed !== 'lightning' ? 'hover:animate-pulse' : ''}`}
                                >
                                    <div className="flex flex-col items-center space-y-1 sm:space-y-2">
                                        <Zap className={`w-5 h-5 sm:w-6 sm:h-6 md:w-8 md:h-8 transition-all duration-300 ${
                                            deliverySpeed === 'lightning' ? 'text-yellow-300 animate-bounce' : 'text-purple-500'
                                        }`} />
                                        <span className={`font-semibold text-xs sm:text-sm md:text-base ${
                                            deliverySpeed === 'lightning' ? 'text-white' : 'text-purple-600'
                                        }`}>
                                            Lightning
                                        </span>
                                        <span className={`text-xs sm:text-sm ${
                                            deliverySpeed === 'lightning' ? 'text-purple-100' : 'text-gray-600'
                                        }`}>₹{deliveryCharges.lightning}</span>
                                        <span className={`text-[10px] sm:text-xs ${
                                            deliverySpeed === 'lightning' ? 'text-purple-100' : 'text-gray-500'
                                        }`}>1.5 hr</span>
                                    </div>
                                    {deliverySpeed === 'lightning' && (
                                        <>
                                            <div className="absolute top-2 right-2">
                                                <Zap className="w-4 h-4 text-yellow-300 animate-ping" />
                                            </div>
                                            <div className="absolute top-2 left-2">
                                                <div className="w-2 h-2 bg-yellow-300 rounded-full animate-pulse"></div>
                                            </div>
                                        </>
                                    )}
                                    {deliverySpeed !== 'lightning' && (
                                        <div className="absolute -top-1 -right-1">
                                            <Zap className="w-4 h-4 text-purple-400 animate-bounce" />
                                        </div>
                                    )}
                                </button>
                                
                                {hoveredSpeed === 'lightning' && (
                                    <div className="hidden sm:block absolute z-10 w-64 p-3 mt-2 bg-white border border-gray-200 rounded-lg shadow-xl left-1/2 transform -translate-x-1/2">
                                        <div className="flex items-start space-x-2">
                                            <Info className="w-4 h-4 text-purple-500 mt-0.5 flex-shrink-0" />
                                            <div>
                                                <p className="font-semibold text-sm text-gray-800">{speedInfo.lightning.title}</p>
                                                <p className="text-xs text-gray-600 mt-1">{speedInfo.lightning.description}</p>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className="mt-4 p-3 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg border border-blue-200">
                            <p className="text-xs sm:text-sm text-gray-800">
                                <strong className="text-primary">Selected:</strong> {speedInfo[deliverySpeed].title} - {speedInfo[deliverySpeed].description}
                            </p>
                        </div>
                    </div>

                    {/* Cloth Selection */}
                    <Card ref={clothRef} className="card-service p-4 sm:p-6 md:p-8 mx-2 sm:mx-0">
                        <h3 className="text-base sm:text-lg font-semibold text-foreground flex items-center space-x-2 mb-4">
                            <ShoppingCart className="w-4 h-4 sm:w-5 sm:h-5 text-primary" />
                            <span>Select No of Cloths</span>
                        </h3>

                        <div className='flex justify-center flex-wrap gap-2 my-5'>
                            {buttonValues.map((btn) => (
                                <Button
                                    key={btn}
                                    size={'sm'}
                                    onClick={() => setTotalcloths(btn)}
                                    className={`hover:bg-gray-100 hover:text-primary hover:border-2 min-w-[55px] sm:min-w-[70px] hover:border-primary transition-all duration-200 text-xs sm:text-sm ${
                                        Number(totalcloths) === Number(btn) && 'bg-gray-100 text-primary border-2 border-primary'
                                    }`}
                                >
                                    {btn}
                                </Button>
                            ))}
                        </div>

                        <div className='flex flex-col sm:flex-row justify-between items-center gap-4 px-2 sm:px-4'>
                            <div className='flex items-center space-x-3'>
                                <Button
                                    size="sm"
                                    className='w-8 h-8 sm:w-10 sm:h-10 p-0'
                                    onClick={() => setTotalcloths((prev) => String(Math.max(0, Number(prev) - 1)))}
                                >
                                    <Minus className='w-4 h-4 sm:w-5 sm:h-5' />
                                </Button>
                                <div className='font-bold text-lg sm:text-xl min-w-[40px] text-center'>{totalcloths}</div>
                                <Button
                                    size="sm"
                                    className='w-8 h-8 sm:w-10 sm:h-10 p-0'
                                    onClick={() => setTotalcloths((prev) => String(Number(prev) + 1))}
                                >
                                    <Plus className='w-4 h-4 sm:w-5 sm:h-5' />
                                </Button>
                            </div>
                            <div
                                onClick={() => setisinputon(true)}
                                className='font-medium text-primary text-xs sm:text-sm cursor-pointer hover:underline'
                            >
                                Have more than 20?
                            </div>
                        </div>

                        {isinputon && (
                            <div className='flex w-full max-w-md mx-auto mt-5 gap-2'>
                                <Input
                                    id="cloth"
                                    name="cloth"
                                    type="number"
                                    placeholder="Enter no of cloths"
                                    className="flex-1 text-sm"
                                    value={totalcloths}
                                    onChange={(e) => setTotalcloths(e.target.value)}
                                    required
                                />
                                <Button className='px-4 sm:px-6 text-sm'>
                                    Enter
                                </Button>
                            </div>
                        )}

                        {errors.totalcloths && (
                            <p className="text-red-500 text-xs sm:text-sm mt-2 text-center">{errors.totalcloths}</p>
                        )}
                    </Card>

                    {/* Slot Selection */}
                    <Card ref={slotRef} className="card-service p-4 sm:p-6 md:p-8 my-5 mx-2 sm:mx-0">
                        <h3 className="text-base sm:text-lg mb-4 sm:mb-5 font-semibold text-foreground flex items-center space-x-2">
                            <Clock className="w-4 h-4 sm:w-5 sm:h-5 text-primary" />
                            <span>Select Time Slots</span>
                        </h3>

                        {todaySlots.length === 0 && (
                            <div className="mb-4 p-3 bg-gradient-to-r from-amber-50 to-orange-50 border-2 border-amber-300 rounded-lg">
                                <div className="flex items-center space-x-2 mb-2">
                                    <Calendar className="w-5 h-5 text-amber-600" />
                                    <p className="text-sm font-semibold text-amber-800">
                                        No slots available today for {speedInfo[deliverySpeed].title}
                                    </p>
                                </div>
                                <p className="text-xs text-amber-700 ml-7">
                                    All slots shown below are for tomorrow. {alternativeOptions.length > 0 && "Or try a different delivery speed for today's availability."}
                                </p>
                            </div>
                        )}

                        {todaySlots.length === 0 && alternativeOptions.length > 0 && (
                            <div className="mb-4 p-3 bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-lg">
                                <p className="text-sm font-semibold text-green-800 mb-2">
                                    ✨ Available today with other speeds:
                                </p>
                                <div className="flex flex-wrap gap-2">
                                    {alternativeOptions.map((speed) => (
                                        <button
                                            key={speed}
                                            onClick={() => setDeliverySpeed(speed)}
                                            className="px-3 py-1.5 bg-white border-2 border-green-300 rounded-lg text-xs font-medium text-green-700 hover:bg-green-50 hover:border-green-400 transition-all duration-200 transform hover:scale-105"
                                        >
                                            Switch to {speedInfo[speed].title}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}

                        {todaySlots.length > 0 && (
                            <div className="mb-3 p-2 bg-gradient-to-r from-green-50 to-blue-50 border border-green-200 rounded-lg">
                                <p className="text-xs text-green-700 font-medium">
                                    ✓ {todaySlots.length} slot{todaySlots.length > 1 ? 's' : ''} available today
                                </p>
                            </div>
                        )}

                        {allSlotOptions.length > 0 ? (
                            <Select
                                options={allSlotOptions}
                                value={allSlotOptions.find((opt) => opt.value === selectedSlot) || null}
                                onChange={(selected) => setSelectedSlot(selected?.value || null)}
                                placeholder="Select your preferred time slot"
                                className="w-full text-sm"
                                styles={{
                                    control: (base) => ({
                                        ...base,
                                        borderRadius: "0.5rem",
                                        borderColor: "#D1D5DB",
                                        borderWidth: "1px",
                                        padding: "0.25rem",
                                        fontSize: "0.875rem"
                                    }),
                                    option: (base, state) => ({
                                        ...base,
                                        backgroundColor: state.data.isToday 
                                            ? (state.isFocused ? '#DBEAFE' : '#EFF6FF')
                                            : (state.isFocused ? '#FEF3C7' : state.isSelected ? '#FDE68A' : 'white'),
                                        color: state.data.isToday ? '#1E40AF' : '#92400E',
                                        fontWeight: state.data.isToday ? '500' : '400',
                                        cursor: 'pointer'
                                    })
                                }}
                            />
                        ) : (
                            <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-center">
                                <p className="text-xs sm:text-sm text-red-800">
                                    No available slots. Please try a different delivery speed or check back tomorrow.
                                </p>
                            </div>
                        )}
                        {errors.selectedSlot && (
                            <p className="text-red-500 text-xs sm:text-sm mt-2">{errors.selectedSlot}</p>
                        )}
                    </Card>

                    {/* Payment Section */}
                    <Card ref={paymentRef} className="card-service p-4 sm:p-6 md:p-8 my-5 mx-2 sm:mx-0">
                        <h3 className="text-base sm:text-lg mb-4 sm:mb-5 font-semibold text-foreground flex items-center space-x-2">
                            <Wallet className="w-4 h-4 sm:w-5 sm:h-5 text-primary" />
                            <span>Select Payment Type</span>
                        </h3>

                        <label className="flex items-center mb-4 cursor-pointer p-3 rounded-lg hover:bg-gray-50 transition-colors">
                            <input
                                type="radio"
                                name="payment"
                                value="online"
                                className="hidden peer"
                                checked={paymenttype === 'online payment'}
                                onChange={() => selectpaymenttype('online payment')}
                            />
                            <div className="w-4 h-4 sm:w-5 sm:h-5 mx-2 sm:mx-3 rounded-full border border-gray-400 peer-checked:border-primary peer-checked:bg-primary flex items-center justify-center flex-shrink-0">
                                <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-white"></div>
                            </div>
                            <CreditCard className="w-4 h-4 sm:w-5 sm:h-5 mr-2 text-primary flex-shrink-0" />
                            <span className="text-sm sm:text-base">Online Payment (pay after delivery) </span>
                        </label>

                        <label className="flex items-center cursor-pointer p-3 rounded-lg hover:bg-gray-50 transition-colors">
                            <input
                                type="radio"
                                name="payment"
                                value="cod"
                                className="hidden peer"
                                checked={paymenttype === 'cash on delivery'}
                                onChange={() => selectpaymenttype('cash on delivery')}
                            />
                            <div className="w-4 h-4 sm:w-5 sm:h-5 mx-2 sm:mx-3 rounded-full border border-gray-400 peer-checked:border-primary peer-checked:bg-primary flex items-center justify-center flex-shrink-0">
                                <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-white"></div>
                            </div>
                            <HandCoins className="w-4 h-4 sm:w-5 sm:h-5 mr-2 text-primary flex-shrink-0" />
                            <span className="text-sm sm:text-base">Cash on Delivery</span>
                        </label>

                        {errors.paymenttype && (
                            <p className="text-red-500 text-xs sm:text-sm mt-2">{errors.paymenttype}</p>
                        )}
                    </Card>

                    {/* Payment Summary */}
                    <Card className="card-service p-4 sm:p-6 md:p-8 mx-2 sm:mx-0">
                        <h3 className="text-base sm:text-lg font-semibold text-foreground flex items-center space-x-2 mb-4">
                            <ListOrdered className="w-4 h-4 sm:w-5 sm:h-5 text-primary" />
                            <span>Payment Summary</span>
                        </h3>

                        <div className='flex flex-col font-normal space-y-3 mx-2 sm:mx-4 md:mx-6 lg:mx-10 my-5'>
                            <div className='flex justify-between text-xs sm:text-sm md:text-base'>
                                <div>{totalcloths || 0} Cloths × ₹{ironprice}</div>
                                <div>₹{Number(totalcloths) * ironprice}</div>
                            </div>
                            <div className='flex justify-between text-xs sm:text-sm md:text-base'>
                                <div>Delivery Charges ({deliverySpeed})</div>
                                <div>₹{deliveryCharges[deliverySpeed]}</div>
                            </div>
                            <div className='flex justify-between pb-5 text-xs sm:text-sm md:text-base'>
                                <div>Handling Charges</div>
                                <div>₹{handlingcharge}</div>
                            </div>
                            <div className='w-full h-[2px] bg-gray-200'></div>
                            <div className='flex justify-between font-medium text-sm sm:text-base md:text-lg'>
                                <div>Total Amount</div>
                                <div>₹{totalamount}</div>
                            </div>
                            <div className='w-full h-[2px] bg-gray-200'></div>
                        </div>

                        <div className="pt-4">
                            <Button
                                onClick={handleSubmit}
                                type="submit"
                                className="btn-hero w-full text-sm sm:text-base md:text-lg py-3 sm:py-4 md:py-6"
                                disabled={isLoading}
                            >
                                {isLoading ? 'Saving...' : 'Proceed & Confirm Address'}
                            </Button>
                        </div>
                    </Card>
                </div>
            </div>
        </div>
    );
};

export default BookSlot;