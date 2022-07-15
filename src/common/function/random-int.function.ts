export function rndomInt(min, max): number {
  return Math.floor(Math.random() * (max - min)) + min;
}
