import React from 'react';
import { Plus, Minus, AlertCircle, Calculator, TrendingUp } from 'lucide-react';

const GarmentSelector = ({
  garments,
  baseCredits,
  maxLimit,
  selectedPlan,
  planPrice,
  onGarmentsChange,  // Fixed: Changed from onUpdate to match prop name
  totalGarments = 0,
  remainingCredits = 0,
  extraGarments = 0,
  extraCharges = 0,
  totalAmount = 0
}) => {
  const isLimitReached = totalGarments >= maxLimit;

  const handleIncrement = (type) => {
    if (!isLimitReached) {
      const newCount = (garments[type] || 0) + 1;
      const newGarments = {
        ...garments,
        [type]: newCount
      };
      if (onGarmentsChange) {
        onGarmentsChange(newGarments);
      }
    }
  };

  const handleDecrement = (type) => {
    const currentCount = garments[type] || 0;
    if (currentCount > 0) {
      const newCount = currentCount - 1;
      const newGarments = {
        ...garments,
        [type]: newCount
      };
      if (onGarmentsChange) {
        onGarmentsChange(newGarments);
      }
    }
  };

  const handleInputChange = (type, value) => {
    const numValue = parseInt(value, 10);
    if (!isNaN(numValue) && numValue >= 0) {
      const newGarments = {
        ...garments,
        [type]: Math.min(numValue, maxLimit)
      };
      if (onGarmentsChange) {
        onGarmentsChange(newGarments);
      }
    } else if (value === '') {
      const newGarments = {
        ...garments,
        [type]: 0
      };
      if (onGarmentsChange) {
        onGarmentsChange(newGarments);
      }
    }
  };

  // Reset all counts
  const handleReset = () => {
    const resetGarments = {
      shirt: 0,
      pant: 0,
      top: 0,
      chudidhar: 0
    };
    if (onGarmentsChange) {
      onGarmentsChange(resetGarments);
    }
  };

  const garmentTypes = [
    { id: 'shirt', label: 'Shirt', price: 10, color: 'from-blue-500 to-sky-500' },
    { id: 'pant', label: 'Pant', price: 10, color: 'from-blue-600 to-sky-600' },
    { id: 'top', label: 'Top', price: 13, color: 'from-purple-500 to-pink-500' },
    { id: 'chudidhar', label: 'Chudidhar', price: 13, color: 'from-pink-500 to-rose-500' }
  ];

  return (
    <div className="bg-gradient-to-br from-white to-slate-50 rounded-3xl p-6 shadow-xl border border-slate-200/80">
      <div className="mb-6">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-2xl font-bold text-slate-900">
            Select Garment Quantities
          </h3>
          <div className="flex items-center gap-3">
            <div className="px-3 py-1 bg-gradient-to-r from-blue-500 to-sky-500 text-white text-sm font-bold rounded-full">
              {selectedPlan} Plan
            </div>
            <button
              onClick={handleReset}
              className="px-3 py-1 text-sm text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors"
            >
              Reset All
            </button>
          </div>
        </div>
        <div className="flex items-center text-slate-600 mb-2">
          <Calculator className="w-4 h-4 mr-2" />
          <p className="text-sm">
            Base: <span className="font-bold text-blue-600">{baseCredits}</span> garments | 
            Max: <span className="font-bold text-purple-600">{maxLimit}</span> garments |
            Selected: <span className="font-bold text-green-600">{totalGarments}</span>
          </p>
        </div>
      </div>

      {/* Price Summary Bar */}
      <div className="bg-gradient-to-r from-blue-50 to-sky-50 rounded-xl p-4 mb-6 border border-blue-100">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center">
            <div className="text-xs text-slate-500">Base Plan</div>
            <div className="text-xl font-bold text-blue-600">₹{planPrice}</div>
          </div>
          <div className="text-center">
            <div className="text-xs text-slate-500">Extra Charges</div>
            <div className={`text-xl font-bold ${extraCharges > 0 ? 'text-amber-600' : 'text-green-600'}`}>
              ₹{extraCharges || 0}
            </div>
          </div>
          <div className="text-center">
            <div className="text-xs text-slate-500">Total Garments</div>
            <div className={`text-xl font-bold ${totalGarments > baseCredits ? 'text-purple-600' : 'text-slate-900'}`}>
              {totalGarments}
            </div>
          </div>
          <div className="text-center">
            <div className="text-xs text-slate-500">Final Total</div>
            <div className="text-xl font-bold bg-gradient-to-r from-blue-600 to-sky-600 bg-clip-text text-transparent">
              ₹{totalAmount || planPrice}
            </div>
          </div>
        </div>
      </div>

      {/* Garment Selection Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
        {garmentTypes.map((garment) => {
          const currentCount = garments[garment.id] || 0;
          const percentageUsed = maxLimit ? Math.min((currentCount / maxLimit) * 100, 100) : 0;

          return (
            <div
              key={garment.id}
              className="relative bg-white rounded-xl p-4 border border-slate-200 hover:border-blue-300 transition-all duration-300 hover:shadow-lg group"
            >
              <div className="flex justify-between items-center mb-3">
                <div>
                  <h4 className="font-bold text-slate-900 text-lg">{garment.label}</h4>
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-slate-600">₹{garment.price}/extra</span>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <button
                    onClick={() => handleDecrement(garment.id)}
                    disabled={currentCount === 0}
                    className={`w-9 h-9 rounded-full flex items-center justify-center transition-all duration-300 ${
                      currentCount === 0
                        ? 'bg-slate-100 text-slate-400 cursor-not-allowed'
                        : 'bg-gradient-to-br from-red-50 to-red-100 text-red-600 hover:from-red-100 hover:to-red-200 hover:shadow-md'
                    }`}
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                  
                  <div className="relative">
                    <input
                      type="number"
                      min="0"
                      max={maxLimit}
                      value={currentCount}
                      onChange={(e) => handleInputChange(garment.id, e.target.value)}
                      className="text-2xl font-bold text-slate-900 w-16 text-center bg-transparent border-none focus:outline-none focus:ring-0"
                    />
                    <div className="absolute -bottom-1 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-blue-500 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                  </div>
                  
                  <button
                    onClick={() => handleIncrement(garment.id)}
                    disabled={isLimitReached}
                    className={`w-9 h-9 rounded-full flex items-center justify-center transition-all duration-300 ${
                      isLimitReached
                        ? 'bg-slate-100 text-slate-400 cursor-not-allowed'
                        : 'bg-gradient-to-br from-green-50 to-emerald-100 text-green-600 hover:from-green-100 hover:to-emerald-200 hover:shadow-md'
                    }`}
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
              </div>
              
              {/* Progress Bar with label */}
              <div className="mt-4">
                <div className="flex justify-between text-xs text-slate-600 mb-1">
                  <span>0</span>
                  <span>{currentCount} garments</span>
                  <span>{maxLimit}</span>
                </div>
                <div className="w-full bg-slate-100 h-3 rounded-full overflow-hidden">
                  <div 
                    className={`h-full bg-gradient-to-r ${garment.color} transition-all duration-500`}
                    style={{ width: `${percentageUsed}%` }}
                  ></div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Warning Message */}
      {isLimitReached && (
        <div className="bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200 rounded-xl p-4 flex items-start">
          <AlertCircle className="w-5 h-5 text-amber-600 mr-3 mt-0.5 flex-shrink-0" />
          <div>
            <p className="font-bold text-amber-800">Maximum Limit Reached!</p>
            <p className="text-amber-700 text-sm mt-1">
              You've reached the maximum limit of {maxLimit} garments for this plan.
              Remove some garments or consider upgrading your plan.
            </p>
          </div>
        </div>
      )}

      {/* Savings Tip */}
      {totalGarments > 0 && totalGarments <= baseCredits && (
        <div className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-xl p-4 mt-4">
          <p className="text-green-800 text-sm text-center">
            <strong className="text-green-600">Great!</strong> You're within your base credits. 
            No extra charges for these {totalGarments} garments!
          </p>
        </div>
      )}
    </div>
  );
};

// Default props
GarmentSelector.defaultProps = {
  baseCredits: 30,
  maxLimit: 60,
  selectedPlan: 'Basic',
  planPrice: 299,
  onGarmentsChange: () => {}
};

export default GarmentSelector;