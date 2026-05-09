export function getRequiredEnv(name: "NEXTAUTH_URL" | "NEXTAUTH_SECRET"): string {
  const value = process.env[name];

  if (!value || !value.trim()) {
    throw new Error(`Missing required environment variable: ${name}`);
  }

  return value;
}

export const authEnv = {
  NEXTAUTH_URL: getRequiredEnv("NEXTAUTH_URL"),
  NEXTAUTH_SECRET: getRequiredEnv("NEXTAUTH_SECRET"),
};
