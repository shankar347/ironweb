import { Button } from '../../components/ui/button';

import {
  Clock,
  Star,
  MapPin,
  Users,
  CheckCircle,
  Truck,
  Shirt,
  Gift
} from 'lucide-react';
import { Link } from 'react-router-dom';
import heroImage from '@/assets/hero-steamer.jpg';
import happyCustomers from '@/assets/happy-customers.jpg';
import { useContext } from 'react';
import { SteamContext } from '../../hooks/steamcontext';
import HowItWorks from '../../components/howitwork';
import TestimonialsSection from '../../components/userreviews';

const Home = () => {
  const steamcontext = useContext(SteamContext)

  const { User, isLoading } = steamcontext
  return (
    <div className="min-h-screen 
    " >
      {/* Hero Section */}
      < section
        className="section-hero text-white relative
         overflow-hidden min-h-[calc(100vh-64px)]
          flex flex-col"
      >
        {/* Background */}
        < div
          className="absolute inset-0 bg-cover bg-center
           opacity-50"
          style={{ backgroundImage: `url(${heroImage})` }}
        />

        {/* Content */}
        <div className="relative container mx-auto flex 
        flex-col flex-1 justify-between px-4 py-6">
          {/* Headers */}
          <div className="text-center mt-6 space-y-4">
            <h1
              className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold leading-tight opacity-0 animate-[fadeInScale_1s_ease-out_forwards]"
            >
              Your Clothes, Crisp & Fresh in 3 Hours
            </h1>
            <h2
              className="text-2xl sm:text-3xl md:text-4xl lg:text-6xl font-bold leading-tight opacity-0 animate-[slideUp_1s_ease-out_0.5s_forwards]"
            >
              Steamer at Your Doorstep!
            </h2>
          </div>

          {/* Rate Card Centered */}
          <div className="flex-1 flex items-center justify-center mt-6 sm:mt-10">
            <div
              className="w-full max-w-xs sm:max-w-sm text-center bg-white/10 backdrop-blur-md rounded-2xl p-4
          opacity-0 animate-[fadeInScale_1s_ease-out_1s_forwards]
          transition-transform transition-shadow duration-500 ease-out
          hover:scale-105 hover:-translate-y-2 hover:shadow-xl"
              style={{ overflow: "visible" }}
            >
              <div className="flex items-center justify-center space-x-2 sm:space-x-3 mb-2">
                <span className="price-strike text-white/60 text-sm sm:text-base">₹29</span>
                <span className="price-highlight text-white text-2xl sm:text-4xl font-bold">₹10</span>
                <span className="text-white/80 text-xs sm:text-lg">/item</span>
              </div>
              <div className="text-xs sm:text-sm text-white/70">
                + Delivery ₹29 • Handling + Packing ₹4
              </div>
              <p className="text-white/70 text-xs sm:text-sm mt-1">Professional packaging included</p>
            </div>
          </div>
        </div>

        {/* Buttons + Service Hours block */}
        <div
          className="pb-3 md:pb-7 lg:pb-7 sm:pb-7  flex flex-col items-center gap-3
    items-center mx-auto
      opacity-0 animate-[slideUp_1s_ease-out_1.5s_forwards]"
        >
          {/* Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 
    justify-center w-full max-w-md">
            <Link to={User ? '/customer/book-slot' : '/select-role'}>
              <Button size="lg" className="btn-hero text-base sm:text-lg md:text-xl min-w-[150px] py-4 sm:py-5">
                Book Now - Get 65% Off
              </Button>
            </Link>
            <Link to="/customer/ordertrack">
              <Button
                size="lg"
                variant="outline"
                className="text-primary bg-gray-100 hover:text-white
           text-sm sm:text-lg min-w-[150px] py-3.5 
          px-[84px] md:px-10 lg:px-12 sm:px-8  hover:bg-primary"
              >
                Track Order
              </Button>
            </Link>
          </div>

          {/* Service Hours below buttons */}
          <div className="flex items-center justify-center space-x-2 text-white/80 mt-2 text-xs sm:text-sm">
            <Clock className="w-4 h-4 sm:w-5 sm:h-5" />
            <span>Service Hours: 8 AM - 8 PM Daily</span>
          </div>
        </div>
      </section >


      {/* Animations */}
      <style>
        {
          `
    @keyframes fadeInScale {
      from { transform: scale(0.8); opacity: 0; }
      to { transform: scale(1); opacity: 1; }
    }
    @keyframes slideUp {
      from { transform: translateY(40px); opacity: 0; }
      to { transform: translateY(0); opacity: 1; }
    }
  `}
      </style >


      {/* Stats Section */}
      < section className="py-16 bg-secondary/30" >
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="text-3xl lg:text-4xl font-bold text-primary mb-2">300+</div>
              <div className="text-muted-foreground">Happy Customers</div>
            </div>
            <div className="text-center">
              <div className="text-3xl lg:text-4xl font-bold text-primary mb-2">3hrs</div>
              <div className="text-muted-foreground">Fast Delivery</div>
            </div>
            <div className="text-center">
              <div className="text-3xl lg:text-4xl font-bold text-primary mb-2">6+</div>
              <div className="text-muted-foreground">Service Areas</div>
            </div>
            <div className="text-center">
              <div className="text-3xl lg:text-4xl font-bold text-primary mb-2">4.8★</div>
              <div className="text-muted-foreground">Customer Rating</div>
            </div>
          </div>
        </div>
      </section >

      {/* How It Works */}
      <HowItWorks />

      {/* Service Areas */}
      < section className="py-20 bg-secondary/30" >
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl lg:text-4xl font-bold text-foreground mb-6">
                Serving West Tambaram & Nearby Areas
              </h2>
              <p className="text-xl text-muted-foreground mb-8">
                Professional steaming service now available in your neighborhood
              </p>

              <div className="grid grid-cols-2 gap-4 mb-8">
                <div className="flex items-center space-x-2">
                  <CheckCircle className="w-5 h-5 text-success" />
                  <span>West Tambaram</span>
                </div>
                <div className="flex items-center space-x-2">
                  <CheckCircle className="w-5 h-5 text-success" />
                  <span>East Tambaram</span>
                </div>
                <div className="flex items-center space-x-2">
                  <CheckCircle className="w-5 h-5 text-success" />
                  <span>Selaiyur</span>
                </div>
                <div className="flex items-center space-x-2">
                  <CheckCircle className="w-5 h-5 text-success" />
                  <span>New Perungalathur</span>
                </div>
                <div className="flex items-center space-x-2">
                  <CheckCircle className="w-5 h-5 text-success" />
                  <span>Chitlapakkam</span>
                </div>
              </div>

              <Link to="/customer/book-slot">
                <Button className="btn-hero">Check Service in Your Area</Button>
              </Link>
            </div>

            <div className="relative">
              <img
                src={happyCustomers}
                alt="Happy customers with steamed clothes"
                className="rounded-2xl shadow-lg"
              />
            </div>
          </div>
        </div>
      </section >

      {/* Reviews */}
      <TestimonialsSection />

    </div >
  );
};

export default Home;