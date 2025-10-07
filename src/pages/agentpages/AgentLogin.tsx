import { useContext, useState } from 'react';
import { Button } from '../../components/ui/button';
import { Card } from '../../components/ui/card';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { User, Mail, Lock } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from "react-toastify";
import { SteamContext } from '../../hooks/steamcontext';
import { API_URL } from '../../hooks/tools';

const AgentLogin = () => {
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate()


  const steamcontext = useContext(SteamContext)

  const { formData, setFormData, setUser } = steamcontext
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {


    e.preventDefault();
    setIsLoading(true);


    const res = await fetch(`${API_URL}/user/generatemailotp`, {
      method: 'POST',
      headers: {
        'content-type': 'application/json'
      },
      body: JSON.stringify({ formdata: formData, isagentlogin: true }),
      credentials: 'include',
    })

    const data = await res.json()

    if (data?.error) {
      setIsLoading(false)
      toast.error(data?.error)
      return
    }

    console.log(formData, 'hi')

    setUser(data?.data)

    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      toast.success(data?.message)
      navigate('/agent/emailotp')
    }, 2000);

  };

  return (
    <div className="min-h-screen bg-secondary/20 py-20">
      <div className="container mx-auto px-4">
        <div className="max-w-md mx-auto">
          <div className="text-center mb-8">
            <div className="bg-primary/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <User className="w-8 h-8 text-success" />
            </div>
            <h1 className="text-3xl font-bold text-foreground mb-2">Agent Sign In</h1>
            <p className="text-muted-foreground">Welcome back to Steamer</p>
          </div>

          <Card className="card-service p-8">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="email">Email Address</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="your.email@example.com"
                    className="pl-10"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                  />
                </div>
              </div>

              <Button
                type="submit"
                className=" bg-success 
                w-full mt-5 text-lg py-5
                hover:bg-success/90 "
                disabled={isLoading}
              >
                {isLoading ? 'Generating...' : 'Get OTP'}
              </Button>

              <div className="text-center">
                <p className="text-muted-foreground">
                  Don't have an account?{' '}
                  <Link to="/customer/register"
                    className="text-success hover:underline font-semibold">
                    Sign Up
                  </Link>
                </p>
              </div>
            </form>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default AgentLogin;