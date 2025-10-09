import React, { useState, useEffect } from 'react';
import { Clock, ChevronLeft, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from './ui/button';
import { API_URL } from '../hooks/tools';

// Local placeholder image (used before banners load)
import Image1 from '../assets/hero-steamer.jpg';

const CarouselHeroSection = ({ User }) => {
  const [banners, setBanners] = useState([]);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [loading, setLoading] = useState(true);

  // Fetch banners from backend
  useEffect(() => {
    const getBanners = async () => {
      try {
        const res = await fetch(`${API_URL}/user/banners`, {
          credentials: 'include',
        });
        const data = await res.json();
        if (data?.daa?.length > 0) {
          setBanners(data.daa);
        }
      } catch (err) {
        console.error('Error fetching banners:', err);
      } finally {
        setLoading(false);
      }
    };
    getBanners();
  }, []);

  // Slides (dynamic from API)
  const slides = banners.length > 0
    ? banners.map((b) => ({
        image: b.banner,
        title: b.header,
        subtitle: b.subHeader,
      }))
    : [
        {
          image: Image1,
          title: 'Your Clothes, Crisp & Fresh in 3 Hours',
          subtitle: 'Steamer at Your Doorstep!',
        },
      ];

  // Auto-scroll slides (only if more than one banner)
  useEffect(() => {
    if (slides.length > 1) {
      const interval = setInterval(() => {
        setCurrentSlide((prev) => (prev + 1) % slides.length);
      }, 5000);
      return () => clearInterval(interval);
    }
  }, [slides.length]);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };

  const goToSlide = (index) => {
    setCurrentSlide(index);
  };

  return (
    <section
      className="section-hero text-white relative overflow-hidden 
                 min-h-[calc(100vh-64px)] flex flex-col"
    >
      {/* Background Images */}
      {slides.map((slide, index) => (
        <div
          key={index}
          className="absolute inset-0 bg-cover bg-center transition-opacity duration-1000"
          style={{
            backgroundImage: `url(${slide.image})`,
            opacity: index === currentSlide ? 0.5 : 0,
            zIndex: 0,
          }}
        />
      ))}

      {/* Navigation Arrows (only show if more than one slide) */}
      {slides.length > 1 && (
        <>
          <button
            onClick={prevSlide}
            className="absolute left-4 top-1/2 -translate-y-1/2 z-30 
                       bg-white/20 hover:bg-white/40 backdrop-blur-sm 
                       rounded-full p-3 transition-all duration-300 hover:scale-110"
            aria-label="Previous slide"
          >
            <ChevronLeft className="w-6 h-6 text-white" />
          </button>

          <button
            onClick={nextSlide}
            className="absolute right-4 top-1/2 -translate-y-1/2 z-30 
                       bg-white/20 hover:bg-white/40 backdrop-blur-sm 
                       rounded-full p-3 transition-all duration-300 hover:scale-110"
            aria-label="Next slide"
          >
            <ChevronRight className="w-6 h-6 text-white" />
          </button>
        </>
      )}

      {/* Content */}
      <div className="relative container mx-auto flex flex-col flex-1 justify-between px-4 py-6 z-10">
        {/* Headers */}
        <div className="text-center mt-6 space-y-4">
          <h1
            key={`title-${currentSlide}`}
            className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl 
                       font-bold leading-tight animate-[fadeInScale_0.8s_ease-out_forwards]"
          >
            {slides[currentSlide].title}
          </h1>
          <h2
            key={`subtitle-${currentSlide}`}
            className="text-2xl sm:text-3xl md:text-4xl lg:text-6xl 
                       font-bold leading-tight animate-[slideUp_0.8s_ease-out_0.3s_forwards]"
          >
            {slides[currentSlide].subtitle}
          </h2>
        </div>

        {/* Rate Card */}
        <div className="flex-1 flex items-center justify-center mt-6 sm:mt-10">
          <div
            className="w-full max-w-xs sm:max-w-sm text-center bg-white/10 
                       backdrop-blur-md rounded-2xl p-4 transition-transform 
                       transition-shadow duration-500 ease-out hover:scale-105 
                       hover:-translate-y-2 hover:shadow-xl"
          >
            <div className="flex items-center justify-center space-x-2 sm:space-x-3 mb-2">
              <span className="text-white/60 text-sm sm:text-base line-through">₹29</span>
              <span className="text-white text-2xl sm:text-4xl font-bold">₹10</span>
              <span className="text-white/80 text-xs sm:text-lg">/item</span>
            </div>
            <div className="text-xs sm:text-sm text-white/70">
              + Delivery ₹29 • Handling + Packing ₹4
            </div>
            <p className="text-white/70 text-xs sm:text-sm mt-1">
              Professional packaging included
            </p>
          </div>
        </div>
      </div>

      {/* Buttons + Indicators + Service Hours */}
      <div
        className="pb-5 md:pb-7 lg:pb-7 sm:pb-7 flex flex-col 
                   items-center gap-3 mx-auto z-10"
      >
        {/* Buttons */}
        <div
          className="flex flex-col sm:flex-row gap-4 
                     justify-center w-full max-w-md"
        >
          <Link to={User ? '/customer/book-slot' : '/select-role'}>
            <Button
              size="lg"
              className="btn-hero text-base sm:text-lg md:text-xl 
                         min-w-[150px] h-14 sm:py-5"
            >
              Book Now - Get 65% Off
            </Button>
          </Link>
          <Link to="/customer/ordertrack">
            <Button
              size="lg"
              variant="outline"
              className="text-primary h-14 bg-gray-100 hover:text-white
                         text-sm sm:text-lg min-w-[150px] py-3.5 
                         px-[84px] md:px-10 lg:px-12 sm:px-8 hover:bg-primary"
            >
              Track Order
            </Button>
          </Link>
        </div>

        {/* Carousel Indicators */}
        {slides.length > 1 && (
          <div className="flex items-center justify-center gap-2 mt-2">
            {slides.map((_, index) => (
              <button
                key={index}
                onClick={() => goToSlide(index)}
                className={`transition-all duration-300 rounded-full ${
                  index === currentSlide
                    ? 'bg-white w-8 h-2 shadow-lg'
                    : 'bg-gray-200 w-2 h-2'
                }`}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>
        )}

        {/* Service Hours */}
        <div className="flex items-center justify-center space-x-2 text-white/80 text-xs sm:text-sm">
          <Clock className="w-4 h-4 sm:w-5 sm:h-5" />
          <span>Service Hours: 8 AM - 8 PM Daily</span>
        </div>
      </div>

      {/* Animations */}
      <style jsx>{`
        @keyframes fadeInScale {
          from {
            opacity: 0;
            transform: scale(0.95);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }
        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </section>
  );
};

export default CarouselHeroSection;
