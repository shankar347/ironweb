import React, { useState, useEffect } from 'react';
import { Calendar, Truck, Sparkles, Package } from 'lucide-react';

export default function HowItWorks() {
    const [activeStep, setActiveStep] = useState(0);
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        setIsVisible(true);
        const interval = setInterval(() => {
            setActiveStep((prev) => (prev + 1) % 4);
        }, 3000);
        return () => clearInterval(interval);
    }, []);

    const steps = [
        {
            icon: Calendar,
            number: "01",
            title: "Book Online",
            description: "Select your service and schedule pickup time through our easy-to-use platform",
            color: "from-blue-500 to-cyan-500",
            delay: "0"
        },
        {
            icon: Truck,
            number: "02",
            title: "We Pickup",
            description: "Our professional agent collects your clothes from your doorstep at your convenience",
            color: "from-purple-500 to-pink-500",
            delay: "100"
        },
        {
            icon: Sparkles,
            number: "03",
            title: "Expert Steaming",
            description: "Premium steaming and pressing with state-of-the-art equipment at our facility",
            color: "from-orange-500 to-red-500",
            delay: "200"
        },
        {
            icon: Package,
            number: "04",
            title: "Express Delivery",
            description: "Perfectly pressed and neatly packed clothes delivered within 3 hours",
            color: "from-green-500 to-emerald-500",
            delay: "300"
        }
    ];

    return (
        <section className="relative py-24 bg-gradient-to-br from-slate-50 via-white to-blue-50 overflow-hidden">
            {/* Animated Background Elements */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-20 left-10 w-72 h-72 bg-blue-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse"></div>
                <div className="absolute top-40 right-10 w-96 h-96 bg-purple-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse" style={{ animationDelay: '1s' }}></div>
                <div className="absolute -bottom-20 left-1/2 w-96 h-96 bg-pink-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse" style={{ animationDelay: '2s' }}></div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                {/* Header */}
                <div className={`text-center mb-20 transition-all duration-1000 transform ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>

                    <h2 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-slate-900 via-blue-900 to-slate-900 bg-clip-text text-transparent mb-6">
                        How It Works
                    </h2>
                    <p className="text-xl text-slate-600 max-w-2xl mx-auto">
                        Experience seamless service with our simple 4-step process designed for your convenience
                    </p>
                </div>

                {/* Steps Grid */}
                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
                    {steps.map((step, index) => {
                        const Icon = step.icon;
                        const isActive = activeStep === index;

                        return (
                            <div
                                key={index}
                                className={`relative group cursor-pointer transition-all duration-700 transform ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-20 opacity-0'
                                    }`}
                                style={{ transitionDelay: `${step.delay}ms` }}
                                onMouseEnter={() => setActiveStep(index)}
                            >
                                {/* Connecting Line */}
                                {index < 3 && (
                                    <div className="hidden lg:block absolute top-20 left-full w-full h-0.5 bg-gradient-to-r from-slate-300 to-transparent -z-10">
                                        <div
                                            className={`h-full bg-gradient-to-r ${step.color} transition-all duration-1000 ${activeStep >= index ? 'w-full' : 'w-0'
                                                }`}
                                        />
                                    </div>
                                )}

                                {/* Card */}
                                <div
                                    className={`relative bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 border-2 ${isActive ? 'border-blue-400 scale-105' : 'border-transparent'
                                        }`}
                                >
                                    {/* Number Badge */}
                                    <div className="absolute -top-4 -right-4 w-12 h-12 bg-gradient-to-br from-slate-800 to-slate-600 rounded-full flex items-center justify-center text-white font-bold text-lg shadow-xl">
                                        {step.number}
                                    </div>

                                    {/* Icon Container */}
                                    <div className={`relative w-20 h-20 mb-6 rounded-2xl bg-gradient-to-br ${step.color} p-0.5 transition-all duration-500 ${isActive ? 'scale-110 rotate-6' : ''
                                        }`}>
                                        <div className="w-full h-full bg-white rounded-2xl flex items-center justify-center">
                                            <Icon className={`w-10 h-10 transition-all duration-500 ${isActive ? 'scale-110' : ''
                                                }`}
                                                style={{
                                                    background: `linear-gradient(135deg, ${step.color.split(' ')[0].replace('from-', '')}, ${step.color.split(' ')[1].replace('to-', '')})`,
                                                    WebkitBackgroundClip: 'text',
                                                    WebkitTextFillColor: 'transparent',
                                                    backgroundClip: 'text'
                                                }}
                                            />
                                        </div>
                                    </div>

                                    {/* Content */}
                                    <h3 className="text-2xl font-bold text-slate-900 mb-3 group-hover:text-blue-600 transition-colors">
                                        {step.title}
                                    </h3>
                                    <p className="text-slate-600 leading-relaxed">
                                        {step.description}
                                    </p>

                                    {/* Hover Effect Line */}
                                    <div className={`absolute bottom-0 left-0 h-1 bg-gradient-to-r ${step.color} transition-all duration-500 rounded-full ${isActive ? 'w-full' : 'w-0 group-hover:w-full'
                                        }`} />
                                </div>
                            </div>
                        );
                    })}
                </div>


            </div>
        </section>
    );
}