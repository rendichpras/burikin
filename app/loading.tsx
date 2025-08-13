'use client';

export default function Loading() {
  return (
    <div className="min-h-[400px] flex items-center justify-center">
      <div className="space-y-4 text-center animate-pulse">
        <div className="w-20 h-20 rounded-sm bg-primary/10 mx-auto flex items-center justify-center border-2 border-border shadow-[2px_2px_0px_0px_rgba(26,26,26,1)] dark:shadow-[2px_2px_0px_0px_rgba(255,255,255,1)]">
          <div className="w-8 h-8 rounded-sm bg-primary/20" />
        </div>
        <div className="space-y-2">
          <div className="h-4 w-32 bg-muted rounded-sm mx-auto" />
          <div className="h-3 w-48 bg-muted rounded-sm mx-auto" />
        </div>
      </div>
    </div>
  );
}
