import { Edit, LogOut, Mail, MapPin, Phone, User, Star, Calendar, Shirt, CreditCard, CheckCircle, Package } from 'lucide-react'
import React, { useContext, useState } from 'react'
import { Card } from '../../components/ui/card'
import { SteamContext } from '../../hooks/steamcontext'
import { Button } from '../../components/ui/button';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { API_URL } from '../../hooks/tools';
import ConfirmModal from '../../components/logoutcomponent';

const Userprofile = () => {

    const steamcontext = useContext(SteamContext)

    const navigate = useNavigate()
    const [isLoading, setIsLoading] = useState(false);
    const [showLogoutModal, setShowLogoutModal] = useState(false);
    const { User: User1, setUser } = steamcontext

    const subscription = User1?.subscription

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
        setIsLoading(false)
        toast.success(data?.message)
        setShowLogoutModal(false)
        navigate('/customer/login')
    }

    const formatDate = (dateStr) => {
        if (!dateStr) return '—'
        return new Date(dateStr).toLocaleDateString('en-IN', {
            day: '2-digit',
            month: 'short',
            year: 'numeric'
        })
    }

    const getDaysRemaining = (endDate) => {
        if (!endDate) return 0
        const diff = new Date(endDate) - new Date()
        return Math.max(0, Math.ceil(diff / (1000 * 60 * 60 * 24)))
    }

    // Fixed: Calculate usage based on credits instead of days
    const getCreditsUsed = () => {
        if (!subscription) return 0
        return subscription.totalcredits - subscription.credits
    }

    const getCreditsUsagePercentage = () => {
        if (!subscription) return 0
        const creditsUsed = getCreditsUsed()
        return Math.min(100, Math.round((creditsUsed / subscription.totalcredits) * 100))
    }

    const daysLeft = subscription ? getDaysRemaining(subscription.enddate) : 0
    const creditsUsed = subscription ? getCreditsUsed() : 0
    const creditsUsagePercent = subscription ? getCreditsUsagePercentage() : 0

    return (
        <div className="min-h-screen bg-secondary/20 py-8 sm:py-12 md:py-16 lg:py-20">
            <div className="container mx-auto px-3 sm:px-4 md:px-6 lg:px-8">
                <div className="max-w-2xl mx-auto flex flex-col items-center justify-center">

                    {/* Header Section */}
                    <div className="text-center mb-6 sm:mb-8 px-2">
                        <div className="bg-primary/10 w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4">
                            <User className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 text-primary" />
                        </div>
                        <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-foreground mb-1 sm:mb-2">
                            User Profile
                        </h1>
                        <p className="text-sm sm:text-base text-muted-foreground">Profile and Address details</p>
                    </div>

                    {/* Profile Card */}
                    <Card className="card-service p-4 sm:p-5 md:p-6 w-full">
                        <h3 className="text-base sm:text-lg md:text-xl font-semibold mb-4 sm:mb-5 text-foreground flex items-center space-x-2">
                            Profile details
                        </h3>

                        <div className="space-y-3 sm:space-y-4 md:space-y-5">
                            {/* Name */}
                            <div className="flex items-start gap-3 sm:gap-4 p-3 sm:p-4 rounded-lg sm:rounded-xl bg-gradient-to-r from-blue-200 to-blue-300 hover:shadow-md transition-all duration-300 hover:scale-[1.01]">
                                <div className="w-10 h-10 sm:w-11 sm:h-11 md:w-12 md:h-12 rounded-lg bg-gradient-to-br from-blue-500 to-sky-400 flex items-center justify-center flex-shrink-0">
                                    <User className="w-5 h-5 md:w-6 md:h-6 text-white" />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="text-xs sm:text-sm text-slate-600 mb-0.5 sm:mb-1">Full Name</p>
                                    <p className="text-sm sm:text-base md:text-lg font-semibold text-slate-900 break-words">{User1.name}</p>
                                </div>
                            </div>

                            {/* Phone */}
                            <div className="flex items-start gap-3 sm:gap-4 p-3 sm:p-4 rounded-lg sm:rounded-xl bg-gradient-to-r from-blue-200 to-blue-300 hover:shadow-md transition-all duration-300 hover:scale-[1.01]">
                                <div className="w-10 h-10 sm:w-11 sm:h-11 md:w-12 md:h-12 rounded-lg bg-gradient-to-br from-blue-500 to-sky-400 flex items-center justify-center flex-shrink-0">
                                    <Phone className="w-5 h-5 md:w-6 md:h-6 text-white" />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="text-xs sm:text-sm text-slate-600 mb-0.5 sm:mb-1">Phone Number</p>
                                    <p className="text-sm sm:text-base md:text-lg font-semibold text-slate-900 break-words">{User1.phoneno}</p>
                                </div>
                            </div>

                            {/* Email */}
                            <div className="flex items-start gap-3 sm:gap-4 p-3 sm:p-4 rounded-lg sm:rounded-xl bg-gradient-to-r from-blue-200 to-blue-300 hover:shadow-md transition-all duration-300 hover:scale-[1.01]">
                                <div className="w-10 h-10 sm:w-11 sm:h-11 md:w-12 md:h-12 rounded-lg bg-gradient-to-br from-blue-500 to-sky-400 flex items-center justify-center flex-shrink-0">
                                    <Mail className="w-5 h-5 md:w-6 md:h-6 text-white" />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="text-xs sm:text-sm text-slate-600 mb-0.5 sm:mb-1">Email Address</p>
                                    <p className="text-sm sm:text-base md:text-lg font-semibold text-slate-900 break-words">{User1.email}</p>
                                </div>
                            </div>

                            {/* Address */}
                            <div className="flex items-start gap-3 sm:gap-4 p-3 sm:p-4 rounded-lg sm:rounded-xl bg-gradient-to-r from-blue-200 to-blue-300 hover:shadow-md transition-all duration-300 hover:scale-[1.01]">
                                <div className="w-10 h-10 sm:w-11 sm:h-11 md:w-12 md:h-12 rounded-lg bg-gradient-to-br from-blue-500 to-sky-400 flex items-center justify-center flex-shrink-0">
                                    <MapPin className="w-5 h-5 md:w-6 md:h-6 text-white" />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="text-xs sm:text-sm text-slate-600 mb-0.5 sm:mb-1">Address</p>
                                    <p className="text-sm sm:text-base md:text-lg font-semibold text-slate-900 leading-relaxed break-words">
                                        {User1.address.houseno}, {User1.address.streetname}, {User1.address.area}, {User1.address.city} - {User1.address.pincode}
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 mt-6 sm:mt-7 md:mt-8">
                            <Button
                                onClick={() => navigate('/customer/profile/edit-profile')}
                                className="flex-1 bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 text-white font-semibold md:py-6 px-4 rounded-lg sm:rounded-xl shadow-lg transform transition-all duration-300 hover:scale-105 hover:-translate-y-1 text-sm sm:text-base active:scale-95 touch-manipulation">
                                <Edit className="w-4 h-4 md:w-5 md:h-5 mr-2" />
                                Edit Profile
                            </Button>

                            <Button
                                onClick={() => setShowLogoutModal(true)}
                                className="flex-1 bg-gradient-to-r from-red-600 to-red-500 hover:from-red-700 hover:to-red-600 text-white font-semibold md:py-6 px-4 rounded-lg sm:rounded-xl shadow-lg transform transition-all duration-300 hover:scale-105 hover:-translate-y-1 text-sm sm:text-base active:scale-95 touch-manipulation">
                                <LogOut className="w-4 h-4 md:w-5 md:h-5 mr-2" />
                                Logout
                            </Button>
                        </div>
                    </Card>

                    {/* ── Active Subscription Card ── */}
                    {subscription ? (
                        <Card className="card-service p-4 sm:p-5 md:p-6 w-full mt-5 sm:mt-6">

                            {/* Card Header */}
                            <div className="flex items-center justify-between mb-5">
                                <h3 className="text-base sm:text-lg md:text-xl font-semibold text-foreground flex items-center gap-2">
                                    <Star className="w-5 h-5 text-primary fill-primary/20" />
                                    Active Subscription
                                </h3>
                                <span className="inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1 rounded-full bg-green-100 text-green-700 border border-green-200">
                                    <CheckCircle className="w-3.5 h-3.5" />
                                    {subscription.status.charAt(0).toUpperCase() + subscription.status.slice(1)}
                                </span>
                            </div>

                            {/* Plan Name Banner */}
                            <div className="rounded-xl bg-gradient-to-r from-primary to-primary/70 p-4 mb-4 text-white">
                                <p className="text-xs font-medium opacity-80 mb-0.5">Current Plan</p>
                                <p className="text-xl sm:text-2xl font-bold">{subscription.plan}</p>
                                <p className="text-xs opacity-75 mt-1">
                                    Paid via {subscription.paymentMethod.charAt(0).toUpperCase() + subscription.paymentMethod.slice(1)} · ₹{subscription.totalamount}
                                </p>
                            </div>

                            {/* Dates + Credits row */}
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-4">
                                {/* Start Date */}
                                <div className="flex items-start gap-3 p-3 rounded-xl bg-gradient-to-br from-blue-50 to-blue-100 border border-blue-200">
                                    <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-blue-500 to-sky-400 flex items-center justify-center flex-shrink-0">
                                        <Calendar className="w-4 h-4 text-white" />
                                    </div>
                                    <div>
                                        <p className="text-xs text-slate-500 mb-0.5">Start Date</p>
                                        <p className="text-sm font-semibold text-slate-800">{formatDate(subscription.startdate)}</p>
                                    </div>
                                </div>

                                {/* End Date */}
                                <div className="flex items-start gap-3 p-3 rounded-xl bg-gradient-to-br from-orange-50 to-orange-100 border border-orange-200">
                                    <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-orange-500 to-amber-400 flex items-center justify-center flex-shrink-0">
                                        <Calendar className="w-4 h-4 text-white" />
                                    </div>
                                    <div>
                                        <p className="text-xs text-slate-500 mb-0.5">End Date</p>
                                        <p className="text-sm font-semibold text-slate-800">{formatDate(subscription.enddate)}</p>
                                    </div>
                                </div>

                                {/* Credits */}
                                <div className="flex items-start gap-3 p-3 rounded-xl bg-gradient-to-br from-primary/5 to-primary/15 border border-primary/20">
                                    <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-primary to-primary/70 flex items-center justify-center flex-shrink-0">
                                        <CreditCard className="w-4 h-4 text-white" />
                                    </div>
                                    <div>
                                        <p className="text-xs text-slate-500 mb-0.5">Available Credits</p>
                                        <p className="text-sm font-semibold text-slate-800">{subscription.credits} / {subscription.totalcredits} credits</p>
                                    </div>
                                </div>
                            </div>

                            {/* Credits progress bar - Fixed to use credits instead of days */}
                            <div className="mb-5">
                                <div className="flex justify-between text-xs text-slate-500 mb-1.5">
                                    <span>Credits Usage</span>
                                    <span className="font-medium text-primary">{creditsUsed} credits used</span>
                                </div>
                                <div className="w-full bg-slate-100 rounded-full h-2.5 overflow-hidden">
                                    <div
                                        className="h-2.5 rounded-full bg-gradient-to-r from-primary to-primary/60 transition-all duration-700"
                                        style={{ width: `${creditsUsagePercent}%` }}
                                    />
                                </div>
                                <div className="flex justify-between text-xs text-slate-400 mt-1">
                                    <span>{creditsUsagePercent}% of credits used</span>
                                    <span>{daysLeft} days remaining</span>
                                </div>
                            </div>

                            {/* Garment Details */}
                            <div>
                                <div className="flex items-center gap-2 mb-3">
                                    <Package className="w-4 h-4 text-primary" />
                                    <p className="text-sm font-semibold text-foreground">Garment Details</p>
                                </div>
                                <div className="grid grid-cols-3 gap-2 sm:gap-3">
                                    {subscription.cloths.map((cloth) => (
                                        <div
                                            key={cloth._id}
                                            className="flex flex-col items-center justify-center p-3 rounded-xl bg-gradient-to-br from-primary/5 to-primary/15 border border-primary/20 hover:shadow-md hover:scale-105 transition-all duration-200"
                                        >
                                            <Shirt className="w-5 h-5 text-primary mb-1.5" />
                                            <p className="text-xs text-slate-500 text-center">{cloth.name}</p>
                                            <p className="text-base font-bold text-primary">{cloth.count}</p>
                                            <p className="text-xs text-slate-400">pcs</p>
                                        </div>
                                    ))}
                                </div>
                            </div>

                        </Card>
                    ) : (
                        /* No subscription state */
                        <Card className="card-service p-5 sm:p-6 w-full mt-5 sm:mt-6 text-center">
                            <div className="bg-primary/10 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3">
                                <Star className="w-6 h-6 text-primary" />
                            </div>
                            <h3 className="text-base font-semibold text-foreground mb-1">No Active Subscription</h3>
                            <p className="text-sm text-muted-foreground mb-4">You don't have an active plan yet. Subscribe to get started.</p>
                            <Button
                                onClick={() => navigate('/customer/plans')}
                                className="bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 text-white font-semibold px-6 py-2 rounded-xl shadow-md transition-all duration-300 hover:scale-105">
                                View Plans
                            </Button>
                        </Card>
                    )}

                </div>
            </div>

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
        </div>
    )
}

export default Userprofile