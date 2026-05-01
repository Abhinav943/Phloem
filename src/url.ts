import dns from "dns/promises";

export interface URLError {
  type: string;
  message: string;
}

export class URLValidator {
  private urlString: string;
  private parsedUrl: URL | null = null;
  private errors: URLError[] = [];
  private asyncTasks: (() => Promise<void>)[] = [];

  constructor(url: string) {
    this.urlString = url.trim();
  }

  isValid(customMessage?: string) {
    try {
      this.parsedUrl = new URL(this.urlString);
    } catch (e) {
      this.errors.push({
        type: "invalid_url",
        message:
          customMessage ||
          `The string '${this.urlString}' is not a properly formatted URL.`,
      });
    }
    return this;
  }

  requireHTTPS(customMessage?: string) {
    if (this.parsedUrl && this.parsedUrl.protocol !== "https:") {
      this.errors.push({
        type: "insecure_protocol",
        message: customMessage || `The URL must use the secure HTTPS protocol.`,
      });
    }
    return this;
  }

  allowedDomains(domains: string[], customMessage?: string) {
    if (this.parsedUrl) {
      const hostname = this.parsedUrl.hostname.replace(/^www\./, "");
      if (!domains.includes(hostname)) {
        this.errors.push({
          type: "domain_not_allowed",
          message:
            customMessage ||
            `The domain '${hostname}' is not in the allowed list.`,
        });
      }
    }
    return this;
  }

  checkDNS(customMessage?: string) {
    this.asyncTasks.push(async () => {
      if (this.parsedUrl) {
        try {
          await dns.lookup(this.parsedUrl.hostname);
        } catch (error) {
          this.errors.push({
            type: "dns_resolution_error",
            message:
              customMessage ||
              `The host '${this.parsedUrl.hostname}' could not be found on the network.`,
          });
        }
      }
    });
    return this;
  }

  execute() {
    if (this.asyncTasks.length > 0) {
      console.warn(
        "Warning: You queued async checks but called execute(). Use executeAsync().",
      );
    }
    return {
      isValid: this.errors.length === 0,
      url: this.parsedUrl ? this.parsedUrl.href : this.urlString,
      errors: this.errors,
    };
  }

  async executeAsync() {
    if (this.parsedUrl) {
      for (const task of this.asyncTasks) {
        await task();
      }
    }
    this.asyncTasks = [];

    return this.execute();
  }
}

export const checkURL = (url: string) => new URLValidator(url);
