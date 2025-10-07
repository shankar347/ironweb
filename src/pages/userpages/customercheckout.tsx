import { useContext, useState, useEffect } from 'react';
import { Button } from '../../components/ui/button';
import { Card } from '../../components/ui/card';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { User, Mail, Phone, MapPin, Home, Eye, CalendarCheck, Shirt, ShirtIcon, Calendar, Package, ShoppingBasket, ShoppingCart, Clock, Wallet, CreditCard, Banknote, BanknoteIcon, LucideBanknote, Coins, HandCoinsIcon, ListOrdered, Receipt, FileText, LucideShirt, ShoppingBasketIcon, Truck } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from "react-toastify";
import { SteamContext } from '../../hooks/steamcontext';
import { API_URL } from '../../hooks/tools';
import Select from "react-select";

const Ordersummary = () => {
    const [isLoading, setIsLoading] = useState(false);
    const steamcontext = useContext(SteamContext)
    const { formData, setFormData, orderdetails, setorderdetails, } = steamcontext

    console.log(orderdetails)

    const navigate = useNavigate()

    useEffect(() => {

        const checkdetils = localStorage.getItem('orderdetails')

        if (checkdetils) {
            setorderdetails(JSON.parse(checkdetils));
        }
    }, [])


    const handleSubmit = async (e: React.FormEvent) => {

        const res = await fetch(`${API_URL}/orders/createorder`, {
            method: 'POST',
            headers: {
                'content-type': 'application/json'
            },
            body: JSON.stringify(orderdetails),
            credentials: 'include',
        })

        const data = await res.json()

        if (data?.error) {
            return toast.error(data?.error)
        }

        localStorage.removeItem('orderdetails')
        toast.success(data?.message)
        navigate('/')

    };


    return (
        <div className="min-h-screen bg-secondary/20 py-20">
            <div className="container mx-auto px-4">
                <div className="max-w-2xl mx-auto">
                    <div className="text-center mb-8">
                        <div className="bg-primary/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                            <ShoppingCart className="w-8 h-8 text-primary" />
                        </div>
                        <h1 className="text-3xl font-bold text-foreground mb-2">
                            Order summary  </h1>
                        <p className="text-muted-foreground">Check your order details</p>
                    </div>
                    <Card className="card-service p-8">
                        <h3 className="text-lg font-semibold text-foreground flex items-center space-x-2">
                            <ShoppingBasketIcon className="w-5 h-5 text-primary" />
                            <span>Cloth & Slot details</span>
                        </h3>

                        <div className='flex flex-col space-y-2 mt-3 '>
                            <div className='flex justify-between'>
                                <div>
                                    No of Cloths
                                </div>
                                <div>
                                    {orderdetails?.otherdetails?.totalcloths} Nos
                                </div>
                            </div>
                            <div className='flex justify-between'>
                                <div>
                                    Selected Slot
                                </div>
                                <div>
                                    {orderdetails?.otherdetails?.timeslot}
                                </div>
                            </div>
                            <div className='flex justify-between'>
                                <div>
                                    Payment Type
                                </div>
                                <div>
                                    {orderdetails?.otherdetails?.paymenttype}
                                </div>
                            </div>
                            <div className='flex justify-between'>
                                <div>
                                    Total Amount
                                </div>
                                <div>
                                    ₹{orderdetails?.otherdetails?.totalamount}
                                </div>
                            </div>
                        </div>


                    </Card>

                    <Card className="card-service p-8 my-5">
                        <h3 className="text-lg mb-5 font-semibold text-foreground flex items-center space-x-2">
                            <Truck className="w-5 h-5 text-primary" />
                            <span>Delivery details</span>
                        </h3>
                        <div className='flex flex-col space-y-3 mx-1'>
                            <div className='font-medium flex  text-xl items-baseline'>
                                <User className="w-5 h-5 text-primary mr-2" /> {orderdetails?.userdetails?.name}
                            </div>
                            <div className=' flex   items-baseline'>
                                <Phone className="w-5 h-5 text-primary mr-2" />
                                {orderdetails?.userdetails?.phoneno}
                            </div>
                            <div>

                                <div className=' flex  mb-1 items-baseline'>
                                    <MapPin className="w-5 h-5 text-primary mr-2" />
                                    <div className='font-semibold'>
                                        Address
                                    </div>
                                </div>
                                <p className='mx-5'>
                                    {orderdetails?.userdetails?.houseno},
                                    {orderdetails?.userdetails?.streetname},
                                    {orderdetails?.userdetails?.area},
                                    <p>
                                        {orderdetails?.userdetails?.city} -
                                        {orderdetails?.userdetails?.pincode}
                                    </p>
                                </p>
                            </div>



                        </div>


                        <div className="pt-12">

                            <Button onClick={handleSubmit}
                                type="submit"
                                className="btn-hero w-full text-lg py-4"
                                disabled={isLoading}

                            >
                                {isLoading ? 'Saving...' : 'Place order'}
                            </Button>

                        </div>

                    </Card>

                </div>
            </div>
        </div>
    );
};

export default Ordersummary