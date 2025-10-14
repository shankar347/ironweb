import { useState, useRef, useContext, useEffect } from 'react';
import { Button } from '../../components/ui/button';
import { Card } from '../../components/ui/card';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { User, Lock } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { SteamContext } from '../../hooks/steamcontext';
import { toast } from "react-toastify";
import { API_URL } from '../../hooks/tools';

const Agentemail = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [isLoading1, setIsLoading1] = useState(false);

    const steamcontext = useContext(SteamContext)

    const navigate = useNavigate()

    const { formData, setFormData, setUser } = steamcontext
    const [otp, setOtp] = useState(['', '', '', '', '', '']);
    const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

    const [timer, setTimer] = useState(60); // 60 seconds countdown
    const [canResend, setCanResend] = useState(false);

    // Countdown effect
    useEffect(() => {
        if (timer <= 0) {
            setCanResend(true);
            return;
        }

        const interval = setInterval(() => {
            setTimer((prev) => prev - 1);
        }, 1000);

        return () => clearInterval(interval);
    }, [timer]);

    const handleOtpChange = (index: number, value: string) => {
        if (value.length > 1) return;

        const newOtp = [...otp];
        newOtp[index] = value;
        setOtp(newOtp);

        // Auto-focus next input
        if (value && index < 5) {
            inputRefs.current[index + 1]?.focus();
        }
    };

    const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
        // Handle backspace
        if (e.key === 'Backspace' && !otp[index] && index > 0) {
            inputRefs.current[index - 1]?.focus();
        }
    };


    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        const otpValue = otp.join('');

        const res = await fetch(`${API_URL}/user/login`, {
            method: 'POST',
            headers: {
                'content-type': 'application/json'
            },
            body: JSON.stringify({
                email: formData?.email,
                otp: otpValue
            }),
            credentials: 'include',

        })

        const data = await res.json()

        if (data?.error) {
            toast.error(data?.error)

            setIsLoading(false);
            return
        }



        // Simulate API call
        setTimeout(() => {
            setIsLoading(false);
            toast.success(data?.message)
            setUser(data?.data)
            navigate('/agent/home')
        }, 2000);
    };

    const handlemailSubmit = async () => {
        setIsLoading1(true);
        setCanResend(false);
        setTimer(60);

        const res = await fetch(`${API_URL}/user/generatemailotp`, {
            method: 'POST',
            headers: {
                'content-type': 'application/json'
            },
            body: JSON.stringify({ formdata: formData, isagentlogin: true }),
        });

        const data = await res.json();

        if (data?.error) {
            setIsLoading1(false);
            toast.error(data?.error);
            return;
        }

        setTimeout(() => {
            setIsLoading1(false);
            toast.success(data?.message);
            navigate('/agent/emailotp');
        }, 2000);
    };


    if (!formData?.email) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-secondary/20">
                <div className="text-center">
                    <h1 className="text-4xl font-bold text-red-600 mb-4">Error</h1>
                    <p className="text-lg text-muted-foreground">
                        No email found! Please go back to the login page.
                    </p>
                    <Link
                        to="/customer/login"
                        className="mt-4 inline-block text-primary hover:underline font-semibold"
                    >
                        Go Back
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-secondary/20 py-20">
            <div className="container mx-auto px-4">
                <div className="max-w-md mx-auto">
                    <div className="text-center mb-8">
                        <div className="bg-primary/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                            <User className="w-8 h-8 text-success" />
                        </div>
                        <h1 className="text-3xl font-bold text-foreground mb-2">Agent Sign In</h1>
                        <p className="text-muted-foreground">Welcome back to Steamer</p>
                    </div>

                    <Card className="card-service p-8">
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="space-y-2">

                                <p className='mb-5'>OTP sent to <strong className='font-semibold'> {formData?.email}</strong> </p>

                                <Label htmlFor="otp"
                                    className='text-md font-bold '>Enter OTP</Label>
                                <div className="flex justify-center gap-3">
                                    {otp.map((digit, index) => (
                                        <input
                                            key={index}
                                            ref={(el) => (inputRefs.current[index] = el)}
                                            type="text"
                                            inputMode="numeric"
                                            maxLength={1}
                                            value={digit}
                                            onChange={(e) =>
                                                handleOtpChange(index, e.target.value.replace(/[^0-9]/g, ""))
                                            }
                                            onKeyDown={(e) => handleKeyDown(index, e)}
                                            className="
                                            w-7 h-7 md:w-12 md:h-12
                                            lg:w-12 lg:w-12 sm:w-12 sm:h-12 
                                             text-center text-xl font-semibold border-2 rounded-lg focus:border-primary focus:ring-2 focus:ring-primary/20"
                                            required
                                        />
                                    ))}
                                </div>
                            </div>

                            <Button
                                type="submit"
                                className="bg-success
                                hover:bg-success/90 w-full mt-5 text-lg py-5"
                                disabled={isLoading}
                            >
                                {isLoading ? 'Signing In...' : 'Sign In'}
                            </Button>

                            <div className="text-center">
                                <p className="text-muted-foreground">
                                    Didn't get an OTP{' '}
                                    <span
                                        onClick={() => {
                                            if (canResend) {
                                                setOtp(['', '', '', '', '', ''])
                                                handlemailSubmit()
                                            };
                                        }}
                                        className={`text-primary cursor-pointer hover:underline font-semibold ${!canResend ? 'opacity-50 cursor-not-allowed' : ''
                                            }`}
                                    >
                                        {canResend ? 'Resend' : `Resend  (00:${timer.toString().padStart(2, '0')})`}
                                    </span>
                                </p>
                            </div>
                        </form>
                    </Card>
                </div>
            </div>
        </div>
    );
};

export default Agentemail;