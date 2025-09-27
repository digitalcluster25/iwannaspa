import { ReactNode } from 'react';
import { Footer } from './Footer';

interface PublicLayoutProps {
  children: ReactNode;
  showHeader?: boolean;
}

export function PublicLayout({ children, showHeader = true }: PublicLayoutProps) {
  return (
    <>
      {showHeader && (
        <header>
          {/* Header will be rendered by individual pages if needed */}
        </header>
      )}
      
      <main className="min-h-screen">
        {children}
      </main>
      
      <footer>
        <Footer />
      </footer>
    </>
  );
}
