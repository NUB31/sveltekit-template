export type ErrorOrT<T> = { error: string; data: null } | { error: null; data: T };
