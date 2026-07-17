import {describe, expect, it} from 'vitest';
import {z} from 'zod';
import {HttpClientError, resolveSubmitError} from '../httpClient';

describe('resolveSubmitError', () => {
    it('returns friendly message for server errors', () => {
        // Arrange
        const error = new HttpClientError('Internal server error', 500);

        // Act
        const message = resolveSubmitError(error);

        // Assert
        expect(message).toBe('Server error. Please try again.');
    });

    it('returns backend message for client errors', () => {
        // Arrange
        const error = new HttpClientError('Invalid context: teamSize is required', 400);

        // Act
        const message = resolveSubmitError(error);

        // Assert
        expect(message).toBe('Invalid context: teamSize is required');
    });

    it('returns network message for fetch failures', () => {
        // Arrange
        const error = new TypeError('Failed to fetch');

        // Act
        const message = resolveSubmitError(error);

        // Assert
        expect(message).toBe('Could not reach the server. Check that backend is running.');
    });

    it('returns friendly message for invalid API response shape', () => {
        // Arrange
        const error = new z.ZodError([]);

        // Act
        const message = resolveSubmitError(error);

        // Assert
        expect(message).toBe('Received an invalid response from the server.');
    });

    it('returns cancel message for abort errors', () => {
        // Arrange
        const error = new DOMException('Aborted', 'AbortError');

        // Act
        const message = resolveSubmitError(error);

        // Assert
        expect(message).toBe('Request cancelled.');
    });
});
