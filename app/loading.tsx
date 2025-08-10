'use client';

export default function Loading() {
  return (
    <div className="min-h-[400px] flex items-center justify-center">
      <div className="space-y-4 text-center animate-pulse">
        <div className="w-20 h-20 rounded-xl bg-primary/5 mx-auto flex items-center justify-center">
          <div className="w-8 h-8 rounded-lg bg-primary/10" />
        </div>
        <div className="space-y-2">
          <div className="h-4 w-32 bg-muted rounded-md mx-auto" />
          <div className="h-3 w-48 bg-muted rounded-md mx-auto" />
        </div>
      </div>
    </div>
  );
}
