import { checkIP } from './src/ip.js';

// ── IPv4 private (should flag as not public) ──────────────────────────────────
const private4 = checkIP('192.168.1.1')
  .isIPv4()
  // .isIPv6()
  .isPublic() // Optional bonus feature!
  .execute();

console.log('192.168.1.1 →', private4);

// ── IPv4 public ───────────────────────────────────────────────────────────────
const public4 = checkIP('8.8.8.8')
  .isIPv4()
  .isPublic()
  .execute();

console.log('8.8.8.8     →', public4);

// ── IPv6 loopback (private) ───────────────────────────────────────────────────
const loopback6 = checkIP('::1')
  // .isIPv4()
  .isIPv6()
  .isPublic()
  .execute();

console.log('::1         →', loopback6);

// ── IPv6 public ───────────────────────────────────────────────────────────────
const public6 = checkIP('2001:4860:4860::8888')
  .isIPv6()
  .isPublic()
  .execute();

console.log('2001:4860:: →', public6);
