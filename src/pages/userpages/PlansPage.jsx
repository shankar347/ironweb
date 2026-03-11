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
  AlertCircle,
  Users,
  Gem,
  Heart
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
    cottonShirt: 0,
    shawl: 0,
    tShirt: 0,
    jeansPant: 0,
    ladiesTop: 0,
    ladiesPant: 0,
    normalSaree: 0,
    silkSaree: 0,
    chudidhar: 0
  });
  const [isVisible, setIsVisible] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const { User } = useContext(SteamContext);

  useEffect(() => {
    setIsVisible(true);
    
    // Auto-select popular plan and set fixed garments
    const popularPlan = plansData.find(p => p.id === 'popular');
    setSelectedPlan(popularPlan);
    setGarments({
      shirt: 15,
      pant: 15,
      ladiesTop: 15,
      chudidhar: 15,
      cottonShirt: 0,
      shawl: 0,
      tShirt: 0,
      jeansPant: 0,
      ladiesPant: 0,
      normalSaree: 0,
      silkSaree: 0
    });
  }, []);

  const plansData = [
    {
      id: 'popular',
      name: 'POPULAR PLAN',
      type: 'popular',
      price: 645,
      credits: 60,
      features: [
        '60 garments per month (Fixed Set)',
        '15 Shirts + 15 Pants',
        '15 Ladies Tops + 15 Chudidhars',
        '3 free deliveries monthly',
        'Delivery charges apply after 3 deliveries',
        'Automatic unit deduction',
        'Easy renewal when units reach 0'
      ],
      buttonText: 'Subscribe Now',
      badge: '⭐ POPULAR',
      icon: Crown,
      color: 'from-yellow-500 to-amber-500',
      popular: true,
      pricePerGarment: '₹10.75/garment',
      availableItems: [
        { name: 'Shirt', price: 10, count: 15 },
        { name: 'Pant', price: 10, count: 15 },
        { name: 'Ladies Top', price: 13, count: 15 },
        { name: 'Chudidhar', price: 15, count: 15 }
      ]
    },
    {
      id: 'family',
      name: 'FAMILY PLAN',
      type: 'prepaid',
      price: 800,
      credits: 80,
      baseCredits: 80,
      maxGarments: 120,
      features: [
        '80 garments per month',
        'Flexible garment selection',
        'Custom item selection available',
        '3 free deliveries monthly',
        'Delivery charges apply after 3 deliveries',
        'Automatic unit deduction',
        'Easy renewal when units reach 0'
      ],
      buttonText: 'Select Plan',
      icon: Users,
      color: 'from-purple-500 to-pink-500',
      popular: false,
      pricePerGarment: '₹10.00/garment',
      availableItems: [
        { name: 'Shirt', price: 10 },
        { name: 'Pant', price: 10 },
        { name: 'Cotton Shirt', price: 20 },
        { name: 'Shawl', price: 10 },
        { name: 'T Shirt', price: 12 },
        { name: 'Jeans Pant', price: 15 },
        { name: 'Ladies Top', price: 13 },
        { name: 'Ladies Pant', price: 10 },
        { name: 'Normal Saree', price: 39 },
        { name: 'Silk Saree', price: 59 },
        { name: 'Chudidhar', price: 15 }
      ]
    },
    {
      id: 'normal',
      name: 'NORMAL PLAN',
      type: 'prepaid',
      price: 500,
      credits: 45,
      baseCredits: 45,
      maxGarments: 78,
      features: [
        '45 garments per month',
        'Flexible garment selection',
        '3 free deliveries monthly',
        'Delivery charges apply after 3 deliveries',
        'Automatic unit deduction',
        'Easy renewal when units reach 0'
      ],
      buttonText: 'Select Plan',
      icon: Gem,
      color: 'from-blue-500 to-sky-500',
      popular: false,
      pricePerGarment: '₹11.11/garment',
      availableItems: [
        { name: 'Shirt', price: 10 },
        { name: 'Pant', price: 10 },
        { name: 'Cotton Shirt', price: 20 },
        { name: 'Shawl', price: 10 },
        { name: 'T Shirt', price: 12 },
        { name: 'Jeans Pant', price: 15 },
        { name: 'Ladies Top', price: 13 },
        { name: 'Ladies Pant', price: 10 },
        { name: 'Normal Saree', price: 39 },
        { name: 'Silk Saree', price: 59 },
        { name: 'Chudidhar', price: 15 }
      ]
    }
  ];

  // Service Features with fixed heights for mobile
  const serviceFeatures = [
    {
      icon: Clock,
      title: 'Fast Delivery',
      description: 'Quick and reliable service within 24-48 hours',
      color: 'from-blue-500 to-sky-400'
    },
    {
      icon: Shield,
      title: 'Quality Guaranteed',
      description: 'Professional handling and premium quality assurance',
      color: 'from-sky-400 to-blue-600'
    },
    {
      icon: Heart,
      title: 'Personal Handling',
      description: 'Each garment handled with care and attention',
      color: 'from-blue-600 to-sky-500'
    },
    {
      icon: Users,
      title: 'Expert Service',
      description: 'Experienced professionals at your service',
      color: 'from-sky-500 to-blue-500'
    }
  ];

  const handlePlanSelect = (planId) => {
    const plan = plansData.find(p => p.id === planId);
    setSelectedPlan(plan);
    
    if (planId === 'popular') {
      // Fixed set for popular plan
      setGarments({
        shirt: 15,
        pant: 15,
        ladiesTop: 15,
        chudidhar: 15,
        cottonShirt: 0,
        shawl: 0,
        tShirt: 0,
        jeansPant: 0,
        ladiesPant: 0,
        normalSaree: 0,
        silkSaree: 0
      });
    } else {
      // Reset for other plans
      setGarments({
        shirt: 0,
        pant: 0,
        cottonShirt: 0,
        shawl: 0,
        tShirt: 0,
        jeansPant: 0,
        ladiesTop: 0,
        ladiesPant: 0,
        normalSaree: 0,
        silkSaree: 0,
        chudidhar: 0
      });
    }
  };

  const handleGarmentChange = (updatedGarments) => {
    // For popular plan, don't allow changes
    if (selectedPlan?.id === 'popular') {
      toast.info('Popular plan has a fixed garment set of 15 each');
      return;
    }
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

  // Calculate extra charges with garment prices
  const calculateExtraCharges = () => {
    if (!selectedPlan || selectedPlan.type === 'popular') return 0;

    if (totalGarments <= selectedPlan.baseCredits) return 0;

    // Garment prices mapping
    const garmentPrices = {
      shirt: 10,
      pant: 10,
      cottonShirt: 20,
      shawl: 10,
      tShirt: 12,
      jeansPant: 15,
      ladiesTop: 13,
      ladiesPant: 10,
      normalSaree: 39,
      silkSaree: 59,
      chudidhar: 15
    };

    // Create array of garments with counts and prices
    const garmentItems = Object.entries(garments)
      .filter(([_, count]) => count > 0)
      .map(([id, count]) => ({
        id,
        count,
        price: garmentPrices[id]
      }));
    
    // Sort by price (cheapest first) to optimize base credit allocation
    garmentItems.sort((a, b) => a.price - b.price);
    
    let remainingBaseCredits = selectedPlan.baseCredits;
    let totalExtraCharges = 0;
    
    // Allocate base credits to cheapest garments first
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

    const garmentPrices = {
      shirt: 10,
      pant: 10,
      cottonShirt: 20,
      shawl: 10,
      tShirt: 12,
      jeansPant: 15,
      ladiesTop: 13,
      ladiesPant: 10,
      normalSaree: 39,
      silkSaree: 59,
      chudidhar: 15
    };

    const garmentLabels = {
      shirt: 'Shirt',
      pant: 'Pant',
      cottonShirt: 'Cotton Shirt',
      shawl: 'Shawl',
      tShirt: 'T Shirt',
      jeansPant: 'Jeans Pant',
      ladiesTop: 'Ladies Top',
      ladiesPant: 'Ladies Pant',
      normalSaree: 'Normal Saree',
      silkSaree: 'Silk Saree',
      chudidhar: 'Chudidhar'
    };

    const garmentItems = Object.entries(garments)
      .filter(([_, count]) => count > 0)
      .map(([id, count]) => ({
        id,
        label: garmentLabels[id],
        count,
        price: garmentPrices[id]
      }));
    
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

  // Prepare subscription payload
  const prepareSubscriptionPayload = () => {
    if (!selectedPlan) return null;

    const garmentLabels = {
      shirt: 'Shirt',
      pant: 'Pant',
      cottonShirt: 'Cotton Shirt',
      shawl: 'Shawl',
      tShirt: 'T Shirt',
      jeansPant: 'Jeans Pant',
      ladiesTop: 'Ladies Top',
      ladiesPant: 'Ladies Pant',
      normalSaree: 'Normal Saree',
      silkSaree: 'Silk Saree',
      chudidhar: 'Chudidhar'
    };

    const cloths = Object.entries(garments)
      .filter(([_, count]) => count > 0)
      .map(([id, count]) => ({
        name: garmentLabels[id],
        count: count
      }));

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

    if (!User || !User._id) {
      toast.error('Please login to continue');
      navigate('/login', { state: { from: '/plans' } });
      return;
    }

    if (selectedPlan.type !== 'popular') {
      if (totalGarments === 0) {
        toast.error('Please select at least one garment');
        return;
      }
      
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

      console.log("Payment payload:", payload);

      localStorage.setItem('pendingSubscription', JSON.stringify(payload));

      const result = await initiatePayment({
        ...payload,
        userId: User._id,
        userEmail: User.email,
        userPhone: User.phoneno
      });

      if (result.success) {
        localStorage.removeItem('pendingSubscription');
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

  const isConfirmDisabled = () => {
    if (!selectedPlan) return true;
    if (!User || !User._id) return true;
    if (isProcessing) return true;
    
    if (selectedPlan.type === 'popular') {
      return false;
    } else {
      return totalGarments === 0;
    }
  };

  const getButtonText = () => {
    if (!selectedPlan) return "Select a Plan";
    if (!User || !User._id) return "Login to Continue";
    if (selectedPlan.type === 'popular') return `Pay ₹${selectedPlan.price} & Subscribe`;
    if (totalGarments === 0) return "Select Garments First";
    return `Pay ₹${getTotalAmount()} & Confirm`;
  };

  // Popular plan summary for display
  const popularPlanSummary = () => {
    if (selectedPlan?.id !== 'popular') return null;
    
    return (
      <div className="bg-gradient-to-r from-blue-50 to-sky-50 rounded-xl p-4 sm:p-6 mb-6">
        <h4 className="text-lg font-bold text-slate-900 mb-4">Fixed Garment Set (15 Each)</h4>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="text-center p-3 bg-white rounded-lg shadow-sm">
            <span className="block text-sm text-slate-600">Shirts</span>
            <span className="block text-2xl font-bold text-blue-600">15</span>
            <span className="text-xs text-slate-500">₹10 each</span>
          </div>
          <div className="text-center p-3 bg-white rounded-lg shadow-sm">
            <span className="block text-sm text-slate-600">Pants</span>
            <span className="block text-2xl font-bold text-blue-600">15</span>
            <span className="text-xs text-slate-500">₹10 each</span>
          </div>
          <div className="text-center p-3 bg-white rounded-lg shadow-sm">
            <span className="block text-sm text-slate-600">Ladies Tops</span>
            <span className="block text-2xl font-bold text-blue-600">15</span>
            <span className="text-xs text-slate-500">₹13 each</span>
          </div>
          <div className="text-center p-3 bg-white rounded-lg shadow-sm">
            <span className="block text-sm text-slate-600">Chudidhars</span>
            <span className="block text-2xl font-bold text-blue-600">15</span>
            <span className="text-xs text-slate-500">₹15 each</span>
          </div>
        </div>
        <p className="text-center text-sm text-slate-600 mt-4">
          Total Value: ₹{(15*10 + 15*10 + 15*13 + 15*15)} | You Pay: ₹645 (Save ₹{(15*10 + 15*10 + 15*13 + 15*15) - 645})
        </p>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-sky-50 overflow-hidden">
      {/* Loading Overlay */}
      {isProcessing && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center">
          <div className="bg-white rounded-2xl p-6 sm:p-8 shadow-2xl flex flex-col items-center mx-4">
            <Loader className="w-10 h-10 sm:w-12 sm:h-12 text-blue-600 animate-spin mb-4" />
            <p className="text-base sm:text-lg font-semibold text-slate-900">Processing Payment...</p>
            <p className="text-xs sm:text-sm text-slate-600 mt-2 text-center">Please don't close this window</p>
          </div>
        </div>
      )}

      {/* Animated Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-48 sm:w-72 h-48 sm:h-72 bg-gradient-to-br from-blue-300/30 to-blue-500/30 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-pulse"></div>
        <div className="absolute top-40 right-10 w-64 sm:w-96 h-64 sm:h-96 bg-gradient-to-br from-sky-300/30 to-sky-500/30 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-pulse" style={{ animationDelay: '1s' }}></div>
        <div className="absolute -bottom-20 left-1/2 w-64 sm:w-96 h-64 sm:h-96 bg-gradient-to-br from-blue-400/30 to-sky-400/30 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-pulse" style={{ animationDelay: '2s' }}></div>
        
        <div className="absolute inset-0" style={{
          backgroundImage: `radial-gradient(circle at 1px 1px, rgba(59, 130, 246, 0.02) 1px, transparent 0)`,
          backgroundSize: '40px 40px'
        }}></div>
      </div>

      <div className="container mx-auto px-3 sm:px-4 lg:px-6 py-6 sm:py-8 lg:py-12 relative z-10">
        {/* Header */}
        <div className={`text-center mb-8 sm:mb-12 lg:mb-16 transition-all duration-1000 transform ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
          <div className="inline-flex items-center justify-center mb-2 sm:mb-3">
            <Sparkles className="w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6 text-yellow-500 mr-1 sm:mr-2 animate-pulse" />
            <span className="px-3 sm:px-4 py-1.5 sm:py-2 bg-gradient-to-r from-blue-600 to-sky-600 text-white text-xs sm:text-sm font-bold rounded-full shadow-lg">
              Smart Plans for Smart People
            </span>
            <Sparkles className="w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6 text-yellow-500 ml-1 sm:ml-2 animate-pulse" />
          </div>
          <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold 
            bg-gradient-to-r from-blue-600 via-blue-700 to-sky-600 bg-clip-text text-transparent mb-3 sm:mb-4 lg:mb-6
            drop-shadow-lg px-2">
            Choose Your Perfect Plan
          </h1>
          <p className="text-sm sm:text-base lg:text-lg xl:text-xl text-slate-600 max-w-3xl mx-auto leading-relaxed px-4">
            Select the perfect subscription that matches your lifestyle and budget
          </p>
        </div>

        {/* Service Features - Fixed heights for mobile */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-6 mb-8 sm:mb-12 lg:mb-16">
          {serviceFeatures.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <div
                key={index}
                className={`relative group transition-all duration-700 transform ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-20 opacity-0'}`}
                style={{ transitionDelay: `${index * 200}ms` }}
              >
                <div className="relative bg-white rounded-xl sm:rounded-2xl p-3 sm:p-4 lg:p-5 text-center 
                  shadow-lg hover:shadow-xl transition-all duration-500 
                  border border-slate-200 hover:border-blue-300
                  hover:-translate-y-1 h-full flex flex-col items-center justify-center
                  min-h-[120px] sm:min-h-[140px] lg:min-h-[160px]">
                  
                  <div className="absolute inset-0 rounded-xl sm:rounded-2xl bg-gradient-to-br opacity-0 group-hover:opacity-100 transition-opacity duration-500 from-blue-50 to-sky-50"></div>
                  
                  <div className={`relative w-10 h-10 sm:w-12 sm:h-12 lg:w-14 lg:h-14 mx-auto mb-2 sm:mb-3 lg:mb-4 rounded-xl sm:rounded-2xl bg-gradient-to-br ${feature.color} p-0.5 shadow-md group-hover:shadow-xl transition-all duration-500 group-hover:scale-110 z-10`}>
                    <div className="w-full h-full bg-white rounded-xl sm:rounded-2xl flex items-center justify-center">
                      <Icon className="w-5 h-5 sm:w-6 sm:h-6 lg:w-7 lg:h-7 text-blue-600" />
                    </div>
                  </div>
                  <h3 className="font-bold text-slate-900 text-xs sm:text-sm lg:text-base mb-1 z-10">{feature.title}</h3>
                  <p className="text-[10px] sm:text-xs lg:text-sm text-slate-600 group-hover:text-slate-700 transition-colors duration-300 line-clamp-2 z-10">
                    {feature.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Plan Cards */}
        <div className="mb-8 sm:mb-12 lg:mb-16">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6 lg:gap-8 max-w-7xl mx-auto">
            {plansData.map((plan, index) => (
              <div
                key={plan.id}
                className={`relative transition-all duration-700 transform ${isVisible ? 'translate-y-0 opacity-100 scale-100' : 'translate-y-20 opacity-0 scale-95'}`}
                style={{ transitionDelay: `${index * 300}ms` }}
              >
                {plan.popular && (
                  <div className="absolute -top-3 sm:-top-4 left-1/2 transform -translate-x-1/2 z-20">
                    <div className="flex items-center px-3 sm:px-4 lg:px-6 py-1.5 sm:py-2 lg:py-3 bg-gradient-to-r 
                      from-blue-600 to-sky-600
                      text-white font-bold rounded-full shadow-lg shadow-blue-500/30 text-xs sm:text-sm">
                      <Star className="w-3 h-3 sm:w-4 sm:h-4 lg:w-5 lg:h-5 mr-1 sm:mr-2 fill-current text-white" />
                      {plan.badge}
                      <Star className="w-3 h-3 sm:w-4 sm:h-4 lg:w-5 lg:h-5 ml-1 sm:ml-2 fill-current text-white" />
                    </div>
                  </div>
                )}

                <div className={`relative h-full ${plan.popular ? 'pt-8 sm:pt-10' : 'pt-6 sm:pt-8'}`}>
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

        {/* Popular Plan Fixed Set Summary */}
        {selectedPlan && selectedPlan.id === 'popular' && (
          <div className={`mb-6 sm:mb-8 transition-all duration-700 transform ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-20 opacity-0'}`}>
            {popularPlanSummary()}
          </div>
        )}

        {/* Garment Selection & Price Summary - Only for non-popular plans */}
        {selectedPlan && selectedPlan.type !== 'popular' && (
          <div className={`grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 lg:gap-8 mb-8 sm:mb-12 lg:mb-16 transition-all duration-700 transform ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-20 opacity-0'}`}>
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
          <div className={`mb-8 sm:mb-12 lg:mb-16 transition-all duration-700 transform ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-20 opacity-0'}`}>
            <div className="max-w-2xl mx-auto px-4">
              <PriceSummary
                selectedPlan={selectedPlan}
                garments={garments}
                garmentBreakdown={[]}
                extraCharges={0}
                totalAmount={getTotalAmount()}
                planPrice={selectedPlan.price}
                totalGarments={60}
                remainingCredits={0}
                extraGarments={0}
              />
            </div>
          </div>
        )}

        {/* Within Base Credits Message - Only for non-popular plans */}
        {selectedPlan && selectedPlan.type !== 'popular' && isWithinBaseCredits && totalGarments > 0 && (
          <div className={`mb-4 sm:mb-6 transition-all duration-700 transform ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-20 opacity-0'}`}>
            <div className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-xl p-3 sm:p-4 max-w-2xl mx-auto">
              <div className="flex items-center">
                <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 text-green-600 mr-2 sm:mr-3 flex-shrink-0" />
                <p className="text-green-800 text-xs sm:text-sm">
                  <strong className="text-green-600">Great!</strong> You're within your base credits. 
                  No extra charges for these {totalGarments} garments!
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Delivery Info */}
        <div className={`relative mb-8 sm:mb-12 lg:mb-16 transition-all duration-700 transform ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-20 opacity-0'}`}>
          <div className="bg-gradient-to-r from-blue-50/90 to-sky-100/90 backdrop-blur-sm rounded-2xl sm:rounded-3xl p-4 sm:p-6 lg:p-8 
            border border-blue-200 shadow-xl">
            <div className="flex items-center mb-4 sm:mb-6">
              <div className="relative">
                <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl bg-gradient-to-br from-blue-600 to-sky-600 p-0.5 shadow-lg">
                  <div className="w-full h-full bg-white rounded-xl sm:rounded-2xl flex items-center justify-center">
                    <Truck className="w-5 h-5 sm:w-6 sm:h-6 text-blue-600" />
                  </div>
                </div>
              </div>
              <div className="ml-3 sm:ml-4">
                <h3 className="text-lg sm:text-xl lg:text-2xl font-bold text-slate-900">Delivery Information</h3>
                <p className="text-xs sm:text-sm text-slate-600">How our delivery system works</p>
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
              <div className="relative bg-white rounded-xl sm:rounded-2xl p-4 sm:p-5 border border-blue-200 
                shadow-md hover:shadow-xl transition-all duration-500 hover:-translate-y-1 group">
                <div className="flex items-center mb-2 sm:mb-3">
                  <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg sm:rounded-xl bg-gradient-to-br from-green-600 to-emerald-600 p-0.5 mr-2 sm:mr-3">
                    <div className="w-full h-full bg-white rounded-lg sm:rounded-xl flex items-center justify-center">
                      <Package className="w-4 h-4 sm:w-5 sm:h-5 text-green-600" />
                    </div>
                  </div>
                  <span className="font-bold text-slate-900 text-sm sm:text-base lg:text-lg">Free Deliveries</span>
                </div>
                <p className="text-slate-700 text-xs sm:text-sm pl-10 sm:pl-13">3 free deliveries per month for all plans</p>
                <div className="absolute bottom-0 left-0 h-1 bg-gradient-to-r from-green-600 to-emerald-600 w-0 group-hover:w-full transition-all duration-500 rounded-full"></div>
              </div>
              <div className="relative bg-white rounded-xl sm:rounded-2xl p-4 sm:p-5 border border-blue-200 
                shadow-md hover:shadow-xl transition-all duration-500 hover:-translate-y-1 group">
                <div className="flex items-center mb-2 sm:mb-3">
                  <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg sm:rounded-xl bg-gradient-to-br from-amber-600 to-orange-600 p-0.5 mr-2 sm:mr-3">
                    <div className="w-full h-full bg-white rounded-lg sm:rounded-xl flex items-center justify-center">
                      <Shield className="w-4 h-4 sm:w-5 sm:h-5 text-amber-600" />
                    </div>
                  </div>
                  <span className="font-bold text-slate-900 text-sm sm:text-base lg:text-lg">After Free Deliveries</span>
                </div>
                <p className="text-slate-700 text-xs sm:text-sm pl-10 sm:pl-13">Delivery charges apply after 3 free deliveries</p>
                <div className="absolute bottom-0 left-0 h-1 bg-gradient-to-r from-amber-600 to-orange-600 w-0 group-hover:w-full transition-all duration-500 rounded-full"></div>
              </div>
            </div>
          </div>
        </div>

        {/* Payment Button */}
        <div className={`relative text-center transition-all duration-700 transform ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-20 opacity-0'}`}>
          <Button
            onClick={handlePayment}
            disabled={isConfirmDisabled()}
            className={`relative px-8 sm:px-10 lg:px-12 xl:px-16 py-3 sm:py-4 lg:py-5 text-sm sm:text-base lg:text-lg xl:text-xl rounded-xl sm:rounded-2xl shadow-2xl
              ${isConfirmDisabled() ? 'opacity-50 cursor-not-allowed' : 'hover:shadow-3xl hover:scale-105'}
              transition-all duration-500 font-bold overflow-hidden group w-full sm:w-auto
              bg-gradient-to-r from-blue-600 to-sky-600 text-white hover:from-blue-700 hover:to-sky-700`}
          >
            <div className={`absolute inset-0 bg-gradient-to-r from-blue-500 to-sky-500 opacity-0 group-hover:opacity-20 transition-opacity duration-500`}></div>
            
            <span className="relative flex items-center justify-center text-white">
              {isProcessing ? (
                <>
                  <Loader className="w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6 mr-2 sm:mr-3 animate-spin text-white" />
                  Processing...
                </>
              ) : (
                <>
                  {selectedPlan?.type === 'popular' ? (
                    <Zap className="w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6 mr-2 sm:mr-3 text-white" />
                  ) : (
                    <Calculator className="w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6 mr-2 sm:mr-3 text-white" />
                  )}
                  <span className="text-white">{getButtonText()}</span>
                  {!isConfirmDisabled() && <ArrowRight className="w-3 h-3 sm:w-4 sm:h-4 lg:w-5 lg:h-5 ml-2 sm:ml-3 transform group-hover:translate-x-2 transition-transform duration-300 text-white" />}
                </>
              )}
            </span>
          </Button>
          
          {/* Status Messages */}
          {!selectedPlan && (
            <p className="text-slate-600 mt-4 sm:mt-6 text-sm sm:text-base">
              Please select a plan to continue
            </p>
          )}
          
          {selectedPlan && selectedPlan.type !== 'popular' && totalGarments === 0 && (
            <div className="mt-4 sm:mt-6">
              <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 sm:p-4 max-w-md mx-auto">
                <div className="flex items-center">
                  <AlertCircle className="w-4 h-4 sm:w-5 sm:h-5 text-amber-600 mr-2 sm:mr-3 flex-shrink-0" />
                  <p className="text-amber-800 text-xs sm:text-sm">
                    Please select at least one garment to proceed with payment
                  </p>
                </div>
              </div>
            </div>
          )}
          
          {!User && (
            <p className="text-amber-600 mt-3 sm:mt-4 text-xs sm:text-sm">
              Please login to continue with payment
            </p>
          )}
          
          {/* Help Text */}
          <div className="mt-6 sm:mt-8 bg-gradient-to-r from-blue-50/80 to-sky-50/80 backdrop-blur-sm rounded-xl sm:rounded-2xl p-4 sm:p-6 max-w-2xl mx-auto border border-blue-200">
            <div className="flex items-center justify-center mb-2 sm:mb-3">
              <TrendingUp className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600 mr-2" />
              <p className="text-slate-700 text-xs sm:text-sm text-center font-medium">
                <strong className="text-blue-600">Secure Payment:</strong> You'll be redirected to Razorpay for secure payment processing
              </p>
            </div>
            <p className="text-[10px] sm:text-xs text-slate-600 text-center">
              Your subscription will be activated immediately after successful payment
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PlansPage;