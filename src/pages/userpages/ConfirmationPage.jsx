import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  CheckCircle, 
  Clock, 
  Truck, 
  Package, 
  Shield,
  Home,
  FileText,
  Zap,
  Camera,
  QrCode,
  Loader2,
  AlertCircle,
  Smartphone,
  CreditCard,
  Receipt
} from 'lucide-react';
import Button from '../../components/ui/Newbutton';
import qrcode from '../../assets/qrcode.jpeg';


const ConfirmationPage = () => {
  const navigate = useNavigate();
  const [subscriptionData, setSubscriptionData] = useState(null);
  const [isVisible, setIsVisible] = useState(false);
  const [showQR, setShowQR] = useState(false);
  const [qrScanned, setQrScanned] = useState(false);
  const [loading, setLoading] = useState(false);
  const [scanning, setScanning] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('qr');
  const videoRef = useRef(null);
  const canvasRef = useRef(null);

  useEffect(() => {
    setIsVisible(true);
    
    // Get subscription data from localStorage
    const data = localStorage.getItem('subscriptionData');
    if (data) {
      setSubscriptionData(JSON.parse(data));
    } else {
      // Redirect to plans page if no data
      navigate('/');
    }
  }, [navigate]);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-IN', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getGarmentSummary = () => {
    if (!subscriptionData?.garments) return null;
    
    const garmentTypes = {
      shirt: { label: 'Shirt', price: 10 },
      pant: { label: 'Pant', price: 10 },
      top: { label: 'Top', price: 13 },
      chudidhar: { label: 'Chudidhar', price: 13 }
    };

    return Object.entries(subscriptionData.garments)
      .filter(([_, quantity]) => quantity > 0)
      .map(([type, quantity]) => ({
        ...garmentTypes[type],
        quantity
      }));
  };

  const handleGoToDashboard = () => {
    navigate('/dashboard');
  };

  const handleViewPlan = () => {
    navigate('/subscription');
  };

  const handleShowQR = () => {
    setShowQR(true);
  };

  const handleScanQR = async () => {
    setScanning(true);
    // Simulate QR scanning process
    setTimeout(() => {
      setScanning(false);
      setQrScanned(true);
    }, 2000);
  };

  const handleConfirmSubscription = async () => {
    setLoading(true);
    // Simulate API call for confirmation
    setTimeout(() => {
      setLoading(false);
      // Store confirmation in localStorage
      const confirmedData = {
        ...subscriptionData,
        confirmed: true,
        confirmedAt: new Date().toISOString(),
        transactionId: `TXN${Date.now()}${Math.floor(Math.random() * 1000)}`
      };
      localStorage.setItem('subscriptionData', JSON.stringify(confirmedData));
      
      // Navigate to success page or dashboard
      navigate('/subscription-success');
    }, 1500);
  };

  const handlePaymentMethodChange = (method) => {
    setPaymentMethod(method);
  };

  if (!subscriptionData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-sky-50 flex items-center justify-center">
        <div className="text-center">
          <Clock className="w-16 h-16 text-blue-600 mx-auto mb-4 animate-spin" />
          <p className="text-xl text-slate-700">Loading subscription details...</p>
        </div>
      </div>
    );
  }

  const garmentSummary = getGarmentSummary();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-sky-50">
      {/* Animated Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-48 sm:w-72 h-48 sm:h-72 bg-green-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse"></div>
        <div className="absolute top-40 right-10 w-64 sm:w-96 h-64 sm:h-96 bg-emerald-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse" style={{ animationDelay: '1s' }}></div>
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 relative z-10">
        {/* Header */}
        <div className={`text-center mb-8 sm:mb-12 transition-all duration-1000 transform ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
          <div className="w-20 h-20 mx-auto mb-6 bg-gradient-to-br from-green-500 to-emerald-500 rounded-full flex items-center justify-center">
            <CheckCircle className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-3xl sm:text-4xl
           bg-gradient-to-r from-blue-500 to-sky-400 md:text-5xl font-bold bg-gradient-to-r from-green-600 via-emerald-600 to-teal-600 bg-clip-text text-transparent mb-4">
            Complete Your Subscription
          </h1>
          <p className="text-lg sm:text-xl text-slate-600 max-w-2xl mx-auto">
            Review your plan details and complete payment to activate
          </p>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8 mb-8 sm:mb-12">
          {/* Summary Card */}
          <div className={`lg:col-span-2 
            transition-all duration-700
             transform ${isVisible ? 'translate-y-0 opacity-100' :
              'translate-y-20 opacity-0'}`}>
            <div className="bg-white rounded-2xl p-6 sm:p-8 shadow-2xl border border-emerald-200">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center">
                  <Zap className="w-8 h-8 text-emerald-600 mr-3" />
                  <h2 className="text-2xl font-bold text-slate-900">Plan Summary</h2>
                </div>
                <div className="px-2 py-2 bg-gradient-to-r from-blue-50 to-sky-50 rounded-full border border-blue-200">
                  <span className="text-xs font-semibold text-blue-700">Amount Due: ₹{subscriptionData.totalAmount}</span>
                </div>
              </div>

              {/* Plan Details */}
              <div className="mb-8">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                  <div className="bg-gradient-to-br from-emerald-50 to-green-50 rounded-xl p-4">
                    <div className="text-sm text-slate-600 mb-1">Selected Plan</div>
                    <div className="text-xl font-bold text-emerald-700">{subscriptionData.plan.name}</div>
                  </div>
                  
                  <div className="bg-gradient-to-br from-blue-50 to-sky-50 rounded-xl p-4">
                    <div className="text-sm text-slate-600 mb-1">Plan Type</div>
                    <div className="text-xl font-bold text-blue-700">
                      {subscriptionData.plan.type === 'popular' ? 'Monthly' : 'Fixed'}
                    </div>
                  </div>

                  <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl p-4">
                    <div className="text-sm text-slate-600 mb-1">
                        Credits</div>
                    <div className="text-xl font-bold text-purple-700">
                      {subscriptionData.plan.credits}
                    </div>
                  </div>
                </div>
              </div>

              {/* Details List */}
              <div className="space-y-6">
                {/* Base Credits */}
                <div className="flex justify-between items-center pb-4 border-b border-slate-200">
                  <div className="flex items-center">
                    <Package className="w-5 h-5 text-blue-600 mr-3" />
                    <span className="text-slate-700">Base {subscriptionData.plan.type === 'popular' ? 'Credits' : 'Garments'}</span>
                  </div>
                  <span className="font-semibold text-slate-900">
                    {subscriptionData.plan.credits}
                  </span>
                </div>

                {/* Extra Garments */}
                {subscriptionData.extraCharges > 0 && (
                  <div className="flex justify-between items-center pb-4 border-b border-slate-200">
                    <div className="flex items-center">
                      <Shield className="w-5 h-5 text-amber-600 mr-3" />
                      <span className="text-slate-700">Extra Garments</span>
                    </div>
                    <div className="text-right">
                      <div className="font-semibold text-slate-900">
                        ₹{subscriptionData.extraCharges}
                      </div>
                      <div className="text-sm text-slate-600">
                        {garmentSummary?.map(g => `${g.quantity} ${g.label}`).join(', ')}
                      </div>
                    </div>
                  </div>
                )}

                {/* Delivery Info */}
                <div className="flex justify-between items-center pb-4 border-b border-slate-200">
                  <div className="flex items-center">
                    <Truck className="w-5 h-5 text-green-600 mr-3" />
                    <span className="text-slate-700">Free Deliveries</span>
                  </div>
                  <span className="font-semibold text-slate-900">3 per month</span>
                </div>

                {/* Total Amount */}
                <div className="flex justify-between items-center pb-4 border-b border-slate-200">
                  <div className="flex items-center">
                    <CreditCard className="w-5 h-5 text-emerald-600 mr-3" />
                    <span className="text-slate-700 font-bold">Total Amount</span>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold bg-gradient-to-r from-emerald-600 to-green-600 bg-clip-text text-transparent">
                      ₹{subscriptionData.totalAmount}
                    </div>
                  </div>
                </div>

                {/* Request Date */}
                <div className="flex justify-between items-center">
                  <div className="text-slate-700">Request Date</div>
                  <div className="text-right">
                    <div className="font-semibold text-slate-900">
                      {formatDate(subscriptionData.timestamp)}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Payment Section */}
          <div className={`space-y-6 transition-all duration-700 transform ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-20 opacity-0'}`} style={{ transitionDelay: '300ms' }}>
            {/* Payment Method Selection */}
            <div className="bg-white rounded-2xl p-6 shadow-xl border border-emerald-200">
              <h3 className="text-xl font-bold text-slate-900 mb-4 flex items-center">
                <CreditCard className="w-6 h-6 text-blue-600 mr-2" />
                Payment Method
              </h3>
              
              <div className="space-y-4 mb-6">
                <button
                  onClick={() => handlePaymentMethodChange('qr')}
                  className={`w-full p-4 rounded-xl border-2 flex items-center justify-between transition-all duration-300 ${
                    paymentMethod === 'qr'
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-slate-200 hover:border-blue-300'
                  }`}
                >
                  <div className="flex items-center">
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center mr-3 ${
                      paymentMethod === 'qr' ? 'bg-blue-100 text-blue-600' : 'bg-slate-100 text-slate-600'
                    }`}>
                      <QrCode className="w-6 h-6" />
                    </div>
                    <div>
                      <div className="font-semibold text-slate-900">QR Code Payment</div>
                      <div className="text-sm text-slate-600">Scan & Pay via UPI</div>
                    </div>
                  </div>
                  {paymentMethod === 'qr' && (
                    <div className="w-6 h-6 rounded-full bg-blue-500 flex items-center justify-center">
                      <CheckCircle className="w-4 h-4 text-white" />
                    </div>
                  )}
                </button>

                <button
                  onClick={() => handlePaymentMethodChange('cash')}
                  className={`w-full p-4 rounded-xl border-2 flex items-center justify-between transition-all duration-300 ${
                    paymentMethod === 'cash'
                      ? 'border-green-500 bg-green-50'
                      : 'border-slate-200 hover:border-green-300'
                  }`}
                >
                  <div className="flex items-center">
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center mr-3 ${
                      paymentMethod === 'cash' ? 'bg-green-100 text-green-600' : 'bg-slate-100 text-slate-600'
                    }`}>
                      <Receipt className="w-6 h-6" />
                    </div>
                    <div>
                      <div className="font-semibold text-slate-900">Cash on Delivery</div>
                      <div className="text-sm text-slate-600">Pay when we deliver</div>
                    </div>
                  </div>
                  {paymentMethod === 'cash' && (
                    <div className="w-6 h-6 rounded-full bg-green-500 flex items-center justify-center">
                      <CheckCircle className="w-4 h-4 text-white" />
                    </div>
                  )}
                </button>
              </div>

              {/* QR Payment Section */}
              {paymentMethod === 'qr' && !showQR && !qrScanned && (
                <Button
                  onClick={handleShowQR}
                  variant="primary"
                  className="w-full py-3"
                >
                  <span className="flex items-center justify-center">
                    <QrCode className="w-5 h-5 mr-2" />
                    Show Payment QR Code
                  </span>
                </Button>
              )}

              {/* QR Display */}
              {paymentMethod === 'qr' && showQR && !qrScanned && (
                <div className="space-y-4">
                  <div className="text-center">
                    <h4 className="font-bold text-slate-900 mb-2">Scan QR to Pay</h4>
                    <p className="text-sm text-slate-600 mb-4">Use any UPI app to scan and pay ₹{subscriptionData.totalAmount}</p>
                  </div>
                  
                  {/* QR Code Display */}
                  <div className="relative">
                    <div className="bg-gradient-to-br from-blue-50 to-sky-50 rounded-2xl p-8 border-2 border-blue-200">
                      {/* Simulated QR Code - In production, generate actual QR */}
                      <div className="w-full aspect-square bg-gradient-to-br from-blue-100 to-sky-100 rounded-xl relative overflow-hidden border-4 border-white">
                        {/* QR Pattern Simulation */}
                        <div className="absolute inset-4 bg-black rounded-lg"></div>
                        <div className="absolute top-6 left-6 w-12 h-12 bg-white rounded-lg"></div>
                        <div className="absolute top-6 right-6 w-12 h-12 bg-white rounded-lg"></div>
                        <div className="absolute bottom-6 left-6 w-12 h-12 bg-white rounded-lg"></div>
                        
                        {/* Center Pattern */}
                        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-16 h-16 bg-white rounded-xl flex items-center justify-center">
                          <div className="w-10 h-10 bg-black rounded-md"></div>
                        </div>
                        
                        {/* Text */}
                        <div className="absolute bottom-4 left-0 right-0 text-center">
                          <div className="text-xs font-bold text-slate-700">Steemer Services</div>
                          <div className="text-xs text-slate-600">₹{subscriptionData.totalAmount}</div>
                        </div>
                      </div>
                    </div>
                    
                    <div className=" top-4 right-4 bg-white/90 backdrop-blur-sm rounded-full p-2 shadow-lg">
                      <img src={qrcode} alt="qrcode" className='w-full h-full mb-6' />
                     
                     <Camera className="w-5 h-5 text-blue-600" />
                    </div>
                  </div>

                  <div className="bg-gradient-to-r from-blue-50 to-sky-50 rounded-xl p-4 border border-blue-200">
                    <div className="flex items-center mb-2">
                      <Smartphone className="w-4 h-4 text-blue-600 mr-2" />
                      <span className="text-sm font-semibold text-blue-700">Scan Instructions:</span>
                    </div>
                    <ol className="text-sm text-slate-700 space-y-1 ml-6 list-decimal">
                      <li>Open your UPI app (GPay, PhonePe, Paytm)</li>
                      <li>Tap on "Scan QR Code"</li>
                      <li>Point camera at this QR code</li>
                      <li>Enter amount: ₹{subscriptionData.totalAmount}</li>
                      <li>Complete the payment</li>
                    </ol>
                  </div>

                  <Button
                    onClick={handleScanQR}
                    variant="primary"
                    className="w-full py-3"
                    disabled={scanning}
                  >
                    {scanning ? (
                      <span className="flex items-center justify-center">
                        <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                        Scanning Payment...
                      </span>
                    ) : (
                      <span className="flex items-center justify-center">
                        <CheckCircle className="w-5 h-5 mr-2" />
                        I've Scanned & Paid
                      </span>
                    )}
                  </Button>

                  <button
                    onClick={() => setShowQR(false)}
                    className="w-full text-sm text-slate-600 hover:text-slate-900 text-center"
                  >
                    Cancel QR Payment
                  </button>
                </div>
              )}

              {/* Cash Payment Option */}
              {paymentMethod === 'cash' && (
                <div className="space-y-4">
                  <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl p-4 border border-green-200">
                    <h4 className="font-bold text-green-900 mb-2">Cash Payment Instructions</h4>
                    <ul className="text-sm text-green-800 space-y-2">
                      <li className="flex items-start">
                        <CheckCircle className="w-4 h-4 mr-2 mt-0.5 flex-shrink-0" />
                        Our delivery agent will collect payment during your first pickup
                      </li>
                      <li className="flex items-start">
                        <CheckCircle className="w-4 h-4 mr-2 mt-0.5 flex-shrink-0" />
                        Please keep exact amount ready: ₹{subscriptionData.totalAmount}
                      </li>
                      <li className="flex items-start">
                        <CheckCircle className="w-4 h-4 mr-2 mt-0.5 flex-shrink-0" />
                        You'll receive a digital receipt after payment
                      </li>
                    </ul>
                  </div>
                </div>
              )}
            </div>

            {/* Status Card */}
            <div className="bg-white rounded-2xl p-6 shadow-xl border border-emerald-200">
              <div className="text-center mb-6">
                <div className={`w-16 h-16 mx-auto mb-4 rounded-full flex items-center justify-center ${
                  qrScanned ? 'bg-gradient-to-br from-green-500 to-emerald-500' : 'bg-gradient-to-br from-amber-500 to-orange-500'
                }`}>
                  {qrScanned ? (
                    <CheckCircle className="w-8 h-8 text-white" />
                  ) : (
                    <Clock className="w-8 h-8 text-white" />
                  )}
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-2">Payment Status</h3>
                <div className={`inline-flex items-center px-4 py-2 rounded-full border ${
                  qrScanned 
                    ? 'bg-gradient-to-r from-green-100 to-emerald-100 border-green-300'
                    : 'bg-gradient-to-r from-amber-100 to-orange-100 border-amber-300'
                }`}>
                  <span className={`font-semibold ${qrScanned ? 'text-green-800' : 'text-amber-800'}`}>
                    {qrScanned ? 'Payment Verified' : 'Pending Payment'}
                  </span>
                </div>
              </div>

              {/* Progress Indicator */}
              <div className="mb-6">
                <div className="flex justify-between text-sm text-slate-600 mb-2">
                  <span>Plan Selected</span>
                  <span>Payment</span>
                  <span>Activated</span>
                </div>
                <div className="h-2 bg-slate-200 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-sky-500 
                    to-blue-600 rounded-full transition-all duration-1000"
                    style={{ width: qrScanned ? '66%' : '33%' }}
                  ></div>
                </div>
              </div>

              {!qrScanned && (
                <p className="text-sm text-slate-600 text-center">
                  Complete payment to activate your subscription
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Confirm Subscription Button */}
        {qrScanned && (
          <div className={`max-w-md mx-auto mb-8 transition-all duration-700 transform ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-20 opacity-0'}`}>
       

            <Button
              onClick={handleConfirmSubscription}
              variant="primary"
              className="w-full py-4 text-lg"
              disabled={loading}
            >
              {loading ? (
                <span className="flex items-center justify-center">
                  <Loader2 className="w-6 h-6 mr-3 animate-spin" />
                  Activating Subscription...
                </span>
              ) : (
                <span className="flex items-center justify-center">
                  <CheckCircle className="w-6 h-6 mr-3" />
                  Confirm & Activate Subscription
                </span>
              )}
            </Button>
          </div>
        )}

        {/* Alternative Actions */}
        {!qrScanned && (
          <div className={`flex flex-col sm:flex-row gap-4 justify-center transition-all duration-700 transform ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-20 opacity-0'}`} style={{ transitionDelay: '600ms' }}>
            <Button
              onClick={handleGoToDashboard}
              variant="outline"
              className="flex-1 sm:flex-none px-8 py-4 text-lg"
            >
              <span className="flex items-center justify-center">
                <Home className="w-6 h-6 mr-3" />
                Go to Dashboard
              </span>
            </Button>
            <Button
              onClick={handleViewPlan}
              variant="outline"
              className="flex-1 sm:flex-none px-8 py-4 text-lg"
            >
              <span className="flex items-center justify-center">
                <FileText className="w-6 h-6 mr-3" />
                Back to Plan Details
              </span>
            </Button>
          </div>
        )}

        {/* Help Text */}
        <div className={`text-center mt-8 transition-all duration-700 transform ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-20 opacity-0'}`} style={{ transitionDelay: '800ms' }}>
          <p className="text-slate-600">
            Need help with payment? Contact us at{' '}
            <a href="tel:+911234567890" className="text-blue-600 hover:underline font-semibold">
              +91 63831 48182
            </a>
          </p>
          <p className="text-sm text-slate-500 mt-2">
            Your subscription will be activated immediately after payment confirmation
          </p>
        </div>
      </div>
    </div>
  );
};

export default ConfirmationPage;