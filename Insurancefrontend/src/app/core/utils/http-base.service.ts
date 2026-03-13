import { Injectable } from '@angular/core';
import { HttpParams } from '@angular/common/http';
import { environment } from '../../../environments/environment';

@Injectable({
    providedIn: 'root'
})
export class HttpBaseService {
    constructor() { }

    /**
     * Builds the full API URL based on the environment's base URL and the provided path.
     * @param path The API endpoint path, e.g., '/Auth/login' or 'Auth/login'
     * @returns The combined URL string.
     */
    buildUrl(path: string): string {
        const cleanPath = path.startsWith('/') ? path.substring(1) : path;
        const baseUrl = environment.apiBaseUrl.endsWith('/')
            ? environment.apiBaseUrl.substring(0, environment.apiBaseUrl.length - 1)
            : environment.apiBaseUrl;

        return `${baseUrl}/${cleanPath}`;
    }

    /**
     * Converts a generic object to Angular's HttpParams.
     * Useful for GET requests.
     * @param obj Key-value pairs to encode as query parameters.
     * @returns An HttpParams instance.
     */
    toHttpParams(obj: any): HttpParams {
        let params = new HttpParams();
        if (!obj) return params;

        Object.keys(obj).forEach(key => {
            const value = obj[key];
            if (value !== null && value !== undefined) {
                params = params.append(key, value.toString());
            }
        });

        return params;
    }
}
