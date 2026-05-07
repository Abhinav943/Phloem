export const normalizeEmail = (email: string): string => {
  const trimmed = email.trim();
  const parts = trimmed.split("@");

  if (parts.length !== 2) return trimmed;

  const localPart = parts[0]!;
  const domainPart = parts[1]!.toLowerCase();

  return `${localPart}@${domainPart}`;
};
