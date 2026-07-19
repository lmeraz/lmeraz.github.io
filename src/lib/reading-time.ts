export function readingTimeMinutes(body: string | undefined): number {
  const words = body?.trim().split(/\s+/).length ?? 0;
  return Math.max(1, Math.ceil(words / 200));
}
