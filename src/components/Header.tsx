import { Button } from '../components/ui/button';
import { Shirt, Menu, X, UserCircle } from 'lucide-react';
import { useContext, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { SteamContext } from '../hooks/steamcontext';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();
  const steamcontext = useContext(SteamContext)

  const { User, isLoading } = steamcontext

  const isActive = (path: string) => location.pathname === path;

  const isAdmin = window.location.pathname.startsWith('/admin')
  const isAgent = window.location.pathname.startsWith('/agent')
  const isAnalyse = window.location.pathname === '/agent/analysis'

  return (
    <header className="bg-background border-b border-border sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between 
        h-[64px]">
          {/* Logo */}
         <Link to={User?.isagent ? '/agent/home' : "/"} className="flex items-center space-x-2">
  <img 
    src='/assets/logo.png'
    alt="Logo"
    className='w-44 h-16 object-contain' // Adjust height to match header
  />
</Link>

          {/* Desktop Navigation */}

          {
            !isAdmin && !isAgent  && !User?.isagent &&
            <nav className="hidden md:flex items-center space-x-8">
              <Link
                to="/"
                className={`font-semibold transition-colors hover:text-primary ${isActive('/') ? 'text-primary' : 'text-foreground'
                  }`}
              >
                Home
              </Link>
              <Link
                to="/services"
                className={`font-semibold 
                transition-colors hover:text-primary
                 ${isActive('/services') ? 'text-primary' :
                    'text-foreground'
                  }`}
              >
                Services
              </Link>
              <Link
                to="/about"
                className={`font-semibold transition-colors hover:text-primary ${isActive('/about') ? 'text-primary' : 'text-foreground'
                  }`}
              >
                About
              </Link>
              <Link
                to="/contact"
                className={`font-semibold transition-colors hover:text-primary ${isActive('/contact') ? 'text-primary' : 'text-foreground'
                  }`}
              >
                Contact
              </Link>
            </nav>
          }

          {/* Desktop Actions */}
          {

            !isAdmin ? <div className="hidden md:flex items-center space-x-4">

              {
                User && !User?.isagent &&
                <Link to={User ? '/customer/book-slot' : '/select-role'}>
                  <Button className="btn-hero">Book Now</Button>
                </Link>
              }

              {
                User?.isagent && <Link to={isAnalyse ? '/agent/home' : '/agent/analysis'}>
                  <Button className="btn-hero min-w-32">
                    {isAnalyse ? "Home" : "Agent Analysis"}</Button>
                </Link>
              }
              {
                !User?.isagent ? <Link to="/customer/ordertrack">
                  <Button variant="outline">Track Order</Button>
                </Link>
                  : <Link to="/agent/agent-orders">
                    <Button variant="outline">Agent Orders</Button>
                  </Link>
              }
              {
                !User ? <Link to={User ? '/customer/book-slot' : '/select-role'}>
                  <Button className="btn-hero">Book Now</Button>
                </Link> :
                  <Link to={User?.isagent ? "/agent/profile" : "/customer/profile"}>
                    <UserCircle
                      className="w-8 h-8 animate-pulse cursor-pointer  text-primary"
                    />
                  </Link>
              }
            </div> :
              <div className='w-32 py-1 rounded-full items-center 
               px-2 flex justify-around
               border-2 border-primary'>
                <UserCircle
                  className="w-8 h-8 animate-pulse cursor-pointer  text-primary"
                />
                <span className="text-lg font-bold text-primary">admin</span>
              </div>


          }

          {/* Mobile Menu Button */}
          {
            !isAdmin && <button
              className="md:hidden p-2"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>
          }
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && !isAdmin  && (
          <div className="md:hidden py-4 border-t border-border">
            {
              !isAgent ? 
              <nav className="flex flex-col space-y-4">
              <Link
                to="/"
                className={`font-medium transition-colors hover:text-primary ${isActive('/') ? 'text-primary' : 'text-foreground'
                  }`}
                onClick={() => setIsMenuOpen(false)}
              >
                Home
              </Link>
              <Link
                to="/services"
                className={`font-medium transition-colors hover:text-primary ${isActive('/services') ? 'text-primary' : 'text-foreground'
                  }`}
                onClick={() => setIsMenuOpen(false)}
              >
                Services
              </Link>
              <Link
                to="/about"
                className={`font-medium transition-colors hover:text-primary ${isActive('/about') ? 'text-primary' : 'text-foreground'
                  }`}
                onClick={() => setIsMenuOpen(false)}
              >
                About
              </Link>
              <Link
                to="/contact"
                className={`font-medium transition-colors hover:text-primary ${isActive('/contact') ? 'text-primary' : 'text-foreground'
                  }`}
                onClick={() => setIsMenuOpen(false)}
              >
                Contact
              </Link>
              <Link
                to="/customer/profile"
                className={`font-medium transition-colors hover:text-primary ${isActive('/contact') ? 'text-primary' : 'text-foreground'
                  }`}
                onClick={() => setIsMenuOpen(false)}
              >
                Profile
              </Link>
              <div className="flex flex-col space-y-2 pt-4">
                <Link to="/customer/ordertrack" onClick={() => setIsMenuOpen(false)}>
                  <Button variant="outline" className="w-full">Track Order</Button>
                </Link>
                {

                  <Link to={User ? '/customer/book-slot' : '/select-role'} onClick={() => setIsMenuOpen(false)}>
                    <Button className="btn-hero w-full">Book Now</Button>
                  </Link>
                }
              </div>
            </nav>  : <nav className="flex flex-col space-y-4">
              <Link
                to="/agent/home"
                className={`font-medium transition-colors hover:text-primary ${isActive('/') ? 'text-primary' : 'text-foreground'
                  }`}
                onClick={() => setIsMenuOpen(false)}
              >
                Home
              </Link>
              <Link
                to="/agent/profile"
                className={`font-medium transition-colors hover:text-primary ${isActive('/contact') ? 'text-primary' : 'text-foreground'
                  }`}
                onClick={() => setIsMenuOpen(false)}
              >
                Profile
              </Link>
              <div className="flex flex-col space-y-2 pt-4">
                <Link to="/agent/analysis" 
                onClick={() => setIsMenuOpen(false)}>
                  <Button variant="outline" 
                  className="w-full">Agent Analysis</Button>
                </Link>
                {

                  <Link to={ '/agent/agent-orders'} onClick={() => setIsMenuOpen(false)}>
                    <Button className="btn-hero w-full">
                      Agent Orders</Button>
                  </Link>
                }
              </div>
            </nav>
            }
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;