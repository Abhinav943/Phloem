import disposableDomains from "../data/disposable.json" with { type: "json" };
import rolePrefixes from "../data/roles.json" with { type: "json" };

export const isDisposable = (domain: string): boolean => {
  return disposableDomains.includes(domain.toLowerCase());
};

export const isRoleBased = (localPart: string): boolean => {
  return rolePrefixes.includes(localPart.toLowerCase());
};
