import * as fc from "fast-check";
import { checkEmail } from "../index.js";

// A simple interface defining what a Chaos Rule looks like
export interface ChaosRule {
  featureName: string;
  garbageGenerator: fc.Arbitrary<any>;
  executeTarget: (input: any) => { isValid: boolean; errors?: any[] };
}

// THE REGISTRY: Contributors just add one object here!
export const registry: ChaosRule[] = [
  {
    featureName: "Email Validator",
    // Generate strings that explicitly DO NOT contain '@'
    garbageGenerator: fc.string().filter((str) => !str.includes("@")),
    // Point it to your logic
    executeTarget: (input) => checkEmail(input).execute(),
  },
];
