import React, { useState, useEffect } from 'react';
import {
    MapPin,
    Search,
    ChevronDown,
    UserPlus,
    X,
    Phone,
    Mail,
    MapPinned
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
    _id?: string;
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
    order_deliveryspeed: string;
    order_flow: OrderFlow[];
    agent_id?: string;
    agent_name?: string;
    agent_phoneno?: string;
    orderid?: string;
    createdAt?: string;
    updatedAt?: string;
    __v?: number;
}

interface Agent {
    _id: string;
    name: string;
    email: string;
    phoneno: string;
    address: Address;
    walletbalance: number;
    isagent: boolean;
    isadmin: boolean;
    createdAt: string;
    updatedAt: string;
}

interface Column {
    header: string;
    key: string;
    render?: (row: Order) => React.ReactNode;
}

// Agent Assignment Modal
const AgentModal: React.FC<{
    isOpen: boolean;
    onClose: () => void;
    agents: Agent[];
    onAssign: (agentId: string) => void;
    orderInfo: Order | Order[] | null;
    isMultiple?: boolean;
}> = ({ isOpen, onClose, agents, onAssign, orderInfo, isMultiple = false }) => {
    if (!isOpen || !orderInfo) return null;

    const orders = Array.isArray(orderInfo) ? orderInfo : [orderInfo];
    const orderCount = orders.length;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-hidden shadow-2xl">
                {/* Modal Header */}
                <div className={`${GRADIENT_CLASS} px-6 py-4 flex justify-between items-center`}>
                    <div>
                        <h3 className="text-xl font-bold text-white">
                            Assign Agent to {isMultiple ? `${orderCount} Orders` : 'Order'}
                        </h3>
                        {!isMultiple && orders[0] && (
                            <p className="text-white/90 text-sm mt-1">
                                Order ID: {orders[0].orderid || orders[0]._id.substring(orders[0]._id.length - 8)}
                            </p>
                        )}
                        {isMultiple && (
                            <p className="text-white/90 text-sm mt-1">
                                {orderCount} orders selected for assignment
                            </p>
                        )}
                    </div>
                    <button
                        onClick={onClose}
                        className="text-white hover:bg-white/20 rounded-full p-2 transition-colors"
                    >
                        <X size={24} />
                    </button>
                </div>

                {/* Order Details */}
                {!isMultiple && orders[0] && (
                    <div className="px-6 py-4 bg-gray-50 border-b">
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                            <div>
                                <span className="text-gray-600">Customer:</span>
                                <p className="font-semibold text-gray-800">{orders[0].user_name || 'N/A'}</p>
                            </div>
                            <div>
                                <span className="text-gray-600">Location:</span>
                                <p className="font-semibold text-gray-800">{orders[0].user_address?.area || 'N/A'}</p>
                            </div>
                            <div>
                                <span className="text-gray-600">Slot:</span>
                                <p className="font-semibold text-gray-800">{orders[0].order_slot}</p>
                            </div>
                            <div>
                                <span className="text-gray-600">Amount:</span>
                                <p className="font-semibold text-green-600">₹{orders[0].order_totalamount}</p>
                            </div>
                        </div>
                    </div>
                )}

                {isMultiple && (
                    <div className="px-6 py-4 bg-gray-50 border-b">
                        <div className="text-sm text-gray-700">
                            <p className="font-semibold mb-2">Selected Orders:</p>
                            <div className="max-h-32 overflow-y-auto space-y-1">
                                {orders.map((order, idx) => (
                                    <div key={order._id} className="flex items-center gap-2">
                                        <span className="text-gray-600">{idx + 1}.</span>
                                        <span className="font-mono text-xs bg-white px-2 py-1 rounded">
                                            {order.orderid || order._id.substring(order._id.length - 8)}
                                        </span>
                                        <span className="text-gray-600">-</span>
                                        <span>{order.user_name || 'N/A'}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                )}

                {/* Agents List */}
                <div className="p-6 overflow-y-auto max-h-[calc(90vh-250px)]">
                    {agents.length === 0 ? (
                        <div className="text-center py-12 text-gray-500">
                            <UserPlus size={48} className="mx-auto mb-4 text-gray-400" />
                            <p>No agents available</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {agents.map((agent) => (
                                <div
                                    key={agent._id}
                                    className="border border-gray-200 rounded-lg p-4 hover:shadow-lg transition-shadow bg-white"
                                >
                                    <div className="flex items-start justify-between mb-3">
                                        <div className="flex items-center gap-3">
                                            <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-blue-700 rounded-full flex items-center justify-center text-white font-bold text-lg">
                                                {agent.name.charAt(0).toUpperCase()}
                                            </div>
                                            <div>
                                                <h4 className="font-semibold text-gray-800 text-lg">
                                                    {agent.name}
                                                </h4>
                                                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                                    Agent
                                                </span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="space-y-2 mb-4">
                                        <div className="flex items-center gap-2 text-sm text-gray-700">
                                            <Phone size={16} className="text-gray-400" />
                                            <span>{agent.phoneno}</span>
                                        </div>
                                        <div className="flex items-center gap-2 text-sm text-gray-700">
                                            <Mail size={16} className="text-gray-400" />
                                            <span className="truncate">{agent.email}</span>
                                        </div>
                                        <div className="flex items-start gap-2 text-sm text-gray-700">
                                            <MapPinned size={16} className="text-gray-400 mt-0.5 flex-shrink-0" />
                                            <span className="line-clamp-2">
                                                {agent.address.area}, {agent.address.city} - {agent.address.pincode}
                                            </span>
                                        </div>
                                    </div>

                                    <button
                                        onClick={() => onAssign(agent._id)}
                                        className={`w-full px-4 py-2 ${GRADIENT_CLASS} text-white rounded-lg font-medium hover:shadow-lg transition-all duration-200 transform hover:scale-105`}
                                    >
                                        Assign Agent
                                    </button>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

// Simple DataTable Component with horizontal scroll
const DataTable: React.FC<{ 
    data: Order[]; 
    columns: Column[];
    selectedRows: Set<string>;
    onRowSelect: (orderId: string) => void;
    onSelectAll: (selected: boolean) => void;
}> = ({ data, columns, selectedRows, onRowSelect, onSelectAll }) => {
    const allSelected = data.length > 0 && data.every(order => selectedRows.has(order._id));
    const someSelected = data.some(order => selectedRows.has(order._id)) && !allSelected;

    return (
        <div className="overflow-x-auto rounded-lg shadow-lg">
            <table className="min-w-full divide-y divide-gray-200 rounded-lg overflow-hidden">
                <thead className={`${GRADIENT_CLASS} text-white`}>
                    <tr>
                        <th className="px-6 py-5 text-left">
                            <input
                                type="checkbox"
                                checked={allSelected}
                                ref={input => {
                                    if (input) input.indeterminate = someSelected;
                                }}
                                onChange={(e) => onSelectAll(e.target.checked)}
                                className="w-4 h-4 rounded border-white/30 text-blue-600 focus:ring-2 focus:ring-white cursor-pointer"
                            />
                        </th>
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
                                colSpan={columns.length + 1}
                                className="px-6 py-8 text-center text-gray-500"
                            >
                                No orders found
                            </td>
                        </tr>
                    ) : (
                        data.map((row) => (
                            <tr key={row._id} className={`hover:bg-gray-50 ${selectedRows.has(row._id) ? 'bg-blue-50' : ''}`}>
                                <td className="px-6 py-4">
                                    <input
                                        type="checkbox"
                                        checked={selectedRows.has(row._id)}
                                        onChange={() => onRowSelect(row._id)}
                                        className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-2 focus:ring-blue-500 cursor-pointer"
                                    />
                                </td>
                                {columns.map((column) => {
                                    const value = row[column.key as keyof Order];

                                    return (
                                        <td
                                            key={column.key}
                                            className="px-6 py-4 whitespace-nowrap"
                                        >
                                            {column.render
                                                ? column.render(row)
                                                : typeof value === "string" ||
                                                    typeof value === "number" ||
                                                    typeof value === "boolean"
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

// Helper function to check if order is completed
const isOrderCompleted = (orderFlow: OrderFlow[]): boolean => {
    if (!orderFlow || orderFlow.length === 0) return false;
    
    // Check if all steps are completed
    return orderFlow.every(step => step.completed === true);
};

// Helper function to get current status
const getCurrentStatus = (orderFlow: OrderFlow[]): string => {
    if (!orderFlow || orderFlow.length === 0) return 'Unknown';
    const currentStep = orderFlow.find(step => !step.completed);
    return currentStep ? currentStep.step : 'Completed';
};

// Main Orders Page Component
const Adminassignoerder: React.FC = () => {
    const [location, setLocation] = useState<string>('All Locations');
    const [searchTerm, setSearchTerm] = useState<string>('');
    const [allOrders, setAllOrders] = useState<Order[]>([]);
    const [filteredOrders, setFilteredOrders] = useState<Order[]>([]);
    const [allAgents, setAllAgents] = useState<Agent[]>([]);
    const [modalOpen, setModalOpen] = useState<boolean>(false);
    const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
    const [selectedRows, setSelectedRows] = useState<Set<string>>(new Set());
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [showCompleted, setShowCompleted] = useState<boolean>(false); // New state for filter toggle

    // Fetch orders from API
    useEffect(() => {
        const getAllOrders = async () => {
            try {
                setIsLoading(true);
                const res = await fetch(`${API_URL}/admin/alltodayorders`, {
                    credentials: 'include'
                });
                const data = await res.json();

                if (data?.error) {
                    console.error(data?.error);
                    return;
                }

                // Filter out completed orders by default
                const incompleteOrders = (data?.data || []).filter((order: Order) => 
                    !isOrderCompleted(order.order_flow)
                );

                setAllOrders(data?.data || []);
                setFilteredOrders(incompleteOrders);
            } catch (err) {
                console.error('Error fetching orders:', err);
            } finally {
                setIsLoading(false);
            }
        };
        getAllOrders();
    }, []);

    // Fetch agents from API
    useEffect(() => {
        const getAllAgents = async () => {
            try {
                const res = await fetch(`${API_URL}/admin/allgents`, {
                    credentials: 'include'
                });
                const data = await res.json();

                if (data?.error) {
                    console.error(data?.error);
                    return;
                }

                setAllAgents(data?.data || []);
            } catch (err) {
                console.error('Error fetching agents:', err);
            }
        };
        getAllAgents();
    }, []);

    // Handle row selection
    const handleRowSelect = (orderId: string) => {
        setSelectedRows(prev => {
            const newSet = new Set(prev);
            if (newSet.has(orderId)) {
                newSet.delete(orderId);
            } else {
                newSet.add(orderId);
            }
            return newSet;
        });
    };

    // Handle select all
    const handleSelectAll = (selected: boolean) => {
        if (selected) {
            setSelectedRows(new Set(filteredOrders.map(order => order._id)));
        } else {
            setSelectedRows(new Set());
        }
    };

    // Assign agent to single order
    const assignAgentToOrder = async (agentId: string) => {
        if (!selectedOrder) return;

        try {
            const res = await fetch(`${API_URL}/admin/assignagentorders`, {
                credentials: 'include',
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    order_id: selectedOrder._id,
                    agent_id: agentId
                })
            });
            const data = await res.json();

            if (data?.error) {
                console.error(data?.error);
                return;
            }

            // Update the order in the local state
            const updatedOrders = allOrders.map(order => {
                if (order._id === selectedOrder._id) {
                    const assignedAgent = allAgents.find(a => a._id === agentId);
                    return {
                        ...order,
                        agent_id: agentId,
                        agent_name: assignedAgent?.name,
                        agent_phoneno: assignedAgent?.phoneno
                    };
                }
                return order;
            });

            setAllOrders(updatedOrders);
            setFilteredOrders(updatedOrders.filter(order => !isOrderCompleted(order.order_flow)));
            setModalOpen(false);
            setSelectedOrder(null);

            console.log('Agent assigned successfully');
        } catch (err) {
            console.error('Error assigning agent:', err);
        }
    };

    // Assign agent to multiple orders
    const assignAgentToMultipleOrders = async (agentId: string) => {
        if (selectedRows.size === 0) return;

        const selectedOrdersList = allOrders.filter(order => selectedRows.has(order._id));

        try {
            // Use Promise.all to assign agent to all selected orders
            const assignmentPromises = selectedOrdersList.map(order => 
                fetch(`${API_URL}/admin/assignagentorders`, {
                    credentials: 'include',
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        order_id: order._id,
                        agent_id: agentId
                    })
                }).then(res => res.json())
            );

            const results = await Promise.all(assignmentPromises);

            // Check if any errors occurred
            const hasErrors = results.some(data => data?.error);
            if (hasErrors) {
                console.error('Some assignments failed');
            }

            // Update the orders in the local state
            const assignedAgent = allAgents.find(a => a._id === agentId);
            const updatedOrders = allOrders.map(order => {
                if (selectedRows.has(order._id)) {
                    return {
                        ...order,
                        agent_id: agentId,
                        agent_name: assignedAgent?.name,
                        agent_phoneno: assignedAgent?.phoneno
                    };
                }
                return order;
            });

            setAllOrders(updatedOrders);
            setFilteredOrders(updatedOrders.filter(order => !isOrderCompleted(order.order_flow)));
            setModalOpen(false);
            setSelectedOrder(null);
            setSelectedRows(new Set());

            console.log('Agents assigned successfully to multiple orders');
        } catch (err) {
            console.error('Error assigning agents:', err);
        }
    };

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

    // Handle assign button click
    const handleAssignClick = (order: Order) => {
        setSelectedOrder(order);
        setModalOpen(true);
    };

    // Handle assign selected button click
    const handleAssignSelectedClick = () => {
        const selectedOrdersList = allOrders.filter(order => selectedRows.has(order._id));
        setSelectedOrder(null);
        setModalOpen(true);
    };

    // Dynamic column generation
    const generateColumns = (): Column[] => {
        const columns: Column[] = [
            {
                header: 'Order ID',
                key: '_id',
                render: (row: Order) => (
                    <span className="font-mono text-xs bg-gray-100 px-2 py-1 rounded whitespace-nowrap">
                        {row.orderid || row._id.substring(row._id.length - 8)}
                    </span>
                )
            },
            {
                header: 'Date & Time',
                key: 'order_date',
                render: (row: Order) => {
                    const date = new Date(row.order_date);
                    return (
                        <div className="space-y-1 min-w-[120px]">
                            <div className="font-medium text-sm">{date.toLocaleDateString()}</div>
                            <div className="text-xs text-gray-500">{date.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</div>
                        </div>
                    );
                }
            },
            {
                header: 'Customer',
                key: 'user_name',
                render: (row: Order) => (
                    <div className="space-y-1 min-w-[120px]">
                        <span className="font-medium text-gray-800 text-sm block">
                            {row.user_name || 'N/A'}
                        </span>
                        <span className="text-xs text-gray-600 block">
                            {row.user_phoneno || 'No number'}
                        </span>
                    </div>
                )
            },
         {
    header: 'Address',
    key: 'address',
    render: (row: Order) => (
        <div className="max-w-[180px] min-w-[150px]">
            <div className="flex items-start gap-2">
                <MapPin size={14} className="text-gray-400 mt-0.5 flex-shrink-0" />
                <div className="text-xs text-gray-700 min-w-0 flex-1">
                    <div className="break-words whitespace-normal overflow-visible leading-tight">
                        {row.user_address?.houseno}, {row.user_address?.streetname}
                    </div>
                    <div className="whitespace-normal overflow-visible leading-tight mt-0.5">
                        {row.user_address?.area}, {row.user_address?.city}
                    </div>
                    <div className="text-gray-500 mt-0.5">PIN: {row.user_address?.pincode}</div>
                </div>
            </div>
        </div>
    )
},
            {
                header: 'Slot',
                key: 'order_slot',
                render: (row: Order) => (
                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800 whitespace-nowrap">
                        {row.order_slot}
                    </span>
                )
            },
            {
                header: 'Delivery',
                key: 'order_deliveryspeed',
                render: (row: Order) => (
                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-bold text-blue-800 whitespace-nowrap">
                        {row.order_deliveryspeed}
                    </span>
                )
            },
            {
                header: 'Clothes',
                key: 'order_totalcloths',
                render: (row: Order) => (
                    <span className="font-semibold text-gray-800 text-sm whitespace-nowrap">{row.order_totalcloths} items</span>
                )
            },
            {
                header: 'Amount',
                key: 'order_totalamount',
                render: (row: Order) => (
                    <span className="font-bold text-green-600 text-sm whitespace-nowrap">₹{row.order_totalamount}</span>
                )
            },
            {
                header: 'Payment',
                key: 'order_paymenttype',
                render: (row: Order) => (
                    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${row.order_paymenttype === 'online payment'
                        ? 'bg-green-100 text-green-800'
                        : 'bg-yellow-100 text-yellow-800'
                        } whitespace-nowrap`}>
                        {row.order_paymenttype === 'online payment' ? '💳 Online' : '💵 COD'}
                    </span>
                )
            },
            {
                header: 'Agent',
                key: 'agent_name',
                render: (row: Order) => (
                    <div className="space-y-1 min-w-[120px]">
                        <div className="font-medium text-gray-800 text-sm">
                            {row.agent_name || 'Not Assigned'}
                        </div>
                        {row.agent_phoneno && (
                            <div className="text-xs text-gray-500">{row.agent_phoneno}</div>
                        )}
                    </div>
                )
            },
            {
                header: 'Status',
                key: 'status',
                render: (row: Order) => {
                    const status = getCurrentStatus(row.order_flow);
                    const isCompleted = isOrderCompleted(row.order_flow);
                    return (
                        <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${isCompleted
                            ? 'bg-green-100 text-green-800'
                            : 'bg-orange-100 text-orange-800'
                            } whitespace-nowrap`}>
                            {status}
                        </span>
                    );
                }
            },
            {
                header: 'Action',
                key: 'assign',
                render: (row: Order) => (
                    <button
                        onClick={() => handleAssignClick(row)}
                        className={`px-3 py-1.5 ${GRADIENT_CLASS} text-white rounded-lg text-sm font-medium hover:shadow-lg transition-all duration-200 transform hover:scale-105 flex items-center gap-1 whitespace-nowrap`}
                    >
                        <UserPlus size={14} />
                        {row.agent_name ? 'Reassign' : 'Assign'}
                    </button>
                )
            }
        ];

        return columns;
    };

    // Apply filters function
    const applyFilters = () => {
        let filtered: Order[] = [...allOrders];

        // Filter by completion status
        if (!showCompleted) {
            filtered = filtered.filter(order => !isOrderCompleted(order.order_flow));
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
                (order.orderid && order.orderid.toString().includes(searchLower)) ||
                (order.user_name && order.user_name.toLowerCase().includes(searchLower)) ||
                (order.user_phoneno && order.user_phoneno.includes(searchLower)) ||
                (order.agent_name && order.agent_name.toLowerCase().includes(searchLower)) ||
                (order.agent_phoneno && order.agent_phoneno.includes(searchLower)) ||
                (order.user_address?.area && order.user_address.area.toLowerCase().includes(searchLower)) ||
                getCurrentStatus(order.order_flow).toLowerCase().includes(searchLower)
            );
        }

        setFilteredOrders(filtered);
    };

    // Clear filters
    const clearFilters = () => {
        setLocation('All Locations');
        setSearchTerm('');
        setSelectedRows(new Set());
        
        // Reset to show only incomplete orders
        const incompleteOrders = allOrders.filter(order => !isOrderCompleted(order.order_flow));
        setFilteredOrders(incompleteOrders);
        setShowCompleted(false);
    };

    // Toggle completed orders visibility
    const toggleCompletedOrders = () => {
        const newShowCompleted = !showCompleted;
        setShowCompleted(newShowCompleted);
        
        if (newShowCompleted) {
            // Show all orders
            setFilteredOrders(allOrders);
        } else {
            // Show only incomplete orders
            const incompleteOrders = allOrders.filter(order => !isOrderCompleted(order.order_flow));
            setFilteredOrders(incompleteOrders);
        }
    };

    // Real-time search as user types
    useEffect(() => {
        if (searchTerm.trim() === '') {
            if (showCompleted) {
                setFilteredOrders(allOrders);
            } else {
                const incompleteOrders = allOrders.filter(order => !isOrderCompleted(order.order_flow));
                setFilteredOrders(incompleteOrders);
            }
        } else {
            const searchLower = searchTerm.toLowerCase().trim();
            let filtered = showCompleted ? [...allOrders] : allOrders.filter(order => !isOrderCompleted(order.order_flow));
            
            filtered = filtered.filter(order =>
                order._id.toLowerCase().includes(searchLower) ||
                order.order_totalamount.includes(searchLower) ||
                order.order_totalcloths.includes(searchLower) ||
                order.order_paymenttype.toLowerCase().includes(searchLower) ||
                order.order_slot.toLowerCase().includes(searchLower) ||
                (order.orderid && order.orderid.toString().includes(searchLower)) ||
                (order.user_name && order.user_name.toLowerCase().includes(searchLower)) ||
                (order.user_phoneno && order.user_phoneno.includes(searchLower)) ||
                (order.agent_name && order.agent_name.toLowerCase().includes(searchLower)) ||
                (order.agent_phoneno && order.agent_phoneno.includes(searchLower)) ||
                (order.user_address?.area && order.user_address.area.toLowerCase().includes(searchLower)) ||
                getCurrentStatus(order.order_flow).toLowerCase().includes(searchLower)
            );
            
            setFilteredOrders(filtered);
        }
    }, [searchTerm, allOrders, showCompleted]);

    return (
        <div className="min-h-screen bg-gray-50 p-4 md:p-6">
            <div className="max-w-full mx-auto space-y-6">
                {/* Header */}
                <div className="rounded-lg p-6">
                    <h1 className={`text-2xl md:text-3xl font-bold ${GRADIENT_CLASS} bg-clip-text text-transparent mb-2`}>
                        Assign Orders
                    </h1>
                    <p className="text-gray-600">Select the agent to assign orders</p>
                </div>

                {/* Filters */}
                <div className="p-4 md:p-6 pt-0 max-w-screen-lg">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
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
                                    className="w-full pl-10 pr-10 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none bg-white text-sm"
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
                                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                                />
                            </div>
                        </div>

                        {/* Show Completed Toggle */}
                        <div className="space-y-2">
                            <label className="block text-sm font-medium text-gray-700">
                                Show Completed Orders
                            </label>
                            <div className="flex items-center">
                                <button
                                    onClick={toggleCompletedOrders}
                                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${showCompleted ? 'bg-green-500' : 'bg-gray-300'}`}
                                >
                                    <span
                                        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${showCompleted ? 'translate-x-6' : 'translate-x-1'}`}
                                    />
                                </button>
                                <span className="ml-3 text-sm text-gray-700">
                                    {showCompleted ? 'Showing All' : 'Showing Incomplete Only'}
                                </span>
                            </div>
                        </div>
                    </div>

                    <div className="mt-4 flex gap-3 flex-wrap">
                        <button
                            onClick={applyFilters}
                            className={`px-4 py-2 ${GRADIENT_CLASS} text-white rounded-lg font-medium hover:shadow-lg transition-all duration-200 transform hover:scale-105 text-sm`}
                        >
                            Apply Filters
                        </button>
                        <button
                            onClick={clearFilters}
                            className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg font-medium hover:bg-gray-300 transition-all duration-200 text-sm"
                        >
                            Clear Filters
                        </button>
                    </div>
                </div>

                {/* Assign Selected Button - Shows when rows are selected */}
                {selectedRows.size > 0 && (
                    <div className="bg-white rounded-lg shadow-md p-4 max-w-screen-lg">
                        <div className="flex items-center justify-between flex-wrap gap-3">
                            <div className="flex items-center gap-3">
                                <span className="text-gray-700 font-medium text-sm">
                                    {selectedRows.size} order{selectedRows.size > 1 ? 's' : ''} selected
                                </span>
                            </div>
                            <button
                                onClick={handleAssignSelectedClick}
                                className={`px-4 py-2 ${GRADIENT_CLASS} text-white rounded-lg font-medium hover:shadow-lg transition-all duration-200 transform hover:scale-105 flex items-center gap-2 text-sm`}
                            >
                                <UserPlus size={16} />
                                Assign Agent to Selected
                            </button>
                        </div>
                    </div>
                )}

                {/* Orders Table */}
                <div className="bg-white min-w-full max-w-screen-lg rounded-lg shadow-md p-4 md:p-6">
                    <div className="mb-4 flex justify-between items-center flex-wrap gap-3">
                        <h2 className="text-lg md:text-xl font-semibold text-gray-800">
                            Today Orders
                        </h2>
                        <div className="flex items-center gap-3">
                            <span className="text-sm text-gray-600 bg-gray-100 px-3 py-1 rounded-full">
                                Total: <span className="font-bold text-blue-600">{filteredOrders.length}</span> orders
                            </span>
                            {isLoading && (
                                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-600"></div>
                            )}
                        </div>
                    </div>

                    {isLoading ? (
                        <div className="text-center py-12">
                            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                            <p className="text-gray-600">Loading orders...</p>
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <DataTable 
                                data={filteredOrders} 
                                columns={generateColumns()} 
                                selectedRows={selectedRows}
                                onRowSelect={handleRowSelect}
                                onSelectAll={handleSelectAll}
                            />
                        </div>
                    )}
                </div>
            </div>

            {/* Agent Assignment Modal */}
            <AgentModal
                isOpen={modalOpen}
                onClose={() => {
                    setModalOpen(false);
                    setSelectedOrder(null);
                }}
                agents={allAgents}
                onAssign={selectedOrder ? assignAgentToOrder : assignAgentToMultipleOrders}
                orderInfo={selectedOrder || allOrders.filter(order => selectedRows.has(order._id))}
                isMultiple={!selectedOrder && selectedRows.size > 0}
            />
        </div>
    );
};

export default Adminassignoerder;