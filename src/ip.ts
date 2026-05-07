export interface IPError {
  type: string;
  message: string;
}

export interface IPResult {
  isValid: boolean;
  ip: string;
  version: "IPv4" | "IPv6" | "unknown";
  isPublic: boolean | null;
  errors: IPError[];
}

// ─── Private / Reserved Range Helpers ────────────────────────────────────────

function parseIPv4(ip: string): number[] | null {
  const parts = ip.split(".");
  if (parts.length !== 4) return null;
  const octets = parts.map(Number);
  if (octets.some((o) => isNaN(o) || o < 0 || o > 255)) return null;
  return octets;
}

function isPrivateIPv4(ip: string): boolean {
  const o = parseIPv4(ip);
  if (!o) return false;
  const [a, b] = o as [number, number, number, number];

  return (
    a === 10 ||                                      // 10.0.0.0/8
    (a === 172 && b >= 16 && b <= 31) ||             // 172.16.0.0/12
    (a === 192 && b === 168) ||                      // 192.168.0.0/16
    a === 127 ||                                     // 127.0.0.0/8  loopback
    (a === 169 && b === 254) ||                      // 169.254.0.0/16 link-local
    a === 0 ||                                       // 0.0.0.0/8
    (a === 100 && b >= 64 && b <= 127)               // 100.64.0.0/10 shared
  );
}

function expandIPv6(ip: string): string | null {
  try {
    // Use URL parsing trick to normalise the address
    const url = new URL(`http://[${ip}]`);
    return url.hostname.replace(/^\[|\]$/g, "");
  } catch {
    return null;
  }
}

function isPrivateIPv6(ip: string): boolean {
  const expanded = expandIPv6(ip);
  if (!expanded) return false;

  const lower = expanded.toLowerCase();

  if (lower === "::1" || lower === "0:0:0:0:0:0:0:1") return true; // loopback

  const firstByte = parseInt(lower.split(":")[0]!, 16);
  if ((firstByte & 0xfe00) === 0xfc00) return true;  // fc00::/7  unique-local
  if ((firstByte & 0xffc0) === 0xfe80) return true;  // fe80::/10 link-local

  return false;
}

// ─── Regex Patterns ───────────────────────────────────────────────────────────

const IPV4_REGEX =
  /^((25[0-5]|2[0-4]\d|1\d{2}|[1-9]\d|\d)\.){3}(25[0-5]|2[0-4]\d|1\d{2}|[1-9]\d|\d)$/;

// Accepts full, compressed, and mixed (IPv4-mapped) IPv6 forms
const IPV6_REGEX =
  /^(([0-9a-fA-F]{1,4}:){7}[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,7}:|([0-9a-fA-F]{1,4}:){1,6}:[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,5}(:[0-9a-fA-F]{1,4}){1,2}|([0-9a-fA-F]{1,4}:){1,4}(:[0-9a-fA-F]{1,4}){1,3}|([0-9a-fA-F]{1,4}:){1,3}(:[0-9a-fA-F]{1,4}){1,4}|([0-9a-fA-F]{1,4}:){1,2}(:[0-9a-fA-F]{1,4}){1,5}|[0-9a-fA-F]{1,4}:((:[0-9a-fA-F]{1,4}){1,6})|:((:[0-9a-fA-F]{1,4}){1,7}|:)|fe80:(:[0-9a-fA-F]{0,4}){0,4}%[0-9a-zA-Z]+|::(ffff(:0{1,4})?:)?((25[0-5]|(2[0-4]|1?\d)?\d)\.){3}(25[0-5]|(2[0-4]|1?\d)?\d)|([0-9a-fA-F]{1,4}:){1,4}:((25[0-5]|(2[0-4]|1?\d)?\d)\.){3}(25[0-5]|(2[0-4]|1?\d)?\d))$/;

// ─── Validator Class ──────────────────────────────────────────────────────────

export class IPValidator {
  private ip: string;
  private errors: IPError[] = [];
  private detectedVersion: "IPv4" | "IPv6" | "unknown" = "unknown";
  private publicStatus: boolean | null = null;

  constructor(ip: string) {
    this.ip = ip.trim();
    if (IPV4_REGEX.test(this.ip)) {
      this.detectedVersion = "IPv4";
    } else if (IPV6_REGEX.test(this.ip)) {
      this.detectedVersion = "IPv6";
    }
  }

  isIPv4(customMessage?: string) {
    if (this.detectedVersion !== "IPv4") {
      this.errors.push({
        type: "not_ipv4",
        message:
          customMessage ||
          `'${this.ip}' is not a valid IPv4 address.`,
      });
    }
    return this;
  }

  isIPv6(customMessage?: string) {
    if (this.detectedVersion !== "IPv6") {
      this.errors.push({
        type: "not_ipv6",
        message:
          customMessage ||
          `'${this.ip}' is not a valid IPv6 address.`,
      });
    }
    return this;
  }

  isPublic(customMessage?: string) {
    if (this.detectedVersion === "unknown") {
      this.errors.push({
        type: "invalid_ip",
        message: `'${this.ip}' is not a recognised IP address.`,
      });
      this.publicStatus = false;
      return this;
    }

    const private_ =
      this.detectedVersion === "IPv4"
        ? isPrivateIPv4(this.ip)
        : isPrivateIPv6(this.ip);

    this.publicStatus = !private_;

    if (private_) {
      this.errors.push({
        type: "private_ip",
        message:
          customMessage ||
          `'${this.ip}' is a private or reserved address and is not publicly routable.`,
      });
    }

    return this;
  }

  execute(): IPResult {
    return {
      isValid: this.errors.length === 0,
      ip: this.ip,
      version: this.detectedVersion,
      isPublic: this.publicStatus,
      errors: this.errors,
    };
  }
}

export const checkIP = (ip: string) => new IPValidator(ip);
