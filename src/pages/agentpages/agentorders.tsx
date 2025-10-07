import React, { useState, useEffect } from 'react';
import {
    Calendar,
    MapPin,
    Search,
    ChevronDown,
    Filter,
    X
} from 'lucide-react';
import { API_URL } from '../../hooks/tools';

// Mock API URL - replace with your actual API URL


// Global gradient variable
const GRADIENT_CLASS = 'bg-gradient-to-r from-blue-500 via-blue-600 to-blue-700';

// Types
interface Address {
    houseno?: string;
    streetname?: string;
    area?: string;
    city?: string;
    pincode?: string;
}

interface OrderFlow {
    step: string;
    completed: boolean;
    completedAt?: string;
}

interface Order {
    _id: string;
    userid: string;
    user_name?: string;
    user_phoneno?: string;
    user_address?: Address;
    order_date: string;
    order_totalamount: string;
    order_totalcloths: string;
    order_slot: string;
    order_paymenttype: string;
    order_flow: OrderFlow[];
    agent_id?: string;
    agent_name?: string;
    agent_phoneno?: string;
    createdAt?: string;
    updatedAt?: string;
    __v?: number;
}

interface Tab {
    id: string;
    label: string;
    shortLabel: string;
    count: number;
}

// Mobile Card Component
const OrderCard: React.FC<{ order: Order; getCurrentStatus: (flow: OrderFlow[]) => string }> = ({ order, getCurrentStatus }) => {
    const status = getCurrentStatus(order.order_flow);
    const isCompleted = status === 'Completed' || status === 'Clothes delivered';
    const orderDate = new Date(order.order_date);

    return (
        <div className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm hover:shadow-lg transition-all">
            {/* Header Row */}
            <div className="flex justify-between items-start mb-3 pb-3 border-b border-gray-100">
                <div className="flex-1 min-w-0">
                    <div className="font-mono text-xs bg-blue-50 text-blue-700 px-2.5 py-1 rounded-md inline-block mb-2 font-semibold">
                        #{order._id.substring(order._id.length - 8).toUpperCase()}
                    </div>
                    <div className="text-xs text-gray-500 flex items-center gap-2 flex-wrap">
                        <span>{orderDate.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}</span>
                        <span>•</span>
                        <span>{orderDate.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}</span>
                    </div>
                </div>
                <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold whitespace-nowrap ${isCompleted ? 'bg-green-100 text-green-700' : 'bg-orange-100 text-orange-700'}`}>
                    {status}
                </span>
            </div>

            {/* Customer Info */}
            <div className="space-y-2.5 mb-3 pb-3 border-b border-gray-100">
                <div>
                    <div className="text-xs font-medium text-gray-500 mb-1">Customer</div>
                    <div className="font-semibold text-gray-900 text-sm">{order.user_name || 'N/A'}</div>
                    <div className="text-sm text-gray-600 mt-0.5">{order.user_phoneno || 'No number'}</div>
                </div>
                {order.user_address?.area && (
                    <div>
                        <div className="text-xs font-medium text-gray-500 mb-1">Location</div>
                        <div className="text-sm text-gray-700 flex items-start gap-1">
                            <MapPin size={14} className="mt-0.5 text-gray-400 flex-shrink-0" />
                            <span>{order.user_address.area}{order.user_address.city ? `, ${order.user_address.city}` : ''}</span>
                        </div>
                    </div>
                )}
            </div>

            {/* Order Details Grid */}
            <div className="grid grid-cols-2 gap-3 mb-3">
                <div className="bg-blue-50 rounded-lg p-2.5">
                    <div className="text-xs text-blue-600 font-medium mb-1">Slot</div>
                    <div className="text-sm font-semibold text-blue-900">{order.order_slot}</div>
                </div>
                <div className="bg-purple-50 rounded-lg p-2.5">
                    <div className="text-xs text-purple-600 font-medium mb-1">Items</div>
                    <div className="text-sm font-semibold text-purple-900">{order.order_totalcloths} pcs</div>
                </div>
                <div className="bg-green-50 rounded-lg p-2.5">
                    <div className="text-xs text-green-600 font-medium mb-1">Amount</div>
                    <div className="text-base font-bold text-green-700">₹{order.order_totalamount}</div>
                </div>
                <div className="bg-amber-50 rounded-lg p-2.5">
                    <div className="text-xs text-amber-600 font-medium mb-1">Payment</div>
                    <div className="text-sm font-semibold text-amber-900">
                        {order.order_paymenttype === 'online payment' ? '💳 Online' : '💵 COD'}
                    </div>
                </div>
            </div>

            {/* Agent Info */}
            {order.agent_name && (
                <div className="pt-3 border-t border-gray-100 bg-gray-50 -mx-4 -mb-4 px-4 py-3 rounded-b-xl">
                    <div className="text-xs font-medium text-gray-500 mb-1">Delivery Agent</div>
                    <div className="text-sm font-semibold text-gray-800">{order.agent_name}</div>
                    {order.agent_phoneno && (
                        <div className="text-sm text-gray-600 mt-0.5">{order.agent_phoneno}</div>
                    )}
                </div>
            )}
        </div>
    );
};

// Main Component
const Agentorders: React.FC = () => {
    const [activeTab, setActiveTab] = useState<string>('all');
    const [startDate, setStartDate] = useState<string>('');
    const [endDate, setEndDate] = useState<string>('');
    const [location, setLocation] = useState<string>('All Locations');
    const [searchTerm, setSearchTerm] = useState<string>('');
    const [allOrders, setAllOrders] = useState<Order[]>([]);
    const [filteredOrders, setFilteredOrders] = useState<Order[]>([]);
    const [showFilters, setShowFilters] = useState<boolean>(false);

    // Fetch orders from API
    useEffect(() => {
        const getallorders = async () => {
            try {
                const res = await fetch(`${API_URL}/admin/getagentorders`, {
                    credentials: 'include'
                });
                const data = await res.json();

                if (data?.error) {
                    console.error(data?.error);
                    return;
                }

                setAllOrders(data?.data || []);
                setFilteredOrders(data?.data || []);
            } catch (err) {
                console.error('Error fetching orders:', err);
            }
        };
        getallorders();
    }, []);

    // Get unique locations from orders
    const getUniqueLocations = (): string[] => {
        const areas = new Set<string>();
        areas.add('All Locations');

        allOrders.forEach(order => {
            if (order.user_address?.area) {
                areas.add(order.user_address.area);
            }
        });

        return Array.from(areas);
    };

    const locations: string[] = getUniqueLocations();

    // Get current status from order flow
    const getCurrentStatus = (orderFlow: OrderFlow[]): string => {
        if (!orderFlow || orderFlow.length === 0) return 'Unknown';
        const currentStep = orderFlow.find(step => !step.completed);
        return currentStep ? currentStep.step : 'Completed';
    };

    // Get today's orders
    const getTodayOrders = (): Order[] => {
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        return allOrders.filter(order => {
            const orderDate = new Date(order.order_date);
            orderDate.setHours(0, 0, 0, 0);
            return orderDate.getTime() === today.getTime();
        });
    };

    // Get processing orders
    const getProcessingOrders = (): Order[] => {
        return allOrders.filter(order => {
            const status = getCurrentStatus(order.order_flow);
            return status !== 'Completed' && status !== 'Clothes delivered';
        });
    };

    // Get failed orders
    const getFailedOrders = (): Order[] => {
        return allOrders.filter(order => {
            const status = getCurrentStatus(order.order_flow);
            return status === 'Failed' || status === 'Cancelled';
        });
    };

    const tabs: Tab[] = [
        { id: 'all', label: 'All Orders', shortLabel: 'All', count: filteredOrders.length },
        { id: 'today', label: 'Today Orders', shortLabel: 'Today', count: getTodayOrders().length },
        { id: 'processing', label: 'Processing', shortLabel: 'Process', count: getProcessingOrders().length },
        { id: 'failed', label: 'Failed Orders', shortLabel: 'Failed', count: getFailedOrders().length }
    ];

    // Filter orders based on active tab
    const getDisplayedOrders = (): Order[] => {
        let ordersToDisplay: Order[] = [];

        switch (activeTab) {
            case 'today':
                ordersToDisplay = getTodayOrders();
                break;
            case 'processing':
                ordersToDisplay = getProcessingOrders();
                break;
            case 'failed':
                ordersToDisplay = getFailedOrders();
                break;
            default:
                ordersToDisplay = filteredOrders;
        }

        return ordersToDisplay;
    };

    // Apply filters function
    const applyFilters = () => {
        let filtered: Order[] = [...allOrders];

        // Date range filter
        if (startDate && endDate) {
            const start = new Date(startDate);
            start.setHours(0, 0, 0, 0);
            const end = new Date(endDate);
            end.setHours(23, 59, 59, 999);

            filtered = filtered.filter(order => {
                const orderDate = new Date(order.order_date);
                return orderDate >= start && orderDate <= end;
            });
        } else if (startDate) {
            const start = new Date(startDate);
            start.setHours(0, 0, 0, 0);

            filtered = filtered.filter(order => {
                const orderDate = new Date(order.order_date);
                return orderDate >= start;
            });
        } else if (endDate) {
            const end = new Date(endDate);
            end.setHours(23, 59, 59, 999);

            filtered = filtered.filter(order => {
                const orderDate = new Date(order.order_date);
                return orderDate <= end;
            });
        }

        // Location filter based on area
        if (location && location !== 'All Locations') {
            filtered = filtered.filter(order =>
                order.user_address?.area === location
            );
        }

        // Search filter
        if (searchTerm.trim() !== '') {
            const searchLower = searchTerm.toLowerCase().trim();
            filtered = filtered.filter(order =>
                order._id.toLowerCase().includes(searchLower) ||
                order.order_totalamount.includes(searchLower) ||
                order.order_totalcloths.includes(searchLower) ||
                order.order_paymenttype.toLowerCase().includes(searchLower) ||
                order.order_slot.toLowerCase().includes(searchLower) ||
                (order.user_name && order.user_name.toLowerCase().includes(searchLower)) ||
                (order.user_phoneno && order.user_phoneno.includes(searchLower)) ||
                (order.agent_name && order.agent_name.toLowerCase().includes(searchLower)) ||
                (order.agent_phoneno && order.agent_phoneno.includes(searchLower)) ||
                (order.user_address?.area && order.user_address.area.toLowerCase().includes(searchLower)) ||
                getCurrentStatus(order.order_flow).toLowerCase().includes(searchLower)
            );
        }

        setFilteredOrders(filtered);
        setActiveTab('all');
        setShowFilters(false);
    };

    // Clear filters
    const clearFilters = () => {
        setStartDate('');
        setEndDate('');
        setLocation('All Locations');
        setSearchTerm('');
        setFilteredOrders(allOrders);
        setActiveTab('all');
        setShowFilters(false);
    };

    // Real-time search as user types
    useEffect(() => {
        if (searchTerm.trim() === '') {
            setFilteredOrders(allOrders);
        } else {
            const searchLower = searchTerm.toLowerCase().trim();
            const filtered = allOrders.filter(order =>
                order._id.toLowerCase().includes(searchLower) ||
                order.order_totalamount.includes(searchLower) ||
                order.order_totalcloths.includes(searchLower) ||
                order.order_paymenttype.toLowerCase().includes(searchLower) ||
                order.order_slot.toLowerCase().includes(searchLower) ||
                (order.user_name && order.user_name.toLowerCase().includes(searchLower)) ||
                (order.user_phoneno && order.user_phoneno.includes(searchLower)) ||
                (order.agent_name && order.agent_name.toLowerCase().includes(searchLower)) ||
                (order.agent_phoneno && order.agent_phoneno.includes(searchLower)) ||
                (order.user_address?.area && order.user_address.area.toLowerCase().includes(searchLower)) ||
                getCurrentStatus(order.order_flow).toLowerCase().includes(searchLower)
            );
            setFilteredOrders(filtered);
        }
    }, [searchTerm, allOrders]);

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="w-full">
                {/* Header - Fully Responsive */}
                <div className="bg-white shadow-sm">
                    <div className="px-4 py-4 sm:px-6 md:px-8 lg:px-10">
                        <h1 className={`text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold ${GRADIENT_CLASS} bg-clip-text text-transparent mb-1`}>
                            Agent Orders
                        </h1>
                        <p className="text-xs sm:text-sm md:text-base text-gray-600">Track and manage all your order details</p>
                    </div>
                </div>

                {/* Tabs - Fully Responsive with Horizontal Scroll */}
                <div className="bg-white border-b border-gray-200 sticky top-0 z-10 shadow-sm">
                    <div className="px-2 sm:px-4 md:px-6 lg:px-8 py-3">
                        <div className="flex gap-2 overflow-x-auto scrollbar-hide snap-x snap-mandatory pb-1">
                            {tabs.map((tab) => (
                                <button
                                    key={tab.id}
                                    onClick={() => setActiveTab(tab.id)}
                                    className={`flex-shrink-0 snap-start px-3 sm:px-4 md:px-6 py-2 sm:py-2.5 rounded-lg font-semibold text-xs sm:text-sm md:text-base transition-all duration-200 ${
                                        activeTab === tab.id
                                            ? `${GRADIENT_CLASS} text-white shadow-lg scale-105`
                                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                    }`}
                                >
                                    <span className="hidden sm:inline">{tab.label}</span>
                                    <span className="inline sm:hidden">{tab.shortLabel}</span>
                                    <span className={`ml-1.5 sm:ml-2 px-1.5 sm:px-2 py-0.5 sm:py-1 rounded-full text-xs ${
                                        activeTab === tab.id ? 'bg-white/20' : 'bg-gray-300'
                                    }`}>
                                        {tab.count}
                                    </span>
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Filter Toggle Button - Mobile Only */}
                <div className="px-4 py-3 bg-white border-b border-gray-200">
                    <button
                        onClick={() => setShowFilters(!showFilters)}
                        className={`w-full ${GRADIENT_CLASS} text-white rounded-lg font-medium flex items-center justify-center gap-2 py-2.5 text-sm sm:text-base transition-all shadow-md hover:shadow-lg`}
                    >
                        {showFilters ? <X size={18} /> : <Filter size={18} />}
                        {showFilters ? 'Hide Filters' : 'Show Filters & Search'}
                    </button>
                </div>

                {/* Filters Section - Collapsible on Mobile */}
                <div className={`${showFilters ? 'block' : 'hidden'} bg-white border-b border-gray-200`}>
                    <div className="px-4 sm:px-6 md:px-8 lg:px-10 py-4">
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
                            {/* Start Date */}
                            <div className="space-y-1.5">
                                <label className="block text-xs sm:text-sm font-semibold text-gray-700">Start Date</label>
                                <div className="relative">
                                    <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
                                    <input
                                        type="date"
                                        value={startDate}
                                        onChange={(e) => setStartDate(e.target.value)}
                                        className="w-full pl-9 pr-3 py-2 sm:py-2.5 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    />
                                </div>
                            </div>

                            {/* End Date */}
                            <div className="space-y-1.5">
                                <label className="block text-xs sm:text-sm font-semibold text-gray-700">End Date</label>
                                <div className="relative">
                                    <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
                                    <input
                                        type="date"
                                        value={endDate}
                                        onChange={(e) => setEndDate(e.target.value)}
                                        className="w-full pl-9 pr-3 py-2 sm:py-2.5 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    />
                                </div>
                            </div>

                            {/* Location Filter */}
                            <div className="space-y-1.5">
                                <label className="block text-xs sm:text-sm font-semibold text-gray-700">Location</label>
                                <div className="relative">
                                    <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
                                    <select
                                        value={location}
                                        onChange={(e) => setLocation(e.target.value)}
                                        className="w-full pl-9 pr-8 py-2 sm:py-2.5 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none bg-white"
                                    >
                                        {locations.map((loc) => (
                                            <option key={loc} value={loc}>
                                                {loc}
                                            </option>
                                        ))}
                                    </select>
                                    <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none" size={16} />
                                </div>
                            </div>

                            {/* Search */}
                            <div className="space-y-1.5">
                                <label className="block text-xs sm:text-sm font-semibold text-gray-700">Search</label>
                                <div className="relative">
                                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
                                    <input
                                        type="text"
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                        placeholder="Search orders..."
                                        className="w-full pl-9 pr-3 py-2 sm:py-2.5 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Filter Buttons */}
                        <div className="mt-4 flex flex-col sm:flex-row gap-2 sm:gap-3">
                            <button
                                onClick={applyFilters}
                                className={`flex-1 sm:flex-none px-4 sm:px-6 py-2 sm:py-2.5 ${GRADIENT_CLASS} text-white rounded-lg font-semibold text-sm sm:text-base hover:shadow-lg transition-all`}
                            >
                                Apply Filters
                            </button>
                            <button
                                onClick={clearFilters}
                                className="flex-1 sm:flex-none px-4 sm:px-6 py-2 sm:py-2.5 bg-gray-200 text-gray-700 rounded-lg font-semibold text-sm sm:text-base hover:bg-gray-300 transition-all"
                            >
                                Clear All
                            </button>
                        </div>
                    </div>
                </div>

                {/* Orders Display Section */}
                <div className="px-3 sm:px-4 md:px-6 lg:px-8 py-4 sm:py-6">
                    {/* Results Header */}
                    <div className="mb-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 sm:gap-4">
                        <h2 className="text-base sm:text-lg md:text-xl font-bold text-gray-800">
                            {tabs.find(t => t.id === activeTab)?.label}
                        </h2>
                        <div className="flex items-center gap-2 bg-blue-50 px-3 py-1.5 rounded-full">
                            <span className="text-xs sm:text-sm text-gray-600">Total:</span>
                            <span className="text-sm sm:text-base font-bold text-blue-600">{getDisplayedOrders().length}</span>
                            <span className="text-xs sm:text-sm text-gray-600">orders</span>
                        </div>
                    </div>

                    {/* Orders Cards - Responsive Grid */}
                    {getDisplayedOrders().length === 0 ? (
                        <div className="bg-white rounded-xl shadow-sm p-8 sm:p-12 text-center">
                            <div className="text-gray-400 mb-3">
                                <Search size={48} className="mx-auto" />
                            </div>
                            <p className="text-sm sm:text-base text-gray-500 font-medium">No orders found</p>
                            <p className="text-xs sm:text-sm text-gray-400 mt-1">Try adjusting your filters</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3 sm:gap-4">
                            {getDisplayedOrders().map((order) => (
                                <OrderCard key={order._id} order={order} getCurrentStatus={getCurrentStatus} />
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Agentorders;