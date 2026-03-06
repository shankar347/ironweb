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
      <div className={`relative bg-white/95 backdrop-blur-sm rounded-3xl p-6 sm:p-8 h-full
        border-2 ${isSelected ? 'border-blue-500 shadow-2xl shadow-blue-500/30' : 'border-white/50 shadow-lg hover:shadow-2xl hover:shadow-blue-500/20'}
        transition-all duration-500 hover:-translate-y-2 group overflow-hidden`}>
        
        {/* Background Glow Effect */}
        <div className={`absolute inset-0 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500
          ${isPopular ? 'bg-gradient-to-br from-blue-500/10 via-blue-400/5 to-sky-500/10' : 'bg-gradient-to-br from-blue-500/10 via-transparent to-sky-500/10'}`}></div>
        
        {/* Plan Header */}
        <div className="relative text-center mb-8">
          <h3 className="text-2xl sm:text-3xl font-bold text-slate-900 mb-2">{plan.name}</h3>
          
          {/* Price Display for All Plans */}
          <div className="mb-3">
            <div className="text-4xl sm:text-5xl font-bold bg-gradient-to-r from-blue-600 to-sky-600 bg-clip-text text-transparent">
              ₹{plan.price}
              <span className="text-lg font-normal text-slate-600">
                {plan.type === 'popular' ? '/month' : ''}
              </span>
            </div>
            
            {/* Subtitle based on plan type */}
            <p className="text-sm text-slate-600 mt-2">
              {plan.type === 'popular' ? (
                <>
                  <span className="font-medium">{plan.credits} credits included</span>
                  <br />
                  <span className="text-xs">(₹{getPricePerGarment()}/garment)</span>
                </>
              ) : (
                <>
                  <span className="font-medium">{plan.baseCredits} base garments</span>
                  <br />
                  <span className="text-xs">(₹{getPricePerGarment()}/base garment)</span>
                </>
              )}
            </p>
          </div>
          
          {/* Credits Info */}
          <div className="inline-flex items-center bg-gradient-to-r from-blue-50 to-sky-50 px-4 py-2 rounded-full border border-blue-100">
            <Zap className="w-4 h-4 text-blue-600 mr-2" />
            <span className="text-sm font-semibold text-blue-700">
              {plan.credits} {plan.type === 'popular' ? 'Credits' : 'Garments'}
            </span>
          </div>
          
          <div className="h-1 w-20 mx-auto mt-4 bg-gradient-to-r from-blue-500 to-sky-500 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
        </div>

        {/* Features List */}
        <div className="relative mb-8">
          <div className="mb-4 flex items-center">
            <TrendingUp className="w-5 h-5 text-blue-600 mr-2" />
            <span className="text-sm font-semibold text-slate-900">Plan Highlights:</span>
          </div>
          <ul className="space-y-3">
            {plan.features.map((feature, index) => (
              <li key={index} className="flex items-start group/feature">
                <div className="flex-shrink-0 mt-1 mr-3">
                  <div className="w-6 h-6 rounded-full bg-gradient-to-br from-green-500 to-emerald-500 flex items-center justify-center group-hover/feature:scale-110 transition-transform duration-300">
                    <CheckCircle className="w-4 h-4 text-white" />
                  </div>
                </div>
                <span className="text-slate-700 group-hover/feature:text-slate-900 transition-colors duration-300">{feature}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Action Button */}
        <div className="relative mt-auto">
          <Button
            onClick={handleSelect}
            className={`w-full py-4 text-lg font-semibold rounded-xl relative overflow-hidden group/btn
              ${isSelected 
                ? 'bg-gradient-to-r from-blue-600 to-sky-600 text-white shadow-lg shadow-blue-500/30' 
                : 'bg-gradient-to-r from-blue-50 to-sky-50 text-blue-600 hover:text-white'
              }
              transition-all duration-300 hover:shadow-xl hover:shadow-blue-500/30 hover:scale-105`}
          >
            {/* Button Glow Effect */}
            <div className={`absolute inset-0 bg-gradient-to-r from-blue-500 to-sky-500 opacity-0 group-hover/btn:opacity-100 transition-opacity duration-300 ${isSelected ? 'opacity-100' : ''}`}></div>
            
            <span className="relative flex items-center justify-center">
              {isSelected ? (
                <>
                  <Star className="w-5 h-5 mr-2 fill-current" />
                  Selected
                </>
              ) : (
                plan.buttonText
              )}
            </span>
          </Button>
          
          {/* Best Value Badge for Popular Plan */}
          {isPopular && !isSelected && (
            <div className="mt-3 text-center">
              <span className="inline-block px-3 py-1 bg-gradient-to-r from-blue-500 to-sky-500 text-white text-xs font-bold rounded-full">
                Best Value
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PlanCard;