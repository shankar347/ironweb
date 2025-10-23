import { useState, useEffect, useRef } from 'react';
import { Button } from '../../components/ui/button';
import happyCustomers from '@/assets/happy-customers.jpg';

import {
  CheckCircle,
  Users,
  Award,
  Target,
  Heart,
  Clock,
  Shield,
  Truck,
  Mail,
  Phone,
  VolumeX,
  Volume
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { API_URL } from '../../hooks/tools';

const About = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [activeValue, setActiveValue] = useState(0);
  const [activeContact, setActiveContact] = useState(0);

  const [videoUrl, setVideoUrl] = useState('');
  const [isMuted, setIsMuted] = useState(true); // start muted
  const videoRef = useRef(null);

   useEffect(() => {
      const getvideo = async () => {
        try {
          const res = await fetch(`${API_URL}/user/homevideo`, {
            credentials: 'include',
          });
          const data = await res.json();
          if (res.ok && data?.data?.video) {
            setVideoUrl(data.data.video);
          }
          console.log(data);
        } catch (err) {
          console.log(err);
        }
      };
      getvideo();
    }, []);
  

  useEffect(() => {
    setIsVisible(true);
  }, []);

   
  
    const toggleMute = () => {
      setIsMuted(!isMuted);
      if (videoRef.current) {
        videoRef.current.muted = !videoRef.current.muted;
      }
    };

  const values = [
    {
      icon: Shield,
      title: 'Quality First',
      description: 'We never compromise on the quality of our steaming services',
      color: 'from-blue-500 to-sky-400',
      delay: 0
    },
    {
      icon: Clock,
      title: 'Reliability',
      description: 'On-time pickup and delivery, every single time',
      color: 'from-sky-400 to-blue-600',
      delay: 200
    },
    {
      icon: Heart,
      title: 'Customer Care',
      description: 'Your satisfaction is our top priority',
      color: 'from-blue-600 to-sky-500',
      delay: 400
    },
    {
      icon: Users,
      title: 'Community',
      description: 'Supporting local employment and growth',
      color: 'from-sky-500 to-blue-500',
      delay: 600
    }
  ];

  const stats = [
    { icon: Users, value: '300+', label: 'Happy Customers', color: 'from-blue-500 to-sky-400' },
    { icon: Truck, value: '1000+', label: 'Orders Completed', color: 'from-sky-400 to-blue-600' },
    { icon: Award, value: '4.8★', label: 'Customer Rating', color: 'from-blue-600 to-sky-500' },
    { icon: Target, value: '6+', label: 'Service Areas', color: 'from-sky-500 to-blue-500' }
  ];

  const contacts = [
    {
      icon: Phone,
      title: 'Customer Support',
      subtitle: 'Available 8 AM - 8 PM Daily',
      action: '+91  6383148182',
      color: 'from-blue-500 to-sky-400'
    },
    {
      icon: Mail,
      title: 'Business Inquiries',
      subtitle: 'Partnership & Franchise',
      action: 'steemerservicescontactin@gmail.com',
      color: 'from-sky-400 to-blue-600'
    },
    {
      icon: Award,
      title: 'Join Our Team',
      subtitle: 'Delivery Agent Opportunities',
      action: 'Apply Now',
      color: 'from-blue-600 to-sky-500',
      isButton: true
    }
  ];

  const missions = [
    'Professional quality steaming',
    'Convenient doorstep service',
    'Affordable transparent pricing',
    'Supporting local employment'
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
          from-blue-400 via-blue-700 to-sky-500 opacity-95"></div>
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PHBhdGggZD0iTTM2IDE2YzAtMS4xLjktMiAyLTJzMiAuOSAyIDItLjkgMi0yIDItMi0uOS0yLTJ6bS0yMCAwYzAtMS4xLjktMiAyLTJzMiAuOSAyIDItLjkgMi0yIDItMi0uOS0yLTJ6Ii8+PC9nPjwvZz48L3N2Zz4=')] opacity-30"></div>

        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <div className={`transition-all duration-1000 transform ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>

            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold mb-4 sm:mb-6 text-white drop-shadow-2xl px-2">
              About Steamer
            </h1>
            <p className="text-base sm:text-lg md:text-xl lg:text-2xl text-white/95 max-w-3xl mx-auto leading-relaxed px-4">
              Revolutionizing garment care with professional steaming services delivered to your doorstep
            </p>
          </div>
        </div>
      </section>

      {/* Our Story Section */}
      <section className="relative py-12 sm:py-16 md:py-20 z-10">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-10 lg:gap-12 items-center">
            <div className={`transition-all duration-1000 transform ${isVisible ? 'translate-x-0 opacity-100' : '-translate-x-10 opacity-0'}`}>
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold bg-gradient-to-r from-blue-500 via-blue-600 to-sky-500 bg-clip-text text-transparent mb-4 sm:mb-6">
                Our Mission
              </h2>
              <p className="text-lg sm:text-xl text-slate-600 mb-4 sm:mb-6 leading-relaxed">
               Steemer is a modern garment care startup that brings professional ironing and doorstep delivery to your neighborhood  faster, smarter, and more affordable.
               We understand how important your clothes are. Our team irons every garment with care, the right temperature, and professional precision ensuring your outfits stay fresh, neat, and damage-free
              
              </p>
              <p className="text-base sm:text-lg text-slate-600 mb-6 sm:mb-8 leading-relaxed">
               At Steemer, we care for your clothes like they’re our own — because quality and trust come first.
              </p>

              <div className="space-y-3 sm:space-y-4">
                {missions.map((mission, index) => (
                  <div
                    key={index}
                    className={`flex items-center space-x-3 transition-all duration-700 transform ${isVisible ? 'translate-x-0 opacity-100' : '-translate-x-10 opacity-0'}`}
                    style={{ transitionDelay: `${index * 100}ms` }}
                  >
                    <div className="flex-shrink-0 w-6 h-6 sm:w-7 sm:h-7 rounded-full bg-gradient-to-br from-green-500 to-emerald-500 flex items-center justify-center">
                      <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                    </div>
                    <span className="text-base sm:text-lg text-slate-700 font-medium">{mission}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="relative ">
      {videoUrl ? (
        <>
          <video
            ref={videoRef}
            src={videoUrl}
            autoPlay
            loop
            muted={isMuted}
            playsInline
            className="rounded-2xl 
            max-h-[600px]
            shadow-lg w-full h-auto hover:scale-[1.01] transition-transform duration-300 object-cover"
          />
          {/* Speaker button */}
          <button
            onClick={toggleMute}
            className="absolute top-4 right-4 bg-white p-2 rounded-full shadow-lg flex items-center justify-center hover:bg-gray-100 transition"
          >
            {isMuted ? <VolumeX size={20} /> : <Volume size={20} />}
          </button>
        </>
      ) : (
        <div className="w-full h-64 bg-gray-200 flex items-center justify-center rounded-2xl shadow-lg text-gray-500">
          Loading video...
        </div>
      )}
    </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="relative py-12 sm:py-16 md:py-20 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50/50 to-sky-50/50"></div>
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className={`text-center mb-12 sm:mb-16 transition-all duration-1000 transform ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
            <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold bg-gradient-to-r from-blue-500 via-blue-600 to-sky-500 bg-clip-text text-transparent mb-4 sm:mb-6 px-4">
              Our Values
            </h2>
            <p className="text-base sm:text-lg md:text-xl text-slate-600 max-w-2xl mx-auto px-4">
              The principles that guide everything we do
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
            {values.map((value, index) => {
              const Icon = value.icon;
              const isActive = activeValue === index;

              return (
                <div
                  key={index}
                  className={`relative group cursor-pointer transition-all duration-700 transform ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-20 opacity-0'}`}
                  style={{ transitionDelay: `${value.delay}ms` }}
                  onMouseEnter={() => setActiveValue(index)}
                >
                  <div className={`relative bg-white rounded-xl sm:rounded-2xl p-6 sm:p-8 shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 border-2 ${isActive ? 'border-blue-500 scale-105' : 'border-transparent'}`}>
                    <div className={`relative w-16 h-16 sm:w-20 sm:h-20 mb-4 sm:mb-6 rounded-xl sm:rounded-2xl bg-gradient-to-br ${value.color} p-0.5 mx-auto transition-all duration-500 ${isActive ? 'scale-110 rotate-6' : ''}`}>
                      <div className="w-full h-full bg-white rounded-xl sm:rounded-2xl flex items-center justify-center">
                        <Icon className={`w-8 h-8 sm:w-10 sm:h-10 transition-all duration-500 ${isActive ? 'scale-110' : ''}`}
                          style={{
                            background: `linear-gradient(135deg, ${value.color.split(' ')[0].replace('from-', '')}, ${value.color.split(' ')[1].replace('to-', '')})`,
                            WebkitBackgroundClip: 'text',
                            WebkitTextFillColor: 'transparent',
                            backgroundClip: 'text'
                          }}
                        />
                      </div>
                    </div>

                    <h3 className="text-lg sm:text-xl font-bold text-slate-900 mb-2 sm:mb-3 text-center group-hover:text-blue-600 transition-colors">
                      {value.title}
                    </h3>
                    <p className="text-sm sm:text-base text-slate-600 leading-relaxed text-center">
                      {value.description}
                    </p>

                    <div className={`absolute bottom-0 left-0 h-1 bg-gradient-to-r ${value.color} transition-all duration-500 rounded-full ${isActive ? 'w-full' : 'w-0 group-hover:w-full'}`} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Stats & Achievements */}
      <section className="relative py-12 sm:py-16 md:py-20 z-10">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className={`text-center mb-12 sm:mb-16 transition-all duration-1000 transform ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
            <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold bg-gradient-to-r from-blue-500 via-blue-600 to-sky-500 bg-clip-text text-transparent mb-4 sm:mb-6 px-4">
              Our Achievements
            </h2>
            <p className="text-base sm:text-lg md:text-xl text-slate-600 max-w-2xl mx-auto px-4">
              Milestones that make us proud
            </p>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
            {stats.map((stat, index) => {
              const Icon = stat.icon;

              return (
                <div
                  key={index}
                  className={`relative group transition-all duration-700 transform ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-20 opacity-0'}`}
                  style={{ transitionDelay: `${index * 150}ms` }}
                >
                  <div className="bg-white rounded-xl sm:rounded-2xl p-6 sm:p-8 text-center shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 border border-blue-100">
                    <div className={`relative w-16 h-16 sm:w-20 sm:h-20 mb-4 rounded-xl sm:rounded-2xl bg-gradient-to-br ${stat.color} p-0.5 mx-auto transition-all duration-500 group-hover:scale-110 group-hover:rotate-6`}>
                      <div className="w-full h-full bg-white rounded-xl sm:rounded-2xl flex items-center justify-center">
                        <Icon className="w-8 h-8 sm:w-10 sm:h-10 transition-all duration-500 group-hover:scale-110"
                          style={{
                            background: `linear-gradient(135deg, ${stat.color.split(' ')[0].replace('from-', '')}, ${stat.color.split(' ')[1].replace('to-', '')})`,
                            WebkitBackgroundClip: 'text',
                            WebkitTextFillColor: 'transparent',
                            backgroundClip: 'text'
                          }}
                        />
                      </div>
                    </div>
                    <div className={`text-3xl sm:text-4xl lg:text-5xl font-bold bg-gradient-to-r ${stat.color} bg-clip-text text-transparent mb-2`}>
                      {stat.value}
                    </div>
                    <div className="text-sm sm:text-base text-slate-600 font-medium">{stat.label}</div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Contact Information */}
      <section className="relative py-12 sm:py-16 md:py-20 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50/50 to-sky-50/50"></div>
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className={`text-center mb-12 transition-all duration-1000 transform ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
            <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold bg-gradient-to-r from-blue-500 via-blue-600 to-sky-500 bg-clip-text text-transparent mb-4 sm:mb-6 px-4">
              Get in Touch
            </h2>
            <p className="text-base sm:text-lg md:text-xl text-slate-600 max-w-2xl mx-auto px-4">
              We'd love to hear from you
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8 max-w-6xl mx-auto">
            {contacts.map((contact, index) => {
              const Icon = contact.icon;
              const isActive = activeContact === index;

              return (
                <div
                  key={index}
                  className={`relative group cursor-pointer transition-all duration-700 transform ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-20 opacity-0'}`}
                  style={{ transitionDelay: `${index * 200}ms` }}
                  onMouseEnter={() => setActiveContact(index)}
                >
                  <div className={`relative bg-white rounded-xl sm:rounded-2xl p-6 sm:p-8 text-center shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 border-2 ${isActive ? 'border-blue-500 scale-105' : 'border-transparent'}`}>
                    <div className={`relative w-16 h-16 sm:w-20 sm:h-20 mb-4 sm:mb-6 rounded-xl sm:rounded-2xl bg-gradient-to-br ${contact.color} p-0.5 mx-auto transition-all duration-500 ${isActive ? 'scale-110 rotate-6' : ''}`}>
                      <div className="w-full h-full bg-white rounded-xl sm:rounded-2xl flex items-center justify-center">
                        <Icon className={`w-8 h-8 sm:w-10 sm:h-10 transition-all duration-500 ${isActive ? 'scale-110' : ''}`}
                          style={{
                            background: `linear-gradient(135deg, ${contact.color.split(' ')[0].replace('from-', '')}, ${contact.color.split(' ')[1].replace('to-', '')})`,
                            WebkitBackgroundClip: 'text',
                            WebkitTextFillColor: 'transparent',
                            backgroundClip: 'text'
                          }}
                        />
                      </div>
                    </div>

                    <h3 className="text-lg sm:text-xl font-bold text-slate-900 mb-2 group-hover:text-blue-600 transition-colors">
                      {contact.title}
                    </h3>
                    <p className="text-sm sm:text-base text-slate-600 mb-4">
                      {contact.subtitle}
                    </p>

                    {contact.isButton ? (
                      <a href="/agent/register">
                        <Button className="bg-gradient-to-r from-blue-500 via-blue-600 to-sky-500 hover:from-blue-600 hover:via-blue-700 hover:to-sky-600 text-white border-none shadow-lg hover:shadow-xl transition-all duration-300">
                          {contact.action}
                        </Button>
                      </a>
                    ) : (
                      <p className={`font-bold text-base sm:text-lg bg-gradient-to-r ${contact.color} bg-clip-text text-transparent`}>
                        {contact.action}
                      </p>
                    )}

                    <div className={`absolute bottom-0 left-0 h-1 bg-gradient-to-r ${contact.color} transition-all duration-500 rounded-full ${isActive ? 'w-full' : 'w-0 group-hover:w-full'}`} />
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

        <div className="absolute top-10 left-10 w-16 sm:w-20 h-16 sm:h-20 bg-white/10 rounded-full animate-pulse"></div>
        <div className="absolute bottom-10 right-10 w-24 sm:w-32 h-24 sm:h-32 bg-white/10 rounded-full animate-pulse" style={{ animationDelay: '1s' }}></div>

        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <div className={`transition-all duration-1000 transform ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
            <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-4 sm:mb-6 text-white drop-shadow-2xl px-4">
              Experience the Steamer Difference
            </h2>
            <p className="text-base sm:text-lg md:text-xl lg:text-2xl mb-8 sm:mb-10 text-white/95 max-w-2xl mx-auto px-4">
              Join thousands of satisfied customers and get your first order 50% off!
            </p>
            <Link to="/customer/book-slot">
              <Button className="bg-white text-blue-600 hover:bg-blue-50 text-base sm:text-lg md:text-xl px-8 sm:px-10 py-4 sm:py-5 md:py-6 rounded-xl sm:rounded-2xl shadow-2xl hover:shadow-white/20 transition-all duration-500 hover:scale-105 font-bold">
                Book Your First Order
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;