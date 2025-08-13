'use client';

import { ThemeToggle } from "@/components/theme-toggle";
import Link from "next/link";

export function Navbar() {
  return (
    <nav className="border-b-2 border-border bg-background/95 backdrop-blur-lg sticky top-0 z-50 neo-shadow-sm">
      <div className="container max-w-5xl mx-auto px-4 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 transition-all duration-200 hover:-translate-x-0.5 hover:-translate-y-0.5">     
          <div className="font-bold text-lg">
            <span className="text-primary">Burikin</span>
            <span className="text-xs ml-1 text-muted-foreground font-medium">beta</span>
          </div>
        </Link>
        <div className="flex items-center gap-4">
          <ThemeToggle />
        </div>
      </div>
    </nav>  
  );
}
