import React, { useState, useEffect } from 'react';
import { Star, Quote, ChevronLeft, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function TestimonialsSection() {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isAutoPlaying, setIsAutoPlaying] = useState(true);
    const [isVisible, setIsVisible] = useState(false);

 const testimonials = [
  {
    name: "Karthik Subramanian",
    role: "Software Engineer",
    rating: 5,
    review: "Steamer service is excellent! My office clothes always come back neat and fresh. Pickup and delivery are always on time. Super convenient for IT professionals.",
    avatar: "KS",
    color: "from-blue-400 to-blue-600"
  },
  {
    name: "Lakshmi Priya",
    role: "Teacher",
    rating: 5,
    review: "I’m really happy with Steamer. My sarees and cotton dresses look perfect after steaming. They handle everything with so much care.",
    avatar: "LP",
    color: "from-sky-400 to-blue-500"
  },
  {
    name: "Arun Raj",
    role: "Entrepreneur",
    rating: 5,
    review: "Best steaming service in Chennai! Their team is professional and the quality is unbeatable. My suits and blazers always look brand new.",
    avatar: "AR",
    color: "from-blue-500 to-indigo-600"
  },
  {
    name: "Divya Shankar",
    role: "Doctor",
    rating: 4,
    review: "As a doctor, I hardly have time for laundry. Steamer makes life easy. My coats and uniforms are always spotless and crisp. Highly reliable!",
    avatar: "DS",
    color: "from-cyan-400 to-blue-600"
  },
  {
    name: "Vignesh Ramesh",
    role: "Photographer",
    rating: 5,
    review: "Their steaming is perfect for my shoot costumes. Clothes stay wrinkle-free and ready for clients. Love the prompt delivery service.",
    avatar: "VR",
    color: "from-blue-400 to-indigo-500"
  },
  {
    name: "Meena Karthik",
    role: "Homemaker",
    rating: 5,
    review: "Very satisfied! My husband’s office wear and kids’ uniforms look amazing. The packaging is neat and delivery is always on time.",
    avatar: "MK",
    color: "from-sky-500 to-blue-700"
  },
  {
    name: "Saravanan Babu",
    role: "Corporate Executive",
    rating: 4,
    review: "Steamer’s pickup and delivery are seamless. I get perfectly pressed clothes every single time. Highly professional and reliable!",
    avatar: "SB",
    color: "from-blue-300 to-blue-600"
  },
  {
    name: "Nithya Raj",
    role: "Fashion Designer",
    rating: 4,
    review: "As a designer, I trust only Steamer with my fabrics. They handle delicate materials like silk and chiffon perfectly. Excellent service!",
    avatar: "NR",
    color: "from-indigo-400 to-blue-600"
  },
  {
    name: "Pradeep Kumar",
    role: "Bank Manager",
    rating: 5,
    review: "Steamer’s quality is top-class. Shirts and trousers come back looking sharp. It’s a time-saver for working people like me.",
    avatar: "PK",
    color: "from-blue-500 to-cyan-600"
  },
  {
    name: "Sowmya Suresh",
    role: "Architect",
    rating: 4,
    review: "My clothes are always handled with care. The finish is excellent. The convenience of home delivery makes it even better.",
    avatar: "SS",
    color: "from-sky-400 to-indigo-600"
  },
  {
    name: "Manikandan Selvam",
    role: "Hotel Owner",
    rating: 5,
    review: "I use Steamer for my staff uniforms. They manage bulk orders perfectly and the results are consistently good. Highly recommended!",
    avatar: "MS",
    color: "from-blue-400 to-blue-600"
  },
  {
    name: "Kavitha Arun",
    role: "College Professor",
    rating: 4,
    review: "I love how neat my cotton sarees look after using Steamer. The fabric feels fresh and crisp. Their attention to detail is impressive.",
    avatar: "KA",
    color: "from-sky-400 to-blue-500"
  },
  {
    name: "Ravi Chandran",
    role: "Businessman",
    rating: 5,
    review: "The best thing about Steamer is their speed. I always get my clothes back within a few hours and they look perfect. Totally worth it!",
    avatar: "RC",
    color: "from-blue-500 to-indigo-600"
  },
  {
    name: "Anitha Balaji",
    role: "Interior Designer",
    rating: 5,
    review: "Steamer handles delicate fabrics beautifully. Even my designer dresses come back looking flawless. I trust them completely.",
    avatar: "AB",
    color: "from-cyan-400 to-blue-600"
  },
  {
    name: "Gokul Krishna",
    role: "Student",
    rating: 4,
    review: "Affordable and fast! I use Steamer before presentations and interviews. My clothes always look professional and neat.",
    avatar: "GK",
    color: "from-blue-400 to-indigo-500"
  },
  {
    name: "Sangeetha Raj",
    role: "Event Planner",
    rating: 5,
    review: "I depend on Steamer for all my event outfits. They understand urgency and always deliver on time. Fantastic service!",
    avatar: "SR",
    color: "from-sky-500 to-blue-700"
  },
  {
    name: "Hari Prasad",
    role: "Engineer",
    rating: 5,
    review: "Clothes are handled with care and look professionally finished. I really appreciate their punctuality and smooth service.",
    avatar: "HP",
    color: "from-blue-300 to-blue-600"
  },
  {
    name: "Revathi Moorthy",
    role: "HR Manager",
    rating: 5,
    review: "I tried Steamer once and never looked back. The results are consistent and the service is hassle-free. Excellent experience!",
    avatar: "RM",
    color: "from-indigo-400 to-blue-600"
  },
  {
    name: "Senthil Kumar",
    role: "Business Consultant",
    rating: 5,
    review: "I’ve recommended Steamer to all my colleagues. My formals look perfect every time. Truly a professional service!",
    avatar: "SK",
    color: "from-blue-500 to-cyan-600"
  },
  {
    name: "Janani R",
    role: "Graphic Designer",
    rating: 5,
    review: "Their service is quick, neat, and affordable. I love how my clothes are packed and returned. Definitely Chennai’s best!",
    avatar: "JR",
    color: "from-sky-400 to-indigo-600"
  },
  {
    name: "Balaji Narayan",
    role: "Restaurant Manager",
    rating: 5,
    review: "Steamer handles our restaurant uniforms with care. Bulk orders are completed without delay. Great experience!",
    avatar: "BN",
    color: "from-blue-400 to-blue-600"
  },
  {
    name: "Gayathri Vishnu",
    role: "Lawyer",
    rating: 5,
    review: "The crisp finish of my formal sarees is amazing. Pickup and delivery are always prompt. I really appreciate their professionalism.",
    avatar: "GV",
    color: "from-sky-400 to-blue-500"
  },
  {
    name: "Kiran Raj",
    role: "Fitness Trainer",
    rating: 5,
    review: "My sportswear and uniforms are always fresh and odor-free. Great job by the Steamer team. Highly satisfied!",
    avatar: "KR",
    color: "from-blue-500 to-indigo-600"
  },
  {
    name: "Malathi R",
    role: "Bank Officer",
    rating: 5,
    review: "I’ve been using Steamer for months now. They are reliable, affordable, and their work is spotless. Great for working women!",
    avatar: "MR",
    color: "from-cyan-400 to-blue-600"
  },
  {
    name: "Aravind S",
    role: "Civil Engineer",
    rating: 5,
    review: "Excellent quality and packaging. My formal shirts and pants are perfectly pressed. Will continue using their service!",
    avatar: "AS",
    color: "from-blue-400 to-indigo-500"
  },
  {
    name: "Bhuvana Devi",
    role: "Entrepreneur",
    rating: 5,
    review: "I love their eco-friendly steaming process. My delicate materials are safe with them. Chennai needed a service like this!",
    avatar: "BD",
    color: "from-sky-500 to-blue-700"
  },
  {
    name: "Manoj Varun",
    role: "Digital Marketer",
    rating: 5,
    review: "Steamer saves me hours every week. Their 3-hour delivery promise is real. Clothes come back wrinkle-free and fresh!",
    avatar: "MV",
    color: "from-blue-300 to-blue-600"
  },
  {
    name: "Keerthana R",
    role: "Nurse",
    rating: 5,
    review: "Even after long shifts, I don’t have to worry about laundry. Steamer keeps my uniforms clean and well-pressed always.",
    avatar: "KR",
    color: "from-indigo-400 to-blue-600"
  },
  {
    name: "Sundar M",
    role: "Artist",
    rating: 5,
    review: "They really care about presentation. My costumes for art shows always come back perfect. Excellent customer service too!",
    avatar: "SM",
    color: "from-blue-500 to-cyan-600"
  },
  {
    name: "Devi Shree",
    role: "Fashion Blogger",
    rating: 5,
    review: "Steamer makes my outfits look flawless for every photoshoot. I absolutely love their professional approach and neat results!",
    avatar: "DS",
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
                                                <Star key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
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