type RateLimitEntry = {
  count: number;
  timestamp: number;
};

class RateLimit {
  private cache: Map<string, RateLimitEntry>;
  private readonly window: number; // dalam detik
  private readonly limit: number;
  protected activeProcesses: number = 0;
  private readonly maxProcesses: number = 10; // Maksimum proses bersamaan

  constructor(limit = 10, window = 60) {
    this.cache = new Map();
    this.window = window * 1000; // konversi ke milidetik
    this.limit = limit;

    // Bersihkan cache setiap menit
    setInterval(() => this.cleanup(), 60 * 1000);
  }

  check(ip: string | null): { success: boolean; remaining: number; serverBusy?: boolean } {
    // Cek apakah server sibuk
    if (this.activeProcesses >= this.maxProcesses) {
      return { success: false, remaining: 0, serverBusy: true };
    }
    // Jika IP tidak valid, izinkan request tapi catat sebagai 'unknown'
    const safeIp = ip || 'unknown';
    const now = Date.now();
    const entry = this.cache.get(safeIp);

    // Hapus entry yang sudah expired
    if (entry && now - entry.timestamp >= this.window) {
      this.cache.delete(safeIp);
    }

    // Jika tidak ada entry atau sudah expired, buat entry baru
    if (!this.cache.has(safeIp)) {
      this.cache.set(safeIp, { count: 1, timestamp: now });
      return { success: true, remaining: this.limit - 1 };
    }

    // Update count untuk entry yang ada
    const currentEntry = this.cache.get(safeIp)!;
    const newCount = currentEntry.count + 1;
    this.cache.set(safeIp, { count: newCount, timestamp: currentEntry.timestamp });

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
type ProcessEntry = {
  id: number;
  startTime: number;
  timeout: NodeJS.Timeout;
};

interface QueueStatus {
  activeProcesses: number;
  estimatedWaitTime: number; // dalam detik
  position?: number; // posisi dalam antrian
}

class ProcessTracker extends RateLimit {
  getStatus(): QueueStatus {
    return {
      activeProcesses: this.activeProcesses,
      estimatedWaitTime: Math.ceil(this.activeProcesses * 30), // Estimasi 30 detik per proses
    };
  }
  private processes: Map<number, ProcessEntry> = new Map();
  private nextProcessId: number = 1;
  private readonly maxProcessTime: number = 15 * 60 * 1000; // 15 menit

  startProcess(): number {
    // Bersihkan proses yang timeout
    this.cleanupStaleProcesses();

    const processId = this.nextProcessId++;
    const startTime = Date.now();

    // Set timeout untuk auto-cleanup
    const timeout = setTimeout(() => {
      this.endProcess(processId);
    }, this.maxProcessTime);

    this.processes.set(processId, {
      id: processId,
      startTime,
      timeout
    });

    this.activeProcesses++;
    return processId;
  }

  endProcess(processId: number) {
    const process = this.processes.get(processId);
    if (process) {
      clearTimeout(process.timeout);
      this.processes.delete(processId);
      
      if (this.activeProcesses > 0) {
        this.activeProcesses--;
      }
    }
  }

  private cleanupStaleProcesses() {
    const now = Date.now();
    for (const [id, process] of this.processes.entries()) {
      if (now - process.startTime >= this.maxProcessTime) {
        this.endProcess(id);
      }
    }
  }
}

export const rateLimit = new ProcessTracker();