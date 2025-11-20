import { Button } from "../components/ui/button";
import { useNavigate } from "react-router-dom";

interface AboutSectionProps {
  title: string;
  description: string[];
  videoUrl: string;
}

export const AboutSection = ({ title, description, videoUrl }: AboutSectionProps) => {
  const navigate = useNavigate();

  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left Side - Text Content */}
          <div className="space-y-6">
            <h1 className="text-4xl md:text-5xl font-black text-gray-900 leading-tight">
              {title}
            </h1>
            
            <div className="space-y-4 text-lg text-gray-700 leading-relaxed">
              {description.map((paragraph, index) => (
                <p key={index}>{paragraph}</p>
              ))}
            </div>

            <Button 
              size="lg" 
              className="bg-[#081748] text-white hover:bg-blue-800 font-bold px-8 py-6 text-lg transition-all"
              onClick={() => navigate('/about')}
            >
              Read More About Us
            </Button>
          </div>

          {/* Right Side - Video */}
          <div className="relative">
            <div className="aspect-video bg-gray-200 rounded-2xl shadow-2xl overflow-hidden border-2 border-gray-300">
              <iframe
                className="w-full h-full"
                src={videoUrl}
                title="YouTube video player"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              ></iframe>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};