import React, { useState, useEffect } from 'react';
import {
    Calendar,
    Search,
    ChevronDown,
    ChevronRight,
    ChevronUp,
    CreditCard,
    Award,
    Gift,
    DollarSign,
    Clock,
    CheckCircle,
    XCircle,
    AlertCircle,
    RefreshCw,
    Filter,
    Download,
    Eye,
    User,
    Phone,
    Mail,
    MapPin
} from 'lucide-react';
import { API_URL } from '../../hooks/tools';

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

interface UserDetails {
    _id: string;
    name: string;
    email: string;
    phoneno: string;
    address?: Address;
}

interface PaymentDetails {
    razorpay_payment_id?: string;
    razorpay_order_id?: string;
    razorpay_signature?: string;
    paidAt?: string;
}

interface Cloth {
    name: string;
    count: number;
    _id?: string;
}

interface Subscription {
    _id: string;
    userid: string;
    userDetails?: UserDetails;
    plan: string;
    totalcredits: number;
    credits: number;
    totalamount: number;
    cloths: Cloth[];
    startdate: string;
    enddate: string;
    status: 'active' | 'expired' | 'cancelled' | 'pending';
    paymentStatus: 'paid' | 'pending' | 'failed';
    paymentId?: string;
    orderId?: string;
    paymentMethod?: string;
    paymentDetails?: PaymentDetails;
    invoiceNumber?: string;
    createdAt: string;
    updatedAt: string;
    __v?: number;
}

interface Column {
    header: string;
    key: string;
    render?: (row: Subscription, expandedRows?: Set<string>, toggleRow?: (id: string) => void) => React.ReactNode;
}

interface Tab {
    id: string;
    label: string;
    count: number;
    icon?: React.ReactNode;
}

// DataTable component with expandable rows
const DataTable: React.FC<{
    data: Subscription[];
    columns: Column[];
    expandedRows: Set<string>;
    toggleRow: (id: string) => void;
}> = ({ data, columns, expandedRows, toggleRow }) => {
    return (
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
                                <div className="flex flex-col items-center justify-center">
                                    <Award className="w-12 h-12 text-gray-300 mb-3" />
                                    <p className="text-lg font-medium">No subscriptions found</p>
                                    <p className="text-sm text-gray-400">Try adjusting your filters or search criteria</p>
                                </div>
                            </td>
                        </tr>
                    ) : (
                        data.map((row) => {
                            const isExpired = new Date(row.enddate) < new Date();
                            const daysLeft = Math.ceil((new Date(row.enddate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));
                            
                            return (
                                <React.Fragment key={row._id}>
                                    <tr className="hover:bg-gray-50 transition-colors duration-200">
                                        {columns.map((column) => {
                                            const value = row[column.key as keyof Subscription];
                                            return (
                                                <td key={column.key} className="px-6 py-4 whitespace-nowrap">
                                                    {column.render
                                                        ? column.render(row, expandedRows, toggleRow)
                                                        : typeof value === "string" || typeof value === "number" || typeof value === "boolean"
                                                            ? value.toString()
                                                            : null}
                                                </td>
                                            );
                                        })}
                                    </tr>
                                    {expandedRows.has(row._id) && (
                                        <tr className="bg-blue-50">
                                            <td colSpan={columns.length} className="px-6 py-4">
                                                <div className="space-y-4">
                                                    {/* User Details Section */}
                                                    {row.userDetails && (
                                                        <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg border border-purple-200 p-4">
                                                            <h4 className="font-semibold text-purple-800 mb-3 flex items-center">
                                                                <User className="w-4 h-4 mr-2" />
                                                                User Information
                                                            </h4>
                                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                                <div className="bg-white rounded-lg p-3 shadow-sm">
                                                                    <p className="text-xs text-gray-500 mb-1 flex items-center">
                                                                        <User className="w-3 h-3 mr-1" /> Name
                                                                    </p>
                                                                    <p className="text-sm font-medium text-gray-800">{row.userDetails.name}</p>
                                                                </div>
                                                                <div className="bg-white rounded-lg p-3 shadow-sm">
                                                                    <p className="text-xs text-gray-500 mb-1 flex items-center">
                                                                        <Mail className="w-3 h-3 mr-1" /> Email
                                                                    </p>
                                                                    <p className="text-sm font-medium text-gray-800">{row.userDetails.email}</p>
                                                                </div>
                                                                <div className="bg-white rounded-lg p-3 shadow-sm">
                                                                    <p className="text-xs text-gray-500 mb-1 flex items-center">
                                                                        <Phone className="w-3 h-3 mr-1" /> Phone
                                                                    </p>
                                                                    <p className="text-sm font-medium text-gray-800">{row.userDetails.phoneno}</p>
                                                                </div>
                                                                {row.userDetails.address && (
                                                                    <div className="bg-white rounded-lg p-3 shadow-sm md:col-span-2">
                                                                        <p className="text-xs text-gray-500 mb-1 flex items-center">
                                                                            <MapPin className="w-3 h-3 mr-1" /> Address
                                                                        </p>
                                                                        <p className="text-sm text-gray-800">
                                                                            {[
                                                                                row.userDetails.address.houseno,
                                                                                row.userDetails.address.streetname,
                                                                                row.userDetails.address.area,
                                                                                row.userDetails.address.city,
                                                                                row.userDetails.address.pincode
                                                                            ].filter(Boolean).join(', ')}
                                                                        </p>
                                                                    </div>
                                                                )}
                                                            </div>
                                                        </div>
                                                    )}

                                                    {/* Subscription Details Grid */}
                                                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                                                        <div className="bg-white rounded-lg p-4 shadow-sm border-l-4 border-blue-500">
                                                            <p className="text-xs text-gray-500 mb-1">Plan</p>
                                                            <p className="text-lg font-bold text-gray-800">{row.plan}</p>
                                                        </div>
                                                        <div className="bg-white rounded-lg p-4 shadow-sm border-l-4 border-green-500">
                                                            <p className="text-xs text-gray-500 mb-1">Credits</p>
                                                            <p className="text-lg font-bold text-gray-800">
                                                                {row.credits} / {row.totalcredits}
                                                                <span className="text-sm text-gray-500 ml-2">remaining</span>
                                                            </p>
                                                        </div>
                                                        <div className="bg-white rounded-lg p-4 shadow-sm border-l-4 border-purple-500">
                                                            <p className="text-xs text-gray-500 mb-1">Period</p>
                                                            <p className="text-sm font-medium text-gray-800">
                                                                {new Date(row.startdate).toLocaleDateString()} - {new Date(row.enddate).toLocaleDateString()}
                                                            </p>
                                                            {daysLeft > 0 ? (
                                                                <p className="text-xs text-green-600 mt-1">{daysLeft} days left</p>
                                                            ) : (
                                                                <p className="text-xs text-red-600 mt-1">Expired</p>
                                                            )}
                                                        </div>
                                                        <div className="bg-white rounded-lg p-4 shadow-sm border-l-4 border-amber-500">
                                                            <p className="text-xs text-gray-500 mb-1">Amount</p>
                                                            <p className="text-lg font-bold text-gray-800">₹{row.totalamount}</p>
                                                            <p className="text-xs text-gray-500 mt-1">Invoice: {row.invoiceNumber || 'N/A'}</p>
                                                        </div>
                                                    </div>

                                                    {/* Garments Section */}
                                                    {row.cloths && row.cloths.length > 0 && (
                                                        <div className="bg-white rounded-lg border border-gray-200 p-4">
                                                            <h4 className="font-semibold text-gray-800 mb-3 flex items-center">
                                                                <span className="w-3 h-3 bg-blue-500 rounded-full mr-2"></span>
                                                                Subscribed Garments ({row.cloths.length} items)
                                                            </h4>
                                                            <div className="overflow-x-auto">
                                                                <table className="min-w-full divide-y divide-gray-200">
                                                                    <thead className="bg-gray-100">
                                                                        <tr>
                                                                            <th className="px-4 py-2 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">Item</th>
                                                                            <th className="px-4 py-2 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">Quantity</th>
                                                                            <th className="px-4 py-2 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">Credits Used</th>
                                                                        </tr>
                                                                    </thead>
                                                                    <tbody className="divide-y divide-gray-200">
                                                                        {row.cloths.map((cloth, index) => (
                                                                            <tr key={cloth._id || index} className="hover:bg-gray-50">
                                                                                <td className="px-4 py-3 text-sm font-medium text-gray-800 capitalize">
                                                                                    {cloth.name}
                                                                                </td>
                                                                                <td className="px-4 py-3 text-sm text-gray-700">
                                                                                    {cloth.count}
                                                                                </td>
                                                                                <td className="px-4 py-3 text-sm font-semibold text-blue-600">
                                                                                    {cloth.count} credits
                                                                                </td>
                                                                            </tr>
                                                                        ))}
                                                                    </tbody>
                                                                </table>
                                                            </div>
                                                        </div>
                                                    )}

                                                    {/* Payment Details Section */}
                                                    {row.paymentStatus === 'paid' && (
                                                        <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg border border-green-200 p-4">
                                                            <h4 className="font-semibold text-green-800 mb-3 flex items-center">
                                                                <CreditCard className="w-4 h-4 mr-2" />
                                                                Payment Details
                                                            </h4>
                                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                                <div className="bg-white rounded-lg p-3 shadow-sm">
                                                                    <p className="text-xs text-gray-500 mb-1">Payment ID</p>
                                                                    <p className="text-sm font-mono font-medium text-gray-800">{row.paymentId || row.paymentDetails?.razorpay_payment_id || 'N/A'}</p>
                                                                </div>
                                                                <div className="bg-white rounded-lg p-3 shadow-sm">
                                                                    <p className="text-xs text-gray-500 mb-1">Order ID</p>
                                                                    <p className="text-sm font-mono font-medium text-gray-800">{row.orderId || row.paymentDetails?.razorpay_order_id || 'N/A'}</p>
                                                                </div>
                                                                {row.paymentDetails?.razorpay_signature && (
                                                                    <div className="bg-white rounded-lg p-3 shadow-sm md:col-span-2">
                                                                        <p className="text-xs text-gray-500 mb-1">Signature</p>
                                                                        <p className="text-xs font-mono text-gray-600 break-all">{row.paymentDetails.razorpay_signature}</p>
                                                                    </div>
                                                                )}
                                                                {row.paymentDetails?.paidAt && (
                                                                    <div className="bg-white rounded-lg p-3 shadow-sm">
                                                                        <p className="text-xs text-gray-500 mb-1">Paid At</p>
                                                                        <p className="text-sm font-medium text-gray-800">
                                                                            {new Date(row.paymentDetails.paidAt).toLocaleString()}
                                                                        </p>
                                                                    </div>
                                                                )}
                                                            </div>
                                                        </div>
                                                    )}

                                                    {/* Timeline */}
                                                    <div className="bg-white rounded-lg border border-gray-200 p-4">
                                                        <h4 className="font-semibold text-gray-800 mb-3 flex items-center">
                                                            <Clock className="w-4 h-4 mr-2" />
                                                            Subscription Timeline
                                                        </h4>
                                                        <div className="space-y-3">
                                                            <div className="flex items-start">
                                                                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-green-100 flex items-center justify-center">
                                                                    <CheckCircle className="w-4 h-4 text-green-600" />
                                                                </div>
                                                                <div className="ml-3">
                                                                    <p className="text-sm font-medium text-gray-800">Created</p>
                                                                    <p className="text-xs text-gray-500">{new Date(row.createdAt).toLocaleString()}</p>
                                                                </div>
                                                            </div>
                                                            <div className="flex items-start">
                                                                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
                                                                    <Award className="w-4 h-4 text-blue-600" />
                                                                </div>
                                                                <div className="ml-3">
                                                                    <p className="text-sm font-medium text-gray-800">Started</p>
                                                                    <p className="text-xs text-gray-500">{new Date(row.startdate).toLocaleString()}</p>
                                                                </div>
                                                            </div>
                                                            <div className="flex items-start">
                                                                <div className={`flex-shrink-0 w-8 h-8 rounded-full ${isExpired ? 'bg-red-100' : 'bg-amber-100'} flex items-center justify-center`}>
                                                                    {isExpired ? (
                                                                        <XCircle className="w-4 h-4 text-red-600" />
                                                                    ) : (
                                                                        <Clock className="w-4 h-4 text-amber-600" />
                                                                    )}
                                                                </div>
                                                                <div className="ml-3">
                                                                    <p className="text-sm font-medium text-gray-800">Ends</p>
                                                                    <p className="text-xs text-gray-500">{new Date(row.enddate).toLocaleString()}</p>
                                                                    {!isExpired && daysLeft > 0 && (
                                                                        <p className="text-xs text-green-600 mt-1">{daysLeft} days remaining</p>
                                                                    )}
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </td>
                                        </tr>
                                    )}
                                </React.Fragment>
                            );
                        })
                    )}
                </tbody>
            </table>
        </div>
    );
};

// Main Subscription Page Component
const SubscriptionPage: React.FC = () => {
    const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
    const [filteredSubscriptions, setFilteredSubscriptions] = useState<Subscription[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [activeTab, setActiveTab] = useState<string>('all');
    const [startDate, setStartDate] = useState<string>('');
    const [endDate, setEndDate] = useState<string>('');
    const [searchTerm, setSearchTerm] = useState<string>('');
    const [statusFilter, setStatusFilter] = useState<string>('all');
    const [planFilter, setPlanFilter] = useState<string>('all');
    const [expandedRows, setExpandedRows] = useState<Set<string>>(new Set());
    const [showFilters, setShowFilters] = useState<boolean>(false);

    const toggleRow = (id: string) => {
        const newExpandedRows = new Set(expandedRows);
        if (newExpandedRows.has(id)) {
            newExpandedRows.delete(id);
        } else {
            newExpandedRows.add(id);
        }
        setExpandedRows(newExpandedRows);
    };

    useEffect(() => {
        const getSubscriptions = async () => {
            setLoading(true);
            try {
                const res = await fetch(`${API_URL}/admin/allsubscriptions`, {
                    credentials: 'include'
                });
                const data = await res.json();

                if (data?.error) {
                    console.error(data?.error);
                    return;
                }

                setSubscriptions(data?.subscriptions || []);
                setFilteredSubscriptions(data?.subscriptions || []);
            } catch (err) {
                console.error('Error fetching subscriptions:', err);
            } finally {
                setLoading(false);
            }
        };

        getSubscriptions();
    }, []);

    // Get unique plans for filter
    const getUniquePlans = (): string[] => {
        const plans = new Set<string>();
        plans.add('all');
        subscriptions.forEach(sub => {
            plans.add(sub.plan);
        });
        return Array.from(plans);
    };

    // Tab definitions
    const tabs: Tab[] = [
        { 
            id: 'all', 
            label: 'All Subscriptions', 
            count: filteredSubscriptions.length,
            icon: <Award className="w-4 h-4" />
        },
        { 
            id: 'active', 
            label: 'Active', 
            count: filteredSubscriptions.filter(s => s.status === 'active').length,
            icon: <CheckCircle className="w-4 h-4" />
        },
        { 
            id: 'expired', 
            label: 'Expired', 
            count: filteredSubscriptions.filter(s => s.status === 'expired' || new Date(s.enddate) < new Date()).length,
            icon: <XCircle className="w-4 h-4" />
        },
        { 
            id: 'pending', 
            label: 'Pending', 
            count: filteredSubscriptions.filter(s => s.paymentStatus === 'pending' || s.status === 'pending').length,
            icon: <AlertCircle className="w-4 h-4" />
        }
    ];

    // Apply filters
    const applyFilters = () => {
        let filtered = [...subscriptions];

        // Date range filter
        if (startDate && endDate) {
            const start = new Date(startDate);
            start.setHours(0, 0, 0, 0);
            const end = new Date(endDate);
            end.setHours(23, 59, 59, 999);

            filtered = filtered.filter(sub => {
                const subDate = new Date(sub.createdAt);
                return subDate >= start && subDate <= end;
            });
        }

        // Status filter
        if (statusFilter !== 'all') {
            if (statusFilter === 'expired') {
                filtered = filtered.filter(sub => sub.status === 'expired' || new Date(sub.enddate) < new Date());
            } else {
                filtered = filtered.filter(sub => sub.status === statusFilter);
            }
        }

        // Plan filter
        if (planFilter !== 'all') {
            filtered = filtered.filter(sub => sub.plan === planFilter);
        }

        // Search filter
        if (searchTerm.trim() !== '') {
            const searchLower = searchTerm.toLowerCase().trim();
            filtered = filtered.filter(sub =>
                sub._id.toLowerCase().includes(searchLower) ||
                sub.plan.toLowerCase().includes(searchLower) ||
                sub.userid.toLowerCase().includes(searchLower) ||
                sub.userDetails?.name?.toLowerCase().includes(searchLower) ||
                sub.userDetails?.email?.toLowerCase().includes(searchLower) ||
                sub.userDetails?.phoneno?.includes(searchLower) ||
                sub.invoiceNumber?.toLowerCase().includes(searchLower) ||
                sub.paymentId?.toLowerCase().includes(searchLower) ||
                sub.orderId?.toLowerCase().includes(searchLower)
            );
        }

        setFilteredSubscriptions(filtered);
        setActiveTab('all');
    };

    // Clear filters
    const clearFilters = () => {
        setStartDate('');
        setEndDate('');
        setSearchTerm('');
        setStatusFilter('all');
        setPlanFilter('all');
        setFilteredSubscriptions(subscriptions);
        setActiveTab('all');
    };

    // Get active tab data
    const getDisplayedSubscriptions = (): Subscription[] => {
        let displayed = [...filteredSubscriptions];

        switch (activeTab) {
            case 'active':
                displayed = displayed.filter(s => s.status === 'active');
                break;
            case 'expired':
                displayed = displayed.filter(s => s.status === 'expired' || new Date(s.enddate) < new Date());
                break;
            case 'pending':
                displayed = displayed.filter(s => s.paymentStatus === 'pending' || s.status === 'pending');
                break;
            default:
                // all - no filter
                break;
        }

        return displayed;
    };

    // Calculate summary stats
    const totalCredits = filteredSubscriptions.reduce((sum, sub) => sum + sub.totalcredits, 0);
    const remainingCredits = filteredSubscriptions.reduce((sum, sub) => sum + sub.credits, 0);
    const totalRevenue = filteredSubscriptions.reduce((sum, sub) => sum + sub.totalamount, 0);

    // Generate columns
    const columns: Column[] = [
        {
            header: 'Details',
            key: 'expand',
            render: (row: Subscription, expandedRows?: Set<string>, toggleRow?: (id: string) => void) => (
                <button
                    onClick={() => toggleRow && toggleRow(row._id)}
                    className="flex items-center space-x-2 px-3 py-1.5 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors duration-200"
                    title={expandedRows?.has(row._id) ? "Hide details" : "Show details"}
                >
                    {expandedRows?.has(row._id) ? (
                        <ChevronUp size={16} className="text-blue-600" />
                    ) : (
                        <ChevronRight size={16} className="text-blue-600" />
                    )}
                    <span className="text-sm font-medium text-blue-700">
                        {expandedRows?.has(row._id) ? 'Hide Details' : 'View Details'}
                    </span>
                </button>
            )
        },
        {
            header: 'Invoice',
            key: 'invoiceNumber',
            render: (row: Subscription) => (
                <span className="font-mono text-xs bg-gray-100 px-2 py-1 rounded">
                    {row.invoiceNumber || row._id.substring(row._id.length - 8)}
                </span>
            )
        },
        {
            header: 'Plan',
            key: 'plan',
            render: (row: Subscription) => (
                <span className="font-medium text-gray-800">{row.plan}</span>
            )
        },
        {
            header: 'User',
            key: 'user',
            render: (row: Subscription) => (
                <div className="flex flex-col">
                    <span className="font-medium text-gray-800 text-sm">
                        {row.userDetails?.name || 'N/A'}
                    </span>
                    <span className="text-xs text-gray-500">
                        {row.userDetails?.phoneno || 'No phone'}
                    </span>
                </div>
            )
        },
        {
            header: 'Credits',
            key: 'credits',
            render: (row: Subscription) => {
                const percentage = ((row.totalcredits - row.credits) / row.totalcredits) * 100;
                return (
                    <div className="space-y-1">
                        <div className="flex items-center justify-between text-xs">
                            <span className="font-medium text-gray-800">{row.credits} / {row.totalcredits}</span>
                            <span className="text-gray-500">{Math.round(percentage)}% used</span>
                        </div>
                        <div className="w-24 bg-gray-200 rounded-full h-1.5">
                            <div 
                                className="bg-blue-600 h-1.5 rounded-full" 
                                style={{ width: `${percentage}%` }}
                            ></div>
                        </div>
                    </div>
                );
            }
        },
        {
            header: 'Start Date',
            key: 'startdate',
            render: (row: Subscription) => {
                const date = new Date(row.startdate);
                return (
                    <div className="space-y-1">
                        <div className="font-medium text-sm">{date.toLocaleDateString()}</div>
                        <div className="text-xs text-gray-500">{date.toLocaleTimeString()}</div>
                    </div>
                );
            }
        },
        {
            header: 'End Date',
            key: 'enddate',
            render: (row: Subscription) => {
                const date = new Date(row.enddate);
                const isExpired = date < new Date();
                return (
                    <div className="space-y-1">
                        <div className={`font-medium text-sm ${isExpired ? 'text-red-600' : 'text-green-600'}`}>
                            {date.toLocaleDateString()}
                        </div>
                        {!isExpired && (
                            <div className="text-xs text-green-500">
                                {Math.ceil((date.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))} days left
                            </div>
                        )}
                    </div>
                );
            }
        },
        {
            header: 'Amount',
            key: 'totalamount',
            render: (row: Subscription) => (
                <span className="font-bold text-green-600 text-base">₹{row.totalamount}</span>
            )
        },
        {
            header: 'Status',
            key: 'status',
            render: (row: Subscription) => {
                const isExpired = new Date(row.enddate) < new Date();
                const status = isExpired ? 'expired' : row.status;
                
                const statusConfig = {
                    active: { bg: 'bg-green-100', text: 'text-green-800', icon: CheckCircle, label: 'Active' },
                    expired: { bg: 'bg-red-100', text: 'text-red-800', icon: XCircle, label: 'Expired' },
                    cancelled: { bg: 'bg-gray-100', text: 'text-gray-800', icon: XCircle, label: 'Cancelled' },
                    pending: { bg: 'bg-yellow-100', text: 'text-yellow-800', icon: AlertCircle, label: 'Pending' }
                };
                
                const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.pending;
                const Icon = config.icon;
                
                return (
                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${config.bg} ${config.text}`}>
                        <Icon className="w-3 h-3 mr-1" />
                        {config.label}
                    </span>
                );
            }
        },
        {
            header: 'Payment',
            key: 'paymentStatus',
            render: (row: Subscription) => (
                <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                    row.paymentStatus === 'paid' 
                        ? 'bg-green-100 text-green-800' 
                        : row.paymentStatus === 'failed'
                            ? 'bg-red-100 text-red-800'
                            : 'bg-yellow-100 text-yellow-800'
                }`}>
                    {row.paymentStatus === 'paid' ? '✅ Paid' : row.paymentStatus === 'failed' ? '❌ Failed' : '⏳ Pending'}
                </span>
            )
        },
        {
            header: 'Created',
            key: 'createdAt',
            render: (row: Subscription) => {
                const date = new Date(row.createdAt);
                return (
                    <div className="text-xs text-gray-600">
                        {date.toLocaleDateString()}
                    </div>
                );
            }
        }
    ];

    return (
        <div className="min-h-screen bg-gray-50 p-4 sm:p-6">
            <div className="max-w-full mx-auto space-y-6">
                {/* Header */}
                <div className="bg-white rounded-xl shadow-md p-6">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                        <div>
                            <h1 className={`text-2xl sm:text-3xl font-bold ${GRADIENT_CLASS} bg-clip-text text-transparent mb-2`}>
                                Subscription Management
                            </h1>
                            <p className="text-gray-600 text-sm sm:text-base">Manage and track all user subscriptions</p>
                        </div>
                        
                        {/* Summary Cards */}
                        <div className="flex flex-wrap gap-3">
                            <div className="bg-blue-50 rounded-lg px-4 py-2">
                                <p className="text-xs text-blue-600">Total Credits</p>
                                <p className="text-xl font-bold text-blue-700">{totalCredits}</p>
                            </div>
                            <div className="bg-green-50 rounded-lg px-4 py-2">
                                <p className="text-xs text-green-600">Remaining</p>
                                <p className="text-xl font-bold text-green-700">{remainingCredits}</p>
                            </div>
                            <div className="bg-purple-50 rounded-lg px-4 py-2">
                                <p className="text-xs text-purple-600">Revenue</p>
                                <p className="text-xl font-bold text-purple-700">₹{totalRevenue}</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Tabs */}
                <div className="bg-white rounded-xl shadow-md p-4">
                    <div className="flex flex-wrap gap-2">
                        {tabs.map((tab) => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={`flex items-center px-4 py-2.5 rounded-lg font-medium transition-all duration-200 ${
                                    activeTab === tab.id
                                        ? `${GRADIENT_CLASS} text-white shadow-lg transform scale-105`
                                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                }`}
                            >
                                <span className="mr-2">{tab.icon}</span>
                                {tab.label}
                                <span className={`ml-2 px-2 py-0.5 rounded-full text-xs ${
                                    activeTab === tab.id ? 'bg-white/20' : 'bg-gray-300'
                                }`}>
                                    {tab.count}
                                </span>
                            </button>
                        ))}
                    </div>
                </div>

                {/* Filters Toggle */}
                <div className="bg-white rounded-xl shadow-md p-4">
                    <button
                        onClick={() => setShowFilters(!showFilters)}
                        className="flex items-center text-blue-600 hover:text-blue-700 font-medium"
                    >
                        <Filter className="w-4 h-4 mr-2" />
                        {showFilters ? 'Hide Filters' : 'Show Filters'}
                        <ChevronDown className={`w-4 h-4 ml-1 transition-transform duration-200 ${showFilters ? 'rotate-180' : ''}`} />
                    </button>

                    {/* Filters Section */}
                    {showFilters && (
                        <div className="mt-4 pt-4 border-t border-gray-200">
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                                {/* Start Date */}
                                <div className="space-y-2">
                                    <label className="block text-sm font-medium text-gray-700">
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

                                {/* Status Filter */}
                                <div className="space-y-2">
                                    <label className="block text-sm font-medium text-gray-700">
                                        Status
                                    </label>
                                    <select
                                        value={statusFilter}
                                        onChange={(e) => setStatusFilter(e.target.value)}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    >
                                        <option value="all">All Status</option>
                                        <option value="active">Active</option>
                                        <option value="expired">Expired</option>
                                        <option value="pending">Pending</option>
                                        <option value="cancelled">Cancelled</option>
                                    </select>
                                </div>

                                {/* Plan Filter */}
                                <div className="space-y-2">
                                    <label className="block text-sm font-medium text-gray-700">
                                        Plan
                                    </label>
                                    <select
                                        value={planFilter}
                                        onChange={(e) => setPlanFilter(e.target.value)}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    >
                                        {getUniquePlans().map(plan => (
                                            <option key={plan} value={plan}>
                                                {plan === 'all' ? 'All Plans' : plan}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                {/* Search */}
                                <div className="space-y-2 lg:col-span-4">
                                    <label className="block text-sm font-medium text-gray-700">
                                        Search
                                    </label>
                                    <div className="relative">
                                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                                        <input
                                            type="text"
                                            value={searchTerm}
                                            onChange={(e) => setSearchTerm(e.target.value)}
                                            placeholder="Search by ID, plan, user name, phone, invoice, payment ID..."
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
                    )}
                </div>

                {/* Subscriptions Table */}
                <div className="bg-white rounded-xl shadow-md p-4 sm:p-6">
                    {/* Header with count */}
                    <div className="mb-4 flex justify-between items-center">
                        <h2 className="text-xl font-semibold text-gray-800">
                            {tabs.find(t => t.id === activeTab)?.label}
                        </h2>
                        <div className="flex items-center gap-3">
                            <span className="text-sm text-gray-600 bg-gray-100 px-3 py-1 rounded-full">
                                Total: <span className="font-bold text-blue-600">{getDisplayedSubscriptions().length}</span>
                            </span>
                            {loading && (
                                <RefreshCw className="w-4 h-4 text-blue-600 animate-spin" />
                            )}
                        </div>
                    </div>

                    {/* Table */}
                    {loading ? (
                        <div className="flex justify-center items-center py-20">
                            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                        </div>
                    ) : (
                        <div className="overflow-x-auto w-full">
                            <DataTable 
                                data={getDisplayedSubscriptions()} 
                                columns={columns} 
                                expandedRows={expandedRows}
                                toggleRow={toggleRow}
                            />
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default SubscriptionPage;