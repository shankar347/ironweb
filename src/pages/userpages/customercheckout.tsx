import { useContext, useState, useEffect } from 'react';
import { Button } from '../../components/ui/button';
import { Card } from '../../components/ui/card';
import { 
  User, Phone, MapPin, Shirt, ShoppingCart, 
  Clock, CreditCard, BanknoteIcon, Receipt, 
  ShoppingBasketIcon, Truck, CheckCircle, AlertCircle,
  ChevronRight, Info, X, FileText, Tag,
  Gift, Loader2, Shield, Wallet, ArrowRight,
  Sparkles, BadgeCheck, IndianRupee, Percent,
  Ticket, Zap, Calendar
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { toast } from "react-toastify";
import { SteamContext } from '../../hooks/steamcontext';
import { API_URL } from '../../hooks/tools';
import { motion, AnimatePresence } from 'framer-motion';
import { initiateOrderPayment } from '../../services/orderPaymentService';

interface ClothItem {
  item: string;
  quantity: string;
  cost: string;
  name?: string;
  count?: number;
}

interface SubscriptionCloth {
  name: string;
  count: number;
  _id: string;
}

interface Subscription {
  _id: string;
  plan: string;
  credits: number;
  cloths: SubscriptionCloth[];
  startdate: string;
  enddate: string;
  status: string;
}

interface RedemptionDetails {
  canRedeem: boolean;
  isFullyRedeemed: boolean;
  totalCreditsNeeded: number;
  insufficientItems: string[];
  redeemedItems: { name: string; count: number; cost: number }[];
  payableAmount: number;
  redeemableCredits: number;
  remainingCredits: number;
  originalAmount: number;
}

interface Coupon {
  _id: string;
  code: string;
  description: string;
  discount_type: 'percentage' | 'flat' | 'free_delivery' | 'buy_x_get_y';
  discount_value: number;
  max_discount_amount?: number | null;
  min_order_amount: number;
  buy_quantity?: number | null;
  free_quantity?: number | null;
  usage_limit?: number | null;
  used_count: number;
  per_user_limit: number;
  valid_from: string;
  valid_until: string;
  is_active: boolean;
}

interface AppliedCoupon {
  coupon: Coupon;
  discountAmount: number;
  finalAmount: number;
  message?: string;
  redeemedItems?: { name: string; count: number; cost: number }[];
}

const Ordersummary = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [showTerms, setShowTerms] = useState(false);
    const [acceptedTerms, setAcceptedTerms] = useState(false);
    const [useSubscription, setUseSubscription] = useState(false);
    const [subscription, setSubscription] = useState<Subscription | null>(null);
    const [redemptionDetails, setRedemptionDetails] = useState<RedemptionDetails | null>(null);
    const [paymentMethod, setPaymentMethod] = useState<'full' | 'redeemed'>('full');
    const [showCashWarning, setShowCashWarning] = useState(false);
    const [coupons, setCoupons] = useState<Coupon[]>([]);
    const [showCouponPanel, setShowCouponPanel] = useState(false);
    const [enteredCouponCode, setEnteredCouponCode] = useState('');
    const [appliedCoupon, setAppliedCoupon] = useState<AppliedCoupon | null>(null);
    const [couponError, setCouponError] = useState<string | null>(null);
    const [isApplyingCoupon, setIsApplyingCoupon] = useState(false);
    const [modifiedOrderCloths, setModifiedOrderCloths] = useState<any[] | null>(null);
    const [deliveryInfo, setDeliveryInfo] = useState<{
        deliveryCharge: number;
        isFreeDelivery: boolean;
        freeDeliveryReason: string | null;
        freeDeliveryReasonText: string | null;
        freeOrdersRemaining: number;
        itemsNeededForFree: number;
        baseCharge: number;
    } | null>(null);
    
    const steamcontext = useContext(SteamContext);
    const { orderdetails, setorderdetails, User: User1 } = steamcontext;
    const [localOrderDetails, setLocalOrderDetails] = useState<any>(null);
    const [showFullAddress, setShowFullAddress] = useState(false);

    const navigate = useNavigate();

    // Check if payment method is cash on delivery
    const isCashOnDelivery = localOrderDetails?.otherdetails?.paymenttype?.toLowerCase() === 'cash on delivery';
    
    // Check delivery speed
    const deliverySpeed = localOrderDetails?.otherdetails?.deliverySpeed?.toLowerCase() || 'normal';

    // Dynamic delivery charge from API (falls back to speed-based if not loaded yet)
    const DELIVERY_CHARGE_FALLBACK = deliverySpeed === 'express' ? 39 : 29;
    const DELIVERY_CHARGE = deliveryInfo?.isFreeDelivery ? 0 : (deliveryInfo?.deliveryCharge ?? DELIVERY_CHARGE_FALLBACK);

    // Fetch active subscription on component mount
    useEffect(() => {
        const fetchSubscription = async () => {
            if (User1?.subscription?._id) {
                try {
                    const response = await fetch(`${API_URL}/user/subscription/${User1.subscription._id}`, {
                        credentials: 'include'
                    });
                    const data = await response.json();
                    if (data.success) {
                        setSubscription(data.subscription);
                    }
                } catch (error) {
                    console.error('Error fetching subscription:', error);
                }
            }
        };

        fetchSubscription();
    }, [User1]);

    useEffect(() => {
        const checkdetails = localStorage.getItem('orderdetails');
        if (checkdetails) {
            const parsedDetails = JSON.parse(checkdetails);
            setLocalOrderDetails(parsedDetails);
            setorderdetails(parsedDetails);
            setModifiedOrderCloths(parsedDetails.order_cloths);
        } else {
            toast.error('No order details found. Please start over.');
            navigate('/customer/bookslot');
        }
    }, [navigate, setorderdetails]);

    // Fetch dynamic delivery charge from backend
    useEffect(() => {
        const fetchDeliveryInfo = async () => {
            if (!localOrderDetails) return;
            try {
                const totalcloths = Number(localOrderDetails?.otherdetails?.totalcloths || 0);
                const speed = localOrderDetails?.otherdetails?.deliverySpeed || 'normal';
                const res = await fetch(
                    `${API_URL}/orders/delivery-charge?quantity=${totalcloths}&deliverySpeed=${speed}`,
                    { credentials: 'include' }
                );
                const data = await res.json();
                if (data.success) {
                    setDeliveryInfo(data);
                }
            } catch (error) {
                console.error('Failed to fetch delivery info:', error);
            }
        };
        fetchDeliveryInfo();
    }, [localOrderDetails]);

    // Fetch coupons
    useEffect(() => {
        const getCoupons = async () => {
            try {
                const res = await fetch(`${API_URL}/discount-code/usercoupons`, {
                    credentials: 'include'
                });
                const data = await res.json();
                if (data.success) {
                    // Filter active coupons and those within valid date range
                    const now = new Date();
                    const activeCoupons = data.coupons.filter((coupon: Coupon) => {
                        const validFrom = new Date(coupon.valid_from);
                        const validUntil = new Date(coupon.valid_until);
                        return coupon.is_active && validFrom <= now && validUntil >= now;
                    });
                    setCoupons(activeCoupons);
                }
            } catch (error) {
                console.error('Error fetching coupons:', error);
            }
        };

        getCoupons();
    }, []);

    // Reset modified order cloths when payment method changes or coupon removed
    useEffect(() => {
        if (localOrderDetails) {
            setModifiedOrderCloths(localOrderDetails.order_cloths);
        }
    }, [paymentMethod, appliedCoupon, localOrderDetails]);

    // Show warning for cash on delivery with subscription
    useEffect(() => {
        if (isCashOnDelivery && subscription) {
            setShowCashWarning(true);
            setUseSubscription(false);
            setPaymentMethod('full');
            toast.warning('You have an active subscription. Cash on Delivery cannot be used with subscription credits. Please switch to online payment to redeem your credits.', {
                autoClose: 8000,
                position: "top-center"
            });
        } else {
            setShowCashWarning(false);
        }
    }, [isCashOnDelivery, subscription]);

    // Calculate redemption details when subscription or order details change
    useEffect(() => {
        if (subscription && localOrderDetails?.order_cloths && !isCashOnDelivery) {
            calculateRedemptionDetails();
        } else {
            // Reset redemption details if no subscription or cash on delivery
            setRedemptionDetails(null);
            setUseSubscription(false);
        }
    }, [subscription, localOrderDetails, isCashOnDelivery]);

    // Recalculate when useSubscription changes
    useEffect(() => {
        if (subscription && localOrderDetails?.order_cloths && useSubscription && !isCashOnDelivery) {
            calculateRedemptionDetails();
        }
    }, [useSubscription, isCashOnDelivery]);

    // Clear coupon when payment method changes or subscription usage changes
    useEffect(() => {
        setAppliedCoupon(null);
        setCouponError(null);
        setEnteredCouponCode('');
        if (localOrderDetails) {
            setModifiedOrderCloths(localOrderDetails.order_cloths);
        }
    }, [paymentMethod, useSubscription]);

    const calculateRedemptionDetails = () => {
        if (!subscription || !localOrderDetails?.order_cloths) return;

        const items = localOrderDetails.order_cloths;
        const originalAmount = Number(localOrderDetails?.otherdetails?.totalamount || '0');
        
        // Calculate total credits needed (assuming 1 credit = ₹1)
        const totalCreditsNeeded = items.reduce((sum: number, item: ClothItem) => {
            return sum + (Number(item.cost) * Number(item.quantity));
        }, 0);

        // Check each item against subscription cloth limits
        const insufficientItems: string[] = [];
        const redeemedItems: { name: string; count: number; cost: number }[] = [];
        let totalRedeemableCredits = 0;
        let allItemsFullyRedeemed = true;

        items.forEach((item: ClothItem) => {
            const clothName = item.item;
            const requestedCount = Number(item.quantity);
            
            // Find matching cloth in subscription
            const subscriptionCloth = subscription.cloths.find(
                (c: SubscriptionCloth) => c.name.toLowerCase() === clothName.toLowerCase()
            );

            if (subscriptionCloth) {
                const availableCount = subscriptionCloth.count;
                if (availableCount < requestedCount) {
                    insufficientItems.push(`${clothName}: Need ${requestedCount}, Available ${availableCount}`);
                    allItemsFullyRedeemed = false;
                    // Still calculate partial redemption
                    const redeemableCount = availableCount;
                    if (redeemableCount > 0) {
                        const itemCost = Number(item.cost) * redeemableCount;
                        totalRedeemableCredits += itemCost;
                        redeemedItems.push({
                            name: clothName,
                            count: redeemableCount,
                            cost: itemCost
                        });
                    }
                } else {
                    const itemCost = Number(item.cost) * requestedCount;
                    totalRedeemableCredits += itemCost;
                    redeemedItems.push({
                        name: clothName,
                        count: requestedCount,
                        cost: itemCost
                    });
                }
            } else {
                insufficientItems.push(`${clothName} not available in your subscription plan`);
                allItemsFullyRedeemed = false;
            }
        });

        // Check if we have enough total credits
        const hasEnoughCredits = subscription.credits >= totalRedeemableCredits;
        
        // Calculate payable amount (items not covered by subscription)
        const payableAmount = originalAmount - totalRedeemableCredits;
        
        // Fix: Check if payableAmount <= 0 for fully redeemed
        const isFullyRedeemed = payableAmount <= 0 && insufficientItems.length === 0;
        
        // Fix: canRedeem should be true if payableAmount <= 0 even with insufficient items
        const canRedeem = (insufficientItems.length === 0 && hasEnoughCredits) || payableAmount <= 0;

        setRedemptionDetails({
            canRedeem,
            isFullyRedeemed,
            totalCreditsNeeded: totalRedeemableCredits,
            insufficientItems,
            redeemedItems,
            payableAmount: payableAmount > 0 ? payableAmount : 0,
            redeemableCredits: totalRedeemableCredits,
            remainingCredits: subscription.credits - totalRedeemableCredits,
            originalAmount
        });
    };

    const applyBuyXGetY = (coupon: Coupon, items: any[]) => {
        const buyQty = coupon.buy_quantity || 0;
        const freeQty = coupon.free_quantity || 0;
        
        if (buyQty === 0 || freeQty === 0) return { items: [...items], discountAmount: 0, redeemedItems: [] };

        // Sort items by cost (lowest first) to give the cheapest item free
        const sortedItems = [...items].sort((a, b) => Number(a.cost) - Number(b.cost));
        
        let totalFreeItems = 0;
        let totalItemsCount = items.reduce((sum, item) => sum + Number(item.quantity), 0);
        
        // Calculate how many free items the user is eligible for
        const eligibleFreeSets = Math.floor(totalItemsCount / buyQty);
        const freeItemsEligible = eligibleFreeSets * freeQty;
        
        if (freeItemsEligible === 0) return { items: [...items], discountAmount: 0, redeemedItems: [] };

        // Create a copy of items to modify
        const modifiedItems = items.map(item => ({ ...item }));
        const redeemedItems: { name: string; count: number; cost: number }[] = [];
        let discountAmount = 0;
        let remainingFree = freeItemsEligible;

        // Apply free items to the cheapest ones first
        for (let i = 0; i < sortedItems.length && remainingFree > 0; i++) {
            const itemName = sortedItems[i].item;
            const itemIndex = modifiedItems.findIndex(mi => mi.item === itemName);
            
            if (itemIndex === -1) continue;
            
            const item = modifiedItems[itemIndex];
            const itemQuantity = Number(item.quantity);
            const itemCost = Number(item.cost);
            
            // How many of this item can be made free
            const freeFromThisItem = Math.min(itemQuantity, remainingFree);
            
            if (freeFromThisItem > 0) {
                // Reduce quantity for this item
                item.quantity = String(itemQuantity - freeFromThisItem);
                
                // Add to redeemed items
                redeemedItems.push({
                    name: item.item,
                    count: freeFromThisItem,
                    cost: itemCost * freeFromThisItem
                });
                
                discountAmount += itemCost * freeFromThisItem;
                remainingFree -= freeFromThisItem;
            }
        }

        // Filter out items with quantity 0
        const finalItems = modifiedItems.filter(item => Number(item.quantity) > 0);

        return {
            items: finalItems,
            discountAmount,
            redeemedItems
        };
    };

    const applyCoupon = async () => {
        if (!enteredCouponCode.trim()) {
            setCouponError('Please enter a coupon code');
            return;
        }

        setIsApplyingCoupon(true);
        setCouponError(null);

        try {
            // Find coupon in the fetched list
            const coupon = coupons.find(c => c.code.toUpperCase() === enteredCouponCode.toUpperCase());

            if (!coupon) {
                setCouponError('Invalid coupon code');
                return;
            }

            // Check if coupon is within valid date range
            const now = new Date();
            const validFrom = new Date(coupon.valid_from);
            const validUntil = new Date(coupon.valid_until);
            
            if (now < validFrom || now > validUntil) {
                setCouponError('This coupon has expired or is not yet valid');
                return;
            }

            // Check minimum order amount (excluding delivery charge)
            const subtotal = Number(localOrderDetails?.otherdetails?.totalamount || 0);
            if (subtotal < coupon.min_order_amount) {
                setCouponError(`Minimum order amount of ₹${coupon.min_order_amount} required for this coupon`);
                return;
            }

            let discountAmount = 0;
            let finalAmount = subtotal;
            let message = '';
            let redeemedItems: { name: string; count: number; cost: number }[] = [];
            let modifiedItems = localOrderDetails.order_cloths;

            switch (coupon.discount_type) {
                case 'percentage':
                    discountAmount = (subtotal * coupon.discount_value) / 100;
                    if (coupon.max_discount_amount && discountAmount > coupon.max_discount_amount) {
                        discountAmount = coupon.max_discount_amount;
                    }
                    finalAmount = subtotal - discountAmount;
                    message = `${coupon.discount_value}% off applied`;
                    break;

                case 'flat':
                    discountAmount = coupon.discount_value;
                    finalAmount = subtotal - discountAmount;
                    message = `₹${coupon.discount_value} off applied`;
                    break;

                case 'free_delivery':
                    discountAmount = DELIVERY_CHARGE;
                    finalAmount = subtotal;
                    message = 'Free delivery applied';
                    break;

                case 'buy_x_get_y':
                    const result = applyBuyXGetY(coupon, localOrderDetails.order_cloths);
                    modifiedItems = result.items;
                    discountAmount = result.discountAmount;
                    redeemedItems = result.redeemedItems;
                    finalAmount = subtotal - discountAmount;
                    
                    if (discountAmount > 0) {
                        message = `Buy ${coupon.buy_quantity} Get ${coupon.free_quantity} free - Cheapest item(s) free!`;
                        // Update modified order cloths
                        setModifiedOrderCloths(modifiedItems);
                        
                        // Show toast with details
                        toast.success(`🎉 You got ${redeemedItems.reduce((sum, item) => sum + item.count, 0)} item(s) free!`, {
                            autoClose: 5000
                        });
                    } else {
                        setCouponError('Minimum purchase quantity not met for this offer');
                        setIsApplyingCoupon(false);
                        return;
                    }
                    break;

                default:
                    setCouponError('Invalid coupon type');
                    setIsApplyingCoupon(false);
                    return;
            }

            // Ensure final amount is not negative
            finalAmount = finalAmount < 0 ? 0 : finalAmount;

            setAppliedCoupon({
                coupon,
                discountAmount,
                finalAmount,
                message,
                redeemedItems: redeemedItems.length > 0 ? redeemedItems : undefined
            });

            toast.success(`Coupon ${coupon.code} applied successfully!`);
            setShowCouponPanel(false);
            setEnteredCouponCode('');

        } catch (error) {
            console.error('Error applying coupon:', error);
            setCouponError('Failed to apply coupon');
        } finally {
            setIsApplyingCoupon(false);
        }
    };

    const removeCoupon = () => {
        setAppliedCoupon(null);
        setCouponError(null);
        if (localOrderDetails) {
            setModifiedOrderCloths(localOrderDetails.order_cloths);
        }
        toast.info('Coupon removed');
    };

    const getCurrentPayableAmount = () => {
        // Base amount from order (subtotal without delivery)
        let subtotal = Number(localOrderDetails?.otherdetails?.totalamount || 0);

        // Apply subscription redemption if active
        if (paymentMethod === 'redeemed' && redemptionDetails && !isCashOnDelivery) {
            subtotal = redemptionDetails.payableAmount;
        }

        // Apply coupon discount to subtotal
        if (appliedCoupon) {
            if (appliedCoupon.coupon.discount_type === 'free_delivery') {
                // Free delivery coupon - subtotal remains same, delivery charge will be 0
                return subtotal;
            } else {
                // Other coupons apply to subtotal
                subtotal = appliedCoupon.finalAmount;
            }
        }

        return subtotal;
    };

    const getFinalPayableAmount = () => {
        let subtotal = getCurrentPayableAmount();
        
        // Add delivery charge if applicable (and not free delivery)
        const isDeliveryFree = appliedCoupon?.coupon?.discount_type === 'free_delivery';
        
        if (!isDeliveryFree) {
            subtotal += DELIVERY_CHARGE;
        }

        return subtotal;
    };

    const getDeliveryChargeMessage = () => {
        if (appliedCoupon?.coupon?.discount_type === 'free_delivery') {
            return `Delivery charge waived (coupon applied) - Original charge: ₹${DELIVERY_CHARGE}`;
        }
        return `Delivery charge: ₹${DELIVERY_CHARGE} (${deliverySpeed} delivery)`;
    };

    // Format data for API
    const prepareApiData = () => {
        if (!localOrderDetails) return null;

        const apiData: any = {
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
                paymenttype: localOrderDetails?.otherdetails?.paymenttype || 'online',
                timeslot: localOrderDetails?.otherdetails?.timeslot || '',
                totalamount: String(getFinalPayableAmount()),
                totalcloths: String(localOrderDetails?.otherdetails?.totalcloths || '0'),
                deliverySpeed: localOrderDetails?.otherdetails?.deliverySpeed || 'normal'
            },
            order_cloths: modifiedOrderCloths || localOrderDetails?.order_cloths || []
        };

        // Add coupon data if applied
        if (appliedCoupon) {
            apiData.coupon = {
                code: appliedCoupon.coupon.code,
                discountAmount: appliedCoupon.discountAmount,
                discountType: appliedCoupon.coupon.discount_type,
                redeemedItems: appliedCoupon.redeemedItems
            };
        }

        // Add subscription redemption data if applicable
        if (useSubscription && subscription && redemptionDetails && !isCashOnDelivery) {
            apiData.subscriptionRedemption = {
                subscriptionId: subscription._id,
                usedCredits: redemptionDetails.redeemableCredits,
                redeemedItems: redemptionDetails.redeemedItems,
                payableAmount: redemptionDetails.payableAmount,
                originalAmount: redemptionDetails.originalAmount,
                isFullyRedeemed: redemptionDetails.isFullyRedeemed
            };
        }

        return apiData;
    };

    const handleSwitchToOnline = () => {
        // Update local order details with online payment
        const updatedDetails = {
            ...localOrderDetails,
            otherdetails: {
                ...localOrderDetails.otherdetails,
                paymenttype: 'online'
            }
        };
        
        localStorage.setItem('orderdetails', JSON.stringify(updatedDetails));
        setLocalOrderDetails(updatedDetails);
        setorderdetails(updatedDetails);
        
        toast.success('Switched to online payment. You can now redeem your subscription credits.');
        
        // Recalculate redemption details
        if (subscription) {
            calculateRedemptionDetails();
        }
    };

    const handlePlaceOrder = async () => {
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

        if (!apiData.otherdetails.timeslot) {
            toast.error('Please select a time slot');
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
            // Determine which amount to use based on payment method
            const amountToPay = getFinalPayableAmount();

            // If amount is 0 (fully redeemed) or cash on delivery, create order directly
            if (amountToPay === 0 || isCashOnDelivery) {
                // Create order directly - the backend will handle subscription update
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
                
                const successMessage = isCashOnDelivery 
                    ? 'Order placed successfully with Cash on Delivery!' 
                    : amountToPay === 0 
                        ? '🎉 Order placed successfully! All items redeemed with subscription credits.'
                        : 'Order placed successfully!';
                
                toast.success(successMessage);
                navigate('/customer/ordertrack');
                return;
            }

            // For amount > 0 (not fully redeemed), initiate payment
            const paymentResult = await initiateOrderPayment({
                orderData: apiData,
                amount: amountToPay,
                useSubscription: useSubscription && paymentMethod === 'redeemed' && !isCashOnDelivery,
                subscriptionId: subscription?._id,
                usedCredits: redemptionDetails?.redeemableCredits || 0,
                redeemedItems: redemptionDetails?.redeemedItems || [],
                userEmail: User1?.email,
                userPhone: User1?.phoneno,
                userName: User1?.name,
                coupon: appliedCoupon ? {
                    code: appliedCoupon.coupon.code,
                    discountAmount: appliedCoupon.discountAmount
                } : undefined
            });

            if (paymentResult.success) {
                // Clear localStorage and context
                localStorage.removeItem('orderdetails');
                setorderdetails(null);
                
                const message = useSubscription && paymentMethod === 'redeemed' && !isCashOnDelivery
                    ? `Order placed! Redeemed ${redemptionDetails?.redeemableCredits} credits and paid ₹${amountToPay}`
                    : 'Order placed successfully!';
                
                toast.success(message);
                navigate('/customer/ordertrack');
            } else {
                toast.error(paymentResult.message || 'Payment failed. Please try again.');
            }
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

    // Coupon Panel Component
    const CouponPanel = () => (
        <AnimatePresence>
            {showCouponPanel && (
                <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="mt-4 overflow-hidden"
                >
                    <div className="bg-gradient-to-r from-primary/5 to-primary/10 rounded-xl p-4 border border-primary/20">
                        <div className="flex items-center justify-between mb-3">
                            <h4 className="font-bold text-foreground flex items-center">
                                <Ticket className="w-4 h-4 mr-2 text-primary" />
                                Apply Coupon
                            </h4>
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => setShowCouponPanel(false)}
                                className="h-8 w-8 p-0"
                            >
                                <X className="w-4 h-4" />
                            </Button>
                        </div>

                        <div className="flex gap-2">
                            <input
                                type="text"
                                value={enteredCouponCode}
                                onChange={(e) => setEnteredCouponCode(e.target.value.toUpperCase())}
                                placeholder="Enter coupon code"
                                className="flex-1 px-3 py-2 border rounded-lg bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                                disabled={isApplyingCoupon}
                            />
                            <Button
                                onClick={applyCoupon}
                                disabled={isApplyingCoupon || !enteredCouponCode.trim()}
                                className="px-4 py-2"
                            >
                                {isApplyingCoupon ? (
                                    <Loader2 className="w-4 h-4 animate-spin" />
                                ) : (
                                    'Apply'
                                )}
                            </Button>
                        </div>

                        {couponError && (
                            <p className="text-red-500 text-xs mt-2 flex items-center">
                                <AlertCircle className="w-3 h-3 mr-1" />
                                {couponError}
                            </p>
                        )}

                        {/* Available Coupons */}
                        {coupons.length > 0 && (
                            <div className="mt-4">
                                <p className="text-xs text-muted-foreground mb-2">Available for you:</p>
                                <div className="space-y-2 max-h-40 overflow-y-auto pr-1 scrollbar-thin scrollbar-thumb-primary/20 scrollbar-track-transparent">
                                    {coupons.map((coupon) => (
                                        <div
                                            key={coupon._id}
                                            className="bg-background p-2 rounded-lg border border-primary/20 cursor-pointer hover:border-primary transition-colors"
                                            onClick={() => setEnteredCouponCode(coupon.code)}
                                        >
                                            <div className="flex items-center justify-between">
                                                <div className="flex items-center space-x-2">
                                                    <Percent className="w-3 h-3 text-primary" />
                                                    <span className="font-bold text-sm text-foreground">{coupon.code}</span>
                                                </div>
                                                <span className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded-full">
                                                    {coupon.discount_type === 'percentage' && `${coupon.discount_value}% off`}
                                                    {coupon.discount_type === 'flat' && `₹${coupon.discount_value} off`}
                                                    {coupon.discount_type === 'free_delivery' && 'Free Delivery'}
                                                    {coupon.discount_type === 'buy_x_get_y' && `Buy ${coupon.buy_quantity} Get ${coupon.free_quantity}`}
                                                </span>
                                            </div>
                                            <p className="text-xs text-muted-foreground mt-1">{coupon.description}</p>
                                            {coupon.min_order_amount > 0 && (
                                                <p className="text-xs text-muted-foreground mt-1">
                                                    Min. order: ₹{coupon.min_order_amount}
                                                </p>
                                            )}
                                            <div className="flex items-center mt-1 text-[10px] text-muted-foreground">
                                                <Calendar className="w-3 h-3 mr-1" />
                                                Valid till: {new Date(coupon.valid_until).toLocaleDateString()}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
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

    // Calculate display amounts
    const subtotal = Number(localOrderDetails?.otherdetails?.totalamount || 0);
    const currentSubtotal = getCurrentPayableAmount();
    const finalAmount = getFinalPayableAmount();
    const savingsAmount = paymentMethod === 'redeemed' && redemptionDetails && !isCashOnDelivery
        ? subtotal - (redemptionDetails?.payableAmount || 0)
        : 0;

    const isFullyRedeemed = redemptionDetails?.isFullyRedeemed && paymentMethod === 'redeemed' && !isCashOnDelivery;

    // Get items to display (modified if coupon applied)
    const displayItems = modifiedOrderCloths || localOrderDetails.order_cloths;

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

                    {/* Cash on Delivery Warning */}
                    {showCashWarning && subscription && (
                        <motion.div
                            initial={{ y: 20, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            className="mb-4 sm:mb-6"
                        >
                            <Card className="p-4 sm:p-6 border-2 border-yellow-500/30 bg-yellow-500/5 shadow-lg rounded-xl sm:rounded-2xl">
                                <div className="flex items-start space-x-3">
                                    <div className="bg-yellow-500 p-2 rounded-lg flex-shrink-0">
                                        <AlertCircle className="w-5 h-5 text-white" />
                                    </div>
                                    <div className="flex-1">
                                        <h3 className="font-bold text-foreground mb-2">⚠️ Active Subscription Detected</h3>
                                        <p className="text-sm text-muted-foreground mb-3">
                                            You have an active subscription but selected <span className="font-bold">Cash on Delivery</span>. 
                                            Subscription credits can only be redeemed with <span className="font-bold">online payments</span>.
                                        </p>
                                        <div className="flex flex-col sm:flex-row gap-2">
                                            <Button
                                                onClick={handleSwitchToOnline}
                                                size="sm"
                                                className="bg-yellow-500 hover:bg-yellow-600 text-white"
                                            >
                                                <CreditCard className="w-4 h-4 mr-2" />
                                                Switch to Online Payment
                                            </Button>
                                        </div>
                                    </div>
                                </div>
                            </Card>
                        </motion.div>
                    )}

                    {/* Subscription Section - Only show if not cash on delivery */}
                    {subscription && subscription.status === 'active' && !isCashOnDelivery && (
                        <motion.div
                            initial={{ y: 20, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ delay: 0.55 }}
                            className="mb-4 sm:mb-6"
                        >
                            <Card className="p-4 sm:p-6 border-2 border-primary/20 shadow-lg rounded-xl sm:rounded-2xl bg-gradient-to-br from-primary/5 to-primary/10">
                                <div className="flex items-center justify-between mb-4">
                                    <div className="flex items-center space-x-3">
                                        <div className="bg-primary p-2 rounded-lg">
                                            <Gift className="w-5 h-5 text-white" />
                                        </div>
                                        <div>
                                            <h3 className="font-bold text-foreground">Active Subscription</h3>
                                            <p className="text-xs text-muted-foreground">
                                                {subscription.plan} • {subscription.credits} credits available
                                            </p>
                                        </div>
                                    </div>
                                    <BadgeCheck className="w-6 h-6 text-green-500" />
                                </div>

                                {/* Payment Method Selection */}
                                <div className="space-y-3">
                                    <div 
                                        className={`p-3 rounded-lg border-2 cursor-pointer transition-all ${
                                            paymentMethod === 'full' 
                                                ? 'border-primary bg-primary/5' 
                                                : 'border-border hover:border-primary/50'
                                        }`}
                                        onClick={() => setPaymentMethod('full')}
                                    >
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center space-x-3">
                                                <div className={`p-2 rounded-lg ${
                                                    paymentMethod === 'full' ? 'bg-primary' : 'bg-secondary'
                                                }`}>
                                                    <Wallet className={`w-4 h-4 ${
                                                        paymentMethod === 'full' ? 'text-white' : 'text-muted-foreground'
                                                    }`} />
                                                </div>
                                                <div>
                                                    <p className="font-medium text-foreground">Pay Full Amount</p>
                                                    <p className="text-xs text-muted-foreground">
                                                        Pay ₹{subtotal} without using credits
                                                    </p>
                                                </div>
                                            </div>
                                            <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                                                paymentMethod === 'full' 
                                                    ? 'border-primary bg-primary' 
                                                    : 'border-muted-foreground'
                                            }`}>
                                                {paymentMethod === 'full' && (
                                                    <CheckCircle className="w-4 h-4 text-white" />
                                                )}
                                            </div>
                                        </div>
                                    </div>

                                    <div 
                                        className={`p-3 rounded-lg border-2 cursor-pointer transition-all ${
                                            paymentMethod === 'redeemed' 
                                                ? 'border-green-500 bg-green-500/5' 
                                                : 'border-border hover:border-green-500/50'
                                        }`}
                                        onClick={() => {
                                            setPaymentMethod('redeemed');
                                            setUseSubscription(true);
                                            calculateRedemptionDetails();
                                        }}
                                    >
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center space-x-3">
                                                <div className={`p-2 rounded-lg ${
                                                    paymentMethod === 'redeemed' ? 'bg-green-500' : 'bg-secondary'
                                                }`}>
                                                    <Sparkles className={`w-4 h-4 ${
                                                        paymentMethod === 'redeemed' ? 'text-white' : 'text-muted-foreground'
                                                    }`} />
                                                </div>
                                                <div>
                                                    <p className="font-medium text-foreground">Use Subscription Credits</p>
                                                    <p className="text-xs text-muted-foreground">
                                                        Redeem available credits and pay the balance
                                                    </p>
                                                </div>
                                            </div>
                                            <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                                                paymentMethod === 'redeemed' 
                                                    ? 'border-green-500 bg-green-500' 
                                                    : 'border-muted-foreground'
                                            }`}>
                                                {paymentMethod === 'redeemed' && (
                                                    <CheckCircle className="w-4 h-4 text-white" />
                                                )}
                                            </div>
                                        </div>

                                        {/* Redemption Details */}
                                        {paymentMethod === 'redeemed' && redemptionDetails && (
                                            <motion.div
                                                initial={{ opacity: 0, height: 0 }}
                                                animate={{ opacity: 1, height: 'auto' }}
                                                className="mt-3 pt-3 border-t border-green-500/20"
                                            >
                                                {redemptionDetails.isFullyRedeemed ? (
                                                    <div className="space-y-2 bg-green-500/10 p-3 rounded-lg">
                                                        <div className="flex items-center space-x-2 text-green-600">
                                                            <CheckCircle className="w-5 h-5" />
                                                            <span className="font-bold">🎉 All items fully redeemed!</span>
                                                        </div>
                                                        <div className="flex justify-between text-sm">
                                                            <span className="text-muted-foreground">Credits redeemed:</span>
                                                            <span className="font-medium text-green-600">₹{redemptionDetails.redeemableCredits}</span>
                                                        </div>

                                                        <div className="flex justify-between text-sm font-bold pt-2 border-t border-green-500/20">
                                                            <span>Final amount:</span>
                                                            <span className="text-green-600">FREE (₹0)</span>
                                                        </div>
                                                        {redemptionDetails.redeemedItems.length > 0 && (
                                                            <div className="mt-2">
                                                                <p className="text-xs text-muted-foreground mb-1">Items redeemed:</p>
                                                                {redemptionDetails.redeemedItems.map((item, idx) => (
                                                                    <div key={idx} className="flex justify-between text-xs">
                                                                        <span>{item.name} x{item.count}</span>
                                                                        <span className="text-green-600">₹{item.cost}</span>
                                                                    </div>
                                                                ))}
                                                            </div>
                                                        )}
                                                    </div>
                                                ) : redemptionDetails.payableAmount === 0 ? (
                                                    <div className="space-y-2 bg-green-500/10 p-3 rounded-lg">
                                                        <div className="flex items-center space-x-2 text-green-600">
                                                            <CheckCircle className="w-5 h-5" />
                                                            <span className="font-bold">🎉 All items redeemed!</span>
                                                        </div>
                                                        <div className="flex justify-between text-sm">
                                                            <span className="text-muted-foreground">Credits redeemed:</span>
                                                            <span className="font-medium text-green-600">₹{redemptionDetails.redeemableCredits}</span>
                                                        </div>
                                                        <div className="flex justify-between text-sm">
                                                            <span className="text-muted-foreground">Remaining credits:</span>
                                                            <span className="font-medium">₹{redemptionDetails.remainingCredits}</span>
                                                        </div>
                                                        <div className="flex justify-between text-sm font-bold pt-2 border-t border-green-500/20">
                                                            <span>Final amount:</span>
                                                            <span className="text-green-600">FREE (₹0)</span>
                                                        </div>
                                                        {redemptionDetails.insufficientItems.length > 0 && (
                                                            <div className="mt-2 text-xs text-amber-600 bg-amber-500/10 p-2 rounded-lg">
                                                                <p className="font-medium mb-1">Note:</p>
                                                                <ul className="list-disc pl-4">
                                                                    {redemptionDetails.insufficientItems.map((issue, idx) => (
                                                                        <li key={idx}>{issue}</li>
                                                                    ))}
                                                                </ul>
                                                            </div>
                                                        )}
                                                    </div>
                                                ) : redemptionDetails.canRedeem ? (
                                                    <div className="space-y-2">
                                                        <div className="flex justify-between text-sm">
                                                            <span className="text-muted-foreground">Credits to redeem:</span>
                                                            <span className="font-medium text-green-600">₹{redemptionDetails.redeemableCredits}</span>
                                                        </div>
                                                        <div className="flex justify-between text-sm">
                                                            <span className="text-muted-foreground">Remaining credits:</span>
                                                            <span className="font-medium">₹{redemptionDetails.remainingCredits}</span>
                                                        </div>
                                                        <div className="flex justify-between text-sm font-bold pt-2 border-t border-green-500/20">
                                                            <span>Payable amount:</span>
                                                            <span className="text-primary">₹{redemptionDetails.payableAmount}</span>
                                                        </div>
                                                        {redemptionDetails.redeemedItems.length > 0 && (
                                                            <div className="mt-2">
                                                                <p className="text-xs text-muted-foreground mb-1">Items being redeemed:</p>
                                                                {redemptionDetails.redeemedItems.map((item, idx) => (
                                                                    <div key={idx} className="flex justify-between text-xs">
                                                                        <span>{item.name} x{item.count}</span>
                                                                        <span className="text-green-600">₹{item.cost}</span>
                                                                    </div>
                                                                ))}
                                                            </div>
                                                        )}
                                                    </div>
                                                ) : (
                                                    <div className="text-red-500 text-sm">
                                                        <p className="flex items-center">
                                                            <AlertCircle className="w-4 h-4 mr-1" />
                                                            Cannot fully redeem with current subscription
                                                        </p>
                                                        {redemptionDetails.insufficientItems.length > 0 && (
                                                            <ul className="mt-2 text-xs space-y-1">
                                                                {redemptionDetails.insufficientItems.map((issue, idx) => (
                                                                    <li key={idx}>• {issue}</li>
                                                                ))}
                                                            </ul>
                                                        )}
                                                        <div className="mt-2 pt-2 border-t border-red-500/20">
                                                            <div className="flex justify-between text-xs">
                                                                <span>Partial redemption value:</span>
                                                                <span className="text-green-600">₹{redemptionDetails.redeemableCredits}</span>
                                                            </div>
                                                            <div className="flex justify-between text-xs font-bold mt-1">
                                                                <span>Amount to pay:</span>
                                                                <span className="text-primary">₹{redemptionDetails.payableAmount}</span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                )}
                                            </motion.div>
                                        )}
                                    </div>
                                </div>
                            </Card>
                        </motion.div>
                    )}

                    {/* Items Details Card */}
                    {displayItems && displayItems.length > 0 && (
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

                                <div className="space-y-2 sm:space-y-3  overflow-y-auto pr-1 scrollbar-thin scrollbar-thumb-primary/20 scrollbar-track-transparent">
                                    {displayItems.map((item: any, index: number) => {
                                        const isRedeemed = paymentMethod === 'redeemed' && !isCashOnDelivery && 
                                            redemptionDetails?.redeemedItems.some(
                                                ri => ri.name.toLowerCase() === item.item.toLowerCase()
                                            );
                                        
                                        const isCouponFree = appliedCoupon?.redeemedItems?.some(
                                            ri => ri.name.toLowerCase() === item.item.toLowerCase()
                                        );
                                        
                                        return (
                                            <motion.div
                                                key={index}
                                                initial={{ x: -20, opacity: 0 }}
                                                animate={{ x: 0, opacity: 1 }}
                                                transition={{ delay: 0.7 + index * 0.05 }}
                                                className={`flex justify-between items-start sm:items-center p-3 sm:p-4 rounded-lg sm:rounded-xl transition-colors ${
                                                    isRedeemed ? 'bg-green-500/10 border border-green-500/20' :
                                                    isCouponFree ? 'bg-purple-500/10 border border-purple-500/20' :
                                                    'bg-secondary/20 hover:bg-secondary/30'
                                                }`}
                                            >
                                                <div className="flex items-start space-x-2 sm:space-x-3">
                                                    <div className="bg-primary/10 p-1.5 sm:p-2 rounded-lg flex-shrink-0">
                                                        <Shirt className="w-3 h-3 sm:w-4 sm:h-4 text-primary" />
                                                    </div>
                                                    <div className="min-w-0">
                                                        <span className="font-medium text-foreground text-sm sm:text-base block truncate">
                                                            {item.item}
                                                            {isRedeemed && (
                                                                <span className="ml-2 text-xs bg-green-500 text-white px-1.5 py-0.5 rounded-full">
                                                                    Redeemed
                                                                </span>
                                                            )}
                                                            {isCouponFree && (
                                                                <span className="ml-2 text-xs bg-purple-500 text-white px-1.5 py-0.5 rounded-full">
                                                                    Free (Coupon)
                                                                </span>
                                                            )}
                                                        </span>
                                                        <div className="flex items-center space-x-2 mt-1">
                                                            <span className="text-xs sm:text-sm text-muted-foreground bg-secondary px-2 py-0.5 rounded-full">
                                                                {item.quantity} × ₹{item.cost}
                                                            </span>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="flex flex-col items-end">
                                                    <span className={`font-bold text-sm sm:text-base md:text-lg ${
                                                        isRedeemed ? 'text-green-600' :
                                                        isCouponFree ? 'text-purple-600' :
                                                        'text-foreground'
                                                    }`}>
                                                        {isCouponFree ? 'FREE' : `₹${Number(item.cost) * Number(item.quantity)}`}
                                                    </span>
                                                </div>
                                            </motion.div>
                                        );
                                    })}

                                    {/* Coupon Free Items Summary */}
                                    {appliedCoupon?.redeemedItems && appliedCoupon.redeemedItems.length > 0 && (
                                        <div className="pt-2 mt-2 border-t border-purple-500/20">
                                            <p className="text-xs text-purple-600 font-medium mb-1 flex items-center">
                                                <Gift className="w-3 h-3 mr-1" />
                                                Free items from coupon:
                                            </p>
                                            {appliedCoupon.redeemedItems.map((item, idx) => (
                                                <div key={idx} className="flex justify-between text-xs text-purple-600">
                                                    <span>{item.name} x{item.count}</span>
                                                    <span>-₹{item.cost}</span>
                                                </div>
                                            ))}
                                        </div>
                                    )}

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
                                                {displayItems.reduce((sum: number, item: any) => sum + Number(item.quantity), 0)} Items
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
                                    <h3 className="text-lg sm:text-xl md:text-2xl font-bold text-foreground">Order Details</h3>
                                    <p className="text-muted-foreground text-xs sm:text-sm">Your order specifications</p>
                                </div>
                            </div>

                            <div className="space-y-3 sm:space-y-4">
                                {[
                                    { 
                                        label: 'Payment Method', 
                                        value: localOrderDetails?.otherdetails?.paymenttype || 'Not selected', 
                                        icon: localOrderDetails?.otherdetails?.paymenttype?.toLowerCase() === 'cash on delivery' ? BanknoteIcon : CreditCard,
                                        color: localOrderDetails?.otherdetails?.paymenttype?.toLowerCase() === 'cash on delivery' ? 'text-green-600' : 'text-blue-600'
                                    },
                                    { 
                                        label: 'Selected Slot', 
                                        value: localOrderDetails?.otherdetails?.timeslot || 'Not selected', 
                                        icon: Clock,
                                        color: 'text-blue-600'
                                    },
                                    { 
                                        label: 'Delivery Speed', 
                                        value: deliverySpeed.charAt(0).toUpperCase() + deliverySpeed.slice(1), 
                                        icon: Truck,
                                        color: 'text-purple-600'
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
                                        <span className="font-bold text-sm sm:text-base md:text-lg text-foreground capitalize">
                                            {item.value}
                                        </span>
                                    </motion.div>
                                ))}

                                {/* Price Breakdown */}
                                <div className="p-3 sm:p-4 rounded-lg sm:rounded-xl bg-primary/5 border border-primary/10">
                                    <h4 className="font-bold text-foreground mb-3 flex items-center">
                                        <IndianRupee className="w-4 h-4 mr-1" />
                                        Price Breakdown
                                    </h4>
                                    
                                    <div className="space-y-2">
                                        <div className="flex justify-between text-sm">
                                            <span className="text-muted-foreground">Subtotal:</span>
                                            <span className="font-medium">₹{subtotal}</span>
                                        </div>
                                        
                                        {/* Delivery Charge */}
                                        <div className="flex justify-between text-sm">
                                            <span className="text-muted-foreground flex items-center gap-1">
                                                <Truck className="w-3 h-3" />
                                                Delivery ({deliverySpeed}):
                                            </span>
                                            {(deliveryInfo?.isFreeDelivery && appliedCoupon?.coupon?.discount_type !== 'free_delivery') ? (
                                                <span className="font-medium text-green-600 flex items-center gap-1">
                                                    FREE 🎉
                                                </span>
                                            ) : appliedCoupon?.coupon?.discount_type === 'free_delivery' ? (
                                                <span className="font-medium text-green-600">
                                                    Free (₹{deliveryInfo?.baseCharge ?? DELIVERY_CHARGE} saved)
                                                </span>
                                            ) : (
                                                <span className="font-medium">₹{DELIVERY_CHARGE}</span>
                                            )}
                                        </div>

                                        {/* Free delivery reason badge */}
                                        {deliveryInfo?.isFreeDelivery && appliedCoupon?.coupon?.discount_type !== 'free_delivery' && (
                                            <div className="flex items-center gap-1 text-xs text-green-700 bg-green-50 border border-green-200 rounded-lg px-2 py-1">
                                                <Sparkles className="w-3 h-3 flex-shrink-0" />
                                                <span>{deliveryInfo.freeDeliveryReasonText}</span>
                                            </div>
                                        )}

                                        {/* Free orders remaining hint */}
                                        {deliveryInfo && !deliveryInfo.isFreeDelivery && deliveryInfo.freeOrdersRemaining > 0 && (
                                            <div className="flex items-center gap-1 text-xs text-blue-700 bg-blue-50 border border-blue-200 rounded-lg px-2 py-1">
                                                <Gift className="w-3 h-3 flex-shrink-0" />
                                                <span>You have <strong>{deliveryInfo.freeOrdersRemaining}</strong> free {deliveryInfo.freeOrdersRemaining === 1 ? 'delivery' : 'deliveries'} remaining</span>
                                            </div>
                                        )}

                                        {/* Bulk free delivery suggestion */}
                                        {deliveryInfo && !deliveryInfo.isFreeDelivery && deliveryInfo.itemsNeededForFree > 0 && deliveryInfo.freeOrdersRemaining === 0 && (
                                            <div className="text-xs text-amber-700 bg-amber-50 border border-amber-200 rounded-lg px-2 py-1.5">
                                                <div className="flex items-center gap-1 mb-1">
                                                    <Zap className="w-3 h-3 flex-shrink-0" />
                                                    <span>Add <strong>{deliveryInfo.itemsNeededForFree}</strong> more items to unlock FREE delivery!</span>
                                                </div>
                                                <div className="w-full bg-amber-200 rounded-full h-1.5">
                                                    <div
                                                        className="bg-amber-500 h-1.5 rounded-full transition-all"
                                                        style={{ width: `${Math.min(100, (Number(localOrderDetails?.otherdetails?.totalcloths || 0) / 20) * 100)}%` }}
                                                    />
                                                </div>
                                                <div className="flex justify-between text-[10px] mt-0.5 text-amber-600">
                                                    <span>{localOrderDetails?.otherdetails?.totalcloths || 0} items</span>
                                                    <span>20 items for free</span>
                                                </div>
                                            </div>
                                        )}
                                        
                                        {paymentMethod === 'redeemed' && redemptionDetails && redemptionDetails.redeemableCredits > 0 && !isCashOnDelivery && (
                                            <div className="flex justify-between text-sm text-green-600">
                                                <span>Credits redeemed:</span>
                                                <span>- ₹{redemptionDetails.redeemableCredits}</span>
                                            </div>
                                        )}
                                        
                                        {/* Coupon Discount */}
                                        {appliedCoupon && appliedCoupon.discountAmount > 0 && (
                                            <div className="flex justify-between text-sm text-green-600">
                                                <span className="flex items-center">
                                                    <Ticket className="w-3 h-3 mr-1" />
                                                    Coupon ({appliedCoupon.coupon.code}):
                                                </span>
                                                <span>- ₹{appliedCoupon.discountAmount}</span>
                                            </div>
                                        )}
                                        
                                        <div className="flex justify-between text-base font-bold pt-2 border-t border-primary/20">
                                            <span>Total to pay:</span>
                                            <span className={`${finalAmount === 0 ? 'text-green-600' : 'text-primary'}`}>
                                                {finalAmount === 0 ? 'FREE (₹0)' : `₹${finalAmount}`}
                                            </span>
                                        </div>
                                        
                                        {savingsAmount > 0 && !isCashOnDelivery && (
                                            <div className="flex justify-between text-xs text-green-600 bg-green-500/10 p-2 rounded-lg mt-2">
                                                <span>You save:</span>
                                                <span>₹{savingsAmount + (appliedCoupon?.discountAmount || 0)}</span>
                                            </div>
                                        )}
                                        
                                        {(isFullyRedeemed || finalAmount === 0) && paymentMethod === 'redeemed' && (
                                            <div className="flex justify-between text-xs text-green-600 bg-green-500/10 p-2 rounded-lg mt-2">
                                                <span className="flex items-center">
                                                    <Sparkles className="w-3 h-3 mr-1" />
                                                    Great news!
                                                </span>
                                                <span>All items redeemed with subscription</span>
                                            </div>
                                        )}

                                        {/* Applied Coupon Message */}
                                        {appliedCoupon && appliedCoupon.message && (
                                            <div className="mt-2 text-xs text-primary bg-primary/10 p-2 rounded-lg">
                                                <span className="flex items-center">
                                                    <Zap className="w-3 h-3 mr-1" />
                                                    {appliedCoupon.message}
                                                </span>
                                            </div>
                                        )}

                                        {/* Buy X Get Y Free Details */}
                                        {appliedCoupon?.coupon?.discount_type === 'buy_x_get_y' && appliedCoupon.redeemedItems && (
                                            <div className="mt-2 text-xs text-purple-600 bg-purple-500/10 p-2 rounded-lg">
                                                <span className="flex items-center font-medium mb-1">
                                                    <Gift className="w-3 h-3 mr-1" />
                                                    You got {appliedCoupon.redeemedItems.reduce((sum, item) => sum + item.count, 0)} item(s) free!
                                                </span>
                                                {appliedCoupon.redeemedItems.map((item, idx) => (
                                                    <div key={idx} className="flex justify-between text-xs ml-4">
                                                        <span>{item.name} x{item.count}</span>
                                                        <span>₹{item.cost} free</span>
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {/* Coupon Section */}
                                <div className="mt-4">
                                    {appliedCoupon ? (
                                        <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-3 flex items-center justify-between">
                                            <div className="flex items-center space-x-2">
                                                <Ticket className="w-4 h-4 text-green-600" />
                                                <div>
                                                    <span className="font-bold text-green-600 text-sm">{appliedCoupon.coupon.code}</span>
                                                    <p className="text-xs text-muted-foreground">{appliedCoupon.message}</p>
                                                </div>
                                            </div>
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                onClick={removeCoupon}
                                                className="text-red-500 hover:text-red-600 h-8 w-8 p-0"
                                            >
                                                <X className="w-4 h-4" />
                                            </Button>
                                        </div>
                                    ) : (
                                        <Button
                                            variant="outline"
                                            onClick={() => setShowCouponPanel(!showCouponPanel)}
                                            className="w-full border-dashed border-primary/50 hover:border-primary"
                                        >
                                            <Ticket className="w-4 h-4 mr-2" />
                                            {showCouponPanel ? 'Close Coupons' : 'Apply Coupon'}
                                        </Button>
                                    )}
                                </div>

                                {/* Coupon Panel */}
                                <CouponPanel />
                            </div>
                        </Card>
                    </motion.div>

                    {/* Delivery Address Card */}
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
                                    <h3 className="text-lg sm:text-xl md:text-2xl font-bold text-foreground">Delivery Address</h3>
                                    <p className="text-muted-foreground text-xs sm:text-sm">Where we'll deliver your order</p>
                                </div>
                            </div>

                            <div className="space-y-4">
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
                                    <div className="flex items-center justify-between mb-2">
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
                                            <p className="text-foreground text-xs sm:text-sm">
                                                {localOrderDetails?.userdetails?.houseno || 'Not provided'}, {localOrderDetails?.userdetails?.streetname || ''}
                                                {localOrderDetails?.userdetails?.area && `, ${localOrderDetails?.userdetails?.area}`}
                                            </p>
                                        )}
                                    </div>
                                </motion.div>
                            </div>
                        </Card>
                    </motion.div>

                    {/* Terms & Conditions */}
                    <motion.div
                        initial={{ y: 20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: 1.3 }}
                    >
                        <Card className="p-4 sm:p-6 md:p-8 mb-4 sm:mb-6 border-2 border-secondary/30 rounded-xl sm:rounded-2xl">
                            <div className="flex items-center justify-between mb-4">
                                <div className="flex items-center space-x-3">
                                    <div className="bg-secondary/20 p-2 rounded-lg">
                                        <Shield className="w-5 h-5 text-foreground" />
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-foreground">Terms & Conditions</h3>
                                        <p className="text-xs text-muted-foreground">Please accept to continue</p>
                                    </div>
                                </div>
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => setShowTerms(true)}
                                    className="text-xs group"
                                >
                                    View Terms
                                    <ArrowRight className="w-3 h-3 ml-1 group-hover:translate-x-1 transition-transform" />
                                </Button>
                            </div>

                            <div className="flex items-center p-3 rounded-lg bg-secondary/20">
                                <input
                                    type="checkbox"
                                    id="acceptTerms"
                                    checked={acceptedTerms}
                                    onChange={(e) => setAcceptedTerms(e.target.checked)}
                                    className="w-4 h-4 rounded border-2 border-primary text-primary focus:ring-primary"
                                />
                                <label htmlFor="acceptTerms" className="ml-3 text-foreground cursor-pointer text-sm">
                                    I accept all terms and conditions
                                </label>
                            </div>
                        </Card>
                    </motion.div>

                    {/* Action Buttons */}
                    <motion.div
                        initial={{ y: 20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: 1.4 }}
                        className="flex flex-col sm:flex-row gap-3"
                    >
                        <Button
                            variant="outline"
                            onClick={() => navigate(-1)}
                            className="flex-1 py-3 text-base border-2 hover:bg-secondary/50"
                            disabled={isLoading}
                        >
                            Back to Edit
                        </Button>
                        <Button
                            onClick={handlePlaceOrder}
                            disabled={isLoading || !acceptedTerms || (paymentMethod === 'redeemed' && !redemptionDetails && !isCashOnDelivery)}
                            className={`flex-1 py-3 text-base font-bold ${
                                !acceptedTerms || (paymentMethod === 'redeemed' && !redemptionDetails && !isCashOnDelivery)
                                    ? 'bg-muted text-muted-foreground cursor-not-allowed'
                                    : 'bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary'
                            }`}
                        >
                            {isLoading ? (
                                <span className="flex items-center justify-center">
                                    <Loader2 className="w-5 h-5 animate-spin mr-2" />
                                    Processing...
                                </span>
                            ) : (
                                <span className="flex items-center justify-center">
                                    {isCashOnDelivery ? (
                                        <>
                                            <BanknoteIcon className="w-5 h-5 mr-2" />
                                            Place Order (Cash on Delivery)
                                        </>
                                    ) : isFullyRedeemed || finalAmount === 0 ? (
                                        <>
                                            <CheckCircle className="w-5 h-5 mr-2" />
                                            Place Order (Free - All Items Redeemed)
                                        </>
                                    ) : finalAmount > 0 ? (
                                        <>
                                            <CreditCard className="w-5 h-5 mr-2" />
                                            Pay ₹{finalAmount}
                                        </>
                                    ) : (
                                        <>
                                            <CheckCircle className="w-5 h-5 mr-2" />
                                            Place Order (Free)
                                        </>
                                    )}
                                </span>
                            )}
                        </Button>
                    </motion.div>

                    {/* Delivery Charge Info */}
                    <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 1.5 }}
                        className="text-center text-xs text-muted-foreground mt-4"
                    >
                        {getDeliveryChargeMessage()}
                    </motion.p>
                </motion.div>
            </div>
        </motion.div>
    );
};

export default Ordersummary;