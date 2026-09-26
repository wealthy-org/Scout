export type RequestPriority = 'foreground' | 'background';

export interface QueueOptions {
  intervalMs?: number;
  maxRetries?: number;
  initialBackoffMs?: number;
  timeoutMs?: number;
}

interface QueueItem<T> {
  task: () => Promise<T>;
  priority: RequestPriority;
  resolve: (value: T) => void;
  reject: (reason?: unknown) => void;
}

export class RequestQueue {
  private foregroundQueue: QueueItem<unknown>[] = [];
  private backgroundQueue: QueueItem<unknown>[] = [];
  private running = false;
  private intervalMs: number;
  private maxRetries: number;
  private initialBackoffMs: number;
  private timeoutMs: number;

  constructor(options: QueueOptions = {}) {
    this.intervalMs = options.intervalMs ?? 50;
    this.maxRetries = options.maxRetries ?? 4;
    this.initialBackoffMs = options.initialBackoffMs ?? 300;
    this.timeoutMs = options.timeoutMs ?? 30_000;
  }

  public enqueue<T>(task: () => Promise<T>, priority: RequestPriority = 'background'): Promise<T> {
    return new Promise<T>((resolve, reject) => {
      const item: QueueItem<T> = {
        task,
        priority,
        resolve,
        reject,
      };

      if (priority === 'foreground') {
        this.foregroundQueue.push(item as unknown as QueueItem<unknown>);
      } else {
        this.backgroundQueue.push(item as unknown as QueueItem<unknown>);
      }

      this.process();
    });
  }

  private async process(): Promise<void> {
    if (this.running) {
      return;
    }
    this.running = true;

    while (this.foregroundQueue.length > 0 || this.backgroundQueue.length > 0) {
      const item = this.foregroundQueue.length > 0
        ? this.foregroundQueue.shift()!
        : this.backgroundQueue.shift()!;

      try {
        const result = await this.executeWithTimeoutAndRetry(item.task);
        item.resolve(result);
      } catch (err) {
        item.reject(err);
      }

      if (this.intervalMs > 0 && (this.foregroundQueue.length > 0 || this.backgroundQueue.length > 0)) {
        await new Promise((resolve) => setTimeout(resolve, this.intervalMs));
      }
    }

    this.running = false;
  }

  private async executeWithTimeoutAndRetry<T>(task: () => Promise<T>): Promise<T> {
    let attempt = 0;
    while (true) {
      try {
        return await this.executeWithTimeout(task);
      } catch (err: unknown) {
        if (this.isRateLimitError(err) && attempt < this.maxRetries) {
          attempt++;
          const backoff = this.initialBackoffMs * (2 ** (attempt - 1));
          const jitter = Math.random() * (backoff * 0.2);
          await new Promise((resolve) => setTimeout(resolve, backoff + jitter));
          continue;
        }
        throw err;
      }
    }
  }

  private executeWithTimeout<T>(task: () => Promise<T>): Promise<T> {
    let timer: NodeJS.Timeout | undefined;
    const timeoutPromise = new Promise<never>((_, reject) => {
      timer = setTimeout(() => {
        reject(new Error(`Request timeout after ${this.timeoutMs}ms`));
      }, this.timeoutMs);
    });

    return Promise.race([
      task(),
      timeoutPromise,
    ]).finally(() => {
      if (timer) {
        clearTimeout(timer);
      }
    });
  }

  private isRateLimitError(err: unknown): boolean {
    if (!err) {
      return false;
    }
    const message = typeof err === 'object' && 'message' in err && typeof err.message === 'string'
      ? err.message
      : String(err);
    const status = typeof err === 'object' && 'status' in err ? Number(err.status) : 0;
    return status === 429 || /429|rate limit|too many requests/i.test(message);
  }
}

export const rpcQueue = new RequestQueue();
