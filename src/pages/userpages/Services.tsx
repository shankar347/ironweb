import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';

import {
  CheckCircle,
  Clock,
  Star,
  Shield,
  Package,
  Truck,
  Gift,
  Zap,
  Heart
} from 'lucide-react';

const Services = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [activeFeature, setActiveFeature] = useState(0);
  const [hoveredPrice, setHoveredPrice] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const features = [
    {
      icon: Clock,
      title: '3-Hour Delivery',
      description: 'Fast service within your chosen time slot',
      color: 'from-blue-500 to-sky-400',
      delay: 0
    },
    {
      icon: Shield,
      title: 'Quality Guarantee',
      description: 'Handled by skilled professionals to preserve fabric quality',
      color: 'from-sky-400 to-blue-600',
      delay: 200
    },
    {
      icon: Package,
      title: 'Professional Packing',
      description: 'Neat and secure packaging included',
      color: 'from-blue-600 to-sky-500',
      delay: 400
    },
    {
      icon: Truck,
      title: 'Doorstep Service',
      description: 'Pickup and delivery at your convenience',
      color: 'from-sky-500 to-blue-500',
      delay: 600
    }
  ];

  const qualityPromises = [
    {
      icon: Star,
      title: 'Premium Quality',
      description: 'Professional grade steaming equipment and experienced staff ensure perfect results',
      color: 'from-blue-500 to-sky-400'
    },
    {
      icon: Shield,
      title: '100% Safe',
      description: 'Your clothes are handled with care and returned in pristine condition',
      color: 'from-sky-400 to-blue-600'
    },
    {
      icon: Heart,
      title: 'Satisfaction Guaranteed',
      description: 'Not happy with the service? We\'ll make it right or refund your money',
      color: 'from-blue-600 to-sky-500'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-sky-50">
      {/* Animated Background Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-48 sm:w-72 h-48 sm:h-72 bg-blue-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse"></div>
        <div className="absolute top-40 right-10 w-64 sm:w-96 h-64 sm:h-96 bg-sky-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse" style={{ animationDelay: '1s' }}></div>
        <div className="absolute -bottom-20 left-1/2 w-64 sm:w-96 h-64 sm:h-96 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse" style={{ animationDelay: '2s' }}></div>
      </div>

      {/* Hero Section */}
      <section className="relative py-16 sm:py-20 md:py-24 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br
         from-blue-400 via-blue-700 to-sky-500
          opacity-95"></div>
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PHBhdGggZD0iTTM2IDE2YzAtMS4xLjktMiAyLTJzMiAuOSAyIDItLjkgMi0yIDItMi0uOS0yLTJ6bS0yMCAwYzAtMS4xLjktMiAyLTJzMiAuOSAyIDItLjkgMi0yIDItMi0uOS0yLTJ6Ii8+PC9nPjwvZz48L3N2Zz4=')] opacity-30"></div>

        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <div className={`transition-all duration-1000 transform ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
          
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-7xl font-bold mb-4 sm:mb-6 text-white drop-shadow-2xl px-2">
              Professional Steaming Services
            </h1>
            <p className="text-base sm:text-lg md:text-xl lg:text-2xl mb-4 sm:mb-6 md:mb-8 text-white/95 max-w-3xl mx-auto leading-relaxed px-4">
              Delivery within 3 hours based on your slot
            </p>
            <p className="text-sm sm:text-base md:text-lg text-white/90 font-medium">
              Operating hours: 8 AM – 8 PM Daily
            </p>
          </div>
        </div>

        {/* Animated Wave */}

      </section>

      {/* Pricing Section */}
      <section className="relative py-12 sm:py-16 md:py-20 z-10">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className={`text-center mb-12 sm:mb-16 transition-all duration-1000 transform ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
            <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold bg-gradient-to-r from-blue-500 via-blue-600 to-sky-500 bg-clip-text text-transparent mb-4 sm:mb-6 px-4">
              Simple, Transparent Pricing
            </h2>
            <p className="text-base sm:text-lg md:text-xl text-slate-600 max-w-2xl mx-auto px-4">
              No hidden charges, professional service guaranteed
            </p>
          </div>

          {/* Main Pricing Card */}
          <div className={`max-w-3xl mx-auto mb-12 sm:mb-16 md:mb-20 transition-all duration-1000 transform ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`} style={{ transitionDelay: '200ms' }}>
            <div
              className="relative bg-white rounded-2xl sm:rounded-3xl p-6 sm:p-8 md:p-10 shadow-2xl border-2 border-blue-200 overflow-hidden transition-all duration-500 hover:shadow-blue-200/50 hover:-translate-y-2"
              onMouseEnter={() => setHoveredPrice(true)}
              onMouseLeave={() => setHoveredPrice(false)}
            >
              {/* Gradient Border Effect */}
              <div className="absolute inset-0 bg-gradient-to-br from-blue-500 via-blue-600 to-sky-500 opacity-0 hover:opacity-10 transition-opacity duration-500 rounded-2xl sm:rounded-3xl"></div>

              {/* Animated Background Orbs */}
              <div className="absolute top-0 right-0 w-32 sm:w-40 h-32 sm:h-40 bg-blue-400 rounded-full mix-blend-multiply filter blur-2xl opacity-20 animate-pulse"></div>
              <div className="absolute bottom-0 left-0 w-32 sm:w-40 h-32 sm:h-40 bg-sky-400 rounded-full mix-blend-multiply filter blur-2xl opacity-20 animate-pulse" style={{ animationDelay: '1s' }}></div>

              <div className="relative z-10">
                <div className="mb-6 sm:mb-8 text-center">
                  <div className="flex flex-col sm:flex-row items-center justify-center sm:space-x-4 md:space-x-6 mb-4 sm:mb-6 space-y-2 sm:space-y-0">
                    <span className="text-2xl sm:text-3xl text-slate-400 line-through font-semibold">₹15</span>
                    <div className={`transition-all duration-500 ${hoveredPrice ? 'scale-110' : 'scale-100'}`}>
                      <span className="text-5xl sm:text-6xl font-bold bg-gradient-to-r from-blue-500 to-sky-500 bg-clip-text text-transparent">₹12</span>
                    </div>
                    <span className="text-2xl sm:text-3xl text-slate-600">/item</span>
                  </div>
                  <div className="bg-gradient-to-r  
                   rounded-full from-green-500 to-emerald-500 text-white border-none px-4 sm:px-6 py-1.5 sm:py-2 text-sm sm:text-base shadow-lg inline-flex items-center">
                    <Zap className="w-3 h-3 sm:w-4 sm:h-4 mr-2" />
                    25% OFF Launch Offer
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6 mb-6 sm:mb-8 md:mb-10">
                  {[
                    { label: 'Delivery', price: '₹29', color: 'from-blue-500 to-sky-400' },
                    { label: 'Handling', price: 'Free', color: 'from-sky-400 to-blue-600' },
                    { label: 'Packing', price: 'Free', color: 'from-blue-600 to-sky-500' }
                  ].map((item, index) => (
                    <div
                      key={index}
                      className="relative group"
                    >
                      <div className="bg-gradient-to-br from-slate-50 to-sky-50 rounded-xl sm:rounded-2xl p-4 sm:p-6 text-center transition-all duration-500 hover:shadow-xl hover:-translate-y-1 border border-blue-100">
                        <div className="text-xs sm:text-sm font-semibold text-slate-600 mb-1 sm:mb-2 uppercase tracking-wide">{item.label}</div>
                        <div className={`text-2xl sm:text-3xl font-bold bg-gradient-to-r ${item.color} bg-clip-text text-transparent`}>
                          {item.price}
                        </div>
                        <div className={`absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r ${item.color} transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 rounded-full`}></div>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="bg-gradient-to-br from-blue-50 to-sky-50 rounded-xl sm:rounded-2xl p-4 sm:p-6 mb-6 sm:mb-8 border border-blue-200">
                  <p className="text-sm sm:text-base text-slate-700 leading-relaxed">
                    <strong className="text-blue-600">Note:</strong> Packing will be neat and professional. No minimum order quantity required - book even for 1 cloth!
                  </p>
                </div>

                <a href="/customer/book-slot">
                  <Button className="w-full bg-gradient-to-r from-blue-500 via-blue-600 to-sky-500 hover:from-blue-600 hover:via-blue-700 hover:to-sky-600 text-white text-base sm:text-lg md:text-xl px-6 sm:px-8 py-4 sm:py-5 md:py-6 rounded-xl sm:rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-500 hover:-translate-y-1 font-semibold">
                    <span className="hidden sm:inline">Book Now - Get 25% Off</span>
                    <span className="sm:hidden">Book Now - 25% Off</span>
                    <Zap className="w-5 h-5 sm:w-6 sm:h-6 ml-2" />
                  </Button>
                </a>
              </div>
            </div>
          </div>

          {/* Service Features Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              const isActive = activeFeature === index;

              return (
                <div
                  key={index}
                  className={`relative group cursor-pointer transition-all duration-700 transform ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-20 opacity-0'}`}
                  style={{ transitionDelay: `${feature.delay}ms` }}
                  onMouseEnter={() => setActiveFeature(index)}
                >
                  <div className={`relative bg-white rounded-xl sm:rounded-2xl p-6 sm:p-8 shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 border-2 ${isActive ? 'border-blue-500 scale-105' : 'border-transparent'}`}>
                    {/* Icon Container */}
                    <div className={`relative w-16 h-16 sm:w-20 sm:h-20 mb-4 sm:mb-6 rounded-xl sm:rounded-2xl bg-gradient-to-br ${feature.color} p-0.5 transition-all duration-500 ${isActive ? 'scale-110 rotate-6' : ''}`}>
                      <div className="w-full h-full bg-white rounded-xl sm:rounded-2xl flex items-center justify-center">
                        <Icon className={`w-8 h-8 sm:w-10 sm:h-10 transition-all duration-500 ${isActive ? 'scale-110' : ''}`}
                          style={{
                            background: `linear-gradient(135deg, ${feature.color.split(' ')[0].replace('from-', '')}, ${feature.color.split(' ')[1].replace('to-', '')})`,
                            WebkitBackgroundClip: 'text',
                            WebkitTextFillColor: 'transparent',
                            backgroundClip: 'text'
                          }}
                        />
                      </div>
                    </div>

                    <h3 className="text-lg sm:text-xl font-bold text-slate-900 mb-2 sm:mb-3 group-hover:text-blue-600 transition-colors">
                      {feature.title}
                    </h3>
                    <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
                      {feature.description}
                    </p>

                    {/* Hover Effect Line */}
                    <div className={`absolute bottom-0 left-0 h-1 bg-gradient-to-r ${feature.color} transition-all duration-500 rounded-full ${isActive ? 'w-full' : 'w-0 group-hover:w-full'}`} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Quality Promise Section */}
      <section className="relative py-12 sm:py-16 md:py-20 lg:py-24 overflow-hidden">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className={`text-center mb-12 sm:mb-16 transition-all duration-1000 transform ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
            <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold bg-gradient-to-r from-blue-500 via-blue-600 to-sky-500 bg-clip-text text-transparent mb-4 sm:mb-6 px-4">
              Our Quality Promise
            </h2>
            <p className="text-base sm:text-lg md:text-xl text-slate-600 max-w-2xl mx-auto px-4">
              Experience excellence in every service we provide
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8 max-w-6xl mx-auto">
            {qualityPromises.map((promise, index) => {
              const Icon = promise.icon;

              return (
                <div
                  key={index}
                  className={`relative group transition-all duration-700 transform ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-20 opacity-0'}`}
                  style={{ transitionDelay: `${index * 200}ms` }}
                >
                  <div className="relative bg-white rounded-xl sm:rounded-2xl p-6 sm:p-8 shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 border border-blue-100">
                    {/* Icon Container */}
                    <div className={`relative w-16 h-16 sm:w-20 sm:h-20 mb-4 sm:mb-6 rounded-xl sm:rounded-2xl bg-gradient-to-br ${promise.color} p-0.5 mx-auto transition-all duration-500 group-hover:scale-110 group-hover:rotate-6`}>
                      <div className="w-full h-full bg-white rounded-xl sm:rounded-2xl flex items-center justify-center">
                        <Icon className="w-8 h-8 sm:w-10 sm:h-10 transition-all duration-500 group-hover:scale-110"
                          style={{
                            background: `linear-gradient(135deg, ${promise.color.split(' ')[0].replace('from-', '')}, ${promise.color.split(' ')[1].replace('to-', '')})`,
                            WebkitBackgroundClip: 'text',
                            WebkitTextFillColor: 'transparent',
                            backgroundClip: 'text'
                          }}
                        />
                      </div>
                    </div>

                    <h3 className="text-xl sm:text-2xl font-bold text-slate-900 mb-3 sm:mb-4 text-center group-hover:text-blue-600 transition-colors">
                      {promise.title}
                    </h3>
                    <p className="text-sm sm:text-base text-slate-600 leading-relaxed text-center">
                      {promise.description}
                    </p>

                    {/* Hover Effect Line */}
                    <div className={`absolute bottom-0 left-0 h-1 bg-gradient-to-r ${promise.color} transition-all duration-500 rounded-full w-0 group-hover:w-full`} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative py-16 sm:py-20 md:py-24 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-500 via-blue-600 to-sky-500 opacity-95"></div>
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PHBhdGggZD0iTTM2IDE2YzAtMS4xLjktMiAyLTJzMiAuOSAyIDItLjkgMi0yIDItMi0uOS0yLTJ6bS0yMCAwYzAtMS4xLjktMiAyLTJzMiAuOSAyIDItLjkgMi0yIDItMi0uOS0yLTJ6Ii8+PC9nPjwvZz48L3N2Zz4=')] opacity-30"></div>

        {/* Floating Elements */}
        <div className="absolute top-10 left-10 w-16 sm:w-20 h-16 sm:h-20 bg-white/10 rounded-full animate-pulse"></div>
        <div className="absolute bottom-10 right-10 w-24 sm:w-32 h-24 sm:h-32 bg-white/10 rounded-full animate-pulse" style={{ animationDelay: '1s' }}></div>

        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <div className={`transition-all duration-1000 transform ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
            <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-4 sm:mb-6 text-white drop-shadow-2xl px-4">
              Ready to Experience Premium Steaming?
            </h2>
            <p className="text-base sm:text-lg md:text-xl lg:text-2xl mb-8 sm:mb-10 text-white/95 max-w-2xl mx-auto px-4">
              Book your first order now and save 25%!
            </p>
            <a href="/customer/book-slot">
              <Button className="bg-white text-blue-600 hover:bg-blue-50 text-base sm:text-lg md:text-xl px-8 sm:px-10 py-4 sm:py-5 md:py-6 rounded-xl sm:rounded-2xl shadow-2xl hover:shadow-white/20 transition-all duration-500 hover:scale-105 font-bold inline-flex items-center">
                <span className="hidden sm:inline">Book Now - Limited Time Offer</span>
                <span className="sm:hidden">Book Now</span>
                <Zap className="w-5 h-5 sm:w-6 sm:h-6 ml-2" />
              </Button>
            </a>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Services;