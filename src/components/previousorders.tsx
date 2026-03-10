import React, { useState } from 'react';
import {
  Package, Calendar, Clock, X, CheckCircle2, Truck,
  Warehouse, MapPin, IndianRupee, FileText, Loader, Gift
} from 'lucide-react';
import { Card } from './ui/card';
import jsPDF from 'jspdf';
import { toast } from 'react-toastify';

interface OrderFlow {
  step: string;
  completed: boolean;
  completedAt?: string;
}

interface UserAddress {
  houseno: string;
  streetname: string;
  area: string;
  city: string;
  pincode: string;
  _id?: string;
}

interface OrderCloth {
  _id?: string;
  item: string;
  cost: string;
  quantity: string;
}

interface RedeemedItem {
  name?: string;
  item?: string;
  count?: number;
  quantity?: number;
  cost: number | string;
}

interface SubscriptionRedemption {
  used: boolean;
  subscriptionId?: any;
  redeemedCredits?: number;
  redeemedItems?: RedeemedItem[];
  redeemedAt?: string;
}

interface PaymentDetails {
  method: string;
  currency?: string;
  payment_id?: string;
  order_id?: string;
  signature?: string;
  paid_at?: string;
}

export interface Order {
  _id: string;
  orderid: number | string;
  userid: string;
  user_name: string;
  user_phoneno: string;
  user_address: UserAddress;
  order_date: string;
  order_totalamount: string;
  order_finalamount?: string;
  order_totalcloths: string;
  order_slot: string;
  order_paymenttype: string;
  order_deliveryspeed?: string;
  payment_status: string;
  order_flow: OrderFlow[];
  order_cloths?: OrderCloth[];
  subscription_redemption?: SubscriptionRedemption;
  payment_details?: PaymentDetails;
  createdAt?: string;
  updatedAt?: string;
}

interface PreviousordersProps {
  orders: Order[];
  buildInvoicePDF: (order: Order) => jsPDF;
}

const Previousorders: React.FC<PreviousordersProps> = ({ orders, buildInvoicePDF }) => {
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [downloadingId, setDownloadingId] = useState<string | null>(null);

  const formatDate = (dateString: string): string =>
    new Date(dateString).toLocaleString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });

  const formatDateTime = (dateString: string | undefined): string => {
    if (!dateString) return '';
    return new Date(dateString).toLocaleString('en-IN', {
      day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit', hour12: true,
    });
  };

  const formatDateForInvoice = (dateString: string): string =>
    new Date(dateString)
      .toLocaleDateString('en-IN', { day: '2-digit', month: '2-digit', year: 'numeric' })
      .split('/').join('-');

  const getOrderStatus = (orderFlow: OrderFlow[]): string => {
    if (!orderFlow?.length) return 'Order Placed';
    if (orderFlow.every(f => f.completed)) return 'Delivered';
    if (orderFlow.filter(f => f.completed).length === 0) return 'Order Placed';
    return 'In Progress';
  };

  const getStatusStyle = (status: string) => {
    if (status === 'Delivered') return { bg: 'bg-green-100', text: 'text-green-700', border: 'border-green-200' };
    if (status === 'In Progress') return { bg: 'bg-blue-100', text: 'text-blue-700', border: 'border-blue-200' };
    return { bg: 'bg-yellow-100', text: 'text-yellow-700', border: 'border-yellow-200' };
  };

  const getStepIcon = (step: string): React.ElementType => {
    const map: Record<string, React.ElementType> = {
      'Order placed': Package, 'Agent arriving': Truck, 'Collected clothes': MapPin,
      'Clothes reached warehouse': Warehouse, 'Clothes arriving to customer': Truck, 'Clothes delivered': CheckCircle2,
    };
    return map[step] || Package;
  };

  const getCurrentStep = (flow: OrderFlow[]): number => {
    const i = flow.findIndex(f => !f.completed);
    return i === -1 ? flow.length : i;
  };

  const handleDownloadInvoice = async (order: Order, e?: React.MouseEvent) => {
    e?.stopPropagation();
    setDownloadingId(order._id);
    try {
      buildInvoicePDF(order).save(`Steemer_Invoice_${order.orderid}_${formatDateForInvoice(new Date().toISOString())}.pdf`);
      toast.success('Invoice downloaded!');
    } catch (err) {
      console.error(err);
      toast.error('Failed to generate invoice');
    } finally {
      setDownloadingId(null);
    }
  };

  // Build combined items rows for modal display
  const buildCombinedRows = (order: Order) => {
    const cloths = order.order_cloths || [];
    const redeemed = order.subscription_redemption;

    const redeemedMap: Record<string, boolean> = {};
    if (redeemed?.used && redeemed.redeemedItems) {
      redeemed.redeemedItems.forEach(item => {
        const key = (item.name || item.item || '').toLowerCase().trim();
        redeemedMap[key] = true;
      });
    }

    const rows = cloths.map(c => {
      const qty = parseInt(c.quantity || '0');
      const unit = parseFloat(c.cost || '0');
      const key = (c.item || '').toLowerCase().trim();
      const isRedeemed = !!redeemedMap[key];
      return { name: c.item, qty, unit, total: qty * unit, isRedeemed };
    });

    // Fallback: if no order_cloths but have redeemed items
    if (rows.length === 0 && redeemed?.used && redeemed.redeemedItems) {
      redeemed.redeemedItems.forEach(item => {
        const name = item.name || item.item || '-';
        const qty = Number(item.count ?? item.quantity ?? 0);
        const cost = parseFloat(String(item.cost) || '0');
        const unit = qty > 0 ? cost / qty : 0;
        rows.push({ name, qty, unit, total: cost, isRedeemed: true });
      });
    }

    return rows;
  };

  if (!orders || orders.length === 0) {
    return (
      <div className="mt-10 py-12 sm:py-16 text-center">
        <Package className="w-14 h-14 sm:w-20 sm:h-20 text-gray-300 mx-auto mb-4" />
        <h2 className="text-xl sm:text-2xl font-semibold text-gray-600 mb-2">No Previous Orders</h2>
        <p className="text-sm sm:text-base text-gray-500">Your order history will appear here</p>
      </div>
    );
  }

  return (
    <div className="mt-8 sm:mt-10">
      <div className="mb-5 sm:mb-7">
        <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-800 mb-1">Previous Orders</h2>
        <p className="text-sm text-gray-500">View history, track progress, and download invoices</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-5">
        {orders.map((order) => {
          const status = getOrderStatus(order.order_flow);
          const style = getStatusStyle(status);
          const finalAmt = order.order_finalamount || order.order_totalamount;
          const hasDiscount = order.order_finalamount &&
            parseFloat(order.order_finalamount) < parseFloat(order.order_totalamount);
          const hasSubscription = order.subscription_redemption?.used;
          const isDownloading = downloadingId === order._id;

          return (
            <Card
              key={order._id}
              className="bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 cursor-pointer border-0 overflow-hidden group flex flex-col"
            >
              {/* Status bar */}
              <div className={`px-4 py-2 ${style.bg} border-b ${style.border} flex items-center justify-between`}>
                <p className={`text-xs font-semibold ${style.text}`}>{status}</p>
                {hasSubscription && (
                  <span className="text-xs px-2 py-0.5 rounded-full bg-green-100 text-green-700 font-medium flex items-center gap-1">
                    <Gift className="w-3 h-3" />Sub
                  </span>
                )}
              </div>

              <div className="p-4 sm:p-5 flex flex-col flex-1">
                <div className="flex items-start justify-between mb-3 gap-2">
                  <div>
                    <p className="text-xs text-gray-500">Order ID</p>
                    <p className="font-mono text-sm font-bold text-gray-800">#{order.orderid}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-gray-500">Date</p>
                    <p className="text-xs font-medium text-gray-700">{formatDate(order.order_date)}</p>
                  </div>
                </div>

                <div className="space-y-2 mb-4">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-lg bg-green-50 flex items-center justify-center flex-shrink-0">
                      <IndianRupee className="w-4 h-4 text-green-600" />
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Amount</p>
                      <div className="flex items-center gap-1.5">
                        <p className="text-sm font-bold text-gray-800">₹{finalAmt}</p>
                        {hasDiscount && <p className="text-xs text-gray-400 line-through">₹{order.order_totalamount}</p>}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-lg bg-purple-50 flex items-center justify-center flex-shrink-0">
                      <Package className="w-4 h-4 text-purple-600" />
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Items</p>
                      <p className="text-sm font-semibold text-gray-800">{order.order_totalcloths} clothes</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-lg bg-orange-50 flex items-center justify-center flex-shrink-0">
                      <Clock className="w-4 h-4 text-orange-600" />
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Slot</p>
                      <p className="text-sm font-semibold text-gray-800 truncate">{order.order_slot}</p>
                    </div>
                  </div>
                </div>

                <div className="mt-auto grid grid-cols-2 gap-2">
                  <button
                    onClick={() => setSelectedOrder(order)}
                    className="py-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg font-medium text-xs group-hover:shadow-md transition-all duration-200"
                  >
                    View Details
                  </button>
                  <button
                    onClick={(e) => handleDownloadInvoice(order, e)}
                    disabled={isDownloading}
                    className="py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg font-medium text-xs transition-all duration-200 flex items-center justify-center gap-1.5 disabled:opacity-60"
                  >
                    {isDownloading
                      ? <><Loader className="w-3 h-3 animate-spin" />...</>
                      : <><FileText className="w-3 h-3" />Invoice</>}
                  </button>
                </div>
              </div>
            </Card>
          );
        })}
      </div>

      {/* ── Detail Modal ── */}
      {selectedOrder && (() => {
        const combinedRows = buildCombinedRows(selectedOrder);
        const totalAmt = parseFloat(selectedOrder.order_totalamount || '0');
        const finalAmt = parseFloat(selectedOrder.order_finalamount || selectedOrder.order_totalamount || '0');
        const discount = totalAmt - finalAmt;
        const redeemed = selectedOrder.subscription_redemption;
        const planName = typeof redeemed?.subscriptionId === 'object'
          ? redeemed?.subscriptionId?.plan || 'Subscription'
          : 'Subscription';

        return (
          <div
            className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 animate-fadeIn"
            onClick={() => setSelectedOrder(null)}
          >
            <div
              className="bg-white rounded-t-2xl sm:rounded-2xl shadow-2xl w-full sm:max-w-2xl max-h-[92vh] sm:max-h-[90vh] overflow-y-auto animate-slideUp"
              onClick={e => e.stopPropagation()}
            >
              {/* Modal Header */}
              <div className="sticky top-0 z-10 bg-gradient-to-r from-blue-600 to-indigo-600 text-white p-4 sm:p-6 rounded-t-2xl flex items-center justify-between">
                <div>
                  <h2 className="text-lg sm:text-2xl font-bold mb-0.5">Order Details</h2>
                  <p className="text-blue-100 text-xs sm:text-sm">#{selectedOrder.orderid}</p>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={(e) => handleDownloadInvoice(selectedOrder, e)}
                    disabled={downloadingId === selectedOrder._id}
                    className="px-3 py-1.5 bg-white bg-opacity-20 hover:bg-opacity-30 rounded-lg text-xs font-medium flex items-center gap-1.5 transition-all disabled:opacity-60"
                  >
                    {downloadingId === selectedOrder._id
                      ? <><Loader className="w-3 h-3 animate-spin" />Generating...</>
                      : <><FileText className="w-3 h-3" />Invoice</>}
                  </button>
                  <button
                    onClick={() => setSelectedOrder(null)}
                    className="w-9 h-9 rounded-full bg-white bg-opacity-20 hover:bg-opacity-30 flex items-center justify-center transition-all"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>

              <div className="p-4 sm:p-6 space-y-5">
                {/* Summary grid */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {[
                    { label: 'Order Date', value: formatDate(selectedOrder.order_date), bg: 'bg-blue-50' },
                    { label: 'Time Slot', value: selectedOrder.order_slot, bg: 'bg-orange-50' },
                    { label: 'Total Items', value: `${selectedOrder.order_totalcloths} clothes`, bg: 'bg-purple-50' },
                    { label: 'Payment', value: (selectedOrder.payment_status || '').toUpperCase(), bg: 'bg-green-50' },
                  ].map(({ label, value, bg }) => (
                    <div key={label} className={`${bg} p-3 rounded-xl`}>
                      <p className="text-xs text-gray-500 mb-1">{label}</p>
                      <p className="text-xs sm:text-sm font-semibold text-gray-800 truncate">{value}</p>
                    </div>
                  ))}
                </div>

                {/* Payment method + amount */}
                <div className="p-3 sm:p-4 bg-gray-50 rounded-xl flex items-center justify-between">
                  <div>
                    <p className="text-xs text-gray-500 mb-0.5">Payment Method</p>
                    <p className="text-sm font-semibold text-gray-800 capitalize">
                      {selectedOrder.order_paymenttype}
                      {selectedOrder.payment_details?.method && ` (${selectedOrder.payment_details.method})`}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-gray-500 mb-0.5">Amount Paid</p>
                    <p className="text-lg font-bold text-blue-600">₹{selectedOrder.order_finalamount || selectedOrder.order_totalamount}</p>
                    {selectedOrder.order_finalamount &&
                      parseFloat(selectedOrder.order_finalamount) < parseFloat(selectedOrder.order_totalamount) && (
                        <p className="text-xs text-gray-400 line-through">₹{selectedOrder.order_totalamount}</p>
                      )}
                  </div>
                </div>

                {/* Subscription notice */}
                {redeemed?.used && (
                  <div className="flex items-center gap-2 px-3 py-2 bg-green-50 border border-green-200 rounded-lg text-xs text-green-700">
                    <Gift className="w-3.5 h-3.5 flex-shrink-0" />
                    <span>
                      <strong>{planName}</strong> applied — {redeemed.redeemedCredits || 0} credits redeemed.
                      Green rows below are covered by your subscription.
                    </span>
                  </div>
                )}

                {/* ── Combined Items Table ── */}
                {combinedRows.length > 0 && (
                  <div>
                    <h3 className="text-sm sm:text-base font-bold text-gray-800 mb-3">Order Items</h3>
                    <div className="rounded-xl border border-gray-200 overflow-hidden">
                      {/* Table header */}
                      <div className="grid grid-cols-12 bg-blue-600 text-white text-xs font-semibold px-3 py-2.5">
                        <div className="col-span-5">Item</div>
                        <div className="col-span-2 text-center">Qty</div>
                        <div className="col-span-2 text-center">Price</div>
                        <div className="col-span-2 text-right">Total</div>
                        <div className="col-span-1 text-right">Type</div>
                      </div>

                      {combinedRows.map((row, i) => (
                        <div
                          key={i}
                          className={`grid grid-cols-12 px-3 py-2.5 text-xs sm:text-sm border-t border-gray-100 ${
                            row.isRedeemed ? 'bg-green-50' : i % 2 === 0 ? 'bg-white' : 'bg-slate-50'
                          }`}
                        >
                          <div className={`col-span-5 font-medium truncate flex items-center gap-1 ${row.isRedeemed ? 'text-green-800' : 'text-gray-800'}`}>
                            {row.isRedeemed && <CheckCircle2 className="w-3 h-3 text-green-500 flex-shrink-0" />}
                            {row.name}
                          </div>
                          <div className={`col-span-2 text-center ${row.isRedeemed ? 'text-green-700' : 'text-gray-600'}`}>{row.qty}</div>
                          <div className={`col-span-2 text-center ${row.isRedeemed ? 'text-green-700' : 'text-gray-600'}`}>₹{row.unit.toFixed(2)}</div>
                          <div className={`col-span-2 text-right font-semibold ${row.isRedeemed ? 'text-green-700' : 'text-gray-800'}`}>₹{row.total.toFixed(2)}</div>
                          <div className="col-span-1 text-right">
                            {row.isRedeemed
                              ? <span className="text-green-600 font-bold text-xs">✓</span>
                              : <span className="text-gray-400 text-xs">—</span>}
                          </div>
                        </div>
                      ))}

                      {/* Subtotal row */}
                      <div className="grid grid-cols-12 px-3 py-2.5 bg-blue-50 border-t border-blue-200">
                        <div className="col-span-9 text-xs sm:text-sm font-bold text-blue-700 text-right pr-2">Subtotal</div>
                        <div className="col-span-2 text-right text-xs sm:text-sm font-bold text-blue-700">₹{totalAmt.toFixed(2)}</div>
                        <div className="col-span-1" />
                      </div>

                      {/* Discount row */}
                      {discount > 0 && (
                        <div className="grid grid-cols-12 px-3 py-2 bg-green-50 border-t border-green-200">
                          <div className="col-span-9 text-xs sm:text-sm font-semibold text-green-700 text-right pr-2">
                            Subscription Discount
                          </div>
                          <div className="col-span-2 text-right text-xs sm:text-sm font-semibold text-green-700">-₹{discount.toFixed(2)}</div>
                          <div className="col-span-1" />
                        </div>
                      )}

                      {/* Amount paid row */}
                      <div className="grid grid-cols-12 px-3 py-2.5 bg-blue-600 rounded-b-xl">
                        <div className="col-span-9 text-xs sm:text-sm font-bold text-white text-right pr-2">Amount Paid</div>
                        <div className="col-span-2 text-right text-xs sm:text-sm font-bold text-white">₹{finalAmt.toFixed(2)}</div>
                        <div className="col-span-1" />
                      </div>
                    </div>
                  </div>
                )}

                {/* ── Order Progress ── */}
                <div>
                  <h3 className="text-sm sm:text-base font-bold text-gray-800 mb-3">Order Progress</h3>
                  <div className="relative">
                    {selectedOrder.order_flow.map((flow, index) => {
                      const Icon = getStepIcon(flow.step);
                      const isCompleted = flow.completed;
                      const isCurrent = index === getCurrentStep(selectedOrder.order_flow);
                      const isLast = index === selectedOrder.order_flow.length - 1;
                      return (
                        <div key={index} className="relative">
                          {!isLast && (
                            <div className={`absolute left-4 sm:left-5 top-10 sm:top-11 w-0.5 h-12 sm:h-14 ${isCompleted ? 'bg-green-500' : 'bg-gray-200'}`} />
                          )}
                          <div className="flex items-start gap-2.5 sm:gap-3 pb-4 sm:pb-5 relative">
                            <div className={`relative z-10 flex-shrink-0 w-9 h-9 sm:w-10 sm:h-10 rounded-full flex items-center justify-center ${isCompleted ? 'bg-green-500 shadow-md shadow-green-200' : isCurrent ? 'bg-blue-500 shadow-md shadow-blue-200' : 'bg-gray-200'}`}>
                              <Icon className={`w-4 h-4 sm:w-5 sm:h-5 ${isCompleted || isCurrent ? 'text-white' : 'text-gray-400'}`} />
                            </div>
                            <div className="flex-1 pt-1 min-w-0">
                              <div className="flex items-center justify-between gap-2">
                                <h4 className={`font-semibold text-xs sm:text-sm ${isCompleted ? 'text-gray-800' : isCurrent ? 'text-blue-600' : 'text-gray-400'}`}>
                                  {flow.step}
                                </h4>
                                {isCompleted && <CheckCircle2 className="w-4 h-4 text-green-500 flex-shrink-0" />}
                              </div>
                              {flow.completedAt && <p className="text-xs text-gray-500 mt-0.5">{formatDateTime(flow.completedAt)}</p>}
                              {isCurrent && !flow.completed && <p className="text-xs text-blue-600 font-medium mt-0.5">In Progress</p>}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      })()}

      <style>{`
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        @keyframes slideUp { from { transform: translateY(30px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }
        .animate-fadeIn { animation: fadeIn 0.2s ease-out; }
        .animate-slideUp { animation: slideUp 0.3s ease-out; }
      `}</style>
    </div>
  );
};

export default Previousorders;