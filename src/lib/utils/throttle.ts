// src/lib/utils/throttle.ts

/**
 * throttle()
 * ------------------------------------------------------------------
 * Limits how often a function can run.
 *
 * Used for:
 * - Live transcription typing
 * - Preventing excessive database writes
 * - Maintaining a smooth, lag-free UI
 *
 * Behavior:
 * - Runs immediately on first call (leading edge)
 * - Guarantees the last call runs (trailing edge)
 */

export function throttle<T extends unknown[]>(
  func: (...args: T) => void,
  limit: number // milliseconds (e.g., 300–500)
): (...args: T) => void {
  let inThrottle = false;        // Are we currently throttling?
  let lastArgs: T | null = null; // Stores the latest call during throttle

  return (...args: T) => {
    // If throttled, save the latest arguments and exit
    if (inThrottle) {
      lastArgs = args;
      return;
    }

    // Run immediately (leading edge)
    func(...args);
    inThrottle = true;

    // After the limit expires, allow execution again
    setTimeout(() => {
      inThrottle = false;

      // Run the most recent call (trailing edge)
      if (lastArgs) {
        func(...lastArgs);
        lastArgs = null;
      }
    }, limit);
  };
}
