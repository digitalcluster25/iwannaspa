import { Link } from 'react-router-dom';
import { Droplets } from 'lucide-react';

export function Header() {
  return (
    <header className="sticky top-0 z-50 flex items-center justify-center mt-2 md:mt-4">
      <div className="
        flex items-center justify-between
        bg-gradient-to-b from-white/90 via-gray-50/90 to-white/90
        dark:from-zinc-900/90 dark:via-zinc-800/90 dark:to-zinc-900/90
        shadow-[0_2px_20px_-2px_rgba(0,0,0,0.1)]
        backdrop-blur-md
        border 
        border-[rgba(230,230,230,0.7)] dark:border-[rgba(70,70,70,0.7)]
        w-auto
        rounded-full
        px-6 py-2
        transition-all duration-300 ease-in-out
      ">
        <div className="flex items-center gap-6">
          <Link to="/" className="flex items-center gap-2">
            <Droplets className="h-6 w-6 text-primary" />
            <span className="font-semibold text-foreground">Iwanna</span>
          </Link>
          
          <span className="text-zinc-300 dark:text-zinc-700">|</span>
          
          <Link 
            to="/catalog" 
            className="text-sm transition-colors text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100"
          >
            Каталог СПА
          </Link>
        </div>
      </div>
    </header>
  );
}
