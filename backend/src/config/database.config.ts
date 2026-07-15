import path from 'path';

export function getDatabasePath(): string {
  const configuredPath = process.env.DATABASE_PATH ?? './data/decisions.db';
  return path.resolve(configuredPath);
}
