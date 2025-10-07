import React, { useState, useEffect } from 'react';
import { Star, Quote, ChevronLeft, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function TestimonialsSection() {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isAutoPlaying, setIsAutoPlaying] = useState(true);
    const [isVisible, setIsVisible] = useState(false);

    const testimonials = [
        {
            name: "Priya Sharma",
            role: "Marketing Manager",
            rating: 5,
            review: "Excellent service! My clothes came back perfectly pressed and the delivery was super fast. The attention to detail is remarkable. Highly recommended!",
            avatar: "PS",
            color: "from-blue-400 to-blue-600"
        },
        {
            name: "Rajesh Kumar",
            role: "Business Owner",
            rating: 5,
            review: "Amazing quality and very convenient. No more worrying about ironing - Steamer takes care of everything! Their professional team is truly outstanding.",
            avatar: "RK",
            color: "from-sky-400 to-blue-500"
        },
        {
            name: "Meera Patel",
            role: "Software Engineer",
            rating: 5,
            review: "Professional service with neat packaging. The pricing is very reasonable and the staff is courteous. I'm impressed by their efficiency and care.",
            avatar: "MP",
            color: "from-blue-500 to-indigo-600"
        },
        {
            name: "Arjun Mehta",
            role: "Doctor",
            rating: 5,
            review: "Best steaming service in the city! They handle my formal wear with such precision. The 3-hour delivery promise is always kept. Absolutely fantastic!",
            avatar: "AM",
            color: "from-cyan-400 to-blue-600"
        },
        {
            name: "Ananya Desai",
            role: "Fashion Designer",
            rating: 5,
            review: "As someone who works with fabrics daily, I'm extremely particular about garment care. Steamer exceeds my expectations every single time. Their expertise shows!",
            avatar: "AD",
            color: "from-blue-400 to-indigo-500"
        },
        {
            name: "Vikram Singh",
            role: "Corporate Executive",
            rating: 5,
            review: "Reliable and efficient! I travel frequently for work, and Steamer ensures my suits are always presentation-ready. Their pickup and delivery system is seamless.",
            avatar: "VS",
            color: "from-sky-500 to-blue-700"
        },
        {
            name: "Kavya Reddy",
            role: "Interior Designer",
            rating: 5,
            review: "The quality of steaming is exceptional. My delicate fabrics are handled with care, and everything comes back looking brand new. Worth every penny!",
            avatar: "KR",
            color: "from-blue-300 to-blue-600"
        },
        {
            name: "Sanjay Gupta",
            role: "Restaurant Owner",
            rating: 5,
            review: "I use Steamer for all my staff uniforms. Bulk orders are handled professionally, and the turnaround time is impressive. Great service for businesses!",
            avatar: "SG",
            color: "from-indigo-400 to-blue-600"
        },
        {
            name: "Deepika Iyer",
            role: "Lawyer",
            rating: 5,
            review: "Punctual, professional, and perfect results every time. The convenience of doorstep service saves me so much time. Steamer is now my go-to solution!",
            avatar: "DI",
            color: "from-blue-500 to-cyan-600"
        },
        {
            name: "Aditya Nair",
            role: "Photographer",
            rating: 5,
            review: "Outstanding attention to detail! They even folded my clothes in a specific way when I requested it. Customer service is top-notch. Highly professional team!",
            avatar: "AN",
            color: "from-sky-400 to-indigo-600"
        }
    ];

    const itemsPerPage = 3;
    const totalPages = Math.ceil(testimonials.length / itemsPerPage);

    useEffect(() => {
        setIsVisible(true);
        if (isAutoPlaying) {
            const interval = setInterval(() => {
                setCurrentIndex((prev) => (prev + 1) % totalPages);
            }, 5000);
            return () => clearInterval(interval);
        }
    }, [isAutoPlaying, totalPages]);

    const nextSlide = () => {
        setCurrentIndex((prev) => (prev + 1) % totalPages);
        setIsAutoPlaying(false);
    };

    const prevSlide = () => {
        setCurrentIndex((prev) => (prev - 1 + totalPages) % totalPages);
        setIsAutoPlaying(false);
    };

    const goToSlide = (index) => {
        setCurrentIndex(index);
        setIsAutoPlaying(false);
    };

    const displayedTestimonials = testimonials.slice(
        currentIndex * itemsPerPage,
        currentIndex * itemsPerPage + itemsPerPage
    );

    return (
        <section className="relative py-24 bg-gradient-to-br from-blue-50 via-white to-sky-50 overflow-hidden">
            {/* Animated Background */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-20 left-10 w-96 h-96 bg-blue-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse"></div>
                <div className="absolute bottom-20 right-10 w-96 h-96 bg-sky-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse" style={{ animationDelay: '1s' }}></div>
                <div className="absolute top-1/2 left-1/2 w-96 h-96 bg-indigo-300 rounded-full mix-blend-multiply filter blur-3xl opacity-15 animate-pulse" style={{ animationDelay: '2s' }}></div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                {/* Header */}
                <div className={`text-center mb-16 transition-all duration-1000 transform ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>

                    <h2 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-700 bg-clip-text text-transparent mb-6">
                        What Our Customers Say
                    </h2>

                    {/* Rating Summary */}
                    <div className="flex items-center justify-center space-x-4 mb-4">
                        <div className="flex space-x-1">
                            {[...Array(5)].map((_, i) => (
                                <Star key={i} className="w-7 h-7 fill-blue-500 text-blue-500" />
                            ))}
                        </div>
                        <span className="text-2xl font-bold text-blue-700">4.9/5</span>
                    </div>
                    <p className="text-slate-600 text-lg">
                        Based on 500+ verified reviews from happy customers
                    </p>
                </div>

                {/* Testimonials Slider */}
                <div className="relative">
                    {/* Navigation Buttons */}
                    <button
                        onClick={prevSlide}
                        className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 z-20 bg-gradient-to-br from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white p-4 rounded-full shadow-2xl transition-all duration-300 hover:scale-110"
                        aria-label="Previous testimonials"
                    >
                        <ChevronLeft className="w-6 h-6" />
                    </button>
                    <button
                        onClick={nextSlide}
                        className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 z-20 bg-gradient-to-br from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white p-4 rounded-full shadow-2xl transition-all duration-300 hover:scale-110"
                        aria-label="Next testimonials"
                    >
                        <ChevronRight className="w-6 h-6" />
                    </button>

                    {/* Cards Container */}
                    <div className="overflow-hidden px-2">
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {displayedTestimonials.map((testimonial, index) => (
                                <div
                                    key={`${currentIndex}-${index}`}
                                    className={`transition-all duration-700 transform ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
                                        }`}
                                    style={{ transitionDelay: `${index * 100}ms` }}
                                >
                                    <div className="relative bg-white rounded-3xl p-8 shadow-xl hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 border border-blue-100 group h-full">
                                        {/* Quote Icon */}
                                        <div className="absolute -top-4 -left-4 w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center shadow-xl transform group-hover:rotate-12 transition-transform duration-500">
                                            <Quote className="w-6 h-6 text-white" />
                                        </div>

                                        {/* Avatar */}
                                        <div className="flex items-center space-x-4 mb-6 mt-4">
                                            <div className={`w-16 h-16 bg-gradient-to-br ${testimonial.color} rounded-2xl flex items-center justify-center text-white font-bold text-xl shadow-lg transform group-hover:scale-110 transition-transform duration-500`}>
                                                {testimonial.avatar}
                                            </div>
                                            <div>
                                                <h4 className="text-xl font-bold text-slate-900">{testimonial.name}</h4>
                                                <p className="text-slate-600 text-sm">{testimonial.role}</p>
                                            </div>
                                        </div>

                                        {/* Stars */}
                                        <div className="flex space-x-1 mb-4">
                                            {[...Array(testimonial.rating)].map((_, i) => (
                                                <Star key={i} className="w-5 h-5 fill-blue-500 text-blue-500" />
                                            ))}
                                        </div>

                                        {/* Review Text */}
                                        <p className="text-slate-700 leading-relaxed text-base">
                                            "{testimonial.review}"
                                        </p>

                                        {/* Decorative Element */}
                                        <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-blue-400 via-blue-500 to-sky-500 rounded-b-3xl transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500"></div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Pagination Dots */}
                    <div className="flex justify-center items-center space-x-3 mt-12">
                        {[...Array(totalPages)].map((_, index) => (
                            <button
                                key={index}
                                onClick={() => goToSlide(index)}
                                className={`transition-all duration-300 rounded-full ${currentIndex === index
                                    ? 'w-12 h-3 bg-gradient-to-r from-blue-500 to-sky-500'
                                    : 'w-3 h-3 bg-blue-200 hover:bg-blue-300'
                                    }`}
                                aria-label={`Go to slide ${index + 1}`}
                            />
                        ))}
                    </div>
                </div>

                {/* CTA */}
                <div className={`text-center mt-16 transition-all duration-1000 delay-300 transform ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
                    }`}>
                    <p className="text-slate-600 text-lg mb-6">
                        Join our community of satisfied customers
                    </p>
                    <Link to={'/customer/book-slot'}>
                        <button className="bg-gradient-to-r from-blue-500 via-blue-600 to-sky-500 text-white px-10 py-4 rounded-full font-bold text-lg shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-300 hover:from-blue-600 hover:via-blue-700 hover:to-sky-600">
                            Start Your Order Today
                        </button>
                    </Link>

                </div>
            </div>
        </section>
    );
}