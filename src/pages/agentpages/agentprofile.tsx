import { Edit, LogOut, Mail, MapPin, Phone, User } from 'lucide-react'
import React, { useContext, useState } from 'react'
import { Card } from '../../components/ui/card'
import { SteamContext } from '../../hooks/steamcontext'
import { Button } from '../../components/ui/button';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { API_URL } from '../../hooks/tools';
import ConfirmModal from '../../components/logoutcomponent';

const Agentprofile = () => {

    const steamcontext = useContext(SteamContext)

    const navigate = useNavigate()
    const [isLoading, setIsLoading] = useState(false);
    const [showLogoutModal, setShowLogoutModal] = useState(false);
    const { User: User1, setUser } = steamcontext

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
        <div className="min-h-screen bg-secondary/20 py-20">
            <div className="container mx-auto px-4">
                <div className="max-w-2xl mx-auto">
                    <div className="text-center mb-8">
                        <div className="bg-primary/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                            <User className="w-8 h-8 text-primary" />
                        </div>
                        <h1 className="text-3xl font-bold text-foreground mb-2">
                            Agent Profile </h1>
                        <p className="text-muted-foreground">Profile and Address details</p>
                    </div>
                     <Card className="card-service p-4 sm:p-5 md:p-6 w-full">
                                           <h3 className="text-base sm:text-lg md:text-xl font-semibold mb-4 sm:mb-5 text-foreground flex items-center space-x-2">
                                               Profile details
                                           </h3>
                   
                                           <div className="space-y-3 sm:space-y-4 md:space-y-5">
                                               {/* Name */}
                                               <div className="flex items-start gap-3 sm:gap-4 p-3 sm:p-4 
                                                   rounded-lg sm:rounded-xl bg-gradient-to-r
                                                   from-blue-200 to-blue-300 hover:shadow-md transition-all duration-300 
                                                   hover:scale-[1.01] sm:hover:scale-102">
                                                   <div className="w-10 h-10 sm:w-11 sm:h-11 md:w-12 md:h-12 rounded-lg 
                                                       bg-gradient-to-br from-blue-500 to-sky-400 flex items-center 
                                                       justify-center flex-shrink-0">
                                                       <User className="w-5 h-5 sm:w-5.5 sm:h-5.5 md:w-6 md:h-6 text-white" />
                                                   </div>
                                                   <div className="flex-1 min-w-0">
                                                       <p className="text-xs sm:text-sm text-slate-600 mb-0.5 sm:mb-1">Full Name</p>
                                                       <p className="text-sm sm:text-base md:text-lg font-semibold text-slate-900 break-words">
                                                           {User1.name}
                                                       </p>
                                                   </div>
                                               </div>
                   
                                               {/* Phone */}
                                               <div className="flex items-start gap-3 sm:gap-4 p-3 sm:p-4 
                                                   rounded-lg sm:rounded-xl bg-gradient-to-r from-blue-200 to-blue-300 
                                                   hover:shadow-md transition-all duration-300 hover:scale-[1.01] sm:hover:scale-102">
                                                   <div className="w-10 h-10 sm:w-11 sm:h-11 md:w-12 md:h-12 rounded-lg 
                                                       bg-gradient-to-br from-blue-500 to-sky-400 flex items-center 
                                                       justify-center flex-shrink-0">
                                                       <Phone className="w-5 h-5 sm:w-5.5 sm:h-5.5 md:w-6 md:h-6 text-white" />
                                                   </div>
                                                   <div className="flex-1 min-w-0">
                                                       <p className="text-xs sm:text-sm text-slate-600 mb-0.5 sm:mb-1">Phone Number</p>
                                                       <p className="text-sm sm:text-base md:text-lg font-semibold text-slate-900 break-words">
                                                           {User1.phoneno}
                                                       </p>
                                                   </div>
                                               </div>
                   
                                               {/* Email */}
                                               <div className="flex items-start gap-3 sm:gap-4 p-3 sm:p-4 
                                                   rounded-lg sm:rounded-xl bg-gradient-to-r from-blue-200 to-blue-300 
                                                   hover:shadow-md transition-all duration-300 hover:scale-[1.01] sm:hover:scale-102">
                                                   <div className="w-10 h-10 sm:w-11 sm:h-11 md:w-12 md:h-12 rounded-lg 
                                                       bg-gradient-to-br from-blue-500 to-sky-400 flex items-center 
                                                       justify-center flex-shrink-0">
                                                       <Mail className="w-5 h-5 sm:w-5.5 sm:h-5.5 md:w-6 md:h-6 text-white" />
                                                   </div>
                                                   <div className="flex-1 min-w-0">
                                                       <p className="text-xs sm:text-sm text-slate-600 mb-0.5 sm:mb-1">Email Address</p>
                                                       <p className="text-sm sm:text-base md:text-lg font-semibold text-slate-900 break-words">
                                                           {User1.email}
                                                       </p>
                                                   </div>
                                               </div>
                   
                                               {/* Address */}
                                               <div className="flex items-start gap-3 sm:gap-4 p-3 sm:p-4 
                                                   rounded-lg sm:rounded-xl bg-gradient-to-r from-blue-200 to-blue-300 
                                                   hover:shadow-md transition-all duration-300 hover:scale-[1.01] sm:hover:scale-102">
                                                   <div className="w-10 h-10 sm:w-11 sm:h-11 md:w-12 md:h-12 rounded-lg 
                                                       bg-gradient-to-br from-blue-500 to-sky-400 flex items-center 
                                                       justify-center flex-shrink-0">
                                                       <MapPin className="w-5 h-5 sm:w-5.5 sm:h-5.5 md:w-6 md:h-6 text-white" />
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
                                                   className="flex-1 bg-gradient-to-r from-blue-600 to-blue-500 
                                                       hover:from-blue-700 hover:to-blue-600
                                                        text-white font-semibold 
                                                        md:py-6 px-4 rounded-lg sm:rounded-xl shadow-lg 
                                                       transform transition-all duration-300 hover:scale-105 
                                                       hover:-translate-y-1 text-sm sm:text-base
                                                       active:scale-95 touch-manipulation">
                                                   <Edit className="w-4 h-4 sm:w-4.5 sm:h-4.5 md:w-5 md:h-5 mr-2" />
                                                   Edit Profile
                                               </Button>
                   
                                               <Button
                                                   onClick={() => setShowLogoutModal(true)}
                                                   className="flex-1 bg-gradient-to-r from-red-600 to-red-500 
                                                       hover:from-red-700 hover:to-red-600 text-white font-semibold 
                                                       py-6 px-4 rounded-lg sm:rounded-xl shadow-lg 
                                                       transform transition-all duration-300 hover:scale-105 
                                                       hover:-translate-y-1 text-sm sm:text-base
                                                       active:scale-95 touch-manipulation"
                                               >
                                                   <LogOut className="w-4 h-4 sm:w-4.5 sm:h-4.5 md:w-5 md:h-5 mr-2" />
                                                   Logout
                                               </Button>
                                           </div>
                                       </Card>

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

export default Agentprofile
