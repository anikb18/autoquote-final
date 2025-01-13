import VehiclePreferenceForm from "./VehiclePreferenceForm";

const Hero = () => {
  return (
    <div className="relative min-h-[80vh] flex items-center justify-center bg-gradient-to-br from-primary to-primary/90 overflow-hidden">
      <div className="absolute inset-0 bg-[url('/car-pattern.png')] opacity-10" />
      
      <div className="container mx-auto px-4 py-12 flex flex-col lg:flex-row items-center justify-between gap-12">
        <div className="flex-1 text-white space-y-6 animate-fade-in">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight">
            Find Your Dream Car at the Best Price
          </h1>
          <p className="text-lg md:text-xl text-white/80 max-w-xl">
            Connect with trusted dealers and get competitive quotes. No hassle, no pressure.
          </p>
          <div className="flex gap-4">
            <div className="flex items-center gap-2">
              <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center">
                <span className="text-2xl font-bold">1k+</span>
              </div>
              <p className="text-sm">Trusted Dealers</p>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center">
                <span className="text-2xl font-bold">50k+</span>
              </div>
              <p className="text-sm">Happy Customers</p>
            </div>
          </div>
        </div>
        
        <div className="flex-1 w-full max-w-md animate-fade-in">
          <VehiclePreferenceForm />
        </div>
      </div>
    </div>
  );
};

export default Hero;