import { Button } from '../../components/ui/button';
import {
  Clock,
  Star,
  MapPin,
  Users,
  CheckCircle,
  Truck,
  Shirt,
  Gift,
  VolumeX,
  Volume
} from 'lucide-react';
import { Link } from 'react-router-dom';
import heroImage from '@/assets/hero-steamer.jpg';
import { useContext, useEffect, useRef, useState } from 'react';
import { SteamContext } from '../../hooks/steamcontext';
import HowItWorks from '../../components/howitwork';
import TestimonialsSection from '../../components/userreviews';
import CarouselHeroSection from '../../components/herosection';
import { API_URL } from '../../hooks/tools';

const Home = () => {
  const steamcontext = useContext(SteamContext);
  const { User, isLoading } = steamcontext;

  const [videoUrl, setVideoUrl] = useState('');

   const [isMuted, setIsMuted] = useState(true); // start muted
  const videoRef = useRef(null);

  const toggleMute = () => {
    setIsMuted(!isMuted);
    if (videoRef.current) {
      videoRef.current.muted = !videoRef.current.muted;
    }
  };

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

  return (
    <div className="min-h-screen">
      <CarouselHeroSection User={User} />

      {/* Stats Section */}
      <section className="py-16 bg-secondary/30">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="text-3xl lg:text-4xl font-bold text-primary mb-2">
                300+
              </div>
              <div className="text-muted-foreground">Happy Customers</div>
            </div>
            <div className="text-center">
              <div className="text-3xl lg:text-4xl font-bold text-primary mb-2">
                3hrs
              </div>
              <div className="text-muted-foreground">Fast Delivery</div>
            </div>
            <div className="text-center">
              <div className="text-3xl lg:text-4xl font-bold text-primary mb-2">
                6+
              </div>
              <div className="text-muted-foreground">Service Areas</div>
            </div>
            <div className="text-center">
              <div className="text-3xl lg:text-4xl font-bold text-primary mb-2">
                4.8★
              </div>
              <div className="text-muted-foreground">Customer Rating</div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <HowItWorks />

      {/* Service Areas */}
      <section className="py-20 bg-secondary/30">
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
                {[
                  'West Tambaram',
                  'East Tambaram',
                  'Selaiyur',
                  'New Perungalathur',
                  'Chitlapakkam',
                ].map((area) => (
                  <div key={area} className="flex items-center space-x-2">
                    <CheckCircle className="w-5 h-5 text-success" />
                    <span>{area}</span>
                  </div>
                ))}
              </div>

              <Link to="/customer/book-slot">
                <Button className="btn-hero">Check Service in Your Area</Button>
              </Link>
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
            max-h-[500px]
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

      {/* Reviews */}
      <TestimonialsSection />
    </div>
  );
};

export default Home;
