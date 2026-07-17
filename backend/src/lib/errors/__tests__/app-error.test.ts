import {describe, expect, it} from '@jest/globals';
import {AppError, BadRequestError, NotFoundError} from '@/lib/errors/app-error';

describe('AppError hierarchy', () => {
    it('exposes status codes for HTTP mapping', () => {
        // Arrange
        const badRequest = new BadRequestError('bad', ['x']);
        const notFound = new NotFoundError('missing');
        const appError = new AppError('boom', 418);

        // Act
        const badRequestStatus = badRequest.statusCode;
        const notFoundStatus = notFound.statusCode;
        const appErrorStatus = appError.statusCode;

        // Assert
        expect(badRequestStatus).toBe(400);
        expect(notFoundStatus).toBe(404);
        expect(appErrorStatus).toBe(418);
    });
});
