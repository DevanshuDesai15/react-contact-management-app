import { describe, it, expect } from 'vitest';

describe('Simple Test', () => {
    it('should pass a basic test', () => {
        expect(1 + 1).toBe(2);
    });

    it('should verify testing environment works', () => {
        expect(typeof window).toBe('object');
        expect(typeof document).toBe('object');
    });
}); 