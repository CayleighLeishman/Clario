// src/lib/utils/debounce.ts

/* ============================================================
   DEBOUNCE UTILITY
   ------------------------------------------------------------
   Delays execution until the user stops triggering the function
   for a specified amount of time.

   Used for:
   - typing
   - resize events
   - live transcription pauses
   ============================================================ */

export function debounce<T extends (arg: string) => void>(
  fn: T,
  delay = 500
) {
  let timeout: ReturnType<typeof setTimeout>;

  return (arg: string) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => {
      fn(arg);
    }, delay);
  };
}
