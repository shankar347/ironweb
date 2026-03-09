// import { useContext, useState, useEffect } from 'react';
// import { Button } from '../../components/ui/button';
// import { Card } from '../../components/ui/card';
// import { 
//   User, Phone, MapPin, Shirt, ShoppingCart, 
//   Clock, CreditCard, BanknoteIcon, Receipt, 
//   ShoppingBasketIcon, Truck, CheckCircle, AlertCircle,
//   ChevronRight, Info, X, FileText, Tag,
//   Gift, Loader2, Shield, Wallet, ArrowRight,
//   Sparkles, BadgeCheck, IndianRupee
// } from 'lucide-react';
// import { useNavigate } from 'react-router-dom';
// import { toast } from "react-toastify";
// import { SteamContext } from '../../hooks/steamcontext';
// import { API_URL } from '../../hooks/tools';
// import { motion, AnimatePresence } from 'framer-motion';
// import { initiateOrderPayment } from '../../services/orderPaymentService';

// interface ClothItem {
//   item: string;
//   quantity: string;
//   cost: string;
//   name?: string;
//   count?: number;
// }

// interface SubscriptionCloth {
//   name: string;
//   count: number;
//   _id: string;
// }

// interface Subscription {
//   _id: string;
//   plan: string;
//   credits: number;
//   cloths: SubscriptionCloth[];
//   startdate: string;
//   enddate: string;
//   status: string;
// }

// interface RedemptionDetails {
//   canRedeem: boolean;
//   isFullyRedeemed: boolean;
//   totalCreditsNeeded: number;
//   insufficientItems: string[];
//   redeemedItems: { name: string; count: number; cost: number }[];
//   payableAmount: number;
//   redeemableCredits: number;
//   remainingCredits: number;
//   originalAmount: number;
// }

// const Ordersummary = () => {
//     const [isLoading, setIsLoading] = useState(false);
//     const [showTerms, setShowTerms] = useState(false);
//     const [acceptedTerms, setAcceptedTerms] = useState(false);
//     const [useSubscription, setUseSubscription] = useState(false);
//     const [subscription, setSubscription] = useState<Subscription | null>(null);
//     const [redemptionDetails, setRedemptionDetails] = useState<RedemptionDetails | null>(null);
//     const [paymentMethod, setPaymentMethod] = useState<'full' | 'redeemed'>('full');
//     const [showCashWarning, setShowCashWarning] = useState(false);
    
//     const steamcontext = useContext(SteamContext);
//     const { orderdetails, setorderdetails, User: User1 } = steamcontext;
//     const [localOrderDetails, setLocalOrderDetails] = useState<any>(null);
//     const [showFullAddress, setShowFullAddress] = useState(false);

//     const navigate = useNavigate();

//     // Check if payment method is cash on delivery
//     const isCashOnDelivery = localOrderDetails?.otherdetails?.paymenttype?.toLowerCase() === 'cash on delivery';

//     // Fetch active subscription on component mount
//     useEffect(() => {
//         const fetchSubscription = async () => {
//             if (User1?.subscription?._id) {
//                 try {
//                     const response = await fetch(`${API_URL}/user/subscription/${User1.subscription._id}`, {
//                         credentials: 'include'
//                     });
//                     const data = await response.json();
//                     if (data.success) {
//                         setSubscription(data.subscription);
//                     }
//                 } catch (error) {
//                     console.error('Error fetching subscription:', error);
//                 }
//             }
//         };

//         fetchSubscription();
//     }, [User1]);

//     useEffect(() => {
//         const checkdetails = localStorage.getItem('orderdetails');
//         if (checkdetails) {
//             const parsedDetails = JSON.parse(checkdetails);
//             setLocalOrderDetails(parsedDetails);
//             setorderdetails(parsedDetails);
//         } else {
//             toast.error('No order details found. Please start over.');
//             navigate('/customer/bookslot');
//         }
//     }, [navigate, setorderdetails]);

//     // Show warning for cash on delivery with subscription
//     useEffect(() => {
//         if (isCashOnDelivery && subscription) {
//             setShowCashWarning(true);
//             setUseSubscription(false);
//             setPaymentMethod('full');
//             toast.warning('Cash on delivery cannot be used with subscription credits. Please select online payment to redeem credits.', {
//                 autoClose: 5000
//             });
//         } else {
//             setShowCashWarning(false);
//         }
//     }, [isCashOnDelivery, subscription]);

//     // Calculate redemption details when subscription or order details change
//     useEffect(() => {
//         if (subscription && localOrderDetails?.order_cloths && !isCashOnDelivery) {
//             calculateRedemptionDetails();
//         } else {
//             // Reset redemption details if no subscription or cash on delivery
//             setRedemptionDetails(null);
//             setUseSubscription(false);
//         }
//     }, [subscription, localOrderDetails, isCashOnDelivery]);

//     // Recalculate when useSubscription changes
//     useEffect(() => {
//         if (subscription && localOrderDetails?.order_cloths && useSubscription && !isCashOnDelivery) {
//             calculateRedemptionDetails();
//         }
//     }, [useSubscription, isCashOnDelivery]);

//     const calculateRedemptionDetails = () => {
//         if (!subscription || !localOrderDetails?.order_cloths) return;

//         const items = localOrderDetails.order_cloths;
//         const originalAmount = Number(localOrderDetails?.otherdetails?.totalamount || '0');
        
//         // Calculate total credits needed (assuming 1 credit = ₹1)
//         const totalCreditsNeeded = items.reduce((sum: number, item: ClothItem) => {
//             return sum + (Number(item.cost) * Number(item.quantity));
//         }, 0);

//         // Check each item against subscription cloth limits
//         const insufficientItems: string[] = [];
//         const redeemedItems: { name: string; count: number; cost: number }[] = [];
//         let totalRedeemableCredits = 0;
//         let allItemsFullyRedeemed = true;

//         items.forEach((item: ClothItem) => {
//             const clothName = item.item;
//             const requestedCount = Number(item.quantity);
            
//             // Find matching cloth in subscription
//             const subscriptionCloth = subscription.cloths.find(
//                 (c: SubscriptionCloth) => c.name.toLowerCase() === clothName.toLowerCase()
//             );

//             if (subscriptionCloth) {
//                 const availableCount = subscriptionCloth.count;
//                 if (availableCount < requestedCount) {
//                     insufficientItems.push(`${clothName}: Need ${requestedCount}, Available ${availableCount}`);
//                     allItemsFullyRedeemed = false;
//                     // Still calculate partial redemption
//                     const redeemableCount = availableCount;
//                     if (redeemableCount > 0) {
//                         const itemCost = Number(item.cost) * redeemableCount;
//                         totalRedeemableCredits += itemCost;
//                         redeemedItems.push({
//                             name: clothName,
//                             count: redeemableCount,
//                             cost: itemCost
//                         });
//                     }
//                 } else {
//                     const itemCost = Number(item.cost) * requestedCount;
//                     totalRedeemableCredits += itemCost;
//                     redeemedItems.push({
//                         name: clothName,
//                         count: requestedCount,
//                         cost: itemCost
//                     });
//                 }
//             } else {
//                 insufficientItems.push(`${clothName} not available in your subscription plan`);
//                 allItemsFullyRedeemed = false;
//             }
//         });

//         // Check if we have enough total credits
//         const hasEnoughCredits = subscription.credits >= totalRedeemableCredits;
        
//         // Calculate payable amount (items not covered by subscription)
//         const payableAmount = originalAmount - totalRedeemableCredits;
//         const isFullyRedeemed = payableAmount <= 0 && insufficientItems.length === 0 && hasEnoughCredits;

//         setRedemptionDetails({
//             canRedeem: insufficientItems.length === 0 && hasEnoughCredits,
//             isFullyRedeemed,
//             totalCreditsNeeded: totalRedeemableCredits,
//             insufficientItems,
//             redeemedItems,
//             payableAmount: payableAmount > 0 ? payableAmount : 0,
//             redeemableCredits: totalRedeemableCredits,
//             remainingCredits: subscription.credits - totalRedeemableCredits,
//             originalAmount
//         });
//     };

//     // Format data for API
//     const prepareApiData = () => {
//         if (!localOrderDetails) return null;

//         const apiData: any = {
//             userdetails: {
//                 area: localOrderDetails?.userdetails?.area || '',
//                 city: localOrderDetails?.userdetails?.city || '',
//                 houseno: localOrderDetails?.userdetails?.houseno || '',
//                 name: localOrderDetails?.userdetails?.name || '',
//                 phoneno: localOrderDetails?.userdetails?.phoneno || '',
//                 pincode: localOrderDetails?.userdetails?.pincode || '',
//                 streetname: localOrderDetails?.userdetails?.streetname || ''
//             },
//             otherdetails: {
//                 paymenttype: localOrderDetails?.otherdetails?.paymenttype || 'online',
//                 timeslot: localOrderDetails?.otherdetails?.timeslot || '',
//                 totalamount: String(localOrderDetails?.otherdetails?.totalamount || '0'),
//                 totalcloths: String(localOrderDetails?.otherdetails?.totalcloths || '0'),
//                 deliverySpeed: localOrderDetails?.otherdetails?.deliverySpeed || 'normal'
//             },
//             order_cloths: localOrderDetails?.order_cloths || []
//         };

//         // Add subscription redemption data if applicable
//         if (useSubscription && subscription && redemptionDetails && !isCashOnDelivery) {
//             apiData.subscriptionRedemption = {
//                 subscriptionId: subscription._id,
//                 usedCredits: redemptionDetails.redeemableCredits,
//                 redeemedItems: redemptionDetails.redeemedItems,
//                 payableAmount: redemptionDetails.payableAmount,
//                 originalAmount: redemptionDetails.originalAmount,
//                 isFullyRedeemed: redemptionDetails.isFullyRedeemed
//             };
//         }

//         return apiData;
//     };



//     const handleSwitchToOnline = () => {
//         // Update local order details with online payment
//         const updatedDetails = {
//             ...localOrderDetails,
//             otherdetails: {
//                 ...localOrderDetails.otherdetails,
//                 paymenttype: 'online'
//             }
//         };
        
//         localStorage.setItem('orderdetails', JSON.stringify(updatedDetails));
//         setLocalOrderDetails(updatedDetails);
//         setorderdetails(updatedDetails);
        
//         toast.success('Switched to online payment. You can now redeem your subscription credits.');
//     };

//     const handleGoToBookSlot = () => {
//         navigate('/customer/bookslot');
//     };

//     const handlePlaceOrder = async () => {
//         if (!acceptedTerms) {
//             toast.error('Please accept the terms and conditions to proceed');
//             return;
//         }

//         const apiData = prepareApiData();
//         if (!apiData) {
//             toast.error('Order details are incomplete');
//             return;
//         }

//         // Validate required fields
//         if (!apiData.userdetails.name || !apiData.userdetails.phoneno || 
//             !apiData.userdetails.houseno || !apiData.userdetails.pincode) {
//             toast.error('Please complete your address details');
//             navigate('/customer/confirmaddress');
//             return;
//         }

//         if (!apiData.otherdetails.timeslot) {
//             toast.error('Please select a time slot');
//             navigate('/customer/bookslot');
//             return;
//         }

//         if (!apiData.order_cloths || apiData.order_cloths.length === 0) {
//             toast.error('No items selected');
//             navigate('/customer/bookslot');
//             return;
//         }

//         setIsLoading(true);
        
//         try {
//             // Determine which amount to use based on payment method
//             const amountToPay = paymentMethod === 'redeemed' && redemptionDetails && !isCashOnDelivery
//                 ? redemptionDetails.payableAmount 
//                 : Number(apiData.otherdetails.totalamount);

//             // If amount is 0 (fully redeemed) or cash on delivery, create order directly
//             if (amountToPay === 0 || isCashOnDelivery) {
//                 // Create order directly
//                 const res = await fetch(`${API_URL}/orders/createorder`, {
//                     method: 'POST',
//                     headers: {
//                         'Content-Type': 'application/json'
//                     },
//                     body: JSON.stringify(apiData),
//                     credentials: 'include',
//                 });

//                 const data = await res.json();

//                 if (res.status === 401) {
//                     toast.error('Please login to place an order');
//                     navigate('/login');
//                     return;
//                 }

//                 if (!res.ok) {
//                     throw new Error(data?.error || 'Failed to create order');
//                 }

//                 if (data?.error) {
//                     toast.error(data.error);
//                     return;
//                 }

//                 // Update subscription if used (and not cash on delivery)
//                 if (useSubscription && subscription && redemptionDetails && !isCashOnDelivery) {
//                     try {
//                         await updateSubscriptionAfterOrder();
//                         if (redemptionDetails.isFullyRedeemed) {
//                             toast.success(` Successfully redeemed all items with ${redemptionDetails.redeemableCredits} credits!`);
//                         } else {
//                             toast.success(`Successfully redeemed ${redemptionDetails.redeemableCredits} credits!`);
//                         }
//                     } catch (subError: any) {
//                         toast.warning('Order placed but subscription update failed. Please contact support.');
//                         console.error('Subscription update error:', subError);  
//                     }
//                 }

//                 // Clear localStorage and context
//                 localStorage.removeItem('orderdetails');
//                 setorderdetails(null);
                
//                 const successMessage = isCashOnDelivery 
//                     ? 'Order placed successfully with Cash on Delivery!' 
//                     : amountToPay === 0 
//                         ? '🎉 Order placed successfully! All items redeemed with subscription credits.'
//                         : 'Order placed successfully!';
                
//                 toast.success(successMessage);
//                 // navigate('/customer/ordertrack');
//                 return;
//             }

//             // For amount > 0 (not fully redeemed), initiate payment
//             const paymentResult = await initiateOrderPayment({
//                 orderData: apiData,
//                 amount: amountToPay,
//                 useSubscription: useSubscription && paymentMethod === 'redeemed' && !isCashOnDelivery,
//                 subscriptionId: subscription?._id,
//                 usedCredits: redemptionDetails?.redeemableCredits || 0,
//                 redeemedItems: redemptionDetails?.redeemedItems || [],
//                 userEmail: User1?.email,
//                 userPhone: User1?.phoneno,
//                 userName: User1?.name
//             });

//             if (paymentResult.success) {
//                 // Clear localStorage and context
//                 localStorage.removeItem('orderdetails');
//                 setorderdetails(null);
                
//                 const message = useSubscription && paymentMethod === 'redeemed' && !isCashOnDelivery
//                     ? `Order placed! Redeemed ${redemptionDetails?.redeemableCredits} credits and paid ₹${amountToPay}`
//                     : 'Order placed successfully!';
                
//                 toast.success(message);
//                 navigate('/customer/ordertrack');
//             } else {
//                 toast.error(paymentResult.message || 'Payment failed. Please try again.');
//             }
//         } catch (error: any) {
//             console.error('Order creation error:', error);
//             toast.error(error.message || 'Something went wrong. Please try again.');
//         } finally {
//             setIsLoading(false);
//         }
//     };

//     const TermsAndConditionsModal = () => (
//         <AnimatePresence>
//             {showTerms && (
//                 <motion.div
//                     initial={{ opacity: 0 }}
//                     animate={{ opacity: 1 }}
//                     exit={{ opacity: 0 }}
//                     className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-2 sm:p-4"
//                     onClick={() => setShowTerms(false)}
//                 >
//                     <motion.div
//                         initial={{ scale: 0.9, y: 20 }}
//                         animate={{ scale: 1, y: 0 }}
//                         exit={{ scale: 0.9, y: 20 }}
//                         className="bg-card w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-xl sm:rounded-2xl shadow-2xl border"
//                         onClick={(e) => e.stopPropagation()}
//                     >
//                         <div className="sticky top-0 bg-card border-b p-4 sm:p-6 flex justify-between items-center">
//                             <div className="flex items-center space-x-2 sm:space-x-3">
//                                 <div className="bg-primary/10 p-1 sm:p-2 rounded-lg">
//                                     <FileText className="w-4 h-4 sm:w-6 sm:h-6 text-primary" />
//                                 </div>
//                                 <div>
//                                     <h2 className="text-lg sm:text-2xl font-bold text-foreground">Terms & Conditions</h2>
//                                     <p className="text-xs sm:text-sm text-muted-foreground">Please read carefully before proceeding</p>
//                                 </div>
//                             </div>
//                             <Button
//                                 variant="ghost"
//                                 size="icon"
//                                 onClick={() => setShowTerms(false)}
//                                 className="rounded-full hover:bg-muted h-8 w-8 sm:h-10 sm:w-10"
//                             >
//                                 <X className="w-3 h-3 sm:w-5 sm:h-5" />
//                             </Button>
//                         </div>
                        
//                         <div className="p-4 sm:p-6 space-y-4 sm:space-y-6">
//                             {[
//                                 {
//                                     title: "Garment Condition & Damage",
//                                     content: "Not responsible for colour fade, shrinkage, weak fabric, loose threads, or pre-existing stains."
//                                 },
//                                 {
//                                     title: "Valuables in Clothing",
//                                     content: "Remove cash, wallet, jewellery, rings, gold, keys, cards, earphones, or documents. Steemer is not responsible for any items left in pockets."
//                                 },
//                                 {
//                                     title: "Special / Delicate Garments",
//                                     content: "No liability for damage to delicate fabrics, embroidery, sequins, stones, or printed designs."
//                                 },
//                                 {
//                                     title: "Stain Disclaimer",
//                                     content: "No guarantee for stain removal; stains may remain based on fabric type."
//                                 },
//                                 {
//                                     title: "Garment Count Verification",
//                                     content: "Customer must confirm garment count during pickup. Not responsible for missing items if count is not checked."
//                                 },
//                                 {
//                                     title: "Pickup & Delivery Check",
//                                     content: "Please check clothes immediately at delivery and report issues instantly."
//                                 },
//                                 {
//                                     title: "Timings & Delays",
//                                     content: "Delivery time may vary due to traffic, weather, or operational reasons."
//                                 },
//                                 {
//                                     title: "Garment Preparation",
//                                     content: "Clothes must be clean, dry, and ready for pickup."
//                                 },
//                                 {
//                                     title: "Order Confirmation",
//                                     content: "Placing an order means you accept all Steemer service terms."
//                                 }
//                             ].map((term, index) => (
//                                 <motion.div
//                                     key={index}
//                                     initial={{ opacity: 0, x: -20 }}
//                                     animate={{ opacity: 1, x: 0 }}
//                                     transition={{ delay: index * 0.05 }}
//                                     className="bg-secondary/30 p-3 sm:p-4 rounded-lg sm:rounded-xl border-l-2 sm:border-l-4 border-primary"
//                                 >
//                                     <h3 className="font-bold text-foreground text-sm sm:text-base mb-1 sm:mb-2 flex items-center">
//                                         <AlertCircle className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2 text-primary" />
//                                         {term.title}
//                                     </h3>
//                                     <p className="text-muted-foreground text-xs sm:text-sm">{term.content}</p>
//                                 </motion.div>
//                             ))}
//                         </div>
                        
//                         <div className="sticky bottom-0 bg-card border-t p-4 sm:p-6">
//                             <Button
//                                 onClick={() => {
//                                     setAcceptedTerms(true);
//                                     setShowTerms(false);
//                                 }}
//                                 className="w-full py-2 sm:py-3 text-sm sm:text-lg font-semibold"
//                             >
//                                 <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
//                                 I Accept All Terms & Conditions
//                             </Button>
//                         </div>
//                     </motion.div>
//                 </motion.div>
//             )}
//         </AnimatePresence>
//     );

//     // Show loading if no data
//     if (!localOrderDetails) {
//         return (
//             <div className="min-h-screen flex items-center justify-center p-4">
//                 <div className="text-center">
//                     <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
//                     <p className="text-muted-foreground">Loading order details...</p>
//                 </div>
//             </div>
//         );
//     }

//     // Calculate display amounts
//     const originalAmount = Number(localOrderDetails?.otherdetails?.totalamount || 0);
//     const displayAmount = paymentMethod === 'redeemed' && redemptionDetails && !isCashOnDelivery
//         ? redemptionDetails.payableAmount 
//         : originalAmount;
    
//     const savingsAmount = paymentMethod === 'redeemed' && redemptionDetails && !isCashOnDelivery
//         ? originalAmount - redemptionDetails.payableAmount
//         : 0;

//     const isFullyRedeemed = redemptionDetails?.isFullyRedeemed && paymentMethod === 'redeemed' && !isCashOnDelivery;

//     return (
//         <motion.div 
//             initial={{ opacity: 0 }}
//             animate={{ opacity: 1 }}
//             transition={{ duration: 0.5 }}
//             className="min-h-screen bg-gradient-to-br from-secondary/10 via-background to-primary/5 py-8 sm:py-12 md:py-20"
//         >
//             <TermsAndConditionsModal />
            
//             <div className="container mx-auto px-3 sm:px-4">
//                 <motion.div 
//                     initial={{ y: 20, opacity: 0 }}
//                     animate={{ y: 0, opacity: 1 }}
//                     transition={{ delay: 0.2 }}
//                     className="max-w-2xl mx-auto"
//                 >
//                     {/* Header */}
//                     <div className="text-center mb-8 sm:mb-12">
//                         <motion.div 
//                             initial={{ scale: 0 }}
//                             animate={{ scale: 1 }}
//                             transition={{ delay: 0.3, type: "spring" }}
//                             className="bg-gradient-to-r from-primary to-primary/80 w-16 h-16 sm:w-20 sm:h-20 rounded-full flex items-center justify-center mx-auto mb-4 sm:mb-6 shadow-lg shadow-primary/20"
//                         >
//                             <ShoppingCart className="w-8 h-8 sm:w-10 sm:h-10 text-white" />
//                         </motion.div>
//                         <motion.h1 
//                             initial={{ y: 10, opacity: 0 }}
//                             animate={{ y: 0, opacity: 1 }}
//                             transition={{ delay: 0.4 }}
//                             className="text-2xl sm:text-3xl md:text-4xl font-bold text-foreground mb-2 sm:mb-3 bg-gradient-to-r from-foreground to-foreground/80 bg-clip-text text-transparent"
//                         >
//                             Order Summary
//                         </motion.h1>
//                         <motion.p 
//                             initial={{ y: 10, opacity: 0 }}
//                             animate={{ y: 0, opacity: 1 }}
//                             transition={{ delay: 0.5 }}
//                             className="text-muted-foreground text-sm sm:text-base md:text-lg"
//                         >
//                             Review your order before confirmation
//                         </motion.p>
//                     </div>

//                     {/* Cash on Delivery Warning */}
//                     {showCashWarning && subscription && (
//                         <motion.div
//                             initial={{ y: 20, opacity: 0 }}
//                             animate={{ y: 0, opacity: 1 }}
//                             className="mb-4 sm:mb-6"
//                         >
//                             <Card className="p-4 sm:p-6 border-2 border-yellow-500/30 bg-yellow-500/5 shadow-lg rounded-xl sm:rounded-2xl">
//                                 <div className="flex items-start space-x-3">
//                                     <div className="bg-yellow-500 p-2 rounded-lg flex-shrink-0">
//                                         <AlertCircle className="w-5 h-5 text-white" />
//                                     </div>
//                                     <div className="flex-1">
//                                         <h3 className="font-bold text-foreground mb-2">Cash on Delivery Restriction</h3>
//                                         <p className="text-sm text-muted-foreground mb-3">
//                                             You have an active subscription but selected Cash on Delivery. 
//                                             Subscription credits can only be redeemed with online payments.
//                                         </p>
//                                         <div className="flex flex-col sm:flex-row gap-2">
//                                             <Button
//                                                 onClick={handleSwitchToOnline}
//                                                 size="sm"
//                                                 className="bg-yellow-500 hover:bg-yellow-600 text-white"
//                                             >
//                                                 <CreditCard className="w-4 h-4 mr-2" />
//                                                 Switch to Online Payment
//                                             </Button>
//                                             <Button
//                                                 onClick={handleGoToBookSlot}
//                                                 variant="outline"
//                                                 size="sm"
//                                                 className="border-yellow-500/30"
//                                             >
//                                                 <Clock className="w-4 h-4 mr-2" />
//                                                 Change Time Slot
//                                             </Button>
//                                         </div>
//                                     </div>
//                                 </div>
//                             </Card>
//                         </motion.div>
//                     )}

//                     {/* Subscription Section - Only show if not cash on delivery */}
//                     {subscription && subscription.status === 'active' && !isCashOnDelivery && (
//                         <motion.div
//                             initial={{ y: 20, opacity: 0 }}
//                             animate={{ y: 0, opacity: 1 }}
//                             transition={{ delay: 0.55 }}
//                             className="mb-4 sm:mb-6"
//                         >
//                             <Card className="p-4 sm:p-6 border-2 border-primary/20 shadow-lg rounded-xl sm:rounded-2xl bg-gradient-to-br from-primary/5 to-primary/10">
//                                 <div className="flex items-center justify-between mb-4">
//                                     <div className="flex items-center space-x-3">
//                                         <div className="bg-primary p-2 rounded-lg">
//                                             <Gift className="w-5 h-5 text-white" />
//                                         </div>
//                                         <div>
//                                             <h3 className="font-bold text-foreground">Active Subscription</h3>
//                                             <p className="text-xs text-muted-foreground">
//                                                 {subscription.plan} • {subscription.credits} credits available
//                                             </p>
//                                         </div>
//                                     </div>
//                                     <BadgeCheck className="w-6 h-6 text-green-500" />
//                                 </div>

//                                 {/* Payment Method Selection */}
//                                 <div className="space-y-3">
//                                     <div 
//                                         className={`p-3 rounded-lg border-2 cursor-pointer transition-all ${
//                                             paymentMethod === 'full' 
//                                                 ? 'border-primary bg-primary/5' 
//                                                 : 'border-border hover:border-primary/50'
//                                         }`}
//                                         onClick={() => setPaymentMethod('full')}
//                                     >
//                                         <div className="flex items-center justify-between">
//                                             <div className="flex items-center space-x-3">
//                                                 <div className={`p-2 rounded-lg ${
//                                                     paymentMethod === 'full' ? 'bg-primary' : 'bg-secondary'
//                                                 }`}>
//                                                     <Wallet className={`w-4 h-4 ${
//                                                         paymentMethod === 'full' ? 'text-white' : 'text-muted-foreground'
//                                                     }`} />
//                                                 </div>
//                                                 <div>
//                                                     <p className="font-medium text-foreground">Pay Full Amount</p>
//                                                     <p className="text-xs text-muted-foreground">
//                                                         Pay ₹{originalAmount} without using credits
//                                                     </p>
//                                                 </div>
//                                             </div>
//                                             <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
//                                                 paymentMethod === 'full' 
//                                                     ? 'border-primary bg-primary' 
//                                                     : 'border-muted-foreground'
//                                             }`}>
//                                                 {paymentMethod === 'full' && (
//                                                     <CheckCircle className="w-4 h-4 text-white" />
//                                                 )}
//                                             </div>
//                                         </div>
//                                     </div>

//                                     <div 
//                                         className={`p-3 rounded-lg border-2 cursor-pointer transition-all ${
//                                             paymentMethod === 'redeemed' 
//                                                 ? 'border-green-500 bg-green-500/5' 
//                                                 : 'border-border hover:border-green-500/50'
//                                         }`}
//                                         onClick={() => {
//                                             setPaymentMethod('redeemed');
//                                             setUseSubscription(true);
//                                             calculateRedemptionDetails();
//                                         }}
//                                     >
//                                         <div className="flex items-center justify-between">
//                                             <div className="flex items-center space-x-3">
//                                                 <div className={`p-2 rounded-lg ${
//                                                     paymentMethod === 'redeemed' ? 'bg-green-500' : 'bg-secondary'
//                                                 }`}>
//                                                     <Sparkles className={`w-4 h-4 ${
//                                                         paymentMethod === 'redeemed' ? 'text-white' : 'text-muted-foreground'
//                                                     }`} />
//                                                 </div>
//                                                 <div>
//                                                     <p className="font-medium text-foreground">Use Subscription Credits</p>
//                                                     <p className="text-xs text-muted-foreground">
//                                                         Redeem available credits and pay the balance
//                                                     </p>
//                                                 </div>
//                                             </div>
//                                             <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
//                                                 paymentMethod === 'redeemed' 
//                                                     ? 'border-green-500 bg-green-500' 
//                                                     : 'border-muted-foreground'
//                                             }`}>
//                                                 {paymentMethod === 'redeemed' && (
//                                                     <CheckCircle className="w-4 h-4 text-white" />
//                                                 )}
//                                             </div>
//                                         </div>

//                                         {/* Redemption Details */}
//                                         {paymentMethod === 'redeemed' && redemptionDetails && (
//                                             <motion.div
//                                                 initial={{ opacity: 0, height: 0 }}
//                                                 animate={{ opacity: 1, height: 'auto' }}
//                                                 className="mt-3 pt-3 border-t border-green-500/20"
//                                             >
//                                                 {redemptionDetails.isFullyRedeemed ? (
//                                                     <div className="space-y-2 bg-green-500/10 p-3 rounded-lg">
//                                                         <div className="flex items-center space-x-2 text-green-600">
//                                                             <CheckCircle className="w-5 h-5" />
//                                                             <span className="font-bold">🎉 All items fully redeemed!</span>
//                                                         </div>
//                                                         <div className="flex justify-between text-sm">
//                                                             <span className="text-muted-foreground">Credits redeemed:</span>
//                                                             <span className="font-medium text-green-600">₹{redemptionDetails.redeemableCredits}</span>
//                                                         </div>

//                                                         <div className="flex justify-between text-sm font-bold pt-2 border-t border-green-500/20">
//                                                             <span>Final amount:</span>
//                                                             <span className="text-green-600">FREE (₹0)</span>
//                                                         </div>
//                                                         {redemptionDetails.redeemedItems.length > 0 && (
//                                                             <div className="mt-2">
//                                                                 <p className="text-xs text-muted-foreground mb-1">Items redeemed:</p>
//                                                                 {redemptionDetails.redeemedItems.map((item, idx) => (
//                                                                     <div key={idx} className="flex justify-between text-xs">
//                                                                         <span>{item.name} x{item.count}</span>
//                                                                         <span className="text-green-600">₹{item.cost}</span>
//                                                                     </div>
//                                                                 ))}
//                                                             </div>
//                                                         )}
//                                                     </div>
//                                                 ) : redemptionDetails.canRedeem ? (
//                                                     <div className="space-y-2">
//                                                         <div className="flex justify-between text-sm">
//                                                             <span className="text-muted-foreground">Credits to redeem:</span>
//                                                             <span className="font-medium text-green-600">₹{redemptionDetails.redeemableCredits}</span>
//                                                         </div>
//                                                         <div className="flex justify-between text-sm">
//                                                             <span className="text-muted-foreground">Remaining credits:</span>
//                                                             <span className="font-medium">₹{redemptionDetails.remainingCredits}</span>
//                                                         </div>
//                                                         <div className="flex justify-between text-sm font-bold pt-2 border-t border-green-500/20">
//                                                             <span>Payable amount:</span>
//                                                             <span className="text-primary">₹{redemptionDetails.payableAmount}</span>
//                                                         </div>
//                                                         {redemptionDetails.redeemedItems.length > 0 && (
//                                                             <div className="mt-2">
//                                                                 <p className="text-xs text-muted-foreground mb-1">Items being redeemed:</p>
//                                                                 {redemptionDetails.redeemedItems.map((item, idx) => (
//                                                                     <div key={idx} className="flex justify-between text-xs">
//                                                                         <span>{item.name} x{item.count}</span>
//                                                                         <span className="text-green-600">₹{item.cost}</span>
//                                                                     </div>
//                                                                 ))}
//                                                             </div>
//                                                         )}
//                                                     </div>
//                                                 ) : (
//                                                     <div className="text-red-500 text-sm">
//                                                         <p className="flex items-center">
//                                                             <AlertCircle className="w-4 h-4 mr-1" />
//                                                             Cannot fully redeem with current subscription
//                                                         </p>
//                                                         {redemptionDetails.insufficientItems.length > 0 && (
//                                                             <ul className="mt-2 text-xs space-y-1">
//                                                                 {redemptionDetails.insufficientItems.map((issue, idx) => (
//                                                                     <li key={idx}>• {issue}</li>
//                                                                 ))}
//                                                             </ul>
//                                                         )}
//                                                         <div className="mt-2 pt-2 border-t border-red-500/20">
//                                                             <div className="flex justify-between text-xs">
//                                                                 <span>Partial redemption value:</span>
//                                                                 <span className="text-green-600">₹{redemptionDetails.redeemableCredits}</span>
//                                                             </div>
//                                                             <div className="flex justify-between text-xs font-bold mt-1">
//                                                                 <span>Amount to pay:</span>
//                                                                 <span className="text-primary">₹{redemptionDetails.payableAmount}</span>
//                                                             </div>
//                                                         </div>
//                                                     </div>
//                                                 )}
//                                             </motion.div>
//                                         )}
//                                     </div>
//                                 </div>
//                             </Card>
//                         </motion.div>
//                     )}

//                     {/* Items Details Card */}
//                     {localOrderDetails?.order_cloths && localOrderDetails.order_cloths.length > 0 && (
//                         <motion.div
//                             initial={{ y: 20, opacity: 0 }}
//                             animate={{ y: 0, opacity: 1 }}
//                             transition={{ delay: 0.6 }}
//                         >
//                             <Card className="p-4 sm:p-6 md:p-8 mb-4 sm:mb-6 border-2 border-primary/10 shadow-lg hover:shadow-xl transition-all duration-300 rounded-xl sm:rounded-2xl bg-gradient-to-br from-card to-card/95">
//                                 <div className="flex items-center mb-4 sm:mb-6">
//                                     <div className="bg-primary/10 p-2 sm:p-3 rounded-lg sm:rounded-xl mr-3 sm:mr-4">
//                                         <ShoppingBasketIcon className="w-5 h-5 sm:w-6 sm:h-6 md:w-7 md:h-7 text-primary" />
//                                     </div>
//                                     <div>
//                                         <h3 className="text-lg sm:text-xl md:text-2xl font-bold text-foreground">Selected Items</h3>
//                                         <p className="text-muted-foreground text-xs sm:text-sm">Your order items</p>
//                                     </div>
//                                 </div>

//                                 <div className="space-y-2 sm:space-y-3">
//                                     {localOrderDetails.order_cloths.map((item: any, index: number) => {
//                                         const isRedeemed = paymentMethod === 'redeemed' && !isCashOnDelivery && 
//                                             redemptionDetails?.redeemedItems.some(
//                                                 ri => ri.name.toLowerCase() === item.item.toLowerCase()
//                                             );
                                        
//                                         return (
//                                             <motion.div
//                                                 key={index}
//                                                 initial={{ x: -20, opacity: 0 }}
//                                                 animate={{ x: 0, opacity: 1 }}
//                                                 transition={{ delay: 0.7 + index * 0.05 }}
//                                                 className={`flex justify-between items-start sm:items-center p-3 sm:p-4 rounded-lg sm:rounded-xl transition-colors ${
//                                                     isRedeemed ? 'bg-green-500/10 border border-green-500/20' : 'bg-secondary/20 hover:bg-secondary/30'
//                                                 }`}
//                                             >
//                                                 <div className="flex items-start space-x-2 sm:space-x-3">
//                                                     <div className="bg-primary/10 p-1.5 sm:p-2 rounded-lg flex-shrink-0">
//                                                         <Shirt className="w-3 h-3 sm:w-4 sm:h-4 text-primary" />
//                                                     </div>
//                                                     <div className="min-w-0">
//                                                         <span className="font-medium text-foreground text-sm sm:text-base block truncate">
//                                                             {item.item}
//                                                             {isRedeemed && (
//                                                                 <span className="ml-2 text-xs bg-green-500 text-white px-1.5 py-0.5 rounded-full">
//                                                                     Redeemed
//                                                                 </span>
//                                                             )}
//                                                         </span>
//                                                         <div className="flex items-center space-x-2 mt-1">
//                                                             <span className="text-xs sm:text-sm text-muted-foreground bg-secondary px-2 py-0.5 rounded-full">
//                                                                 {item.quantity} × ₹{item.cost}
//                                                             </span>
//                                                         </div>
//                                                     </div>
//                                                 </div>
//                                                 <div className="flex flex-col items-end">
//                                                     <span className={`font-bold text-sm sm:text-base md:text-lg ${
//                                                         isRedeemed ? 'text-green-600' : 'text-foreground'
//                                                     }`}>
//                                                         ₹{Number(item.cost) * Number(item.quantity)}
//                                                     </span>
//                                                 </div>
//                                             </motion.div>
//                                         );
//                                     })}

//                                     {/* Items Summary */}
//                                     <div className="pt-3 sm:pt-4 border-t border-secondary/30">
//                                         <div className="flex justify-between items-center px-2">
//                                             <div className="flex items-center space-x-2">
//                                                 <Tag className="w-3 h-3 sm:w-4 sm:h-4 text-primary" />
//                                                 <span className="text-xs sm:text-sm font-medium text-muted-foreground">
//                                                     Total Items
//                                                 </span>
//                                             </div>
//                                             <span className="font-bold text-foreground text-sm sm:text-base">
//                                                 {localOrderDetails?.otherdetails?.totalcloths || '0'} Items
//                                             </span>
//                                         </div>
//                                     </div>
//                                 </div>
//                             </Card>
//                         </motion.div>
//                     )}

//                     {/* Order Summary Card */}
//                     <motion.div
//                         initial={{ y: 20, opacity: 0 }}
//                         animate={{ y: 0, opacity: 1 }}
//                         transition={{ delay: 0.8 }}
//                     >
//                         <Card className="p-4 sm:p-6 md:p-8 mb-4 sm:mb-6 border-2 border-primary/10 shadow-lg hover:shadow-xl transition-all duration-300 rounded-xl sm:rounded-2xl bg-gradient-to-br from-card to-card/95">
//                             <div className="flex items-center mb-4 sm:mb-6">
//                                 <div className="bg-primary/10 p-2 sm:p-3 rounded-lg sm:rounded-xl mr-3 sm:mr-4">
//                                     <Receipt className="w-5 h-5 sm:w-6 sm:h-6 md:w-7 md:h-7 text-primary" />
//                                 </div>
//                                 <div>
//                                     <h3 className="text-lg sm:text-xl md:text-2xl font-bold text-foreground">Order Details</h3>
//                                     <p className="text-muted-foreground text-xs sm:text-sm">Your order specifications</p>
//                                 </div>
//                             </div>

//                             <div className="space-y-3 sm:space-y-4">
//                                 {[
//                                     { 
//                                         label: 'Payment Method', 
//                                         value: localOrderDetails?.otherdetails?.paymenttype || 'Not selected', 
//                                         icon: localOrderDetails?.otherdetails?.paymenttype?.toLowerCase() === 'cash on delivery' ? BanknoteIcon : CreditCard,
//                                         color: localOrderDetails?.otherdetails?.paymenttype?.toLowerCase() === 'cash on delivery' ? 'text-green-600' : 'text-blue-600'
//                                     },
//                                     { 
//                                         label: 'Selected Slot', 
//                                         value: localOrderDetails?.otherdetails?.timeslot || 'Not selected', 
//                                         icon: Clock,
//                                         color: 'text-blue-600'
//                                     },
//                                     { 
//                                         label: 'Delivery Speed', 
//                                         value: localOrderDetails?.otherdetails?.deliverySpeed || 'normal', 
//                                         icon: Truck,
//                                         color: 'text-purple-600'
//                                     }
//                                 ].map((item, index) => (
//                                     <motion.div
//                                         key={item.label}
//                                         initial={{ x: -20, opacity: 0 }}
//                                         animate={{ x: 0, opacity: 1 }}
//                                         transition={{ delay: 0.9 + index * 0.1 }}
//                                         className="flex justify-between items-center p-3 sm:p-4 rounded-lg sm:rounded-xl bg-secondary/20 hover:bg-secondary/30 transition-colors"
//                                     >
//                                         <div className="flex items-center space-x-2 sm:space-x-3">
//                                             <div className={`bg-primary/10 p-1.5 sm:p-2 rounded-lg ${item.color}`}>
//                                                 <item.icon className="w-3 h-3 sm:w-4 sm:h-4" />
//                                             </div>
//                                             <span className="font-medium text-foreground text-sm sm:text-base">{item.label}</span>
//                                         </div>
//                                         <span className="font-bold text-sm sm:text-base md:text-lg text-foreground capitalize">
//                                             {item.value}
//                                         </span>
//                                     </motion.div>
//                                 ))}

//                                 {/* Price Breakdown */}
//                                 <div className="p-3 sm:p-4 rounded-lg sm:rounded-xl bg-primary/5 border border-primary/10">
//                                     <h4 className="font-bold text-foreground mb-3 flex items-center">
//                                         <IndianRupee className="w-4 h-4 mr-1" />
//                                         Price Breakdown
//                                     </h4>
                                    
//                                     <div className="space-y-2">
//                                         <div className="flex justify-between text-sm">
//                                             <span className="text-muted-foreground">Subtotal:</span>
//                                             <span className="font-medium">₹{originalAmount}</span>
//                                         </div>
                                        
//                                         {paymentMethod === 'redeemed' && redemptionDetails && redemptionDetails.redeemableCredits > 0 && !isCashOnDelivery && (
//                                             <div className="flex justify-between text-sm text-green-600">
//                                                 <span>Credits redeemed:</span>
//                                                 <span>- ₹{redemptionDetails.redeemableCredits}</span>
//                                             </div>
//                                         )}
                                        
//                                         <div className="flex justify-between text-base font-bold pt-2 border-t border-primary/20">
//                                             <span>Total to pay:</span>
//                                             <span className={`${isFullyRedeemed ? 'text-green-600' : 'text-primary'}`}>
//                                                 {isFullyRedeemed ? 'FREE (₹0)' : `₹${displayAmount}`}
//                                             </span>
//                                         </div>
                                        
//                                         {savingsAmount > 0 && !isCashOnDelivery && (
//                                             <div className="flex justify-between text-xs text-green-600 bg-green-500/10 p-2 rounded-lg mt-2">
//                                                 <span>You save:</span>
//                                                 <span>₹{savingsAmount}</span>
//                                             </div>
//                                         )}
                                        
//                                         {isFullyRedeemed && (
//                                             <div className="flex justify-between text-xs text-green-600 bg-green-500/10 p-2 rounded-lg mt-2">
//                                                 <span className="flex items-center">
//                                                     <Sparkles className="w-3 h-3 mr-1" />
//                                                     Great news!
//                                                 </span>
//                                                 <span>All items redeemed with subscription</span>
//                                             </div>
//                                         )}
//                                     </div>
//                                 </div>
//                             </div>
//                         </Card>
//                     </motion.div>

//                     {/* Delivery Address Card */}
//                     <motion.div
//                         initial={{ y: 20, opacity: 0 }}
//                         animate={{ y: 0, opacity: 1 }}
//                         transition={{ delay: 1 }}
//                     >
//                         <Card className="p-4 sm:p-6 md:p-8 mb-4 sm:mb-6 border-2 border-primary/10 shadow-lg hover:shadow-xl transition-all duration-300 rounded-xl sm:rounded-2xl bg-gradient-to-br from-card to-card/95">
//                             <div className="flex items-center mb-4 sm:mb-6">
//                                 <div className="bg-primary/10 p-2 sm:p-3 rounded-lg sm:rounded-xl mr-3 sm:mr-4">
//                                     <Truck className="w-5 h-5 sm:w-6 sm:h-6 md:w-7 md:h-7 text-primary" />
//                                 </div>
//                                 <div>
//                                     <h3 className="text-lg sm:text-xl md:text-2xl font-bold text-foreground">Delivery Address</h3>
//                                     <p className="text-muted-foreground text-xs sm:text-sm">Where we'll deliver your order</p>
//                                 </div>
//                             </div>

//                             <div className="space-y-4">
//                                 <motion.div
//                                     initial={{ x: -20, opacity: 0 }}
//                                     animate={{ x: 0, opacity: 1 }}
//                                     transition={{ delay: 1.1 }}
//                                     className="flex items-start space-x-2 sm:space-x-4 p-3 sm:p-4 rounded-lg sm:rounded-xl bg-secondary/20"
//                                 >
//                                     <div className="bg-primary/10 p-1.5 sm:p-2 rounded-lg flex-shrink-0">
//                                         <User className="w-4 h-4 sm:w-5 sm:h-5 text-primary" />
//                                     </div>
//                                     <div className="min-w-0 flex-1">
//                                         <h4 className="font-bold text-foreground text-sm sm:text-base md:text-lg truncate">
//                                             {localOrderDetails?.userdetails?.name || 'Not provided'}
//                                         </h4>
//                                         <p className="text-muted-foreground flex items-center mt-1 text-xs sm:text-sm">
//                                             <Phone className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2 flex-shrink-0" />
//                                             <span className="truncate">{localOrderDetails?.userdetails?.phoneno || 'Not provided'}</span>
//                                         </p>
//                                     </div>
//                                 </motion.div>

//                                 <motion.div
//                                     initial={{ x: -20, opacity: 0 }}
//                                     animate={{ x: 0, opacity: 1 }}
//                                     transition={{ delay: 1.2 }}
//                                     className="p-3 sm:p-4 rounded-lg sm:rounded-xl bg-secondary/20"
//                                 >
//                                     <div className="flex items-center justify-between mb-2">
//                                         <div className="flex items-center space-x-2">
//                                             <div className="bg-primary/10 p-1.5 sm:p-2 rounded-lg">
//                                                 <MapPin className="w-3 h-3 sm:w-4 sm:h-4 text-primary" />
//                                             </div>
//                                             <h4 className="font-bold text-foreground text-sm sm:text-base">Address</h4>
//                                         </div>
//                                         <Button
//                                             variant="ghost"
//                                             size="sm"
//                                             onClick={() => setShowFullAddress(!showFullAddress)}
//                                             className="text-xs px-2 h-6"
//                                         >
//                                             {showFullAddress ? 'Show Less' : 'Show More'}
//                                         </Button>
//                                     </div>
//                                     <div className="ml-1 sm:ml-2 space-y-1">
//                                         {showFullAddress ? (
//                                             <>
//                                                 <p className="text-foreground text-xs sm:text-sm">
//                                                     <span className="font-medium">House No:</span> {localOrderDetails?.userdetails?.houseno || 'Not provided'}
//                                                 </p>
//                                                 <p className="text-foreground text-xs sm:text-sm">
//                                                     <span className="font-medium">Street:</span> {localOrderDetails?.userdetails?.streetname || ''}
//                                                 </p>
//                                                 <p className="text-foreground text-xs sm:text-sm">
//                                                     <span className="font-medium">Area:</span> {localOrderDetails?.userdetails?.area || ''}
//                                                 </p>
//                                                 <p className="text-foreground font-medium text-xs sm:text-sm">
//                                                     {localOrderDetails?.userdetails?.city || ''} - {localOrderDetails?.userdetails?.pincode || ''}
//                                                 </p>
//                                             </>
//                                         ) : (
//                                             <p className="text-foreground text-xs sm:text-sm">
//                                                 {localOrderDetails?.userdetails?.houseno || 'Not provided'}, {localOrderDetails?.userdetails?.streetname || ''}
//                                                 {localOrderDetails?.userdetails?.area && `, ${localOrderDetails?.userdetails?.area}`}
//                                             </p>
//                                         )}
//                                     </div>
//                                 </motion.div>
//                             </div>
//                         </Card>
//                     </motion.div>

//                     {/* Terms & Conditions */}
//                     <motion.div
//                         initial={{ y: 20, opacity: 0 }}
//                         animate={{ y: 0, opacity: 1 }}
//                         transition={{ delay: 1.3 }}
//                     >
//                         <Card className="p-4 sm:p-6 md:p-8 mb-4 sm:mb-6 border-2 border-secondary/30 rounded-xl sm:rounded-2xl">
//                             <div className="flex items-center justify-between mb-4">
//                                 <div className="flex items-center space-x-3">
//                                     <div className="bg-secondary/20 p-2 rounded-lg">
//                                         <Shield className="w-5 h-5 text-foreground" />
//                                     </div>
//                                     <div>
//                                         <h3 className="font-bold text-foreground">Terms & Conditions</h3>
//                                         <p className="text-xs text-muted-foreground">Please accept to continue</p>
//                                     </div>
//                                 </div>
//                                 <Button
//                                     variant="outline"
//                                     size="sm"
//                                     onClick={() => setShowTerms(true)}
//                                     className="text-xs group"
//                                 >
//                                     View Terms
//                                     <ArrowRight className="w-3 h-3 ml-1 group-hover:translate-x-1 transition-transform" />
//                                 </Button>
//                             </div>

//                             <div className="flex items-center p-3 rounded-lg bg-secondary/20">
//                                 <input
//                                     type="checkbox"
//                                     id="acceptTerms"
//                                     checked={acceptedTerms}
//                                     onChange={(e) => setAcceptedTerms(e.target.checked)}
//                                     className="w-4 h-4 rounded border-2 border-primary text-primary focus:ring-primary"
//                                 />
//                                 <label htmlFor="acceptTerms" className="ml-3 text-foreground cursor-pointer text-sm">
//                                     I accept all terms and conditions
//                                 </label>
//                             </div>
//                         </Card>
//                     </motion.div>

//                     {/* Action Buttons */}
//                     <motion.div
//                         initial={{ y: 20, opacity: 0 }}
//                         animate={{ y: 0, opacity: 1 }}
//                         transition={{ delay: 1.4 }}
//                         className="flex flex-col sm:flex-row gap-3"
//                     >
//                         <Button
//                             variant="outline"
//                             onClick={() => navigate(-1)}
//                             className="flex-1 py-3 text-base border-2 hover:bg-secondary/50"
//                             disabled={isLoading}
//                         >
//                             Back to Edit
//                         </Button>
//                         <Button
//                             onClick={handlePlaceOrder}
//                             disabled={isLoading || !acceptedTerms || (paymentMethod === 'redeemed' && !redemptionDetails && !isCashOnDelivery)}
//                             className={`flex-1 py-3 text-base font-bold ${
//                                 !acceptedTerms || (paymentMethod === 'redeemed' && !redemptionDetails && !isCashOnDelivery)
//                                     ? 'bg-muted text-muted-foreground cursor-not-allowed'
//                                     : 'bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary'
//                             }`}
//                         >
//                             {isLoading ? (
//                                 <span className="flex items-center justify-center">
//                                     <Loader2 className="w-5 h-5 animate-spin mr-2" />
//                                     Processing...
//                                 </span>
//                             ) : (
//                                 <span className="flex items-center justify-center">
//                                     {isCashOnDelivery ? (
//                                         <>
//                                             <BanknoteIcon className="w-5 h-5 mr-2" />
//                                             Place Order (Cash on Delivery)
//                                         </>
//                                     ) : isFullyRedeemed ? (
//                                         <>
//                                             <CheckCircle className="w-5 h-5 mr-2" />
//                                             Place Order (Free - All Items Redeemed)
//                                         </>
//                                     ) : displayAmount > 0 ? (
//                                         <>
//                                             <CreditCard className="w-5 h-5 mr-2" />
//                                             Pay ₹{displayAmount}
//                                         </>
//                                     ) : (
//                                         <>
//                                             <CheckCircle className="w-5 h-5 mr-2" />
//                                             Place Order (Free)
//                                         </>
//                                     )}
//                                 </span>
//                             )}
//                         </Button>
//                     </motion.div>
//                 </motion.div>
//             </div>
//         </motion.div>
//     );
// };

// export default Ordersummary;


import { useContext, useState, useEffect } from 'react';
import { Button } from '../../components/ui/button';
import { Card } from '../../components/ui/card';
import { 
  User, Phone, MapPin, Shirt, ShoppingCart, 
  Clock, CreditCard, BanknoteIcon, Receipt, 
  ShoppingBasketIcon, Truck, CheckCircle, AlertCircle,
  ChevronRight, Info, X, FileText, Tag,
  Gift, Loader2, Shield, Wallet, ArrowRight,
  Sparkles, BadgeCheck, IndianRupee
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

const Ordersummary = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [showTerms, setShowTerms] = useState(false);
    const [acceptedTerms, setAcceptedTerms] = useState(false);
    const [useSubscription, setUseSubscription] = useState(false);
    const [subscription, setSubscription] = useState<Subscription | null>(null);
    const [redemptionDetails, setRedemptionDetails] = useState<RedemptionDetails | null>(null);
    const [paymentMethod, setPaymentMethod] = useState<'full' | 'redeemed'>('full');
    const [showCashWarning, setShowCashWarning] = useState(false);
    
    const steamcontext = useContext(SteamContext);
    const { orderdetails, setorderdetails, User: User1 } = steamcontext;
    const [localOrderDetails, setLocalOrderDetails] = useState<any>(null);
    const [showFullAddress, setShowFullAddress] = useState(false);

    const navigate = useNavigate();

    // Check if payment method is cash on delivery
    const isCashOnDelivery = localOrderDetails?.otherdetails?.paymenttype?.toLowerCase() === 'cash on delivery';

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
        } else {
            toast.error('No order details found. Please start over.');
            navigate('/customer/bookslot');
        }
    }, [navigate, setorderdetails]);

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
                totalamount: String(localOrderDetails?.otherdetails?.totalamount || '0'),
                totalcloths: String(localOrderDetails?.otherdetails?.totalcloths || '0'),
                deliverySpeed: localOrderDetails?.otherdetails?.deliverySpeed || 'normal'
            },
            order_cloths: localOrderDetails?.order_cloths || []
        };

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

    const handleGoToBookSlot = () => {
        navigate('/customer/bookslot');
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
            const amountToPay = paymentMethod === 'redeemed' && redemptionDetails && !isCashOnDelivery
                ? redemptionDetails.payableAmount 
                : Number(apiData.otherdetails.totalamount);

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
                userName: User1?.name
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
    const originalAmount = Number(localOrderDetails?.otherdetails?.totalamount || 0);
    const displayAmount = paymentMethod === 'redeemed' && redemptionDetails && !isCashOnDelivery
        ? redemptionDetails.payableAmount 
        : originalAmount;
    
    const savingsAmount = paymentMethod === 'redeemed' && redemptionDetails && !isCashOnDelivery
        ? originalAmount - redemptionDetails.payableAmount
        : 0;

    const isFullyRedeemed = redemptionDetails?.isFullyRedeemed && paymentMethod === 'redeemed' && !isCashOnDelivery;

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
                                            {/* <Button
                                             onClick={handleGoToBookSlot}
                                                variant="outline"
                                                size="sm"
                                                className="border-yellow-500/30"
                                            >
                                                <Clock className="w-4 h-4 mr-2" />
                                                Change Time Slot
                                            </Button> */}
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
                                                        Pay ₹{originalAmount} without using credits
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
                                                    // Case where payable amount is 0 but there are insufficient items
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
                                    {localOrderDetails.order_cloths.map((item: any, index: number) => {
                                        const isRedeemed = paymentMethod === 'redeemed' && !isCashOnDelivery && 
                                            redemptionDetails?.redeemedItems.some(
                                                ri => ri.name.toLowerCase() === item.item.toLowerCase()
                                            );
                                        
                                        return (
                                            <motion.div
                                                key={index}
                                                initial={{ x: -20, opacity: 0 }}
                                                animate={{ x: 0, opacity: 1 }}
                                                transition={{ delay: 0.7 + index * 0.05 }}
                                                className={`flex justify-between items-start sm:items-center p-3 sm:p-4 rounded-lg sm:rounded-xl transition-colors ${
                                                    isRedeemed ? 'bg-green-500/10 border border-green-500/20' : 'bg-secondary/20 hover:bg-secondary/30'
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
                                                        isRedeemed ? 'text-green-600' : 'text-foreground'
                                                    }`}>
                                                        ₹{Number(item.cost) * Number(item.quantity)}
                                                    </span>
                                                </div>
                                            </motion.div>
                                        );
                                    })}

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
                                        value: localOrderDetails?.otherdetails?.deliverySpeed || 'normal', 
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
                                            <span className="font-medium">₹{originalAmount}</span>
                                        </div>
                                        
                                        {paymentMethod === 'redeemed' && redemptionDetails && redemptionDetails.redeemableCredits > 0 && !isCashOnDelivery && (
                                            <div className="flex justify-between text-sm text-green-600">
                                                <span>Credits redeemed:</span>
                                                <span>- ₹{redemptionDetails.redeemableCredits}</span>
                                            </div>
                                        )}
                                        
                                        <div className="flex justify-between text-base font-bold pt-2 border-t border-primary/20">
                                            <span>Total to pay:</span>
                                            <span className={`${isFullyRedeemed || displayAmount === 0 ? 'text-green-600' : 'text-primary'}`}>
                                                {isFullyRedeemed || displayAmount === 0 ? 'FREE (₹0)' : `₹${displayAmount}`}
                                            </span>
                                        </div>
                                        
                                        {savingsAmount > 0 && !isCashOnDelivery && (
                                            <div className="flex justify-between text-xs text-green-600 bg-green-500/10 p-2 rounded-lg mt-2">
                                                <span>You save:</span>
                                                <span>₹{savingsAmount}</span>
                                            </div>
                                        )}
                                        
                                        {(isFullyRedeemed || displayAmount === 0) && paymentMethod === 'redeemed' && (
                                            <div className="flex justify-between text-xs text-green-600 bg-green-500/10 p-2 rounded-lg mt-2">
                                                <span className="flex items-center">
                                                    <Sparkles className="w-3 h-3 mr-1" />
                                                    Great news!
                                                </span>
                                                <span>All items redeemed with subscription</span>
                                            </div>
                                        )}
                                    </div>
                                </div>
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
                                    ) : isFullyRedeemed || displayAmount === 0 ? (
                                        <>
                                            <CheckCircle className="w-5 h-5 mr-2" />
                                            Place Order (Free - All Items Redeemed)
                                        </>
                                    ) : displayAmount > 0 ? (
                                        <>
                                            <CreditCard className="w-5 h-5 mr-2" />
                                            Pay ₹{displayAmount}
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
                </motion.div>
            </div>
        </motion.div>
    );
};

export default Ordersummary;