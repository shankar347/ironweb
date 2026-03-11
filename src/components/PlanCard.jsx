import React from 'react';
import { CheckCircle, Star, TrendingUp, Zap } from 'lucide-react';
import Button from './ui/Newbutton';

const PlanCard = ({ plan, isSelected, onSelect, isPopular }) => {
  const handleSelect = () => {
    onSelect(plan.id);
  };

  // Calculate price per garment for display
  const getPricePerGarment = () => {
    if (plan.type === 'popular') {
      return (plan.price / plan.credits).toFixed(2);
    } else {
      return (plan.price / plan.baseCredits).toFixed(2);
    }
  };

  return (
    <div className={`relative h-full transition-all duration-500 ${isSelected ? 'scale-105 z-10' : 'scale-100'}`}>
      <div className={`relative bg-white rounded-3xl p-4 sm:p-6 h-full min-h-[650px] sm:min-h-[700px] flex flex-col
        border-2 ${isSelected ? 'border-blue-500 shadow-2xl shadow-blue-500/30' : 'border-slate-200 shadow-lg hover:shadow-2xl hover:shadow-blue-500/20'}
        transition-all duration-500 hover:-translate-y-2 group overflow-hidden`}>
        
        {/* Background Glow Effect - Blue on hover */}
        <div className={`absolute inset-0 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500
          bg-gradient-to-br from-blue-50 via-blue-100/50 to-sky-50`}></div>
        
        {/* Plan Header - Fixed height section */}
        <div className="relative text-center mb-4 sm:mb-6 flex-shrink-0">
          <h3 className="text-xl sm:text-2xl lg:text-3xl font-bold text-slate-900 mb-2">{plan.name}</h3>
          
          {/* Price Display */}
          <div className="mb-2">
            <div className="text-3xl sm:text-4xl lg:text-5xl font-bold bg-gradient-to-r from-blue-600 to-sky-600 bg-clip-text text-transparent">
              ₹{plan.price}
              <span className="text-sm sm:text-base font-normal text-slate-600">
                {plan.type === 'popular' ? '/month' : ''}
              </span>
            </div>
            
            {/* Subtitle */}
            <p className="text-xs sm:text-sm text-slate-600 mt-1 h-10 sm:h-12 flex flex-col justify-center">
              {plan.type === 'popular' ? (
                <>
                  <span className="font-medium">{plan.credits} garments included</span>
                  <span className="text-xs">(Fixed set: 15 each)</span>
                </>
              ) : (
                <>
                  <span className="font-medium">{plan.baseCredits} base garments</span>
                  <span className="text-xs">(₹{getPricePerGarment()}/garment)</span>
                </>
              )}
            </p>
          </div>
          
          {/* Credits Info */}
          <div className="inline-flex items-center bg-gradient-to-r from-blue-50 to-sky-50 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full border border-blue-200">
            <Zap className="w-3 h-3 sm:w-4 sm:h-4 text-blue-600 mr-1 sm:mr-2" />
            <span className="text-xs sm:text-sm font-semibold text-blue-700">
              {plan.credits} {plan.type === 'popular' ? 'Garments' : 'Base Garments'}
            </span>
          </div>
          
          <div className="h-1 w-16 sm:w-20 mx-auto mt-3 sm:mt-4 bg-gradient-to-r from-blue-500 to-sky-500 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
        </div>

        {/* Available Items Preview - Fixed height scrollable if needed */}
        <div className="relative mb-4 sm:mb-6 flex-shrink-0">
          <div className="mb-2 sm:mb-3 flex items-center">
            <TrendingUp className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600 mr-2" />
            <span className="text-xs sm:text-sm font-semibold text-slate-900">Available Items:</span>
          </div>
          <div className="grid grid-cols-2 gap-2 max-h-24 sm:max-h-28 overflow-y-auto pr-1 custom-scrollbar">
            {plan.availableItems.map((item, index) => (
              <div key={index} className="flex items-center justify-between bg-slate-50 rounded-lg px-2 py-1.5 text-xs group-hover:bg-white transition-colors duration-300">
                <span className="text-slate-700 truncate mr-1">{item.name}</span>
                <span className="font-semibold text-blue-600 flex-shrink-0">₹{item.price}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Features List - Flexible height with max height and scroll if needed */}
        <div className="relative mb-4 sm:mb-6 flex-1">
          <div className="mb-2 sm:mb-3 flex items-center">
            <TrendingUp className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600 mr-2" />
            <span className="text-xs sm:text-sm font-semibold text-slate-900">Plan Highlights:</span>
          </div>
          <ul className="space-y-2 sm:space-y-3 max-h-36 sm:max-h-40 overflow-y-auto pr-1 custom-scrollbar">
            {plan.features.map((feature, index) => (
              <li key={index} className="flex items-start group/feature">
                <div className="flex-shrink-0 mt-1 mr-2 sm:mr-3">
                  <div className="w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-gradient-to-br from-green-500 to-emerald-500 flex items-center justify-center group-hover/feature:scale-110 transition-transform duration-300">
                    <CheckCircle className="w-3 h-3 sm:w-4 sm:h-4 text-white" />
                  </div>
                </div>
                <span className="text-xs sm:text-sm text-slate-700 group-hover:text-slate-900 transition-colors duration-300">{feature}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Action Button - Fixed at bottom */}
        <div className="relative mt-auto flex-shrink-0">
          <Button
            onClick={handleSelect}
            className={`w-full py-3 sm:py-4 text-base sm:text-lg font-semibold rounded-xl relative overflow-hidden group/btn
              ${isSelected 
                ? 'bg-gradient-to-r from-blue-600 to-sky-600 text-white shadow-lg shadow-blue-500/30' 
                : 'bg-gradient-to-r from-blue-600 to-sky-600 text-white hover:from-blue-700 hover:to-sky-700'
              }
              transition-all duration-300 hover:shadow-xl hover:shadow-blue-500/30 hover:scale-105`}
          >
            {/* Button Glow Effect */}
            <div className={`absolute inset-0 bg-gradient-to-r from-blue-500 to-sky-500 opacity-0 group-hover/btn:opacity-20 transition-opacity duration-300`}></div>
            
            <span className="relative flex items-center justify-center text-white">
              {isSelected ? (
                <>
                  <Star className="w-4 h-4 sm:w-5 sm:h-5 mr-2 fill-current text-white" />
                  Selected
                </>
              ) : (
                <span className="text-white">{plan.buttonText}</span>
              )}
            </span>
          </Button>
          
          {/* Best Value Badge */}
          {isPopular && !isSelected && (
            <div className="mt-2 sm:mt-3 text-center">
              <span className="inline-block px-2 sm:px-3 py-0.5 sm:py-1 bg-gradient-to-r from-blue-600 to-sky-600 text-white text-xs font-bold rounded-full shadow-lg">
                ⭐ Best Value
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PlanCard;