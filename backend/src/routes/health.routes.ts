import type {Express} from 'express';

export function registerHealthRoutes(app: Express): void {
  app.get('/health', (_request, response) => {
    response.json({status: 'ok', message: 'Architecture Decisions Platform API'});
  });
}
