import { useContext, useState, useEffect, useRef } from 'react';
import { Button } from '../../components/ui/button';
import { Card } from '../../components/ui/card';
import { Input } from '../../components/ui/input';
import { ShirtIcon, ShoppingCart, Clock, Wallet, CreditCard, HandCoinsIcon, ListOrdered, Plus, Minus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { toast } from "react-toastify";
import { SteamContext } from '../../hooks/steamcontext';
import Select from "react-select";

const BookSlot = () => {
    const [isLoading, setIsLoading] = useState(false);
    const steamcontext = useContext(SteamContext);
    const [selectedSlot, setSelectedSlot] = useState<string | null>(null);
    const [totalcloths, setTotalcloths] = useState('1');
    const { formData, setFormData, orderdetails, setorderdetails } = steamcontext;
    const [isinputon, setisinputon] = useState(false);
    const [paymenttype, selectpaymenttype] = useState('');
    const [totalamount, settotalamount] = useState(0);

    const [errors, setErrors] = useState({
        totalcloths: "",
        selectedSlot: "",
        paymenttype: "",
    });

    // Refs for scrolling to missing sections
    const clothRef = useRef<HTMLDivElement | null>(null);
    const slotRef = useRef<HTMLDivElement | null>(null);
    const paymentRef = useRef<HTMLDivElement | null>(null);

    const navigate = useNavigate();

    let ironprice = 15;
    let deliveryprice = 20;
    let handlingcharge = 10;

    const buttonValues = ['1', '3', '6', '9', '10', '12', '15', '18', '20'];



    useEffect(() => {
        window.scrollTo({ top: 0, behavior: "smooth" });
    }, []);

    useEffect(() => {
        settotalamount(handlingcharge + deliveryprice + (Number(totalcloths) * ironprice));
    }, [totalcloths]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        let newErrors = { totalcloths: "", selectedSlot: "", paymenttype: "" };
        let firstErrorRef: HTMLDivElement | null = null;

        if (!totalcloths) {
            newErrors.totalcloths = "* Please enter the number of cloths";
            firstErrorRef = firstErrorRef || clothRef.current;
        }
        if (!selectedSlot) {
            newErrors.selectedSlot = "* Please select a time slot";
            firstErrorRef = firstErrorRef || slotRef.current;
        }
        if (!paymenttype) {
            newErrors.paymenttype = "* Please select a payment type";
            firstErrorRef = firstErrorRef || paymentRef.current;
        }

        setErrors(newErrors);

        if (firstErrorRef) {
            firstErrorRef.scrollIntoView({ behavior: "smooth", block: "center" });
            toast.error("Please fill all required fields before proceeding");
            return;
        }

        const updatedOrderDetails = {
            ...orderdetails,
            otherdetails: {
                totalcloths,
                timeslot: selectedSlot,
                paymenttype,
                totalamount
            }
        };

        setorderdetails(updatedOrderDetails);
        localStorage.setItem('orderdetails', JSON.stringify(updatedOrderDetails));
        navigate('/customer/confirmaddress');
    };

    const Timeslots = ['6AM - 9AM', '9AM - 12PM', '12PM - 3PM', '3PM - 6PM'];
    const options = Timeslots.map((slot) => ({ value: slot, label: slot }));

    return (
        <div className="min-h-screen bg-secondary/20 py-20">
            <div className="container mx-auto px-4">
                <div className="max-w-2xl mx-auto">
                    <div className="text-center mb-8">
                        <div className="bg-primary/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                            <ShirtIcon className="w-8 h-8 text-primary" />
                        </div>
                        <h1 className="text-3xl font-bold text-foreground mb-2">
                            Book Iron Slot
                        </h1>
                        <p className="text-muted-foreground">
                            Select your preferred slot and quantity
                        </p>
                    </div>

                    {/* Cloth Selection */}
                    <Card ref={clothRef} className="card-service p-8">
                        <h3 className="text-lg font-semibold text-foreground flex items-center space-x-2">
                            <ShoppingCart className="w-5 h-5 text-primary" />
                            <span>Select No of Cloths</span>
                        </h3>

                        <div className='flex justify-around flex-wrap'>
                            {buttonValues.map((btn) => (
                                <Button
                                    key={btn}
                                    size={'lg'}
                                    onClick={() => setTotalcloths(btn)}
                                    className={`hover:bg-gray-100 m-1 my-5 lg:m-5 md:m-5 sm:m-5
                    hover:text-primary hover:border-2 min-w-8 hover:border-primary
                    ${Number(totalcloths) === Number(btn) && 'bg-gray-100 text-primary border-2 border-primary'}`}
                                >
                                    {btn} cloths
                                </Button>
                            ))}
                        </div>

                        <div className='flex justify-between items-baseline'>
                            <div className='ml-10 flex items-baseline space-x-2'>
                                <Button
                                    className='w-8 h-8'
                                    onClick={() => setTotalcloths((prev) => String(Math.max(0, Number(prev) - 1)))}
                                >
                                    <Minus className='w-12 h-12 text-white text-3xl' color='white' />
                                </Button>
                                <div className='font-bold'>{totalcloths}</div>
                                <Button
                                    className='w-8 h-8'
                                    onClick={() => setTotalcloths((prev) => String(Number(prev) + 1))}
                                >
                                    <Plus className='w-12 h-12 text-white text-3xl' color='white' />
                                </Button>
                            </div>
                            <div
                                onClick={() => setisinputon(true)}
                                className='font-medium text-primary text-sm text-right mr-10 cursor-pointer'
                            >
                                Have more than 20?
                            </div>
                        </div>

                        {isinputon && (
                            <div className='flex md:w-[88%] lg:w-[88%] sm:w-[88%] w-[100%] h-12 mx-auto mt-5'>
                                <Input
                                    id="cloth"
                                    name="cloth"
                                    type="text"
                                    placeholder="Enter no of cloths"
                                    className="pl-5 h-full rounded-r-none w-[90%]"
                                    value={totalcloths}
                                    onChange={(e) => setTotalcloths(e.target.value)}
                                    required
                                />
                                <Button className='min-w-[20%] h-full rounded-l-none'>
                                    Enter
                                </Button>
                            </div>
                        )}

                        {errors.totalcloths && (
                            <p className="text-red-500 text-sm mt-2">{errors.totalcloths}</p>
                        )}
                    </Card>

                    {/* Slot Selection */}
                    <Card ref={slotRef} className="card-service p-8 my-5">
                        <h3 className="text-lg mb-5 font-semibold text-foreground flex items-center space-x-2">
                            <Clock className="w-5 h-5 text-primary" />
                            <span>Select Time Slots</span>
                        </h3>

                        <Select
                            options={options}
                            value={options.find((opt) => opt.value === selectedSlot) || null}
                            onChange={(selected) => setSelectedSlot(selected?.value || null)}
                            placeholder="Book your preferred slot"
                            className="w-full"
                            styles={{
                                control: (base) => ({
                                    ...base,
                                    borderRadius: "0.5rem",
                                    borderColor: "#D1D5DB",
                                    padding: "0.25rem",
                                }),
                            }}
                        />
                        {errors.selectedSlot && (
                            <p className="text-red-500 text-sm mt-2">{errors.selectedSlot}</p>
                        )}
                    </Card>

                    {/* Payment Section */}
                    <Card ref={paymentRef} className="card-service p-8 my-5">
                        <h3 className="text-lg mb-5 font-semibold text-foreground flex items-center space-x-2">
                            <Wallet className="w-5 h-5 text-primary" />
                            <span>Select Payment Type</span>
                        </h3>

                        <label className="flex items-center mb-4 cursor-pointer">
                            <input
                                type="radio"
                                name="payment"
                                value="online"
                                className="hidden peer"
                                checked={paymenttype === 'online payment'}
                                onChange={() => selectpaymenttype('online payment')}
                            />
                            <div className="w-5 h-5 mx-3 rounded-full border border-gray-400 peer-checked:border-primary peer-checked:bg-primary flex items-center justify-center">
                                <div className="w-2 h-2 rounded-full bg-white"></div>
                            </div>
                            <CreditCard className="w-5 h-5 mr-1 text-primary" />
                            <span>Online Payment</span>
                        </label>

                        <label className="flex items-center cursor-pointer">
                            <input
                                type="radio"
                                name="payment"
                                value="cod"
                                className="hidden peer"
                                checked={paymenttype === 'cash on delivery'}
                                onChange={() => selectpaymenttype('cash on delivery')}
                            />
                            <div className="w-5 h-5 mx-3 rounded-full border border-gray-400 peer-checked:border-primary peer-checked:bg-primary flex items-center justify-center">
                                <div className="w-2 h-2 rounded-full bg-white"></div>
                            </div>
                            <HandCoinsIcon className="w-5 h-5 mr-1 text-primary" />
                            <span>Cash on Delivery</span>
                        </label>

                        {errors.paymenttype && (
                            <p className="text-red-500 text-sm mt-2">{errors.paymenttype}</p>
                        )}
                    </Card>

                    {/* Payment Summary */}
                    <Card className="card-service p-8">
                        <h3 className="text-lg font-semibold text-foreground flex items-center space-x-2">
                            <ListOrdered className="w-5 h-5 text-primary" />
                            <span>Payment Summary</span>
                        </h3>

                        <div className='flex flex-col font-normal space-y-3 md:mx-10 sm:mx-10 lg:mx-10 mx-1 my-5'>
                            <div className='flex justify-between'>
                                <div>{totalcloths || 0} Cloths × ₹{ironprice}</div>
                                <div>₹{Number(totalcloths) * ironprice}</div>
                            </div>
                            <div className='flex justify-between'>
                                <div>Delivery Charges</div>
                                <div>₹{deliveryprice}</div>
                            </div>
                            <div className='flex justify-between pb-5'>
                                <div>Handling Charges</div>
                                <div>₹{handlingcharge}</div>
                            </div>
                            <div className='w-full h-[2px] bg-gray-200'></div>
                            <div className='flex justify-between font-medium'>
                                <div>Total Amount</div>
                                <div>₹{totalamount}</div>
                            </div>
                            <div className='w-full h-[2px] bg-gray-200'></div>
                        </div>

                        <div className="pt-4">
                            <Button
                                onClick={handleSubmit}
                                type="submit"
                                className="btn-hero w-full text-lg py-4"
                                disabled={isLoading}
                            >
                                {isLoading ? 'Saving...' : 'Proceed & Confirm Address'}
                            </Button>
                        </div>
                    </Card>
                </div>
            </div>
        </div>
    );
};

export default BookSlot;
