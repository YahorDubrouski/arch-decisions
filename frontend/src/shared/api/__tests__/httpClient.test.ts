import {describe, expect, it} from 'vitest';
import {z} from 'zod';
import {HttpClientError, resolveSubmitError} from '../httpClient';

describe('resolveSubmitError', () => {
    it('returns friendly message for server errors', () => {
        const error = new HttpClientError('Internal server error', 500);

        expect(resolveSubmitError(error)).toBe('Server error. Please try again.');
    });

    it('returns backend message for client errors', () => {
        const error = new HttpClientError('Invalid context: teamSize is required', 400);

        expect(resolveSubmitError(error)).toBe('Invalid context: teamSize is required');
    });

    it('returns network message for fetch failures', () => {
        expect(resolveSubmitError(new TypeError('Failed to fetch'))).toBe(
            'Could not reach the server. Check that backend is running.'
        );
    });

    it('returns friendly message for invalid API response shape', () => {
        expect(resolveSubmitError(new z.ZodError([]))).toBe(
            'Received an invalid response from the server.'
        );
    });
});
