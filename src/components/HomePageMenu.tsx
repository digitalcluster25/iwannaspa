import { Link } from 'react-router-dom';
import { Droplets } from 'lucide-react';

export function HomePageMenu() {
  return (
    <div className="flex items-center justify-center py-4">
      <div className="
        flex items-center gap-6
        shadow-[0_2px_20px_-2px_rgba(0,0,0,0.1)]
        backdrop-blur-xl backdrop-saturate-150
        border border-[rgba(230,230,230,0.8)]
        bg-white/80
        rounded-full
        px-6 py-2
        transition-all duration-300
        relative
        overflow-hidden
      ">
        {/* Acrylic noise overlay - minimal */}
        <div className="absolute inset-0 opacity-[0.003] pointer-events-none"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
            backgroundSize: '200px 200px'
          }}
        />
        
        <Link to="/" className="flex items-center gap-2 relative z-10">
          <Droplets className="h-6 w-6 transition-colors text-primary" />
          <span className="font-semibold transition-colors text-foreground">Iwanna</span>
        </Link>
        
        <span className="transition-colors relative z-10 text-zinc-300">|</span>
        
        <Link 
          to="/catalog" 
          className="text-sm font-medium transition-colors relative z-10 text-zinc-600 hover:text-zinc-900"
        >
          Каталог СПА
        </Link>
      </div>
    </div>
  );
}
