import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { User, Truck } from 'lucide-react';
import { Link } from 'react-router-dom';

const BookingSelection = () => {
  return (
    <div className="min-h-screen bg-secondary/20 py-20">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-3xl lg:text-4xl font-bold text-foreground mb-4">
              Choose Your Role
            </h1>
            <p className="text-xl text-muted-foreground">
              Are you booking a service or joining as a delivery partner?
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Customer Option */}
            <Card className="card-service text-center p-8 hover:shadow-lg transition-all duration-300">
              <div className="bg-primary/10 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
                <User className="w-10 h-10 text-primary" />
              </div>
              <h2 className="text-2xl font-bold text-foreground mb-4">Customer</h2>
              <p className="text-muted-foreground mb-8">
                Book professional steaming services for your clothes. Quick, convenient, and reliable.
              </p>
              
              <div className="space-y-3 mb-8 text-left">
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-primary rounded-full"></div>
                  <span className="text-sm text-muted-foreground">3-hour delivery service</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-primary rounded-full"></div>
                  <span className="text-sm text-muted-foreground">Professional pressing & steaming</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-primary rounded-full"></div>
                  <span className="text-sm text-muted-foreground">Doorstep pickup & delivery</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-primary rounded-full"></div>
                  <span className="text-sm text-muted-foreground">Professional packaging</span>
                </div>
              </div>

              <div className="space-y-3">
                <Link to="/customer/register" className="block">
                  <Button className="btn-hero w-full">Sign Up as Customer</Button>
                </Link>
                <Link to="/customer/login" className="block">
                  <Button variant="outline" className="btn-secondary w-full">
                    Already have an account? Sign In
                  </Button>
                </Link>
              </div>
            </Card>

            {/* Delivery Agent Option */}
            <Card className="card-service text-center p-8 hover:shadow-lg transition-all duration-300">
              <div className="bg-success/10 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
                <Truck className="w-10 h-10 text-success" />
              </div>
              <h2 className="text-2xl font-bold text-foreground mb-4">Delivery Agent</h2>
              <p className="text-muted-foreground mb-8">
                Join our delivery team and earn money by providing pickup and delivery services.
              </p>
              
              <div className="space-y-3 mb-8 text-left">
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-success rounded-full"></div>
                  <span className="text-sm text-muted-foreground">Flexible working hours</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-success rounded-full"></div>
                  <span className="text-sm text-muted-foreground">Competitive earnings</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-success rounded-full"></div>
                  <span className="text-sm text-muted-foreground">Weekly payments</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-success rounded-full"></div>
                  <span className="text-sm text-muted-foreground">Support & training</span>
                </div>
              </div>

              <div className="space-y-3">
                <Link to="/agent/register" className="block">
                  <Button className="bg-success hover:bg-success/90 text-success-foreground w-full">
                    Join as Delivery Agent
                  </Button>
                </Link>
                <Link to="/agent/login" className="block">
                  <Button variant="outline" className="btn-secondary w-full">
                    Already registered? Sign In
                  </Button>
                </Link>
              </div>
            </Card>
          </div>

          <div className="text-center mt-12">
            <p className="text-muted-foreground">
              Need help? <Link to="/contact" className="text-primary hover:underline">Contact our support team</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookingSelection;