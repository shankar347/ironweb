import React, { useState, useEffect } from 'react';
import {
    Calendar,
    MapPin,
    Search,
    ChevronDown,
    Eye,
    MoreVertical,
    Download
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

interface Column {
    header: string;
    key: string;
    render?: (row: Order) => React.ReactNode;
}

interface Tab {
    id: string;
    label: string;
    count: number;
}

// Simple DataTable Component with horizontal scroll
// DataTable component
const DataTable: React.FC<{ data: Order[]; columns: Column[] }> = ({ data, columns }) => {
    return (
        // Outer wrapper handles horizontal scroll
        <div className="overflow-x-auto w-full max-w-full rounded-lg shadow-lg">
            <table className="min-w-full table-fixed divide-y divide-gray-200">
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
                            <td colSpan={columns.length} className="px-6 py-8 text-center text-gray-500">
                                No orders found
                            </td>
                        </tr>
                    ) : (
                        data.map((row) => (
                            <tr key={row._id} className="hover:bg-gray-50">
                                {columns.map((column) => {
                                    const value = row[column.key as keyof Order];
                                    return (
                                        <td key={column.key} className="px-6 py-4 whitespace-nowrap">
                                            {column.render
                                                ? column.render(row)
                                                : typeof value === "string" || typeof value === "number" || typeof value === "boolean"
                                                    ? value.toString()
                                                    : null}
                                        </td>
                                    );
                                })}
                            </tr>
                        ))
                    )}
                </tbody>
            </table>
        </div>
    );
};



// Main Orders Page Component
const OrdersPage: React.FC = () => {
    const [activeTab, setActiveTab] = useState<string>('all');
    const [startDate, setStartDate] = useState<string>('');
    const [endDate, setEndDate] = useState<string>('');
    const [location, setLocation] = useState<string>('All Locations');
    const [searchTerm, setSearchTerm] = useState<string>('');
    const [allOrders, setallOrders] = useState<Order[]>([]);
    const [filteredOrders, setFilteredOrders] = useState<Order[]>([]);

    // Fetch orders from API
    useEffect(() => {
        const getallorders = async () => {
            try {
                const res = await fetch(`${API_URL}/admin/allorders`, {
                    credentials: 'include'
                });
                const data = await res.json();

                if (data?.error) {
                    console.error(data?.error);
                    return;
                }

                setallOrders(data?.data || []);
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
        { id: 'all', label: 'All Orders', count: filteredOrders.length },
        { id: 'today', label: 'Today Orders', count: getTodayOrders().length },
        { id: 'processing', label: 'Processing', count: getProcessingOrders().length },
        { id: 'failed', label: 'Failed Orders', count: getFailedOrders().length }
    ];

    // Dynamic column generation
    const generateColumns = (): Column[] => {
        const columns: Column[] = [
            {
                header: 'Order ID',
                key: '_id',
                render: (row: Order) => (
                    <span className="font-mono text-xs bg-gray-100 px-2 py-1 rounded">
                        {row._id.substring(row._id.length - 8)}
                    </span>
                )
            },
            {
                header: 'Date & Time',
                key: 'order_date',
                render: (row: Order) => {
                    const date = new Date(row.order_date);
                    return (
                        <div className="space-y-1">
                            <div className="font-medium">{date.toLocaleDateString()}</div>
                            <div className="text-xs text-gray-500">{date.toLocaleTimeString()}</div>
                        </div>
                    );
                }
            },
            {
                header: 'Customer Name',
                key: 'user_name',
                render: (row: Order) => (
                    <span className="font-medium text-gray-800">
                        {row.user_name || 'N/A'}
                    </span>
                )
            },
            {
                header: 'Customer Phone',
                key: 'user_phoneno',
                render: (row: Order) => (
                    <span className="text-gray-700">
                        {row.user_phoneno || 'No number'}
                    </span>
                )
            },
            {
                header: 'Location',
                key: 'location',
                render: (row: Order) => (
                    <div className="space-y-1">
                        <div className="font-medium text-gray-800">
                            {row.user_address?.area || 'N/A'}
                        </div>
                        {row.user_address?.city && (
                            <div className="text-xs text-gray-500">{row.user_address.city}</div>
                        )}
                    </div>
                )
            },
            {
                header: 'Slot',
                key: 'order_slot',
                render: (row: Order) => (
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                        {row.order_slot}
                    </span>
                )
            },
            {
                header: 'Total Clothes',
                key: 'order_totalcloths',
                render: (row: Order) => (
                    <span className="font-semibold text-gray-800">{row.order_totalcloths} items</span>
                )
            },
            {
                header: 'Total Amount',
                key: 'order_totalamount',
                render: (row: Order) => (
                    <span className="font-bold text-green-600 text-base">₹{row.order_totalamount}</span>
                )
            },
            {
                header: 'Payment Type',
                key: 'order_paymenttype',
                render: (row: Order) => (
                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${row.order_paymenttype === 'online payment'
                        ? 'bg-green-100 text-green-800'
                        : 'bg-yellow-100 text-yellow-800'
                        }`}>
                        {row.order_paymenttype === 'online payment' ? '💳 Online' : '💵 COD'}
                    </span>
                )
            },
            {
                header: 'Agent Name',
                key: 'agent_name',
                render: (row: Order) => (
                    <span className="text-gray-700">
                        {row.agent_name || 'No driver'}
                    </span>
                )
            },
            {
                header: 'Agent Phone',
                key: 'agent_phoneno',
                render: (row: Order) => (
                    <span className="text-gray-700">
                        {row.agent_phoneno || 'No number'}
                    </span>
                )
            },
            {
                header: 'Status',
                key: 'status',
                render: (row: Order) => {
                    const status = getCurrentStatus(row.order_flow);
                    const isCompleted = status === 'Completed' || status === 'Clothes delivered';
                    return (
                        <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${isCompleted
                            ? 'bg-green-100 text-green-800'
                            : 'bg-orange-100 text-orange-800'
                            }`}>
                            {status}
                        </span>
                    );
                }
            },
            {
                header: 'Created At',
                key: 'createdAt',
                render: (row: Order) => {
                    if (!row.createdAt) return '-';
                    const date = new Date(row.createdAt);
                    return (
                        <div className="text-xs text-gray-600">
                            {date.toLocaleDateString()}
                        </div>
                    );
                }
            },
        ];

        return columns;
    };

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
    };

    // Clear filters
    const clearFilters = () => {
        setStartDate('');
        setEndDate('');
        setLocation('All Locations');
        setSearchTerm('');
        setFilteredOrders(allOrders);
        setActiveTab('all');
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
        <div className="min-h-screen bg-gray-50 p-6">
            <div className="max-w-full mx-auto space-y-6">
                {/* Header */}
                <div className="rounded-lg p-6">
                    <h1 className={`text-3xl font-bold ${GRADIENT_CLASS} bg-clip-text text-transparent mb-2`}>
                        Orders Management
                    </h1>
                    <p className="text-gray-600">Manage and track all your orders</p>
                </div>

                {/* Tabs */}
                <div className="p-4">
                    <div className="flex flex-wrap gap-3">
                        {tabs.map((tab) => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={`px-6 py-3 rounded-lg font-semibold transition-all duration-200 ${activeTab === tab.id
                                    ? `${GRADIENT_CLASS} text-white shadow-lg transform scale-105`
                                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                                    }`}
                            >
                                {tab.label}
                                <span className={`ml-2 px-2 py-1 rounded-full text-xs ${activeTab === tab.id ? 'bg-white/20' : 'bg-gray-300'
                                    }`}>
                                    {tab.count}
                                </span>
                            </button>
                        ))}
                    </div>
                </div>

                {/* Filters */}
                <div className="p-6 pt-0  max-w-screen-lg">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                        {/* Start Date */}
                        <div className="space-y-2">
                            <label className="block 
                            text-sm font-medium
                            text-gray-700">
                                Start Date
                            </label>
                            <div className="relative">
                                <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                                <input
                                    type="date"
                                    value={startDate}
                                    onChange={(e) => setStartDate(e.target.value)}
                                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                />
                            </div>
                        </div>

                        {/* End Date */}
                        <div className="space-y-2">
                            <label className="block text-sm font-medium text-gray-700">
                                End Date
                            </label>
                            <div className="relative">
                                <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                                <input
                                    type="date"
                                    value={endDate}
                                    onChange={(e) => setEndDate(e.target.value)}
                                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                />
                            </div>
                        </div>

                        {/* Location Filter */}
                        <div className="space-y-2">
                            <label className="block text-sm font-medium text-gray-700">
                                Location
                            </label>
                            <div className="relative">
                                <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                                <select
                                    value={location}
                                    onChange={(e) => setLocation(e.target.value)}
                                    className="w-full pl-10 pr-10 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none bg-white"
                                >
                                    {locations.map((loc) => (
                                        <option key={loc} value={loc}>
                                            {loc}
                                        </option>
                                    ))}
                                </select>
                                <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                            </div>
                        </div>

                        {/* Search */}
                        <div className="space-y-2">
                            <label className="block text-sm font-medium text-gray-700">
                                Search
                            </label>
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                                <input
                                    type="text"
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    placeholder="Search orders..."
                                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                />
                            </div>
                        </div>
                    </div>

                    <div className="mt-4 flex gap-3">
                        <button
                            onClick={applyFilters}
                            className={`px-6 py-2 ${GRADIENT_CLASS} text-white rounded-lg font-medium hover:shadow-lg transition-all duration-200 transform hover:scale-105`}
                        >
                            Apply Filters
                        </button>
                        <button
                            onClick={clearFilters}
                            className="px-6 py-2 bg-gray-200 text-gray-700 rounded-lg font-medium hover:bg-gray-300 transition-all duration-200"
                        >
                            Clear Filters
                        </button>
                    </div>
                </div>

                {/* Orders Table */}
                <div className="bg-white 
                min-w-full max-w-screen-lg rounded-lg shadow-md p-6">
                    {/* Header */}
                    <div className="mb-4 flex justify-between items-center">
                        <h2 className="text-xl font-semibold text-gray-800">
                            {tabs.find(t => t.id === activeTab)?.label}
                        </h2>
                        <span className="text-sm text-gray-600 bg-gray-100 px-3 py-1 rounded-full">
                            Total:{" "}
                            <span className="font-bold text-blue-600">{getDisplayedOrders().length}</span> orders
                        </span>
                    </div>

                    {/* Table Container — only horizontal scroll */}
                    <div className="overflow-x-auto w-full">
                        <DataTable data={getDisplayedOrders()} columns={generateColumns()} />
                    </div>
                </div>

            </div>
        </div>
    );
};

export default OrdersPage;




