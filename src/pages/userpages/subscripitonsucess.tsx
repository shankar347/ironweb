import React, { useState, useEffect, useContext } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { 
  CheckCircle, 
  PartyPopper, 
  Sparkles,
  Calendar,
  CreditCard,
  Mail,
  Phone,
  Home,
  Download,
  Share2,
  ArrowRight,
  Clock,
  Package,
  Shield,
  Truck,
  Crown,
  Award,
  Gift,
  Copy,
  Check,
  Receipt,
  User,
  CircleCheckBig,
  Loader,
  FileText
} from 'lucide-react';
import { SteamContext } from '../../hooks/steamcontext';
import Button from '../../components/ui/Newbutton';
import { toast } from 'react-toastify';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

const SubscriptionSuccess = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { User: currentUser } = useContext(SteamContext);
  const [isVisible, setIsVisible] = useState(false);
  const [copied, setCopied] = useState(false);
  const [showAnimation, setShowAnimation] = useState(true);
  const [progress, setProgress] = useState(0);
  const [isDownloading, setIsDownloading] = useState(false);

  // Get subscription data from navigation state
  const subscription = location.state?.subscription;
  const orderId = location.state?.orderId;

  useEffect(() => {
    setIsVisible(true);
    
    // Progress bar animation
    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          return 100;
        }
        return prev + 2;
      });
    }, 30);

    // Hide animation after 3 seconds
    const timer = setTimeout(() => setShowAnimation(false), 3000);
    
    // If no subscription data, redirect to plans
    if (!subscription) {
      toast.error('No subscription data found');
      navigate('/plans');
    }

    return () => {
      clearTimeout(timer);
      clearInterval(interval);
    };
  }, [subscription, navigate]);

  // Format date
  const formatDate = (dateString) => {
    const options = { 
      day: 'numeric', 
      month: 'long', 
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    };
    return new Date(dateString).toLocaleDateString('en-IN', options);
  };

  // Format date for invoice (YYYY-MM-DD)
  const formatDateForInvoice = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-IN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    }).split('/').join('-');
  };

  // Calculate expiry date (30 days from start for popular plan)
  const getExpiryDate = () => {
    if (!subscription) return null;
    if (subscription.enddate) {
      return formatDate(subscription.enddate);
    }
    if (subscription.plan === 'Popular Plan') {
      const expiry = new Date(subscription.startdate);
      expiry.setDate(expiry.getDate() + 30);
      return formatDate(expiry);
    }
    return 'Based on credits usage';
  };

  // Get expiry date for invoice
  const getExpiryDateForInvoice = () => {
    if (!subscription) return 'N/A';
    if (subscription.enddate) {
      return formatDateForInvoice(subscription.enddate);
    }
    if (subscription.plan === 'Popular Plan') {
      const expiry = new Date(subscription.startdate);
      expiry.setDate(expiry.getDate() + 30);
      return formatDateForInvoice(expiry);
    }
    return 'Based on credits';
  };

  // Get plan icon
  const getPlanIcon = () => {
    if (!subscription) return Gift;
    switch(subscription.plan) {
      case 'Popular Plan':
        return Crown;
      case 'Family Plan':
        return Gift;
      default:
        return Award;
    }
  };

  // Copy order ID to clipboard
  const copyOrderId = () => {
    if (orderId) {
      navigator.clipboard.writeText(orderId);
      setCopied(true);
      toast.success('Order ID copied to clipboard!');
      setTimeout(() => setCopied(false), 3000);
    }
  };

  // Generate PDF Invoice
  const generateInvoice = async () => {
    setIsDownloading(true);
    
    try {
      const doc = new jsPDF();
      
      // Company Details
      doc.setFillColor(59, 130, 246);
      doc.rect(0, 0, 210, 40, 'F');
      
      doc.setTextColor(255, 255, 255);
      doc.setFontSize(24);
      doc.setFont('helvetica', 'bold');
      doc.text('Steemer', 105, 15, { align: 'center' });
      
      doc.setFontSize(16);
      doc.setFont('helvetica', 'bold');
      doc.text('Professional Laundry & Ironing Service', 105, 25, { align: 'center' });
      
      doc.setFontSize(12);
      doc.setFont('helvetica', 'normal');
      doc.text('INVOICE', 105, 35, { align: 'center' });
      
      // Invoice Details
      doc.setTextColor(0, 0, 0);
      doc.setFontSize(10);
      
      const invoiceNo = `INV-${new Date().getFullYear()}${(new Date().getMonth() + 1).toString().padStart(2, '0')}${Math.floor(Math.random() * 1000).toString().padStart(3, '0')}`;
      const currentDate = new Date().toLocaleDateString('en-IN');
      
      doc.text(`Invoice No: ${invoiceNo}`, 20, 50);
      doc.text(`Date: ${currentDate}`, 20, 57);
      doc.text(`Order ID: ${orderId || 'N/A'}`, 20, 64);
      
      // Customer Details
      doc.setFontSize(12);
      doc.setFont('helvetica', 'bold');
      doc.text('Bill To:', 20, 80);
      
      doc.setFontSize(10);
      doc.setFont('helvetica', 'normal');
      doc.text(`Name: ${currentUser?.name || currentUser?.email?.split('@')[0] || 'Customer'}`, 20, 90);
      doc.text(`Email: ${currentUser?.email || 'N/A'}`, 20, 97);
      doc.text(`Phone: ${currentUser?.phoneno || 'N/A'}`, 20, 104);
      
      // Subscription Details
      doc.setFontSize(12);
      doc.setFont('helvetica', 'bold');
      doc.text('Subscription Details:', 20, 120);
      
      doc.setFontSize(10);
      doc.setFont('helvetica', 'normal');
      doc.text(`Plan: ${subscription.plan}`, 20, 130);
      doc.text(`Start Date: ${formatDateForInvoice(subscription.startdate)}`, 20, 137);
      doc.text(`Valid Until: ${getExpiryDateForInvoice()}`, 20, 144);
      doc.text(`Total Credits: ${subscription.credits}`, 20, 151);
      
      // Garments Table
      if (subscription.cloths && subscription.cloths.length > 0) {
        const tableData = subscription.cloths.map(cloth => [
          cloth.name,
          cloth.count.toString(),
          'Included'
        ]);
        
        autoTable(doc, {
          startY: 165,
          head: [['Garment', 'Quantity', 'Type']],
          body: tableData,
          theme: 'striped',
          headStyles: { fillColor: [59, 130, 246], textColor: [255, 255, 255] },
          styles: { fontSize: 9 }
        });
      }
      
      // Payment Summary
      const finalY = doc.lastAutoTable?.finalY || 180;
      
      doc.setFontSize(12);
      doc.setFont('helvetica', 'bold');
      doc.text('Payment Summary:', 20, finalY + 20);
      
      doc.setFontSize(10);
      doc.setFont('helvetica', 'normal');
      
      const col1 = 20;
      const col2 = 150;
      
      doc.text('Plan Price:', col1, finalY + 30);
      doc.text(`₹${subscription.totalamount}`, col2, finalY + 30);
      
      doc.setFont('helvetica', 'bold');
      doc.text('Total Amount:', col1, finalY + 40);
      doc.text(`₹${subscription.totalamount}`, col2, finalY + 40);
      
      doc.setFontSize(8);
      doc.setFont('helvetica', 'italic');
      doc.setTextColor(100, 100, 100);
      doc.text('* This is a computer generated invoice', 20, finalY + 55);
      
      // Footer
      doc.setFillColor(59, 130, 246);
      doc.rect(0, 280, 210, 17, 'F');
      
      doc.setTextColor(255, 255, 255);
      doc.setFontSize(8);
      doc.setFont('helvetica', 'normal');
      doc.text('Thank you for choosing Laundry Service!', 105, 290, { align: 'center' });
      doc.text('For any queries, contact: steemerservicescontactin@gmail.com', 105, 297, { align: 'center' });
      
      // Save PDF
      doc.save(`Steemer_${subscription.plan}_${formatDateForInvoice(new Date())}.pdf`);
      
      toast.success('Invoice downloaded successfully!');
    } catch (error) {
      console.error('Error generating invoice:', error);
      toast.error('Failed to generate invoice');
    } finally {
      setIsDownloading(false);
    }
  };

  // Share subscription
  const shareSubscription = () => {
    if (navigator.share) {
      navigator.share({
        title: 'My Laundry Subscription',
        text: `I just subscribed to ${subscription?.plan} on Laundry Service!`,
        url: window.location.origin
      });
    } else {
      toast.info('Share feature not supported on this browser');
    }
  };

  const PlanIcon = getPlanIcon();

  if (!subscription) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50 overflow-hidden">
      {/* Success Animation Overlay */}
      {showAnimation && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-white/90 backdrop-blur-sm">
          <div className="text-center">
            {/* Animated Circle with Check */}
            <div className="relative mx-auto mb-8">
              {/* Progress Circle */}
              <svg className="w-32 h-32 mx-auto transform -rotate-90">
                <circle
                  cx="64"
                  cy="64"
                  r="58"
                  fill="none"
                  stroke="#E2E8F0"
                  strokeWidth="6"
                />
                <circle
                  cx="64"
                  cy="64"
                  r="58"
                  fill="none"
                  stroke="#3B82F6"
                  strokeWidth="6"
                  strokeLinecap="round"
                  strokeDasharray={`${2 * Math.PI * 58}`}
                  strokeDashoffset={`${2 * Math.PI * 58 * (1 - progress / 100)}`}
                  className="transition-all duration-300"
                />
              </svg>
              
              {/* Check Icon */}
              <div className={`absolute inset-0 flex items-center justify-center transition-all duration-500 transform ${progress === 100 ? 'scale-100 opacity-100' : 'scale-50 opacity-0'}`}>
                <div className="w-20 h-20 bg-blue-600 rounded-full flex items-center justify-center animate-pulse">
                  <CheckCircle className="w-12 h-12 text-white" />
                </div>
              </div>
            </div>

            {/* Success Message */}
            <h2 className="text-2xl font-bold text-slate-900 mb-2 animate-pulse">
              Payment Successful!
            </h2>
            <p className="text-slate-600">
              {progress < 100 ? 'Processing...' : 'Redirecting...'}
            </p>

            {/* Progress Bar */}
            <div className="w-64 h-2 bg-slate-200 rounded-full mt-4 mx-auto overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-blue-600 to-blue-400 rounded-full transition-all duration-300"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        </div>
      )}

      {/* Animated Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-48 sm:w-72 h-48 sm:h-72 bg-gradient-to-br from-blue-300/20 to-blue-500/20 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse"></div>
        <div className="absolute top-40 right-10 w-64 sm:w-96 h-64 sm:h-96 bg-gradient-to-br from-blue-200/20 to-blue-400/20 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse" style={{ animationDelay: '1s' }}></div>
        <div className="absolute -bottom-20 left-1/2 w-64 sm:w-96 h-64 sm:h-96 bg-gradient-to-br from-blue-300/20 to-sky-300/20 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse" style={{ animationDelay: '2s' }}></div>
        
        {/* Grid Pattern */}
        <div className="absolute inset-0" style={{
          backgroundImage: `radial-gradient(circle at 1px 1px, rgba(59, 130, 246, 0.03) 1px, transparent 0)`,
          backgroundSize: '40px 40px'
        }}></div>
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 relative z-10">
        {/* Success Header */}
        <div className={`text-center mb-12 transition-all duration-1000 transform ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
          <div className="inline-flex items-center justify-center mb-6">
            <div className="relative">
              <div className="w-24 h-24 bg-gradient-to-br from-blue-600 to-blue-400 rounded-full flex items-center justify-center shadow-2xl">
                <CircleCheckBig className="w-12 h-12 text-white" />
              </div>
              <div className="absolute -top-2 -right-2">
                <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center animate-ping opacity-75"></div>
                <Sparkles className="w-8 h-8 text-blue-600 absolute top-0 right-0" />
              </div>
            </div>
          </div>
          
          <div className="inline-flex items-center justify-center mb-4">
            <span className="px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-500 text-white text-sm font-bold rounded-full shadow-lg shadow-blue-500/30">
               Payment Confirmed
            </span>
          </div>
          
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold 
            bg-gradient-to-r from-blue-700 via-blue-600 to-sky-600 bg-clip-text text-transparent mb-4
            drop-shadow-lg">
            Thank You for Subscribing!
          </h1>
          
          <p className="text-lg sm:text-xl text-slate-600 max-w-3xl mx-auto leading-relaxed">
            Your subscription has been successfully activated. Get ready for fresh, perfectly pressed clothes!
          </p>
        </div>

        {/* Success Card */}
        <div className={`max-w-4xl mx-auto transition-all duration-1000 delay-300 transform ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
          <div className="bg-white/95 backdrop-blur-sm rounded-3xl shadow-2xl overflow-hidden border border-blue-100">
            
            {/* Plan Header */}
            <div className="bg-gradient-to-r from-blue-600 to-blue-500 p-8 text-white relative overflow-hidden">
              <div className="absolute inset-0 bg-black/5"></div>
              <div className="absolute -right-12 -top-12 w-48 h-48 bg-white/10 rounded-full"></div>
              <div className="absolute -left-12 -bottom-12 w-48 h-48 bg-white/10 rounded-full"></div>
              
              <div className="relative flex items-center justify-between flex-wrap gap-4">
                <div className="flex items-center">
                  <div className="w-16 h-16 bg-white/20 backdrop-blur rounded-2xl flex items-center justify-center mr-4">
                    <PlanIcon className="w-8 h-8 text-white" />
                  </div>
                  <div>
                    <h2 className="text-3xl font-bold mb-1">{subscription.plan}</h2>
                    <p className="text-white/90 text-lg">Subscription Activated</p>
                  </div>
                </div>
                <div className="bg-white/20 backdrop-blur rounded-2xl px-6 py-3">
                  <p className="text-sm text-white/80">Amount Paid</p>
                  <p className="text-3xl font-bold">₹{subscription.totalamount}</p>
                </div>
              </div>
            </div>

            {/* Subscription Details */}
            <div className="p-8">
              {/* Status Badge */}
              <div className="flex items-center justify-center mb-8">
                <div className="inline-flex items-center px-6 py-3 bg-blue-50 rounded-full border border-blue-200">
                  <CheckCircle className="w-6 h-6 text-blue-600 mr-2" />
                  <span className="text-blue-800 font-semibold text-lg">Active Subscription</span>
                </div>
              </div>

              {/* Key Details Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                {/* Subscription Period */}
                <div className="bg-gradient-to-br from-slate-50 to-white rounded-2xl p-6 border border-blue-100 hover:shadow-lg transition-shadow">
                  <div className="flex items-center mb-3">
                    <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center mr-3">
                      <Calendar className="w-4 h-4 text-blue-600" />
                    </div>
                    <h3 className="font-semibold text-slate-900">Subscription Period</h3>
                  </div>
                  <p className="text-slate-700 ml-11">
                    <span className="block text-sm text-slate-500">Started</span>
                    <span className="font-medium">{formatDate(subscription.startdate)}</span>
                  </p>
                  {subscription.enddate && (
                    <p className="text-slate-700 mt-2 ml-11">
                      <span className="block text-sm text-slate-500">Valid until</span>
                      <span className="font-medium">{getExpiryDate()}</span>
                    </p>
                  )}
                </div>

                {/* Credits & Garments */}
                <div className="bg-gradient-to-br from-slate-50 to-white rounded-2xl p-6 border border-blue-100 hover:shadow-lg transition-shadow">
                  <div className="flex items-center mb-3">
                    <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center mr-3">
                      <Package className="w-4 h-4 text-blue-600" />
                    </div>
                    <h3 className="font-semibold text-slate-900">Credits & Garments</h3>
                  </div>
                  <div className="ml-11">
                    <p className="text-slate-700">
                      <span className="block text-sm text-slate-500">Total Credits</span>
                      <span className="font-medium text-2xl text-blue-600">{subscription.credits}</span>
                    </p>
                    {subscription.cloths && subscription.cloths.length > 0 && (
                      <div className="mt-3">
                        <p className="text-sm text-slate-500 mb-2">Garments Selected:</p>
                        <div className="flex flex-wrap gap-2">
                          {subscription.cloths.map((cloth, idx) => (
                            <span key={idx} className="px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-sm border border-blue-200">
                              {cloth.name}: {cloth.count}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Payment Details */}
                <div className="bg-gradient-to-br from-slate-50 to-white rounded-2xl p-6 border border-blue-100 hover:shadow-lg transition-shadow">
                  <div className="flex items-center mb-3">
                    <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center mr-3">
                      <CreditCard className="w-4 h-4 text-blue-600" />
                    </div>
                    <h3 className="font-semibold text-slate-900">Payment Details</h3>
                  </div>
                  <div className="ml-11">
                    <p className="text-slate-700">
                      <span className="block text-sm text-slate-500">Transaction ID</span>
                      <span className="font-mono text-sm break-all bg-slate-50 p-1 rounded">{orderId || 'N/A'}</span>
                    </p>
                    <p className="text-slate-700 mt-2">
                      <span className="block text-sm text-slate-500">Payment Method</span>
                      <span className="font-medium">Razorpay</span>
                    </p>
                  </div>
                </div>

                {/* Customer Details */}
                <div className="bg-gradient-to-br from-slate-50 to-white rounded-2xl p-6 border border-blue-100 hover:shadow-lg transition-shadow">
                  <div className="flex items-center mb-3">
                    <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center mr-3">
                      {currentUser ? (
                        <Home className="w-4 h-4 text-blue-600" />
                      ) : (
                        <Mail className="w-4 h-4 text-blue-600" />
                      )}
                    </div>
                    <h3 className="font-semibold text-slate-900">Customer Details</h3>
                  </div>
                  <div className="ml-11">
                    {currentUser ? (
                      <>
                        <p className="text-slate-700">
                          <span className="block text-sm text-slate-500">Name</span>
                          <span className="font-medium">{currentUser.name || currentUser.email?.split('@')[0]}</span>
                        </p>
                        <p className="text-slate-700 mt-2">
                          <span className="block text-sm text-slate-500">Email</span>
                          <span className="font-medium">{currentUser.email}</span>
                        </p>
                        {currentUser.phoneno && (
                          <p className="text-slate-700 mt-2">
                            <span className="block text-sm text-slate-500">Phone</span>
                            <span className="font-medium">{currentUser.phoneno}</span>
                          </p>
                        )}
                      </>
                    ) : (
                      <p className="text-slate-500">Customer information not available</p>
                    )}
                  </div>
                </div>
              </div>

              {/* Order ID Copy */}
              {orderId && (
                <div className="mb-8 p-4 bg-blue-50 rounded-xl border border-blue-200">
                  <div className="flex items-center justify-between flex-wrap gap-4">
                    <div className="flex items-center">
                      <Receipt className="w-5 h-5 text-blue-600 mr-2" />
                      <div>
                        <p className="text-sm text-blue-600 mb-1">Order ID</p>
                        <p className="font-mono text-sm break-all text-slate-700">{orderId}</p>
                      </div>
                    </div>
                    <button
                      onClick={copyOrderId}
                      className="flex items-center px-4 py-2 bg-white rounded-lg border border-blue-200 hover:border-blue-500 hover:bg-blue-50 transition-all"
                    >
                      {copied ? (
                        <>
                          <Check className="w-4 h-4 text-blue-600 mr-2" />
                          <span className="text-sm text-blue-600">Copied!</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-4 h-4 text-blue-600 mr-2" />
                          <span className="text-sm text-blue-600">Copy Order ID</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              )}

              {/* Benefits Section */}
              <div className="mb-8">
                <h3 className="text-xl font-bold text-slate-900 mb-4 flex items-center">
                  <Sparkles className="w-5 h-5 text-blue-600 mr-2" />
                  What's Included
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="flex items-center p-3 bg-blue-50 rounded-lg border border-blue-100">
                    <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center mr-3">
                      <Truck className="w-4 h-4 text-white" />
                    </div>
                    <span className="text-sm text-slate-700">3 Free deliveries per month</span>
                  </div>
                  <div className="flex items-center p-3 bg-blue-50 rounded-lg border border-blue-100">
                    <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center mr-3">
                      <Shield className="w-4 h-4 text-white" />
                    </div>
                    <span className="text-sm text-slate-700">Quality guaranteed service</span>
                  </div>
                  <div className="flex items-center p-3 bg-blue-50 rounded-lg border border-blue-100">
                    <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center mr-3">
                      <Package className="w-4 h-4 text-white" />
                    </div>
                    <span className="text-sm text-slate-700">Safe & hygienic packaging</span>
                  </div>
                  <div className="flex items-center p-3 bg-blue-50 rounded-lg border border-blue-100">
                    <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center mr-3">
                      <Clock className="w-4 h-4 text-white" />
                    </div>
                    <span className="text-sm text-slate-700">On-time delivery guaranteed</span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button
                  onClick={() => navigate('/dashboard')}
                  className="px-8 py-4 bg-gradient-to-r from-blue-600 to-blue-500 text-white rounded-xl font-semibold hover:shadow-xl hover:shadow-blue-500/30 transition-all duration-300 flex items-center justify-center transform hover:scale-105"
                >
                  Go to Dashboard
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
                
                <Button
                  onClick={generateInvoice}
                  disabled={isDownloading}
                  className="px-8 py-4 bg-white border-2 border-blue-600 text-blue-600 rounded-xl font-semibold hover:bg-blue-50 transition-all duration-300 flex items-center justify-center transform hover:scale-105"
                >
                  {isDownloading ? (
                    <>
                      <Loader className="w-5 h-5 mr-2 animate-spin" />
                      Generating...
                    </>
                  ) : (
                    <>
                      <FileText className="w-5 h-5 mr-2" />
                      Download Invoice
                    </>
                  )}
                </Button>
                
                {/* <Button
                  onClick={shareSubscription}
                  variant="outline"
                  className="px-8 py-4 border-2 border-slate-300 text-slate-700 rounded-xl font-semibold hover:bg-slate-50 transition-all duration-300 flex items-center justify-center"
                >
                  <Share2 className="w-5 h-5 mr-2" />
                  Share
                </Button> */}
              </div>
            </div>
          </div>

          {/* Additional Info */}
          <div className="mt-8 text-center">
            <div className="inline-flex items-center bg-blue-50 rounded-full px-6 py-3 border border-blue-200">
              <Mail className="w-4 h-4 text-blue-600 mr-2" />
              <p className="text-slate-600">
                Confirmation sent to <strong className="text-blue-600">{currentUser?.email}</strong>
              </p>
            </div>
            <p className="text-sm text-slate-500 mt-4">
              For any queries, contact our support team at{' '}
              <a href="mailto:support@laundryservice.com" className="text-blue-600 hover:underline">
                steemerservicescontactin@gmail.com
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SubscriptionSuccess;