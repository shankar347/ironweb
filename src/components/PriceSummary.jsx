import React from 'react';
import { Calculator, Tag, CreditCard, Shield, TrendingUp } from 'lucide-react';

const PriceSummary = ({
  selectedPlan,
  garments,
  garmentBreakdown = [],
  extraCharges,
  totalAmount,
  planPrice,
  totalGarments = 0,
  remainingCredits = 0,
  extraGarments = 0
}) => {
  const garmentTypes = {
    shirt: { label: 'Shirt', price: 10, color: 'from-blue-500 to-sky-500' },
    pant: { label: 'Pant', price: 10, color: 'from-blue-600 to-sky-600' },
    top: { label: 'Top', price: 13, color: 'from-purple-500 to-pink-500' },
    chudidhar: { label: 'Chudidhar', price: 13, color: 'from-pink-500 to-rose-500' }
  };

  const hasExtraGarments = extraCharges > 0;
  const isPopularPlan = selectedPlan?.type === 'popular';
  
  // Calculate base credits used correctly
  const baseCreditsUsed = isPopularPlan 
    ? totalGarments 
    : Math.min(totalGarments, selectedPlan?.baseCredits || 0);

  return (
    <div className="bg-gradient-to-br from-white to-slate-50 rounded-3xl p-6 shadow-xl border border-slate-200/80">
      <div className="mb-6">
        <div className="flex items-center mb-4">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-sky-500 p-0.5 mr-3">
            <div className="w-full h-full bg-white rounded-xl flex items-center justify-center">
              <Calculator className="w-6 h-6 text-blue-600" />
            </div>
          </div>
          <div>
            <h3 className="text-2xl font-bold text-slate-900">Final Price Summary</h3>
            <p className="text-slate-600">Complete breakdown of your subscription</p>
          </div>
        </div>
      </div>

      {/* Plan Details */}
      <div className="mb-6">
        <div className="bg-gradient-to-r from-blue-50/80 to-sky-50/80 rounded-2xl p-5 border border-blue-100">
          <div className="flex justify-between items-center">
            <div>
              <h4 className="font-bold text-slate-900 text-lg">{selectedPlan?.name}</h4>
              <p className="text-sm text-slate-600">
                {selectedPlan?.baseCredits
                  ? `Up to ${selectedPlan.baseCredits} garments / month`
                  : selectedPlan?.credits
                  ? `Up to ${selectedPlan.credits} garments / month`
                  : ''}
              </p>
            </div>
            <div className="text-right">
              <div className="text-sm font-medium text-blue-600">
                Price based on selection
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Extra Garments Breakdown */}
      {!isPopularPlan && hasExtraGarments && garmentBreakdown.length > 0 && (
        <div className="mb-6">
          <div className="flex items-center mb-4">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-amber-500 to-orange-500 p-0.5 mr-2">
              <div className="w-full h-full bg-white rounded-lg flex items-center justify-center">
                <Tag className="w-4 h-4 text-amber-600" />
              </div>
            </div>
            <h4 className="font-bold text-slate-900">Extra Garments Breakdown</h4>
          </div>
          <div className="space-y-3">
            {garmentBreakdown.map((garment) => {
              if (garment.extraCount <= 0) return null;
              
              const garmentType = garmentTypes[garment.id];
              if (!garmentType) return null;
              
              const itemTotal = garment.extraCount * garment.price;
              
              return (
                <div key={garment.id} className="flex justify-between items-center bg-white rounded-xl p-4 border border-slate-200 hover:border-blue-200 transition-all duration-300">
                  <div className="flex items-center">
                    <div className={`w-8 h-8 rounded-lg bg-gradient-to-br ${garmentType.color} p-0.5 mr-3`}>
                      <div className="w-full h-full bg-white rounded-lg flex items-center justify-center">
                        <span className="text-xs font-bold bg-gradient-to-r ${garmentType.color} bg-clip-text text-transparent">
                          {garmentType.label.charAt(0)}
                        </span>
                      </div>
                    </div>
                    <div>
                      <span className="font-medium text-slate-900">{garmentType.label}</span>
                      <div className="text-xs text-slate-500">
                        Base: {garment.baseAllocated} | Extra: {garment.extraCount}
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-slate-900 font-semibold">
                      ₹{garment.price} × {garment.extraCount}
                    </div>
                    <div className="text-amber-600 font-bold">+ ₹{itemTotal}</div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Garment Count Summary */}
      <div className="mb-6">
        <div className="bg-gradient-to-r from-slate-50 to-blue-50/50 rounded-xl p-4 border border-slate-200">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm text-slate-600">Selected Garments:</span>
            <span className="font-bold text-slate-900">{totalGarments}</span>
          </div>
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm text-slate-600">Plan Capacity:</span>
            <span className="font-bold text-blue-600">
              {selectedPlan?.baseCredits || selectedPlan?.credits || 0} garments/month
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm text-slate-600">Remaining Capacity:</span>
            <span className="font-bold text-green-600">{remainingCredits}</span>
          </div>
        </div>
      </div>

      {/* Total Amount Section */}
      <div className="border-t border-slate-200 pt-6">
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-green-500 to-emerald-500 p-0.5 mr-3">
              <div className="w-full h-full bg-white rounded-xl flex items-center justify-center">
                <CreditCard className="w-5 h-5 text-green-600" />
              </div>
            </div>
            <div>
              <span className="font-bold text-slate-900 text-lg">Total Amount</span>
              <p className="text-sm text-slate-600">Complete subscription cost</p>
            </div>
          </div>
          <div className="text-right">
            <div className="text-3xl font-bold text-blue-500">
              ₹{totalAmount || 0}
            </div>
            <div className="text-xs text-slate-500 mt-1">
              {totalGarments} garment{totalGarments !== 1 ? 's' : ''} selected
            </div>
          </div>
        </div>

        {/* Savings Note */}
        {totalGarments > 0 && (
          <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl p-4 mb-4">
            <div className="flex items-center">
              <TrendingUp className="w-5 h-5 text-green-600 mr-2" />
              <p className="text-sm text-green-700">
                <strong>Great choice!</strong> {totalGarments} garment{totalGarments !== 1 ? 's' : ''} selected. Pay only ₹{totalAmount || 0}.
              </p>
            </div>
          </div>
        )}

        {/* Note */}
        <div className="bg-gradient-to-r from-blue-50/80 to-sky-50/80 rounded-xl p-4">
          <div className="flex items-start">
            <Shield className="w-5 h-5 text-blue-600 mr-3 mt-0.5 flex-shrink-0" />
            <div>
              <p className="text-sm text-slate-700">
                <strong className="text-blue-600">Important:</strong> Your subscription will be activated immediately after successful payment via Razorpay.
              </p>
              <p className="text-xs text-slate-600 mt-2">
                Prices are final and include all taxes. Delivery charges apply after 3 free monthly deliveries.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PriceSummary;