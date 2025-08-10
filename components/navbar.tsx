'use client';

import { ThemeToggle } from "@/components/theme-toggle";
import Link from "next/link";

export function Navbar() {
  return (
    <nav className="border-b bg-background/50 backdrop-blur-lg sticky top-0 z-50">
      <div className="container max-w-5xl mx-auto px-4 h-14 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 transition-opacity hover:opacity-80">     
          <div className="font-semibold text-base">
            <span className="text-primary">Burikin</span>
            <span className="text-xs ml-1 text-muted-foreground">beta</span>
          </div>
        </Link>
        <div className="flex items-center gap-4">
          <ThemeToggle />
        </div>
      </div>
    </nav>  
  );
}
