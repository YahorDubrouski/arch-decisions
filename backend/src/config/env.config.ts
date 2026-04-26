export interface ServerConfig {
  port: number;
}

export function getServerConfig(): ServerConfig {
  const parsedPort = Number(process.env.PORT ?? '3000');
  return {
    port: Number.isFinite(parsedPort) && parsedPort > 0 ? parsedPort : 3000,
  };
}
