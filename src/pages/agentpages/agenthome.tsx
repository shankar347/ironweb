import React, { useState, useEffect } from 'react';
import { Package, DollarSign, Clock, CheckCircle, X, QrCode, User, Phone, MapPin, Box } from 'lucide-react';
import { API_URL } from '../../hooks/tools';

// Replace with actual API URL

const GRADIENT_CLASS = 'bg-gradient-to-r from-blue-500 via-blue-600 to-blue-700';

interface Address {
    _id: string;
    name?: string;
    phone?: string;
    address?: string;
    street?: string;
    city?: string;
    state?: string;
    pincode?: string;
    landmark?: string;
}

interface OrderFlow {
    step: string;
    completed: boolean;
    completedAt?: string;
}

interface Order {
    _id: string;
    userid: string;
    user_name:String,
    user_phoneno:String,
    user_address: Address;
    order_date: string;
    order_totalamount: string;
    order_totalcloths: string;
    order_deliveryspeed: string;
    order_slot: string;
    order_paymenttype: string;
    order_flow: OrderFlow[];
    createdAt: string;
    updatedAt: string;
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

    useEffect(() => {
        getAgentorders();
    }, []);

    const getAgentorders = async (): Promise<void> => {
        try {
            setLoading(true);
            const res = await fetch(`${API_URL}/admin/getagenttodayorders`, {
                credentials: 'include'
            });
            const data = await res.json();
            if (data.data) {
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

                <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-8 mb-6">
                    <div className="bg-white p-6 rounded-lg shadow-inner">
                        <div className="w-48 h-48 mx-auto bg-gray-200 rounded-lg flex items-center justify-center">
                            <QrCode className="w-32 h-32 text-gray-400" />
                        </div>
                    </div>
                </div>

                <p className="text-center text-gray-600 mb-6">
                    Ask the customer to show their QR code for verification
                </p>

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
        const customerAddress = order.user_address?.address ||
            `${order.user_address?.street || ''} ${order.user_address?.city || ''} ${order.user_address?.state || ''} ${order.user_address?.pincode || ''}`.trim() ||
            'N/A';

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
                            <div className="flex-1">
                                <p className="text-xs text-gray-600 mb-1">Phone Number</p>
                                <p className="font-semibold text-gray-800">{customerPhone}</p>
                            </div>
                        </div>

                        <div className="flex items-start space-x-3">
                            <div className={`${GRADIENT_CLASS} p-2 rounded-lg shadow-md`}>
                                <MapPin className="w-5 h-5 text-white" />
                            </div>
                            <div className="flex-1">
                                <p className="text-xs text-gray-600 mb-1">Address</p>
                                <p className="font-semibold text-gray-800 leading-relaxed">{customerAddress}</p>
                                {order.user_address?.landmark && (
                                    <p className="text-sm text-gray-600 mt-1">
                                        <span className="font-medium">Landmark:</span> {order.user_address.landmark}
                                    </p>
                                )}
                            </div>
                        </div>
                    </div>

                    <div className="bg-gradient-to-r from-blue-50 to-blue-100 rounded-xl p-4 mb-6">
                        <p className="text-sm text-gray-600 mb-1">Order ID</p>
                        <p className="font-mono text-lg font-semibold text-gray-800">{order._id}</p>
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
                                    <div className={`w-8 h-8 rounded-full flex items-center justify-center ${step.completed ? GRADIENT_CLASS : 'bg-gray-300'
                                        } transition-all duration-300 shadow-md`}>
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
                            className={`w-full ${qrScanned ? 'bg-green-500' : GRADIENT_CLASS} text-white py-3 rounded-lg font-semibold mb-3 transition-all duration-300 transform hover:scale-105 flex items-center justify-center shadow-lg ${qrScanned ? 'cursor-not-allowed' : 'hover:opacity-90'
                                }`}
                        >
                            <QrCode className="w-5 h-5 mr-2" />
                            {qrScanned ? 'QR Code Verified ✓' : 'Show QR Code Scanner'}
                        </button>
                    )}

                    <button
                        onClick={handleStatusUpdate}
                        disabled={!canUpdate || updating}
                        className={`w-full py-3 rounded-lg font-semibold transition-all duration-300 transform shadow-lg ${!canUpdate || updating
                            ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                            : `${GRADIENT_CLASS} text-white hover:opacity-90 hover:scale-105`
                            }`}
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
                <div className={`${GRADIENT_CLASS} rounded-3xl shadow-2xl p-8 mb-8 animate-slideUp`}>
                    <h1 className="text-4xl md:text-5xl font-bold text-white mb-2">Welcome! Agent</h1>
                    <p className="text-blue-100 text-lg">Manage your orders efficiently</p>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                    <StatCard
                        icon={Package}
                        title="Total Orders"
                        value={stats.total}
                        delay={0}
                    />
                    <StatCard
                        icon={DollarSign}
                        title="Total Amount"
                        value={`₹${stats.totalAmount}`}
                        delay={100}
                    />
                    <StatCard
                        icon={Clock}
                        title="Active Orders"
                        value={stats.active}
                        delay={200}
                    />
                    <StatCard
                        icon={CheckCircle}
                        title="Completed"
                        value={stats.completed}
                        delay={300}
                    />
                </div>

                {/* Orders Section */}
                <div className="mb-6 animate-slideUp" style={{ animationDelay: '400ms' }}>
                    <h2 className="text-3xl font-bold text-gray-800 mb-6">Your Orders</h2>
                </div>

                {
                    orders.length === 0 ?
                        <div className='flex flex-col mx-auto w-full items-center justify-center'>
                            <Package className='w-20 h-20 mt-4 text-primary' />
                            <div className='text-xl font-medium mt-1'>
                                No orders for agent Today
                            </div>
                        </div> : <div className="space-y-6">
                            {orders.map((order, index) => {
                                const nextStep = getNextIncompleteStep(order.order_flow);
                                const currentIndex = getCurrentStepIndex(order.order_flow);
                                const progress = (currentIndex / order.order_flow.length) * 100;

                                return (
                                    <div
                                        key={order._id}
                                        className="bg-white rounded-2xl p-6 md:p-8 shadow-xl hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 border border-gray-100 animate-slideUp"
                                        style={{ animationDelay: `${500 + index * 100}ms` }}
                                    >
                                        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
                                            <div className="flex-1">
                                                <div className="flex items-center gap-3 mb-4">
                                                    <span className="font-mono text-base font-semibold text-gray-700 bg-gray-100 px-4 py-2 rounded-lg">
                                                        #{order._id.slice(-8)}
                                                    </span>

                                                </div>

                                                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                                                    <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-3 rounded-xl">
                                                        <p className="text-xs text-blue-700 font-semibold mb-1">Amount</p>
                                                        <p className="font-bold text-blue-800 text-lg">₹{order.order_totalamount}</p>
                                                    </div>
                                                    <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-3 rounded-xl">
                                                        <p className="text-xs text-blue-700 font-semibold mb-1">Clothes</p>
                                                        <p className="font-bold text-blue-800 text-lg">{order.order_totalcloths}</p>
                                                    </div>
                                                    <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-3 rounded-xl">
                                                        <p className="text-xs text-blue-700 font-semibold mb-1">Slot</p>
                                                        <p className="font-bold text-blue-800">{order.order_slot}</p>
                                                    </div>
                                                    <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-3 rounded-xl">
                                                        <p className="text-xs text-blue-700 font-semibold mb-1">Delivery type</p>
                                                        <p className="font-bold text-blue-800 capitalize">{order.order_deliveryspeed}</p>
                                                    </div>
                                                </div>

                                                <div className="mb-3">
                                                    <div className="flex justify-between text-sm text-gray-600 font-medium mb-2">
                                                        <span>Order Progress</span>
                                                        <span className="font-bold">{Math.round(progress)}%</span>
                                                    </div>
                                                    <div className="w-full bg-gray-200 rounded-full h-3 shadow-inner">
                                                        <div
                                                            className={`${GRADIENT_CLASS} h-3 rounded-full transition-all duration-500 shadow-md`}
                                                            style={{ width: `${progress}%` }}
                                                        ></div>
                                                    </div>
                                                </div>

                                                {nextStep && (
                                                    <div className="bg-blue-50 border-l-4 border-blue-500 p-3 rounded-r-lg">
                                                        <p className="text-sm text-gray-700">
                                                            Next Step: <span className="font-bold text-blue-700">{nextStep.step}</span>
                                                        </p>
                                                    </div>
                                                )}
                                            </div>

                                            {nextStep && (
                                                <button
                                                    onClick={() => openStatusModal(order)}
                                                    className={`${GRADIENT_CLASS} text-white px-8 py-4 rounded-xl font-bold hover:opacity-90 transition-all duration-300 transform hover:scale-105 whitespace-nowrap shadow-xl`}
                                                >
                                                    Change Status
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                }
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