import { describe, it, expect } from "vitest";
import * as fc from "fast-check";
import { registry } from "./fuzzer-registry.js";

describe("Automated Chaos Engine", () => {
  registry.forEach((rule) => {
    it(`should gracefully reject garbage for: ${rule.featureName}`, () => {
      fc.assert(
        fc.property(rule.garbageGenerator, (garbageInput) => {
          const result = rule.executeTarget(garbageInput);

          expect(result.isValid).toBe(false);
          expect(result.errors).toBeDefined();
        }),
        { numRuns: 1000 },
      );
    });
  });
});
