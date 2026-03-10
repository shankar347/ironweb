import { Navigation, Package, Truck, Warehouse, CheckCircle2, Clock, MapPin, LucideIcon, FileText, Loader } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { Card } from '../../components/ui/card';
import { toast } from 'react-toastify';
import { API_URL } from '../../hooks/tools';
import Previousorders from '../../components/previousorders';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import Button from '../../components/ui/Newbutton';

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

const Trackorder: React.FC = () => {
  const [lastorder, setlastorder] = useState<Order | null>(null);
  const [userorders, setuseroders] = useState<Order[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [isDownloading, setIsDownloading] = useState<boolean>(false);
  const [logoBase64, setLogoBase64] = useState<string | null>(null);

  useEffect(() => {
    const loadLogo = async () => {
      try {
        const response = await fetch('/assets/logobg.png');
        const blob = await response.blob();
        const img = new Image();
        const url = URL.createObjectURL(blob);
        img.onload = () => {
          const canvas = document.createElement('canvas');
          const maxWidth = 200;
          const scale = maxWidth / img.width;
          canvas.width = maxWidth;
          canvas.height = img.height * scale;
          const ctx = canvas.getContext('2d')!;
          ctx.clearRect(0, 0, canvas.width, canvas.height);
          ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
          setLogoBase64(canvas.toDataURL('image/png'));
        };
        img.src = url;
      } catch (error) {
        console.error('Error loading logo:', error);
      }
    };
    loadLogo();
  }, []);

  useEffect(() => {
    const getUserorders = async () => {
      const res = await fetch(`${API_URL}/orders/getuserorders`, { credentials: 'include' });
      const data = await res.json();
      setuseroders(data?.data || []);
    };
    getUserorders();
  }, []);

  useEffect(() => {
    const getUserLastOrder = async (): Promise<void> => {
      try {
        const res = await fetch(`${API_URL}/orders/getusrlastorder`, { credentials: 'include' });
        const data = await res.json();
        setlastorder(data?.data);
        setLoading(false);
      } catch (error) {
        toast.error('Error in fetching orders');
        setLoading(false);
      }
    };
    getUserLastOrder();
  }, []);

  const getStepIcon = (step: string): LucideIcon => {
    const iconMap: Record<string, LucideIcon> = {
      'Order placed': Package,
      'Agent arriving': Truck,
      'Collected clothes': MapPin,
      'Clothes reached warehouse': Warehouse,
      'Clothes arriving to customer': Truck,
      'Clothes delivered': CheckCircle2,
    };
    return iconMap[step] || Package;
  };

  const formatDate = (dateString: string | undefined): string => {
    if (!dateString) return '';
    return new Date(dateString).toLocaleString('en-IN', {
      day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit', hour12: true,
    });
  };

  const formatDateForInvoice = (dateString: string): string => {
    return new Date(dateString)
      .toLocaleDateString('en-IN', { day: '2-digit', month: '2-digit', year: 'numeric' })
      .split('/').join('-');
  };

  const getCurrentStep = (): number => {
    if (!lastorder?.order_flow) return 0;
    const index = lastorder.order_flow.findIndex(flow => !flow.completed);
    return index === -1 ? lastorder.order_flow.length : index;
  };

  // ─── Shared PDF builder ───────────────────────────────────────────────────

  // ─── Shared PDF builder — always single page ─────────────────────────────
  const buildInvoicePDF = (order: Order): jsPDF => {
    const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });

    const blue   = [37, 99, 235]   as [number, number, number];
    const lblue  = [239, 246, 255] as [number, number, number];
    const slate  = [51, 65, 85]    as [number, number, number];
    const muted  = [100, 116, 139] as [number, number, number];
    const white  = [255, 255, 255] as [number, number, number];
    const green  = [22, 163, 74]   as [number, number, number];
    const lgreen = [240, 253, 244] as [number, number, number];

    // ── Header (compact: 36mm tall) ──
    doc.setFillColor(...blue);
    doc.rect(0, 0, 210, 36, 'F');
    if (logoBase64) {
      try { doc.addImage(logoBase64, 'PNG', 14, 6, 24, 14); } catch (_) {}
    }
    doc.setFontSize(17); doc.setFont('helvetica', 'bold'); doc.setTextColor(...white);
    doc.text('STEEMER', 196, 15, { align: 'right' });
    doc.setFontSize(7.5); doc.setFont('helvetica', 'normal');
    doc.text('Professional Laundry & Ironing Service', 196, 21, { align: 'right' });
    doc.setFontSize(10); doc.setFont('helvetica', 'bold');
    doc.text('TAX INVOICE', 14, 31);

    // ── Meta box (compact) ──
    doc.setFillColor(...lblue);
    doc.roundedRect(14, 40, 182, 22, 2, 2, 'F');
    doc.setDrawColor(...blue); doc.setLineWidth(0.3);
    doc.roundedRect(14, 40, 182, 22, 2, 2, 'D');

    const invoiceNo = `STM-${String(order.orderid).padStart(5, '0')}`;
    const orderDate = formatDateForInvoice(order.order_date || order.createdAt || new Date().toISOString());

    doc.setFontSize(8); doc.setFont('helvetica', 'bold'); doc.setTextColor(...slate);
    doc.text('Invoice No:', 18, 49); doc.text('Order Date:', 18, 56);
    doc.setFont('helvetica', 'normal'); doc.setTextColor(...muted);
    doc.text(invoiceNo, 42, 49); doc.text(orderDate, 42, 56);
    doc.setFont('helvetica', 'bold'); doc.setTextColor(...slate);
    doc.text('Order ID:', 112, 49); doc.text('Payment:', 112, 56);
    doc.setFont('helvetica', 'normal'); doc.setTextColor(...muted);
    doc.text(`#${order.orderid}`, 132, 49);
    doc.text((order.payment_details?.method || order.order_paymenttype || 'online').toUpperCase(), 132, 56);

    // ── Bill To + Order Details side by side (compact) ──
    // Left: Bill To
    doc.setFontSize(8); doc.setFont('helvetica', 'bold'); doc.setTextColor(...blue);
    doc.text('BILL TO', 14, 70);
    doc.setLineWidth(0.2); doc.setDrawColor(...blue); doc.line(14, 72, 98, 72);
    doc.setFontSize(9); doc.setFont('helvetica', 'bold'); doc.setTextColor(...slate);
    doc.text(order.user_name || 'Customer', 14, 79);
    doc.setFontSize(7.5); doc.setFont('helvetica', 'normal'); doc.setTextColor(...muted);
    doc.text(`Ph: ${order.user_phoneno || 'N/A'}`, 14, 85);
    const addr = order.user_address;
    if (addr) {
      const line = `${addr.houseno}, ${addr.streetname}, ${addr.area}, ${addr.city} - ${addr.pincode}`;
      const wrapped = doc.splitTextToSize(line, 88);
      doc.text(wrapped, 14, 91);
    }

    // Right: Order Details
    doc.setFontSize(8); doc.setFont('helvetica', 'bold'); doc.setTextColor(...blue);
    doc.text('ORDER DETAILS', 112, 70);
    doc.line(112, 72, 196, 72);
    const details: [string, string][] = [
      ['Slot',     order.order_slot || 'N/A'],
      ['Delivery', (order.order_deliveryspeed || 'Normal').toUpperCase()],
      ['Items',    `${order.order_totalcloths} clothes`],
      ['Status',   (order.payment_status || 'pending').toUpperCase()],
    ];
    details.forEach(([label, val], i) => {
      const y = 79 + i * 6.5;
      doc.setFontSize(7.5); doc.setFont('helvetica', 'bold'); doc.setTextColor(...slate);
      doc.text(`${label}:`, 112, y);
      doc.setFont('helvetica', 'normal'); doc.setTextColor(...muted);
      doc.text(val, 135, y);
    });

    // ── Build combined rows ──
    const cloths = order.order_cloths || [];
    const redeemed = order.subscription_redemption;

    const redeemedMap: Record<string, boolean> = {};
    if (redeemed?.used && redeemed.redeemedItems) {
      redeemed.redeemedItems.forEach(item => {
        const key = (item.name || item.item || '').toLowerCase().trim();
        redeemedMap[key] = true;
      });
    }

    type RowData = { cells: string[]; isRedeemed: boolean };
    const rows: RowData[] = cloths.map(c => {
      const qty = parseInt(c.quantity || '0');
      const unit = parseFloat(c.cost || '0');
      const key = (c.item || '').toLowerCase().trim();
      const isRedeemed = !!redeemedMap[key];
      return {
        cells: [c.item || '-', String(qty), `Rs.${unit.toFixed(2)}`, `Rs.${(qty * unit).toFixed(2)}`, isRedeemed ? 'Redeemed' : 'Charged'],
        isRedeemed,
      };
    });

    if (rows.length === 0 && redeemed?.used && redeemed.redeemedItems) {
      redeemed.redeemedItems.forEach(item => {
        const name = item.name || item.item || '-';
        const qty = Number(item.count ?? item.quantity ?? 0);
        const cost = parseFloat(String(item.cost) || '0');
        const unit = qty > 0 ? cost / qty : 0;
        rows.push({ cells: [name, String(qty), `Rs.${unit.toFixed(2)}`, `Rs.${cost.toFixed(2)}`, 'Redeemed'], isRedeemed: true });
      });
    }

    // ── Items table label + subscription note ──
    let curY = 102;
    doc.setFontSize(8.5); doc.setFont('helvetica', 'bold'); doc.setTextColor(...blue);
    doc.text('ORDER ITEMS', 14, curY);
    doc.setDrawColor(...blue); doc.setLineWidth(0.2); doc.line(14, curY + 1.5, 196, curY + 1.5);

    if (redeemed?.used) {
      const planName = typeof redeemed.subscriptionId === 'object'
        ? redeemed.subscriptionId?.plan || 'Subscription'
        : 'Subscription';
      doc.setFontSize(7); doc.setFont('helvetica', 'normal'); doc.setTextColor(...green);
      doc.text(`✓ ${planName} — ${redeemed.redeemedCredits || 0} credits redeemed | Green = covered by subscription`, 14, curY + 7);
      curY += 3;
    }

    // Calculate row height based on item count to keep everything on one page
    // Available space: from ~(curY+10) to 240 (leaving room for summary + terms + footer)
    const tableStartY = curY + (redeemed?.used ? 9 : 5);
    const availableForTable = 238 - tableStartY; // 238 = bottom of content area
    const rowCount = rows.length || 1;
    // clamp cell padding: shrink if many rows
    const cellPad = rowCount > 8 ? 1.5 : rowCount > 5 ? 2 : 2.5;
    const fontSize = rowCount > 8 ? 7.5 : 8;

    autoTable(doc, {
      startY: tableStartY,
      head: [['Item', 'Qty', 'Unit Price', 'Amount', 'Type']],
      body: rows.map(r => r.cells),
      theme: 'grid',
      tableWidth: 182,
      headStyles: {
        fillColor: blue, textColor: white, fontStyle: 'bold',
        fontSize: 8, halign: 'center', cellPadding: 2,
      },
      bodyStyles: { fontSize, textColor: slate, cellPadding: cellPad },
      columnStyles: {
        0: { cellWidth: 65 },
        1: { cellWidth: 14, halign: 'center' },
        2: { cellWidth: 32, halign: 'center' },
        3: { cellWidth: 32, halign: 'center' },
        4: { cellWidth: 26, halign: 'center' },
      },
      didParseCell: (data) => {
        if (data.section === 'body') {
          if (rows[data.row.index]?.isRedeemed) {
            data.cell.styles.fillColor = lgreen;
            data.cell.styles.textColor = [21, 128, 61] as [number, number, number];
          } else {
            data.cell.styles.fillColor = data.row.index % 2 === 0 ? white : lblue;
          }
        }
      },
      margin: { left: 14, right: 14 },
    });

    curY = (doc as any).lastAutoTable?.finalY + 5;

    // ── Payment Summary ──
    const totalAmt = parseFloat(order.order_totalamount || '0');
    const finalAmt = parseFloat(order.order_finalamount || order.order_totalamount || '0');
    const discount = totalAmt - finalAmt;
    const hasDiscount = discount > 0;
    const summaryRows = hasDiscount ? 3 : 2;
    const boxH = 10 + summaryRows * 7;

    // Safety clamp — never let summary+terms overflow past 258 (footer at 270)
    if (curY + boxH + 22 > 258) {
      curY = 258 - boxH - 22;
    }

    doc.setFillColor(...lblue);
    doc.roundedRect(105, curY, 91, boxH, 2, 2, 'F');
    doc.setDrawColor(...blue); doc.setLineWidth(0.3);
    doc.roundedRect(105, curY, 91, boxH, 2, 2, 'D');

    doc.setFontSize(8); doc.setFont('helvetica', 'bold'); doc.setTextColor(...blue);
    doc.text('PAYMENT SUMMARY', 150.5, curY + 6, { align: 'center' });

    const sumRows: [string, string, boolean][] = [
      ['Subtotal:', `Rs.${totalAmt.toFixed(2)}`, false],
      ...(hasDiscount ? [['Subscreption Redeemed:', `-Rs.${discount.toFixed(2)}`, false] as [string, string, boolean]] : []),
      ['Amount Paid:', `Rs.${finalAmt.toFixed(2)}`, true],
    ];
    sumRows.forEach(([label, val, isFinal], i) => {
      const y = curY + 12 + i * 7;
      doc.setFontSize(7.5); doc.setFont('helvetica', isFinal ? 'bold' : 'normal');
      doc.setTextColor(...(isFinal ? blue : slate));
      doc.text(label, 110, y);
      doc.text(val, 193, y, { align: 'right' });
    });

    // ── Terms ──
    const termsY = curY + boxH + 4;
    doc.setFontSize(7); doc.setFont('helvetica', 'bold'); doc.setTextColor(...muted);
    doc.text('Terms & Conditions:', 14, termsY);
    doc.setFont('helvetica', 'normal');
    doc.text('• Computer generated invoice — valid without signature', 14, termsY + 4.5);
    doc.text('• Items subject to quality check before processing', 14, termsY + 9);
    doc.text('• Raise queries within 48 hours of delivery', 14, termsY + 13.5);

    // ── Footer — always at bottom of page 1 ──
    doc.setFillColor(...blue);
    doc.rect(0, 272, 210, 25, 'F');
    doc.setTextColor(...white); doc.setFontSize(8); doc.setFont('helvetica', 'bold');
    doc.text('Thank you for choosing Steemer!', 105, 280, { align: 'center' });
    doc.setFont('helvetica', 'normal'); doc.setFontSize(7.5);
    doc.text('steemerservicescontactin@gmail.com  |  www.steemer.in', 105, 287, { align: 'center' });

    doc.setDrawColor(...blue); doc.setLineWidth(0.4);
    doc.rect(4, 4, 202, 289);

    return doc;
  };


  const generateInvoice = async () => {
    if (!lastorder) return;
    setIsDownloading(true);
    try {
      buildInvoicePDF(lastorder).save(`Steemer_Invoice_${lastorder.orderid}_${formatDateForInvoice(new Date().toISOString())}.pdf`);
      toast.success('Invoice downloaded successfully!');
    } catch (error) {
      console.error(error);
      toast.error('Failed to generate invoice');
    } finally {
      setIsDownloading(false);
    }
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
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-800 mb-2">Track Your Order</h1>
          <p className="text-sm sm:text-base text-gray-600">Real-time updates on your laundry service</p>
        </div>

        {/* Order Summary Card */}
        <Card className="bg-white rounded-xl sm:rounded-2xl shadow-xl p-4 sm:p-6 mb-6 sm:mb-8 border-0">
          <div className="grid grid-cols-2 lg:grid-cols-5 gap-3 sm:gap-4">
            <div className="text-center p-3 sm:p-4 bg-blue-50 rounded-lg sm:rounded-xl">
              <p className="text-xs sm:text-sm text-gray-600 mb-1">Order ID</p>
              <p className="font-semibold text-gray-800 text-xs sm:text-sm">#{lastorder.orderid}</p>
            </div>
            <div className="text-center p-3 sm:p-4 bg-indigo-50 rounded-lg sm:rounded-xl">
              <p className="text-xs sm:text-sm text-gray-600 mb-1">Total Items</p>
              <p className="font-semibold text-gray-800 text-sm sm:text-base">{lastorder.order_totalcloths} clothes</p>
            </div>
            <div className="text-center p-3 sm:p-4 bg-purple-50 rounded-lg sm:rounded-xl">
              <p className="text-xs sm:text-sm text-gray-600 mb-1">Amount</p>
              <p className="font-semibold text-gray-800 text-sm sm:text-base">₹{lastorder.order_finalamount || lastorder.order_totalamount}</p>
              {lastorder.order_finalamount && parseFloat(lastorder.order_finalamount) < parseFloat(lastorder.order_totalamount) && (
                <p className="text-xs text-gray-400 line-through">₹{lastorder.order_totalamount}</p>
              )}
            </div>
            <div className="text-center p-3 sm:p-4 bg-pink-50 rounded-lg sm:rounded-xl">
              <p className="text-xs sm:text-sm text-gray-600 mb-1">Time Slot</p>
              <p className="font-semibold text-gray-800 text-xs sm:text-sm">{lastorder.order_slot}</p>
            </div>
            <div className="text-center p-3 sm:p-4 bg-green-50 rounded-lg sm:rounded-xl">
              <p className="text-xs sm:text-sm text-gray-600 mb-1">Payment</p>
              <p className="font-semibold text-green-600 text-xs sm:text-sm uppercase">{lastorder.payment_status}</p>
            </div>
          </div>

          {lastorder.subscription_redemption?.used && (
            <div className="mt-3 flex items-center gap-2 px-3 py-2 bg-green-50 border border-green-200 rounded-lg text-sm text-green-700">
              <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
              <span>
                Subscription applied — {lastorder.subscription_redemption.redeemedCredits || 0} credits redeemed
                {typeof lastorder.subscription_redemption.subscriptionId === 'object' &&
                  lastorder.subscription_redemption.subscriptionId?.plan &&
                  ` (${lastorder.subscription_redemption.subscriptionId.plan})`}
              </span>
            </div>
          )}

          <div className="mt-4 justify-center flex md:justify-end lg:justify-end">
            <Button
              onClick={generateInvoice}
              disabled={isDownloading}
              className="px-11    py-2 bg-gradient-to-r from-blue-600 
              to-indigo-600 text-white rounded-lg font-medium hover:shadow-lg transition-all duration-300 flex items-center gap-2 text-sm"
            >
              {isDownloading
                ? <><Loader className="w-4 h-4 animate-spin" />Generating...</>
                : <><FileText className="w-4 h-4" />Download Invoice</>}
            </Button>
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
                  {!isLast && (
                    <div className={`absolute left-5 sm:left-6 top-12 sm:top-14 w-0.5 h-16 sm:h-20 transition-all duration-500 ${isCompleted ? 'bg-gradient-to-b from-green-500 to-green-400' : 'bg-gray-200'}`} />
                  )}
                  <div className="flex items-start gap-3 sm:gap-4 pb-6 sm:pb-8 relative">
                    <div className={`relative z-10 flex-shrink-0 w-10 h-10 sm:w-12 sm:h-12 rounded-full flex items-center justify-center transition-all duration-300 ${isCompleted ? 'bg-gradient-to-br from-green-500 to-green-600 shadow-lg shadow-green-200' : isCurrent ? 'bg-gradient-to-br from-blue-500 to-indigo-600 shadow-lg shadow-blue-200' : 'bg-gray-200'}`}>
                      <Icon className={`w-5 h-5 sm:w-6 sm:h-6 ${isCompleted || isCurrent ? 'text-white' : 'text-gray-400'} ${isCurrent ? 'animate-pulse' : ''}`} />
                    </div>
                    <div className="flex-1 pt-0.5 sm:pt-1 min-w-0">
                      <div className="flex items-start sm:items-center justify-between mb-1 gap-2">
                        <h3 className={`font-semibold text-sm sm:text-base md:text-lg ${isCompleted ? 'text-gray-800' : isCurrent ? 'text-blue-600' : 'text-gray-400'}`}>{flow.step}</h3>
                        {isCompleted && (
                          <span className="flex items-center gap-1 text-green-600 text-xs sm:text-sm font-medium flex-shrink-0">
                            <CheckCircle2 className="w-3 h-3 sm:w-4 sm:h-4" /><span className="hidden sm:inline">Completed</span>
                          </span>
                        )}
                        {isCurrent && (
                          <span className="flex items-center gap-1 text-blue-600 text-xs sm:text-sm font-medium flex-shrink-0">
                            <Clock className="w-3 h-3 sm:w-4 sm:h-4 animate-spin" /><span className="hidden sm:inline">In Progress</span>
                          </span>
                        )}
                      </div>
                      {flow.completedAt && <p className="text-xs sm:text-sm text-gray-500">{formatDate(flow.completedAt)}</p>}
                      {isCurrent && <p className="text-xs sm:text-sm text-blue-600 mt-1 font-medium">Your order is currently at this stage</p>}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

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

        <Previousorders orders={userorders} buildInvoicePDF={buildInvoicePDF} />

        <div className="text-center mt-6 sm:mt-8 text-gray-600 text-xs sm:text-sm px-4">
          <p>Need help? Contact support at <span className="text-blue-600 font-medium break-all">steemerservicescontactin@gmail.com</span></p>
        </div>
      </div>
    </div>
  );
};

export default Trackorder;