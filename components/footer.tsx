'use client';

export function Footer() {
  return (
    <footer className="border-t-2 border-border py-4 mt-auto bg-background/95 backdrop-blur-lg neo-shadow-sm">
      <div className="container max-w-5xl mx-auto px-4">
        <div className="flex flex-col items-center gap-2">
          <div className="text-center text-xs text-muted-foreground">
            <span className="font-semibold">© {new Date().getFullYear()} Burikin</span>
            <span className="mx-1.5">•</span>
            <span className="font-medium">Made with</span>
            <span className="mx-1 text-red-500">❤️</span>
            <span className="font-medium">by</span>
            <a 
              href="https://rendiichtiar.com"
              target="_blank"
              rel="noopener noreferrer"
              className="ml-1 font-semibold hover:text-primary transition-all duration-200 hover:-translate-x-0.5 hover:-translate-y-0.5"
            >
              rendiichtiar
            </a>
          </div>
          <div className="text-[10px] text-muted-foreground/80 font-medium">
            v0.1.0-beta
          </div>
        </div>
      </div>
    </footer>
  );
}
