import { Button } from '../components/ui/button';
import { Shirt, Menu, X, UserCircle, Sparkles, Crown, Star, Gem, Rocket, Zap, Award, Target, Package } from 'lucide-react';
import { useContext, useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { SteamContext } from '../hooks/steamcontext';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [hoverSubscription, setHoverSubscription] = useState(false);
  const location = useLocation();
  const steamcontext = useContext(SteamContext)

  const { User, isLoading } = steamcontext

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const isActive = (path: string) => location.pathname === path;

  const isAdmin = window.location.pathname.startsWith('/admin')
  const isAgent = window.location.pathname.startsWith('/agent')
  const isAnalyse = window.location.pathname === '/agent/analysis'

  return (
    <header 
      className={`bg-background border-border sticky top-0 z-50 transition-all duration-300 ${
        isScrolled ? 'bg-background/95 backdrop-blur-md shadow-lg' : 'bg-background border-b'
      }`}
    >
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-[70px] md:h-[80px] transition-all duration-300">
          {/* Logo with subtle animation */}
          <Link 
            to={User?.isagent ? '/agent/home' : "/"} 
            className="flex items-center space-x-2 group"
          >
            <div className="relative">
              <div className="absolute inset-0 bg-primary/20 rounded-full blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <img 
                src='/assets/logo.png'
                alt="Logo"
                className='w-44 h-16 object-contain relative transform group-hover:scale-105 transition-transform duration-300'
              />
            </div>
          </Link>

          {/* Desktop Navigation */}
          {
            !isAdmin && !isAgent && !User?.isagent &&
            <nav className="hidden md:flex items-center justify-center flex-1 mx-8 space-x-1 lg:space-x-2">
              {[
                { path: '/', label: 'Home' },
                { path: '/services', label: 'Services' },
                { path: '/subscription', label: 'Subscription', isSpecial: true },
                { path: '/about', label: 'About' },
                { path: '/contact', label: 'Contact' },
              ].map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`relative px-4 py-2 font-semibold transition-all duration-300 rounded-lg group flex items-center justify-center min-w-[90px] text-center ${
                    isActive(item.path) 
                      ? 'text-primary' 
                      : 'text-foreground hover:text-primary'
                  }`}
                  onMouseEnter={() => item.isSpecial && setHoverSubscription(true)}
                  onMouseLeave={() => item.isSpecial && setHoverSubscription(false)}
                >
                  {item.isSpecial ? (
                    <span className="relative z-10 flex items-center justify-center gap-2 w-full">
                      <span className="flex items-center justify-center">
                        {hoverSubscription ? (
                          <Sparkles className="w-4 h-4 animate-spin-slow" />
                        ) : (
                          <Crown className="w-4 h-4" />
                        )}
                      </span>
                      <span className="text-center">{item.label}</span>
                      <span className="flex items-center gap-1">
                        <span className="relative flex h-2 w-2">
                          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                          <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
                        </span>
                      </span>
                    </span>
                  ) : (
                    <span className="text-center w-full">{item.label}</span>
                  )}
                  
                  {/* Animated background gradient for subscription */}
                  {item.isSpecial && (
                    <div className={`absolute inset-0 bg-gradient-to-r from-primary/10 via-purple-500/10 to-pink-500/10 transition-all duration-500 rounded-lg ${
                      hoverSubscription ? 'opacity-100 scale-100' : 'opacity-0 scale-90'
                    }`}></div>
                  )}
                  
                  {/* Animated border for subscription */}
                  {item.isSpecial && (
                    <div className={`absolute inset-0 border border-primary/20 rounded-lg transition-all duration-300 ${
                      hoverSubscription ? 'scale-100 opacity-100' : 'scale-90 opacity-0'
                    }`}></div>
                  )}
                  
                  {/* Bottom underline for all menu items */}
                  <span className={`absolute bottom-0 left-1/2 transform -translate-x-1/2 w-0 h-0.5 bg-gradient-to-r from-primary to-purple-600 transition-all duration-300 group-hover:w-full ${
                    isActive(item.path) ? 'w-full' : ''
                  }`}></span>
                </Link>
              ))}   
            </nav>
          }

          {/* Desktop Actions */}
          {
            !isAdmin ? (
              <div className="hidden md:flex items-center space-x-3">
                {User && !User?.isagent && (
                  <Link to={User ? '/customer/book-slot' : '/select-role'}>
                    <Button className="btn-hero relative group overflow-hidden">
                      <span className="relative z-10 flex items-center gap-2">
                        <Zap className="w-4 h-4 group-hover:rotate-12 transition-transform duration-300" />
                        Book Now
                      </span>
                      <span className="absolute inset-0 bg-gradient-to-r from-primary to-purple-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
                    </Button>
                  </Link>
                )}

                {User?.isagent && (
                  <Link to={isAnalyse ? '/agent/home' : '/agent/analysis'}>
                    <Button className="btn-hero min-w-32 relative group overflow-hidden">
                      <span className="relative z-10 flex items-center gap-2">
                        {isAnalyse ? (
                          <>
                            <Rocket className="w-4 h-4 group-hover:-translate-y-1 transition-transform duration-300" />
                            Home
                          </>
                        ) : (
                          <>
                            <Target className="w-4 h-4 group-hover:scale-110 transition-transform duration-300" />
                            Agent Analysis
                          </>
                        )}
                      </span>
                    </Button>
                  </Link>
                )}

                {!User?.isagent ? (
                  <Link to="/customer/ordertrack">
                    <Button 
                      variant="outline" 
                      className="relative group overflow-hidden border-2 hover:border-primary/50 transition-all duration-300"
                    >
                      <span className="relative z-10 flex items-center gap-2">
                        <Shirt className="w-4 h-4 group-hover:rotate-12 transition-transform duration-300" />
                        Track Order
                      </span>
                    </Button>
                  </Link>
                ) : (
                  <Link to="/agent/agent-orders">
                    <Button 
                      variant="outline" 
                      className="relative group overflow-hidden border-2 hover:border-primary/50 transition-all duration-300"
                    >
                      <span className="relative z-10 flex items-center gap-2">
                        <Package className="w-4 h-4 group-hover:scale-110 transition-transform duration-300" />
                        Agent Orders
                      </span>
                    </Button>
                  </Link>
                )}

                {!User ? (
                  <Link to="/select-role">
                    <Button className="btn-hero relative group overflow-hidden">
                      <span className="relative z-10 flex items-center gap-2">
                        <UserCircle className="w-4 h-4 group-hover:scale-110 transition-transform duration-300" />
                        Sign In
                      </span>
                    </Button>
                  </Link>
                ) : (
                  <Link to={User?.isagent ? "/agent/profile" : "/customer/profile"}>
                    <div className="relative group">
                      <div className="absolute inset-0 bg-gradient-to-r from-primary to-purple-600 rounded-full blur-lg opacity-0 group-hover:opacity-50 transition-opacity duration-300"></div>
                      <UserCircle className="w-10 h-10 cursor-pointer text-primary transform group-hover:scale-110 transition-all duration-300 group-hover:rotate-6" />
                    </div>
                  </Link>
                )}
              </div>
            ) : (
              <div className="w-32 py-1 rounded-full items-center px-2 flex justify-around border-2 border-primary bg-primary/5 hover:bg-primary/10 transition-all duration-300">
                <UserCircle className="w-8 h-8 animate-pulse cursor-pointer text-primary" />
                <span className="text-lg font-bold text-primary">admin</span>
              </div>
            )
          }

          {/* Mobile Menu Button */}
          {
            !isAdmin && (
              <button
                className="md:hidden p-2 relative group"
                onClick={() => setIsMenuOpen(!isMenuOpen)}
              >
                <div className={`absolute inset-0 bg-primary/10 rounded-lg transition-all duration-300 ${
                  isMenuOpen ? 'opacity-100 scale-100' : 'opacity-0 scale-90'
                }`}></div>
                {isMenuOpen ? (
                  <X className="h-6 w-6 relative z-10 transform rotate-90 transition-transform duration-300" />
                ) : (
                  <Menu className="h-6 w-6 relative z-10 transform group-hover:scale-110 transition-transform duration-300" />
                )}
              </button>
            )
          }
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && !isAdmin && (
          <div className="md:hidden py-4 border-t border-border animate-slide-down">
            {!isAgent ? (
              <nav className="flex flex-col space-y-2">
                {[
                  { path: '/', label: 'Home', icon: '🏠' },
                  { path: '/services', label: 'Services', icon: '🧺' },
                  { path: '/about', label: 'About', icon: '📖' },
                  { path: '/subscription', label: 'Subscription', icon: '👑' },
                  { path: '/contact', label: 'Contact', icon: '📞' },
                  { path: '/customer/profile', label: 'Profile', icon: '👤' },
                ].map((item, index) => (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={`font-medium transition-all duration-300 px-4 py-3 rounded-lg hover:bg-primary/5 ${
                      isActive(item.path) 
                        ? 'text-primary bg-primary/10' 
                        : 'text-foreground'
                    }`}
                    onClick={() => setIsMenuOpen(false)}
                    style={{ animationDelay: `${index * 50}ms` }}
                  >
                    <span className="flex items-center gap-3">
                      {item.label === 'Subscription' ? (
                        <>
                          <Sparkles className="w-4 h-4 text-primary animate-sparkle" />
                          <span className="font-bold">{item.label}</span>
                          <span className="ml-auto text-xs bg-primary/20 text-primary px-2 py-1 rounded-full">
                            New
                          </span>
                        </>
                      ) : (
                        item.label
                      )}
                    </span>
                  </Link>
                ))}

                <div className="flex flex-col space-y-2 pt-4">
                  <Link to="/customer/ordertrack" onClick={() => setIsMenuOpen(false)}>
                    <Button variant="outline" className="w-full group">
                      <span className="flex items-center justify-center gap-2">
                        <Shirt className="w-4 h-4 group-hover:rotate-12 transition-transform duration-300" />
                        Track Order
                      </span>
                    </Button>
                  </Link>
                  <Link to={User ? '/customer/book-slot' : '/select-role'} onClick={() => setIsMenuOpen(false)}>
                    <Button className="btn-hero w-full group relative overflow-hidden">
                      <span className="relative z-10 flex items-center justify-center gap-2">
                        <Zap className="w-4 h-4 group-hover:rotate-12 transition-transform duration-300" />
                        Book Now
                      </span>
                    </Button>
                  </Link>
                </div>
              </nav>
            ) : (
              <nav className="flex flex-col space-y-2">
                <Link
                  to="/agent/home"
                  className={`font-medium transition-all duration-300 px-4 py-3 rounded-lg hover:bg-primary/5 ${
                    isActive('/') ? 'text-primary bg-primary/10' : 'text-foreground'
                  }`}
                  onClick={() => setIsMenuOpen(false)}
                >
                  <span className="flex items-center gap-3">
                    Home
                  </span>
                </Link>
                <Link
                  to="/agent/profile"
                  className={`font-medium transition-all duration-300 px-4 py-3 rounded-lg hover:bg-primary/5 ${
                    isActive('/contact') ? 'text-primary bg-primary/10' : 'text-foreground'
                  }`}
                  onClick={() => setIsMenuOpen(false)}
                >
                  <span className="flex items-center gap-3">
                    Profile
                  </span>
                </Link>
                <div className="flex flex-col space-y-2 pt-4">
                  <Link to="/agent/analysis" onClick={() => setIsMenuOpen(false)}>
                    <Button variant="outline" className="w-full group">
                      <span className="flex items-center justify-center gap-2">
                        <Target className="w-4 h-4 group-hover:scale-110 transition-transform duration-300" />
                        Agent Analysis
                      </span>
                    </Button>
                  </Link>
                  <Link to="/agent/agent-orders" onClick={() => setIsMenuOpen(false)}>
                    <Button className="btn-hero w-full group">
                      <span className="flex items-center justify-center gap-2">
                        <Package className="w-4 h-4 group-hover:scale-110 transition-transform duration-300" />
                        Agent Orders
                      </span>
                    </Button>
                  </Link>
                </div>
              </nav>
            )}
          </div>
        )}
      </div>

      <style jsx>{`
        @keyframes slide-down {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        .animate-slide-down {
          animation: slide-down 0.3s ease-out;
        }
        
        @keyframes gradient-x {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }
        
        .animate-gradient-x {
          background-size: 200% 200%;
          animation: gradient-x 3s ease infinite;
        }
        
        @keyframes bounce-subtle {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-2px); }
        }
        
        .animate-bounce-subtle {
          animation: bounce-subtle 2s ease infinite;
        }
        
        @keyframes sparkle {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.5; transform: scale(1.2); }
        }
        
        .animate-sparkle {
          animation: sparkle 1.5s ease infinite;
        }
        
        @keyframes spin-slow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        
        .animate-spin-slow {
          animation: spin-slow 3s linear infinite;
        }
      `}</style>
    </header>
  );
};

export default Header;