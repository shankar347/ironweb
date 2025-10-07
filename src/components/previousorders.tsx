import React, { useState } from 'react';
import { Package, Calendar, DollarSign, Clock, X, CheckCircle2, Truck, Warehouse, MapPin, IndianRupee } from 'lucide-react';
import { Card } from './ui/card';

interface OrderFlow {
  step: string;
  completed: boolean;
  completedAt?: string;
}

interface UserAddress {
  _id: string;
}

interface Order {
  _id: string;
  userid: string;
  user_address: UserAddress;
  order_date: string;
  order_totalamount: string;
  order_totalcloths: string;
  order_slot: string;
  order_paymenttype: string;
  order_flow: OrderFlow[];
  createdAt: string;
  updatedAt: string;
  __v: number;
}

interface PreviousordersProps {
  orders: Order[];
}

const Previousorders: React.FC<PreviousordersProps> = ({ orders }) => {
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    });
  };

  const formatDateTime = (dateString: string | undefined): string => {
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

  const getOrderStatus = (orderFlow: OrderFlow[]): string => {
    const allCompleted = orderFlow.every(flow => flow.completed);
    if (allCompleted) return 'Delivered';

    const completedCount = orderFlow.filter(flow => flow.completed).length;
    if (completedCount === 0) return 'Order Placed';

    return 'In Progress';
  };

  const getStatusColor = (status: string): string => {
    switch (status) {
      case 'Delivered':
        return 'bg-green-100 text-green-700 border-green-300';
      case 'In Progress':
        return 'bg-blue-100 text-blue-700 border-blue-300';
      default:
        return 'bg-yellow-100 text-yellow-700 border-yellow-300';
    }
  };

  const getStepIcon = (step: string) => {
    const iconMap: Record<string, React.ElementType> = {
      'Order placed': Package,
      'Agent arriving': Truck,
      'Collected clothes': MapPin,
      'Clothes reached warehouse': Warehouse,
      'Clothes arriving to customer': Truck,
      'Clothes delivered': CheckCircle2
    };
    return iconMap[step] || Package;
  };

  const getCurrentStep = (orderFlow: OrderFlow[]): number => {
    const index = orderFlow.findIndex(flow => !flow.completed);
    return index === -1 ? orderFlow.length : index;
  };

  if (!orders || orders.length === 0) {
    return (
      <div className="min-h-screen mt-10 bg-gradient-to-br from-gray-50 to-gray-100 py-8 sm:py-12 px-4">
        <div className="container mx-auto max-w-7xl">
          <div className="text-center py-12 sm:py-20">
            <Package className="w-16 h-16 sm:w-20 sm:h-20 text-gray-300 mx-auto mb-4" />
            <h2 className="text-xl sm:text-2xl font-semibold text-gray-600 mb-2">No Previous Orders</h2>
            <p className="text-sm sm:text-base text-gray-500">Your order history will appear here</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-xl sm:rounded-2xl p-4 
    sm:p-6 mb-6 sm:mb-8 border-0">
      <div className=" mx-auto">
        {/* Header */}
        <div className="mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-3xl 
          md:text-4xl font-bold text-gray-800 mb-2">Previous Orders</h1>
          <p className="text-sm sm:text-base text-gray-600">View your order history and track past orders</p>
        </div>

        {/* Orders Grid - Responsive layout */}
        <div className="grid grid-cols-1 
        sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-4 sm:gap-6">
          {orders.map((order) => {
            const status = getOrderStatus(order.order_flow);
            const statusColor = getStatusColor(status);

            return (
              <Card
                key={order._id}
                onClick={() => setSelectedOrder(order)}
                className="bg-white rounded-lg sm:rounded-xl shadow-md hover:shadow-xl transition-all duration-300 cursor-pointer border-0 overflow-hidden group"
              >
                {/* Status Badge */}
                <div className={`px-3 sm:px-4 py-2 ${statusColor} border-b`}>
                  <p className="text-xs sm:text-sm font-semibold text-center">{status}</p>
                </div>

                <div className="p-4 sm:p-6">
                  {/* Order ID */}
                  <div className="mb-3 sm:mb-4">
                    <p className="text-xs text-gray-500 mb-1">Order ID</p>
                    <p className="font-mono text-xs sm:text-sm font-semibold text-gray-800">
                      #{order._id.slice(-8).toUpperCase()}
                    </p>
                  </div>

                  {/* Order Details Grid */}
                  <div className="space-y-2.5 sm:space-y-3">
                    <div className="flex items-center gap-2.5 sm:gap-3">
                      <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-lg bg-blue-50 flex items-center justify-center flex-shrink-0">
                        <Calendar className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs text-gray-500">Order Date</p>
                        <p className="text-xs sm:text-sm font-semibold text-gray-800 truncate">
                          {formatDate(order.order_date)}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2.5 sm:gap-3">
                      <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-lg bg-green-50 flex items-center justify-center flex-shrink-0">
                        <IndianRupee className="w-4 h-4 sm:w-5 sm:h-5 text-green-600" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs text-gray-500">Total Amount</p>
                        <p className="text-xs sm:text-sm font-semibold text-gray-800">₹{order.order_totalamount}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2.5 sm:gap-3">
                      <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-lg bg-purple-50 flex items-center justify-center flex-shrink-0">
                        <Package className="w-4 h-4 sm:w-5 sm:h-5 text-purple-600" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs text-gray-500">Total Items</p>
                        <p className="text-xs sm:text-sm font-semibold text-gray-800">{order.order_totalcloths} clothes</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2.5 sm:gap-3">
                      <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-lg bg-orange-50 flex items-center justify-center flex-shrink-0">
                        <Clock className="w-4 h-4 sm:w-5 sm:h-5 text-orange-600" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs text-gray-500">Time Slot</p>
                        <p className="text-xs sm:text-sm font-semibold text-gray-800 truncate">{order.order_slot}</p>
                      </div>
                    </div>
                  </div>

                  {/* View Details Button */}
                  <button className="mt-4 sm:mt-6 w-full py-2 sm:py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg font-medium text-xs sm:text-sm group-hover:shadow-lg transition-all duration-300">
                    View Details
                  </button>
                </div>
              </Card>
            );
          })}
        </div>
      </div>

      {/* Modal Popup */}
      {selectedOrder && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4 animate-fadeIn">
          <div className="bg-white rounded-xl sm:rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto animate-slideUp">
            {/* Modal Header */}
            <div className="sticky top-0 bg-gradient-to-r from-blue-600 to-indigo-600 text-white p-4 sm:p-6 rounded-t-xl sm:rounded-t-2xl flex items-center justify-between">
              <div>
                <h2 className="text-xl sm:text-2xl font-bold mb-1">Order Details</h2>
                <p className="text-blue-100 text-xs sm:text-sm">
                  #{selectedOrder._id.slice(-8).toUpperCase()}
                </p>
              </div>
              <button
                onClick={() => setSelectedOrder(null)}
                className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-white bg-opacity-20 hover:bg-opacity-30 flex items-center justify-center transition-all flex-shrink-0"
              >
                <X className="w-5 h-5 sm:w-6 sm:h-6" />
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-4 sm:p-6">
              {/* Order Summary */}
              <div className="grid grid-cols-2 gap-3 sm:gap-4 mb-4 sm:mb-6">
                <div className="bg-blue-50 p-3 sm:p-4 rounded-lg sm:rounded-xl">
                  <p className="text-xs text-gray-600 mb-1">Order Date</p>
                  <p className="text-sm sm:text-base font-semibold text-gray-800">{formatDate(selectedOrder.order_date)}</p>
                </div>
                <div className="bg-green-50 p-3 sm:p-4 rounded-lg sm:rounded-xl">
                  <p className="text-xs text-gray-600 mb-1">Total Amount</p>
                  <p className="text-sm sm:text-base font-semibold text-gray-800">₹{selectedOrder.order_totalamount}</p>
                </div>
                <div className="bg-purple-50 p-3 sm:p-4 rounded-lg sm:rounded-xl">
                  <p className="text-xs text-gray-600 mb-1">Total Items</p>
                  <p className="text-sm sm:text-base font-semibold text-gray-800">{selectedOrder.order_totalcloths} clothes</p>
                </div>
                <div className="bg-orange-50 p-3 sm:p-4 rounded-lg sm:rounded-xl">
                  <p className="text-xs text-gray-600 mb-1">Time Slot</p>
                  <p className="text-sm sm:text-base font-semibold text-gray-800">{selectedOrder.order_slot}</p>
                </div>
              </div>

              {/* Payment Type */}
              <div className="mb-4 sm:mb-6 p-3 sm:p-4 bg-gray-50 rounded-lg sm:rounded-xl">
                <p className="text-xs text-gray-600 mb-1">Payment Method</p>
                <p className="text-sm sm:text-base font-semibold text-gray-800 capitalize">{selectedOrder.order_paymenttype}</p>
              </div>

              {/* Order Flow */}
              <div>
                <h3 className="text-base sm:text-lg font-bold text-gray-800 mb-3 sm:mb-4">Order Progress</h3>
                <div className="relative">
                  {selectedOrder.order_flow.map((flow, index) => {
                    const Icon = getStepIcon(flow.step);
                    const isCompleted = flow.completed;
                    const isCurrent = index === getCurrentStep(selectedOrder.order_flow);
                    const isLast = index === selectedOrder.order_flow.length - 1;

                    return (
                      <div key={index} className="relative">
                        {/* Connector Line */}
                        {!isLast && (
                          <div
                            className={`absolute left-4 sm:left-5 top-10 sm:top-12 w-0.5 h-14 sm:h-16 transition-all duration-500 ${isCompleted ? 'bg-green-500' : 'bg-gray-200'
                              }`}
                          />
                        )}

                        {/* Step */}
                        <div className="flex items-start gap-2.5 sm:gap-3 pb-5 sm:pb-6 relative">
                          <div
                            className={`relative z-10 flex-shrink-0 w-9 h-9 sm:w-10 sm:h-10 rounded-full flex items-center justify-center transition-all duration-300 ${isCompleted
                              ? 'bg-green-500 shadow-lg shadow-green-200'
                              : isCurrent
                                ? 'bg-blue-500 shadow-lg shadow-blue-200'
                                : 'bg-gray-200'
                              }`}
                          >
                            <Icon
                              className={`w-4 h-4 sm:w-5 sm:h-5 ${isCompleted || isCurrent ? 'text-white' : 'text-gray-400'
                                }`}
                            />
                          </div>

                          <div className="flex-1 pt-0.5 sm:pt-1 min-w-0">
                            <h4
                              className={`font-semibold mb-1 text-sm sm:text-base ${isCompleted
                                ? 'text-gray-800'
                                : isCurrent
                                  ? 'text-blue-600'
                                  : 'text-gray-400'
                                }`}
                            >
                              {flow.step}
                            </h4>
                            {flow.completedAt && (
                              <p className="text-xs text-gray-500">{formatDateTime(flow.completedAt)}</p>
                            )}
                            {isCurrent && !flow.completed && (
                              <p className="text-xs text-blue-600 font-medium">In Progress</p>
                            )}
                          </div>

                          {isCompleted && (
                            <CheckCircle2 className="w-4 h-4 sm:w-5 sm:h-5 text-green-500 flex-shrink-0 mt-0.5 sm:mt-1" />
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      <style>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }

        @keyframes slideUp {
          from {
            transform: translateY(20px);
            opacity: 0;
          }
          to {
            transform: translateY(0);
            opacity: 1;
          }
        }

        .animate-fadeIn {
          animation: fadeIn 0.2s ease-out;
        }

        .animate-slideUp {
          animation: slideUp 0.3s ease-out;
        }
      `}</style>
    </div>
  );
};

export default Previousorders;