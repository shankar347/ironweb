import React, { useState, useEffect } from 'react';
import { Package, DollarSign, Clock, CheckCircle, X, QrCode, User, Phone, MapPin, Box, Copy, ArrowUpDown, Check, RefreshCw } from 'lucide-react';
import { API_URL } from '../../hooks/tools';
import qrcode from '../../assets/qrcode.jpeg'


const toast = {
    success: (msg: string) => console.log('Success:', msg),
    error: (msg: string) => console.log('Error:', msg)
};

const Button = ({ children, onClick, className }: any) => (
    <button onClick={onClick} className={className}>{children}</button>
);

const GRADIENT_CLASS = 'bg-gradient-to-r from-blue-500 via-blue-600 to-blue-700';

interface Address {
    _id?: string;
    name?: string;
    phone?: string;
    address?: string;
    street?: string;
    city?: string;
    state?: string;
    pincode?: string;
    landmark?: string;
    houseno?: string;
    streetname?: string;
    area?: string;
}

interface OrderFlow {
    step: string;
    completed: boolean;
    completedAt?: string;
}

interface Order {
    _id: string;
    userid: string;
    user_name: string;
    user_phoneno: string;
    user_address: Address;
    order_date: string;
    order_totalamount: string;
    order_totalcloths: string;
    order_deliveryspeed: string;
    order_slot: string;
    order_paymenttype: string;
    order_flow: OrderFlow[];
    createdAt?: string;
    updatedAt?: string;
    agent_id?: string;
    agent_name?: string;
    agent_phoneno?: string;
}

interface Stats {
    total: number;
    totalAmount: number;
    active: number;
    completed: number;
}

const Agenthome: React.FC = () => {
    const [orders, setOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
    const [showStatusModal, setShowStatusModal] = useState<boolean>(false);
    const [showQRModal, setShowQRModal] = useState<boolean>(false);
    const [qrScanned, setQrScanned] = useState<boolean>(false);
    const [updating, setUpdating] = useState<boolean>(false);

    // Swap functionality states
    const [isSwapMode, setIsSwapMode] = useState<boolean>(false);
    const [selectedForSwap, setSelectedForSwap] = useState<string[]>([]);
    const [isOrderLocked, setIsOrderLocked] = useState<boolean>(false);

    useEffect(() => {
        checkOrderLock();
        getAgentorders();
    }, []);

    const checkOrderLock = () => {
        const lockData = localStorage.getItem('orderLock');
        if (lockData) {
            const { timestamp } = JSON.parse(lockData);
            const lockDate = new Date(timestamp);
            const now = new Date();
            
            if (lockDate.toDateString() === now.toDateString()) {
                setIsOrderLocked(true);
            } else {
                localStorage.removeItem('orderLock');
                localStorage.removeItem('ordersSequence');
                setIsOrderLocked(false);
            }
        }
    };

    const getAgentorders = async (): Promise<void> => {
        try {
            setLoading(true);
            // Mock data for demo

            const res=await fetch(`${API_URL}/admin/getagenttodayorders`,{
                credentials:'include'
            })
     
            const data=await res.json()
            const savedSequence = localStorage.getItem('ordersSequence');
            if (savedSequence) {
                const sequence = JSON.parse(savedSequence);
                if (sequence.length === data.data.length) {
                    const reorderedOrders = sequence.map((id: string) => 
                        data.data.find((order: Order) => order._id === id)
                    ).filter(Boolean);
                    setOrders(reorderedOrders);
                } else {
                    setOrders(data.data);
                }
            } else {
                setOrders(data.data);
            }
            
        } catch (err) {
            console.log(err);
        } finally {
            setLoading(false);
        }
    };

    const updateorderstatus = async (order_id: string, step: string): Promise<void> => {
       try {
            setUpdating(true);
            const res = await fetch(`${API_URL}/orders/updateorder`, {
                credentials: 'include',
                headers: {
                    'content-type': 'application/json'
                },
                method: 'PUT',
                body: JSON.stringify({
                    order_id,
                    step
                })
            });
            const data = await res.json();

            if (data.message === 'Order updated successfully' || res.ok) {
                await getAgentorders();
                setShowStatusModal(false);
                setSelectedOrder(null);
                setQrScanned(false);
            }
        } catch (err) {
            console.log(err);
        } finally {
            setUpdating(false);
        }
    };

    const calculateStats = (): Stats => {
        const total = orders.length;
        const totalAmount = orders.reduce((sum, order) => sum + parseFloat(order.order_totalamount || '0'), 0);
        const active = orders.filter(order => !order.order_flow[order.order_flow.length - 1].completed).length;
        const completed = orders.filter(order => order.order_flow[order.order_flow.length - 1].completed).length;

        return { total, totalAmount, active, completed };
    };

    const stats = calculateStats();

    const getNextIncompleteStep = (orderFlow: OrderFlow[]): OrderFlow | undefined => {
        return orderFlow.find(step => !step.completed);
    };

    const getCurrentStepIndex = (orderFlow: OrderFlow[]): number => {
        const index = orderFlow.findIndex(step => !step.completed);
        return index === -1 ? orderFlow.length : index;
    };

    const isLastStep = (orderFlow: OrderFlow[]): boolean => {
        const currentIndex = getCurrentStepIndex(orderFlow);
        return currentIndex === orderFlow.length - 1;
    };

    const openStatusModal = (order: Order): void => {
        setSelectedOrder(order);
        setQrScanned(false);
        setShowStatusModal(true);
    };

    const handleStatusUpdate = (): void => {
        if (selectedOrder) {
            const nextStep = getNextIncompleteStep(selectedOrder.order_flow);
            if (nextStep) {
                updateorderstatus(selectedOrder._id, nextStep.step);
            }
        }
    };

    const handleQRScanned = (): void => {
        setQrScanned(true);
        setShowQRModal(false);
    };

    const handleSwapToggle = () => {
        setIsSwapMode(!isSwapMode);
        setSelectedForSwap([]);
    };

    const handleOrderCheckboxClick = (orderId: string) => {
        if (selectedForSwap.includes(orderId)) {
            // Remove from selection
            setSelectedForSwap(selectedForSwap.filter(id => id !== orderId));
        } else {
            // Add to selection (no limit)
            const newSelected = [...selectedForSwap, orderId];
            setSelectedForSwap(newSelected);
        }
    };

    const performSwap = () => {
        if (selectedForSwap.length < 2) {
            toast.error('Please select at least 2 orders to swap');
            return;
        }

        // Get the indices of all selected orders
        const selectedIndices = selectedForSwap.map(id => 
            orders.findIndex(order => order._id === id)
        ).filter(index => index !== -1);

        if (selectedIndices.length < 2) {
            toast.error('Selected orders not found');
            return;
        }

        // Get the orders at these indices
        const selectedOrders = selectedIndices.map(index => orders[index]);

        // Sort indices to maintain order
        selectedIndices.sort((a, b) => a - b);

        // Create new orders array
        const newOrders = [...orders];

        // Rotate the selected orders: move each to the next position
        // Last selected order moves to first selected position
        for (let i = 0; i < selectedIndices.length; i++) {
            const currentIndex = selectedIndices[i];
            const nextOrderIndex = (i + 1) % selectedOrders.length;
            newOrders[currentIndex] = selectedOrders[nextOrderIndex];
        }

        setOrders(newOrders);
        setSelectedForSwap([]);
        toast.success(`Successfully swapped ${selectedOrders.length} orders!`);
    };

    const handleCompleteSwap = () => {
        const orderIds = orders.map(order => order._id);
        localStorage.setItem('ordersSequence', JSON.stringify(orderIds));
        
        const lockData = {
            timestamp: new Date().toISOString()
        };
        localStorage.setItem('orderLock', JSON.stringify(lockData));
        
        setIsOrderLocked(true);
        setIsSwapMode(false);
        setSelectedForSwap([]);
        toast.success('Order sequence locked successfully!');
    };

    const handleReswap = () => {
        localStorage.removeItem('orderLock');
        localStorage.removeItem('ordersSequence');
        setIsOrderLocked(false);
        toast.success('Order sequence unlocked. You can now reorder.');
    };

    interface StatCardProps {
        icon: React.ElementType;
        title: string;
        value: string | number;
        delay: number;
    }

    const StatCard: React.FC<StatCardProps> = ({ icon: Icon, title, value, delay }) => (
        <div
            className="bg-white rounded-2xl shadow-lg p-6 transform transition-all duration-500 hover:scale-105 hover:shadow-2xl animate-slideUp border border-gray-100"
            style={{ animationDelay: `${delay}ms` }}
        >
            <div className="flex items-center justify-between">
                <div>
                    <p className="text-gray-500 text-sm font-medium uppercase tracking-wide">{title}</p>
                    <p className="text-3xl font-bold text-gray-800 mt-2">{value}</p>
                </div>
                <div className={`${GRADIENT_CLASS} p-4 rounded-xl shadow-lg transform transition-transform hover:rotate-12`}>
                    <Icon className="w-8 h-8 text-white" />
                </div>
            </div>
        </div>
    );

    const QRCodeModal: React.FC = () => (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 animate-fadeIn">
            <div className="bg-white rounded-2xl p-8 max-w-md w-full transform transition-all duration-300 animate-slideUp shadow-2xl">
                <div className="flex justify-between items-center mb-6">
                    <h3 className="text-2xl font-bold text-gray-800">Scan QR Code</h3>
                    <button
                        onClick={() => setShowQRModal(false)}
                        className="text-gray-400 hover:text-gray-600 transition-colors"
                    >
                        <X className="w-6 h-6" />
                    </button>
                </div>

                {/* <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-5 mb-6"> */}
                           <img src={qrcode} alt="qrcode"  className='w-full h-full mb-6'/>
                {/* </div> */}


                <button
                    onClick={handleQRScanned}
                    className={`w-full ${GRADIENT_CLASS} text-white py-3 rounded-lg font-semibold hover:opacity-90 transition-all duration-300 transform hover:scale-105 shadow-lg`}
                >
                    QR Scanned Successfully
                </button>
            </div>
        </div>
    );

    const StatusUpdateModal: React.FC = () => {
        const order = selectedOrder;
        if (!order) return null;

        const nextStep = getNextIncompleteStep(order.order_flow);
        const showQRButton = isLastStep(order.order_flow) && order.order_paymenttype === 'online payment';
        const canUpdate = !showQRButton || qrScanned;

        const customerName = order?.user_name || 'N/A';
        const customerPhone = order?.user_phoneno || 'N/A';
        const customerAddress = `${order.user_address?.houseno || ''}, ${order.user_address?.streetname}, ${order.user_address?.area || ''}, ${order.user_address?.city || ''} , ${order.user_address?.pincode || ''}`;

        const handleCopyphone = () => {
            navigator.clipboard.writeText(customerPhone).then(() => {
                toast.success('Phone number copied to clipboard');
            })
            .catch((err) => {
                console.log(err);
                toast.error("Error in copy the phone number");
            });
        };

        const handleCopyaddress = () => {
            navigator.clipboard.writeText(customerAddress).then(() => {
                toast.success('Address copied to clipboard');
            })
            .catch((err) => {
                console.log(err);
                toast.error("Error in copy the Address");
            });
        };

        const handleOpenMap = () => {
            const encodedAddress = encodeURIComponent(customerAddress);
            const mapUrl = `https://www.google.com/maps/dir/?api=1&destination=${encodedAddress}&travelmode=driving`;
            window.open(mapUrl,'_blank');
        };

        return (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 animate-fadeIn">
                <div className="bg-white rounded-2xl p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto transform transition-all duration-300 animate-slideUp shadow-2xl">
                    <div className="flex justify-between items-center mb-6">
                        <h3 className="text-2xl font-bold text-gray-800">Update Order Status</h3>
                        <button
                            onClick={() => {
                                setShowStatusModal(false);
                                setSelectedOrder(null);
                                setQrScanned(false);
                            }}
                            className="text-gray-400 hover:text-gray-600 transition-colors"
                        >
                            <X className="w-6 h-6" />
                        </button>
                    </div>

                    <div className="bg-gradient-to-r from-blue-50 to-blue-100 rounded-xl p-5 mb-6 space-y-3">
                        <h4 className="text-lg font-bold text-gray-800 mb-3">Customer Details</h4>

                        <div className="flex items-start space-x-3">
                            <div className={`${GRADIENT_CLASS} p-2 rounded-lg shadow-md`}>
                                <User className="w-5 h-5 text-white" />
                            </div>
                            <div className="flex-1">
                                <p className="text-xs text-gray-600 mb-1">Name</p>
                                <p className="font-semibold text-gray-800">{customerName}</p>
                            </div>
                        </div>

                        <div className="flex items-start space-x-3">
                            <div className={`${GRADIENT_CLASS} p-2 rounded-lg shadow-md`}>
                                <Phone className="w-5 h-5 text-white" />
                            </div>
                            <div className='flex flex-1 justify-between'>
                                <div className="flex-1">
                                    <p className="text-xs text-gray-600 mb-1">Phone Number</p>
                                    <p className="font-semibold text-gray-800">{customerPhone}</p>
                                </div>
                                <Copy onClick={() => handleCopyphone()} className='text-blue-600 cursor-pointer mt-1 w-4 h-4 hover:text-blue-700' />
                            </div>
                        </div>

                        <div className="flex items-start space-x-3">
                            <div className={`${GRADIENT_CLASS} p-2 rounded-lg shadow-md`}>
                                <MapPin className="w-5 h-5 text-white" />
                            </div>
                            <div className='flex flex-1 justify-between'>
                                <div className="flex-1">
                                    <p className="text-xs text-gray-600 mb-1">Address</p>
                                    <p className="font-semibold text-gray-800 leading-relaxed">{customerAddress}</p>
                                </div>
                                <Copy onClick={() => handleCopyaddress()} className='text-blue-600 cursor-pointer mt-1 w-4 h-4 hover:text-blue-700' />
                            </div>
                        </div>
                        <div className='flex flex-col items-center justify-center flex-1'>
                            <Button 
                                onClick={() => handleOpenMap()}
                                className={`${GRADIENT_CLASS} text-white rounded-lg shadow-md w-[90%] py-3 font-semibold hover:opacity-90 transition-all`}>
                                Track Order
                            </Button>
                        </div>
                    </div>

                    <div className="bg-gradient-to-r from-blue-50 to-blue-100 rounded-xl p-4 mb-6">
                        <p className="text-sm text-gray-600 mb-1">Order ID</p>
                        <p className="font-mono text-lg font-semibold text-gray-800">#{order._id.slice(-8)}</p>
                    </div>

                    <div className="grid grid-cols-2 gap-4 mb-6">
                        <div>
                            <p className="text-sm text-gray-600">Total Amount</p>
                            <p className="text-xl font-bold text-green-600">₹{order.order_totalamount}</p>
                        </div>
                        <div>
                            <p className="text-sm text-gray-600">Total Clothes</p>
                            <p className="text-xl font-bold text-blue-600">{order.order_totalcloths}</p>
                        </div>
                        <div>
                            <p className="text-sm text-gray-600">Slot</p>
                            <p className="text-lg font-semibold text-gray-800">{order.order_slot}</p>
                        </div>
                        <div>
                            <p className="text-sm text-gray-600">Payment</p>
                            <p className="text-lg font-semibold text-gray-800 capitalize">{order.order_paymenttype}</p>
                        </div>
                    </div>

                    <div className="mb-6">
                        <label className="block text-sm font-semibold text-gray-700 mb-3">
                            Next Step to Complete
                        </label>
                        <div className="px-4 py-3 border-2 border-gray-300 rounded-lg bg-gray-50 font-medium text-gray-800">
                            {nextStep ? nextStep.step : 'All steps completed'}
                        </div>
                    </div>

                    <div className="mb-6">
                        <p className="text-sm font-semibold text-gray-700 mb-3">Order Progress</p>
                        <div className="space-y-3">
                            {order.order_flow.map((step, idx) => (
                                <div key={idx} className="flex items-center">
                                    <div className={`w-8 h-8 rounded-full flex items-center justify-center ${step.completed ? GRADIENT_CLASS : 'bg-gray-300'} transition-all duration-300 shadow-md`}>
                                        {step.completed && <CheckCircle className="w-5 h-5 text-white" />}
                                    </div>
                                    <div className="ml-3 flex-1">
                                        <p className={`font-medium ${step.completed ? 'text-blue-700' : 'text-gray-600'}`}>
                                            {step.step}
                                        </p>
                                        {step.completedAt && (
                                            <p className="text-xs text-gray-500">
                                                {new Date(step.completedAt).toLocaleString()}
                                            </p>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {showQRButton && (
                        <button
                            onClick={() => setShowQRModal(true)}
                            disabled={qrScanned}
                            className={`w-full ${qrScanned ? 'bg-green-500' : GRADIENT_CLASS} text-white py-3 rounded-lg font-semibold mb-3 transition-all duration-300 transform hover:scale-105 flex items-center justify-center shadow-lg ${qrScanned ? 'cursor-not-allowed' : 'hover:opacity-90'}`}
                        >
                            <QrCode className="w-5 h-5 mr-2" />
                            {qrScanned ? 'QR Code Verified ✓' : 'Show QR Code Scanner'}
                        </button>
                    )}

                    <button
                        onClick={handleStatusUpdate}
                        disabled={!canUpdate || updating}
                        className={`w-full py-3 rounded-lg font-semibold transition-all duration-300 transform shadow-lg ${!canUpdate || updating ? 'bg-gray-300 text-gray-500 cursor-not-allowed' : `${GRADIENT_CLASS} text-white hover:opacity-90 hover:scale-105`}`}
                    >
                        {updating ? 'Updating...' : 'Update Status'}
                    </button>
                </div>
            </div>
        );
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 flex items-center justify-center">
                <div className="relative">
                    <div className={`animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-transparent ${GRADIENT_CLASS}`}></div>
                    <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                        <Package className="w-6 h-6 text-blue-600 animate-pulse" />
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-100 via-white to-blue-200 p-4 md:p-8">
            <div className="max-w-7xl mx-auto">
                {/* Header Section */}
                <div className={`${GRADIENT_CLASS} rounded-3xl shadow-2xl p-6 md:p-8 mb-8 animate-slideUp`}>
                    <h1 className="text-3xl md:text-5xl font-bold text-white mb-2">Welcome! Agent</h1>
                    <p className="text-blue-100 text-base md:text-lg">Manage your orders efficiently</p>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                    <StatCard icon={Package} title="Total Orders" value={stats.total} delay={0} />
                    <StatCard icon={DollarSign} title="Total Amount" value={`₹${stats.totalAmount}`} delay={100} />
                    <StatCard icon={Clock} title="Active Orders" value={stats.active} delay={200} />
                    <StatCard icon={CheckCircle} title="Completed" value={stats.completed} delay={300} />
                </div>

                {/* Orders Section Header */}
                <div className="mb-6 animate-slideUp" style={{ animationDelay: '400ms' }}>
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-4">
                        <h2 className="text-2xl md:text-3xl font-bold text-gray-800">Your Orders</h2>
                        
                        {isOrderLocked && (
                            <button
                                onClick={handleReswap}
                                className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 md:px-5 md:py-2.5 rounded-xl font-bold transition-all duration-300 transform hover:scale-105 shadow-xl flex items-center gap-2 text-sm md:text-base"
                            >
                                <RefreshCw className="w-4 h-4 md:w-5 md:h-5" />
                                Re-Swap
                            </button>
                        )}
                    </div>

                    {!isOrderLocked && orders.length > 0 && (
                        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                            <button
                                onClick={handleSwapToggle}
                                className={`${isSwapMode ? 'bg-red-500 hover:bg-red-600' : GRADIENT_CLASS} text-white px-5 py-2.5 rounded-xl font-bold hover:opacity-90 transition-all duration-300 transform hover:scale-105 shadow-xl flex items-center justify-center gap-2 text-sm md:text-base`}
                            >
                                {isSwapMode ? (
                                    <>
                                        <X className="w-4 h-4 md:w-5 md:h-5" />
                                        Cancel
                                    </>
                                ) : (
                                    <>
                                        <ArrowUpDown className="w-4 h-4 md:w-5 md:h-5" />
                                        Swap Orders
                                    </>
                                )}
                            </button>
                            
                            {isSwapMode && (
                                <>
                                    <button
                                        onClick={performSwap}
                                        disabled={selectedForSwap.length < 2}
                                        className={`${selectedForSwap.length < 2 ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-500 hover:bg-blue-600'} text-white px-5 py-2.5 rounded-xl font-bold transition-all duration-300 transform hover:scale-105 shadow-xl flex items-center justify-center gap-2 text-sm md:text-base`}
                                    >
                                        <ArrowUpDown className="w-4 h-4 md:w-5 md:h-5" />
                                        Swap ({selectedForSwap.length})
                                    </button>
                                    <button
                                        onClick={handleCompleteSwap}
                                        className="bg-green-500 hover:bg-green-600 text-white px-5 py-2.5 rounded-xl font-bold transition-all duration-300 transform hover:scale-105 shadow-xl flex items-center justify-center gap-2 text-sm md:text-base"
                                    >
                                        <Check className="w-4 h-4 md:w-5 md:h-5" />
                                        Complete
                                    </button>
                                </>
                            )}
                        </div>
                    )}
                </div>

                {orders.length === 0 ? (
                    <div className='flex flex-col mx-auto w-full items-center justify-center py-12'>
                        <Package className='w-16 h-16 md:w-20 md:h-20 mt-4 text-blue-600' />
                        <div className='text-lg md:text-xl font-medium mt-3 text-gray-700'>
                            No orders for agent Today
                        </div>
                    </div>
                ) : (
                    <div className="space-y-6">
                        {orders.map((order, index) => {
                            const nextStep = getNextIncompleteStep(order.order_flow);
                            const currentIndex = getCurrentStepIndex(order.order_flow);
                            const progress = (currentIndex / order.order_flow.length) * 100;
                            const isSelected = selectedForSwap.includes(order._id);
                            const selectionNumber = selectedForSwap.indexOf(order._id) + 1;

                            return (
                                <div
                                    key={order._id}
                                    className="bg-white rounded-2xl p-4 md:p-8 shadow-xl hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 border border-gray-100 animate-slideUp relative"
                                    style={{ animationDelay: `${500 + index * 100}ms` }}
                                >
                                    {/* Checkbox for swap mode */}
                                    {isSwapMode && (
                                        <div className="absolute top-3 left-3 md:top-4 md:left-4 z-10">
                                            <div
                                                onClick={() => handleOrderCheckboxClick(order._id)}
                                                className={`w-8 h-8 md:w-10 md:h-10 rounded-lg flex items-center justify-center cursor-pointer transition-all duration-300 ${
                                                    isSelected 
                                                        ? 'bg-blue-500 text-white shadow-lg scale-110' 
                                                        : 'bg-gray-200 hover:bg-gray-300'
                                                }`}
                                            >
                                                {isSelected ? (
                                                    <span className="text-lg md:text-xl font-bold">{selectionNumber}</span>
                                                ) : (
                                                    <div className="w-5 h-5 md:w-6 md:h-6 border-2 border-gray-400 rounded"></div>
                                                )}
                                            </div>
                                        </div>
                                    )}

                                    <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
                                        <div className="flex-1">
                                            <div className="flex items-center gap-3 justify-between mb-4">
                                                <span className="font-mono text-sm md:text-base font-semibold text-gray-700 bg-gray-100 px-3 md:px-4 py-2 rounded-lg">
                                                    #{order._id.slice(-8)}
                                                </span>

                                                <div className={`w-6 h-6 md:w-7 md:h-7 ${GRADIENT_CLASS} rounded-full text-white items-center flex justify-center text-center text-xs md:text-sm font-bold`}>
                                                    {index + 1}
                                                </div>
                                            </div>

                                            <div className="grid grid-cols-2 gap-3 md:gap-4 mb-4">
                                                <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-3 rounded-xl">
                                                    <p className="text-xs text-blue-700 font-semibold mb-1">Amount</p>
                                                    <p className="font-bold text-blue-800 text-base md:text-lg">₹{order.order_totalamount}</p>
                                                </div>
                                                <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-3 rounded-xl">
                                                    <p className="text-xs text-blue-700 font-semibold mb-1">Clothes</p>
                                                    <p className="font-bold text-blue-800 text-base md:text-lg">{order.order_totalcloths}</p>
                                                </div>
                                                <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-3 rounded-xl">
                                                    <p className="text-xs text-blue-700 font-semibold mb-1">Slot</p>
                                                    <p className="font-bold text-blue-800 text-sm md:text-base">{order.order_slot}</p>
                                                </div>
                                                <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-3 rounded-xl">
                                                    <p className="text-xs text-blue-700 font-semibold mb-1">Delivery type</p>
                                                    <p className="font-bold text-blue-800 text-sm md:text-base capitalize">{order.order_deliveryspeed}</p>
                                                </div>
                                            </div>

                                            <div className="mb-3">
                                                <div className="flex justify-between text-sm text-gray-600 font-medium mb-2">
                                                    <span>Order Progress</span>
                                                    <span className="font-bold">{Math.round(progress)}%</span>
                                                </div>
                                                <div className="w-full bg-gray-200 rounded-full h-2.5 md:h-3 shadow-inner">
                                                    <div
                                                        className={`${GRADIENT_CLASS} h-2.5 md:h-3 rounded-full transition-all duration-500 shadow-md`}
                                                        style={{ width: `${progress}%` }}
                                                    ></div>
                                                </div>
                                            </div>

                                            {nextStep && (
                                                <div className="bg-blue-50 border-l-4 border-blue-500 p-3 rounded-r-lg">
                                                    <p className="text-xs md:text-sm text-gray-700">
                                                        Next Step: <span className="font-bold text-blue-700">{nextStep.step}</span>
                                                    </p>
                                                </div>
                                            )}
                                        </div>

                                        {nextStep && !isSwapMode && (
                                            <button
                                                onClick={() => openStatusModal(order)}
                                                className={`${GRADIENT_CLASS} text-white px-6 md:px-8 py-3 md:py-4 rounded-xl font-bold hover:opacity-90 transition-all duration-300 transform hover:scale-105 whitespace-nowrap shadow-xl text-sm md:text-base`}
                                            >
                                                Change Status
                                            </button>
                                        )}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>

            {showStatusModal && <StatusUpdateModal />}
            {showQRModal && <QRCodeModal />}

            <style jsx>{`
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
                        transform: translateY(30px);
                        opacity: 0;
                    }
                    to {
                        transform: translateY(0);
                        opacity: 1;
                    }
                }

                .animate-fadeIn {
                    animation: fadeIn 0.3s ease-out;
                }

                .animate-slideUp {
                    animation: slideUp 0.6s ease-out forwards;
                    opacity: 0;
                }
            `}</style>
        </div>
    );
};

export default Agenthome;