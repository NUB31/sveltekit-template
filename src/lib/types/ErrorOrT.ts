export type ErrorOrT<T> = { error: Error; user: null } | { error: null; user: T };
