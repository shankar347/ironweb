import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Truck, 
  Package, 
  Shield,
  Clock,
  Zap,
  CheckCircle,
  Star,
  Sparkles,
  ArrowRight,
  Crown,
  Award,
  Gift,
  Calculator,
  TrendingUp,
  Loader,
  AlertCircle
} from 'lucide-react';
import PlanCard from '../../components/PlanCard';
import PriceSummary from '../../components/PriceSummary';
import Button from '../../components/ui/Newbutton';
import { initiatePayment } from '../../services/paymentService';
import { toast } from 'react-toastify';
import { SteamContext } from '../../hooks/steamcontext';
import GarmentSelector from '../../components/GarmentSelecter';

const PlansPage = () => {
  const navigate = useNavigate();
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [garments, setGarments] = useState({
    shirt: 0,
    pant: 0,
    top: 0,
    chudidhar: 0
  });
  const [isVisible, setIsVisible] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const { User } = useContext(SteamContext); // Fixed: User instead of user

  useEffect(() => {
    setIsVisible(true);
    console.log("User from context:", User); // Debug log
  }, [User]);

  const plansData = [
    {
      id: 'popular',
      name: 'Popular Plan',
      type: 'popular',
      price: 645,
      credits: 60,
      features: [
        '60 garments per month',
        '1 garment = 1 credit',
        '3 free deliveries monthly',
        'Delivery charges apply after 3 deliveries',
        'Renew when credits reach 0'
      ],
      buttonText: 'Subscribe Now',
      badge: 'POPULAR',
      icon: Crown,
      color: 'from-yellow-500 to-amber-500',
      popular: true,
      pricePerGarment: '₹10.75/garment'
    },
    {
      id: 'normal',
      name: 'Normal Plan',
      type: 'prepaid',
      price: 500,
      credits: 45,
      baseCredits: 45,
      maxGarments: 78,
      features: [
        '45 base garments',
        'Maximum 78 garments',
        'Extra garments at ₹10-₹13',
        '3 free deliveries monthly',
      ],
      buttonText: 'Select Plan',
      icon: Award,
      color: 'from-blue-500 to-sky-500',
      popular: false,
      pricePerGarment: '₹11.11/garment'
    },
    {
      id: 'family',
      name: 'Family Plan',
      type: 'prepaid',
      price: 800,
      credits: 85,
      baseCredits: 85,
      maxGarments: 120,
      features: [
        '85 base garments',
        'Maximum 120 garments',
        'Extra garments at ₹10-₹13',
        '3 free deliveries monthly',
      ],
      buttonText: 'Select Plan',
      icon: Gift,
      color: 'from-purple-500 to-pink-500',
      popular: false,
      pricePerGarment: '₹9.41/garment'
    }
  ];

  const serviceFeatures = [
    {
      icon: Clock,
      title: 'Fast Delivery',
      description: 'Quick and reliable service',
      color: 'from-blue-500 to-sky-400'
    },
    {
      icon: Shield,
      title: 'Quality Guaranteed',
      description: 'Professional handling',
      color: 'from-sky-400 to-blue-600'
    },
    {
      icon: Package,
      title: 'Safe Packing',
      description: 'Neat packaging included',
      color: 'from-blue-600 to-sky-500'
    },
    {
      icon: Truck,
      title: 'Doorstep Service',
      description: 'Pickup and delivery',
      color: 'from-sky-500 to-blue-500'
    }
  ];

  const handlePlanSelect = (planId) => {
    const plan = plansData.find(p => p.id === planId);
    setSelectedPlan(plan);
    
    // Reset garments when switching plans
    setGarments({ shirt: 0, pant: 0, top: 0, chudidhar: 0 });
  };

  const handleGarmentChange = (updatedGarments) => {
    setGarments(updatedGarments);
  };

  // Calculate totals
  const totalGarments = Object.values(garments).reduce((sum, val) => sum + val, 0);
  const remainingCredits = selectedPlan?.type !== 'popular' 
    ? Math.max(0, (selectedPlan?.baseCredits || 0) - totalGarments)
    : 0;
  const extraGarments = selectedPlan?.type !== 'popular'
    ? Math.max(0, totalGarments - (selectedPlan?.baseCredits || 0))
    : 0;

  // Check if within base credits
  const isWithinBaseCredits = selectedPlan?.type !== 'popular' && totalGarments <= (selectedPlan?.baseCredits || 0);

  // Calculate extra charges with correct distribution
  const calculateExtraCharges = () => {
    if (!selectedPlan || selectedPlan.type === 'popular') return 0;

    // If total garments are within base credits, no extra charges
    if (totalGarments <= selectedPlan.baseCredits) return 0;

    // Create an array of garments with their counts and prices
    const garmentItems = [
      { id: 'shirt', count: garments.shirt || 0, price: 10 },
      { id: 'pant', count: garments.pant || 0, price: 10 },
      { id: 'top', count: garments.top || 0, price: 13 },
      { id: 'chudidhar', count: garments.chudidhar || 0, price: 13 }
    ];
    
    // Sort by price (cheapest first) to optimize base credit allocation
    garmentItems.sort((a, b) => a.price - b.price);
    
    let remainingBaseCredits = selectedPlan.baseCredits;
    let totalExtraCharges = 0;
    
    // First, allocate base credits to all garments (cheapest first)
    garmentItems.forEach(garment => {
      const baseAllocated = Math.min(garment.count, remainingBaseCredits);
      remainingBaseCredits -= baseAllocated;
      const extraCount = Math.max(0, garment.count - baseAllocated);
      if (extraCount > 0) {
        totalExtraCharges += extraCount * garment.price;
      }
    });
    
    return totalExtraCharges;
  };

  // Calculate garment breakdown for display
  const calculateGarmentBreakdown = () => {
    if (!selectedPlan || selectedPlan.type === 'popular') return [];

    const garmentItems = [
      { id: 'shirt', label: 'Shirt', count: garments.shirt || 0, price: 10 },
      { id: 'pant', label: 'Pant', count: garments.pant || 0, price: 10 },
      { id: 'top', label: 'Top', count: garments.top || 0, price: 13 },
      { id: 'chudidhar', label: 'Chudidhar', count: garments.chudidhar || 0, price: 13 }
    ];
    
    // Sort by price (cheapest first)
    garmentItems.sort((a, b) => a.price - b.price);
    
    let remainingBaseCredits = selectedPlan.baseCredits;
    const breakdown = [];
    
    garmentItems.forEach(garment => {
      if (garment.count > 0) {
        const baseAllocated = Math.min(garment.count, remainingBaseCredits);
        remainingBaseCredits -= baseAllocated;
        const extraCount = Math.max(0, garment.count - baseAllocated);
        const extraCost = extraCount * garment.price;
        
        breakdown.push({
          ...garment,
          baseAllocated,
          extraCount,
          extraCost
        });
      }
    });
    
    return breakdown;
  };

  const extraCharges = calculateExtraCharges();
  const garmentBreakdown = calculateGarmentBreakdown();
  
  const getTotalAmount = () => {
    if (!selectedPlan) return 0;
    
    if (selectedPlan.type === 'popular') {
      return selectedPlan.price;
    } else {
      return (selectedPlan.price || 0) + extraCharges;
    }
  };

  // Prepare subscription payload for backend
  const prepareSubscriptionPayload = () => {
    if (!selectedPlan) return null;

    // Prepare cloths array in required structure
    const cloths = Object.entries(garments)
      .filter(([_, count]) => count > 0)
      .map(([id, count]) => {
        const garmentMap = {
          shirt: 'Shirt',
          pant: 'Pant',
          top: 'Top',
          chudidhar: 'Chudidhar'
        };
        return {
          name: garmentMap[id],
          count: count
        };
      });

    return {
      plan: selectedPlan.name,
      credits: selectedPlan.credits || totalGarments,
      totalamount: getTotalAmount(),
      cloths: cloths,
      metadata: {
        planId: selectedPlan.id,
        planType: selectedPlan.type,
        baseCredits: selectedPlan.baseCredits || 0,
        extraGarments: extraGarments,
        extraCharges: extraCharges,
        totalGarments: totalGarments
      }
    };
  };

  const handlePayment = async () => {
    if (!selectedPlan) {
      toast.error('Please select a plan');
      return;
    }

    // Check if user is logged in
    if (!User || !User._id) {
      toast.error('Please login to continue');
      navigate('/login', { state: { from: '/plans' } });
      return;
    }

    // For normal and family plans, check if garments are selected
    if (selectedPlan.type !== 'popular') {
      if (totalGarments === 0) {
        toast.error('Please select at least one garment');
        return;
      }
      
      // Check if within max limit
      if (totalGarments > selectedPlan.maxGarments) {
        toast.error(`Maximum limit is ${selectedPlan.maxGarments} garments`);
        return;
      }
    }

    setIsProcessing(true);

    try {
      const payload = prepareSubscriptionPayload();
      
      if (!payload) {
        throw new Error('Failed to prepare subscription data');
      }

      console.log("Payment payload:", payload); // Debug log

      // Store subscription data in localStorage as backup
      localStorage.setItem('pendingSubscription', JSON.stringify(payload));

      // Initialize payment with Razorpay
      const result = await initiatePayment({
        ...payload,
        userId: User._id, // Fixed: Use User._id
        userEmail: User.email,
        userPhone: User.phoneno // Fixed: phoneno instead of phone
      });

      if (result.success) {
        // Clear pending subscription
        localStorage.removeItem('pendingSubscription');
        
        // Navigate to success page or show success message
        toast.success('Payment successful! Subscription activated.');
        navigate('/customer/subscription-success', { 
          state: { 
            subscription: result.subscription,
            orderId: result.orderId 
          } 
        });
      } else {
        toast.error(result.message || 'Payment failed');
      }
    } catch (error) {
      console.error('Payment error:', error);
      toast.error(error.message || 'Failed to process payment');
    } finally {
      setIsProcessing(false);
    }
  };

  // Determine if confirm button should be enabled
  const isConfirmDisabled = () => {
    if (!selectedPlan) return true;
    if (!User || !User._id) return true;
    if (isProcessing) return true;
    
    if (selectedPlan.type === 'popular') {
      return false; // Popular plan always enabled when selected
    } else {
      // For normal and family plans, require at least one garment
      return totalGarments === 0;
    }
  };

  // Get button text
  const getButtonText = () => {
    if (!selectedPlan) return "Select a Plan";
    if (!User || !User._id) return "Login to Continue";
    if (selectedPlan.type === 'popular') return `Pay ₹${selectedPlan.price} & Subscribe`;
    if (totalGarments === 0) return "Select Garments First";
    return `Pay ₹${getTotalAmount()} & Confirm`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-sky-50 overflow-hidden">
      {/* Loading Overlay */}
      {isProcessing && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center">
          <div className="bg-white rounded-2xl p-8 shadow-2xl flex flex-col items-center">
            <Loader className="w-12 h-12 text-blue-600 animate-spin mb-4" />
            <p className="text-lg font-semibold text-slate-900">Processing Payment...</p>
            <p className="text-sm text-slate-600 mt-2">Please don't close this window</p>
          </div>
        </div>
      )}

      {/* Animated Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-48 sm:w-72 h-48 sm:h-72 bg-gradient-to-br from-blue-300/30 to-blue-500/30 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-pulse"></div>
        <div className="absolute top-40 right-10 w-64 sm:w-96 h-64 sm:h-96 bg-gradient-to-br from-sky-300/30 to-sky-500/30 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-pulse" style={{ animationDelay: '1s' }}></div>
        <div className="absolute -bottom-20 left-1/2 w-64 sm:w-96 h-64 sm:h-96 bg-gradient-to-br from-blue-400/30 to-sky-400/30 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-pulse" style={{ animationDelay: '2s' }}></div>
        
        {/* Grid Pattern */}
        <div className="absolute inset-0" style={{
          backgroundImage: `radial-gradient(circle at 1px 1px, rgba(59, 130, 246, 0.02) 1px, transparent 0)`,
          backgroundSize: '40px 40px'
        }}></div>
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 relative z-10">
        {/* Header */}
        <div className={`text-center mb-12 sm:mb-16 transition-all duration-1000 transform ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
          <div className="inline-flex items-center justify-center mb-3">
            <Sparkles className="w-6 h-6 text-yellow-500 mr-2 animate-pulse" />
            <span className="px-4 py-2 bg-gradient-to-r from-blue-500 to-sky-500 text-white text-sm font-bold rounded-full shadow-lg">
              Smart Plans for Smart People
            </span>
            <Sparkles className="w-6 h-6 text-yellow-500 ml-2 animate-pulse" />
          </div>
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold 
            bg-gradient-to-r from-blue-600 via-blue-700 to-sky-600 bg-clip-text text-transparent mb-6
            drop-shadow-lg">
            Choose Your Perfect Plan
          </h1>
          <p className="text-lg sm:text-xl text-slate-600 max-w-3xl mx-auto leading-relaxed">
            Select the perfect subscription that matches your lifestyle and budget
          </p>
        </div>

        {/* Service Features */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-6 mb-12 sm:mb-16">
          {serviceFeatures.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <div
                key={index}
                className={`relative group transition-all duration-700 transform ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-20 opacity-0'}`}
                style={{ transitionDelay: `${index * 200}ms` }}
              >
                <div className="relative bg-white/95 backdrop-blur-sm rounded-2xl p-5 text-center 
                  shadow-xl hover:shadow-2xl transition-all duration-500 
                  border border-white/80 hover:border-blue-200
                  hover:-translate-y-1">
                  
                  <div className="absolute inset-0 rounded-2xl bg-gradient-to-br opacity-0 group-hover:opacity-100 transition-opacity duration-500 from-blue-500/5 via-transparent to-sky-500/5"></div>
                  
                  <div className={`relative w-14 h-14 mx-auto mb-4 rounded-2xl bg-gradient-to-br ${feature.color} p-0.5 shadow-lg group-hover:shadow-xl transition-all duration-500 group-hover:scale-110`}>
                    <div className="w-full h-full bg-white rounded-2xl flex items-center justify-center">
                      <Icon className="w-7 h-7" style={{
                        background: `linear-gradient(135deg, ${feature.color.split(' ')[0].replace('from-', '')}, ${feature.color.split(' ')[1].replace('to-', '')})`,
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent'
                      }} />
                    </div>
                  </div>
                  <h3 className="font-bold text-slate-900 text-base mb-1">{feature.title}</h3>
                  <p className="text-sm text-slate-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300">{feature.description}</p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Plan Cards */}
        <div className="mb-12 sm:mb-16">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 sm:gap-10 max-w-7xl mx-auto">
            {plansData.map((plan, index) => (
              <div
                key={plan.id}
                className={`relative transition-all duration-700 transform ${isVisible ? 'translate-y-0 opacity-100 scale-100' : 'translate-y-20 opacity-0 scale-95'}`}
                style={{ transitionDelay: `${index * 300}ms` }}
              >
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 z-20">
                    <div className="flex items-center px-6 py-3 bg-gradient-to-r 
                      from-blue-500 via-blue-600 to-sky-500 animate-pulse
                      text-white font-bold rounded-full shadow-lg shadow-blue-500/30">
                      <Star className="w-5 h-5 mr-2 fill-current" />
                      {plan.badge}
                      <Star className="w-5 h-5 ml-2 fill-current" />
                    </div>
                  </div>
                )}

                <div className={`relative h-full ${plan.popular ? 'pt-10' : 'pt-8'}`}>
                  <PlanCard
                    plan={plan}
                    isSelected={selectedPlan?.id === plan.id}
                    onSelect={handlePlanSelect}
                    isPopular={plan.popular}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Garment Selection & Price Summary */}
        {selectedPlan && selectedPlan.type !== 'popular' && (
          <div className={`grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 mb-12 sm:mb-16 transition-all duration-700 transform ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-20 opacity-0'}`}>
            <div className="relative">
              <GarmentSelector
                garments={garments}
                onGarmentsChange={handleGarmentChange}
                baseCredits={selectedPlan.baseCredits}
                maxLimit={selectedPlan.maxGarments}
                selectedPlan={selectedPlan.name}
                planPrice={selectedPlan.price}
                totalGarments={totalGarments}
                remainingCredits={remainingCredits}
                extraGarments={extraGarments}
                extraCharges={extraCharges}
                totalAmount={getTotalAmount()}
              />
            </div>
            <div className="relative">
              <PriceSummary
                selectedPlan={selectedPlan}
                garments={garments}
                garmentBreakdown={garmentBreakdown}
                extraCharges={extraCharges}
                totalAmount={getTotalAmount()}
                planPrice={selectedPlan.price}
                totalGarments={totalGarments}
                remainingCredits={remainingCredits}
                extraGarments={extraGarments}
              />
            </div>
          </div>
        )}

        {/* Popular Plan Summary */}
        {selectedPlan && selectedPlan.type === 'popular' && (
          <div className={`mb-12 sm:mb-16 transition-all duration-700 transform ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-20 opacity-0'}`}>
            <div className="max-w-2xl mx-auto">
              <PriceSummary
                selectedPlan={selectedPlan}
                garments={garments}
                garmentBreakdown={[]}
                extraCharges={0}
                totalAmount={getTotalAmount()}
                planPrice={selectedPlan.price}
                totalGarments={totalGarments}
                remainingCredits={0}
                extraGarments={0}
              />
            </div>
          </div>
        )}

        {/* Within Base Credits Message */}
        {selectedPlan && selectedPlan.type !== 'popular' && isWithinBaseCredits && totalGarments > 0 && (
          <div className={`mb-6 transition-all duration-700 transform ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-20 opacity-0'}`}>
            <div className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-xl p-4 max-w-2xl mx-auto">
              <div className="flex items-center">
                <CheckCircle className="w-5 h-5 text-green-600 mr-3 flex-shrink-0" />
                <p className="text-green-800 text-sm">
                  <strong className="text-green-600">Great!</strong> You're within your base credits. 
                  No extra charges for these {totalGarments} garments!
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Delivery Info */}
        <div className={`relative mb-12 sm:mb-16 transition-all duration-700 transform ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-20 opacity-0'}`}>
          <div className="bg-gradient-to-r from-blue-50/90 to-sky-100/90 backdrop-blur-sm rounded-3xl p-6 sm:p-8 
            border border-white/70 shadow-xl">
            <div className="flex items-center mb-6">
              <div className="relative">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-500 to-sky-500 p-0.5 shadow-lg">
                  <div className="w-full h-full bg-white rounded-2xl flex items-center justify-center">
                    <Truck className="w-6 h-6 text-blue-600" />
                  </div>
                </div>
              </div>
              <div className="ml-4">
                <h3 className="text-2xl font-bold text-slate-900">Delivery Information</h3>
                <p className="text-slate-600">How our delivery system works</p>
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="relative bg-white/95 backdrop-blur-sm rounded-2xl p-5 border border-blue-100/60 
                shadow-md hover:shadow-xl transition-all duration-500 hover:-translate-y-1 group">
                <div className="flex items-center mb-4">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-green-500 to-emerald-500 p-0.5 mr-3">
                    <div className="w-full h-full bg-white rounded-xl flex items-center justify-center">
                      <Package className="w-5 h-5 text-green-600" />
                    </div>
                  </div>
                  <span className="font-bold text-slate-900 text-lg">Free Deliveries</span>
                </div>
                <p className="text-slate-700 pl-13">3 free deliveries per month for all plans</p>
                <div className="absolute bottom-0 left-0 h-1 bg-gradient-to-r from-green-500 to-emerald-500 w-0 group-hover:w-full transition-all duration-500 rounded-full"></div>
              </div>
              <div className="relative bg-white/95 backdrop-blur-sm rounded-2xl p-5 border border-blue-100/60 
                shadow-md hover:shadow-xl transition-all duration-500 hover:-translate-y-1 group">
                <div className="flex items-center mb-4">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500 to-orange-500 p-0.5 mr-3">
                    <div className="w-full h-full bg-white rounded-xl flex items-center justify-center">
                      <Shield className="w-5 h-5 text-amber-600" />
                    </div>
                  </div>
                  <span className="font-bold text-slate-900 text-lg">After Free Deliveries</span>
                </div>
                <p className="text-slate-700 pl-13">Delivery charges apply after 3 free deliveries</p>
                <div className="absolute bottom-0 left-0 h-1 bg-gradient-to-r from-amber-500 to-orange-500 w-0 group-hover:w-full transition-all duration-500 rounded-full"></div>
              </div>
            </div>
          </div>
        </div>

        {/* Payment Button */}
        <div className={`relative text-center transition-all duration-700 transform ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-20 opacity-0'}`}>
          <Button
            onClick={handlePayment}
            disabled={isConfirmDisabled()}
            className={`relative px-12 sm:px-16 py-5 text-lg sm:text-xl rounded-2xl shadow-2xl
              ${isConfirmDisabled() ? 'opacity-50 cursor-not-allowed' : 'hover:shadow-3xl hover:scale-105'}
              transition-all duration-500 font-bold overflow-hidden group`}
          >
            <div className={`absolute inset-0 bg-gradient-to-r ${selectedPlan?.id === 'popular' ? 'from-yellow-500 to-amber-500' : 'from-blue-600 to-sky-600'} opacity-0 group-hover:opacity-20 transition-opacity duration-500`}></div>
            
            <span className="relative flex items-center justify-center">
              {isProcessing ? (
                <>
                  <Loader className="w-7 h-7 mr-3 animate-spin" />
                  Processing...
                </>
              ) : (
                <>
                  {selectedPlan?.type === 'popular' ? (
                    <Zap className="w-7 h-7 mr-3" />
                  ) : (
                    <Calculator className="w-7 h-7 mr-3" />
                  )}
                  {getButtonText()}
                  {!isConfirmDisabled() && <ArrowRight className="w-5 h-5 ml-3 transform group-hover:translate-x-2 transition-transform duration-300" />}
                </>
              )}
            </span>
          </Button>
          
          {/* Status Messages */}
          {!selectedPlan && (
            <p className="text-slate-600 mt-6 text-lg">
              Please select a plan to continue
            </p>
          )}
          
          {selectedPlan && selectedPlan.type !== 'popular' && totalGarments === 0 && (
            <div className="mt-6">
              <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 max-w-md mx-auto">
                <div className="flex items-center">
                  <AlertCircle className="w-5 h-5 text-amber-600 mr-3 flex-shrink-0" />
                  <p className="text-amber-800 text-sm">
                    Please select at least one garment to proceed with payment
                  </p>
                </div>
              </div>
            </div>
          )}
          
          {!User && (
            <p className="text-amber-600 mt-4 text-sm">
              Please login to continue with payment
            </p>
          )}
          
          {/* Help Text */}
          <div className="mt-8 bg-gradient-to-r from-blue-50/80 to-sky-50/80 backdrop-blur-sm rounded-2xl p-6 max-w-2xl mx-auto border border-white/60">
            <div className="flex items-center justify-center mb-3">
              <TrendingUp className="w-5 h-5 text-blue-600 mr-2" />
              <p className="text-slate-700 text-center font-medium">
                <strong className="text-blue-600">Secure Payment:</strong> You'll be redirected to Razorpay for secure payment processing
              </p>
            </div>
            <p className="text-sm text-slate-600 text-center mt-2">
              Your subscription will be activated immediately after successful payment
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PlansPage;