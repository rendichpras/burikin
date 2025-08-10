type RateLimitEntry = {
  count: number;
  timestamp: number;
};

class RateLimit {
  private cache: Map<string, RateLimitEntry>;
  private readonly window: number; // dalam detik
  private readonly limit: number;

  constructor(limit = 10, window = 60) {
    this.cache = new Map();
    this.window = window * 1000; // konversi ke milidetik
    this.limit = limit;

    // Bersihkan cache setiap menit
    setInterval(() => this.cleanup(), 60 * 1000);
  }

  check(ip: string): { success: boolean; remaining: number } {
    const now = Date.now();
    const entry = this.cache.get(ip);

    // Hapus entry yang sudah expired
    if (entry && now - entry.timestamp >= this.window) {
      this.cache.delete(ip);
    }

    // Jika tidak ada entry atau sudah expired, buat entry baru
    if (!this.cache.has(ip)) {
      this.cache.set(ip, { count: 1, timestamp: now });
      return { success: true, remaining: this.limit - 1 };
    }

    // Update count untuk entry yang ada
    const currentEntry = this.cache.get(ip)!;
    const newCount = currentEntry.count + 1;
    this.cache.set(ip, { count: newCount, timestamp: currentEntry.timestamp });

    return {
      success: newCount <= this.limit,
      remaining: Math.max(0, this.limit - newCount)
    };
  }

  private cleanup() {
    const now = Date.now();
    for (const [ip, entry] of this.cache.entries()) {
      if (now - entry.timestamp >= this.window) {
        this.cache.delete(ip);
      }
    }
  }
}

// Singleton instance
export const rateLimit = new RateLimit();