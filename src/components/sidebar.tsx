import React, { useState, useContext } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
    ShoppingCart,
    Users,
    Headphones,
    UserPlus,
    Power,
    DollarSign,
    LogOut,
    Menu,
    X,
    IndianRupee,
    Truck,
    ChevronLeft,
    ChevronRight,
    Upload
} from 'lucide-react';
import { SteamContext } from '../hooks/steamcontext';
import { API_URL } from '../hooks/tools';
import { toast } from 'react-toastify';
import ConfirmModal from './logoutcomponent';

const Sidebar = () => {
    const location = useLocation();
    const [isOpen, setIsOpen] = useState(true);
    const [showLogoutModal, setShowLogoutModal] = useState(false);
    const steamcontext = useContext(SteamContext)

    const navigate = useNavigate()
    const [isLoading, setIsLoading] = useState(false);

    const { User: User1, setUser } = steamcontext
    const menuItems = [
        { path: '/admin/orders', icon: ShoppingCart, label: 'Orders' },
        { path: '/admin/users', icon: Users, label: 'Users' },
        { path: '/admin/agents', icon: Truck, label: 'Agents' },
        { path: '/admin/assign-orders', icon: UserPlus, label: 'Assign Orders' },
        { path: '/admin/activate-agents', icon: Power, label: 'Activate Agents' },
        { path: '/admin/order-amount', icon: IndianRupee, label: 'Order Amount' },
        { path: '/admin/upload/clientpageassets', icon: Upload, label: 'Upload Banners' },
    ];

    const isActive = (path: string) => location.pathname === path;


    const handlelogout = async () => {



        setIsLoading(true);


        const res = await fetch(`${API_URL}/user/logout`, {
            method: 'DELETE',
            credentials: 'include'
        })
        const data = await res.json()

        if (data?.error) {

            toast.error(data?.error)
            setIsLoading(false)
            return
        }

        setUser(null)
        // Simulate API call

        setIsLoading(false)
        toast.success(data?.message)
        setShowLogoutModal(false)
        navigate('/customer/login')

    }



    return (
        <>
            {/* Sidebar */}
            <div
                className={`fixed lg:sticky top-0 left-0 
                h-screen
                 bg-gradient-to-r
                 shadow-md from-blue-500 via-blue-600
                  to-blue-700 
                 transition-all duration-300 z-40
                  ${isOpen ? 'w-64' : 'w-20'
                    }`}
            >
                {/* Toggle Button - Visible on all screens */}
                <button
                    onClick={() => setIsOpen(!isOpen)}
                    className="absolute -right-4 top-8 z-50 p-2 rounded-full 
                     bg-gradient-to-r from-blue-500 via-blue-600 to-blue-700 text-white shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200"
                    aria-label={isOpen ? 'Collapse sidebar' : 'Expand sidebar'}
                >
                    {isOpen ? (
                        <ChevronLeft size={20} className="text-white" />
                    ) : (
                        <ChevronRight size={20} className="text-white" />
                    )}
                </button>

                <div className={`h-full flex flex-col ${isOpen ? 'p-6' : 'p-4'}`}>
                    {/* Logo/Header */}
                    <div className="mb-8 pb-6 border-b border-white/20">
                        <h1
                            className={`text-white font-bold transition-all duration-300 text-center ${isOpen ? 'text-2xl' : 'text-sm'
                                }`}
                        >
                            {isOpen ? 'Agent Portal' : 'AP'}
                        </h1>
                    </div>

                    {/* Menu Items */}
                    <nav className="flex-1 space-y-2 
                    overflow-y-auto">
                        {menuItems.map((item) => {
                            const Icon = item.icon;
                            const active = isActive(item.path);

                            return (
                                <Link
                                    key={item.path}
                                    to={item.path}
                                    className={`flex items-center gap-4 
                                    px-4 py-3 rounded-lg transition-all duration-200 group ${active
                                            ? 'bg-white text-blue-700 shadow-lg'
                                            : 'text-white hover:bg-white/10 hover:translate-y-1'
                                        } ${!isOpen && 'justify-center'}`}
                                    title={!isOpen ? item.label : ''}
                                >
                                    <Icon
                                        size={22}
                                        className={`transition-all duration-200 flex-shrink-0 ${active ? 'text-blue-700' : 'text-white group-hover:scale-110'
                                            }`}
                                    />
                                    {isOpen && (
                                        <span className="font-medium text-sm whitespace-nowrap overflow-hidden text-ellipsis">
                                            {item.label}
                                        </span>
                                    )}
                                </Link>
                            );
                        })}
                    </nav>

                    {/* Logout Button */}
                    <div className="pt-6 border-t border-white/20">
                        <div

                            onClick={() => setShowLogoutModal(true)}
                            className={`flex items-center gap-4 px-4 py-3 rounded-lg text-white hover:bg-red-500/80 transition-all duration-200 group hover:translate-x-1 ${!isOpen && 'justify-center'
                                }`}
                            title={!isOpen ? 'Logout' : ''}
                        >
                            <LogOut
                                size={22}
                                className="group-hover:scale-110 transition-all duration-200 flex-shrink-0"
                            />
                            {isOpen && (
                                <span className="font-medium text-sm whitespace-nowrap overflow-hidden text-ellipsis">
                                    Logout
                                </span>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Overlay for mobile when sidebar is open */}
            {isOpen && (
                <div
                    className="lg:hidden fixed inset-0 bg-black/50 z-30"
                    onClick={() => setIsOpen(false)}
                />
            )}

            <ConfirmModal
                isOpen={showLogoutModal}
                onClose={() => setShowLogoutModal(false)}
                onConfirm={handlelogout}
                title="Confirm Logout"
                message="Are you sure you want to logout? You will need to login again to access your account."
                confirmText="Yes, Logout"
                cancelText="Cancel"
                isLoading={isLoading}
            />
        </>
    );
};

export default Sidebar;