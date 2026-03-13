/**
 * Standard error response structure expected from the backend.
 * Example: { "error": "message", "status": 400 }
 */
export interface ApiErrorResponse {
    error: string;
    status: number;
}
