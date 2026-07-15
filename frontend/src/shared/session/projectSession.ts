const SESSION_PREFIX = 'arch-decisions:';

function collectSessionKeys(): string[] {
    const keys: string[] = [];

    for (let index = 0; index < sessionStorage.length; index += 1) {
        const key = sessionStorage.key(index);
        if (key?.startsWith(SESSION_PREFIX)) {
            keys.push(key);
        }
    }

    return keys;
}

export function hasProjectSession(): boolean {
    return collectSessionKeys().length > 0;
}

export function clearProjectSession(): void {
    for (const key of collectSessionKeys()) {
        sessionStorage.removeItem(key);
    }
}
