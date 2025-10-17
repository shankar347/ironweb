import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Phone,
  Mail,
  MapPin,
  Clock,
  MessageCircle,
  Send,
  CheckCircle
} from 'lucide-react';
import { API_URL } from '../../hooks/tools';
import { toast } from 'react-toastify';

const Contact = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [activeCard, setActiveCard] = useState(0);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: ''
  });

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const contactMethods = [
    {
      icon: Phone,
      title: 'Phone Support',
      subtitle: 'Call us anytime',
      action: '+91  6383148182',
      color: 'from-blue-500 to-sky-400',
      delay: 0
    },
    {
      icon: Mail,
      title: 'Email Support',
      subtitle: '24/7 response',
      action: 'steemerservicescontactin@gmail.com',
      color: 'from-purple-500 to-pink-400',
      delay: 200
    },
    {
      icon: MessageCircle,
      title: 'WhatsApp',
      subtitle: 'Quick support',
      action: 'Chat Now',
      color: 'from-green-500 to-emerald-500',
      delay: 400,
      isButton: true
    },
    {
      icon: Clock,
      title: 'Service Hours',
      subtitle: 'Daily service',
      action: '8 AM - 8 PM',
      color: 'from-orange-500 to-amber-400',
      delay: 600
    }
  ];

  const serviceAreas = [
  "east tambaram",
  "west tambaram",
  "krishna nagar",
  "new perungalathur",
  "old perungalathur"
];

  const faqs = [
    {
      question: 'What are your pickup hours?',
      answer: 'We offer pickup and delivery from 8 AM to 8 PM daily.'
    },
    {
      question: 'How long does it take?',
      answer: 'We deliver your clothes within 3 hours of pickup.'
    },
    {
      question: 'What areas do you cover?',
      answer: 'Currently serving West Tambaram and nearby areas.'
    }
  ];

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    const res = await fetch(`${API_URL}/user/enquery`, {
      method: 'POST',
      headers: {
        'content-type': 'application/json'
      },
      body: JSON.stringify(formData),
      credentials: 'include',
    })

    const data = await res.json()

    if (data?.error) {
      return toast.error(data?.error)
    }

    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      toast.success(data?.message);
      setFormData({
        name: '',
        email: '',
        phone: '',
        subject: '',
        message: ''
      });
    }, 2000);
  };


  return (
    <div className="min-h-screen bg-gradient-to-br
     from-slate-50 via-white to-blue-50">
      {/* Hero Section */}
      <section className="relative py-16 sm:py-20 md:py-24 
      bg-gradient-to-br
from-blue-400 via-blue-700 to-sky-500
      overflow-hidden">
        {/* Animated Background Elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-20 left-10 w-48 sm:w-72 h-48 sm:h-72 bg-blue-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse"></div>
          <div className="absolute top-40 right-10 w-64 sm:w-96 h-64 sm:h-96 bg-purple-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse" style={{ animationDelay: '1s' }}></div>
          <div className="absolute -bottom-20 left-1/2 w-64 sm:w-96 h-64 sm:h-96 bg-pink-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse" style={{ animationDelay: '2s' }}></div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className={`text-center mb-12 sm:mb-16 transition-all duration-1000 transform ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
            <h1 className="text-4xl sm:text-5xl  text-white
            md:text-6xl font-bold bg-gradient-to-r from-slate-900 via-blue-900 to-slate-900 bg-clip-text text-transparent mb-4 sm:mb-6 px-2">
              Get in Touch
            </h1>
            <p className="text-lg sm:text-xl text-white text-slate-600 max-w-2xl mx-auto px-4">
              Have questions? Need support? We're here to help you 24/7
            </p>
          </div>
        </div>
      </section>

      {/* Contact Methods Grid */}
      <section className="relative py-12 sm:py-16 md:py-20 bg-gradient-to-br from-slate-50 via-white to-blue-50 overflow-hidden">
        {/* Background Elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-1/4 left-1/4 w-48 sm:w-64 h-48 sm:h-64 bg-blue-100 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-pulse"></div>
          <div className="absolute bottom-1/4 right-1/4 w-48 sm:w-64 h-48 sm:h-64 bg-purple-100 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-pulse" style={{ animationDelay: '1.5s' }}></div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8 mb-12 sm:mb-16">
            {contactMethods.map((method, index) => {
              const Icon = method.icon;
              const isActive = activeCard === index;

              return (
                <div
                  key={index}
                  className={`relative group cursor-pointer transition-all duration-700 transform ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-20 opacity-0'}`}
                  style={{ transitionDelay: `${method.delay}ms` }}
                  onMouseEnter={() => setActiveCard(index)}
                  onClick={() => {
                    if (method.title === 'WhatsApp') {
                      window.open('https://wa.me/6383148182', '_blank');
                    } else if (method.title === 'Phone Support') {
                      window.open('tel:+919876543210');
                    } else if (method.title === 'Email Support') {
                      window.location.href = 'mailto:support@steamer.com';
                    }
                  }}
                >
                  {/* Connecting Line for Desktop */}
                  {index < 3 && (
                    <div className="hidden lg:block absolute top-16 left-full w-full h-0.5 bg-gradient-to-r from-slate-300 to-transparent -z-10">
                      <div
                        className={`h-full bg-gradient-to-r ${method.color} transition-all duration-1000 ${activeCard >= index ? 'w-full' : 'w-0'}`}
                      />
                    </div>
                  )}

                  {/* Card */}
                  <div className={`relative bg-white rounded-2xl p-6 sm:p-8 shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 border-2 ${isActive ? 'border-blue-400 scale-105' : 'border-transparent'
                    }`}>
                    {/* Number Badge */}
                    <div className="absolute -top-4 -right-4 w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-slate-800 to-slate-600 rounded-full flex items-center justify-center text-white font-bold text-base sm:text-lg shadow-xl">
                      {index + 1}
                    </div>

                    {/* Icon Container */}
                    <div className={`relative w-16 h-16 sm:w-20 sm:h-20 mb-4 sm:mb-6 mx-auto rounded-2xl bg-gradient-to-br ${method.color} p-0.5 transition-all duration-500 ${isActive ? 'scale-110 rotate-6' : ''
                      }`}>
                      <div className="w-full h-full bg-white rounded-2xl flex items-center justify-center">
                        <Icon className={`w-8 h-8 sm:w-10 sm:h-10 text-slate-700 transition-all duration-500 ${isActive ? 'scale-110' : ''
                          }`} />
                      </div>
                    </div>

                    {/* Content */}
                    <h3 className="text-lg sm:text-xl font-bold text-slate-900 mb-2 text-center group-hover:text-blue-600 transition-colors">
                      {method.title}
                    </h3>
                    <p className="text-sm sm:text-base text-slate-600 mb-3 sm:mb-4 text-center">
                      {method.subtitle}
                    </p>

                    {method.isButton ? (
                      <Button className={`w-full bg-gradient-to-r ${method.color} hover:opacity-90 text-white font-semibold py-2 sm:py-3 rounded-lg shadow-lg transform transition-all duration-300 hover:scale-105`}>
                        {method.action}
                      </Button>
                    ) : (
                      <p className="text-sm sm:text-base font-semibold text-slate-700 text-center break-words">
                        {method.action}
                      </p>
                    )}

                    {/* Hover Effect Line */}
                    <div className={`absolute bottom-0 left-0 h-1 bg-gradient-to-r ${method.color} transition-all duration-500 rounded-b-2xl ${isActive ? 'w-full' : 'w-0 group-hover:w-full'
                      }`} />
                  </div>
                </div>
              );
            })}
          </div>

          {/* Contact Form & Info Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
            {/* Contact Form */}
            <div className={`transition-all duration-1000 transform ${isVisible ? 'translate-x-0 opacity-100' : '-translate-x-20 opacity-0'}`}>
              <div className="relative bg-white rounded-2xl p-6 sm:p-8 shadow-lg hover:shadow-2xl transition-all duration-500 border-2 border-transparent hover:border-blue-200">
                <div className="mb-6 sm:mb-8">
                  <h2 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-slate-900 via-blue-900 to-slate-900 bg-clip-text text-transparent mb-2 sm:mb-3">
                    Send us a Message
                  </h2>
                  <p className="text-sm sm:text-base text-slate-600">
                    We'll get back to you within 24 hours
                  </p>
                </div>

                <div className="space-y-4 sm:space-y-6">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="name" className="text-sm sm:text-base font-semibold text-slate-700">
                        Name *
                      </Label>
                      <Input
                        id="name"
                        name="name"
                        type="text"
                        placeholder="Your full name"
                        value={formData.name}
                        onChange={handleInputChange}
                        className="border-2 border-slate-200 focus:border-blue-500 rounded-lg transition-all duration-300 p-2 sm:p-3"
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="phone" className="text-sm sm:text-base font-semibold text-slate-700">
                        Phone
                      </Label>
                      <Input
                        id="phone"
                        name="phone"
                        type="tel"
                        placeholder="+91 98765 43210"
                        value={formData.phone}
                        onChange={handleInputChange}
                        className="border-2 border-slate-200 focus:border-blue-500 rounded-lg transition-all duration-300 p-2 sm:p-3"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email" className="text-sm sm:text-base font-semibold text-slate-700">
                      Email *
                    </Label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      placeholder="your.email@example.com"
                      value={formData.email}
                      onChange={handleInputChange}
                      className="border-2 border-slate-200 focus:border-blue-500 rounded-lg transition-all duration-300 p-2 sm:p-3"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="subject" className="text-sm sm:text-base font-semibold text-slate-700">
                      Subject *
                    </Label>
                    <Input
                      id="subject"
                      name="subject"
                      type="text"
                      placeholder="What's this about?"
                      value={formData.subject}
                      onChange={handleInputChange}
                      className="border-2 border-slate-200 focus:border-blue-500 rounded-lg transition-all duration-300 p-2 sm:p-3"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="message" className="text-sm sm:text-base font-semibold text-slate-700">
                      Message *
                    </Label>
                    <Textarea
                      id="message"
                      name="message"
                      placeholder="Tell us how we can help you..."
                      className="min-h-[120px] sm:min-h-[150px] border-2 border-slate-200 focus:border-blue-500 rounded-lg transition-all duration-300 p-2 sm:p-3 resize-none"
                      value={formData.message}
                      onChange={handleInputChange}
                      required
                    />
                  </div>

                  <Button
                    onClick={handleSubmit}
                    className="w-full bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 text-white font-semibold py-3 sm:py-4 rounded-lg shadow-lg transform transition-all duration-300 hover:scale-105 hover:-translate-y-1 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 disabled:hover:translate-y-0 text-sm sm:text-base"
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <span className="flex items-center justify-center">
                        <svg className="animate-spin h-5 w-5 mr-3" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                        </svg>
                        Sending...
                      </span>
                    ) : (
                      <span className="flex items-center justify-center">
                        <Send className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
                        Send Message
                      </span>
                    )}
                  </Button>
                </div>

                {/* Bottom Gradient Line */}
                <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 to-purple-500 rounded-b-2xl"></div>
              </div>
            </div>

            {/* Additional Information */}
            <div className={`space-y-6 sm:space-y-8 transition-all duration-1000 transform ${isVisible ? 'translate-x-0 opacity-100' : 'translate-x-20 opacity-0'}`}>
              {/* Service Areas */}
              <div className="relative bg-white rounded-2xl p-6 sm:p-8 shadow-lg hover:shadow-2xl transition-all duration-500 border-2 border-transparent hover:border-blue-200 group">
                <div className="flex items-start space-x-4">
                  <div className="relative w-14 h-14 sm:w-16 sm:h-16 rounded-xl bg-gradient-to-br from-blue-500 to-sky-400 p-0.5 flex-shrink-0 transition-all duration-500 group-hover:scale-110 group-hover:rotate-6">
                    <div className="w-full h-full bg-white rounded-xl flex items-center justify-center">
                      <MapPin className="w-7 h-7 sm:w-8 sm:h-8 text-slate-700" />
                    </div>
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg sm:text-xl font-bold text-slate-900 mb-2 sm:mb-3 group-hover:text-blue-600 transition-colors">
                      Service Areas
                    </h3>
                    <p className="text-sm sm:text-base text-slate-600 mb-3 sm:mb-4">
                      We currently serve these areas in Chennai:
                    </p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3">
                      {serviceAreas.map((area, index) => (
                        <div
                          key={index}
                          className="flex items-center space-x-2 text-sm sm:text-base text-slate-700 bg-gradient-to-r from-blue-50 to-sky-50 px-3 py-2 rounded-lg transform transition-all duration-300 hover:scale-105 hover:shadow-md"
                        >
                          <CheckCircle className="w-4 h-4 text-blue-600 flex-shrink-0" />
                          <span>{area}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
                {/* Hover Effect Line */}
                <div className="absolute bottom-0 left-0 h-1 bg-gradient-to-r from-blue-500 to-sky-400 transition-all duration-500 rounded-b-2xl w-0 group-hover:w-full" />
              </div>

              {/* Quick Support */}
              <div className="relative bg-white rounded-2xl p-6 sm:p-8 shadow-lg hover:shadow-2xl transition-all duration-500 border-2 border-transparent hover:border-green-200 group">
                <div className="flex items-start space-x-4">
                  <div className="relative w-14 h-14 sm:w-16 sm:h-16 rounded-xl bg-gradient-to-br from-green-500 to-emerald-500 p-0.5 flex-shrink-0 transition-all duration-500 group-hover:scale-110 group-hover:rotate-6">
                    <div className="w-full h-full bg-white rounded-xl flex items-center justify-center">
                      <MessageCircle className="w-7 h-7 sm:w-8 sm:h-8 text-slate-700" />
                    </div>
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg sm:text-xl font-bold text-slate-900 mb-2 sm:mb-3 group-hover:text-green-600 transition-colors">
                      Quick Support
                    </h3>
                    <p className="text-sm sm:text-base text-slate-600 mb-3 sm:mb-4">
                      For immediate assistance:
                    </p>
                    <div className="space-y-2 sm:space-y-3">
                      <Button
                        variant="outline"
                        className="w-full justify-start border-2 border-slate-200 hover:border-green-400 hover:bg-green-50 rounded-lg transition-all duration-300 transform hover:scale-105 hover:-translate-y-1 py-2 sm:py-3 text-sm sm:text-base"
                        onClick={() => window.open('https://wa.me/919876543210', '_blank')}
                      >
                        <MessageCircle className="w-4 h-4 sm:w-5 sm:h-5 mr-2 text-green-600" />
                        WhatsApp Support
                      </Button>
                      <Button
                        variant="outline"
                        className="w-full justify-start border-2 border-slate-200 hover:border-blue-400 hover:bg-blue-50 rounded-lg transition-all duration-300 transform hover:scale-105 hover:-translate-y-1 py-2 sm:py-3 text-sm sm:text-base"
                        onClick={() => window.open('tel:+919876543210')}
                      >
                        <Phone className="w-4 h-4 sm:w-5 sm:h-5 mr-2 text-blue-600" />
                        Call Support
                      </Button>
                    </div>
                  </div>
                </div>
                {/* Hover Effect Line */}
                <div className="absolute bottom-0 left-0 h-1 bg-gradient-to-r from-green-500 to-emerald-500 transition-all duration-500 rounded-b-2xl w-0 group-hover:w-full" />
              </div>

              {/* FAQs */}
              <div className="relative bg-white rounded-2xl p-6 sm:p-8 shadow-lg hover:shadow-2xl transition-all duration-500 border-2 border-transparent hover:border-purple-200 group">
                <h3 className="text-lg sm:text-xl font-bold text-slate-900 mb-4 sm:mb-6 group-hover:text-purple-600 transition-colors">
                  Frequently Asked Questions
                </h3>
                <div className="space-y-4 sm:space-y-5">
                  {faqs.map((faq, index) => (
                    <div
                      key={index}
                      className="relative bg-gradient-to-r from-slate-50 to-blue-50 p-4 sm:p-5 rounded-xl hover:shadow-md transition-all duration-300 transform hover:scale-102 hover:-translate-y-1 border border-slate-100"
                    >
                      <p className="font-semibold text-sm sm:text-base text-slate-900 mb-2">
                        {faq.question}
                      </p>
                      <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
                        {faq.answer}
                      </p>
                    </div>
                  ))}
                </div>
                {/* Hover Effect Line */}
                <div className="absolute bottom-0 left-0 h-1 bg-gradient-to-r from-purple-500 to-pink-500 transition-all duration-500 rounded-b-2xl w-0 group-hover:w-full" />
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Contact;