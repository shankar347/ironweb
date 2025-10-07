import React, { useState, useEffect } from 'react';
import {
    Calendar,
    MapPin,
    Search,
    ChevronDown,
    TrendingUp,
    DollarSign,
    ShoppingBag,
    IndianRupee,
    X,
    Filter,
    ChevronRight
} from 'lucide-react';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
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
}

interface DailyTransaction {
    date: string;
    totalAmount: number;
    totalOrders: number;
    orders: Order[];
}

interface Column {
    header: string;
    key: string;
    render?: (row: DailyTransaction) => React.ReactNode;
}

// Mobile Order Card Component
const MobileOrderCard: React.FC<{ transaction: DailyTransaction; onExpand: () => void; isExpanded: boolean }> = ({ 
    transaction, 
    onExpand, 
    isExpanded 
}) => {
    const date = new Date(transaction.date);
    
    return (
        <div className="bg-white rounded-lg shadow-md mb-3 overflow-hidden">
            <div 
                className="p-4 cursor-pointer hover:bg-gray-50 transition-colors"
                onClick={onExpand}
            >
                <div className="flex justify-between items-start mb-3">
                    <div>
                        <div className="font-bold text-gray-800 text-lg">
                            {date.toLocaleDateString('en-US', { weekday: 'short' })}
                        </div>
                        <div className="text-sm text-gray-600">
                            {date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                        </div>
                    </div>
                    <ChevronRight 
                        className={`text-gray-400 transition-transform ${isExpanded ? 'rotate-90' : ''}`} 
                        size={20} 
                    />
                </div>
                
                <div className="flex justify-between items-center">
                    <div className="flex items-center space-x-2">
                        <ShoppingBag size={16} className="text-blue-600" />
                        <span className="text-sm font-medium text-gray-700">
                            {transaction.totalOrders} Orders
                        </span>
                    </div>
                    <div className="text-right">
                        <div className="font-bold text-green-600 text-lg">
                            ₹{transaction.totalAmount.toFixed(2)}
                        </div>
                        <div className="text-xs text-gray-500">
                            Avg: ₹{(transaction.totalAmount / transaction.totalOrders).toFixed(2)}
                        </div>
                    </div>
                </div>
            </div>
            
            {isExpanded && (
                <div className="border-t border-gray-200 p-4 bg-gray-50">
                    <h4 className="font-semibold text-gray-700 mb-3 text-sm">Order Details:</h4>
                    <div className="space-y-2">
                        {transaction.orders.map((order) => (
                            <div key={order._id} className="bg-white rounded-lg p-3 shadow-sm">
                                <div className="flex justify-between items-start mb-2">
                                    <div className="text-xs font-mono text-gray-500">
                                        ID: {order._id.substring(order._id.length - 8)}
                                    </div>
                                    <div className="font-bold text-green-600">
                                        ₹{order.order_totalamount}
                                    </div>
                                </div>
                                <div className="space-y-1 text-sm">
                                    <div className="flex justify-between">
                                        <span className="text-gray-600">Customer:</span>
                                        <span className="font-medium">{order.user_name || 'N/A'}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-gray-600">Phone:</span>
                                        <span className="font-medium">{order.user_phoneno || 'N/A'}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-gray-600">Agent:</span>
                                        <span className="font-medium">{order.agent_name || 'No driver'}</span>
                                    </div>
                                    {order.agent_phoneno && (
                                        <div className="flex justify-between">
                                            <span className="text-gray-600">Agent Phone:</span>
                                            <span className="font-medium">{order.agent_phoneno}</span>
                                        </div>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

// Transaction DataTable Component with horizontal scroll
const TransactionDataTable: React.FC<{ data: DailyTransaction[]; columns: Column[] }> = ({ data, columns }) => {
    const [expandedRow, setExpandedRow] = useState<string | null>(null);

    return (
        <div className="overflow-x-auto rounded-lg shadow-lg">
            <table className="min-w-full divide-y divide-gray-200 rounded-lg overflow-hidden">
                <thead className={`${GRADIENT_CLASS} text-white`}>
                    <tr>
                        {columns.map((column) => (
                            <th
                                key={column.key}
                                className="px-6 py-5 text-left text-xs font-medium text-white uppercase tracking-wider whitespace-nowrap"
                            >
                                {column.header}
                            </th>
                        ))}
                    </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                    {data.length === 0 ? (
                        <tr>
                            <td
                                colSpan={columns.length}
                                className="px-6 py-8 text-center text-gray-500"
                            >
                                No transactions found
                            </td>
                        </tr>
                    ) : (
                        data.map((row) => (
                            <React.Fragment key={row.date}>
                                <tr
                                    className="hover:bg-gray-50 cursor-pointer"
                                    onClick={() => setExpandedRow(expandedRow === row.date ? null : row.date)}
                                >
                                    {columns.map((column) => (
                                        <td
                                            key={column.key}
                                            className="px-6 py-4 whitespace-nowrap"
                                        >
                                            {column.render ? column.render(row) : row[column.key as keyof DailyTransaction]}
                                        </td>
                                    ))}
                                </tr>
                                {expandedRow === row.date && (
                                    <tr>
                                        <td colSpan={columns.length} className="px-6 py-4 bg-gray-50">
                                            <div className="space-y-2">
                                                <h4 className="font-semibold text-gray-700 mb-3">Order Details:</h4>
                                                <div className="overflow-x-auto">
                                                    <table className="min-w-full text-sm">
                                                        <thead className="bg-gray-200">
                                                            <tr>
                                                                <th className="px-4 py-2 text-left">Order ID</th>
                                                                <th className="px-4 py-2 text-left">Customer</th>
                                                                <th className="px-4 py-2 text-left">Phone</th>
                                                                <th className="px-4 py-2 text-left">Agent</th>
                                                                <th className="px-4 py-2 text-left">Agent Phone</th>
                                                                <th className="px-4 py-2 text-left">Amount</th>
                                                            </tr>
                                                        </thead>
                                                        <tbody className="divide-y">
                                                            {row.orders.map((order) => (
                                                                <tr key={order._id} className="hover:bg-gray-100">
                                                                    <td className="px-4 py-2 font-mono text-xs">
                                                                        {order._id.substring(order._id.length - 8)}
                                                                    </td>
                                                                    <td className="px-4 py-2">{order.user_name || 'N/A'}</td>
                                                                    <td className="px-4 py-2">{order.user_phoneno || 'N/A'}</td>
                                                                    <td className="px-4 py-2">{order.agent_name || 'No driver'}</td>
                                                                    <td className="px-4 py-2">{order.agent_phoneno || 'N/A'}</td>
                                                                    <td className="px-4 py-2 font-bold text-green-600">
                                                                        ₹{order.order_totalamount}
                                                                    </td>
                                                                </tr>
                                                            ))}
                                                        </tbody>
                                                    </table>
                                                </div>
                                            </div>
                                        </td>
                                    </tr>
                                )}
                            </React.Fragment>
                        ))
                    )}
                </tbody>
            </table>
        </div>
    );
};

// Main Transaction Page Component
const Agentanalysis: React.FC = () => {
    const [timeFilter, setTimeFilter] = useState<string>('all');
    const [startDate, setStartDate] = useState<string>('');
    const [endDate, setEndDate] = useState<string>('');
    const [location, setLocation] = useState<string>('All Locations');
    const [searchTerm, setSearchTerm] = useState<string>('');
    const [allOrders, setAllOrders] = useState<Order[]>([]);
    const [filteredOrders, setFilteredOrders] = useState<Order[]>([]);
    const [chartType, setChartType] = useState<'line' | 'bar'>('bar');
    const [showFilters, setShowFilters] = useState<boolean>(false);
    const [expandedCard, setExpandedCard] = useState<string | null>(null);

    // Fetch orders from API
    useEffect(() => {
        const getallorders = async () => {
            try {
                // Mock data for demo
             
                  const res = await fetch(`${API_URL}/admin/getagentorders`, {
                    credentials: 'include'
                });
                const data = await res.json();
                setAllOrders(data?.data || []);
                setFilteredOrders(data?.data || []);
            } catch (err) {
                console.error('Error fetching orders:', err);
            }
        };
        getallorders();
    }, []);

    // Get unique locations
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

    // Group orders by date
    const groupOrdersByDate = (orders: Order[]): DailyTransaction[] => {
        const grouped: { [key: string]: Order[] } = {};

        orders.forEach(order => {
            const date = new Date(order.order_date);
            const dateKey = date.toISOString().split('T')[0];

            if (!grouped[dateKey]) {
                grouped[dateKey] = [];
            }
            grouped[dateKey].push(order);
        });

        const transactions: DailyTransaction[] = Object.keys(grouped)
            .sort((a, b) => new Date(b).getTime() - new Date(a).getTime())
            .map(dateKey => {
                const orders = grouped[dateKey];
                const totalAmount = orders.reduce((sum, order) => sum + parseFloat(order.order_totalamount), 0);

                return {
                    date: dateKey,
                    totalAmount,
                    totalOrders: orders.length,
                    orders
                };
            });

        return transactions;
    };

    // Apply time filter
    const applyTimeFilter = (filter: string) => {
        const now = new Date();
        let filtered: Order[] = [...allOrders];

        switch (filter) {
            case 'today':
                const todayStart = new Date(now.setHours(0, 0, 0, 0));
                filtered = allOrders.filter(order => {
                    const orderDate = new Date(order.order_date);
                    return orderDate >= todayStart;
                });
                break;

            case 'week':
                const weekStart = new Date(now.setDate(now.getDate() - 7));
                filtered = allOrders.filter(order => {
                    const orderDate = new Date(order.order_date);
                    return orderDate >= weekStart;
                });
                break;

            case 'month':
                const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
                filtered = allOrders.filter(order => {
                    const orderDate = new Date(order.order_date);
                    return orderDate >= monthStart;
                });
                break;

            case '3months':
                const threeMonthsStart = new Date(now.setMonth(now.getMonth() - 3));
                filtered = allOrders.filter(order => {
                    const orderDate = new Date(order.order_date);
                    return orderDate >= threeMonthsStart;
                });
                break;

            default:
                filtered = allOrders;
        }

        setFilteredOrders(filtered);
        setTimeFilter(filter);
        setShowFilters(false);
    };

    // Apply all filters
    const applyFilters = () => {
        let filtered: Order[] = [...allOrders];

        if (startDate && endDate) {
            const start = new Date(startDate);
            start.setHours(0, 0, 0, 0);
            const end = new Date(endDate);
            end.setHours(23, 59, 59, 999);

            filtered = filtered.filter(order => {
                const orderDate = new Date(order.order_date);
                return orderDate >= start && orderDate <= end;
            });
        }

        if (location && location !== 'All Locations') {
            filtered = filtered.filter(order =>
                order.user_address?.area === location
            );
        }

        if (searchTerm.trim() !== '') {
            const searchLower = searchTerm.toLowerCase().trim();
            filtered = filtered.filter(order =>
                order._id.toLowerCase().includes(searchLower) ||
                (order.user_name && order.user_name.toLowerCase().includes(searchLower)) ||
                (order.user_phoneno && order.user_phoneno.includes(searchLower)) ||
                (order.agent_name && order.agent_name.toLowerCase().includes(searchLower))
            );
        }

        setFilteredOrders(filtered);
        setTimeFilter('custom');
        setShowFilters(false);
    };

    // Clear filters
    const clearFilters = () => {
        setStartDate('');
        setEndDate('');
        setLocation('All Locations');
        setSearchTerm('');
        setFilteredOrders(allOrders);
        setTimeFilter('all');
        setShowFilters(false);
    };

    // Generate columns
    const generateColumns = (): Column[] => {
        return [
            {
                header: 'Date',
                key: 'date',
                render: (row: DailyTransaction) => {
                    const date = new Date(row.date);
                    return (
                        <div className="space-y-1">
                            <div className="font-bold text-gray-800">
                                {date.toLocaleDateString('en-US', { weekday: 'short' })}
                            </div>
                            <div className="text-sm text-gray-600">
                                {date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                            </div>
                        </div>
                    );
                }
            },
            {
                header: 'Total Orders',
                key: 'totalOrders',
                render: (row: DailyTransaction) => (
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                        <ShoppingBag size={16} className="mr-1" />
                        {row.totalOrders}
                    </span>
                )
            },
            {
                header: 'Total Amount',
                key: 'totalAmount',
                render: (row: DailyTransaction) => (
                    <div className="space-y-1">
                        <div className="font-bold text-green-600 text-lg">
                            ₹{row.totalAmount.toFixed(2)}
                        </div>
                        <div className="text-xs text-gray-500">
                            Avg: ₹{(row.totalAmount / row.totalOrders).toFixed(2)}
                        </div>
                    </div>
                )
            },
            {
                header: 'Actions',
                key: 'actions',
                render: (row: DailyTransaction) => (
                    <button className="text-blue-600 hover:text-blue-800 font-medium text-sm">
                        View Details →
                    </button>
                )
            }
        ];
    };

    const dailyTransactions = groupOrdersByDate(filteredOrders);

    // Prepare chart data
    const chartData = dailyTransactions.slice(0, 15).reverse().map(transaction => ({
        date: new Date(transaction.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        amount: transaction.totalAmount,
        orders: transaction.totalOrders
    }));

    // Calculate statistics
    const totalRevenue = dailyTransactions.reduce((sum, t) => sum + t.totalAmount, 0);
    const totalOrders = dailyTransactions.reduce((sum, t) => sum + t.totalOrders, 0);
    const avgOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0;

    return (
        <div className="min-h-screen bg-gray-50 p-3 sm:p-4 md:p-6">
            <div className="max-w-full mx-auto space-y-4 sm:space-y-6">
                {/* Header */}
                <div className="rounded-lg p-4 sm:p-6">
                    <h1 className={`text-2xl sm:text-3xl font-bold ${GRADIENT_CLASS} bg-clip-text text-transparent mb-2`}>
                        Transaction Overview
                    </h1>
                    <p className="text-sm sm:text-base text-gray-600">View daily transaction summaries and revenue analytics</p>
                </div>

                {/* Statistics Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 md:gap-6">
                    <div className={`${GRADIENT_CLASS} rounded-lg p-4 sm:p-6 text-white shadow-lg`}>
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-xs sm:text-sm opacity-90">Total Revenue</p>
                                <h3 className="text-2xl sm:text-3xl font-bold mt-2">₹{totalRevenue.toFixed(2)}</h3>
                            </div>
                            <IndianRupee size={36} className="opacity-50 sm:w-12 sm:h-12" />
                        </div>
                    </div>

                    <div className="bg-white rounded-lg p-4 sm:p-6 shadow-lg border-2 border-blue-200">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-xs sm:text-sm text-gray-600">Total Orders</p>
                                <h3 className="text-2xl sm:text-3xl font-bold text-gray-800 mt-2">{totalOrders}</h3>
                            </div>
                            <ShoppingBag size={36} className="text-blue-500 opacity-50 sm:w-12 sm:h-12" />
                        </div>
                    </div>

                    <div className="bg-white rounded-lg p-4 sm:p-6 shadow-lg border-2 border-green-200 sm:col-span-2 lg:col-span-1">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-xs sm:text-sm text-gray-600">Avg Order Value</p>
                                <h3 className="text-2xl sm:text-3xl font-bold text-gray-800 mt-2">₹{avgOrderValue.toFixed(2)}</h3>
                            </div>
                            <TrendingUp size={36} className="text-green-500 opacity-50 sm:w-12 sm:h-12" />
                        </div>
                    </div>
                </div>

                {/* Time Filter Buttons */}
                <div className="p-3 sm:p-4">
                    {/* Mobile Filter Button */}
                    <div className="lg:hidden mb-3">
                        <button
                            onClick={() => setShowFilters(!showFilters)}
                            className={`w-full px-4 py-3 rounded-lg font-semibold flex items-center justify-center gap-2 ${GRADIENT_CLASS} text-white shadow-lg`}
                        >
                            <Filter size={18} />
                            {showFilters ? 'Hide Filters' : 'Show Filters'}
                        </button>
                    </div>

                    {/* Desktop & Mobile Filter Buttons */}
                    <div className={`${showFilters || window.innerWidth >= 1024 ? 'block' : 'hidden'} lg:block`}>
                        <div className="grid grid-cols-2 sm:flex sm:flex-wrap gap-2 sm:gap-3">
                            {[
                                { id: 'all', label: 'All Time' },
                                { id: 'today', label: 'Today' },
                                { id: 'week', label: 'This Week' },
                                { id: 'month', label: 'This Month' },
                                { id: '3months', label: '3 Months' }
                            ].map((filter) => (
                                <button
                                    key={filter.id}
                                    onClick={() => applyTimeFilter(filter.id)}
                                    className={`px-3 sm:px-6 py-2 sm:py-3 rounded-lg font-semibold text-sm sm:text-base transition-all duration-200 ${
                                        timeFilter === filter.id
                                            ? `${GRADIENT_CLASS} text-white shadow-lg transform scale-105`
                                            : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                                    }`}
                                >
                                    {filter.label}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Advanced Filters */}
                <div className={`${showFilters || window.innerWidth >= 1024 ? 'block' : 'hidden'} lg:block p-3 sm:p-6 pt-0`}>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
                        <div className="space-y-2">
                            <label className="block text-xs sm:text-sm font-medium text-gray-700">Start Date</label>
                            <div className="relative">
                                <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
                                <input
                                    type="date"
                                    value={startDate}
                                    onChange={(e) => setStartDate(e.target.value)}
                                    className="w-full pl-9 pr-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="block text-xs sm:text-sm font-medium text-gray-700">End Date</label>
                            <div className="relative">
                                <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
                                <input
                                    type="date"
                                    value={endDate}
                                    onChange={(e) => setEndDate(e.target.value)}
                                    className="w-full pl-9 pr-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="block text-xs sm:text-sm font-medium text-gray-700">Location</label>
                            <div className="relative">
                                <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
                                <select
                                    value={location}
                                    onChange={(e) => setLocation(e.target.value)}
                                    className="w-full pl-9 pr-8 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none bg-white"
                                >
                                    {locations.map((loc) => (
                                        <option key={loc} value={loc}>{loc}</option>
                                    ))}
                                </select>
                                <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="block text-xs sm:text-sm font-medium text-gray-700">Search</label>
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
                                <input
                                    type="text"
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    placeholder="Search..."
                                    className="w-full pl-9 pr-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                />
                            </div>
                        </div>
                    </div>

                    <div className="mt-3 sm:mt-4 flex flex-col sm:flex-row gap-2 sm:gap-3">
                        <button
                            onClick={applyFilters}
                            className={`w-full sm:w-auto px-4 sm:px-6 py-2 ${GRADIENT_CLASS} text-white rounded-lg text-sm sm:text-base font-medium hover:shadow-lg transition-all duration-200 transform hover:scale-105`}
                        >
                            Apply Filters
                        </button>
                        <button
                            onClick={clearFilters}
                            className="w-full sm:w-auto px-4 sm:px-6 py-2 bg-gray-200 text-gray-700 rounded-lg text-sm sm:text-base font-medium hover:bg-gray-300 transition-all duration-200"
                        >
                            Clear Filters
                        </button>
                    </div>
                </div>

                {/* Charts */}
                <div className="bg-white rounded-lg shadow-md p-4 sm:p-6">
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 sm:mb-6 gap-3">
                        <h2 className="text-lg sm:text-xl font-semibold text-gray-800">Revenue Trend</h2>
                        <div className="flex gap-2 w-full sm:w-auto">
                            <button
                                onClick={() => setChartType('bar')}
                                className={`flex-1 sm:flex-none px-3 sm:px-4 py-2 rounded-lg text-sm font-medium ${
                                    chartType === 'bar' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700'
                                }`}
                            >
                                Bar Chart
                            </button>
                            <button
                                onClick={() => setChartType('line')}
                                className={`flex-1 sm:flex-none px-3 sm:px-4 py-2 rounded-lg text-sm font-medium ${
                                    chartType === 'line' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700'
                                }`}
                            >
                                Line Chart
                            </button>
                        </div>
                    </div>

                    <ResponsiveContainer width="100%" height={250} className="sm:hidden">
                        {chartType === 'bar' ? (
                            <BarChart data={chartData}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="date" tick={{ fontSize: 10 }} />
                                <YAxis tick={{ fontSize: 10 }} />
                                <Tooltip />
                                <Bar dataKey="amount" fill="#3b82f6" name="Revenue (₹)" />
                            </BarChart>
                        ) : (
                            <LineChart data={chartData}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="date" tick={{ fontSize: 10 }} />
                                <YAxis tick={{ fontSize: 10 }} />
                                <Tooltip />
                                <Line type="monotone" dataKey="amount" stroke="#3b82f6" strokeWidth={2} name="Revenue (₹)" />
                            </LineChart>
                        )}
                    </ResponsiveContainer>

                    <ResponsiveContainer width="100%" height={300} className="hidden sm:block">
                        {chartType === 'bar' ? (
                            <BarChart data={chartData}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="date" />
                                <YAxis />
                                <Tooltip />
                                <Legend />
                                <Bar dataKey="amount" fill="#3b82f6" name="Revenue (₹)" />
                                <Bar dataKey="orders" fill="#10b981" name="Orders" />
                            </BarChart>
                        ) : (
                            <LineChart data={chartData}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="date" />
                                <YAxis />
                                <Tooltip />
                                <Legend />
                                <Line type="monotone" dataKey="amount" stroke="#3b82f6" strokeWidth={2} name="Revenue (₹)" />
                                <Line type="monotone" dataKey="orders" stroke="#10b981" strokeWidth={2} name="Orders" />
                            </LineChart>
                        )}
                    </ResponsiveContainer>
                </div>

                {/* Transaction Table - Desktop */}
                <div className="hidden md:block bg-white rounded-lg shadow-md p-4 sm:p-6">
                    <div className="mb-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                        <h2 className="text-lg sm:text-xl font-semibold text-gray-800">Daily Transactions</h2>
                        <span className="text-xs sm:text-sm text-gray-600 bg-gray-100 px-3 py-1 rounded-full">
                            Total Days: <span className="font-bold text-blue-600">{dailyTransactions.length}</span>
                        </span>
                    </div>

                    <TransactionDataTable data={dailyTransactions} columns={generateColumns()} />
                </div>

                {/* Transaction Cards - Mobile */}
                <div className="md:hidden bg-white rounded-lg shadow-md p-3 sm:p-4">
                    <div className="mb-3 flex justify-between items-center">
                        <h2 className="text-lg font-semibold text-gray-800">Daily Transactions</h2>
                        <span className="text-xs text-gray-600 bg-gray-100 px-2 py-1 rounded-full">
                            {dailyTransactions.length} Days
                        </span>
                    </div>

                    {dailyTransactions.length === 0 ? (
                        <div className="text-center py-8 text-gray-500">
                            No transactions found
                        </div>
                    ) : (
                        <div className="space-y-3">
                            {dailyTransactions.map((transaction) => (
                                <MobileOrderCard
                                    key={transaction.date}
                                    transaction={transaction}
                                    isExpanded={expandedCard === transaction.date}
                                    onExpand={() => setExpandedCard(expandedCard === transaction.date ? null : transaction.date)}
                                />
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Agentanalysis;