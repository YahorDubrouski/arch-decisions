export class AppError extends Error {
    constructor(
        message: string,
        public readonly statusCode: number,
        public readonly details?: unknown
    ) {
        super(message);
        this.name = 'AppError';
    }
}

export class BadRequestError extends AppError {
    constructor(message: string, details?: unknown) {
        super(message, 400, details);
        this.name = 'BadRequestError';
    }
}

export class NotFoundError extends AppError {
    constructor(message: string) {
        super(message, 404);
        this.name = 'NotFoundError';
    }
}

export class UpstreamServiceError extends AppError {
    constructor(message: string, details?: unknown) {
        super(message, 502, details);
        this.name = 'UpstreamServiceError';
    }
}
