import { Navigation, Package, Truck, Warehouse, CheckCircle2, Clock, MapPin, LucideIcon } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { Card } from '../../components/ui/card';
import { toast } from 'react-toastify';
import { API_URL } from '../../hooks/tools';
import Previousorders from '../../components/previousorders';

interface OrderFlow {
  step: string;
  completed: boolean;
  completedAt?: string;
}

interface UserAddress {
  _id: string;
}

interface LastOrder {
  _id: string;
  userid: string;
  user_address: UserAddress;
  order_date: string;
  order_totalamount: string;
  order_totalcloths: string;
  order_slot: string;
  order_paymenttype: string;
  order_flow: OrderFlow[];
}

const Trackorder: React.FC = () => {
  const [lastorder, setlastorder] = useState<LastOrder | null>(null);
  const [userorders, setuseroders] = useState([]);
  const [loading, setLoading] = useState<boolean>(true);
  console.log(userorders);

  useEffect(() => {
    const getUserorders = async () => {
      const res = await fetch(`${API_URL}/orders/getuserorders`, {
        credentials: 'include'
      });

      const data = await res.json();

      // if (data?.error) {
      //   toast.error(data?.error);
      //   return;
      // }
      setuseroders(data?.data);
    };
    getUserorders();
  }, []);

  useEffect(() => {
    const getUserorders = async (): Promise<void> => {
      try {
        const res = await fetch(`${API_URL}/orders/getusrlastorder`, {
          credentials: 'include'
        });
        const data = await res.json();

        // if (data?.error) {
        //   toast.error(data?.error);
        //   setLoading(false);
        //   return;
        // }

        setlastorder(data?.data);
        setLoading(false);
      } catch (error) {
        toast.error('Error in fetching orders');
        console.log(error);
        setLoading(false);
      }
    };
    getUserorders();
  }, []);

  const getStepIcon = (step: string): LucideIcon => {
    const iconMap: Record<string, LucideIcon> = {
      'Order placed': Package,
      'Agent arriving': Truck,
      'Collected clothes': MapPin,
      'Clothes reached warehouse': Warehouse,
      'Clothes arriving to customer': Truck,
      'Clothes delivered': CheckCircle2
    };
    return iconMap[step] || Package;
  };

  const formatDate = (dateString: string | undefined): string => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleString('en-IN', {
      day: '2-digit',
      month: 'short',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });
  };

  const getCurrentStep = (): number => {
    if (!lastorder?.order_flow) return 0;
    const index = lastorder.order_flow.findIndex(flow => !flow.completed);
    return index === -1 ? lastorder.order_flow.length : index;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 py-20 flex items-center justify-center px-4">
        <div className="animate-pulse text-gray-500 text-center">Loading order details...</div>
      </div>
    );
  }

  if (!lastorder) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 py-20 flex items-center justify-center px-4">
        <div className="text-center">
          <Package className="w-12 h-12 sm:w-16 sm:h-16 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-500 text-base sm:text-lg">No orders found</p>
        </div>
      </div>
    );
  }

  const currentStepIndex = getCurrentStep();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 py-8 sm:py-12 px-4">
      <div className="container mx-auto max-w-4xl">
        {/* Header */}
        <div className="text-center mb-6 sm:mb-8">
          <div className="bg-gradient-to-r from-blue-600 to-indigo-600 w-16 h-16 sm:w-20 sm:h-20 rounded-2xl flex items-center justify-center mx-auto mb-3 sm:mb-4 shadow-lg">
            <Navigation className="w-8 h-8 sm:w-10 sm:h-10 text-white" />
          </div>
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-800 mb-2">
            Track Your Order
          </h1>
          <p className="text-sm sm:text-base text-gray-600">Real-time updates on your laundry service</p>
        </div>

        {/* Order Summary Card */}
        <Card className="bg-white rounded-xl sm:rounded-2xl shadow-xl p-4 sm:p-6 mb-6 sm:mb-8 border-0">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
            <div className="text-center p-3 sm:p-4 bg-blue-50 rounded-lg sm:rounded-xl">
              <p className="text-xs sm:text-sm text-gray-600 mb-1">Order ID</p>
              <p className="font-semibold text-gray-800 text-xs sm:text-sm">...{lastorder._id.slice(-6)}</p>
            </div>
            <div className="text-center p-3 sm:p-4 bg-indigo-50 rounded-lg sm:rounded-xl">
              <p className="text-xs sm:text-sm text-gray-600 mb-1">Total Items</p>
              <p className="font-semibold text-gray-800 text-sm sm:text-base">{lastorder.order_totalcloths} clothes</p>
            </div>
            <div className="text-center p-3 sm:p-4 bg-purple-50 rounded-lg sm:rounded-xl">
              <p className="text-xs sm:text-sm text-gray-600 mb-1">Amount</p>
              <p className="font-semibold text-gray-800 text-sm sm:text-base">₹{lastorder.order_totalamount}</p>
            </div>
            <div className="text-center p-3 sm:p-4 bg-pink-50 rounded-lg sm:rounded-xl">
              <p className="text-xs sm:text-sm text-gray-600 mb-1">Time Slot</p>
              <p className="font-semibold text-gray-800 text-xs sm:text-sm">{lastorder.order_slot}</p>
            </div>
          </div>
        </Card>

        {/* Progress Tracker */}
        <Card className="bg-white rounded-xl sm:rounded-2xl shadow-xl p-4 sm:p-6 md:p-8 border-0">
          <div className="relative">
            {lastorder.order_flow.map((flow: OrderFlow, index: number) => {
              const Icon = getStepIcon(flow.step);
              const isCompleted = flow.completed;
              const isCurrent = index === currentStepIndex;
              const isLast = index === lastorder.order_flow.length - 1;

              return (
                <div key={index} className="relative">
                  {/* Connector Line */}
                  {!isLast && (
                    <div
                      className={`absolute left-5 sm:left-6 top-12 sm:top-14 w-0.5 h-16 sm:h-20 transition-all duration-500 ${isCompleted ? 'bg-gradient-to-b from-green-500 to-green-400' : 'bg-gray-200'
                        }`}
                    />
                  )}

                  {/* Step Container */}
                  <div className="flex items-start gap-3 sm:gap-4 pb-6 sm:pb-8 relative">
                    {/* Icon Circle */}
                    <div className={`relative z-10 flex-shrink-0 w-10 h-10 sm:w-12 sm:h-12 rounded-full flex items-center justify-center transition-all duration-300 ${isCompleted
                      ? 'bg-gradient-to-br from-green-500 to-green-600 shadow-lg shadow-green-200'
                      : isCurrent
                        ? 'bg-gradient-to-br from-blue-500 to-indigo-600 shadow-lg shadow-blue-200'
                        : 'bg-gray-200'
                      }`}>
                      <Icon className={`w-5 h-5 sm:w-6 sm:h-6 ${isCompleted || isCurrent ? 'text-white' : 'text-gray-400'
                        } ${isCurrent ? 'animate-pulse' : ''}`} />
                    </div>

                    {/* Content */}
                    <div className="flex-1 pt-0.5 sm:pt-1 min-w-0">
                      <div className="flex items-start sm:items-center justify-between mb-1 gap-2">
                        <h3 className={`font-semibold text-sm sm:text-base md:text-lg ${isCompleted ? 'text-gray-800' : isCurrent ? 'text-blue-600' : 'text-gray-400'
                          }`}>
                          {flow.step}
                        </h3>
                        {isCompleted && (
                          <span className="flex items-center gap-1 text-green-600 text-xs sm:text-sm font-medium flex-shrink-0">
                            <CheckCircle2 className="w-3 h-3 sm:w-4 sm:h-4" />
                            <span className="hidden sm:inline">Completed</span>
                          </span>
                        )}
                        {isCurrent && (
                          <span className="flex items-center gap-1 text-blue-600 text-xs sm:text-sm font-medium flex-shrink-0">
                            <Clock className="w-3 h-3 sm:w-4 sm:h-4 animate-spin" />
                            <span className="hidden sm:inline">In Progress</span>
                          </span>
                        )}
                      </div>
                      {flow.completedAt && (
                        <p className="text-xs sm:text-sm text-gray-500">
                          {formatDate(flow.completedAt)}
                        </p>
                      )}
                      {isCurrent && (
                        <p className="text-xs sm:text-sm text-blue-600 mt-1 font-medium">
                          Your order is currently at this stage
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Estimated Delivery */}
          <div className="mt-4 sm:mt-6 p-3 sm:p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg sm:rounded-xl border border-blue-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs sm:text-sm text-gray-600 mb-1">Estimated Delivery</p>
                <p className="font-semibold text-sm sm:text-base text-gray-800">Within {lastorder.order_slot}</p>
              </div>
              <Clock className="w-6 h-6 sm:w-8 sm:h-8 text-blue-600 flex-shrink-0" />
            </div>
          </div>
        </Card>

        <Previousorders orders={userorders} />

        {/* Help Section */}
        <div className="text-center mt-6 sm:mt-8 text-gray-600 text-xs sm:text-sm px-4">
          <p>Need help? Contact support at <span className="text-blue-600 font-medium break-all">support@laundry.com</span></p>
        </div>
      </div>
    </div>
  );
};

export default Trackorder;