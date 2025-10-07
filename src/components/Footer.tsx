import { Shirt, Phone, Mail, MapPin, Clock } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useContext } from 'react'
import { SteamContext } from '../hooks/steamcontext';

const Footer = () => {
  const steamcontext = useContext(SteamContext)

  const { User, isLoading } = steamcontext
  return (
    <footer className="bg-secondary/50 border-t border-border">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="space-y-4">
            <Link to="/" className="flex items-center space-x-2">
              <div className="bg-primary p-2 rounded-lg">
                <Shirt className="h-6 w-6 text-primary-foreground" />
              </div>
              <span className="text-2xl font-bold text-primary">Steamer</span>
            </Link>
            <p className="text-muted-foreground">
              Your clothes, perfectly pressed and delivered fast. Professional steaming service at your doorstep.
            </p>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            {
              !User?.isagent &&
              <>
                <h3 className="text-lg font-semibold text-foreground">Quick Links</h3>
                <nav className="flex flex-col space-y-2">
                  <Link to="/" className="text-muted-foreground hover:text-primary transition-colors">
                    Home
                  </Link>
                  <Link to="/services" className="text-muted-foreground hover:text-primary transition-colors">
                    Services
                  </Link>
                  <Link to="/book" className="text-muted-foreground hover:text-primary transition-colors">
                    Book Now
                  </Link>
                  <Link to="/track" className="text-muted-foreground hover:text-primary transition-colors">
                    Track Order
                  </Link>
                  <Link to="/about" className="text-muted-foreground hover:text-primary transition-colors">
                    About Us
                  </Link>
                </nav>
              </>
            }
          </div>

          {/* Contact Info */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-foreground">Contact Info</h3>
            <div className="space-y-3">
              <div className="flex items-center space-x-3 text-muted-foreground">
                <Phone className="h-4 w-4 text-primary" />
                <span>+91 98765 43210</span>
              </div>
              <div className="flex items-center space-x-3 text-muted-foreground">
                <Mail className="h-4 w-4 text-primary" />
                <span>support@steamer.com</span>
              </div>
              <div className="flex items-center space-x-3 text-muted-foreground">
                <MapPin className="h-4 w-4 text-primary" />
                <span>West Tambaram, Chennai</span>
              </div>
              <div className="flex items-center space-x-3 text-muted-foreground">
                <Clock className="h-4 w-4 text-primary" />
                <span>8 AM - 8 PM Daily</span>
              </div>
            </div>
          </div>

          {/* Service Areas */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-foreground">Service Areas</h3>
            <div className="space-y-2 text-muted-foreground text-sm">
              <p>• West Tambaram</p>
              <p>• East Tambaram</p>
              <p>• Selaiyur</p>
              <p>• New Perungalathur</p>
              <p>• Chitlapakkam</p>
              <p>• Pallikaranai</p>
            </div>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t border-border">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <p className="text-muted-foreground text-sm">
              © 2024 Steamer. All rights reserved.
            </p>
            <div className="flex space-x-6 text-sm">
              <Link to="/privacy" className="text-muted-foreground hover:text-primary transition-colors">
                Privacy Policy
              </Link>
              <Link to="/terms" className="text-muted-foreground hover:text-primary transition-colors">
                Terms of Service
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;