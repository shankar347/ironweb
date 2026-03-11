import React from 'react';
import { Plus, Minus, AlertCircle, Calculator } from 'lucide-react';

const GarmentSelector = ({
  garments,
  baseCredits,
  maxLimit,
  selectedPlan,
  planPrice,
  onGarmentsChange,
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
      cottonShirt: 0,
      shawl: 0,
      tShirt: 0,
      jeansPant: 0,
      ladiesTop: 0,
      ladiesPant: 0,
      normalSaree: 0,
      silkSaree: 0,
      chudidhar: 0
    };
    if (onGarmentsChange) {
      onGarmentsChange(resetGarments);
    }
  };

  const garmentTypes = [
    { id: 'shirt', label: 'Shirt', price: 10, color: 'from-blue-500 to-sky-500' },
    { id: 'pant', label: 'Pant', price: 10, color: 'from-blue-600 to-sky-600' },
    { id: 'cottonShirt', label: 'Cotton Shirt', price: 20, color: 'from-indigo-500 to-blue-500' },
    { id: 'shawl', label: 'Shawl', price: 10, color: 'from-purple-500 to-pink-500' },
    { id: 'tShirt', label: 'T-Shirt', price: 12, color: 'from-green-500 to-emerald-500' },
    { id: 'jeansPant', label: 'Jeans Pant', price: 15, color: 'from-cyan-500 to-blue-500' },
    { id: 'ladiesTop', label: 'Ladies Top', price: 13, color: 'from-pink-500 to-rose-500' },
    { id: 'ladiesPant', label: 'Ladies Pant', price: 10, color: 'from-orange-500 to-amber-500' },
    { id: 'normalSaree', label: 'Normal Saree', price: 39, color: 'from-red-500 to-pink-500' },
    { id: 'silkSaree', label: 'Silk Saree', price: 59, color: 'from-yellow-500 to-amber-500' },
    { id: 'chudidhar', label: 'Chudidhar', price: 15, color: 'from-violet-500 to-purple-500' }
  ];

  // Group garments by category for better organization
  const categories = [
    {
      name: 'Mens Wear',
      items: garmentTypes.filter(g => ['shirt', 'pant', 'cottonShirt', 'tShirt', 'jeansPant'].includes(g.id))
    },
    {
      name: 'Ladies Wear',
      items: garmentTypes.filter(g => ['ladiesTop', 'ladiesPant', 'chudidhar', 'normalSaree', 'silkSaree', 'shawl'].includes(g.id))
    }
  ];

  return (
    <div className="bg-gradient-to-br from-white to-slate-50 rounded-3xl p-4 sm:p-6 shadow-xl border border-slate-200/80">
      <div className="mb-4 sm:mb-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-3">
          <h3 className="text-xl sm:text-2xl font-bold text-slate-900">
            Select Garment Quantities
          </h3>
          <div className="flex items-center gap-3">
            <div className="px-3 py-1 bg-gradient-to-r from-blue-500 to-sky-500 text-white text-xs sm:text-sm font-bold rounded-full whitespace-nowrap">
              {selectedPlan} Plan
            </div>
            <button
              onClick={handleReset}
              className="px-3 py-1 text-xs sm:text-sm text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors"
            >
              Reset All
            </button>
          </div>
        </div>
        <div className="flex items-center text-slate-600 mb-2">
          <Calculator className="w-4 h-4 mr-2 flex-shrink-0" />
          <p className="text-xs sm:text-sm">
            Base: <span className="font-bold text-blue-600">{baseCredits}</span> garments | 
            Max: <span className="font-bold text-purple-600">{maxLimit}</span> garments |
            Selected: <span className="font-bold text-green-600">{totalGarments}</span>
          </p>
        </div>
      </div>

      {/* Price Summary Bar - Mobile Optimized */}
      <div className="bg-gradient-to-r from-blue-50 to-sky-50 rounded-xl p-3 sm:p-4 mb-4 sm:mb-6 border border-blue-100">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-4">
          <div className="text-center">
            <div className="text-xs text-slate-500">Base Plan</div>
            <div className="text-base sm:text-xl font-bold text-blue-600">₹{planPrice}</div>
          </div>
          <div className="text-center">
            <div className="text-xs text-slate-500">Extra Charges</div>
            <div className={`text-base sm:text-xl font-bold ${extraCharges > 0 ? 'text-amber-600' : 'text-green-600'}`}>
              ₹{extraCharges || 0}
            </div>
          </div>
          <div className="text-center">
            <div className="text-xs text-slate-500">Total Garments</div>
            <div className={`text-base sm:text-xl font-bold ${totalGarments > baseCredits ? 'text-purple-600' : 'text-slate-900'}`}>
              {totalGarments}
            </div>
          </div>
          <div className="text-center">
            <div className="text-xs text-slate-500">Final Total</div>
            <div className="text-base sm:text-xl font-bold bg-gradient-to-r from-blue-600 to-sky-600 bg-clip-text text-transparent">
              ₹{totalAmount || planPrice}
            </div>
          </div>
        </div>
      </div>

      {/* Garment Selection Grid - Categorized */}
      {categories.map((category, categoryIndex) => (
        <div key={categoryIndex} className="mb-6">
          <h4 className="text-sm font-semibold text-slate-700 mb-3 px-1">{category.name}</h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
            {category.items.map((garment) => {
              const currentCount = garments[garment.id] || 0;
              const percentageUsed = maxLimit ? Math.min((currentCount / maxLimit) * 100, 100) : 0;

              return (
                <div
                  key={garment.id}
                  className="relative bg-white rounded-xl p-3 sm:p-4 border border-slate-200 hover:border-blue-300 transition-all duration-300 hover:shadow-lg group"
                >
                  <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2 mb-2">
                    <div>
                      <h4 className="font-bold text-slate-900 text-base">{garment.label}</h4>
                      <div className="flex items-center gap-2">
                        <span className="text-xs sm:text-sm text-slate-600">₹{garment.price}/extra</span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between sm:justify-end space-x-2">
                      <button
                        onClick={() => handleDecrement(garment.id)}
                        disabled={currentCount === 0}
                        className={`w-8 h-8 sm:w-9 sm:h-9 rounded-full flex items-center justify-center transition-all duration-300 ${
                          currentCount === 0
                            ? 'bg-slate-100 text-slate-400 cursor-not-allowed'
                            : 'bg-gradient-to-br from-red-50 to-red-100 text-red-600 hover:from-red-100 hover:to-red-200 hover:shadow-md'
                        }`}
                      >
                        <Minus className="w-3 h-3 sm:w-4 sm:h-4" />
                      </button>
                      
                      <div className="relative">
                        <input
                          type="number"
                          min="0"
                          max={maxLimit}
                          value={currentCount}
                          onChange={(e) => handleInputChange(garment.id, e.target.value)}
                          className="text-xl sm:text-2xl font-bold text-slate-900 w-12 sm:w-16 text-center bg-transparent border-none focus:outline-none focus:ring-0"
                        />
                      </div>
                      
                      <button
                        onClick={() => handleIncrement(garment.id)}
                        disabled={isLimitReached}
                        className={`w-8 h-8 sm:w-9 sm:h-9 rounded-full flex items-center justify-center transition-all duration-300 ${
                          isLimitReached
                            ? 'bg-slate-100 text-slate-400 cursor-not-allowed'
                            : 'bg-gradient-to-br from-green-50 to-emerald-100 text-green-600 hover:from-green-100 hover:to-emerald-200 hover:shadow-md'
                        }`}
                      >
                        <Plus className="w-3 h-3 sm:w-4 sm:h-4" />
                      </button>
                    </div>
                  </div>
                  
                  {/* Progress Bar */}
                  <div className="mt-2">
                    <div className="flex justify-between text-xs text-slate-600 mb-1">
                      <span>0</span>
                      <span className="text-xs">{currentCount} selected</span>
                      <span>{maxLimit}</span>
                    </div>
                    <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
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
        </div>
      ))}

      {/* Warning Message */}
      {isLimitReached && (
        <div className="bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200 rounded-xl p-3 sm:p-4 flex items-start">
          <AlertCircle className="w-5 h-5 text-amber-600 mr-3 mt-0.5 flex-shrink-0" />
          <div>
            <p className="font-bold text-amber-800 text-sm sm:text-base">Maximum Limit Reached!</p>
            <p className="text-amber-700 text-xs sm:text-sm mt-1">
              You've reached the maximum limit of {maxLimit} garments for this plan.
              Remove some garments or consider upgrading your plan.
            </p>
          </div>
        </div>
      )}

      {/* Savings Tip */}
      {totalGarments > 0 && totalGarments <= baseCredits && (
        <div className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-xl p-3 sm:p-4 mt-4">
          <p className="text-green-800 text-xs sm:text-sm text-center">
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
  baseCredits: 45,
  maxLimit: 78,
  selectedPlan: 'Normal',
  planPrice: 500,
  onGarmentsChange: () => {}
};

export default GarmentSelector;