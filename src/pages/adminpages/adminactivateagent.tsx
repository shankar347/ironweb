import React, { useState, useEffect } from 'react';
import {
    Calendar,
    Search,
    Trash2,
    Users,
    UserPlus,
    Mail,
    Phone,
    MapPin,
    Wallet
} from 'lucide-react';
import { API_URL } from '../../hooks/tools';
import { toast } from 'react-toastify';

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

interface User {
    _id: string;
    name: string;
    email: string;
    phoneno: string;
    address: Address;
    walletbalance: number;
    isagent: boolean;
    isadmin: boolean;
    isagentapplied: boolean;
    createdAt: string;
    updatedAt: string;
    __v?: number;
}

interface Column {
    header: string;
    key: string;
    render?: (row: User) => React.ReactNode;
}

interface Tab {
    id: string;
    label: string;
    count: number;
}

// Delete Confirmation Modal
const DeleteModal: React.FC<{
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    userName: string;
}> = ({ isOpen, onClose, onConfirm, userName }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4 shadow-xl">
                <div className="flex items-center justify-center w-12 h-12 mx-auto bg-red-100 rounded-full mb-4">
                    <Trash2 className="text-red-600" size={24} />
                </div>
                <h3 className="text-xl font-bold text-gray-900 text-center mb-2">
                    Delete User
                </h3>
                <p className="text-gray-600 text-center mb-6">
                    Are you sure you want to delete <span className="font-semibold">{userName}</span>? This action cannot be undone.
                </p>
                <div className="flex gap-3">
                    <button
                        onClick={onClose}
                        className="flex-1 px-4 py-2 bg-gray-200 text-gray-700 rounded-lg font-medium hover:bg-gray-300 transition-all duration-200"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={onConfirm}
                        className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700 transition-all duration-200"
                    >
                        Delete
                    </button>
                </div>
            </div>
        </div>
    );
};

// Simple DataTable Component with horizontal scroll
// Simple DataTable Component with horizontal scroll
const DataTable: React.FC<{ data: User[]; columns: Column[] }> = ({ data, columns }) => {
    return (
        <div className="overflow-x-auto rounded-lg shadow-lg">
            <table className="min-w-full divide-y divide-gray-200">
                <thead className={`${GRADIENT_CLASS} text-white`}>
                    <tr>
                        {columns.map((column) => (
                            <th
                                key={column.key}
                                className="px-6 py-5 text-left 
                                text-xs font-medium text-white uppercase tracking-wider whitespace-nowrap"
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
                                No users found
                            </td>
                        </tr>
                    ) : (
                        data.map((row) => (
                            <tr key={row._id} className="hover:bg-gray-50">
                                {columns.map((column) => {
                                    const value = row[column.key as keyof User];

                                    return (
                                        <td key={column.key} className="px-6 py-4 whitespace-nowrap">
                                            {column.render
                                                ? column.render(row)
                                                : typeof value === "object" && value !== null
                                                    ? JSON.stringify(value) // 👈 convert objects (like Address) into string
                                                    : String(value ?? "")}
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


// Main Admin Users Page Component
const Adminactivateagent: React.FC = () => {
    const [activeTab, setActiveTab] = useState<string>('all');
    const [startDate, setStartDate] = useState<string>('');
    const [endDate, setEndDate] = useState<string>('');
    const [searchTerm, setSearchTerm] = useState<string>('');
    const [allUsers, setAllUsers] = useState<User[]>([]);
    const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
    const [deleteModalOpen, setDeleteModalOpen] = useState<boolean>(false);
    const [userToDelete, setUserToDelete] = useState<User | null>(null);

    // Fetch users from API
    useEffect(() => {
        const getAllUsers = async () => {
            try {
                const res = await fetch(`${API_URL}/admin/allgentsapplied`, {
                    credentials: 'include'
                });
                const data = await res.json();

                if (data?.error) {
                    console.error(data?.error);
                    return;
                }

                setAllUsers(data?.data || []);
                setFilteredUsers(data?.data || []);
            } catch (err) {
                console.error('Error fetching users:', err);
            }
        };
        getAllUsers();
    }, []);

    // Get today's joined users
    const getTodayUsers = (): User[] => {
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        return allUsers.filter(user => {
            const joinDate = new Date(user.createdAt);
            joinDate.setHours(0, 0, 0, 0);
            return joinDate.getTime() === today.getTime();
        });
    };

    const tabs: Tab[] = [
        { id: 'all', label: 'All Agents', count: filteredUsers.length },
        { id: 'today', label: 'Today Joined', count: getTodayUsers().length }
    ];

    // Handle delete user
    const handleDeleteClick = (user: User) => {
        setUserToDelete(user);
        setDeleteModalOpen(true);
    };

    const activateAgent = async (user: User) => {

        setUserToDelete(user)

        if (!userToDelete) return;

        try {
            const res = await fetch(`${API_URL}/admin/activateagent/`, {
                method: 'PUT',
                credentials: 'include',
                headers: {
                    'content-type': 'application/json'
                },
                body: JSON.stringify({
                    agent_id: user?._id,
                    action: user.isagent ? false : true
                })
            });
            const data = await res.json();

            if (data?.error) {
                console.error(data?.error);
                return;
            }

            // Remove user from state
            setAllUsers(prev => prev.filter(u => u._id !== userToDelete._id));
            setFilteredUsers(prev => prev.filter(u => u._id !== userToDelete._id));
            toast.success('Agent activated successfully')
            console.log('User deleted successfully');
        } catch (err) {
            console.error('Error deleting user:', err);
        } finally {
            setDeleteModalOpen(false);
            setUserToDelete(null);
        }
    };

    // Dynamic column generation
    const generateColumns = (): Column[] => {
        const columns: Column[] = [
            {
                header: 'User ID',
                key: '_id',
                render: (row: User) => (
                    <span className="font-mono text-xs bg-gray-100 px-2 py-1 rounded">
                        {row._id.substring(row._id.length - 8)}
                    </span>
                )
            },
            {
                header: 'Name',
                key: 'name',
                render: (row: User) => (
                    <div className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-blue-700 rounded-full flex items-center justify-center text-white font-semibold">
                            {row.name.charAt(0).toUpperCase()}
                        </div>
                        <span className="font-medium text-gray-800">{row.name}</span>
                    </div>
                )
            },
            {
                header: 'Email',
                key: 'email',
                render: (row: User) => (
                    <div className="flex items-center gap-2">
                        <Mail size={16} className="text-gray-400" />
                        <span className="text-gray-700">{row.email}</span>
                    </div>
                )
            },
            {
                header: 'Phone',
                key: 'phoneno',
                render: (row: User) => (
                    <div className="flex items-center gap-2">
                        <Phone size={16} className="text-gray-400" />
                        <span className="text-gray-700">{row.phoneno}</span>
                    </div>
                )
            },
            {
                header: 'Address',
                key: 'address',
                render: (row: User) => (
                    <div className="space-y-1 max-w-xs">
                        <div className="flex items-start gap-2">
                            <MapPin size={16} className="text-gray-400 mt-1 flex-shrink-0" />
                            <div className="text-sm text-gray-700">
                                <div>{row.address.houseno}, {row.address.streetname}</div>
                                <div>{row.address.area}, {row.address.city}</div>
                                <div className="text-gray-500">PIN: {row.address.pincode}</div>
                            </div>
                        </div>
                    </div>
                )
            },

            {
                header: 'Joined Date',
                key: 'createdAt',
                render: (row: User) => {
                    const date = new Date(row.createdAt);
                    return (
                        <div className="space-y-1">
                            <div className="font-medium text-gray-800">{date.toLocaleDateString()}</div>
                            <div className="text-xs text-gray-500">{date.toLocaleTimeString()}</div>
                        </div>
                    );
                }
            },
            {
                header: 'Activate',
                key: 'actions',
                render: (row: User) => (
                    <button
                        onClick={() => activateAgent(row)}
                        className={`px-4 py-2 ${GRADIENT_CLASS} text-white rounded-lg font-medium hover:shadow-lg transition-all duration-200 transform hover:scale-105 flex items-center gap-2`}
                    >
                        <UserPlus size={16} />
                        {!row.isagent ? 'Activate' : 'Deactivate'}
                    </button>
                )
            }
        ];

        return columns;
    };

    // Filter users based on active tab
    const getDisplayedUsers = (): User[] => {
        switch (activeTab) {
            case 'today':
                return getTodayUsers();
            default:
                return filteredUsers;
        }
    };

    // Apply filters function
    const applyFilters = () => {
        let filtered: User[] = [...allUsers];

        // Date range filter for joined date
        if (startDate && endDate) {
            const start = new Date(startDate);
            start.setHours(0, 0, 0, 0);
            const end = new Date(endDate);
            end.setHours(23, 59, 59, 999);

            filtered = filtered.filter(user => {
                const joinDate = new Date(user.createdAt);
                return joinDate >= start && joinDate <= end;
            });
        } else if (startDate) {
            const start = new Date(startDate);
            start.setHours(0, 0, 0, 0);

            filtered = filtered.filter(user => {
                const joinDate = new Date(user.createdAt);
                return joinDate >= start;
            });
        } else if (endDate) {
            const end = new Date(endDate);
            end.setHours(23, 59, 59, 999);

            filtered = filtered.filter(user => {
                const joinDate = new Date(user.createdAt);
                return joinDate <= end;
            });
        }

        // Search filter
        if (searchTerm.trim() !== '') {
            const searchLower = searchTerm.toLowerCase().trim();
            filtered = filtered.filter(user =>
                user.name.toLowerCase().includes(searchLower) ||
                user.email.toLowerCase().includes(searchLower) ||
                user.phoneno.includes(searchLower) ||
                user._id.toLowerCase().includes(searchLower) ||
                (user?.address?.area || '').toLowerCase().includes(searchLower) ||
                (user?.address?.city || '').toLowerCase().includes(searchLower)
            );
        }

        setFilteredUsers(filtered);
        setActiveTab('all');
    };

    // Clear filters
    const clearFilters = () => {
        setStartDate('');
        setEndDate('');
        setSearchTerm('');
        setFilteredUsers(allUsers);
        setActiveTab('all');
    };

    // Real-time search as user types
    useEffect(() => {
        if (searchTerm.trim() === '') {
            setFilteredUsers(allUsers);
        } else {
            const searchLower = searchTerm.toLowerCase().trim();
            const filtered = allUsers.filter(user =>
                user.name.toLowerCase().includes(searchLower) ||
                user.email.toLowerCase().includes(searchLower) ||
                user.phoneno.includes(searchLower) ||
                user._id.toLowerCase().includes(searchLower) ||
                (user?.address?.area || '').toLowerCase().includes(searchLower) ||
                (user?.address?.city || '').toLowerCase().includes(searchLower)
            );
            setFilteredUsers(filtered);
        }
    }, [searchTerm, allUsers]);

    return (
        <div className="min-h-screen bg-gray-50 p-6">
            <div className="max-w-full mx-auto space-y-6">
                {/* Header */}
                <div className="rounded-lg p-6">
                    <h1 className={`text-3xl font-bold ${GRADIENT_CLASS} bg-clip-text text-transparent mb-2`}>
                        Activate Agents
                    </h1>
                    <p className="text-gray-600">Enable agents to join our team </p>
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
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
                                    placeholder="Search users..."
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

                {/* Users Table */}
                <div className="bg-white
                min-w-full
                max-w-screen-lg rounded-lg shadow-md p-6">
                    <div className="mb-4 flex justify-between items-center">
                        <h2 className="text-xl font-semibold text-gray-800">
                            {tabs.find(t => t.id === activeTab)?.label}
                        </h2>
                        <span className="text-sm text-gray-600 bg-gray-100 px-3 py-1 rounded-full">
                            Total: <span className="font-bold text-blue-600">{getDisplayedUsers().length}</span> users
                        </span>
                    </div>

                    <DataTable data={getDisplayedUsers()} columns={generateColumns()} />
                </div>
            </div>

            {/* Delete Confirmation Modal */}

        </div>
    );
};

export default Adminactivateagent;